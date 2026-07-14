import os
import shutil
from datetime import datetime
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
import pandas as pd
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.api.auth import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])

# Directory to store uploaded files
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("", response_model=schemas.FileResponse)
async def upload_excel_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Ensure it's an Excel file
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only Excel files (.xlsx, .xls) are allowed."
        )

    # Make unique filename to prevent overwrite
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    # Save file to disk
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # Parse file using pandas to read sheet and count rows
    row_count = 0
    file_status = "processed"
    try:
        # Load excel file to verify content
        df = pd.read_excel(file_path)
        row_count = len(df)
    except Exception as e:
        # If we failed to parse, we'll keep the file but mark it failed
        file_status = "failed"
        # We don't raise exception here, we log it and let user know it was saved but parsing failed
        # Alternatively, we could raise exception and delete the file. Let's raise exception if it's corrupt.
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse Excel spreadsheet structure: {str(e)}"
        )

    # Store file metadata in database
    db_file = models.TestCaseFile(
        filename=file.filename,
        filepath=file_path,
        row_count=row_count,
        status=file_status,
        uploaded_by=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file

@router.get("/history", response_model=list[schemas.FileResponse])
def get_upload_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Managers see all, consultants see their own uploads
    if current_user.role == "manager":
        return db.query(models.TestCaseFile).order_by(models.TestCaseFile.uploaded_at.desc()).all()
    else:
        return db.query(models.TestCaseFile).filter(models.TestCaseFile.uploaded_by == current_user.id).order_by(models.TestCaseFile.uploaded_at.desc()).all()

