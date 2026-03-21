from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database.group_ops import GroupOps

from .models import Snippet


class SnippetOps:
    def __init__(self, session: Session):
        self.session = session
        self.group_ops = GroupOps(session)

    def _assert_snippet(self, groupName: str, name: str) -> Snippet:
        group = self.group_ops._assert_group(groupName)
        snippet = self.session.scalar(
            select(Snippet).where(Snippet.name == name, Snippet.group_id == group.id)
        )
        if not snippet:
            raise Exception(f"Snippet '{name}' does not exist in group '{groupName}'")

        return snippet

    def _assert_no_snippet(self, groupName: str, name: str) -> None:
        group = self.group_ops._assert_group(groupName)
        snippet = self.session.scalar(
            select(Snippet).where(Snippet.name == name, Snippet.group_id == group.id)
        )
        if snippet:
            raise Exception(f"Snippet '{name}' already exists in group '{groupName}'")

    def get_snippets(self, groupName: str):
        group = self.group_ops._assert_group(groupName)

        return [
            {
                "name": snippet.name,
                "description": snippet.description,
                "tags": snippet.tags.split(",") if snippet.tags else [],
            }
            for snippet in group.snippets
        ]

    def get_snippet(self, groupName: str, name: str):
        snippet = self._assert_snippet(groupName, name)

        snippet.last_accessed = func.now()
        self.session.commit()

        return {
            "name": snippet.name,
            "description": snippet.description,
            "content": snippet.content,
            "tags": snippet.tags.split(",") if snippet.tags else [],
        }

    def create_snippet(self, groupName: str, name: str, description: str = ""):
        group = self.group_ops._assert_group(groupName)

        self._assert_no_snippet(groupName, name)

        snippet = Snippet(
            group=group,
            name=name,
            description=description,
        )
        self.session.add(snippet)
        self.session.commit()

    def update_snippet(
        self,
        groupName: str,
        name: str,
        newName: str,
        description: str = "",
        tags: list[str] = [],
    ):
        snippet = self._assert_snippet(groupName, name)

        if name != newName:
            self._assert_no_snippet(groupName, newName)
            snippet.name = newName

        snippet.description = description
        snippet.tags = ",".join(tags)

        self.session.commit()

    def delete_snippet(self, groupName: str, name: str):
        snippet = self._assert_snippet(groupName, name)

        self.session.delete(snippet)
        self.session.commit()
