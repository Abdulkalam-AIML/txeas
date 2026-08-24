'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { transactionService } from '@/services';
import { Transaction } from '@/types';
import InvoiceViewModal from '@/components/invoices/InvoiceViewModal';
import { Receipt, Search, Printer } from 'lucide-react';

export default function EmployeeInvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Transaction[]>([]);
  const [query, setQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    transactionService.search({ query: query.trim() || undefined, employeeId: user?.id, sortBy: 'newest' }).then(setInvoices);
  }, [query, user?.id]);

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            My Invoices & Receipts
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Search and print receipts for customer transactions handled by you
          </p>
        </div>

        {/* Search */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by invoice number, customer phone, name..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-4 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-tgb-darknavy border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Tx Number</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Amount ($)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {invoices.map((tx) => (
                  <tr key={tx.id} className="hover:bg-tgb-darknavy/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-tgb-gold">{tx.invoiceNumber}</td>
                    <td className="py-3 px-4 font-mono text-gray-300">{tx.id}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{tx.customerName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="py-1 px-3 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs rounded-lg transition-all flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTx && (
        <InvoiceViewModal
          isOpen={Boolean(selectedTx)}
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </PortalLayout>
  );
}
