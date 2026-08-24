'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import { transactionService, employeeService } from '@/services';
import { Transaction, User } from '@/types';
import Link from 'next/link';
import {
  Search,
  Filter,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Receipt,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
} from 'lucide-react';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';

function AdminTransactionsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeId, setEmployeeId] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [paymentMethod, setPaymentMethod] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.search({
        query: query.trim() || undefined,
        type: type !== 'ALL' ? type : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        employeeId: employeeId !== 'ALL' ? employeeId : undefined,
        category: category !== 'ALL' ? category : undefined,
        paymentMethod: paymentMethod !== 'ALL' ? paymentMethod : undefined,
        status: status !== 'ALL' ? status : undefined,
        sortBy,
      });
      setTransactions(data);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    employeeService.getAll().then(setEmployees);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [type, startDate, endDate, employeeId, category, paymentMethod, status, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  // Quick Year Filter helper
  const setQuickYear = (year?: number) => {
    if (!year) {
      setStartDate('');
      setEndDate('');
    } else {
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
    }
  };

  // Paginated records
  const totalPages = Math.ceil(transactions.length / pageSize) || 1;
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
            <History className="w-4 h-4" /> Permanent Multi-Year Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Transaction Records & Search
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Showing {transactions.length} recorded transactions across 2024, 2025, and 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/transactions/new?type=BUY"
            className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" /> + NEW BUY
          </Link>
          <Link
            href="/admin/transactions/new?type=SELL"
            className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-tgb-darknavy font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" /> + NEW SELL
          </Link>
        </div>
      </div>

      {/* SEARCH & ADVANCED FILTERS PANEL */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-5 shadow-xl space-y-4">
        {/* Main Text Query Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Tx # (e.g. TGB-2024-000001), Invoice #, customer phone, name, item description..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-4 py-2.5 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-tgb-gold font-mono"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Search Records
          </button>
        </form>

        {/* Quick Year Pill Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-tgb-navyborder/60">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
            Historical Year:
          </span>
          <button
            type="button"
            onClick={() => setQuickYear(undefined)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              !startDate && !endDate
                ? 'bg-tgb-gold text-tgb-darknavy'
                : 'bg-tgb-darknavy text-gray-300 hover:text-white border border-tgb-navyborder'
            }`}
          >
            All Years (2024–2026)
          </button>
          {[2026, 2025, 2024].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setQuickYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                startDate.startsWith(String(yr))
                  ? 'bg-tgb-gold text-tgb-darknavy'
                  : 'bg-tgb-darknavy text-gray-300 hover:text-white border border-tgb-navyborder'
              }`}
            >
              {yr} Records
            </button>
          ))}
        </div>

        {/* Multi-Filter Dropdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Transaction Type */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Types (Buy & Sell)</option>
              <option value="BUY">BUY from Customer</option>
              <option value="SELL">SELL to Customer</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Categories</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Diamond">Diamond</option>
              <option value="Platinum">Platinum</option>
              <option value="Watches">Watches</option>
              <option value="Coins & Currency">Coins & Currency</option>
              <option value="Collectibles">Collectibles</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Payment</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Methods</option>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
              <option value="CHEQUE">CHEQUE</option>
              <option value="WIRE">WIRE</option>
            </select>
          </div>

          {/* Employee Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Staff / Appraiser</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="VOIDED">VOIDED</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Amount: High → Low</option>
              <option value="amount_low">Amount: Low → High</option>
            </select>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS DATA TABLE */}
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
                <th className="py-3 px-4">Appraiser</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Total ($)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tgb-navyborder/60">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400 text-xs">
                    No matching transaction records found for the applied search criteria.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
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
                      <span className="font-bold text-white block">{tx.customerName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{tx.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{tx.employeeName}</td>
                    <td className="py-3 px-4 text-gray-300 max-w-[200px] truncate">
                      {tx.items.map((i) => i.name).join(', ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-200 block">{tx.payment.method}</span>
                      {tx.payment.cardLast4 && (
                        <span className="text-[10px] text-gray-400 font-mono">*{tx.payment.cardLast4}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                      ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        className="px-2.5 py-1 bg-tgb-darknavy hover:bg-tgb-gold hover:text-tgb-darknavy text-tgb-gold border border-tgb-navyborder rounded-lg text-xs font-bold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-tgb-darknavy/60 border-t border-tgb-navyborder flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>Showing Page {currentPage} of {totalPages} ({transactions.length} records)</span>
            <div className="flex items-center gap-1.5">
              <span>Per Page:</span>
              {[20, 50, 100].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded font-mono font-bold ${
                    pageSize === size ? 'bg-tgb-gold text-tgb-darknavy' : 'bg-tgb-navy text-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-tgb-navy border border-tgb-navyborder text-gray-300 disabled:opacity-30 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2 text-white">Page {currentPage}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-tgb-navy border border-tgb-navyborder text-gray-300 disabled:opacity-30 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onTransactionUpdated={fetchTransactions}
      />
    </div>
  );
}

export default function AdminTransactionsPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="text-xs text-tgb-gold p-8">Loading transaction records...</div>}>
        <AdminTransactionsContent />
      </Suspense>
    </PortalLayout>
  );
}
