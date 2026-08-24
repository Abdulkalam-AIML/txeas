'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/portal/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#071522] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-tgb-navy border border-tgb-gold/30 flex items-center justify-center animate-pulse">
        <Shield className="w-6 h-6 text-tgb-gold" />
      </div>
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-white font-display tracking-wide">
          Texas Gold Buyers • Secure Business Portal
        </h2>
        <p className="text-xs text-gray-400 font-mono">Initializing staff session...</p>
      </div>
    </div>
  );
}
