import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from risk_engine import RiskEngine
from diff_engine import compare_sboms
from parser import extract_and_parse
from database import engine, ScanReport, DiffReport, Vulnerability
from auth import router as auth_router
import io
import uuid
from packageurl import PackageURL

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")

@app.on_event("startup")
async def startup_db_check():
    try:
        await engine.client.admin.command("ping")
        print("✅ MongoDB connected")
        
        # Seed Vulnerabilities if collection is empty
        vuln_count = await engine.count(Vulnerability)
        if vuln_count == 0:
            print("🌱 Seeding Vulnerability Intelligence...")
            seed_data = [
                Vulnerability(name="log4j", cve="CVE-2021-44228", cvss=10.0, severity="CRITICAL", explanation="Log4j RCE (Log4Shell) allows full system takeover via crafted logs.", remediation="Upgrade to log4j-core version 2.17.1 or higher."),
                Vulnerability(name="lodash", cve="CVE-2020-8203", cvss=7.4, severity="HIGH", explanation="Prototype Pollution allows attackers to modify object properties globally.", remediation="Upgrade to lodash 4.17.21 or higher."),
                Vulnerability(name="react-native", cve="CVE-2023-38036", cvss=8.1, severity="HIGH", explanation="Insecure bridge communication may allow cross-process data leakage.", remediation="Update to React Native 0.72.4 or higher."),
                Vulnerability(name="spring-web", cve="CVE-2022-22965", cvss=9.8, severity="CRITICAL", explanation="Spring4Shell allows RCE via data binding on specific JDK versions.", remediation="Upgrade to Spring Framework 5.3.18 or higher."),
                Vulnerability(name="struts", cve="CVE-2017-5638", cvss=10.0, severity="CRITICAL", explanation="RCE via crafted Content-Type header in Jakarta Multipart parser.", remediation="Upgrade to Struts 2.3.32 or 2.5.10.1."),
                Vulnerability(name="openssl", cve="CVE-2014-0160", cvss=7.5, severity="HIGH", explanation="Heartbleed allows reading sensitive memory from the server.", remediation="Upgrade to OpenSSL 1.0.1g or higher.")
            ]
            for v in seed_data:
                await engine.save(v)
            print("✅ Seeding complete!")
            
    except Exception as e:
        print("❌ MongoDB connection or seeding failed:", e)

@app.post("/health")
async def health_check():
    return {"status": "ok", "message": "Verix SBOM Scanner API is healthy!"}




risk_engine = RiskEngine()


@app.post("/scan/code")
async def scan_code_zip(file: UploadFile = File(...), email: str = Form(...)): 
    content = await file.read()
    
    # 1. Parse Zip into Components
    components = await extract_and_parse(content)
    
    if not components:
        raise HTTPException(status_code=400, detail="No valid project manifests found (package.json or requirements.txt).")

    # 2. Risk Analysis (Multi-Component)
    report_data = await risk_engine.analyze_sbom(components)
    
    # 3. Save to DB
    report = ScanReport(
        user_email=email,
        project_name=file.filename,
        scan_type="single",
        risk_score=report_data["riskScore"],
        components=report_data["components"]
    )
    await engine.save(report)
    
    return {
        "reportId": str(report.id),
        "riskScore": report_data["riskScore"],
        "components": report_data["components"]
    }

