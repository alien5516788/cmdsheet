from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database.group_ops import GroupOps

from .models import Snippet, Tag, snippet_tags

# ISSUE: Allmost all functions uses groupName + name to identify a snippet instead of using id
# Hard to fix becuase frontend also has to be refactored, but consider using id later on


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
        if groupName == "recent":
            snippets = (
                self.session.execute(
                    select(Snippet).order_by(Snippet.last_accessed.desc()).limit(20)
                )
                .scalars()
                .all()
            )

        elif groupName == "favourites":
            snippets = (
                self.session.execute(select(Snippet).where(Snippet.favourite))
                .scalars()
                .all()
            )

        else:
            group = self.group_ops._assert_group(groupName)
            snippets = group.snippets

        return [
            {
                "id": snippet.id,
                "groupName": snippet.group.name,
                "name": snippet.name,
                "description": snippet.description,
                "tags": [tag.name for tag in snippet.tags],
                "favourite": snippet.favourite,
            }
            for snippet in snippets
        ]

    def get_snippet(self, groupName: str, name: str):
        snippet = self._assert_snippet(groupName, name)

        snippet.last_accessed = func.now()
        self.session.commit()

        return {
            "name": snippet.name,
            "description": snippet.description,
            "content": snippet.content,
            "tags": [tag.name for tag in snippet.tags],
            "favourite": snippet.favourite,
        }

    def create_snippet(self, groupName: str, name: str, description: str):
        if name == "":
            raise Exception("Snippet name cannot be empty")

        if len(name) > 50:
            raise Exception("Snippet name cannot exceed 50 characters")

        if len(description) > 400:
            raise Exception("Snippet description cannot exceed 400 characters")

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
        newName: str | None = None,
        description: str | None = None,
        favourite: bool | None = None,
        tags: list[str] | None = None,
    ):
        snippet = self._assert_snippet(groupName, name)

        if description is not None and description.strip() != snippet.description:
            if len(description.strip()) > 400:
                raise Exception("Snippet description cannot exceed 400 characters")
            snippet.description = description.strip()
        if favourite is not None and favourite != snippet.favourite:
            snippet.favourite = favourite
        if tags is not None:
            # TODO: Review and test this tag operation
            current_tags = {tag.name: tag for tag in snippet.tags}

            # Diffs
            to_add_names = tags - current_tags.keys()
            to_remove_names = current_tags.keys() - tags

            # Add new tags
            if to_add_names:
                existing_tags = self.session.scalars(
                    select(Tag).where(Tag.name.in_(to_add_names))
                ).all()

                existing_map = {tag.name: tag for tag in existing_tags}

                for t_name in to_add_names:
                    if t_name in existing_map:
                        snippet.tags.append(existing_map[t_name])
                    else:
                        tag = Tag(name=t_name)
                        self.session.add(tag)
                        snippet.tags.append(tag)
            # Remove tags
            removed_tags = []
            for name in to_remove_names:
                tag = current_tags[name]
                snippet.tags.remove(tag)
                removed_tags.append(tag)

            # Flush before checking orphan
            self.session.flush()

            # cleanup orphans
            for tag in removed_tags:
                count = self.session.scalar(
                    select(func.count())
                    .select_from(snippet_tags)
                    .where(snippet_tags.c.tag_id == tag.id)
                )

                if count == 0:
                    self.session.delete(tag)

        if newName is not None and newName.strip() != name:
            # Name should be updated last, becuase it affects other field changes
            if newName.strip() == "":
                raise Exception("Snippet name cannot be empty")
            if len(newName.strip()) > 50:
                raise Exception("Snippet name cannot exceed 50 characters")
            self._assert_no_snippet(groupName, newName.strip())
            snippet.name = newName.strip()
        self.session.commit()

    def delete_snippet(self, groupName: str, name: str):
        # TODO: Review and test this function
        snippet = self._assert_snippet(groupName, name)

        # Keep reference to tags before deletion
        tags = list(snippet.tags)

        self.session.delete(snippet)
        self.session.flush()  # important: apply deletion before checking

        # Delete orphan tags
        for tag in tags:
            if not tag.snippets:  # no more references
                self.session.delete(tag)

        self.session.commit()

    def update_snippet_content(self, groupName: str, name: str, content: list):
        snippet = self._assert_snippet(groupName, name)
        snippet.content = content
        self.session.commit()

    # def move_snippet(self, src_group: str, snippet_name: str, dest_group: str):
    #     # TODO: Review and test this function

    #     # 1. Get source snippet
    #     snippet = self._assert_snippet(src_group, snippet_name)

    #     # 2. Get destination group
    #     dest = self.group_ops._assert_group(dest_group)

    #     # 3. Ensure no name conflict in destination
    #     conflict = self.session.scalar(
    #         select(Snippet).where(
    #             Snippet.group_id == dest.id, Snippet.name == snippet_name
    #         )
    #     )
    #     if conflict:
    #         raise Exception(
    #             f"Snippet '{snippet_name}' already exists in group '{dest_group}'"
    #         )

    #     # 4. Keep track of tags for orphan cleanup
    #     old_tags = list(snippet.tags)

    #     # 5. Move snippet
    #     snippet.group = dest
    #     self.session.flush()  # Apply move

    #     # 6. Cleanup orphan tags in old group
    #     for tag in old_tags:
    #         count = self.session.scalar(
    #             select(func.count())
    #             .select_from(snippet_tags)
    #             .where(snippet_tags.c.tag_id == tag.id)
    #         )
    #         if count == 0:
    #             self.session.delete(tag)

    #     self.session.commit()
