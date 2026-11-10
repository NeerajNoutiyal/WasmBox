import time
import wasmtime
from .config import FUEL_LIMIT, MEMORY_LIMIT_BYTES

class SandboxError(Exception):
    pass

def execute_wat(source: str) -> tuple[int, float]:
    """Compile and execute a WAT module with no WASI or ambient host imports.

    Contract: module exports `run: () -> i32`.
    A fresh engine/store/module instance is used for each request.
    """
    started = time.perf_counter()
    try:
        config = wasmtime.Config()
        config.consume_fuel = True
        engine = wasmtime.Engine(config)
        wasm_bytes = wasmtime.wat2wasm(source)
        module = wasmtime.Module(engine, wasm_bytes)

        # Do not expose WASI or any host imports. Importing any capability
        # therefore fails during instantiation.
        store = wasmtime.Store(engine)
        store.set_fuel(FUEL_LIMIT)
        store.set_limits(memory_size=MEMORY_LIMIT_BYTES)

        linker = wasmtime.Linker(engine)
        instance = linker.instantiate(store, module)
        run = instance.exports(store).get("run")
        if run is None:
            raise SandboxError("Module must export a function named 'run'.")
        result = run(store)
        if not isinstance(result, int):
            raise SandboxError("Export 'run' must return an i32 integer.")
        elapsed = (time.perf_counter() - started) * 1000
        return result, round(elapsed, 3)
    except SandboxError:
        raise
    except Exception as exc:
        message = str(exc)
        if "fuel" in message.lower():
            raise SandboxError("Execution stopped: instruction fuel limit exceeded.") from exc
        raise SandboxError(f"WASM compilation or execution failed: {message[:500]}") from exc
