from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Engine configuration for MySQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # checks connection health before issuing queries
    pool_recycle=3600,   # recycles connections after 1 hour to prevent MySQL disconnect errors
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
