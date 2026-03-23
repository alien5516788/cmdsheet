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
            select(Group.id, Group.name, func.count(Snippet.id))
            .outerjoin(Snippet, Snippet.group_id == Group.id)
            .group_by(Group.id, Group.name)
        ).all()

        custom_groups = [
            {
                "id": id,
                "name": name,
                "snippetCount": count,
            }
            for id, name, count in groups
        ]

        # favourites count
        favourites_count = self.session.execute(
            select(func.count(Snippet.id)).where(Snippet.favourite)
        ).scalar_one()

        # recent count (limit 20)
        recent_count = self.session.execute(
            select(func.count()).select_from(
                select(Snippet.id)
                .order_by(Snippet.last_accessed.desc())
                .limit(20)
                .subquery()
            )
        ).scalar_one()

        virtual_groups = [
            {
                "id": -1,
                "name": "recent",
                "snippetCount": recent_count,
            },
            {
                "id": -2,
                "name": "favourites",
                "snippetCount": favourites_count,
            },
        ]

        return virtual_groups + custom_groups

    def get_group(self, name: str):
        if name == "recent":
            return {
                "name": "recent",
                "description": "Echoes of your latest thoughts linger here — the commands you whispered to the machine, still warm, still within reach.",
            }
        if name == "favourites":
            return {
                "name": "favourites",
                "description": "The ones you chose to keep close — fragments of code that earned your trust and found a home.",
            }

        group = self._assert_group(name)

        return {
            "name": group.name,
            "description": group.description,
        }

    def create_group(self, name: str, description: str):
        if name == "":
            raise Exception("Group name cannot be empty")

        if name == "default":
            raise Exception("Cannot use permanent group name 'default'")

        if name in ["favourites", "recent"]:
            raise Exception(f"Cannot use reserved name '{name}'")

        if len(name) > 50:
            raise Exception("Group name cannot exceed 50 characters")

        if len(description) > 400:
            raise Exception("Group description cannot exceed 400 characters")

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

        if description is not None and description.strip() != group.description:
            if len(description.strip()) > 400:
                raise Exception("Group description cannot exceed 400 characters")
            group.description = description.strip()
        if newName is not None and newName.strip() != name:
            # Name should be updated last, becuase it affects other field changes
            if name == "default":
                raise Exception("Cannot rename permanent group 'default'")
            if newName.strip() == "default":
                raise Exception("Cannot use permanent group name 'default'")
            if newName.strip() in ["favourites", "recent"]:
                raise Exception(f"Cannot use reserved name '{newName.strip()}'")
            if newName.strip() == "":
                raise Exception("Group name cannot be empty")
            if len(newName.strip()) > 50:
                raise Exception("Group name cannot exceed 50 characters")

            self._assert_no_group(newName.strip())
            group.name = newName.strip()

        self.session.commit()

    def delete_group(self, name: str):
        if name == "default":
            raise Exception("Cannot delete permanent group 'default'")

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
