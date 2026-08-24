'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalEmployeeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/employee/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-tgb-darknavy flex items-center justify-center text-xs text-emerald-400 font-mono">
      Loading Staff POS Suite...
    </div>
  );
}