@app.post("/scan/diff")
async def scan_diff_zips(file1: UploadFile = File(...), file2: UploadFile = File(...), email: str = Form(...)):
    # 1. Parse both
    comps1 = await extract_and_parse(await file1.read())
    comps2 = await extract_and_parse(await file2.read())
    
    if not comps1 or not comps2:
        raise HTTPException(status_code=400, detail="One or both zips have no valid dependency manifests.")

    # Flatten for global diff while keeping component info
    deps1 = []
    for c_name, c_data in comps1.items():
        for p in c_data['packages']: deps1.append({**p, "component": c_name})
        
    deps2 = []
    for c_name, c_data in comps2.items():
        for p in c_data['packages']: deps2.append({**p, "component": c_name})

    diff_result = compare_sboms(deps1, deps2)
    
    # 2. Add Risk Intelligence to the Diff results (Added and Updated)
    # Also get full analyzed components for visualization
    res1 = await risk_engine.analyze_sbom(comps1)
    res2 = await risk_engine.analyze_sbom(comps2)
    
    for pkg in diff_result['added']:
        risk = await risk_engine.calculate_risk_score(pkg)
        pkg.update(risk)
        
    for pkg in diff_result['updated']:
        new_pkg_data = next((p for p in deps2 if p['name'] == pkg['name']), {})
        risk = await risk_engine.calculate_risk_score(new_pkg_data)
        pkg.update(risk)
    
    # 3. Aggregated scores
    v1_total = res1["riskScore"]
    v2_total = res2["riskScore"]
    
    # 4. Save
    print(f"DEBUG: Saving DiffReport. v1_comps: {len(res1['components'])}, v2_comps: {len(res2['components'])}")
    report = DiffReport(
        user_email=email,
        project_name=f"{file1.filename} vs {file2.filename}",
        v1_score=v1_total,
        v2_score=v2_total,
        added=diff_result['added'],
        removed=diff_result['removed'],
        updated=diff_result['updated'],
        v1_components=res1["components"],
        v2_components=res2["components"]
    )
    await engine.save(report)
    print(f"DEBUG: DiffReport saved with ID: {report.id}")
    
    return {
        "reportId": str(report.id),
        "v1_score": v1_total,
        "v2_score": v2_total,
        "added": diff_result['added'],
        "removed": diff_result['removed'],
        "updated": diff_result['updated'],
        "v1_components": res1["components"],
        "v2_components": res2["components"]
    }
@app.get("/reports/history")
async def get_history(email: str):
    scans = await engine.find(ScanReport, ScanReport.user_email == email)
    diffs = await engine.find(DiffReport, DiffReport.user_email == email)
    
    # Sort and format
    history = []
    for s in scans:
        history.append({
            "id": str(s.id),
            "type": "single",
            "name": s.project_name,
            "score": s.risk_score,
            "date": s.created_at.isoformat(),
            "components": s.components or []
        })
    for d in diffs:
        history.append({
            "id": str(d.id),
            "type": "diff",
            "name": d.project_name,
            "score": d.v2_score or 0,
            "v1_score": d.v1_score or 0,
            "date": d.created_at.isoformat(),
            "added": d.added or [],
            "removed": d.removed or [],
            "updated": d.updated or []
        })
    
    return sorted(history, key=lambda x: x['date'], reverse=True)

@app.get("/reports/{report_id}")
async def get_report_details(report_id: str):
    from bson import ObjectId
    # Try ScanReport
    report = await engine.find_one(ScanReport, ScanReport.id == ObjectId(report_id))
    if report:
        return {
            "type": "single",
            "reportId": str(report.id),
            "projectName": report.project_name,
            "riskScore": report.risk_score,
            "components": report.components or [],
            "createdAt": report.created_at.isoformat()
        }
    
    # Try DiffReport
    report = await engine.find_one(DiffReport, DiffReport.id == ObjectId(report_id))
    if report:
        return {
            "type": "diff",
            "reportId": str(report.id),
            "projectName": report.project_name,
            "v1_score": report.v1_score or 0,
            "v2_score": report.v2_score or 0,
            "added": report.added or [],
            "removed": report.removed or [],
            "updated": report.updated or [],
            "v1_components": report.v1_components or [],
            "v2_components": report.v2_components or [],
            "createdAt": report.created_at.isoformat()
        }
    
    raise HTTPException(status_code=404, detail="Report not found")

