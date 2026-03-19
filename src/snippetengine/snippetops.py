import json
from pathlib import Path

from __utils__ import _read_json, _write_json
from groupops import GROUPS_DIR, update_group_snippetcount


class Snippet:
    name: str  # unique
    description: str
    tags: list[str]
    favorite: bool


def _get_snippetlist_file(groupName: str) -> Path:
    return GROUPS_DIR / groupName / "snippetlist.json"


def _get_snippet_file(groupName: str, snippetName: str) -> Path:
    return GROUPS_DIR / groupName / f"{snippetName}.json"


def list_snippets(groupName: str, offset=0, limit=25) -> list[dict]:
    snippetlist_file = _get_snippetlist_file(groupName)
    snippets = _read_json(snippetlist_file)
    return snippets[offset : offset + limit]


def create_snippet(name: str, groupName: str):
    snippetlist_file = _get_snippetlist_file(groupName)
    snippetlist = _read_json(snippetlist_file)

    # Check for duplicate name
    if any(s["name"] == name for s in snippetlist):
        raise Exception(f"Snippet with name '{name}' already exists")

    # Add snippet entry to snippetlist.json
    snippetlist.append({"name": name, "description": "", "tags": []})
    _write_json(snippetlist_file, snippetlist)

    # Create snippet file
    snippet_file = _get_snippet_file(groupName, name)
    with snippet_file.open("w", encoding="utf-8") as f:
        json.dump(
            {},
            f,
            indent=2,
        )

    # Update group snippet count
    update_group_snippetcount(groupName, 1)


def update_snippet_name(groupName: str, old_name: str, new_name: str):
    snippetlist_file = _get_snippetlist_file(groupName)
    snippetlist = _read_json(snippetlist_file)

    snippet = next((s for s in snippetlist if s["name"] == old_name), None)
    if not snippet:
        raise Exception(f"Snippet '{old_name}' not found in group '{groupName}'")

    # Update name in snippetlist
    snippet["name"] = new_name
    _write_json(snippetlist_file, snippetlist)

    # Rename snippet file
    old_file = _get_snippet_file(groupName, old_name)
    new_file = _get_snippet_file(groupName, new_name)
    if old_file.exists():
        old_file.rename(new_file)


def update_snippet_description(groupName: str, name: str, description: str):
    snippetlist_file = _get_snippetlist_file(groupName)
    snippetlist = _read_json(snippetlist_file)

    snippet = next((s for s in snippetlist if s["name"] == name), None)
    if not snippet:
        raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

    snippet["description"] = description
    _write_json(snippetlist_file, snippetlist)

    # Update snippet file
    snippet_file = _get_snippet_file(groupName, name)
    with snippet_file.open("w", encoding="utf-8") as f:
        json.dump(snippet, f, indent=2)


def update_snippet_tags(groupName: str, name: str, tags: list[str]):
    snippetlist_file = _get_snippetlist_file(groupName)
    snippetlist = _read_json(snippetlist_file)

    snippet = next((s for s in snippetlist if s["name"] == name), None)
    if not snippet:
        raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

    snippet["tags"] = tags
    _write_json(snippetlist_file, snippetlist)

    # Update snippet file
    snippet_file = _get_snippet_file(groupName, name)
    with snippet_file.open("w", encoding="utf-8") as f:
        json.dump(snippet, f, indent=2)


def get_snippet_content(name: str, groupName: str) -> list[dict]:
    snippet_file = _get_snippet_file(groupName, name)
    if not snippet_file.exists():
        raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

    snippet_content = _read_json(snippet_file)
    return snippet_content


def update_snippet_content(groupName: str, name: str, content: list[dict]):
    snippet_file = _get_snippet_file(groupName, name)
    if not snippet_file.exists():
        raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

    # Write new content
    with snippet_file.open("w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)


def move_snippet(name: str, group: str, newGroup: str):
    old_file = _get_snippet_file(group, name)
    if not old_file.exists():
        raise Exception(f"Snippet '{name}' not found in group '{group}'")

    new_file = _get_snippet_file(newGroup, name)
    if new_file.exists():
        raise Exception(f"Snippet '{name}' already exists in group '{newGroup}'")

    # Move file
    old_file.rename(new_file)

    # Update snippetlists
    old_list_file = _get_snippetlist_file(group)
    new_list_file = _get_snippetlist_file(newGroup)

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
    update_group_snippetcount(newGroup, -1)
    update_group_snippetcount(newGroup, 1)

    return True


def copy_snippet(
    name: str,
    group: str,
    newGroup: str,
):
    source_file = _get_snippet_file(group, name)
    if not source_file.exists():
        raise Exception(f"Snippet '{name}' not found in group '{group}'")

    copy_index = 1

    while True:
        target_name = name + f" (copy {copy_index})"
        target_file = _get_snippet_file(newGroup, target_name)
        if not target_file.exists():
            break
        copy_index += 1

    # Copy file
    data = _read_json(source_file)
    data["name"] = target_name
    with target_file.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    # Update snippetlist
    target_list_file = _get_snippetlist_file(newGroup)
    target_snippets = _read_json(target_list_file)
    target_snippets.append(data)
    _write_json(target_list_file, target_snippets)

    # Update snippet count in target group
    update_group_snippetcount(newGroup, 1)


def delete_snippet(name: str, groupName: str):
    snippetlist_file = _get_snippetlist_file(groupName)
    snippetlist = _read_json(snippetlist_file)

    snippet = next((s for s in snippetlist if s["name"] == name), None)
    if not snippet:
        raise Exception(f"Snippet '{name}' not found in group '{groupName}'")

    snippetlist = [s for s in snippetlist if s["name"] != name]
    _write_json(snippetlist_file, snippetlist)

    # Remove snippet file
    snippet_file = _get_snippet_file(groupName, name)
    if snippet_file.exists():
        snippet_file.unlink()

    # Update group snippet count and tags
    update_group_snippetcount(groupName, -1)
