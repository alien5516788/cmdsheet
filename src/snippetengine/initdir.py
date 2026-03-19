import json
from pathlib import Path

BASE_DIR = Path("./cmdsheet")  # For dev phase, in project root
PERMANENT_GROUPS = ["default", "favourites", "recent"]


def initdir():
    # Create base directory
    BASE_DIR.mkdir(exist_ok=True)

    # Create groups directory
    groups_dir = BASE_DIR / "groups"
    groups_dir.mkdir(exist_ok=True)

    # Create permanent group folders
    for group_name in PERMANENT_GROUPS:
        group_path = groups_dir / group_name
        group_path.mkdir(exist_ok=True)

        # Initialize snippetlist.json if missing
        snippetlist_file = group_path / "snippetlist.json"
        if not snippetlist_file.exists():
            with snippetlist_file.open("w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    # Initialize grouplist.json
    grouplist_file = groups_dir / "grouplist.json"
    if not grouplist_file.exists():
        grouplist_data = [
            # id is the same as name for permenant groups
            {"name": name, "description": "", "snippetcount": 0, "tags": []}
            for name in PERMANENT_GROUPS
        ]
        with grouplist_file.open("w", encoding="utf-8") as f:
            json.dump(grouplist_data, f, indent=2)

    # Initialize taglist.json
    taglist_file = BASE_DIR / "taglist.json"
    if not taglist_file.exists():
        with taglist_file.open("w", encoding="utf-8") as f:
            json.dump([], f, indent=2)

    print(f"Initialized cmdsheet directory at {BASE_DIR.resolve()}")
