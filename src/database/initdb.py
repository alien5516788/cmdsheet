from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from database.models import Base, Group


class InitDB:
    def __init__(self, dev: bool = False):
        # Determine database path
        base_dir = Path("./.cmdsheet") if dev else Path.home() / ".cmdsheet"
        base_dir.mkdir(parents=True, exist_ok=True)
        self.db_path = base_dir / "cmdsheet.db"

        # Engine creation (connects to SQLite)
        self.engine = create_engine(
            f"sqlite:///{self.db_path}",
            echo=False,
            future=True,
        )

        # Create tables if they don't exist
        Base.metadata.create_all(self.engine)

        # Session factory (produces new sessions bound to this engine)
        self.Session = sessionmaker(bind=self.engine, expire_on_commit=False)

        # Create default group if it doesn't exist
        self._create_default_group()

        print(f"Database initialized at {self.db_path}")

    def get_session(self) -> Session:
        return self.Session()

    def _create_default_group(self) -> None:
        with self.get_session() as session:
            default_group = session.scalar(select(Group).where(Group.name == "default"))
            if not default_group:
                group = Group(
                    name="default",
                    description="This is where any snippet that doesn't fit to a specific group belongs to",
                    tags="",
                )
                session.add(group)
                session.commit()
