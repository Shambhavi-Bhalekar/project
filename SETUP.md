# BlogHub - Complete Setup Guide

This guide walks you through setting up the entire BlogHub application from scratch.

## 📋 Prerequisites Check

Before you start, ensure you have:
- [ ] Node.js 18+ (check: `node --version`)
- [ ] npm 9+ (check: `npm --version`)
- [ ] Python 3.9+ (check: `python --version`)
- [ ] pip (check: `pip --version`)
- [ ] Git (check: `git --version`)
- [ ] A Supabase account (free tier: https://supabase.com)

---

## 🎯 Step 1: Supabase Project Setup (15-20 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in with GitHub
4. Create a new project:
   - **Name**: BlogHub (or your choice)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to you
   - Click "Create new project" and wait 2-3 minutes

### 1.2 Get Your Credentials

Once the project is created, go to **Project Settings** (bottom left):

1. **API Settings**:
   - Copy **Project URL** → Save as `SUPABASE_URL`
   - Copy **Anon Key** → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **Service Role Key** → Save as `SUPABASE_KEY`

2. **JWT Secret**:
   - In **Auth** settings, find **JWT Secret** → Save as `SUPABASE_JWT_SECRET`

### 1.3 Create Database Schema

1. Go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Paste the entire content from `backend/schema.sql`
4. Click "Run" and wait for success message
5. You should see "posts" table in **Table Editor**

### 1.4 Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click "Create a new bucket"
3. Name it: `blog-images`
4. Uncheck "Private bucket" to make it public
5. Click "Create bucket"
6. Click on `blog-images` bucket → **Policies**
7. Click "New policy" and allow public SELECT access

---

## 🖥️ Step 2: Backend Setup (10-15 minutes)

### 2.1 Create Backend Environment

```bash
cd backend
```

### 2.2 Create `.env` File

Create `backend/.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

**Where to find these:**
- `SUPABASE_URL`: From Supabase Settings → API → Project URL
- `SUPABASE_KEY`: From Supabase Settings → API → Service Role Key
- `SUPABASE_JWT_SECRET`: From Supabase Settings → Auth → JWT Secret
- `FRONTEND_URL`: Leave as-is for development

### 2.3 Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal.

### 2.4 Install Dependencies

```bash
pip install -r requirements.txt
```

Wait for installation to complete (~2-3 minutes).

### 2.5 Start Backend Server

```bash
uvicorn main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ **Backend is running!** Leave this terminal open and open a new one for frontend.

---

## 🎨 Step 3: Frontend Setup (10-15 minutes)

### 3.1 Open New Terminal

Open a new terminal in the `blog-app` root directory (same level as `app/` folder).

### 3.2 Create `.env.local` File

Create `.env.local` in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: Make sure `NEXT_PUBLIC_` prefix is there! These are public environment variables.

### 3.3 Install Frontend Dependencies

```bash
npm install
```

Wait for installation (~3-5 minutes).

### 3.4 Start Frontend Dev Server

```bash
npm run dev
```

Expected output:
```
> next dev
  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Environments: .env.local
  ✓ Ready in XXXms
```

✅ **Frontend is running!**

---

## 🚀 Step 4: Test the Application

### 4.1 Open Browser

1. Go to [http://localhost:3000](http://localhost:3000)
2. You should see the **BlogHub landing page**

### 4.2 Test Signup

1. Click **"Get Started"**
2. Fill in:
   - Full Name: `John Doe`
   - Email: `test@example.com`
   - Password: `SecurePassword123`
   - Confirm Password: `SecurePassword123`
3. Click **"Create Account"**
4. You should be redirected to the **Blog Page**

### 4.3 Test Create Post

1. Click the **"+"** button (bottom-right)
2. Toggle to **"Text Post"**
3. Fill in:
   - Title: `My First Blog Post`
   - Content: `This is my first post on BlogHub!`
4. Click **"Publish Post"**
5. See your post appear in the feed!

### 4.4 Test Image Post

1. Click **"+"** again
2. Toggle to **"Image Post"**
3. Fill in:
   - Title: `My Photo`
4. Drag & drop or click to upload an image
5. Click **"Publish Post"**
6. See your image post in the feed!

### 4.5 Test Edit & Delete

1. Hover over one of **your posts**
2. Click **"Edit"** to update it
3. Click **"Delete"** to remove it
4. Confirm deletion

### 4.6 Test View Others' Posts

1. Click **"Logout"** (top-right)
2. Create another account
3. You should see posts from the first account in the feed
4. You **cannot** edit/delete others' posts ✅

---

## ✅ Verification Checklist

After setup, verify these features work:

- [ ] Can access landing page at http://localhost:3000
- [ ] Can create account with signup
- [ ] Can login/logout
- [ ] Can create text posts
- [ ] Can create image posts
- [ ] Can edit own posts
- [ ] Can delete own posts
- [ ] Can see all posts from all users
- [ ] Cannot edit/delete others' posts
- [ ] Backend API responds to requests
- [ ] Images upload to Supabase Storage

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear cache and reinstall
npm clean-install  # or npm ci
```

### Issue: Backend won't start

**Solution:**
1. Check Python version: `python --version` (must be 3.9+)
2. Activate virtual environment
3. Check .env file has all required variables
4. Try: `pip install --upgrade fastapi uvicorn`

### Issue: Frontend can't connect to backend

**Solution:**
1. Check backend is running at http://localhost:8000
2. Check `NEXT_PUBLIC_API_URL` is correct in `.env.local`
3. Check CORS is enabled in backend
4. Try in private/incognito window to clear browser cache

### Issue: Supabase connection errors

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
2. Check URL format: `https://your-project.supabase.co` (no trailing slash)
3. Ensure JWT_SECRET matches between backend and Supabase
4. Check database is ready in Supabase dashboard

### Issue: Image upload fails

**Solution:**
1. Ensure `blog-images` bucket exists in Supabase Storage
2. Check bucket is set to public
3. Check file size is under 100MB
4. Try uploading different image format

### Issue: "CORS error" in browser console

**Solution:**
1. Check `FRONTEND_URL` in backend `.env` matches frontend URL
2. For development, `FRONTEND_URL=http://localhost:3000`
3. Restart backend server
4. Clear browser cache

### Issue: Logs show "Invalid token"

**Solution:**
1. Clear localStorage in browser (DevTools → Application → Clear Site Data)
2. Log out and log back in
3. Verify JWT_SECRET matches between backend and Supabase

---

## 📚 Useful Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production build
npm run lint     # Run ESLint
```

### Backend
```bash
uvicorn main:app --reload                    # Development
uvicorn main:app --host 0.0.0.0 --port 8000 # Production
```

### Python
```bash
pip list                    # List installed packages
pip install -r requirements.txt  # Install dependencies
python -m venv venv        # Create virtual environment
```

---

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Frontend - http://localhost:3000](http://localhost:3000)
- [Backend - http://localhost:8000](http://localhost:8000)
- [Backend Docs - http://localhost:8000/docs](http://localhost:8000/docs)
- [GitHub Repo](https://github.com/your-repo)

---

## ✨ Next Steps

After successful setup:

1. **Deploy to Production:**
   - Push to GitHub
   - Deploy frontend on Vercel
   - Deploy backend on Railway/Render

2. **Add More Features:**
   - Comments on posts
   - Likes/reactions
   - User profiles
   - Search functionality
   - Categories/tags

3. **Improve Performance:**
   - Add pagination to posts
   - Implement infinite scroll
   - Cache API responses
   - Optimize images

---

## 💬 Support

If you encounter issues:

1. Check this **Troubleshooting** section
2. Check error messages in browser console (F12)
3. Check terminal output
4. Open an issue on GitHub with error details

---

**Happy Blogging! 🎉**
