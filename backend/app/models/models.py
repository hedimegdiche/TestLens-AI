from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="consultant", nullable=False)  # 'consultant' or 'manager'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    files = relationship("TestCaseFile", back_populates="owner", cascade="all, delete-orphan")

class TestCaseFile(Base):
    __tablename__ = "test_case_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(512), nullable=False)
    row_count = Column(Integer, default=0)
    status = Column(String(50), default="uploaded")  # 'uploaded', 'processed', 'failed'
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="files")
