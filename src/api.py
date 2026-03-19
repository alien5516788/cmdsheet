from pathlib import Path

from snippetengine.groupops import GroupOps
from snippetengine.initdir import InitDir
from snippetengine.snippetops import SnippetOps


class CmdsheetApi:
    def __init__(self, dev):
        # Base directory for userdata
        if dev:
            BASE_DIR = Path("./.cmdsheet")
        else:
            BASE_DIR = Path.home() / ".cmdsheet"

        # Permanent groups that are always present in the directory
        PERMANENT_GROUPS = ["default", "favourites", "recent"]

        # Snippet engine instances
        self._init_dir = InitDir(BASE_DIR, PERMANENT_GROUPS)
        self._init_dir.ensure()

        self._group_ops = GroupOps(BASE_DIR, PERMANENT_GROUPS)
        self._snippet_ops = SnippetOps(BASE_DIR, PERMANENT_GROUPS)

    def print_log(self, log: str):
        print(log)

    def get_groups(self):
        return self._group_ops.list_groups()

    def get_group(self, name: str):
        return self._group_ops.get_group(name)

    def get_snippets(self, groupName: str):
        return self._snippet_ops.list_snippets(groupName)

    def create_item(self, itemType: str, name: str, groupName: str, description: str):
        try:
            if itemType == "group":
                self._group_ops.create_group(name, description)
            elif itemType == "snippet":
                self._snippet_ops.create_snippet(name, groupName, description)
        except Exception as e:
            return {"status": "error", "message": str(e)}
        return {"status": "default", "message": ""}
