'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { transactionService } from '@/services';
import { Transaction } from '@/types';
import Link from 'next/link';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Plus,
  History,
} from 'lucide-react';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';

export default function EmployeeTransactionsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.search({
        query: query.trim() || undefined,
        type: type !== 'ALL' ? type : undefined,
        employeeId: user?.id,
        sortBy: 'newest',
      });
      setTransactions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [type]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              My Counter Transactions
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Personal transaction ledger for staff appraiser: <strong className="text-white">{user?.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/employee/buy"
              className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" /> + NEW BUY
            </Link>
            <Link
              href="/employee/sell"
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-tgb-darknavy font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" /> + NEW SELL
            </Link>
          </div>
        </div>

        {/* Search Bar & Type Filter */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer phone, name, transaction #, invoice #..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
            />
          </form>

          <div className="flex bg-tgb-darknavy rounded-xl p-1 border border-tgb-navyborder shrink-0">
            {(['ALL', 'BUY', 'SELL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  type === t ? 'bg-tgb-gold text-tgb-darknavy' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-tgb-darknavy border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Tx Number</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4 text-right">Total ($)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      No matching transactions found in your staff ledger.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-tgb-darknavy/70 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-tgb-gold">{tx.id}</td>
                      <td className="py-3 px-4 font-mono text-gray-300 text-[11px]">{tx.invoiceNumber}</td>
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
                      <td className="py-3 px-4">
                        <strong className="text-white block">{tx.customerName}</strong>
                        <span className="text-[10px] text-gray-400">{tx.customerPhone}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 max-w-[220px] truncate">
                        {tx.items.map((i) => i.name).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                        ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="px-2.5 py-1 bg-tgb-darknavy hover:bg-tgb-gold hover:text-tgb-darknavy text-tgb-gold border border-tgb-navyborder rounded-lg text-xs font-bold transition-all"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onTransactionUpdated={loadData}
      />
    </PortalLayout>
  );
}
