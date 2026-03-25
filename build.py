import platform
import subprocess

# Build frontend
subprocess.run(["npm", "run", "build"], cwd="src-vite", check=True)

# Determine OS specific add-data separator
sep = ":" if platform.system() != "Windows" else ";"
add_data = f"src/dist{sep}dist"

# Build executable
subprocess.run(
    [
        "pyinstaller",
        "--onefile",
        "--clean",
        "--noconsole",
        "--add-data",
        add_data,
        "--name",
        "cmdsheet",
        "src/main.py",
    ],
    check=True,
)
