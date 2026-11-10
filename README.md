# WasmBox – Secure Multi-Tenant Plugin Sandbox

A WebAssembly-based plugin sandbox designed to execute untrusted WebAssembly modules with controlled resource usage and restricted host access.

**Project:** Advanced Python Engineering – Project 3  
**Organization:** AXLERO SOLUTIONS  
**Developer:** Neeraj Noutiyal

---

## Overview

WasmBox is a secure plugin execution platform built using Python, FastAPI, WebAssembly, and React.

It provides a controlled environment where users can create, save, manage, and execute WebAssembly plugins through a web-based developer dashboard.

The project demonstrates WebAssembly sandboxing, resource restrictions, plugin management, and controlled execution.

## Key Features

- **WebAssembly Runtime:** Executes WebAssembly modules using Wasmtime.
- **Sandboxed Execution:** Runs plugins in isolated execution stores.
- **Instruction Fuel:** Limits WebAssembly instruction execution.
- **Memory Restrictions:** Configurable memory limit (10 MB in the current configuration).
- **Restricted Host Access:** Does not provide unrestricted WASI access.
- **Plugin Management:** Save, load, and delete plugins.
- **Developer Dashboard:** React-based interface with Monaco code editor.
- **Execution Metrics:** Displays execution results and runtime information.
- **Simulated Webhooks:** Demonstrates plugin-triggered webhook workflows.
- **API Documentation:** Interactive FastAPI documentation.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| WebAssembly Runtime | Wasmtime |
| Frontend | React, Vite |
| Code Editor | Monaco Editor |
| Database | SQLite |
| API Server | Uvicorn |
| Testing | Pytest |
| Containerization | Docker |

## Project Structure

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

## Installation and Setup

### Prerequisites

Install the following:

- Python 3.12+
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/NeerajNoutiyal/WasmBox.git
cd WasmBox
```

### 2. Set Up the Backend

Open a terminal:

```powershell
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the backend server:

```powershell
python -m uvicorn app.main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Set Up the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

## How to Use

1. Start the backend and frontend servers.
2. Open the WasmBox dashboard in your browser.
3. Write or load a WebAssembly Text Format (WAT) plugin.
4. Execute the plugin using the Run option.
5. View the execution result and runtime information.
6. Save plugins for future use.
7. Load or delete saved plugins.
8. Test the simulated webhook functionality.

## Security Design

WasmBox demonstrates several sandboxing controls:

- WebAssembly execution through Wasmtime.
- Separate execution stores for plugin runs.
- Instruction fuel limits to restrict computation.
- Configured memory limits.
- No unrestricted WASI access.
- Validation and compilation of WAT modules.
- Controlled host functionality.

**Important:** This is an educational MVP, not a production-certified isolation boundary. Production deployment requires additional operating-system/container isolation, robust tenant authentication and authorization, concurrency controls, and independently validated timeout and resource-enforcement policies.

## Current Implementation Scope

The current working implementation accepts WebAssembly Text Format (WAT), compiles it into WebAssembly modules, and executes those modules in the sandbox.

**Raw Python source-to-WebAssembly compilation is not yet implemented.** A dedicated Python compilation pipeline is a future development objective.

## Testing

Run backend tests:

```powershell
cd backend
pytest -v
```

The test suite covers core sandbox behavior, including successful execution, missing exports, invalid WAT, and rejection of unsupported WASI imports.

## Future Enhancements

- Python-to-WebAssembly compilation pipeline.
- Stronger execution timeout enforcement.
- Per-tenant authentication and authorization.
- Advanced resource monitoring.
- Production-grade isolation.
- Real webhook integrations.
- Plugin versioning and audit logs.
- Deployment and scalability improvements.

## Learning Outcomes

This project demonstrates practical knowledge of:

- Python backend development.
- REST API development.
- WebAssembly execution.
- Secure sandbox architecture.
- Resource management.
- React frontend development.
- Database integration.
- Software testing and documentation.

## Author

**Neeraj Noutiyal**

- GitHub: [@NeerajNoutiyal](https://github.com/NeerajNoutiyal)
- LinkedIn: [Neeraj Noutiyal](https://www.linkedin.com/in/neeraj-noutiyal-8302b12b2/)

---

*Developed as part of the Advanced Python Engineering Project 3 – AXLERO SOLUTIONS.*
