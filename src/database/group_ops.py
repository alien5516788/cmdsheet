from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import Group, Snippet


class GroupOps:
    def __init__(self, session: Session):
        self.session = session

    def _assert_group(self, name: str) -> Group:
        group = self.session.scalar(select(Group).where(Group.name == name))
        if not group:
            raise Exception(f"Group '{name}' does not exist")

        return group

    def _assert_no_group(self, name: str) -> None:
        group = self.session.scalar(select(Group).where(Group.name == name))
        if group:
            raise Exception(f"Group '{name}' already exists")

    def get_groups(self):
        groups = self.session.execute(
            select(Group.name, func.count(Snippet.id))
            .outerjoin(Snippet, Snippet.group_id == Group.id)
            .group_by(Group.id)
        ).all()

        return [
            {
                "name": name,
                "snippetCount": count,
            }
            for name, count in groups
        ]

    def get_group(self, name: str):
        group = self._assert_group(name)

        return {
            "name": group.name,
            "description": group.description,
            "tags": group.tags.split(",") if group.tags else [],
        }

    def create_group(self, name: str, description: str = ""):
        if name == "default":
            raise Exception("Cannot use permanent group name 'default'")

        self._assert_no_group(name)

        group = Group(name=name, description=description)
        self.session.add(group)
        self.session.commit()

    def update_group(self, name: str, newName: str, description: str, tags: list[str]):
        group = self._assert_group(name)

        if newName != name:
            self._assert_no_group(newName)
            group.name = newName

        group.description = description
        group.tags = ",".join(tags)
        self.session.commit()

    def delete_group(self, name: str):
        group = self._assert_group(name)

        self.session.delete(group)
        self.session.commit()
