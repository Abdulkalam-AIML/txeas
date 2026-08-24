'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import EmployeeDashboardPage from '@/app/employee/dashboard/page';
import { Shield, Sparkles } from 'lucide-react';

export default function PortalDashboardRouter() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=/portal/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tgb-darknavy flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-tgb-navy border border-tgb-gold/30 flex items-center justify-center animate-pulse">
          <Shield className="w-6 h-6 text-tgb-gold" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white font-display tracking-wide">
            Authenticating Texas Gold Buyers Secure Portal
          </h2>
          <p className="text-xs text-gray-400 font-mono">Verifying authorization credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If Super Admin, render the full executive suite
  if (role === 'SUPER_ADMIN') {
    return <AdminDashboardPage />;
  }

  // If Staff Appraiser / Employee, render the counter POS suite
  return <EmployeeDashboardPage />;
}
