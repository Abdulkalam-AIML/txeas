'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Shield, UserCheck, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react';

export const DemoRoleSwitcherBanner: React.FC = () => {
  const { user, role, switchRole, resetDemoDatabase } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="no-print bg-gradient-to-r from-[#0d1f30] via-[#102a42] to-[#0d1f30] border-b border-tgb-gold/30 text-xs py-1 px-4 z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Demo status */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tgb-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tgb-gold"></span>
          </span>
          <span className="font-semibold text-tgb-gold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-tgb-goldlight" />
            Vercel Demo Environment
          </span>
          <span className="hidden sm:inline text-tgb-muted">|</span>
          <span className="hidden sm:inline text-gray-300">
            Active: <strong className="text-white font-medium">{user?.name || 'Guest'}</strong> (
            <span className={`font-semibold ${role === 'SUPER_ADMIN' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'EMPLOYEE' ? 'Staff Employee' : 'Public Visitor'}
            </span>
            )
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-tgb-darknavy/80 rounded-md p-0.5 border border-tgb-navyborder">
            <button
              onClick={() => switchRole('SUPER_ADMIN')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors text-[11px] ${
                role === 'SUPER_ADMIN'
                  ? 'bg-tgb-gold text-tgb-darknavy font-bold shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-tgb-navylight'
              }`}
              title="Switch to Super Admin (admin@texasgoldbuyers.com)"
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
            <button
              onClick={() => switchRole('EMPLOYEE')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors text-[11px] ${
                role === 'EMPLOYEE'
                  ? 'bg-emerald-500 text-tgb-darknavy font-bold shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-tgb-navylight'
              }`}
              title="Switch to Employee (employee@texasgoldbuyers.com)"
            >
              <UserCheck className="w-3 h-3" />
              Employee
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="px-2 py-1 text-gray-300 hover:text-tgb-gold transition-colors flex items-center gap-1 text-[11px] rounded hover:bg-tgb-navylight/60"
            >
              Public Site
            </Link>
            <Link
              href="/portal/dashboard"
              className="px-2 py-1 text-tgb-gold hover:text-white transition-colors flex items-center gap-1 text-[11px] rounded hover:bg-tgb-navylight/60 font-semibold"
            >
              Portal Suite <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <button
              onClick={() => {
                if (confirm('Reset demo database to fresh 350+ historical transactions and customer records?')) {
                  resetDemoDatabase();
                }
              }}
              className="p-1 text-gray-400 hover:text-amber-300 transition-colors rounded hover:bg-tgb-navylight/60"
              title="Reset Demo Records (350+ Transactions 2024-2026)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRoleSwitcherBanner;
