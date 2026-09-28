import os
from pathlib import Path

import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(BACKEND_ROOT / ".env")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
)


def upload_image(file, folder: str = "zyro/products") -> dict:
    result = cloudinary.uploader.upload(file, folder=folder)
    return {
        "public_id": result["public_id"],
        "url": result["secure_url"],
    }


def delete_image(public_id: str) -> None:
    cloudinary.uploader.destroy(public_id)


def paginate(skip: int = 0, limit: int = 20) -> dict:
    return {"skip": skip, "limit": limit}
