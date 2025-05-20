from bson import ObjectId
from fastapi import Depends, FastAPI, Path, UploadFile, Request,  HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .db.collections.files import FileSchema, files_collection
from .queue.q import q
from .queue.workers import process_file
from .utils.file import save_to_disk

app = FastAPI()

# Allow requests from your frontend
origins = [
    "http://localhost:3000",
    "https://guvihcl-production.up.railway.app"
    
]

app.add_middleware(
    CORSMiddleware,
    # You can use ["*"] to allow all origins for testing
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],            # Or specify ["GET", "POST", etc.]
    allow_headers=["*"],            # Or specify headers like ["Content-Type"]
)

def serialize_file(file):
    # Helper to convert ObjectId and filter fields as needed
    return {
        "id": str(file["_id"]),
        "name": file.get("name"),
        "status": file.get("status"),
        "file_path": file.get("file_path"),
        "uploaded_by": file.get("uploaded_by"),
        "created_at": file.get("created_at"),
        # add other fields as needed
    }


@app.get("/")
def hello():
    return {"status": "healthy"}


@app.get("/file/{id}")
async def get_file_by_id(id: str = Path(..., description="ID of the file")):

    db_file = await files_collection.find_one({"_id": ObjectId(id)})

    return {
        "_id": str(db_file["_id"]),
        "name": db_file["name"],
        "status": db_file["status"],
        "result": db_file["result"] if "result" in db_file else None,
    }

@app.get("/files", response_model=List[dict])
async def get_user_files(request: Request):
    user_id = request.headers.get("X-User-ID")
    files_cursor = files_collection.find({"uploaded_by": user_id})
    files = []
    async for file in files_cursor:
        files.append(serialize_file(file))
    return files

@app.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile,
):
    user_id = request.headers.get("X-User-ID")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="UnAuthorized")
    

    # print(user_id)

    db_file = await files_collection.insert_one(
        document=FileSchema(
            name=file.filename,
            status="saving",
            uploaded_by=str(user_id)
        )
    )

    file_path = f"/mnt/uploads/{str(db_file.inserted_id)}/{file.filename}"
    await save_to_disk(file=await file.read(), path=file_path)

    job = q.enqueue(process_file, str(db_file.inserted_id), file_path)

    await files_collection.update_one({"_id": db_file.inserted_id}, {
        "$set": {
            "status": "queued",
            "file_path": file_path
        }
    })

    return {"file_id": str(db_file.inserted_id)}


# @app.get("/myprofile")
# async def me(user_id: dict = Depends(get_current_user_id)):
#     return user_id
