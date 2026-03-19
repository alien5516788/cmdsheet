from snippetengine.__utils__ import _read_json, _write_json


class Tag:
    name: str
    tagcount: int


class TagOps:
    def __init__(self, baseDir):
        self.BASE_DIR = baseDir
        self.TAGLIST_FILE = self.BASE_DIR / "taglist.json"

    def list_tags(self) -> list[dict]:
        taglist = _read_json(self.TAGLIST_FILE)
        return taglist

    def add_tags(self, tags: list[str]):
        taglist = _read_json(self.TAGLIST_FILE)
        tag_map = {t["name"]: t for t in taglist}

        for tag in tags:
            if tag in tag_map:
                tag_map[tag]["tagcount"] += 1
            else:
                tag_map[tag] = {"name": tag, "tagcount": 1}

        _write_json(self.TAGLIST_FILE, list(tag_map.values()))

    def remove_tags(self, tags: list[str]):
        taglist = _read_json(self.TAGLIST_FILE)
        tag_map = {t["name"]: t for t in taglist}

        for tag in tags:
            if tag in tag_map:
                tag_map[tag]["tagcount"] -= 1

                # Remove tag if count reaches 0 or below
                if tag_map[tag]["tagcount"] <= 0:
                    del tag_map[tag]

        _write_json(self.TAGLIST_FILE, list(tag_map.values()))
