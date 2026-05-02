'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, PenLine, ChevronRight } from 'lucide-react';
import { authService } from '@/lib/auth';
import toast from 'react-hot-toast';

export function Navbar() {
  const router = useRouter();
  const userEmail = authService.getUserEmail();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    authService.clearAuth();
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Abbreviate email for display
  const displayEmail =
    userEmail && userEmail.length > 28
      ? userEmail.substring(0, 25) + '…'
      : userEmail;

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(5,5,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(124,58,237,0.1)',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        style={{ height: 64 }}
      >
        {/* Logo */}
        <Link href="/blog" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <PenLine size={16} className="text-white" />
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <span className="gradient-text">Blog</span>
            <span style={{ color: 'var(--text-primary)' }}>Hub</span>
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* User pill */}
          {userEmail && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--gradient-brand)', color: '#fff' }}
              >
                {userEmail[0].toUpperCase()}
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {displayEmail}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            id="logout-button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#fca5a5',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.18)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
            }}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
