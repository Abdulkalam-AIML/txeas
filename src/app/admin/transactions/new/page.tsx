'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import TransactionEntryForm from '@/components/transactions/TransactionEntryForm';
import { TransactionType } from '@/types';

function NewTransactionContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as TransactionType;
  const initialType: TransactionType = typeParam === 'SELL' ? 'SELL' : 'BUY';

  return <TransactionEntryForm initialType={initialType} />;
}

export default function AdminNewTransactionPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="text-xs text-tgb-gold p-8">Loading form...</div>}>
        <NewTransactionContent />
      </Suspense>
    </PortalLayout>
  );
}
