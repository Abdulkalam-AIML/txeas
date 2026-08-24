'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PortalIndexPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/portal/dashboard');
      } else {
        router.replace('/login?redirect=/portal/dashboard');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-tgb-darknavy flex items-center justify-center p-6 text-center">
      <div className="animate-pulse text-xs text-tgb-gold font-mono">
        Connecting to Texas Gold Buyers Secure Portal...
      </div>
    </div>
  );
}
