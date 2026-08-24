'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { reportService, employeeService } from '@/services';
import { ReportFilter, Transaction, User } from '@/types';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  Sparkles,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeId, setEmployeeId] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [paymentMethod, setPaymentMethod] = useState('ALL');

  const [employees, setEmployees] = useState<User[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    employeeService.getAll().then(setEmployees);
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const filters: ReportFilter = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        employeeId: employeeId !== 'ALL' ? employeeId : undefined,
        category: category !== 'ALL' ? category : undefined,
        paymentMethod: paymentMethod !== 'ALL' ? paymentMethod : undefined,
        transactionType: reportType === 'BUY' ? 'BUY' : reportType === 'SELL' ? 'SELL' : 'ALL',
      };

      const result = await reportService.generateFilteredReport(filters);
      setReportData(result);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [reportType, startDate, endDate, employeeId, category, paymentMethod]);

  const handleExportCSV = () => {
    if (!reportData) return;
    reportService.exportToCSV(reportData, `TexasGoldBuyers_${reportType}_Report.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" /> Texas Precious Metals Analytics Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Reporting & Financial Audit Center
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Generate itemized, metal-specific, and employee-level financial audit reports with one-click export
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* REPORT TYPE SELECTOR PILLS */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'BUY', label: 'Buy Report' },
            { id: 'SELL', label: 'Sell Report' },
            { id: 'Gold', label: 'Gold Metals' },
            { id: 'Silver', label: 'Silver Metals' },
            { id: 'Diamond', label: 'Diamond Jewels' },
            { id: 'Platinum', label: 'Platinum' },
            { id: 'Watches', label: 'Luxury Watches' },
            { id: 'Coins & Currency', label: 'Rare Coins' },
            { id: 'Collectibles', label: 'Collectibles' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => {
                if (r.id === 'BUY' || r.id === 'SELL' || r.id === 'ALL') {
                  setReportType(r.id);
                  setCategory('ALL');
                } else {
                  setReportType('ALL');
                  setCategory(r.id);
                }
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                (r.id === reportType && category === 'ALL') || category === r.id
                  ? 'bg-tgb-gold text-tgb-darknavy shadow-md'
                  : 'bg-tgb-navy border border-tgb-navyborder text-gray-300 hover:border-tgb-gold/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* REPORT FILTERS */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Staff Member</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Staff</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Payment Method</label>
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
        </div>

        {/* REPORT SUMMARY METRICS */}
        {reportData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
              <span className="text-xs text-gray-400 block font-semibold">Total Records</span>
              <div className="text-2xl font-mono font-bold text-white">{reportData.recordCount}</div>
              <div className="text-[11px] text-gray-400">{reportData.completedCount} Completed • {reportData.voidedCount} Voided</div>
            </div>

            <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
              <span className="text-xs text-gray-400 block font-semibold">Gross Turnover</span>
              <div className="text-2xl font-mono font-bold text-tgb-gold">
                ${reportData.totalTurnover.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400">Total Volume in Filter</div>
            </div>

            <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
              <span className="text-xs text-gray-400 block font-semibold">Buy Disbursements</span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                ${reportData.totalBuyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400">{reportData.totalBuyCount} Buy Orders</div>
            </div>

            <div className="bg-tgb-navy border border-tgb-navyborder rounded-xl p-4 space-y-1">
              <span className="text-xs text-gray-400 block font-semibold">Gold Weight (oz)</span>
              <div className="text-xl font-mono font-bold text-white">
                {reportData.goldOz} <span className="text-xs text-gray-400">oz</span>
              </div>
              <div className="text-[11px] text-tgb-gold font-mono">{reportData.goldGrams} grams pure</div>
            </div>
          </div>
        )}

        {/* REPORT TABLE */}
        {reportData && (
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
                    <th className="py-3 px-4">Staff</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tgb-navyborder/60">
                  {reportData.transactions.map((tx: Transaction) => (
                    <tr key={tx.id} className="hover:bg-tgb-darknavy/70 transition-colors">
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
                      <td className="py-3 px-4 font-semibold text-white">{tx.customerName}</td>
                      <td className="py-3 px-4 text-gray-300">{tx.employeeName}</td>
                      <td className="py-3 px-4 text-gray-300 max-w-[200px] truncate">
                        {tx.items.map((i) => i.name).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{tx.payment.method}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
