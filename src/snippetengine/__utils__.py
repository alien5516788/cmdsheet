import json
from pathlib import Path


def _read_json(path: Path) -> dict:
    if not path.exists():
        raise Exception(f"File not found: {path}")
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _write_json(path: Path, data):
    tmp = path.with_suffix(".tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    tmp.rename(path)
