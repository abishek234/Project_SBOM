import zipfile
import json
import io
import os
from typing import List, Dict, Any
import re
from pathlib import Path

async def extract_and_parse(file_content: bytes) -> Dict[str, Any]:
    components = {} # component_path -> {type, source_file, packages: []}
    directory_map = {}
    
    ignored_dirs = ["node_modules", "dist", "build", "venv", ".git", "__pycache__"]
    code_extensions = {".js": "JS", ".jsx": "React", ".ts": "TS", ".tsx": "React", ".py": "Python", ".java": "Java"}

    try:
        with zipfile.ZipFile(io.BytesIO(file_content)) as z:
            file_list = z.namelist()
            print(f"DEBUG: Parsing ZIP with {len(file_list)} files.")
            
            # 1. Map all files to understand structure
            for filename in file_list:
                # Normalize to forward slashes
                norm_name = filename.replace('\\', '/')
                parts = [p for p in norm_name.split('/') if p]
                
                # Precise ignore logic (only exact folder matches)
                if any(p in ignored_dirs for p in parts) or any(p.startswith('.') for p in parts):
                    continue
                
                # Normalize directory identification
                if len(parts) > 1:
                    base_dir = parts[0]
                    # If it's a deep path, try to find a meaningful component root
                    if base_dir == 'src' and len(parts) > 2:
                        base_dir = f"src/{parts[1]}"
                    
                    if base_dir not in directory_map:
                        directory_map[base_dir] = {"files": [], "langs": {}}
                    
                    directory_map[base_dir]["files"].append(norm_name)
                    ext = os.path.splitext(norm_name)[1].lower()
                    if ext in code_extensions:
                        lang = code_extensions[ext]
                        directory_map[base_dir]["langs"][lang] = directory_map[base_dir]["langs"].get(lang, 0) + 1

                # 2. Identify Manifest Components (Case-Insensitive)
                lname = norm_name.lower()
                if lname.endswith("package.json"):
                    print(f"DEBUG: Found package.json at {norm_name}")
                    # comp_name is the folder containing the manifest
                    comp_name = "/".join(parts[:-1]) if len(parts) > 1 else "root"
                    with z.open(filename) as f:
                        try:
                            data = json.load(f)
                            packages = []
                            # dependencies and devDependencies
                            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
                            for name, ver in deps.items():
                                packages.append({"name": name, "version": str(ver).replace("^", "").replace("~", ""), "type": "npm"})
                            
                            # Detect Backend vs Frontend
                            is_backend = any(kw in comp_name.lower() for kw in ["server", "backend", "api", "lambda", "functions"])
                            comp_type = "backend/node" if is_backend else "frontend/node"

                            components[comp_name] = {
                                "name": comp_name,
                                "type": comp_type,
                                "source": norm_name,
                                "packages": packages
                            }
                            print(f"DEBUG: Parsed {len(packages)} packages from {norm_name}")
                        except Exception as e:
                            print(f"DEBUG: Failed to parse package.json {norm_name}: {e}")

                elif lname.endswith("requirements.txt"):
                    print(f"DEBUG: Found requirements.txt at {norm_name}")
                    comp_name = "/".join(parts[:-1]) if len(parts) > 1 else "root"
                    with z.open(filename) as f:
                        try:
                            text = f.read().decode("utf-8")
                            packages = []
                            for line in text.splitlines():
                                line = line.strip()
                                if line and not line.startswith("#"):
                                    parts_req = re.split(r'[=<>~!]+', line)
                                    if len(parts_req) >= 1:
                                        name = parts_req[0].strip()
                                        version = parts_req[1].strip() if len(parts_req) > 1 else "latest"
                                        packages.append({"name": name, "version": version, "type": "pypi"})
                            
                            components[comp_name] = {
                                "name": comp_name,
                                "type": "backend/python",
                                "source": norm_name,
                                "packages": packages
                            }
                            print(f"DEBUG: Parsed {len(packages)} packages from {norm_name}")
                        except Exception as e:
                            print(f"DEBUG: Failed to parse requirements.txt {norm_name}: {e}")

                elif lname.endswith("bom.json"):
                    print(f"DEBUG: Found CycloneDX at {norm_name}")
                    comp_name = "/".join(parts[:-1]) if len(parts) > 1 else "bom-root"
                    with z.open(filename) as f:
                        try:
                            data = json.load(f)
                            packages = []
                            for comp in data.get("components", []):
                                packages.append({
                                    "name": comp.get("name"),
                                    "version": comp.get("version", "latest"),
                                    "type": comp.get("type", "library"),
                                    "purl": comp.get("purl")
                                })
                            components[comp_name] = {
                                "name": f"SBOM-Import: {comp_name}",
                                "type": "standard-cyclonedx",
                                "source": norm_name,
                                "packages": packages
                            }
                            print(f"DEBUG: Parsed {len(packages)} packages from {norm_name}")
                        except Exception as e:
                            print(f"DEBUG: Failed to parse CycloneDX {norm_name}: {e}")

    except Exception as e:
        print(f"Error parsing zip: {e}")
        
    return components
