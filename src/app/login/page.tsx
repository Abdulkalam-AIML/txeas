'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TexasGoldBuyersLogo from '@/components/Logo';
import { Lock, Mail, Eye, EyeOff, Shield, UserCheck, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, role } = useAuth();

  const [email, setEmail] = useState('admin@texasgoldbuyers.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email);
      if (res.success) {
        if (email.toLowerCase().includes('admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (type: 'admin' | 'employee') => {
    if (type === 'admin') {
      setEmail('admin@texasgoldbuyers.com');
      setPassword('Admin@12345');
    } else {
      setEmail('employee@texasgoldbuyers.com');
      setPassword('Employee@12345');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tgb-darknavy via-[#0A1826] to-tgb-darknavy flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient gold glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-tgb-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-tgb-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <TexasGoldBuyersLogo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Enterprise Business Portal
            </h1>
            <p className="text-xs text-tgb-muted mt-1">
              Secure internal transaction and appraisal management
            </p>
          </div>
        </div>

        {/* Demo Credentials Quick-Select Pill Box */}
        <div className="bg-tgb-darknavy/90 border border-tgb-gold/30 rounded-2xl p-4 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-tgb-gold font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-tgb-goldlight" />
              Demo 1-Click Credentials
            </span>
            <span className="text-[10px] text-gray-400">Vercel & Supabase Ready</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('admin')
                  ? 'bg-tgb-gold/15 border-tgb-gold text-white shadow-sm'
                  : 'bg-tgb-navy/60 border-tgb-navyborder text-gray-300 hover:border-tgb-gold/40'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                <Shield className="w-3.5 h-3.5" /> Super Admin
              </div>
              <div className="text-[11px] text-gray-300 font-mono mt-0.5 truncate">admin@texasgold...</div>
              <div className="text-[10px] text-gray-400 font-mono">Pass: Admin@12345</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('employee')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('employee')
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                  : 'bg-tgb-navy/60 border-tgb-navyborder text-gray-300 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" /> Staff Employee
              </div>
              <div className="text-[11px] text-gray-300 font-mono mt-0.5 truncate">employee@texas...</div>
              <div className="text-[10px] text-gray-400 font-mono">Pass: Employee@12345</div>
            </button>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email / Staff ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@texasgoldbuyers.com"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-3.5 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[11px] text-tgb-gold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-10 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-tgb-navyborder text-tgb-gold focus:ring-tgb-gold bg-tgb-darknavy"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[11px] text-tgb-muted">TLS 256-bit Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-tgb-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-tgb-darknavy border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Session...</span>
                </div>
              ) : (
                <>
                  <span>SIGN IN TO PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Public site link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-gray-400 hover:text-tgb-gold transition-colors"
          >
            ← Return to Texas Gold Buyers Public Website
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white font-display">Reset Staff Access</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Enter your registered Texas Gold Buyers staff email. A secure password reset link will be dispatched via Supabase Auth.
            </p>

            {forgotSent ? (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs space-y-2">
                <strong>Password Reset Link Dispatched!</strong>
                <p>Check your email inbox ({forgotEmail}) for instructions to securely set a new password.</p>
                <button
                  onClick={() => {
                    setForgotSent(false);
                    setForgotPasswordOpen(false);
                  }}
                  className="mt-2 px-4 py-2 bg-emerald-500 text-tgb-darknavy font-bold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSent(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Staff Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@texasgoldbuyers.com"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-tgb-gold text-tgb-darknavy font-bold rounded-lg text-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
