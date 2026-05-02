'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Post } from '@/lib/posts';
import { formatTimeAgo, truncateText } from '@/lib/utils';
import { Trash2, Edit2, Clock, User } from 'lucide-react';
import { authService } from '@/lib/auth';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
  index?: number;
}

export function PostCard({
  post,
  onEdit,
  onDelete,
  isDeleting,
  index = 0,
}: PostCardProps) {

  // ✅ FIX: use state to avoid SSR mismatch
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = authService.getUserId(); // ✅ centralized
    setCurrentUserId(id);

    // 🔍 DEBUG (remove later)
    console.log("POST USER:", post.user_id);
    console.log("CURRENT USER:", id);

  }, [post.user_id]);

  const isOwner = post.user_id === currentUserId;

  const gradients = [
    'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
    'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  ];

  const gradientIndex = post.id.charCodeAt(0) % gradients.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl flex flex-col"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Banner */}
      {post.image_url ? (
        <div className="relative w-full h-44 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="w-full h-2.5"
          style={{ background: gradients[gradientIndex] }}
        />
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-semibold mb-2">
          {post.title}
        </h3>

        {post.content && (
          <p className="text-sm mb-4 flex-1">
            {truncateText(post.content, 160)}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs py-2">
            <span className="flex items-center gap-1">
              <User size={12} />
              {post.author_email || "Anonymous"}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(post.created_at)}
            </span>
          </div>

          {/* ✅ OWNER ACTIONS */}
          {isOwner && (
            <div className="flex gap-2 mt-3">
              
              {/* EDIT */}
              <button
                onClick={() => onEdit(post)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all bg-blue-500/10 text-blue-400 border border-blue-400/20 hover:bg-blue-500/20"
              >
                <Edit2 size={13} />
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => {
                  const confirmDelete = confirm("Are you sure you want to delete this post?");
                  if (confirmDelete) {
                    onDelete(post.id);
                  }
                }}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all bg-red-500/10 text-red-400 border border-red-400/20 hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 size={13} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>

            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}