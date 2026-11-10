# WasmBox — Secure Multi-Tenant Plugin Sandbox

<<<<<<< HEAD
WasmBox is an engineering MVP demonstrating isolated WebAssembly plugin execution through a Python host.

## Features
- FastAPI backend and React + Monaco developer portal
- Wasmtime runtime with instruction fuel and memory limits
- No WASI interface: plugins receive no filesystem or network capabilities
- WAT editor and compilation to WASM
- Plugin persistence in SQLite
- Execution timing and result reporting
- Simulated webhook trigger
- Explicit host capability boundary (no ambient host access)
- Unit tests and Docker setup

## Important scope and security statement
This repository executes **WebAssembly modules**, authored as WAT (WebAssembly Text Format) or uploaded as `.wasm`. It does not claim to compile arbitrary Python source into WASM. A production Python-to-WASM compiler is a separate toolchain integration (for example, a pinned Pyodide/micropython-based build pipeline) and must be added and audited independently.

The sandbox deliberately does not link WASI, filesystem, sockets, or arbitrary host functions. A plugin must export `run` with signature `() -> i32`. The returned integer is surfaced as the plugin result. Fuel exhaustion terminates runaway computation. Wasmtime's memory limiter caps linear memory. These controls are defense-in-depth, not a substitute for OS-level isolation, process limits, patched dependencies, and a security review.

## Requirements
- Python 3.11+
- Node.js 20+
- Docker (optional)

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs: http://127.0.0.1:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## Example plugin
Paste this into the editor and click **Run**:
```wat
(module
  (func (export "run") (result i32)
=======
**A WebAssembly-powered sandbox for safely compiling, storing, and executing isolated plugins with resource restrictions.**

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![WebAssembly](https://img.shields.io/badge/WebAssembly-WASM-654FF0?logo=webassembly)
![Wasmtime](https://img.shields.io/badge/Runtime-Wasmtime-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## Project Overview

WasmBox is a WebAssembly-based plugin sandbox designed to execute untrusted WebAssembly modules in a restricted runtime environment.

The project provides a developer portal where users can write WebAssembly Text Format (WAT) modules, save plugins, execute them, and view execution results.

The backend uses Python, FastAPI, and Wasmtime to compile and execute modules with resource restrictions.

The system is designed around isolation, restricted host access, and controlled execution.

## Key Features

- **WebAssembly Runtime:** Executes WebAssembly modules using Wasmtime.
- **Sandboxed Execution:** Runs modules without enabling WASI by default.
- **Memory Restrictions:** Configurable memory cap, with a 10 MB target configuration.
- **Instruction Fuel:** Uses instruction fuel to restrict excessive computation.
- **Execution Monitoring:** Displays execution results and execution time.
- **Plugin Management:** Save, retrieve, and delete plugins.
- **Developer Portal:** React-based interface with Monaco Editor.
- **Invalid Module Detection:** Rejects invalid WebAssembly Text modules.
- **Restricted Host Access:** Host access is disabled by default.
- **Webhook Simulation:** Provides a simulated webhook workflow.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python 3.12 |
| API Framework | FastAPI |
| WebAssembly Runtime | Wasmtime |
| Database | SQLite |
| Frontend | React |
| Code Editor | Monaco Editor |
| Frontend Build Tool | Vite |
| API Server | Uvicorn |
| Containerization | Docker |

## Project Architecture

```text
WasmBox/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── sandbox.py
│   │   ├── database.py
│   │   ├── config.py
│   │   └── schemas.py
│   │
│   ├── tests/
│   │   └── test_sandbox.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   │
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
├── LICENSE
└── .gitignore
```

## Application Dashboard

The WasmBox developer dashboard provides:

- Plugin workspace
- WAT code editor
- Plugin name configuration
- Save plugin functionality
- Run plugin functionality
- Execution output panel
- Saved plugins panel
- Memory and instruction fuel configuration indicators

## Installation and Setup

### Prerequisites

Install the following:

- Python 3.12
- Node.js LTS and npm
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/NeerajNoutiyal/WasmBox.git
cd WasmBox
```

### 2. Backend Setup

Open a terminal:

```powershell
cd backend
py -3.12 -m venv .venv
```

Activate the virtual environment:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Start the backend:

