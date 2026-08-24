'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { transactionService } from '@/services';
import { Transaction } from '@/types';
import { CreditCard, Search, DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    transactionService.search({ paymentMethod: selectedMethod !== 'ALL' ? selectedMethod : undefined, sortBy: 'newest' }).then(setTransactions);
  }, [selectedMethod]);

  const cashTotal = transactions.filter((t) => t.payment.method === 'CASH').reduce((sum, t) => sum + t.finalTotal, 0);
  const cardTotal = transactions.filter((t) => t.payment.method === 'CARD').reduce((sum, t) => sum + t.finalTotal, 0);
  const chequeTotal = transactions.filter((t) => t.payment.method === 'CHEQUE').reduce((sum, t) => sum + t.finalTotal, 0);
  const wireTotal = transactions.filter((t) => t.payment.method === 'WIRE').reduce((sum, t) => sum + t.finalTotal, 0);

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> Settlement & Treasury
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Payment Records & Cashier Ledger
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Live ledger of Cash, Card, Cheque, and Fedwire transaction settlements
            </p>
          </div>
        </div>

        {/* 4 Method KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
            <span className="text-xs text-gray-400 block font-semibold">Cash Ledger</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              ${cashTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
            <span className="text-xs text-gray-400 block font-semibold">Card Processing</span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              ${cardTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
            <span className="text-xs text-gray-400 block font-semibold">Company Cheques</span>
            <div className="text-xl font-bold font-mono text-amber-400">
              ${chequeTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
            <span className="text-xs text-gray-400 block font-semibold">Bank Fedwires</span>
            <div className="text-xl font-bold font-mono text-purple-400">
              ${wireTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-tgb-navy rounded-xl p-1 border border-tgb-navyborder w-fit">
          {['ALL', 'CASH', 'CARD', 'CHEQUE', 'WIRE'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedMethod === m ? 'bg-tgb-gold text-tgb-darknavy' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-tgb-darknavy border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Payment Ref</th>
                  <th className="py-3 px-4">Tx Number</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Card / Cheque Reference</th>
                  <th className="py-3 px-4 text-right">Amount ($)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-tgb-darknavy/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-tgb-gold">{tx.payment.referenceNumber}</td>
                    <td className="py-3 px-4 font-mono text-gray-300">{tx.id}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{tx.customerName}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">{tx.payment.method}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {tx.payment.cardLast4 ? `Card ending in **** ${tx.payment.cardLast4} (${tx.payment.cardType})` : tx.payment.chequeNumber ? `Cheque #${tx.payment.chequeNumber} (${tx.payment.bankName})` : 'Direct Cash/Wire Counter'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                      ${tx.payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {tx.payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </PortalLayout>
  );
}
