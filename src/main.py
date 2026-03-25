import os
import platform
import sys
from pathlib import Path

import webview
from dotenv import load_dotenv
from webview.guilib import GUIType

from api import Api

# Environment
load_dotenv()
DEV = os.getenv("MODE") == "dev"

if DEV:
    url = "http://localhost:5173/"
else:
    base_dir = os.path.dirname(__file__)
    url = f"file://{os.path.join(base_dir, 'dist', 'index.html')}"


# GUI backend
system = platform.system()
gui_backend: GUIType

if system == "Windows":
    gui_backend = "edgechromium"
elif system == "Darwin":  # Mac
    gui_backend = "cocoa"
elif system == "Linux":
    gui_backend = "gtk"
else:
    print(f"System {system} is not supported")
    exit(1)


def main():
    # Create an instance of the API class
    api = Api(DEV)

    # Create a window with the API instance passed to js_api
    webview.create_window("App", url, height=768, width=1024, js_api=api)
    webview.start(gui=gui_backend)


if __name__ == "__main__":
    main()
