'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { transactionService, customerService } from '@/services';
import { Transaction, Customer } from '@/types';
import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  History,
  Receipt,
  Users,
  Search,
  DollarSign,
  TrendingUp,
  Scale,
  Sparkles,
  ArrowRight,
  Building,
  CheckCircle2,
  X,
} from 'lucide-react';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    address: '',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    idType: 'Drivers License' as const,
    idNumber: '',
    notes: '',
  });

  const loadData = async () => {
    const all = await transactionService.search({ sortBy: 'newest' });
    setMyTransactions(all.slice(0, 10));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customerService.create(newCustomerForm);
      alert(`Customer ${newCustomerForm.fullName} registered successfully.`);
      setNewCustomerModalOpen(false);
      setNewCustomerForm({
        fullName: '',
        mobileNumber: '',
        email: '',
        address: '',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        idType: 'Drivers License',
        idNumber: '',
        notes: '',
      });
    } catch (err: any) {
      alert(err.message || 'Error registering customer');
    }
  };

  // Compute today's employee performance
  const todayBuys = myTransactions.filter((t) => t.type === 'BUY');
  const todaySells = myTransactions.filter((t) => t.type === 'SELL');
  const todayBuyTotal = todayBuys.reduce((sum, t) => sum + t.finalTotal, 0);
  const todaySellTotal = todaySells.reduce((sum, t) => sum + t.finalTotal, 0);

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        {/* Top Welcome Header */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Staff POS Counter Active
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              Welcome back, {user?.name || 'Staff Member'}
            </h1>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-tgb-gold" />
              <span>2427 W Mockingbird Ln, Dallas, TX 75235</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/employee/profile"
              className="py-2 px-3 bg-tgb-darknavy border border-tgb-navyborder text-gray-300 hover:text-white rounded-xl text-xs font-semibold"
            >
              My Staff ID: {user?.id}
            </Link>
          </div>
        </div>

        {/* PRIMARY TOUCH ACTION BAR (Optimized for Fast 1-Hand / Mobile / Tablet POS Tap) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. NEW BUY (Large Emerald Touch Card) */}
          <Link
            href="/employee/buy"
            className="bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between h-36 group active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">
                Counter Buy
              </span>
            </div>
            <div>
              <div className="text-xl font-black font-display tracking-wide uppercase">
                + NEW BUY
              </div>
              <div className="text-[11px] text-emerald-100 mt-0.5">
                Purchase gold, scrap, coins & watches from customer
              </div>
            </div>
          </Link>

          {/* 2. NEW SELL (Large Amber Touch Card) */}
          <Link
            href="/employee/sell"
            className="bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between h-36 group active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">
                Retail Inventory
              </span>
            </div>
            <div>
              <div className="text-xl font-black font-display tracking-wide uppercase">
                + NEW SELL
              </div>
              <div className="text-[11px] text-amber-100 mt-0.5">
                Sell bullion, diamonds & luxury jewelry to customer
              </div>
            </div>
          </Link>

          {/* 3. NEW CUSTOMER */}
          <button
            onClick={() => setNewCustomerModalOpen(true)}
            className="bg-gradient-to-br from-tgb-navy to-tgb-darknavy border border-tgb-gold/40 hover:border-tgb-gold text-white rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between h-36 text-left active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-tgb-gold/20 flex items-center justify-center text-tgb-gold">
                <UserPlus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded">
                Intake
              </span>
            </div>
            <div>
              <div className="text-lg font-bold font-display tracking-wide text-white">
                + NEW CUSTOMER
              </div>
              <div className="text-[11px] text-gray-300 mt-0.5">
                Register customer with Texas DPS photo ID
              </div>
            </div>
          </button>

          {/* 4. MY TRANSACTIONS */}
          <Link
            href="/employee/transactions"
            className="bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between h-36 group active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-tgb-darknavy border border-tgb-navyborder flex items-center justify-center text-cyan-400">
                <History className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Records
              </span>
            </div>
            <div>
              <div className="text-lg font-bold font-display tracking-wide text-white">
                MY TRANSACTIONS
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                View & search your counter orders and receipts
              </div>
            </div>
          </Link>
        </div>

        {/* Counter Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 text-xs space-y-1">
            <span className="text-gray-400 block font-semibold">Today's Total Tx</span>
            <div className="text-2xl font-mono font-bold text-white">{myTransactions.length}</div>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 text-xs space-y-1">
            <span className="text-gray-400 block font-semibold">Today's Buy Payout</span>
            <div className="text-2xl font-mono font-bold text-emerald-400">
              ${todayBuyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 text-xs space-y-1">
            <span className="text-gray-400 block font-semibold">Today's Sell Total</span>
            <div className="text-2xl font-mono font-bold text-amber-400">
              ${todaySellTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 text-xs space-y-1">
            <span className="text-gray-400 block font-semibold">Gross Counter Volume</span>
            <div className="text-2xl font-mono font-bold text-tgb-gold">
              ${(todayBuyTotal + todaySellTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Recent Counter Transactions Feed */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">My Counter Orders</h3>
              <p className="text-xs text-gray-400">Recent customer transactions and receipts</p>
            </div>
            <Link
              href="/employee/transactions"
              className="text-xs text-tgb-gold hover:underline font-semibold flex items-center gap-1"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-2.5 px-3">Tx Number</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Total ($)</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-tgb-darknavy/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-tgb-gold">{tx.id}</td>
                    <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                      {new Date(tx.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{tx.customerName}</td>
                    <td className="py-3 px-3 text-gray-300">{tx.items.length} items</td>
                    <td className="py-3 px-3 text-gray-300 font-semibold">{tx.payment.method}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-xs text-tgb-gold hover:underline font-semibold"
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onTransactionUpdated={loadData}
      />

      {/* Customer Quick Registration Modal */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">New Customer Registration</h3>
              <button onClick={() => setNewCustomerModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.fullName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, fullName: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={newCustomerForm.mobileNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, mobileNumber: e.target.value })}
                  placeholder="(469) 555-0100"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  placeholder="customer@email.com"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Driver&apos;s License (Optional)</label>
                <input
                  type="text"
                  value={newCustomerForm.idNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, idNumber: e.target.value })}
                  placeholder="TX-DL-8492019"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewCustomerModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs rounded-lg uppercase cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
