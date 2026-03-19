import json

import initdir
from __utils__ import _read_json, _write_json
from pydantic import BaseModel
from tagops import add_tags, remove_tags

PERMANENT_GROUPS = initdir.PERMANENT_GROUPS
BASE_DIR = initdir.BASE_DIR
GROUPS_DIR = BASE_DIR / "groups"
GROUPlIST_FILE = GROUPS_DIR / "grouplist.json"


class Group(BaseModel):
    name: str  # unique
    description: str
    snippetcount: int
    tags: list[str]


def list_groups(offset=0, limit=25) -> list[dict]:
    grouplist = _read_json(GROUPlIST_FILE)
    return grouplist[offset : offset + limit]


def create_group(name: str):
    # Check for permanent group name
    if name in PERMANENT_GROUPS:
        raise Exception(f"Cannot create group with permanent name '{name}'")

    # Check for existing group
    grouplist = _read_json(GROUPlIST_FILE)
    if any(g["name"] == name for g in grouplist):
        raise Exception(f"Group '{name}' already exists")

    # Create group folder
    group_path = GROUPS_DIR / name
    group_path.mkdir(exist_ok=True)

    # Initialize snippetlist.json
    snippetlist_file = group_path / "snippetlist.json"
    with snippetlist_file.open("w", encoding="utf-8") as f:
        json.dump([], f, indent=2)

    # Add to grouplist.json
    grouplist.append({"name": name, "description": "", "snippetcount": 0, "tags": []})
    _write_json(GROUPlIST_FILE, grouplist)


def get_group(name: str) -> dict | None:
    grouplist = _read_json(GROUPlIST_FILE)
    for g in grouplist:
        if g["id"] == id:
            return g
    return None


def update_group_name(name: str, newName: str):
    # Check for permanent groups
    if name in PERMANENT_GROUPS:
        raise Exception(f"Cannot rename permanent group '{name}'")

    if newName in PERMANENT_GROUPS:
        raise Exception(f"Cannot use permanent group name '{newName}'")

    # Check for existing group names
    grouplist = _read_json(GROUPlIST_FILE)
    if any(g["name"] == newName for g in grouplist):
        raise Exception(f"Group '{newName}' already exists")

    # Rename folder
    old_path = GROUPS_DIR / name
    new_path = GROUPS_DIR / newName
    old_path.rename(new_path)

    # Update grouplist.json
    for g in grouplist:
        if g["name"] == name:
            g["name"] = newName
            break
    _write_json(GROUPlIST_FILE, grouplist)


def update_group_description(name: str, description: str):
    grouplist = _read_json(GROUPlIST_FILE)

    for g in grouplist:
        if g["name"] == name:
            g["description"] = description
            break
    else:
        raise Exception(f"Group '{name}' not found")

    _write_json(GROUPlIST_FILE, grouplist)


def update_group_snippetcount(name: str, delta: int):
    grouplist = _read_json(GROUPlIST_FILE)

    for g in grouplist:
        if g["name"] == name:
            g["itemcount"] = max(0, g.get("itemcount", 0) + delta)
            break
    else:
        raise Exception(f"Group '{name}' not found")

    _write_json(GROUPlIST_FILE, grouplist)


def update_group_tags(name: str, newTags: list[str]):
    grouplist = _read_json(GROUPlIST_FILE)

    # Find the group
    group = next((g for g in grouplist if g["name"] == name), None)
    if not group:
        raise Exception(f"Group '{name}' not found")

    old_tags = group.get("tags", [])

    # Update group tags
    group["tags"] = newTags

    # Determine which tags to add/remove from global taglist
    old_set = set(old_tags)
    new_set = set(newTags)

    tags_to_add = list(new_set - old_set)
    tags_to_remove = list(old_set - new_set)

    if tags_to_add:
        add_tags(tags_to_add)
    if tags_to_remove:
        remove_tags(tags_to_remove)

    _write_json(GROUPlIST_FILE, grouplist)


def delete_group(name: str):
    # Check for permanent groups
    if name in PERMANENT_GROUPS:
        raise Exception(f"Cannot delete permanent group '{name}'")

    grouplist = _read_json(GROUPlIST_FILE)
    new_list = [g for g in grouplist if g["name"] != name]
    _write_json(GROUPlIST_FILE, new_list)

    # Delete group folder and all files
    group_path = GROUPS_DIR / name
    if group_path.exists():
        for f in group_path.iterdir():
            f.unlink()
        group_path.rmdir()
