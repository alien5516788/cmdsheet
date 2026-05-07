# CMDsheet – Setup & Usage
       
## [1] Installation

Install **pywebview** based on your operating system.

```bash
Windows : pywebview[edgechromium]>=6.1
Linux   : pywebview[gtk]>=6.1
macOS   : pywebview>=6.1
```

### Step 1 — Remove Existing Installation

Ensure any incompatible version is removed before installing the correct one.

```bash
pdm remove pywebview
```

### Step 2 — Install Platform-Specific Version

Example (Windows):

```bash
pdm add "pywebview[edgechromium]>=6.1"
```

## [2] Environment Configuration

Define the application mode using an environment variable or a `.env` file.

```bash
MODE="prod"   # Available values: "prod", "dev"
```

## [3] Development Mode

### Step 1 — Set Mode

```bash
MODE="dev"
```

### Step 2 — Start Frontend (Vite)

```bash
cd src-vite
npm run dev
```

### Step 3 — Start Backend (Python)

Run in a separate terminal instance.

```bash
pdm run start
```

## [4] Production Mode

### Step 1 — Set Mode

```bash
MODE="prod"
```

### Step 2 — Build Application

```bash
pdm run build_front
```

### Step 3 — Start Backend (Python)

```bash
pdm run start
```

## [5] Build executable or installable package

Final executable or installable package will be generated inside **build** directory.

### Step 1 — Set Mode

```bash
MODE="prod"
```

### Step 2 — Build Application

```bash
# Executable only
pdm run build_exec
```

```bash
# Installable package
pdm run build_pack
```

## [6] Notes

* Always ensure the correct **pywebview backend** is installed for your platform.
* Development mode requires both the frontend (Vite) and backend (Python) processes running simultaneously.
* Production mode builds a frontend only or standalone executable or an installable package inside the build 
  directory depending on the command run.
