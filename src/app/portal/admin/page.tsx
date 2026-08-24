'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-tgb-darknavy flex items-center justify-center text-xs text-tgb-gold font-mono">
      Loading Executive Suite...
    </div>
  );
}
