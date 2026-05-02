import { api } from './api';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  image_url?: string;
  author_email: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content?: string;
  file?: File;
}

export const postsService = {

  // ✅ GET POSTS
  getPosts: async (): Promise<Post[]> => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching posts:");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ CREATE POST (🔥 FIXED)
  createPost: async (data: CreatePostData): Promise<Post> => {
    try {
      const formData = new FormData();

      // ✅ Always include fields
      formData.append('title', data.title);
      formData.append('content', data.content || "");

      // ✅ File (optional)
      if (data.file) {
        formData.append('file', data.file);
      }

      // 🔍 DEBUG
      console.log("📤 Sending POST:", {
        title: data.title,
        content: data.content,
        file: data.file?.name,
        token: localStorage.getItem("auth_token"), // 🔥 verify token exists
      });

      const response = await api.post('/posts', formData, {
        headers: {
          // ❌ DO NOT set manually → let axios handle it
        },
      });

      console.log("✅ Post created:", response.data);
      return response.data;

    } catch (error: any) {
      console.error("❌ Error creating post:");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data); // 🔥 ACTUAL ERROR HERE
      } else {
        console.error("Message:", error.message);
      }

      throw error;
    }
  },

  // ✅ UPDATE POST
  updatePost: async (postId: string, data: CreatePostData): Promise<Post> => {
    try {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('content', data.content || "");

      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await api.put(`/posts/${postId}`, formData);

      console.log("✅ Post updated:", response.data);
      return response.data;

    } catch (error: any) {
      console.error("❌ Error updating post:");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else {
        console.error("Message:", error.message);
      }

      throw error;
    }
  },

  // ✅ DELETE POST
  deletePost: async (postId: string): Promise<void> => {
    try {
      await api.delete(`/posts/${postId}`);
      console.log("🗑️ Post deleted:", postId);
    } catch (error: any) {
      console.error("❌ Error deleting post:");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else {
        console.error("Message:", error.message);
      }

      throw error;
    }
  },
};