import os

import webview

from api import CmdsheetApi

# Page is loaded from a dev server during development
DEV = True

if DEV:
    url = "http://localhost:5173/"
else:
    base_dir = os.path.dirname(__file__)
    url = os.path.join(base_dir, "dist", "index.html")


def main():
    # Create an instance of the API class
    api = CmdsheetApi()

    # Create a window with the API instance passed to js_api
    webview.create_window("App", url, height=768, width=1024, js_api=api)
    webview.start(gui="qt")


if __name__ == "__main__":
    main()
