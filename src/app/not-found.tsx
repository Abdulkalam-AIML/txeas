'use client';

import React from 'react';
import Link from 'next/link';
import TexasGoldBuyersLogo from '@/components/Logo';
import { ArrowLeft, Home, Shield, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-tgb-darknavy text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="flex items-center justify-center mb-2">
        <TexasGoldBuyersLogo size="lg" />
      </div>

      <div className="w-16 h-16 rounded-2xl bg-tgb-navy border border-tgb-gold/30 flex items-center justify-center mx-auto text-tgb-gold">
        <Shield className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-tgb-gold uppercase tracking-widest">
          Error 404 • Resource Not Found
        </span>
        <h1 className="text-3xl font-extrabold font-display text-white">
          Page Not Available
        </h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          The requested page or record could not be found. It may have moved or you might need to authenticate with different staff credentials.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="py-2.5 px-5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 uppercase"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/portal/dashboard"
          className="py-2.5 px-5 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        >
          <Shield className="w-4 h-4 text-tgb-gold" />
          <span>Go to Portal Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
