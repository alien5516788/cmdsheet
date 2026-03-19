import json
import shutil

from snippetengine.__utils__ import _read_json, _write_json
from snippetengine.tagops import TagOps


class Group:
    name: str  # unique
    description: str
    snippetcount: int
    tags: list[str]


class GroupOps:
    def __init__(self, baseDir, permenentGroups):
        self.PERMANENT_GROUPS = permenentGroups
        self.GROUPS_DIR = baseDir / "groups"
        self.GROUPLIST_FILE = self.GROUPS_DIR / "grouplist.json"

        self.tag_ops = TagOps(baseDir)

    def list_groups(self) -> list[dict]:
        grouplist = _read_json(self.GROUPLIST_FILE)
        # Return only name and snippetcount
        grouplist_filtered = [
            {"name": g["name"], "snippetcount": g["snippetcount"]} for g in grouplist
        ]
        return grouplist_filtered

    def create_group(self, name: str, description: str = ""):
        # Check for permanent group name
        if name in self.PERMANENT_GROUPS:
            raise Exception(f"Cannot use the name of a permanent group '{name}'")

        # Check for reserved name
        if name == "grouplist":
            raise Exception(f"Cannot use a reserved name '{name}'")

        # Check for existing group
        grouplist = _read_json(self.GROUPLIST_FILE)
        if any(g["name"] == name for g in grouplist):
            raise Exception(f"Group '{name}' already exists")

        # Create group folder
        group_path = self.GROUPS_DIR / name
        group_path.mkdir(exist_ok=True)

        # Initialize snippetlist.json
        snippetlist_file = group_path / "snippetlist.json"
        with snippetlist_file.open("w", encoding="utf-8") as f:
            json.dump([], f, indent=2)

        # Add to grouplist.json
        grouplist.append(
            {"name": name, "description": description, "snippetcount": 0, "tags": []}
        )
        _write_json(self.GROUPLIST_FILE, grouplist)

    def get_group(self, name: str) -> dict | None:
        grouplist = _read_json(self.GROUPLIST_FILE)
        for g in grouplist:
            if g["name"] == name:
                return g
        return None

    def update_group_name(self, name: str, newName: str):
        # Check for permanent groups
        if name in self.PERMANENT_GROUPS:
            raise Exception(f"Cannot rename permanent group '{name}'")

        if newName in self.PERMANENT_GROUPS:
            raise Exception(f"Cannot use permanent group name '{newName}'")

        # Check for existing group names
        grouplist = _read_json(self.GROUPLIST_FILE)
        if any(g["name"] == newName for g in grouplist):
            raise Exception(f"Group '{newName}' already exists")

        # Rename folder
        old_path = self.GROUPS_DIR / name
        new_path = self.GROUPS_DIR / newName
        old_path.rename(new_path)

        # Update grouplist.json
        for g in grouplist:
            if g["name"] == name:
                g["name"] = newName
                break
        _write_json(self.GROUPLIST_FILE, grouplist)

    def update_group_description(self, name: str, description: str):
        grouplist = _read_json(self.GROUPLIST_FILE)

        for g in grouplist:
            if g["name"] == name:
                g["description"] = description
                break
        else:
            raise Exception(f"Group '{name}' not found")

        _write_json(self.GROUPLIST_FILE, grouplist)

    def update_group_snippetcount(self, name: str, delta: int):
        grouplist = _read_json(self.GROUPLIST_FILE)

        for g in grouplist:
            if g["name"] == name:
                g["snippetcount"] = max(0, g.get("snippetcount", 0) + delta)
                break
        else:
            raise Exception(f"Group '{name}' not found")

        _write_json(self.GROUPLIST_FILE, grouplist)

    def update_group_tags(self, name: str, newTags: list[str]):
        grouplist = _read_json(self.GROUPLIST_FILE)

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
            self.tag_ops.add_tags(tags_to_add)
        if tags_to_remove:
            self.tag_ops.remove_tags(tags_to_remove)

        _write_json(self.GROUPLIST_FILE, grouplist)

    def delete_group(self, name: str):
        # Check for permanent groups
        if name in self.PERMANENT_GROUPS:
            raise Exception(f"Cannot delete permanent group '{name}'")

        grouplist = _read_json(self.GROUPLIST_FILE)
        new_list = [g for g in grouplist if g["name"] != name]
        _write_json(self.GROUPLIST_FILE, new_list)

        # Delete group folder and all files
        group_path = self.GROUPS_DIR / name
        if group_path.exists():
            shutil.rmtree(group_path)
