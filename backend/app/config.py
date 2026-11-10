import os

APP_NAME = "WasmBox API"
DB_PATH = os.getenv("WASMBOX_DB", "wasmbox.db")
FUEL_LIMIT = int(os.getenv("WASMBOX_FUEL", "1000000"))
MEMORY_LIMIT_BYTES = int(os.getenv("WASMBOX_MEMORY_BYTES", str(10 * 1024 * 1024)))
MAX_SOURCE_CHARS = int(os.getenv("WASMBOX_MAX_SOURCE_CHARS", "100000"))
