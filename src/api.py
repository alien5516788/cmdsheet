from database.data import groups, snippets


class CmdsheetApi:
    def print_log(self, log: str):
        print(log)

    def get_groups(self):
        return groups

    def get_snippets(self, groupId: str):
        return snippets
