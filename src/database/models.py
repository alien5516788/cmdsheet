from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


snippet_tags = Table(
    "snippet_tags",
    Base.metadata,
    Column(
        "snippet_id", ForeignKey("snippets.id", ondelete="CASCADE"), primary_key=True
    ),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("snippet_id", "tag_id", name="uix_snippet_tag"),
)


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # back_populates relationship to snippets
    snippets: Mapped[list["Snippet"]] = relationship(
        "Snippet",
        secondary=snippet_tags,
        back_populates="tags",
        cascade="save-update, merge",
    )


class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    snippets: Mapped[list["Snippet"]] = relationship(
        "Snippet", back_populates="group", cascade="all, delete-orphan"
    )


class Snippet(Base):
    __tablename__ = "snippets"
    __table_args__ = (
        UniqueConstraint(
            "group_id", "name", name="uix_group_snippet"
        ),  # Prevent duplicate snippet names in the same group
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    content: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
        server_default=text("'{}'"),
    )
    favourite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_accessed: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    group_id: Mapped[int] = mapped_column(
        ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    group: Mapped["Group"] = relationship("Group", back_populates="snippets")

    tags: Mapped[list["Tag"]] = relationship(
        "Tag",
        secondary=snippet_tags,
        back_populates="snippets",
        passive_deletes=True,
    )
