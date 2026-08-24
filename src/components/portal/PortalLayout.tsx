'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import PortalHeader from './PortalHeader';
import PortalSidebar from './PortalSidebar';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tgb-darknavy flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-tgb-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xs text-tgb-gold uppercase font-bold tracking-widest">
            Loading Texas Gold Buyers Terminal...
          </div>
        </div>
      </div>
    );
  }

  // Not logged in guard
  if (!user) {
    return (
      <div className="min-h-screen bg-tgb-darknavy flex items-center justify-center p-4">
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Authentication Required</h2>
          <p className="text-xs text-gray-300">
            You must be signed in with valid staff credentials to access the business management portal.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Sign In with Demo Credentials
          </Link>
        </div>
      </div>
    );
  }

  // RBAC Permission Guard: If non-admin attempts to access /admin/...
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminRoute && role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-tgb-darknavy flex flex-col">
        <PortalHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-tgb-navy border border-rose-500/40 rounded-2xl max-w-lg w-full p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/15 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">403 — Super Admin Access Required</h2>
              <p className="text-xs text-rose-200 mt-1 font-mono">SUPABASE_RLS_POLICY_DENIED: role !== 'super_admin'</p>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Your account (<strong className="text-white">{user.name}</strong>) has the <strong className="text-emerald-400">EMPLOYEE</strong> role. 
              Administrative settings, employee provisioning, and company-wide financial configurations are restricted.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/employee/dashboard"
                className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy font-bold text-xs rounded-xl uppercase transition-all"
              >
                Return to Employee POS Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tgb-darknavy flex flex-col">
      <PortalHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <PortalSidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>
            <div className="relative z-10 w-72 h-full bg-tgb-navy shadow-2xl">
              <PortalSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
