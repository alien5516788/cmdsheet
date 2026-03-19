import json
from pathlib import Path


class InitDir:
    def __init__(self, baseDir: Path, permanentGroup: list[str]):
        self.BASE_DIR = baseDir
        self.PERMANENT_GROUPS = permanentGroup
        self.initdir()

    def initdir(self):
        # Create base directory
        self.BASE_DIR.mkdir(exist_ok=True)

        # Create groups directory
        groups_dir = self.BASE_DIR / "groups"
        groups_dir.mkdir(exist_ok=True)

        # Create permanent group folders
        for group_name in self.PERMANENT_GROUPS:
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
                for name in self.PERMANENT_GROUPS
            ]
            with grouplist_file.open("w", encoding="utf-8") as f:
                json.dump(grouplist_data, f, indent=2)

        # Initialize taglist.json
        taglist_file = self.BASE_DIR / "taglist.json"
        if not taglist_file.exists():
            with taglist_file.open("w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

        print(f"Initialized cmdsheet directory at {self.BASE_DIR}")
