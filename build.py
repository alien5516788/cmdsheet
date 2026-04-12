import subprocess
import sys

args = sys.argv

# Build type
build_front = True
build_exec = True if "--type=exec" in args else False
build_pack = True if "--type=pack" in args else False

# Build frontend
print("-------------Building frontend-------------")
subprocess.run(["npm", "run", "build"], cwd="src-vite", check=True)

# Build executable
if not (build_exec or build_pack):
    sys.exit(0)

print("------------Building executable------------")
subprocess.run(
    [
        sys.executable,
        "-m",
        "nuitka",
        "src/main.py",
        "--standalone",
        "--onefile",
        "--remove-output",
        "--output-dir=build",
        "--output-filename=cmdsheet",
        "--include-data-dir=src/dist=dist",
    ],
    check=True,
)

# Build package
if not build_pack:
    sys.exit(0)

print("-----------------Packaging-----------------")
print("not available..")
