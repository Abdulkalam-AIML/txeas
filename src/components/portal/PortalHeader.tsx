'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TexasGoldBuyersLogo from '@/components/Logo';
import {
  Search,
  Bell,
  LogOut,
  Shield,
  UserCheck,
  Building,
  ExternalLink,
  ChevronDown,
  Menu,
} from 'lucide-react';

interface PortalHeaderProps {
  onSearch?: (query: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  onSearch,
  onToggleMobileSidebar,
}) => {
  const router = useRouter();
  const { user, role, logout, switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/admin/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="no-print bg-tgb-darknavy/95 border-b border-tgb-navyborder sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-gray-300 hover:text-white bg-tgb-navylight rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/portal/dashboard">
            <TexasGoldBuyersLogo size="sm" />
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tgb-navy border border-tgb-navyborder text-[11px] text-gray-300">
            <Building className="w-3.5 h-3.5 text-tgb-gold" />
            <span className="truncate max-w-[180px] font-medium">{user?.locationName || 'Dallas Flagship'}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              placeholder="Global Search: Tx # (TGB-2026-...), Invoice #, Customer phone, name, item..."
              className="w-full bg-tgb-navy border border-tgb-navyborder rounded-xl pl-9 pr-4 py-2 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold"
            />
          </form>
        </div>

        {/* Right: Quick Controls, Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Public Website Link */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-gray-300 hover:text-tgb-gold px-2.5 py-1.5 rounded-lg bg-tgb-navy/60 border border-tgb-navyborder transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-tgb-navy border border-tgb-navyborder hover:border-tgb-gold/40 transition-all text-left"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  role === 'SUPER_ADMIN' ? 'bg-tgb-gold text-tgb-darknavy' : 'bg-emerald-500 text-tgb-darknavy'
                }`}
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>

              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">
                  {user?.name || 'Staff Member'}
                </div>
                <div className="text-[10px] flex items-center gap-1">
                  <span
                    className={`font-semibold ${
                      role === 'SUPER_ADMIN' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Appraiser'}
                  </span>
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-tgb-navy border border-tgb-navyborder rounded-xl shadow-2xl p-3 space-y-2 z-50 animate-fade-in text-xs">
                <div className="px-2 py-1.5 border-b border-tgb-navyborder">
                  <div className="font-bold text-white text-sm">{user?.name}</div>
                  <div className="text-gray-400 text-[11px] font-mono">{user?.email}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-tgb-darknavy border border-tgb-navyborder text-tgb-gold">
                    {user?.locationName}
                  </div>
                </div>

                {user?.role === 'SUPER_ADMIN' && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-400 px-2 uppercase font-semibold">Switch Workspace View</div>
                    <button
                      onClick={() => {
                        switchRole('SUPER_ADMIN');
                        setProfileOpen(false);
                        router.push('/admin/dashboard');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 ${
                        role === 'SUPER_ADMIN' ? 'bg-tgb-gold/20 text-tgb-gold font-bold' : 'text-gray-300 hover:bg-tgb-darknavy'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Executive Suite</span>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('EMPLOYEE');
                        setProfileOpen(false);
                        router.push('/employee/dashboard');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 ${
                        role === 'EMPLOYEE' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-300 hover:bg-tgb-darknavy'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Counter POS</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-tgb-navyborder">
                  <button
                    onClick={async () => {
                      await logout();
                      setProfileOpen(false);
                      router.push('/login');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
