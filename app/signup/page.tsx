'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authService } from '@/lib/auth';
import { getErrorMessage } from '@/lib/errorHandler';
import toast from 'react-hot-toast';
import { Eye, EyeOff, PenLine, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.full_name.trim()) e.full_name = 'Full name is required';
    if (!formData.email.includes('@')) e.email = 'Enter a valid email address';
    if (formData.password.length < 6) e.password = 'At least 6 characters required';
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authService.signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });
      if (res.access_token) {
        authService.setToken(res.access_token, res.user.email,res.user.id);
        toast.success('Account created! Welcome 🎉');
        router.push('/blog');
      } else {
        toast.success('Account created! Please check your email to confirm.');
        router.push('/login');
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Failed to create account'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{
            position: 'absolute', top: '-20%', right: '-10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, delay: 4 }}
          style={{
            position: 'absolute', bottom: '-15%', left: '-10%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(13,13,31,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-brand)' }}
              >
                <PenLine size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                <span className="gradient-text">Blog</span>
                <span style={{ color: 'var(--text-primary)' }}>Hub</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>
              Create your account
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Join thousands of writers sharing their stories
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="input-label" htmlFor="full_name">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={`input-field pl-10 ${errors.full_name ? 'error' : ''}`}
                />
              </div>
              {errors.full_name && <p className="text-xs mt-1.5" style={{ color: 'var(--error)' }}>{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs mt-1.5" style={{ color: 'var(--error)' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-11 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1.5" style={{ color: 'var(--error)' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1.5" style={{ color: 'var(--error)' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
              style={{ padding: '13px', fontSize: '15px', marginTop: '8px' }}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--brand-accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
