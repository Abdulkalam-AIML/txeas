'use client';

import React from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import TransactionEntryForm from '@/components/transactions/TransactionEntryForm';

export default function EmployeeBuyPage() {
  return (
    <PortalLayout>
      <TransactionEntryForm initialType="BUY" />
    </PortalLayout>
  );
}
