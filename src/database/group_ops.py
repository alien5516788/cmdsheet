from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import Group, Snippet, snippet_tags


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
            .group_by(Group.id, Group.name)
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
        }

    def create_group(self, name: str, description: str):
        if name == "default":
            raise Exception("Cannot use permanent group name 'default'")

        self._assert_no_group(name)

        group = Group(
            name=name, description=(description if description is not None else "")
        )
        self.session.add(group)
        self.session.commit()

    def update_group(
        self, name: str, newName: str | None = None, description: str | None = None
    ):
        group = self._assert_group(name)

        if newName is not None and newName != name:
            self._assert_no_group(newName)
            group.name = newName
        if description is not None and description != group.description:
            group.description = description

        self.session.commit()

    def delete_group(self, name: str):
        # TODO: Review and test this function
        group = self._assert_group(name)
        orphan_tags = set(tag for snippet in group.snippets for tag in snippet.tags)

        self.session.delete(group)
        self.session.flush()  # ensures snippets & snippet_tags entries are removed

        # delete tags that are now orphan
        for tag in orphan_tags:
            count = self.session.scalar(
                select(func.count())
                .select_from(snippet_tags)
                .where(snippet_tags.c.tag_id == tag.id)
            )
            if count == 0:
                self.session.delete(tag)

        self.session.commit()
