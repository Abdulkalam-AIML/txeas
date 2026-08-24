'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  UserCog,
  Package,
  CreditCard,
  BarChart3,
  ScrollText,
  Settings,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  Building,
  User,
  History,
} from 'lucide-react';

interface PortalSidebarProps {
  onCloseMobile?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { role, user } = useAuth();

  const isAdmin = role === 'SUPER_ADMIN';

  // Navigation configurations
  const adminNav = [
    { section: 'Overview' },
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    
    { section: 'Transactions & POS' },
    { label: 'All Transactions', href: '/admin/transactions', icon: <History className="w-4 h-4" /> },
    { label: 'New Buy (Customer)', href: '/admin/transactions/new?type=BUY', icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> },
    { label: 'New Sell (To Customer)', href: '/admin/transactions/new?type=SELL', icon: <ArrowUpRight className="w-4 h-4 text-amber-400" /> },
    { label: 'Invoices & Receipts', href: '/admin/invoices', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Payment Records', href: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },

    { section: 'Administration' },
    { label: 'Staff Employees', href: '/admin/employees', icon: <UserCog className="w-4 h-4" /> },
    { label: 'Item Catalog / Menu', href: '/admin/items', icon: <Package className="w-4 h-4" /> },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4 text-tgb-gold" /> },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: <ScrollText className="w-4 h-4" /> },
    { label: 'System Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const employeeNav = [
    { section: 'POS & Counter Desk' },
    { label: 'Employee Dashboard', href: '/employee/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'New BUY Transaction', href: '/employee/buy', icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> },
    { label: 'New SELL Transaction', href: '/employee/sell', icon: <ArrowUpRight className="w-4 h-4 text-amber-400" /> },
    { label: 'Customer Directory', href: '/employee/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'My Transactions', href: '/employee/transactions', icon: <History className="w-4 h-4" /> },
    { label: 'Invoices & Receipts', href: '/employee/invoices', icon: <Receipt className="w-4 h-4" /> },
    { label: 'My Staff Profile', href: '/employee/profile', icon: <User className="w-4 h-4" /> },
  ];

  const currentNav = isAdmin ? adminNav : employeeNav;

  return (
    <aside className="w-64 bg-tgb-navy/95 border-r border-tgb-navyborder flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto no-scrollbar">
      <div className="p-3.5 space-y-4">
        {/* Role Indicator Banner */}
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            isAdmin
              ? 'bg-tgb-gold/10 border-tgb-gold/30 text-tgb-gold'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}
        >
          {isAdmin ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
          <div className="leading-tight truncate">
            <div className="font-extrabold uppercase text-[11px] tracking-wider">
              {isAdmin ? 'Super Admin Mode' : 'Staff Employee Mode'}
            </div>
            <div className="text-[10px] text-gray-300 truncate">{user?.name}</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {currentNav.map((item, idx) => {
            if ('section' in item) {
              return (
                <div
                  key={idx}
                  className="px-3 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-gray-400"
                >
                  {item.section}
                </div>
              );
            }

            const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-tgb-gold text-tgb-darknavy font-bold shadow-md shadow-tgb-gold/10'
                    : 'text-gray-300 hover:text-white hover:bg-tgb-darknavy'
                }`}
              >
                <span className={isActive ? 'text-tgb-darknavy' : 'text-gray-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Database Info */}
      <div className="p-3 border-t border-tgb-navyborder bg-tgb-darknavy/50 text-[11px] text-gray-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-semibold">PostgreSQL (Supabase)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="text-[10px] text-gray-400">RLS Active • Multi-Year Retention</div>
      </div>
    </aside>
  );
};

export default PortalSidebar;
