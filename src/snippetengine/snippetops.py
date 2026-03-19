import json
from pathlib import Path

from snippetengine import groupops
from snippetengine.__utils__ import _read_json, _write_json


class Snippet:
    name: str  # unique
    description: str
    tags: list[str]
    favorite: bool


class SnippetOps:
    def __init__(self, baseDir, permenentGroups):
        self.GROUPS_DIR = baseDir / "groups"

        self.group_ops = groupops.GroupOps(baseDir, permenentGroups)

    def _get_snippetlist_file(self, groupName: str) -> Path:
        return self.GROUPS_DIR / groupName / "snippetlist.json"

    def _get_snippet_file(self, groupName: str, snippetName: str) -> Path:
        return self.GROUPS_DIR / groupName / f"{snippetName}.json"

    def list_snippets(self, groupName: str) -> list[dict]:
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippets = _read_json(snippetlist_file)
        return snippets

    def create_snippet(self, name: str, groupName: str, description: str = ""):
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippetlist = _read_json(snippetlist_file)

        # Check for reserved name
        if name == "snippetlist":
            raise Exception(f"Cannot use a reserved name '{name}'")

        # Check for prohibited group
        if groupName == "recent":
            raise Exception(
                f"Cannot manually create snippets in the group '{groupName}'"
            )

        # Check for duplicate name
        if any(s["name"] == name for s in snippetlist):
            raise Exception(f"Snippet with name '{name}' already exists")

        # Add snippet entry to snippetlist.json
        snippetlist.append({"name": name, "description": description, "tags": []})
        _write_json(snippetlist_file, snippetlist)

        # Create snippet file
        snippet_file = self._get_snippet_file(groupName, name)
        with snippet_file.open("w", encoding="utf-8") as f:
            json.dump(
                {},
                f,
                indent=2,
            )

        # Update group snippet count
        self.group_ops.update_group_snippetcount(groupName, 1)

    def get_snippet(self, groupName: str, snippetName: str) -> dict | None:
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippetlist = _read_json(snippetlist_file)
        for s in snippetlist:
            if s["name"] == snippetName:
                return s
        return None

    def update_snippet_name(self, groupName: str, old_name: str, new_name: str):
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippetlist = _read_json(snippetlist_file)

        snippet = next((s for s in snippetlist if s["name"] == old_name), None)
        if not snippet:
            raise Exception(f"Snippet '{old_name}' not found in group '{groupName}'")

        # Update name in snippetlist
        snippet["name"] = new_name
        _write_json(snippetlist_file, snippetlist)

        # Rename snippet file
        old_file = self._get_snippet_file(groupName, old_name)
        new_file = self._get_snippet_file(groupName, new_name)
        if old_file.exists():
            old_file.rename(new_file)

    def update_snippet_description(self, groupName: str, name: str, description: str):
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippetlist = _read_json(snippetlist_file)

        snippet = next((s for s in snippetlist if s["name"] == name), None)
        if not snippet:
            raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

        snippet["description"] = description
        _write_json(snippetlist_file, snippetlist)

        # Update snippet file
        snippet_file = self._get_snippet_file(groupName, name)
        with snippet_file.open("w", encoding="utf-8") as f:
            json.dump(snippet, f, indent=2)

    def update_snippet_tags(self, groupName: str, name: str, tags: list[str]):
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippetlist = _read_json(snippetlist_file)

        snippet = next((s for s in snippetlist if s["name"] == name), None)
        if not snippet:
            raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

        snippet["tags"] = tags
        _write_json(snippetlist_file, snippetlist)

        # Update snippet file
        snippet_file = self._get_snippet_file(groupName, name)
        with snippet_file.open("w", encoding="utf-8") as f:
            json.dump(snippet, f, indent=2)

    def get_snippet_content(self, name: str, groupName: str) -> list[dict]:
        snippet_file = self._get_snippet_file(groupName, name)
        if not snippet_file.exists():
            raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

        snippet_content = _read_json(snippet_file)
        return snippet_content

    def update_snippet_content(self, groupName: str, name: str, content: list[dict]):
        snippet_file = self._get_snippet_file(groupName, name)
        if not snippet_file.exists():
            raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

        # Write new content
        with snippet_file.open("w", encoding="utf-8") as f:
            json.dump(content, f, indent=2)

    def move_snippet(self, name: str, group: str, newGroup: str):
        old_file = self._get_snippet_file(group, name)
        if not old_file.exists():
            raise Exception(f"Snippet '{name}' not found in group '{group}'")

        new_file = self._get_snippet_file(newGroup, name)
        if new_file.exists():
            raise Exception(f"Snippet '{name}' already exists in group '{newGroup}'")

        # Move file
        old_file.rename(new_file)

        # Update snippetlists
        old_list_file = self._get_snippetlist_file(group)
        new_list_file = self._get_snippetlist_file(newGroup)

        old_snippets = _read_json(old_list_file)
        new_snippets = _read_json(new_list_file)

        snippet = next((s for s in old_snippets if s["name"] == name), None)
        if not snippet:
            raise Exception(f"Snippet '{name}' not found in snippetlist of '{group}'")

        old_snippets = [s for s in old_snippets if s["name"] != name]
        new_snippets.append(snippet)

        _write_json(old_list_file, old_snippets)
        _write_json(new_list_file, new_snippets)

        # Update snippet counts
        self.group_ops.update_group_snippetcount(newGroup, -1)
        self.group_ops.update_group_snippetcount(newGroup, 1)

        return True

    def copy_snippet(
        self,
        name: str,
        group: str,
        newGroup: str,
    ):
        source_file = self._get_snippet_file(group, name)
        if not source_file.exists():
            raise Exception(f"Snippet '{name}' not found in group '{group}'")

        copy_index = 1

        while True:
            target_name = name + f" (copy {copy_index})"
            target_file = self._get_snippet_file(newGroup, target_name)
            if not target_file.exists():
                break
            copy_index += 1

        # Copy file
        data = _read_json(source_file)
        data["name"] = target_name
        with target_file.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        # Update snippetlist
        target_list_file = self._get_snippetlist_file(newGroup)
        target_snippets = _read_json(target_list_file)
        target_snippets.append(data)
        _write_json(target_list_file, target_snippets)

        # Update snippet count in target group
        self.group_ops.update_group_snippetcount(newGroup, 1)

    def delete_snippet(self, name: str, groupName: str):
        snippetlist_file = self._get_snippetlist_file(groupName)
        snippetlist = _read_json(snippetlist_file)

        snippet = next((s for s in snippetlist if s["name"] == name), None)
        if not snippet:
            raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

        snippetlist = [s for s in snippetlist if s["name"] != name]
        _write_json(snippetlist_file, snippetlist)

        # Remove snippet file
        snippet_file = self._get_snippet_file(groupName, name)
        if snippet_file.exists():
            snippet_file.unlink()

        # Update group snippet count and tags
        self.group_ops.update_group_snippetcount(groupName, -1)
