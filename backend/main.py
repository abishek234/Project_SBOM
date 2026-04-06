# main.py
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from risk_engine import RiskEngine
from diff_engine import compare_sboms
from parser import extract_and_parse
from database import (
    engine,
    ScanReport, DiffReport, Vulnerability,
    scan_reports_collection, diff_reports_collection, vulnerabilities_collection
)
from auth import router as auth_router
from bson import ObjectId
from datetime import datetime
import os

app = FastAPI()

ALLOWED_ORIGINS = [
    "https://project-sbom-frontend.onrender.com",  # Your frontend URL
    "http://localhost:3000",  # Local development
    "http://localhost:5173",  # Vite local dev
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Add environment variable support
FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL and FRONTEND_URL not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # ✅ Specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

app.include_router(auth_router, prefix="/auth")


@app.on_event("startup")
async def startup_db_check():
    try:
        await engine.client.admin.command("ping")
        print("✅ MongoDB connected")

        vuln_count = await engine.count(Vulnerability)
        if vuln_count == 0:
            print("🌱 Seeding Vulnerability Intelligence...")
            seed_data = [
                Vulnerability(name="log4j",        cve="CVE-2021-44228", cvss=10.0, severity="CRITICAL",  explanation="Log4j RCE (Log4Shell) allows full system takeover via crafted logs.",                      remediation="Upgrade to log4j-core version 2.17.1 or higher."),
                Vulnerability(name="lodash",        cve="CVE-2020-8203",  cvss=7.4,  severity="HIGH",      explanation="Prototype Pollution allows attackers to modify object properties globally.",               remediation="Upgrade to lodash 4.17.21 or higher."),
                Vulnerability(name="react-native",  cve="CVE-2023-38036", cvss=8.1,  severity="HIGH",      explanation="Insecure bridge communication may allow cross-process data leakage.",                     remediation="Update to React Native 0.72.4 or higher."),
                Vulnerability(name="spring-web",    cve="CVE-2022-22965", cvss=9.8,  severity="CRITICAL",  explanation="Spring4Shell allows RCE via data binding on specific JDK versions.",                     remediation="Upgrade to Spring Framework 5.3.18 or higher."),
                Vulnerability(name="struts",        cve="CVE-2017-5638",  cvss=10.0, severity="CRITICAL",  explanation="RCE via crafted Content-Type header in Jakarta Multipart parser.",                       remediation="Upgrade to Struts 2.3.32 or 2.5.10.1."),
                Vulnerability(name="openssl",       cve="CVE-2014-0160",  cvss=7.5,  severity="HIGH",      explanation="Heartbleed allows reading sensitive memory from the server.",                            remediation="Upgrade to OpenSSL 1.0.1g or higher."),
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

    components = await extract_and_parse(content)
    if not components:
        raise HTTPException(status_code=400, detail="No valid project manifests found (package.json or requirements.txt).")

    report_data = await risk_engine.analyze_sbom(components)

    report = ScanReport(
        user_email=email,
        project_name=file.filename,
        scan_type="single",
        risk_score=report_data["riskScore"],
        components=report_data["components"]
    )
    await engine.save(report)

    return {
        "reportId":   str(report.id),
        "riskScore":  report_data["riskScore"],
        "components": report_data["components"]
    }


@app.post("/scan/diff")
async def scan_diff_zips(file1: UploadFile = File(...), file2: UploadFile = File(...), email: str = Form(...)):
    comps1 = await extract_and_parse(await file1.read())
    comps2 = await extract_and_parse(await file2.read())

    if not comps1 or not comps2:
        raise HTTPException(status_code=400, detail="One or both zips have no valid dependency manifests.")

    deps1 = []
    for c_name, c_data in comps1.items():
        for p in c_data["packages"]:
            deps1.append({**p, "component": c_name})

    deps2 = []
    for c_name, c_data in comps2.items():
        for p in c_data["packages"]:
            deps2.append({**p, "component": c_name})

    diff_result = compare_sboms(deps1, deps2)

    res1 = await risk_engine.analyze_sbom(comps1)
    res2 = await risk_engine.analyze_sbom(comps2)

    for pkg in diff_result["added"]:
        risk = await risk_engine.calculate_risk_score(pkg)
        pkg.update(risk)

    for pkg in diff_result["updated"]:
        new_pkg_data = next((p for p in deps2 if p["name"] == pkg["name"]), {})
        risk = await risk_engine.calculate_risk_score(new_pkg_data)
        pkg.update(risk)

    v1_total = res1["riskScore"]
    v2_total = res2["riskScore"]

    report = DiffReport(
        user_email=email,
        project_name=f"{file1.filename} vs {file2.filename}",
        v1_score=v1_total,
        v2_score=v2_total,
        added=diff_result["added"],
        removed=diff_result["removed"],
        updated=diff_result["updated"],
        v1_components=res1["components"],
        v2_components=res2["components"]
    )
    await engine.save(report)
    print(f"DEBUG: DiffReport saved with ID: {report.id}")

    return {
        "reportId":      str(report.id),
        "v1_score":      v1_total,
        "v2_score":      v2_total,
        "added":         diff_result["added"],
        "removed":       diff_result["removed"],
        "updated":       diff_result["updated"],
        "v1_components": res1["components"],
        "v2_components": res2["components"]
    }


@app.get("/reports/history")
async def get_history(email: str):
    scans = await scan_reports_collection.find({"user_email": email}).to_list(length=None)
    diffs = await diff_reports_collection.find({"user_email": email}).to_list(length=None)

    history = []
    for s in scans:
        history.append({
            "id":         str(s["_id"]),
            "type":       "single",
            "name":       s.get("project_name"),
            "score":      s.get("risk_score", 0),
            "date":       s.get("created_at", datetime.utcnow()).isoformat(),
            "components": s.get("components", [])
        })
    for d in diffs:
        history.append({
            "id":       str(d["_id"]),
            "type":     "diff",
            "name":     d.get("project_name"),
            "score":    d.get("v2_score", 0),
            "v1_score": d.get("v1_score", 0),
            "date":     d.get("created_at", datetime.utcnow()).isoformat(),
            "added":    d.get("added", []),
            "removed":  d.get("removed", []),
            "updated":  d.get("updated", [])
        })

    return sorted(history, key=lambda x: x["date"], reverse=True)


@app.get("/reports/{report_id}")
async def get_report_details(report_id: str):
    try:
        obj_id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    doc = await scan_reports_collection.find_one({"_id": obj_id})
    if doc:
        return {
            "type":        "single",
            "reportId":    str(doc["_id"]),
            "projectName": doc.get("project_name"),
            "riskScore":   doc.get("risk_score", 0),
            "components":  doc.get("components", []),
            "createdAt":   doc.get("created_at", datetime.utcnow()).isoformat()
        }

    doc = await diff_reports_collection.find_one({"_id": obj_id})
    if doc:
        return {
            "type":          "diff",
            "reportId":      str(doc["_id"]),
            "projectName":   doc.get("project_name"),
            "v1_score":      doc.get("v1_score", 0),
            "v2_score":      doc.get("v2_score", 0),
            "added":         doc.get("added", []),
            "removed":       doc.get("removed", []),
            "updated":       doc.get("updated", []),
            "v1_components": doc.get("v1_components", []),
            "v2_components": doc.get("v2_components", []),
            "createdAt":     doc.get("created_at", datetime.utcnow()).isoformat()
        }

    raise HTTPException(status_code=404, detail="Report not found")


@app.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    try:
        obj_id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    result = await scan_reports_collection.delete_one({"_id": obj_id})
    if result.deleted_count:
        return {"status": "success", "message": "Report deleted"}

    result = await diff_reports_collection.delete_one({"_id": obj_id})
    if result.deleted_count:
        return {"status": "success", "message": "Report deleted"}

    raise HTTPException(status_code=404, detail="Report not found")


@app.get("/reports/export/{report_id}")
async def export_report(report_id: str):
    from cyclonedx.model.bom import Bom
    from cyclonedx.model.component import Component, ComponentType
    from cyclonedx.model.vulnerability import Vulnerability as CycloneVuln, VulnerabilityRating, VulnerabilitySeverity
    from cyclonedx.model.dependency import Dependency
    from cyclonedx.output.json import JsonV1Dot5
    from packageurl import PackageURL
    from datetime import timezone
    import uuid

    try:
        obj_id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    doc = await scan_reports_collection.find_one({"_id": obj_id})
    is_diff = False
    if not doc:
        doc = await diff_reports_collection.find_one({"_id": obj_id})
        is_diff = True
        if not doc:
            raise HTTPException(status_code=404, detail="Report not found")

    bom = Bom()
    bom.metadata.timestamp = datetime.now(timezone.utc)
    bom.serial_number = uuid.uuid4()

    project_name = doc.get("project_name", "unknown").split(" vs ")[0] if is_diff else doc.get("project_name", "unknown")
    root_comp = Component(
        name=project_name,
        version="1.0.0",
        type=ComponentType.APPLICATION,
        bom_ref="verix-root",
    )
    bom.metadata.component = root_comp

    root_deps: set = set()

    packages = []
    if is_diff:
        packages = (doc.get("added") or []) + (doc.get("updated") or [])
    else:
        for c in (doc.get("components") or []):
            for p in c.get("packages", []):
                p["component_name"] = c.get("name")
                packages.append(p)

    for p in packages:
        p_name = p.get("name", "unknown")
        p_ver  = str(p.get("version", "0.0.0"))
        p_type = p.get("type", "generic")
        if p_type == "backend/python":
            p_type = "pypi"
        elif p_type == "frontend/node":
            p_type = "npm"

        purl_obj    = PackageURL(type=p_type, name=p_name, version=p_ver)
        bom_ref_str = purl_obj.to_string()

        comp = Component(
            name=p_name,
            version=p_ver,
            type=ComponentType.LIBRARY,
            bom_ref=bom_ref_str,
            purl=purl_obj,
            description=p.get("explanation", ""),
        )
        bom.components.add(comp)
        root_deps.add(Dependency(ref=comp.bom_ref))

        if p.get("level") in ["HIGH", "CRITICAL"]:
            vuln = CycloneVuln(
                id=f"GEN-{uuid.uuid4().hex[:8].upper()}",
                description=p.get("explanation", "Potential security risk identified by Verix."),
            )
            rating = VulnerabilityRating(
                score=float(p.get("score", 50)) / 10.0,
                severity=(
                    VulnerabilitySeverity.CRITICAL
                    if p.get("level") == "CRITICAL"
                    else VulnerabilitySeverity.HIGH
                ),
            )
            vuln.ratings.add(rating)
            vuln.affects.add(purl_obj.to_string())
            bom.vulnerabilities.add(vuln)

    bom.dependencies.add(Dependency(ref=root_comp.bom_ref, dependencies=root_deps))

    output = JsonV1Dot5(bom)
    return json.loads(output.output_as_string())