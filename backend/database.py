from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import Model, Field, AIOEngine
from typing import List, Optional, Dict, Any
from datetime import datetime

class User(Model):
    email: str = Field(unique=True)
    password_hash: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ScanReport(Model):
    user_email: str
    project_name: str
    scan_type: Optional[str] = "single"
    risk_score: Optional[int] = 0
    components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class DiffReport(Model):
    user_email: str
    project_name: str
    v1_score: Optional[int] = 0
    v2_score: Optional[int] = 0
    added: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    removed: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    updated: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    v1_components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    v2_components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Vulnerability(Model):
    name: str = Field(index=True)
    cve: str
    cvss: float
    severity: str
    explanation: str
    remediation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Database Connection
client = AsyncIOMotorClient("mongodb+srv://avinesh14:Abishek1424@cluster0.wf5jq0s.mongodb.net")
engine = AIOEngine(client=client, database="verix_sbom_db")


async def get_engine():
    return engine
