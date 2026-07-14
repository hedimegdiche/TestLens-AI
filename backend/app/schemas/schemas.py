from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    role: str = Field(default="consultant", description="User role, either 'consultant' or 'manager'")

class UserCreate(UserBase):
    password: str = Field(min_length=6, description="Password must be at least 6 characters long")

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

class FileResponse(BaseModel):
    id: int
    filename: str
    row_count: int
    status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class CategoryMetric(BaseModel):
    name: str
    count: int
    percentage: float

class DifficultyDistribution(BaseModel):
    easy: float
    medium: float
    hard: float

class AnalyticsSummaryResponse(BaseModel):
    total_cases: int
    automation_readiness: float
    system_accuracy: float
    category_distribution: list[CategoryMetric]
    difficulty_distribution: DifficultyDistribution