```powershell
python -m uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a second terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

**Important:** Keep both backend and frontend terminals running while using the application.

## Example WebAssembly Module

The following WAT module returns the integer value `42`.

```wat
(module
  (func (export "run") (result i32)
    ;; Return a sample result
>>>>>>> 4a8b2555d17f4a89b452a16e82b55cee28c1bbcc
    i32.const 42
  )
)
```

<<<<<<< HEAD
A loop that never terminates will exhaust its fuel budget:
```wat
(module
  (func (export "run") (result i32)
    (loop $again
      br $again
    )
    i32.const 0
  )
)
```

## API
- `GET /health`
- `GET /api/plugins`
- `POST /api/plugins` — save `{name, source}`
- `GET /api/plugins/{plugin_id}`
- `DELETE /api/plugins/{plugin_id}`
- `POST /api/execute` — execute `{source}`
- `POST /api/plugins/{plugin_id}/webhook` — simulated webhook execution

## Security design
1. Compile WAT with Wasmtime; accept only valid WASM text.
2. Create a fresh Store for each invocation.
3. Set a bounded memory size and instruction fuel.
4. Instantiate without WASI or ambient imports.
5. Require a zero-argument `run` export returning `i32`.
6. Keep plugin records separated by opaque IDs.
7. Never execute submitted content as native Python or shell commands.

## Production hardening checklist
- Put execution in a separate unprivileged worker process/container with seccomp/AppArmor and no network.
- Add per-tenant authentication, authorization, quotas, audit logs, and rate limits.
- Pin and scan dependencies; use signed artifacts and immutable plugin versions.
- Add CPU, wall-clock, memory, output, and concurrency limits at the OS/container layer.
- Use a durable database and secrets manager.
- Add a reviewed Python-to-WASM compiler pipeline if Python source plugins are a hard requirement.
- Run security testing and independent review before accepting untrusted public workloads.

## Tests
```bash
cd backend
pytest
```

## License
MIT — see `LICENSE`.
=======
Expected execution result:

```text
EXECUTION SUCCESS

42
```

## Security Design

WasmBox uses several restrictions to reduce the risks associated with executing untrusted WebAssembly modules.

### 1. Runtime Isolation

Modules execute through the Wasmtime runtime rather than directly as native application code.

### 2. WASI Restrictions

WASI is not enabled by default, preventing modules from receiving standard WASI filesystem and network capabilities.

### 3. Memory Limits

The sandbox is configured with a 10 MB memory limit target.

### 4. Instruction Fuel

Wasmtime instruction fuel is used to restrict excessive computation and help stop infinite execution loops.

### 5. Host Access Restrictions

Host functionality is disabled by default to limit access to application resources.

## Testing

Run backend tests from the backend directory:

```powershell
python -m pytest -v
```

The test suite covers core sandbox behavior, including:

- Basic WebAssembly execution
- Missing exported function handling
- WASI import rejection
- Invalid WAT module rejection

## Docker Setup

If Docker Desktop is installed and running, start the application using:

```bash
docker compose up --build
```

Check the Docker Compose configuration for the configured service ports and environment variables.

## Current Implementation Scope

This repository implements a WAT/WebAssembly execution MVP.

The current version accepts WebAssembly Text Format modules and executes them through Wasmtime. It does **not** yet provide a complete arbitrary Python-source-to-WebAssembly compilation pipeline.

The following are potential future development areas:

- Python-to-WebAssembly compilation integration
- Stronger per-tenant authentication and authorization
- Dedicated worker-process isolation
- Additional execution-time enforcement
- Production-grade quotas and rate limiting
- Audit logging and execution analytics
- Expanded host-function allowlisting
- Production webhook integration

## Future Enhancements

- Multi-user authentication
- Improved tenant isolation
- Advanced resource monitoring
- Plugin version management
- Secure plugin deployment workflows
- Additional runtime security policies
- Enhanced developer analytics

## Project Information

**Project Name:** WasmBox — Secure Multi-Tenant Plugin Sandbox

**Project Category:** Advanced Python Engineering

**Domain:** Security and WebAssembly

**Developer:** Neeraj Noutiyal

**GitHub:** https://github.com/NeerajNoutiyal

**Repository:** https://github.com/NeerajNoutiyal/WasmBox

## License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**WasmBox — Secure Execution. Controlled Resources. Isolated Plugins.**
>>>>>>> 4a8b2555d17f4a89b452a16e82b55cee28c1bbcc
