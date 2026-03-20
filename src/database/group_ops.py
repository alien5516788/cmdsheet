from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Group


class GroupOps:
    def __init__(self, session: Session):
        self.session = session

    def list_groups(self):
        groups = self.session.scalars(select(Group)).all()

        return [
            {"name": group.name, "snippetCount": len(group.snippets)}
            for group in groups
        ]

    def get_group(self, name: str):
        group = self.session.scalar(select(Group).where(Group.name == name))
        if not group:
            raise Exception(f"Group '{name}' does not exist")

        return {
            "name": group.name,
            "description": group.description,
            "tags": group.tags.split(",") if group.tags else [],
        }

    def create_group(self, name: str, description: str = ""):
        if name == "default":
            raise Exception("Cannot use permanent group name 'default'")

        group = self.session.scalar(select(Group).where(Group.name == name))
        if group:
            raise Exception(f"Group '{name}' already exists")

        group = Group(name=name, description=description)
        self.session.add(group)
        self.session.commit()

    def update_group(self, name: str, newName: str, description: str, tags: list[str]):
        group = self.session.scalar(select(Group).where(Group.name == name))
        if not group:
            raise Exception(f"Group '{name}' does not exist")

        newGroup = self.session.scalar(select(Group).where(Group.name == newName))
        if newGroup:
            raise Exception(f"Group '{newName}' already exists")

        group.name = newName
        group.description = description
        group.tags = ",".join(tags)
        self.session.commit()

    def delete_group(self, name: str):
        group = self.session.scalar(select(Group).where(Group.name == name))
        if not group:
            raise Exception(f"Group '{name}' does not exist")

        self.session.delete(group)
        self.session.commit()
