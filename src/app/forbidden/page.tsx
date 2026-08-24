'use client';

import React from 'react';
import Link from 'next/link';
import TexasGoldBuyersLogo from '@/components/Logo';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ForbiddenPage() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-[#071522] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="flex items-center justify-center mb-2">
        <TexasGoldBuyersLogo size="lg" />
      </div>

      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
          Error 403 • Restricted Area
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Access Restricted
        </h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          You do not have administrative permissions to view this executive module. Your terminal is configured for {role === 'EMPLOYEE' ? 'Staff Appraiser / Counter POS' : 'Standard'} operations.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/portal/dashboard"
          className="py-2.5 px-5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 uppercase"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to Staff Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
