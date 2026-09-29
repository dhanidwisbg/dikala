'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-sm p-8 shadow-2xl backdrop-blur-md">
      <h2 className="font-serif text-2xl text-white mb-6 text-center">
        Sign In to Dashboard
      </h2>

      {error && (
        <div className="bg-red-950/60 border border-red-500/40 text-red-200 text-sm px-4 py-3 rounded-sm mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            autoComplete="username"
            className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-900 text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider uppercase inline-flex items-center gap-1"
        >
          <span>&larr;</span> Kembali ke Website Utama
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="font-serif text-3xl md:text-4xl text-white tracking-widest font-bold uppercase hover:opacity-80 transition-opacity">
              DIKALA
            </span>
          </Link>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mb-3" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            CMS Admin Authentication
          </p>
        </div>

        {/* Suspense Boundary for useSearchParams */}
        <Suspense fallback={
          <div className="bg-gray-950 border border-gray-800 rounded-sm p-8 text-center text-gray-500">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs uppercase tracking-widest">Loading...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
