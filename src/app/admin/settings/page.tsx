'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { DemoRepository } from '@/lib/demoRepository';
import {
  Settings,
  Database,
  ShieldCheck,
  Building,
  DollarSign,
  Download,
  RefreshCw,
  Server,
  Cloud,
  CheckCircle2,
  HardDrive,
  Lock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { resetDemoDatabase } = useAuth();
  const [taxRate, setTaxRate] = useState(8.5);
  const [cashEnabled, setCashEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [chequeEnabled, setChequeEnabled] = useState(true);
  const [wireEnabled, setWireEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportFullDatabaseBackup = async () => {
    const users = await DemoRepository.getUsers();
    const customers = await DemoRepository.getCustomers();
    const transactions = await DemoRepository.getTransactions();
    const items = await DemoRepository.getPredefinedItems();
    const auditLogs = await DemoRepository.getAuditLogs();

    const backupData = {
      backupTimestamp: new Date().toISOString(),
      company: 'Texas Gold Buyers LLC',
      dpsLicense: 'TX-PMD-49210',
      database: 'Supabase PostgreSQL',
      data: {
        users,
        customers,
        transactions,
        items,
        auditLogs,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TexasGoldBuyers_FullBackup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortalLayout>
      <div className="space-y-8 pb-16">
        <div>
          <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4" /> Enterprise Configuration & Infrastructure
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
            System Settings & Data Architecture
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure business policies, payment modes, Texas sales tax, and manage database retention
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Settings successfully saved and synchronized.</span>
          </div>
        )}

        {/* 1. Supabase PostgreSQL Infrastructure Card */}
        <div className="bg-gradient-to-r from-tgb-navy via-tgb-darknavy to-tgb-navy border border-tgb-gold/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Supabase PostgreSQL Architecture</h3>
                <p className="text-xs text-gray-400">Production-ready cloud database and object storage instance</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Online & Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-tgb-darknavy p-3 rounded-xl border border-tgb-navyborder space-y-1">
              <span className="text-[10px] text-gray-400 uppercase">Supabase Endpoint</span>
              <div className="text-white font-mono text-[11px] truncate">https://tyepalmkwoxcqzizkknx.supabase.co</div>
            </div>
            <div className="bg-tgb-darknavy p-3 rounded-xl border border-tgb-navyborder space-y-1">
              <span className="text-[10px] text-gray-400 uppercase">Row Level Security</span>
              <div className="text-emerald-400 font-bold">RLS Policies Enforced</div>
            </div>
            <div className="bg-tgb-darknavy p-3 rounded-xl border border-tgb-navyborder space-y-1">
              <span className="text-[10px] text-gray-400 uppercase">Storage Buckets</span>
              <div className="text-tgb-gold font-bold">5 Configured (Images/Docs)</div>
            </div>
          </div>
        </div>

        {/* 2. Business & Tax Configuration Form */}
        <form onSubmit={handleSaveSettings} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white font-display pb-2 border-b border-tgb-navyborder">
            Business & Financial Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                defaultValue="Texas Gold Buyers LLC"
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Texas DPS License #
              </label>
              <input
                type="text"
                defaultValue="TX-PMD-49210"
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Texas Retail Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Active Payment Disbursement Methods
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-tgb-darknavy border border-tgb-navyborder text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={cashEnabled}
                  onChange={(e) => setCashEnabled(e.target.checked)}
                  className="rounded text-tgb-gold focus:ring-tgb-gold bg-tgb-navy"
                />
                <span className="font-bold text-white">Cash Counter</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-tgb-darknavy border border-tgb-navyborder text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardEnabled}
                  onChange={(e) => setCardEnabled(e.target.checked)}
                  className="rounded text-tgb-gold focus:ring-tgb-gold bg-tgb-navy"
                />
                <span className="font-bold text-white">Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-tgb-darknavy border border-tgb-navyborder text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={chequeEnabled}
                  onChange={(e) => setChequeEnabled(e.target.checked)}
                  className="rounded text-tgb-gold focus:ring-tgb-gold bg-tgb-navy"
                />
                <span className="font-bold text-white">Company Cheque</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-tgb-darknavy border border-tgb-navyborder text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={wireEnabled}
                  onChange={(e) => setWireEnabled(e.target.checked)}
                  className="rounded text-tgb-gold focus:ring-tgb-gold bg-tgb-navy"
                />
                <span className="font-bold text-white">Bank Fedwire</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-3 px-6 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              Save System Preferences
            </button>
          </div>
        </form>

        {/* 3. Data Retention & Full Backup Actions */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white font-display pb-2 border-b border-tgb-navyborder">
            5+ Year Data Retention & Backup Center
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            All customer and financial transaction records are permanently assigned immutable identifiers and retained according to Texas Precious Metal Dealer statutes. Export cold database snapshots or reset demo data anytime.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportFullDatabaseBackup}
              className="py-3 px-5 bg-tgb-darknavy hover:bg-tgb-navylight border border-tgb-gold/40 text-tgb-gold font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Database Backup (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset demo database to fresh 350+ historical records (2024-2026)?')) {
                  resetDemoDatabase();
                }
              }}
              className="py-3 px-5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Demo Seed Records</span>
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
