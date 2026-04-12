# PyWebView Desktop Application – Setup & Usage Guide

## [1] Installation

Install **pywebview** based on your operating system.

```
Windows : pywebview[edgechromium]>=6.1
Linux   : pywebview[gtk]>=6.1
macOS   : pywebview>=6.1
```

### Step 1 — Remove Existing Installation

Ensure any incompatible version is removed before installing the correct one:

```
pdm remove pywebview
```

### Step 2 — Install Platform-Specific Version

Example (Windows):

```
pdm add "pywebview[edgechromium]>=6.1"
```

---

## [2] Environment Configuration

Define the application mode using an environment variable or a `.env` file:

```
MODE="prod"   # Available values: "prod", "dev"
```

---

## [3] Development Mode

### Step 1 — Set Mode

```
MODE="dev"
```

### Step 2 — Start Frontend (Vite)

```
cd src-vite
npm run dev
```

### Step 3 — Start Backend (Python)

Run in a separate terminal instance:

```
pdm run start
```

---

## [4] Production Build

### Step 1 — Set Mode

```
MODE="prod"
```

### Step 2 — Build Application

```
pdm run build
```

---

## [5] Notes

* Always ensure the correct **pywebview backend** is installed for your platform.
* Development mode requires both the frontend (Vite) and backend (Python) processes running simultaneously.
* Production mode builds a standalone executable in the project directory.
