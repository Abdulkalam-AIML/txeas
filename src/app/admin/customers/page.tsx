'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { customerService, transactionService } from '@/services';
import { Customer, Transaction } from '@/types';
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  History,
} from 'lucide-react';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<any>({
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

  const loadCustomers = async () => {
    const data = await customerService.search(query);
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, [query]);

  const openCustomerProfile = async (customer: Customer) => {
    setSelectedCustomer(customer);
    const txs = await transactionService.getByCustomerId(customer.id);
    setCustomerTransactions(txs);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await customerService.create(customerForm);
      setIsCreateModalOpen(false);
      setCustomerForm({
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
      loadCustomers();
      openCustomerProfile(created);
    } catch (err: any) {
      alert(err.message || 'Error creating customer');
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      const updated = await customerService.update(selectedCustomer.id, customerForm);
      setIsEditModalOpen(false);
      setSelectedCustomer(updated);
      loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Error updating customer');
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" /> Texas DPS Customer Database
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Customer Registry & Profiles
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing {customers.length} verified customer accounts and lifetime transaction values
            </p>
          </div>

          <button
            onClick={() => {
              setCustomerForm({
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
              setIsCreateModalOpen(true);
            }}
            className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> + REGISTER NEW CUSTOMER
          </button>
        </div>

        {/* Search Input */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer by name, mobile phone (214-555-...), ID #, email, customer code..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-4 py-2.5 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-tgb-gold font-mono"
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
                  <th className="py-3 px-4">Government ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Lifetime Buy ($)</th>
                  <th className="py-3 px-4 text-right">Lifetime Sell ($)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => openCustomerProfile(c)}
                    className="hover:bg-tgb-darknavy/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-tgb-gold">{c.id}</td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{c.fullName}</strong>
                      <span className="text-[10px] text-gray-400">{c.email || 'No email on file'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300">{c.mobileNumber}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {c.idType}: {c.idNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{c.city}, {c.state}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {c.totalTransactionsCount || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      ${(c.totalBuyAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                      ${(c.totalSellAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomerProfile(c);
                        }}
                        className="px-2.5 py-1 bg-tgb-darknavy hover:bg-tgb-gold hover:text-tgb-darknavy text-tgb-gold border border-tgb-navyborder rounded-lg text-xs font-bold transition-all"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-tgb-navy border border-tgb-gold/30 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-tgb-navyborder">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded border border-tgb-gold/20">
                    {selectedCustomer.id}
                  </span>
                  <span className="text-xs text-gray-400">
                    Registered: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white font-display">
                  {selectedCustomer.fullName}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCustomerForm({ ...selectedCustomer });
                    setIsEditModalOpen(true);
                  }}
                  className="py-2 px-3.5 bg-tgb-darknavy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-tgb-gold" /> Edit Record
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-gray-400 hover:text-white bg-tgb-darknavy rounded-xl border border-tgb-navyborder"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Meta Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder text-xs space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Contact & Location</span>
                <div className="text-white font-mono font-bold">{selectedCustomer.mobileNumber}</div>
                <div className="text-gray-300">{selectedCustomer.email || 'No email provided'}</div>
                <div className="text-gray-400 text-[11px] pt-1">
                  {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
                </div>
              </div>

              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder text-xs space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Government ID Verification</span>
                <div className="text-white font-bold">{selectedCustomer.idType}</div>
                <div className="text-tgb-gold font-mono font-bold text-sm">{selectedCustomer.idNumber}</div>
                <div className="text-gray-400 text-[11px]">Texas DPS Statutory Compliance Active</div>
              </div>

              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder text-xs space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Lifetime Value</span>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  Buy Payouts: ${(selectedCustomer.totalBuyAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs font-bold text-amber-400 font-mono">
                  Retail Sells: ${(selectedCustomer.totalSellAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-gray-400">{customerTransactions.length} recorded orders</div>
              </div>
            </div>

            {/* Customer Transaction History Table */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white font-display">
                Complete Transaction History ({customerTransactions.length} Records)
              </h3>

              <div className="bg-tgb-darknavy border border-tgb-navyborder rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-tgb-navy border-b border-tgb-navyborder text-[10px] uppercase font-bold text-gray-400">
                      <th className="py-2.5 px-3">Tx Number</th>
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Staff</th>
                      <th className="py-2.5 px-3 text-right">Total ($)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tgb-navyborder/60">
                    {customerTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                          No transaction orders recorded yet for this customer profile.
                        </td>
                      </tr>
                    ) : (
                      customerTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-tgb-navy/60 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-tgb-gold">{tx.id}</td>
                          <td className="py-2.5 px-3 font-mono text-gray-300 text-[11px]">{tx.invoiceNumber}</td>
                          <td className="py-2.5 px-3 text-gray-300 font-mono text-[11px]">
                            {new Date(tx.transactionDate).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-300 max-w-[200px] truncate">
                            {tx.items.map((i) => i.name).join(', ')}
                          </td>
                          <td className="py-2.5 px-3 text-gray-300">{tx.employeeName}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                            ${tx.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedTx(tx)}
                              className="text-xs text-tgb-gold hover:underline font-bold"
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
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOMER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Register New Customer Profile</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerForm.fullName}
                    onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                    placeholder="Customer Name"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerForm.mobileNumber}
                    onChange={(e) => setCustomerForm({ ...customerForm, mobileNumber: e.target.value })}
                    placeholder="(214) 555-0100"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    placeholder="customer@gmail.com"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">ID Type *</label>
                  <select
                    value={customerForm.idType}
                    onChange={(e) => setCustomerForm({ ...customerForm, idType: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="Drivers License">Driver's License (Texas/Other)</option>
                    <option value="Passport">Passport</option>
                    <option value="State ID">State ID</option>
                    <option value="Military ID">Military ID</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Government ID Number *</label>
                <input
                  type="text"
                  required
                  value={customerForm.idNumber}
                  onChange={(e) => setCustomerForm({ ...customerForm, idNumber: e.target.value })}
                  placeholder="TX-DL-8492019"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  placeholder="123 Main St"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={customerForm.state}
                    onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Zip</label>
                  <input
                    type="text"
                    value={customerForm.zipCode}
                    onChange={(e) => setCustomerForm({ ...customerForm, zipCode: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Create Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Edit Customer Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCustomer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerForm.fullName}
                  onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerForm.mobileNumber}
                    onChange={(e) => setCustomerForm({ ...customerForm, mobileNumber: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={customerForm.email || ''}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </PortalLayout>
  );
}
