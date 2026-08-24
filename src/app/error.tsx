'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import TexasGoldBuyersLogo from '@/components/Logo';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-tgb-darknavy text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="flex items-center justify-center mb-2">
        <TexasGoldBuyersLogo size="lg" />
      </div>

      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
          Service Notice
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Unexpected Error Occurred
        </h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          An unexpected error occurred while communicating with the precious metals portal services. Please retry or return to the main dashboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="py-2.5 px-5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 uppercase"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Operation</span>
        </button>
        <Link
          href="/"
          className="py-2.5 px-5 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Home Page</span>
        </Link>
      </div>
    </div>
  );
}
