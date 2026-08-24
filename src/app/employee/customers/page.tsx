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
    phone: '',
    email: '',
    driversLicense: '',
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
    if (!form.fullName.trim() || !form.phone.trim()) {
      alert('Please enter customer full name and phone number.');
      return;
    }
    try {
      await customerService.create({
        fullName: form.fullName.trim(),
        mobileNumber: form.phone.trim(),
        email: form.email.trim(),
        address: '2427 W Mockingbird Ln',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75235',
        idType: 'Drivers License',
        idNumber: form.driversLicense.trim() || 'N/A',
      });
      setIsModalOpen(false);
      setForm({ fullName: '', phone: '', email: '', driversLicense: '' });
      loadData();
      alert('Customer saved successfully.');
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
            className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
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
              placeholder="Search by customer phone, name, email, or DL #..."
              className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl pl-10 pr-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-tgb-gold"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#071320] border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3.5 px-4">Customer ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Mobile Phone</th>
                  <th className="py-3.5 px-4">Driver&apos;s License</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4 text-center">Past Orders</th>
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
                      {c.idNumber && c.idNumber !== 'N/A' ? c.idNumber : '—'}
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

      {/* Simplified Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a1827] border border-tgb-gold/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Add Customer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. (469) 555-0199"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  placeholder="e.g. john@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Driver&apos;s License (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. TX-984201"
                  value={form.driversLicense}
                  onChange={(e) => setForm({ ...form, driversLicense: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl uppercase cursor-pointer"
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
