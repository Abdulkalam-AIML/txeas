'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { reportService, transactionService } from '@/services';
import { Transaction } from '@/types';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  TrendingUp,
  CreditCard,
  UserCog,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '30days' | '3months' | '1year' | 'all'>('30days');
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getAnalytics(timeframe);
      setAnalytics(data);
      const recent = await transactionService.search({ sortBy: 'newest' });
      setRecentTransactions(recent.slice(0, 8));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeframe]);

  return (
    <PortalLayout>
      <div className="space-y-8 pb-12">
        {/* Top Header & Timeframe Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Texas Gold Buyers Executive Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
              Super Admin Analytics & Overview
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Action Buttons */}
            <Link
              href="/admin/transactions/new?type=BUY"
              className="py-2 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> + New Buy
            </Link>
            <Link
              href="/admin/transactions/new?type=SELL"
              className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-tgb-darknavy font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> + New Sell
            </Link>

            {/* Timeframe selector */}
            <div className="flex bg-tgb-navy rounded-xl p-1 border border-tgb-navyborder">
              {(['today', '7days', '30days', '3months', '1year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                    timeframe === t
                      ? 'bg-tgb-gold text-tgb-darknavy font-bold shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t === 'today' ? 'Today' : t === '7days' ? '7D' : t === '30days' ? '30D' : t === '3months' ? '3M' : '1Y'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8 Metric KPI Overview Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Total Customers */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Total Customers</span>
                <Users className="w-4 h-4 text-tgb-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {analytics.totalCustomers}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">DPS Verified Profiles</div>
            </div>

            {/* 2. Today's Transactions */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Today's Transactions</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {analytics.todayTransactionsCount}
              </div>
              <div className="text-[11px] text-gray-400">Total: {analytics.totalTransactions} in period</div>
            </div>

            {/* 3. Today's Buy Amount */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Today's Buy Payout</span>
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                ${analytics.todayBuyAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400">Total Buy: ${analytics.totalBuyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>

            {/* 4. Today's Sell Amount */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Today's Retail Sell</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                ${analytics.todaySellAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400">Total Sell: ${analytics.totalSellValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>

            {/* 5. Total Transaction Volume */}
            <div className="bg-tgb-navy border border-tgb-gold/30 rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-tgb-gold font-bold">
                <span>Period Gross Volume</span>
                <DollarSign className="w-4 h-4 text-tgb-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono gold-gradient-text">
                ${analytics.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400">Combined Buy & Sell Value</div>
            </div>

            {/* 6. Gold Purchased (Weight) */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Gold Purchased</span>
                <Scale className="w-4 h-4 text-tgb-gold" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {analytics.goldPurchasedOz} <span className="text-xs font-normal text-gray-400">oz</span>
              </div>
              <div className="text-[11px] text-tgb-gold font-mono">{analytics.goldPurchasedGrams.toLocaleString()} grams total</div>
            </div>

            {/* 7. Gold Sold (Weight) */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Gold Sold</span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {analytics.goldSoldOz} <span className="text-xs font-normal text-gray-400">oz</span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">{analytics.goldSoldGrams.toLocaleString()} grams total</div>
            </div>

            {/* 8. Active Employees */}
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 sm:p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Active Staff</span>
                <UserCog className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {analytics.activeEmployees}
              </div>
              <div className="text-[11px] text-gray-400">Across 4 Texas Branches</div>
            </div>
          </div>
        )}

        {/* Charts & Analytics Visualizations */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Monthly Trend Bar / Volume Visualization */}
            <div className="lg:col-span-8 bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">12-Month Volume Trend</h3>
                  <p className="text-xs text-gray-400">Historical Buy vs Sell liquidity comparison across Texas</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> BUY
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> SELL
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-56 flex items-end justify-between gap-2 pt-6 border-b border-tgb-navyborder pb-2">
                {analytics.monthlyTrends.map((m: any, idx: number) => {
                  const maxVal = 250000;
                  const buyHeight = Math.min(100, Math.max(12, (m.buy / maxVal) * 100));
                  const sellHeight = Math.min(100, Math.max(8, (m.sell / maxVal) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: `${buyHeight}%` }}
                          className="w-full max-w-[12px] bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all"
                          title={`${m.month} BUY: $${m.buy.toLocaleString()}`}
                        ></div>
                        <div
                          style={{ height: `${sellHeight}%` }}
                          className="w-full max-w-[12px] bg-amber-500 hover:bg-amber-400 rounded-t transition-all"
                          title={`${m.month} SELL: $${m.sell.toLocaleString()}`}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-400 truncate max-w-full font-mono mt-1">
                        {m.month.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown Donut / Progress List */}
            <div className="lg:col-span-4 bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white font-display">Category Distribution</h3>
                <p className="text-xs text-gray-400">Value breakdown by precious asset type</p>
              </div>

              <div className="space-y-3 pt-2">
                {Object.entries(analytics.categoryBreakdown).map(([cat, data]: [string, any]) => {
                  const total = data.buyValue + data.sellValue;
                  const percentage = analytics.totalVolume > 0 ? (total / analytics.totalVolume) * 100 : 0;

                  return (
                    <div key={cat} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">{cat}</span>
                        <span className="text-tgb-gold font-mono">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-tgb-darknavy rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, Math.max(3, percentage))}%` }}
                          className="h-full bg-gradient-to-r from-tgb-gold to-tgb-goldlight rounded-full"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Staff Performance Leaderboard & Payment Methods */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Staff Leaderboard */}
            <div className="lg:col-span-7 bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Staff Appraiser Performance</h3>
                  <p className="text-xs text-gray-400">Transactions processed and volume generated</p>
                </div>
                <Link href="/admin/employees" className="text-xs text-tgb-gold hover:underline font-semibold">
                  Manage Staff →
                </Link>
              </div>

              <div className="divide-y divide-tgb-navyborder">
                {analytics.employeePerformance.map((emp: any, i: number) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-tgb-darknavy border border-tgb-navyborder flex items-center justify-center font-bold text-gray-300 font-mono">
                        #{i + 1}
                      </span>
                      <div>
                        <strong className="text-white block">{emp.name}</strong>
                        <span className="text-[11px] text-gray-400">{emp.count} transactions completed</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-tgb-gold block">
                        ${emp.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Buy: ${emp.buyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="lg:col-span-5 bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white font-display">Settlement Methods</h3>
                <p className="text-xs text-gray-400">Disbursement and collection distribution</p>
              </div>

              <div className="space-y-3 pt-2">
                {Object.entries(analytics.paymentBreakdown).map(([method, data]: [string, any]) => (
                  <div key={method} className="bg-tgb-darknavy p-3 rounded-xl border border-tgb-navyborder flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-tgb-gold" />
                      <div>
                        <strong className="text-white block">{method}</strong>
                        <span className="text-[11px] text-gray-400">{data.count} transactions</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">
                      ${data.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Recent Counter Transactions</h3>
              <p className="text-xs text-gray-400">Live feed across all 4 Texas flagship lounges</p>
            </div>
            <Link
              href="/admin/transactions"
              className="text-xs font-bold text-tgb-gold hover:underline flex items-center gap-1"
            >
              <span>View All 350+ Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-2.5 px-3">Tx Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Staff / Appraiser</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Total ($)</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-tgb-darknavy/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-tgb-gold">{tx.id}</td>
                    <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                      {new Date(tx.transactionDate).toLocaleDateString()}
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
                    <td className="py-3 px-3 text-gray-300">{tx.employeeName}</td>
                    <td className="py-3 px-3 text-gray-300">{tx.items.length}</td>
                    <td className="py-3 px-3 text-gray-300 font-semibold">{tx.payment.method}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-xs text-tgb-gold hover:underline font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onTransactionUpdated={loadData}
      />
    </PortalLayout>
  );
}
