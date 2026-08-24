'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TexasGoldBuyersLogo from '@/components/Logo';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  BadgeCheck,
  Shield,
  Layers,
  Scale,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShake(false);

    if (!employeeId.trim() || !password.trim()) {
      setError('Invalid ID or password.');
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(employeeId.trim(), password.trim());
      if (res.success) {
        setIsSuccess(true);
        router.push('/portal/dashboard');
      } else {
        setError('Invalid ID or password.');
        triggerShake();
        setIsSubmitting(false);
      }
    } catch {
      setError('Invalid ID or password.');
      triggerShake();
      setIsSubmitting(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Helper for internal staff quick reference
  const fillCredential = (id: string) => {
    setEmployeeId(id);
    if (id === 'EMP-001') {
      setPassword('Admin@12345');
    } else {
      setPassword('Employee@12345');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#071522] flex flex-col lg:flex-row antialiased selection:bg-tgb-gold selection:text-tgb-darknavy">
      {/* LEFT SIDE: Brand Showcase & Institutional Identity */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#071522] via-[#0b1d2e] to-[#081726] border-b lg:border-b-0 lg:border-r border-tgb-navyborder p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-tgb-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tgb-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <TexasGoldBuyersLogo size="lg" />
        </div>

        {/* Middle: Brand Pitch & Security Messaging */}
        <div className="my-10 lg:my-0 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/30 text-tgb-gold text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Internal Enterprise Portal
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight tracking-tight">
              Precious Metals & POS Management System
            </h1>
            <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
              Authorized transaction, appraisal, vault management, and regulatory compliance platform for Texas Gold Buyers appraisers and executives.
            </p>
          </div>

          {/* Operational Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-tgb-navyborder/80">
            <div className="p-3 rounded-xl bg-tgb-darknavy/70 border border-tgb-navyborder space-y-1">
              <Scale className="w-4 h-4 text-tgb-gold" />
              <div className="text-xs font-bold text-white">XRF Assays</div>
              <div className="text-[11px] text-gray-400">Locked spot benchmarks</div>
            </div>
            <div className="p-3 rounded-xl bg-tgb-darknavy/70 border border-tgb-navyborder space-y-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white">4 Texas Lounges</div>
              <div className="text-[11px] text-gray-400">Dallas, Houston, Austin, SA</div>
            </div>
            <div className="p-3 rounded-xl bg-tgb-darknavy/70 border border-tgb-navyborder space-y-1">
              <Shield className="w-4 h-4 text-cyan-400" />
              <div className="text-xs font-bold text-white">Immutable Ledger</div>
              <div className="text-[11px] text-gray-400">DPS audit compliant</div>
            </div>
          </div>
        </div>

        {/* Bottom: Confidentiality Notice */}
        <div className="relative z-10 text-[11px] text-gray-500 flex items-center justify-between border-t border-tgb-navyborder/60 pt-4">
          <span>© {new Date().getFullYear()} Texas Gold Buyers LLC</span>
          <span>Confidential & Proprietary</span>
        </div>
      </div>

      {/* RIGHT SIDE: High-End Authentication Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#06111c] relative">
        <div className="w-full max-w-md space-y-6">
          {/* Card Header */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-tgb-gold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Staff Terminal Access
              </span>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                System Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Sign In to Continue
            </h2>
            <p className="text-xs text-gray-400">
              Enter your assigned Employee ID and security credentials.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="flex items-center gap-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-semibold">Access Granted • Initializing Texas Gold Buyers Portal...</span>
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className={`bg-[#0a1827] border ${
              error ? 'border-rose-500/50' : 'border-tgb-navyborder'
            } rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 transition-all ${
              shake ? 'animate-shake' : ''
            }`}
          >
            {/* Employee ID */}
            <div>
              <label
                htmlFor="employee-id"
                className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2"
              >
                Employee / Admin ID <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="employee-id"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-001 or EMP-002"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl pl-10 pr-3.5 py-3 text-white text-xs sm:text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2"
              >
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl pl-10 pr-10 py-3 text-white text-xs sm:text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full py-3.5 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-tgb-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-tgb-darknavy border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access Granted</span>
                </div>
              ) : (
                <>
                  <span>SIGN IN SECURELY</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-tgb-gold" />
                Authorized personnel only • 256-bit encrypted authentication
              </span>
            </div>
          </form>

          {/* Quick Staff Reference IDs */}
          <div className="p-4 rounded-xl bg-[#091522] border border-tgb-navyborder/70 text-xs space-y-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Staff Terminal Key Reference:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillCredential('EMP-001')}
                className="p-2 rounded-lg bg-[#071320] border border-tgb-navyborder hover:border-amber-500/40 text-left transition-all"
              >
                <div className="font-bold text-amber-300">EMP-001 (Super Admin)</div>
                <div className="text-[10px] text-gray-400">Alexander Sterling</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('EMP-002')}
                className="p-2 rounded-lg bg-[#071320] border border-tgb-navyborder hover:border-emerald-500/40 text-left transition-all"
              >
                <div className="font-bold text-emerald-300">EMP-002 (Staff Appraiser)</div>
                <div className="text-[10px] text-gray-400">Michael Alvarez</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
