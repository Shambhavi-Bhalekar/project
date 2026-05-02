'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authService } from '@/lib/auth';
import { ArrowRight, Zap, Shield, Globe, PenLine } from 'lucide-react';

const features = [
  {
    icon: PenLine,
    title: 'Rich Writing',
    desc: 'Craft text posts or image stories with an intuitive editor.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Share your thoughts with a worldwide community of readers.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is protected with Supabase auth and JWT tokens.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built on Next.js & FastAPI for an instant, seamless experience.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) router.push('/blog');
  }, [router]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* ── Grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)',
        }}
        aria-hidden
      />

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <PenLine size={18} className="text-white" />
          </div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <span className="gradient-text">Blog</span>
            <span style={{ color: 'var(--text-primary)' }}>Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn-ghost text-sm"
            style={{ padding: '8px 20px', fontSize: '14px' }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm"
            style={{ padding: '8px 20px', fontSize: '14px' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Pill badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <span
              className="badge badge-brand"
              style={{ fontSize: '12px', padding: '5px 14px' }}
            >
              ✨ The place for storytellers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
            style={{ fontFamily: 'Sora, Inter, sans-serif' }}
          >
            <span className="gradient-text">Share Your Story</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>with the World</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Create, publish, and discover beautiful blog posts. Connect with writers
            and readers in a vibrant, inspiring community.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup" className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Start Writing Free
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 28px' }}>
              I have an account
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Features ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-28 max-w-5xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
              className="glass-card p-6 flex flex-col gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.25)',
                }}
              >
                <f.icon size={18} style={{ color: 'var(--brand-accent)' }} />
              </div>
              <h3
                className="font-semibold text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