@app.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    from bson import ObjectId
    print(f"DEBUG: DELETE request received for report_id: {report_id}")
    try:
        obj_id = ObjectId(report_id)
    except:
        print(f"DEBUG: Invalid ObjectId format: {report_id}")
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    # Try deleting from ScanReport
    report = await engine.find_one(ScanReport, ScanReport.id == obj_id)
    if report:
        print(f"DEBUG: Found in ScanReport. Deleting...")
        await engine.delete(report)
        return {"status": "success", "message": "Report deleted"}
    
    # Try deleting from DiffReport
    report = await engine.find_one(DiffReport, DiffReport.id == obj_id)
    if report:
        print(f"DEBUG: Found in DiffReport. Deleting...")
        await engine.delete(report)
        return {"status": "success", "message": "Report deleted"}
    
    print(f"DEBUG: Report {report_id} not found in either collection")
    raise HTTPException(status_code=404, detail="Report not found")

@app.get("/reports/export/{report_id}")
async def export_report(report_id: str):
    from bson import ObjectId
    from cyclonedx.model.bom import Bom
    from cyclonedx.model.component import Component, ComponentType
    from cyclonedx.model.vulnerability import Vulnerability, VulnerabilityRating, VulnerabilitySeverity
    from cyclonedx.model.dependency import Dependency
    from cyclonedx.output.json import JsonV1Dot5
    from cyclonedx.model import XsUri
    from packageurl import PackageURL
    from datetime import datetime, timezone
    import uuid, json

    # 1. Fetch Report
    report = await engine.find_one(ScanReport, ScanReport.id == ObjectId(report_id))
    is_diff = False
    if not report:
        report = await engine.find_one(DiffReport, DiffReport.id == ObjectId(report_id))
        is_diff = True
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

    # 2. Build BOM
    bom = Bom()
    bom.metadata.timestamp = datetime.now(timezone.utc)
    bom.serial_number = uuid.uuid4()

    # Root component — use a BomRef string, NOT a PackageURL object
    root_comp = Component(
        name=report.project_name.split(' vs ')[0] if is_diff else report.project_name,
        version="1.0.0",
        type=ComponentType.APPLICATION,
        bom_ref="verix-root",  # string is fine here; CycloneDX wraps it in BomRef internally
    )
    bom.metadata.component = root_comp

    # ✅ Always use ref=<component>.bom_ref, never pass the Component object directly
    root_deps: set[Dependency] = set()

    # 3. Process packages
    packages = []
    if is_diff:
        packages = (report.added or []) + (report.updated or [])
    else:
        for c in (report.components or []):
            for p in c.get('packages', []):
                p['component_name'] = c.get('name')
                packages.append(p)

    for p in packages:
        p_name = p.get('name', 'unknown')
        p_ver = str(p.get('version', '0.0.0'))

        p_type = p.get('type', 'generic')
        if p_type == 'backend/python':
            p_type = 'pypi'
        elif p_type == 'frontend/node':
            p_type = 'npm'

        purl_obj = PackageURL(type=p_type, name=p_name, version=p_ver)
        bom_ref_str = purl_obj.to_string()

        comp = Component(
            name=p_name,
            version=p_ver,
            type=ComponentType.LIBRARY,
            bom_ref=bom_ref_str,   # ✅ string, not PackageURL object
            purl=purl_obj,
            description=p.get('explanation', ''),
        )

        bom.components.add(comp)

        # ✅ Dependency must reference bom_ref, not the Component itself
        root_deps.add(Dependency(ref=comp.bom_ref))

        # Add vulnerabilities
        if p.get('level') in ['HIGH', 'CRITICAL']:
            vuln = Vulnerability(
                id=f"GEN-{uuid.uuid4().hex[:8].upper()}",
                description=p.get('explanation', 'Potential security risk identified by Verix.'),
            )
            rating = VulnerabilityRating(
                score=float(p.get('score', 50)) / 10.0,
                severity=(
                    VulnerabilitySeverity.CRITICAL
                    if p.get('level') == 'CRITICAL'
                    else VulnerabilitySeverity.HIGH
                ),
            )
            vuln.ratings.add(rating)
            vuln.affects.add(purl_obj.to_string())
            bom.vulnerabilities.add(vuln)

    # ✅ Build root Dependency node with all child refs
    root_dependency = Dependency(ref=root_comp.bom_ref, dependencies=root_deps)
    bom.dependencies.add(root_dependency)

    # 4. Serialize
    output = JsonV1Dot5(bom)
    return json.loads(output.output_as_string())