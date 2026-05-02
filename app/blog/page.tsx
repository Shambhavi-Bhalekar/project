'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { postsService, Post } from '@/lib/posts';
import { getErrorMessage } from '@/lib/errorHandler';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import { PostDrawer } from '@/components/PostDrawer';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Plus, Search, RefreshCw, BookOpen } from 'lucide-react';

export default function BlogPage() {
  return (
    <ProtectedRoute>
      <BlogContent />
    </ProtectedRoute>
  );
}

function BlogContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const data = await postsService.getPosts();
      setPosts(data);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsDrawerOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsDrawerOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    setDeletePostId(postId);
    setDeleteConfirmOpen(true);
  };

  const handleSubmitPost = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingPost) {
        const updated = await postsService.updatePost(editingPost.id, data);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success('Post updated! ✨');
      } else {
        const newPost = await postsService.createPost(data);
        setPosts((prev) => [newPost, ...prev]);
        toast.success('Post published! 🚀');
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Failed to save post'));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      await postsService.deletePost(deletePostId);
      setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
      toast.success('Post deleted');
      setDeleteConfirmOpen(false);
      setDeletePostId(null);
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Failed to delete post'));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = search.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.content?.toLowerCase().includes(search.toLowerCase()) ||
          p.author_email.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-base)' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold mb-1"
                style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}
              >
                Blog <span className="gradient-text">Feed</span>
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {posts.length} {posts.length === 1 ? 'story' : 'stories'} from the community
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh */}
              <button
                onClick={() => loadPosts(true)}
                disabled={isRefreshing}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                title="Refresh posts"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? 'animate-spin' : ''}
                />
              </button>

              {/* Create post */}
              <button
                id="create-post-btn"
                onClick={handleCreatePost}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                <Plus size={17} />
                New Post
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 relative max-w-lg">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title, content or author…"
              className="input-field pl-11"
              style={{ fontSize: '14px' }}
            />
          </div>
        </motion.div>

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-card)' }}>
                <div className="skeleton h-2.5 w-full" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4 rounded-lg" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-5/6 rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <BookOpen size={32} style={{ color: 'var(--brand-accent)' }} />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}
            >
              {search ? 'No posts found' : 'No posts yet'}
            </h2>
            <p className="text-sm max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              {search
                ? `No posts match "${search}". Try a different search term.`
                : 'Be the first to share your story with the community.'}
            </p>
            {!search && (
              <button
                onClick={handleCreatePost}
                className="btn-primary"
              >
                <Plus size={17} />
                Create First Post
              </button>
            )}
          </motion.div>
        ) : (
          /* Posts grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  isDeleting={isDeleting && deletePostId === post.id}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleCreatePost}
        id="fab-create-post"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center z-30 sm:hidden"
        style={{
          background: 'var(--gradient-brand)',
          boxShadow: '0 8px 30px rgba(124,58,237,0.5)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Plus size={26} className="text-white" />
      </motion.button>

      {/* Post Drawer */}
      <PostDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditingPost(null); }}
        onSubmit={handleSubmitPost}
        editingPost={editingPost}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteConfirmOpen(false); setDeletePostId(null); }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
