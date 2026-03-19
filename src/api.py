from database.data import groups, snippets


class CmdsheetApi:
    def print_log(self, log: str):
        print(log)

    def get_groups(self):
        return groups

    def get_snippets(self, groupId: str):
        return snippets

    def check_item(self, itemType: str, name: str):
        return {"status": "default", "message": ""}

    def create_item(self, itemType: str, name: str, description: str):
        if itemType == "snippet":
            snippets.append(
                {
                    "id": len(snippets) + 1,
                    "name": name,
                    "description": description,
                    "tags": [],
                }
            )
        elif itemType == "group":
            groups.append(
                {
                    "id": len(groups) + 1,
                    "name": name,
                    "count": 0,
                }
            )
        return {"status": "default", "message": ""}
