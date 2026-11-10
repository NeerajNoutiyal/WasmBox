from datetime import datetime, timezone
from uuid import uuid4
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import APP_NAME
from .database import connect, init_db
from .schemas import ExecuteRequest, PluginCreate, PluginOut, ExecuteResponse
from .sandbox import execute_wat, SandboxError

app = FastAPI(title=APP_NAME, version="1.0.0", description="Capability-restricted WebAssembly plugin sandbox")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok", "service": "wasmbox-api"}

@app.get("/api/plugins", response_model=list[PluginOut])
def list_plugins():
    with connect() as conn:
        rows = conn.execute("SELECT id, name, created_at FROM plugins ORDER BY created_at DESC").fetchall()
    return [dict(row) for row in rows]

@app.post("/api/plugins", response_model=PluginOut, status_code=201)
def create_plugin(payload: PluginCreate):
    plugin_id = str(uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    with connect() as conn:
        conn.execute(
            "INSERT INTO plugins (id, name, source, created_at) VALUES (?, ?, ?, ?)",
            (plugin_id, payload.name.strip(), payload.source, created_at),
        )
        conn.commit()
    return {"id": plugin_id, "name": payload.name.strip(), "created_at": created_at}

@app.get("/api/plugins/{plugin_id}")
def get_plugin(plugin_id: str):
    with connect() as conn:
        row = conn.execute("SELECT id, name, source, created_at FROM plugins WHERE id = ?", (plugin_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "Plugin not found")
    return dict(row)

@app.delete("/api/plugins/{plugin_id}")
def delete_plugin(plugin_id: str):
    with connect() as conn:
        cursor = conn.execute("DELETE FROM plugins WHERE id = ?", (plugin_id,))
        conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(404, "Plugin not found")
    return {"deleted": True, "id": plugin_id}

@app.post("/api/execute", response_model=ExecuteResponse)
def execute(payload: ExecuteRequest):
    try:
        result, elapsed = execute_wat(payload.source)
        return ExecuteResponse(success=True, result=result, execution_ms=elapsed, message="Plugin executed inside the WASM sandbox.")
    except SandboxError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@app.post("/api/plugins/{plugin_id}/webhook", response_model=ExecuteResponse)
def trigger_webhook(plugin_id: str):
    with connect() as conn:
        row = conn.execute("SELECT source FROM plugins WHERE id = ?", (plugin_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "Plugin not found")
    try:
        result, elapsed = execute_wat(row["source"])
        return ExecuteResponse(success=True, result=result, execution_ms=elapsed, message="Simulated webhook executed the saved plugin.")
    except SandboxError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
