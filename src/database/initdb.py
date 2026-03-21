from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from database.models import Base, Group


class InitDB:
    def __init__(self, dev: bool = False):
        # Determine database path
        base_dir = Path("./.cmdsheet") if dev else Path.home() / ".cmdsheet"
        base_dir.mkdir(parents=True, exist_ok=True)

        # Create engine and tables if they don't exist
        db_path = base_dir / "cmdsheet.db"
        engine = create_engine(f"sqlite:///{db_path}", echo=False, future=True)

        Base.metadata.create_all(engine)

        # Session factory
        self.session_maker = sessionmaker(bind=engine, expire_on_commit=False)

        # Create default group if it doesn't exist
        self.create_default_group()

        print(f"Database initialized at {db_path}")

    def get_session(self) -> Session:
        return self.session_maker()

    def create_default_group(self) -> None:
        session = self.get_session()
        try:
            default_group = session.scalar(select(Group).where(Group.name == "default"))
            if not default_group:
                group = Group(
                    name="default",
                    description="This is where any snippet that doesn't fit to any other group belongs to.",
                )
                session.add(group)
                session.commit()
        finally:
            session.close()
