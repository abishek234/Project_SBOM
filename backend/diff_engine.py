from typing import List, Dict, Any

def compare_sboms(old_list: List[Dict[str, Any]], new_list: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    old_map = {p['name']: p for p in old_list}
    new_map = {p['name']: p for p in new_list}

    added = []
    removed = []
    updated = []

    # Check for Added and Updated
    for name, new_pkg in new_map.items():
        if name not in old_map:
            added.append(new_pkg)
        else:
            old_pkg = old_map[name]
            if old_pkg['version'] != new_pkg['version']:
                updated.append({
                    "name": name,
                    "oldVersion": old_pkg['version'],
                    "newVersion": new_pkg['version']
                })

    # Check for Removed
    for name, old_pkg in old_map.items():
        if name not in new_map:
            removed.append(old_pkg)

    return {
        "added": added,
        "removed": removed,
        "updated": updated
    }
