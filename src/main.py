import os

import webview

DEV = True

if DEV:
    url = "http://localhost:5173/"
else:
    base_dir = os.path.dirname(__file__)
    url = os.path.join(base_dir, "dist", "index.html")


def main():
    webview.create_window("App", url)
    webview.start(gui="qt")


if __name__ == "__main__":
    main()
