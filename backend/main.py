"""
Jarvis Local - Privacy-Focused Personal AI Assistant
Backend API Server
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Jarvis Local API",
    description="Privacy-focused AI assistant backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= Models =============

class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: str = ""
    dueDate: Optional[str] = None
    priority: str = "medium"  # high, medium, low
    status: str = "pending"   # pending, in_progress, completed
    tags: List[str] = []
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class CalendarEvent(BaseModel):
    id: Optional[int] = None
    title: str
    description: str = ""
    startTime: str
    endTime: Optional[str] = None
    recurrence: Optional[str] = None
    location: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class FileItem(BaseModel):
    id: Optional[int] = None
    path: str
    name: str
    contentHash: Optional[str] = None
    tags: List[str] = []
    indexedAt: Optional[str] = None

class Skill(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    enabled: bool = True
    config: Dict[str, Any] = {}

class Message(BaseModel):
    role: str  # user, assistant
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    message: str
    done: bool = True

class LLMStatus(BaseModel):
    running: bool
    model: str = ""
    error: Optional[str] = None

# ============= In-memory storage (replace with SQLite) =============

tasks_db: List[Task] = []
events_db: List[CalendarEvent] = []
files_db: List[FileItem] = []
skills_db: List[Skill] = [
    Skill(id=1, name="Calculator", description="Perform mathematical calculations", enabled=True),
    Skill(id=2, name="Timer", description="Set timers and alarms", enabled=True),
    Skill(id=3, name="Notes", description="Take and manage notes", enabled=True),
    Skill(id=4, name="Weather", description="Get weather information (cached)", enabled=False),
]

# ============= Routes =============

@app.get("/")
async def root():
    return {
        "name": "Jarvis Local API",
        "version": "1.0.0",
        "status": "running"
    }

# Task endpoints
@app.get("/api/tasks")
async def get_tasks():
    return tasks_db

@app.post("/api/tasks")
async def create_task(task: Task):
    task.id = len(tasks_db) + 1
    from datetime import datetime
    now = datetime.utcnow().isoformat()
    task.createdAt = now
    task.updatedAt = now
    tasks_db.append(task)
    return task

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    for i, t in enumerate(tasks_db):
        if t.id == task_id:
            task.id = task_id
            task.updatedAt = datetime.utcnow().isoformat()
            tasks_db[i] = task
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    global tasks_db
    tasks_db = [t for t in tasks_db if t.id != task_id]
    return {"status": "deleted"}

# Calendar endpoints
@app.get("/api/events")
async def get_events():
    return events_db

@app.post("/api/events")
async def create_event(event: CalendarEvent):
    event.id = len(events_db) + 1
    from datetime import datetime
    now = datetime.utcnow().isoformat()
    event.createdAt = now
    event.updatedAt = now
    events_db.append(event)
    return event

@app.delete("/api/events/{event_id}")
async def delete_event(event_id: int):
    global events_db
    events_db = [e for e in events_db if e.id != event_id]
    return {"status": "deleted"}

# File endpoints
@app.get("/api/files")
async def get_files():
    return files_db

@app.post("/api/files/index")
async def index_folder(path: str):
    # In a real implementation, this would scan the folder and index files
    return {"status": "indexing", "path": path}

@app.get("/api/files/search")
async def search_files(q: str):
    # Simple search implementation
    results = [f for f in files_db if q.lower() in f.name.lower()]
    return results

# Skills endpoints
@app.get("/api/skills")
async def get_skills():
    return skills_db

@app.put("/api/skills/{skill_id}")
async def toggle_skill(skill_id: int, enabled: bool):
    for skill in skills_db:
        if skill.id == skill_id:
            skill.enabled = enabled
            return skill
    raise HTTPException(status_code=404, detail="Skill not found")

# LLM endpoints
@app.get("/api/llm/status")
async def get_llm_status() -> LLMStatus:
    # In a real implementation, check Ollama status
    return LLMStatus(running=False, model="")

@app.post("/api/llm/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    # In a real implementation, call Ollama API
    # For now, return a demo response
    
    # Get last user message
    user_messages = [m for m in request.messages if m.role == "user"]
    if user_messages:
        last_message = user_messages[-1].content
        response = f"I understand you said: '{last_message}'. This is a local demo response. In production, this would connect to your local Ollama instance."
    else:
        response = "Hello! I'm Jarvis, your local AI assistant."
    
    return ChatResponse(message=response)

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "llm_connected": False}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
