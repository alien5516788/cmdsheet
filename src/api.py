from database.group_ops import GroupOps
from database.initdb import InitDB
from database.snippet_ops import SnippetOps


class Api:
    def __init__(self, dev: bool = False):
        self._init_db = InitDB(dev)

    def print_log(self, log: str):
        print(log)

    def get_groups(self):
        session = self._init_db.get_session()
        try:
            groups = GroupOps(session).get_groups()
            return {"status": True, "groups": groups}
        except Exception as e:
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def get_group(self, name: str):
        session = self._init_db.get_session()
        try:
            group = GroupOps(session).get_group(name.strip())
            return {"status": True, "group": group}
        except Exception as e:
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def create_group(self, name: str, description: str = ""):
        session = self._init_db.get_session()
        try:
            GroupOps(session).create_group(name.strip(), description.strip())
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def update_group(
        self, name: str, newName: str | None = None, description: str | None = None
    ):
        session = self._init_db.get_session()
        try:
            GroupOps(session).update_group(name.strip(), newName, description)
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def delete_group(self, name: str):
        session = self._init_db.get_session()
        try:
            GroupOps(session).delete_group(name.strip())
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def get_snippets(self, groupName: str):
        session = self._init_db.get_session()
        try:
            snippets = SnippetOps(session).get_snippets(groupName.strip())
            return {"status": True, "snippets": snippets}
        except Exception as e:
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def get_snippet(self, groupName: str, name: str):
        session = self._init_db.get_session()
        try:
            snippet = SnippetOps(session).get_snippet(groupName.strip(), name.strip())
            return {"status": True, "snippet": snippet}
        except Exception as e:
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def create_snippet(self, groupName: str, name: str, description: str = ""):
        session = self._init_db.get_session()
        try:
            SnippetOps(session).create_snippet(
                groupName.strip(), name.strip(), description.strip()
            )
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def update_snippet(
        self,
        groupName: str,
        name: str,
        newName: str | None = None,
        description: str | None = None,
        favourite: bool | None = None,
        tags: list[str] | None = None,
    ):
        session = self._init_db.get_session()
        try:
            SnippetOps(session).update_snippet(
                groupName.strip(), name.strip(), newName, description, favourite, tags
            )
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def delete_snippet(self, groupName: str, name: str):
        session = self._init_db.get_session()
        try:
            SnippetOps(session).delete_snippet(groupName.strip(), name.strip())
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()

    def update_snippet_content(self, groupName: str, name: str, content: list):
        session = self._init_db.get_session()
        try:
            SnippetOps(session).update_snippet_content(
                groupName.strip(), name.strip(), content
            )
            return {"status": True}
        except Exception as e:
            session.rollback()
            return {"status": False, "message": str(e)}
        finally:
            session.close()
