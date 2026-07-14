import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, upload, analytics
from app.db.database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to initialize database tables on startup.
# In a production app, database migrations (like Alembic) are used.
# Since we are using MySQL, we run this inside a try-except block so that
# the app can still start and print a configuration warning if the MySQL server is offline.
try:
    # Automatically create database if it doesn't exist
    import pymysql
    conn = pymysql.connect(
        host=settings.MYSQL_HOST,
        port=int(settings.MYSQL_PORT),
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD
    )
    try:
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DATABASE}")
        logger.info(f"Database '{settings.MYSQL_DATABASE}' verified/created.")
    finally:
        conn.close()

    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.warning(
        f"Could not connect to MySQL database to initialize tables: {e}. "
        f"Make sure MySQL is running at {settings.MYSQL_HOST}:{settings.MYSQL_PORT} "
        f"and the database '{settings.MYSQL_DATABASE}' exists."
    )


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware to allow the React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to the TestLens AI API",
        "docs": "/docs",
        "status": "online"
    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
