'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { auditService } from '@/services';
import { AuditLog } from '@/types';
import { ScrollText, Search, Shield, Filter, Clock, Eye } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const loadLogs = async () => {
    const data = await auditService.getAll({
      query: query.trim() || undefined,
      action: actionFilter !== 'ALL' ? actionFilter : undefined,
    });
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
  }, [query, actionFilter]);

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Immutable Security Audit Trail
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              System Audit Logs
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Permanent chronological record of every login, transaction, customer creation, void, and export
            </p>
          </div>
        </div>

        {/* Search & Action Filter */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search logs by staff name, action, transaction ID, customer ID..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
            />
          </div>

          <div className="shrink-0">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-tgb-darknavy border border-tgb-navyborder rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
            >
              <option value="ALL">All Actions</option>
              <option value="TRANSACTION_CREATED">TRANSACTION_CREATED</option>
              <option value="TRANSACTION_VOIDED">TRANSACTION_VOIDED</option>
              <option value="CUSTOMER_CREATED">CUSTOMER_CREATED</option>
              <option value="CUSTOMER_UPDATED">CUSTOMER_UPDATED</option>
              <option value="EMPLOYEE_CREATED">EMPLOYEE_CREATED</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-tgb-darknavy border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-tgb-darknavy/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-tgb-gold text-[11px]">{log.id}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action.includes('VOID')
                            ? 'bg-rose-500/20 text-rose-400'
                            : log.action.includes('CREATED')
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{log.userName}</td>
                    <td className="py-3 px-4 text-gray-300">{log.role}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-tgb-gold">{log.entityId}</td>
                    <td className="py-3 px-4 text-gray-300 max-w-[280px] truncate">{log.details}</td>
                    <td className="py-3 px-4 text-right font-mono text-gray-400 text-[11px]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
