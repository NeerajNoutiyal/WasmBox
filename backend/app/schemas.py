from pydantic import BaseModel, Field

class ExecuteRequest(BaseModel):
    source: str = Field(min_length=1, max_length=100000)

class PluginCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    source: str = Field(min_length=1, max_length=100000)

class PluginOut(BaseModel):
    id: str
    name: str
    created_at: str

class ExecuteResponse(BaseModel):
    success: bool
    result: int | None = None
    execution_ms: float
    message: str
