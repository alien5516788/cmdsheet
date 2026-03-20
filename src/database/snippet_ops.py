from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Group, Snippet


class SnippetOps:
    def __init__(self, session: Session):
        self.session = session

    def list_snippets(self, groupName: str):
        group = self.session.scalar(select(Group).where(Group.name == groupName))
        if not group:
            raise Exception(f"Group '{groupName}' does not exist")

        return [
            {
                "name": snippet.name,
                "description": snippet.description,
                "tags": snippet.tags.split(",") if snippet.tags else [],
            }
            for snippet in group.snippets
        ]

    def get_snippet(self, groupName: str, name: str):
        group = self.session.scalar(select(Group).where(Group.name == groupName))
        if not group:
            raise Exception(f"Group '{groupName}' does not exist")

        snippet = self.session.scalar(
            select(Snippet).where(Snippet.name == name, Snippet.group == group)
        )
        if not snippet:
            raise Exception(f"Snippet '{name}' does not exist")

        snippet.last_accessed = datetime.now()
        self.session.commit()

        return {
            "name": snippet.name,
            "description": snippet.description,
            "content": snippet.content,
            "tags": snippet.tags.split(",") if snippet.tags else [],
        }

    def create_snippet(self, groupName: str, name: str, description: str = ""):
        group = self.session.scalar(select(Group).where(Group.name == groupName))
        if not group:
            raise Exception(f"Group '{groupName}' does not exist")

        snippet = self.session.scalar(
            select(Snippet).where(Snippet.name == name, Snippet.group == group)
        )
        if snippet:
            raise Exception(f"Snippet '{name}' already exists")

        snippet = Snippet(
            group=group,
            name=name,
            description=description,
            content={},
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
        group = self.session.scalar(select(Group).where(Group.name == groupName))
        if not group:
            raise Exception(f"Group '{groupName}' does not exist")

        snippet = self.session.scalar(
            select(Snippet).where(Snippet.name == name, Snippet.group == group)
        )
        if not snippet:
            raise Exception(f"Snippet '{name}' does not exist")

        newSnippet = self.session.scalar(
            select(Snippet).where(Snippet.name == newName, Snippet.group == group)
        )
        if newSnippet:
            raise Exception(f"Snippet '{newName}' already exist")

        snippet.name = newName
        snippet.description = description
        snippet.tags = ",".join(tags)

        self.session.commit()

    def delete_snippet(self, groupName: str, name: str):
        group = self.session.scalar(select(Group).where(Group.name == groupName))
        if not group:
            raise Exception(f"Group '{groupName}' does not exist")

        snippet = self.session.scalar(
            select(Snippet).where(Snippet.name == name, Snippet.group == group)
        )
        if not snippet:
            raise Exception(f"Snippet '{name}' does not exist")

        self.session.delete(snippet)
        self.session.commit()
