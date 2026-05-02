# BlogHub - Full-Stack Blog Management Application

A modern, feature-rich blog management application built with Next.js 14, FastAPI, and Supabase. Share your stories, discover amazing blogs, and connect with a vibrant community of writers.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 19** for UI components
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **react-hot-toast** for notifications

### Backend
- **FastAPI** (Python) for REST API
- **Supabase** for Authentication & Database
- **PostgreSQL** (via Supabase) for data storage
- **Supabase Storage** for image uploads

### Database
- **Supabase PostgreSQL** with Row Level Security
- **JWT-based Authentication**

---

## 📋 Features

### Authentication
- ✅ User registration with email/password
- ✅ User login with JWT tokens
- ✅ Secure session management
- ✅ Protected routes

### Blog Management
- ✅ Create text posts with rich content
- ✅ Create image posts with uploads
- ✅ Edit your own posts
- ✅ Delete your own posts
- ✅ View all posts from all users
- ✅ Author information on each post

### UI/UX
- ✅ Beautiful glassmorphism design
- ✅ Dark mode support
- ✅ Smooth animations with Framer Motion
- ✅ Responsive mobile-first design
- ✅ Loading skeletons
- ✅ Toast notifications
- ✅ Drag & drop image uploads

### Performance
- ✅ Optimistic UI updates
- ✅ Image optimization
- ✅ Client-side validation
- ✅ Error handling with retry logic

---

## 🏗️ Project Structure

```
blog-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles
│   ├── page.tsx                 # Landing page
│   ├── signup/page.tsx          # Signup page
│   ├── login/page.tsx           # Login page
│   └── blog/page.tsx            # Main blog page (protected)
│
├── components/                   # React components
│   ├── Navbar.tsx               # Navigation bar
│   ├── PostCard.tsx             # Individual post card
│   ├── PostDrawer.tsx           # Create/Edit post modal
│   ├── DeleteConfirmDialog.tsx   # Delete confirmation
│   └── ProtectedRoute.tsx        # Route protection wrapper
│
├── lib/                          # Utilities & services
│   ├── api.ts                   # Axios instance with interceptors
│   ├── auth.ts                  # Authentication service
│   ├── posts.ts                 # Posts API service
│   └── utils.ts                 # Helper functions
│
├── backend/                      # FastAPI backend
│   ├── main.py                  # FastAPI app with all endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
│
├── package.json                 # Frontend dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
└── next.config.ts               # Next.js config
```

---

## 🗄️ Database Schema

### Supabase PostgreSQL - `posts` Table

```sql
CREATE TABLE posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read all posts
CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  USING (true);

-- Allow users to insert their own posts
CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

### Supabase Storage Bucket
- Create a public bucket named `blog-images`
- Enable public access for read operations

---

## 🔐 API Endpoints

### Authentication Endpoints

#### POST `/auth/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```
Returns: `{ access_token, user: { id, email, full_name } }`

#### POST `/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Returns: `{ access_token, user: { id, email } }`

#### POST `/auth/logout`
Logout and invalidate session
Header: `Authorization: Bearer {token}`

### Blog Posts Endpoints

#### GET `/posts`
Get all posts (public, no auth required)
Returns: Array of posts with author email

#### POST `/posts`
Create a new post (auth required)
```
Form Data:
- title (string, required)
- content (string, optional)
- file (image file, optional)
```
Header: `Authorization: Bearer {token}`

#### PUT `/posts/{post_id}`
Update own post (auth required)
```
Form Data:
- title (string, required)
- content (string, optional)
- file (image file, optional)
```
Header: `Authorization: Bearer {token}`

#### DELETE `/posts/{post_id}`
Delete own post (auth required)
Header: `Authorization: Bearer {token}`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git
- Supabase account (free tier works)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd blog-app
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor and run the database schema SQL (see above)
3. Enable Row Level Security (RLS) policies
4. Create a storage bucket named `blog-images` and make it public
5. Get your credentials:
   - Project URL
   - Anon Key
   - Service Role Key
   - JWT Secret

### Step 3: Backend Setup

```bash
cd backend

# Create .env file
cp .env.example .env

# Fill in your Supabase credentials in .env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
FRONTEND_URL=http://localhost:3000

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload

# Server will be running at http://localhost:8000
```

### Step 4: Frontend Setup

```bash
cd ../

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Fill in your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev

# Frontend will be running at http://localhost:3000
```

### Step 5: Access the Application

1. Open http://localhost:3000 in your browser
2. Click "Get Started" to create an account
3. Fill in your details and sign up
4. You'll be redirected to the blog page
5. Click the `+` button to create your first post!

---

## 🛠️ Development

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Backend Commands
```bash
# Development with auto-reload
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🔧 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`.env`)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
FRONTEND_URL=http://localhost:3000
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#7C3AED)
- **Secondary**: Indigo (#4F46E5)
- **Background**: Slate-950 (#030712)
- **Surface**: Slate-900 (#0F172A)
- **Text**: White (#FFFFFF)
- **Muted**: Gray-400 (#9CA3AF)

### Typography
- **Font**: Inter (Google Fonts)
- **Display**: 700 Bold
- **Heading**: 600 Semibold
- **Body**: 400 Regular

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Slate background with focus states
- **Animations**: Smooth transitions with Framer Motion

---

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
npm run build
# Push to GitHub and connect to Vercel
# Set environment variables in Vercel dashboard
```

### Backend Deployment (Railway/Render/Heroku)
```bash
# Push backend to GitHub
# Connect repository to deployment platform
# Set environment variables
# Deploy!
```

---

## 📝 API Usage Examples

### Create a Blog Post
```javascript
const response = await fetch('http://localhost:8000/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData // with title, content, and file
});
```

### Fetch All Posts
```javascript
const response = await fetch('http://localhost:8000/posts');
const posts = await response.json();
```

### Update a Post
```javascript
const response = await fetch(`http://localhost:8000/posts/${postId}`, {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

### Delete a Post
```javascript
const response = await fetch(`http://localhost:8000/posts/${postId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check FastAPI CORS configuration in `main.py`

### Authentication Errors
- Verify JWT_SECRET matches between backend and Supabase
- Check that token is being sent correctly in Authorization header
- Clear localStorage and try logging in again

### Image Upload Errors
- Ensure `blog-images` bucket exists in Supabase Storage
- Check bucket permissions are public
- Verify file size is under Supabase limits

### Database Errors
- Check RLS policies are correctly configured
- Verify user_id is being set correctly when creating posts
- Ensure auth.users table exists in Supabase

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

## 📧 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ by the BlogHub Team**
