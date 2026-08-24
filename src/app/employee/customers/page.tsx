'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { customerService } from '@/services';
import { Customer } from '@/types';
import { Users, Search, UserPlus, Phone, MapPin, X, CheckCircle2 } from 'lucide-react';

export default function EmployeeCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
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
    const data = await customerService.search(query);
    setCustomers(data);
  };

  useEffect(() => {
    loadData();
  }, [query]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customerService.create(form);
      setIsModalOpen(false);
      setForm({
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
      loadData();
      alert('Customer registered successfully.');
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Customer Registry
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Look up verified customer accounts or register new walk-in clients
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> + REGISTER CUSTOMER
          </button>
        </div>

        {/* Search */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer phone, name, ID #, customer code..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-4 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-tgb-darknavy border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Mobile Phone</th>
                  <th className="py-3 px-4">ID Verification</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4 text-center">Past Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-tgb-darknavy/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-tgb-gold">{c.id}</td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{c.fullName}</strong>
                      <span className="text-[10px] text-gray-400">{c.email || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300">{c.mobileNumber}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {c.idType}: {c.idNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{c.city}, {c.state}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {c.totalTransactionsCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">New Customer Registration</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.mobileNumber}
                    onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">ID Type *</label>
                  <select
                    value={form.idType}
                    onChange={(e) => setForm({ ...form, idType: e.target.value as any })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="Drivers License">Driver's License</option>
                    <option value="Passport">Passport</option>
                    <option value="State ID">State ID</option>
                    <option value="Military ID">Military ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">ID Number *</label>
                  <input
                    type="text"
                    required
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
