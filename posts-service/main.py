from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
import jwt
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# ---------------- ENV ---------------- #

load_dotenv()  # loads .env in the same directory

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# ---------------- SUPABASE ---------------- #

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- APP ---------------- #

app = FastAPI(title="Posts Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- AUTH ---------------- #

def get_user_info_from_token(authorization: Optional[str]):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, options={"verify_signature": False}, algorithms=["HS256"])

        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        return user_id, email

    except Exception as e:
        print("JWT ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- ROUTES ---------------- #

# ✅ GET POSTS
@app.get("/posts")
async def get_posts():
    try:
        response = supabase.table("posts").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print("GET ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ✅ CREATE POST (🔥 FIXED)
@app.post("/posts")
async def create_post(
    title: str = Form(...),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    authorization: Optional[str] = Header(None)
):
    try:
        user_id, email = get_user_info_from_token(authorization)

        image_url = None

        if file and file.filename:
            file_content = await file.read()
            file_name = f"{user_id}/{datetime.now().timestamp()}_{file.filename}"
            
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_content)
                temp_path = temp_file.name
                
            try:
                supabase.storage.from_("blog-images").upload(
                    path=file_name,
                    file=temp_path,
                    file_options={"content-type": file.content_type}
                )
            finally:
                os.unlink(temp_path)
                
            image_url = supabase.storage.from_("blog-images").get_public_url(file_name)

        post_data = {
            "user_id": user_id,                   # ✅ FIXED
            "title": title,
            "content": content or None,
            "image_url": image_url,
            "author_email": email or "Anonymous"  # ✅ FIXED
        }

        print("SAVING POST:", post_data)  # DEBUG

        response = supabase.table("posts").insert(post_data).execute()

        if response.data:
            return response.data[0]

        raise HTTPException(status_code=500, detail="Insert failed")

    except Exception as e:
        print("CREATE ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ✅ UPDATE POST (OWNER ONLY)
@app.put("/posts/{post_id}")
async def update_post(
    post_id: str,
    title: str = Form(...),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    authorization: Optional[str] = Header(None)
):
    try:
        user_id, _ = get_user_info_from_token(authorization)

        post_response = supabase.table("posts").select("*").eq("id", post_id).execute()

        if not post_response.data:
            raise HTTPException(status_code=404, detail="Post not found")

        post = post_response.data[0]

        if str(post["user_id"]) != str(user_id):
            raise HTTPException(status_code=403, detail="Not authorized")

        image_url = post.get("image_url")

        if file and file.filename:
            file_content = await file.read()
            file_name = f"{user_id}/{datetime.now().timestamp()}_{file.filename}"
            
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_content)
                temp_path = temp_file.name
                
            try:
                supabase.storage.from_("blog-images").upload(
                    path=file_name,
                    file=temp_path,
                    file_options={"content-type": file.content_type}
                )
            finally:
                os.unlink(temp_path)
                
            image_url = supabase.storage.from_("blog-images").get_public_url(file_name)

        update_data = {
            "title": title,
            "content": content or None,
            "image_url": image_url,
            "updated_at": datetime.utcnow().isoformat()
        }

        response = supabase.table("posts").update(update_data).eq("id", post_id).execute()

        return response.data[0]

    except Exception as e:
        print("UPDATE ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ✅ DELETE POST (OWNER ONLY)
@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, authorization: Optional[str] = Header(None)):
    try:
        user_id, _ = get_user_info_from_token(authorization)

        post_response = supabase.table("posts").select("*").eq("id", post_id).execute()

        if not post_response.data:
            raise HTTPException(status_code=404, detail="Post not found")

        post = post_response.data[0]

        if str(post["user_id"]) != str(user_id):
            raise HTTPException(status_code=403, detail="Not authorized")

        supabase.table("posts").delete().eq("id", post_id).execute()

        return {"message": "Post deleted successfully"}

    except Exception as e:
        print("DELETE ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ✅ HEALTH
@app.get("/health")
async def health():
    return {"status": "ok", "service": "posts-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)