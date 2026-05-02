'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Post, CreatePostData } from '@/lib/posts';
import { X, Upload, Type, Image as ImageIcon, Check } from 'lucide-react';

interface PostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => Promise<void>;
  editingPost?: Post | null;
  isSubmitting?: boolean;
}

export function PostDrawer({
  isOpen,
  onClose,
  onSubmit,
  editingPost,
  isSubmitting,
}: PostDrawerProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isTextPost, setIsTextPost] = useState(true);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content || '');
      setIsTextPost(!editingPost.image_url);
      if (editingPost.image_url) setPreview(editingPost.image_url);
    } else {
      resetForm();
    }
  }, [editingPost, isOpen]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFile(null);
    setPreview('');
    setIsTextPost(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), file: file || undefined });
      resetForm();
      onClose();
    } catch {
      // handled by parent
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-md overflow-hidden"
            style={{
              background: 'rgba(10,10,25,0.97)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}
                >
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {editingPost ? 'Update your existing post' : 'Share something with the world'}
                </p>
              </div>
              <button
                id="close-drawer"
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Toggle */}
              <div
                className="flex gap-1.5 p-1 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {[
                  { label: 'Text Post', icon: Type, value: true },
                  { label: 'Image Post', icon: ImageIcon, value: false },
                ].map(({ label, icon: Icon, value }) => (
                  <button
                    key={label}
                    id={`toggle-${label.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setIsTextPost(value)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: isTextPost === value
                        ? 'var(--gradient-brand)'
                        : 'transparent',
                      color: isTextPost === value ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: isTextPost === value ? '0 2px 12px rgba(124,58,237,0.4)' : 'none',
                    }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form id="post-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label
                    htmlFor="post-title"
                    className="input-label"
                  >
                    Title <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your post a great title…"
                    className="input-field"
                    required
                  />
                </div>

                {/* Content */}
                {isTextPost && (
                  <div>
                    <label htmlFor="post-content" className="input-label">
                      Content
                    </label>
                    <textarea
                      id="post-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your story here…"
                      rows={8}
                      className="input-field"
                      style={{ resize: 'vertical', lineHeight: '1.7' }}
                    />
                  </div>
                )}

                {/* Image Upload */}
                {!isTextPost && (
                  <div>
                    <label className="input-label">Image</label>
                    {preview ? (
                      <div className="relative rounded-xl overflow-hidden">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-52 object-cover"
                        />
                        <div
                          className="absolute inset-0 flex items-end p-3"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
                        >
                          <button
                            type="button"
                            onClick={() => { setFile(null); setPreview(''); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(239,68,68,0.8)', color: '#fff', border: 'none', cursor: 'pointer' }}
                          >
                            <X size={13} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-44 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: 'rgba(124,58,237,0.05)',
                          border: '2px dashed rgba(124,58,237,0.3)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.5)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.05)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)';
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: 'rgba(124,58,237,0.15)' }}
                        >
                          <Upload size={22} style={{ color: 'var(--brand-accent)' }} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          Click to upload image
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          PNG, JPG, GIF up to 10MB
                        </p>
                        <input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <button
                type="submit"
                form="post-form"
                disabled={isSubmitting || !title.trim()}
                className="btn-primary w-full"
                style={{ padding: '13px', fontSize: '15px' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    {editingPost ? 'Save Changes' : 'Publish Post'}
                  </>
                )}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
