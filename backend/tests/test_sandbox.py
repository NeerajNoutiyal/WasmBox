import pytest
from app.sandbox import execute_wat, SandboxError

def test_executes_simple_module():
    result, elapsed = execute_wat('(module (func (export "run") (result i32) i32.const 42))')
    assert result == 42
    assert elapsed >= 0

def test_requires_run_export():
    with pytest.raises(SandboxError, match="run"):
        execute_wat('(module (func (export "other")))')

def test_rejects_wasi_import():
    wat = '(module (import "wasi_snapshot_preview1" "proc_exit" (func (param i32))) (func (export "run") (result i32) i32.const 0))'
    with pytest.raises(SandboxError):
        execute_wat(wat)

def test_invalid_wat_is_rejected():
    with pytest.raises(SandboxError):
        execute_wat('not a wasm module')
