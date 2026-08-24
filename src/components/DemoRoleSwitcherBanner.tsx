'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, UserCheck, ExternalLink, LogOut, ArrowRight, Building } from 'lucide-react';

export const DemoRoleSwitcherBanner: React.FC = () => {
  const { user, role, logout, switchRole } = useAuth();
  const pathname = usePathname();

  // If user is not authenticated or is viewing a public page without an active session, keep public view 100% clean
  if (!user) {
    return null;
  }

  // Determine if on portal vs public
  const isPortal = pathname.startsWith('/admin') || pathname.startsWith('/employee') || pathname.startsWith('/portal');

  return (
    <header className="no-print bg-[#071522] border-b border-tgb-navyborder text-xs py-1.5 px-4 z-50 sticky top-0 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Authenticated User Status */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold text-gray-200 tracking-wider uppercase">
              Texas Gold Buyers <span className="text-tgb-gold font-normal">• Secure Portal</span>
            </span>
          </div>

          <span className="hidden md:inline text-gray-600">|</span>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-300">
            <span>Signed in as:</span>
            <strong className="text-white font-semibold">{user.name}</strong>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                role === 'SUPER_ADMIN'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Appraiser'}
            </span>
          </div>
        </div>

        {/* Right: Portal Controls */}
        <div className="flex items-center gap-3">
          {/* If Super Admin, show role view toggle */}
          {user.role === 'SUPER_ADMIN' && (
            <div className="flex items-center bg-tgb-darknavy rounded-lg p-0.5 border border-tgb-navyborder text-[10px]">
              <button
                onClick={() => switchRole('SUPER_ADMIN')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  role === 'SUPER_ADMIN'
                    ? 'bg-tgb-gold text-tgb-darknavy shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Executive Suite Access"
              >
                Executive
              </button>
              <button
                onClick={() => switchRole('EMPLOYEE')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  role === 'EMPLOYEE'
                    ? 'bg-emerald-500 text-tgb-darknavy shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Counter POS Access"
              >
                Counter POS
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px]">
            {isPortal ? (
              <Link
                href="/"
                className="text-gray-400 hover:text-tgb-gold transition-colors flex items-center gap-1"
              >
                <span>Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                href="/portal/dashboard"
                className="text-tgb-gold hover:text-tgb-goldlight font-bold transition-colors flex items-center gap-1"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            <button
              onClick={() => logout()}
              className="text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-1 ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DemoRoleSwitcherBanner;
