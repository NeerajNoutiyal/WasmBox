# WasmBox — Secure Multi-Tenant Plugin Sandbox

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
    i32.const 42
  )
)
```

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
