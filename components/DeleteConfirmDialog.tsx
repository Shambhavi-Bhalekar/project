'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-2xl p-6"
            style={{
              background: 'rgba(12,12,28,0.98)',
              border: '1px solid rgba(239,68,68,0.2)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
            }}
          >
            {/* Close */}
            <button
              id="cancel-delete-x"
              onClick={onCancel}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <AlertTriangle size={26} style={{ color: '#f87171' }} />
              </div>
            </div>

            {/* Text */}
            <h3
              className="text-xl font-bold text-center mb-2"
              style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}
            >
              Delete Post?
            </h3>
            <p className="text-sm text-center mb-7" style={{ color: 'var(--text-muted)' }}>
              This action is permanent and cannot be undone. The post will be
              removed from the platform.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                id="cancel-delete-btn"
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                }}
              >
                Keep it
              </button>
              <button
                id="confirm-delete-btn"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.25)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
                }}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full inline-block" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
