import subprocess
import sys

# Build frontend
subprocess.run(["npm", "run", "build"], cwd="src-vite", check=True)

# Build executable
subprocess.run(
    [
        sys.executable,
        "-m",
        "nuitka",
        "src/main.py",
        "--standalone",
        "--onefile",
        "--output-filename=cmdsheet",
        "--include-data-dir=src/dist=dist",
    ],
    check=True,
)
