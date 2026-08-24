'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Customer,
  Transaction,
  TransactionItem,
  TransactionType,
  PaymentMethod,
  MetalCategory,
  PredefinedMenuItem,
  ItemImage,
} from '@/types';
import {
  customerService,
  transactionService,
  itemService,
  fileService,
} from '@/services';
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Camera,
  Search,
  UserPlus,
  CheckCircle2,
  DollarSign,
  Receipt,
  Scale,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  CreditCard,
  Building,
  Calendar,
  X,
  Printer,
  History,
} from 'lucide-react';
import InvoiceViewModal from '@/components/invoices/InvoiceViewModal';

interface TransactionEntryFormProps {
  initialType?: TransactionType;
}

export const TransactionEntryForm: React.FC<TransactionEntryFormProps> = ({
  initialType = 'BUY',
}) => {
  const router = useRouter();
  const { user } = useAuth();

  // Transaction Header State
  const [txType, setTxType] = useState<TransactionType>(initialType);
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');

  // Customer Selection State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchDropdownOpen, setCustomerSearchDropdownOpen] = useState(false);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);

  // New Customer Form State
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

  // Predefined Menu Catalog
  const [menuItems, setMenuItems] = useState<PredefinedMenuItem[]>([]);

  // Transaction Items (Starts with 1 item, supports unlimited items)
  const [items, setItems] = useState<TransactionItem[]>([
    {
      id: `ITEM-INIT-${Date.now()}`,
      isCustom: false,
      category: 'Gold',
      name: 'Gold Ring',
      description: 'Standard XRF assayed gold piece.',
      material: '14K Yellow Gold',
      purity: '14K (58.5%)',
      weight: 12.5,
      unit: 'g',
      quantity: 1,
      estimatedMarketValue: 650.0,
      offeredUnitPrice: 52.0,
      totalPrice: 650.0,
      images: [],
    },
  ]);

  // Payment Details State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [discountOrAdjustment, setDiscountOrAdjustment] = useState<number>(0);
  const [cardLast4, setCardLast4] = useState('');
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard' | 'Amex' | 'Discover'>('Visa');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState<Transaction | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  // Load initial customers & menu
  useEffect(() => {
    customerService.getAll().then((data) => {
      setCustomers(data);
      if (data.length > 0) setSelectedCustomer(data[0]);
    });
    itemService.getPredefinedMenu().then(setMenuItems);
  }, []);

  // Filtered customer search
  const filteredCustomers = customerSearchQuery.trim()
    ? customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
          c.mobileNumber.includes(customerSearchQuery) ||
          c.id.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
          c.idNumber.toLowerCase().includes(customerSearchQuery.toLowerCase())
      )
    : customers.slice(0, 10);

  // Handle adding an item
  const handleAddItem = (isCustom = false) => {
    const newItem: TransactionItem = {
      id: `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isCustom,
      category: 'Gold',
      name: isCustom ? 'Custom Gold / Estate Item' : 'Gold Chain',
      description: 'Assayed at counter with XRF Spectrometer.',
      material: '14K Yellow Gold',
      purity: '14K (58.5%)',
      weight: 15.0,
      unit: 'g',
      quantity: 1,
      estimatedMarketValue: 780.0,
      offeredUnitPrice: 52.0,
      totalPrice: 780.0,
      images: [],
    };
    setItems([...items, newItem]);
  };

  // Handle removing an item
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('A transaction must contain at least one item.');
      return;
    }
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Handle item change
  const handleItemFieldChange = (index: number, fields: Partial<TransactionItem>) => {
    const updated = [...items];
    const item = { ...updated[index], ...fields };

    // Auto-calculate total price
    const unitPrice = Number(item.offeredUnitPrice) || 0;
    const qty = Number(item.quantity) || 1;
    const weight = Number(item.weight) || 1;

    let computedTotal = 0;
    if (item.unit === 'g' || item.unit === 'oz' || item.unit === 'dwt' || item.unit === 'ct') {
      computedTotal = +(qty * unitPrice * weight).toFixed(2);
    } else {
      computedTotal = +(qty * unitPrice).toFixed(2);
    }

    item.totalPrice = computedTotal;
    item.estimatedMarketValue = +(computedTotal * 1.12).toFixed(2);
    updated[index] = item;
    setItems(updated);
  };

  // Handle selecting a predefined item from the menu
  const handleSelectPredefinedMenu = (index: number, menuItemId: string) => {
    const selected = menuItems.find((m) => m.id === menuItemId);
    if (!selected) return;

    handleItemFieldChange(index, {
      isCustom: false,
      category: selected.category,
      name: selected.name,
      material: selected.defaultMaterial,
      purity: selected.defaultPurity,
      unit: selected.typicalUnit,
      offeredUnitPrice: selected.estPricePerUnit || 50,
      description: `Catalog standard: ${selected.name}`,
    });
  };

  // Handle file / camera image upload for an item
  const handleImageUpload = async (itemIndex: number, e: React.ChangeEvent<HTMLInputElement>, tag: ItemImage['tag'] = 'General') => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    try {
      const uploadedImages: ItemImage[] = [];
      for (const file of files) {
        const img = await fileService.processUploadedFile(file, tag);
        uploadedImages.push(img);
      }

      const updated = [...items];
      updated[itemIndex].images = [...updated[itemIndex].images, ...uploadedImages];
      setItems(updated);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    }
  };

  // Handle removing an image from an item
  const handleRemoveImage = (itemIndex: number, imageId: string) => {
    const updated = [...items];
    updated[itemIndex].images = updated[itemIndex].images.filter((img) => img.id !== imageId);
    setItems(updated);
  };

  // Financial Calculations
  const subtotal = +items.reduce((acc, i) => acc + (Number(i.totalPrice) || 0), 0).toFixed(2);
  const taxRatePercent = txType === 'SELL' ? 8.25 : 0; // In Texas, selling retail has 8.25% sales tax; buying scrap is 0%
  const taxableAmount = Math.max(0, subtotal + Number(discountOrAdjustment));
  const taxAmount = +(txType === 'SELL' ? taxableAmount * (taxRatePercent / 100) : 0).toFixed(2);
  const finalTotal = +(taxableAmount + taxAmount).toFixed(2);

  // Quick Customer Creation
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await customerService.create(newCustomerForm);
      setCustomers([created, ...customers]);
      setSelectedCustomer(created);
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
      alert(err.message || 'Could not register customer');
    }
  };

  // Save Transaction
  const handleSaveTransaction = async () => {
    if (!selectedCustomer) {
      alert('Please select or create a customer before saving.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item.');
      return;
    }

    setIsSaving(true);
    try {
      const newTx = await transactionService.create({
        type: txType,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.fullName,
        customerPhone: selectedCustomer.mobileNumber,
        customerEmail: selectedCustomer.email,
        customerAddress: selectedCustomer.address,
        employeeId: user?.id || 'USR-001',
        employeeName: user?.name || 'Staff Employee',
        locationId: user?.locationId || 'LOC-01',
        locationName: user?.locationName || 'Dallas Flagship — Uptown',
        transactionDate: new Date(txDate).toISOString(),
        status: 'COMPLETED',
        items,
        subtotal,
        discountOrAdjustment: Number(discountOrAdjustment),
        taxRatePercent,
        taxAmount,
        finalTotal,
        payment: {
          method: paymentMethod,
          amount: finalTotal,
          status: 'COMPLETED',
          referenceNumber: `REF-${Date.now().toString().slice(-6)}`,
          paidAt: new Date().toISOString(),
          cardLast4: paymentMethod === 'CARD' ? cardLast4 || '4242' : undefined,
          cardType: paymentMethod === 'CARD' ? cardType : undefined,
          chequeNumber: paymentMethod === 'CHEQUE' ? chequeNumber || '5001' : undefined,
          bankName: paymentMethod === 'CHEQUE' ? bankName || 'Chase Bank' : undefined,
          notes: paymentNotes,
        },
        notes,
        termsAccepted: true,
      });

      setSavedTransaction(newTx);
      setIsCompletedSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  if (isCompletedSuccess && savedTransaction) {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-[#0a1827] border border-tgb-gold/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fade-in">
        {/* Gold Checkmark Success Ring Animation */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-tgb-gold">
            Official Record Saved & Audited
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            TRANSACTION COMPLETED
          </h2>
          <p className="text-xs text-gray-400">
            DPS compliance record registered and inventory updated.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-[#071320] border border-tgb-navyborder rounded-2xl p-6 text-left space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Receipt / Tx #:</span>
            <span className="font-bold text-tgb-gold">{savedTransaction.invoiceNumber}</span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Customer:</span>
            <span className="font-bold text-white">{savedTransaction.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Order Type:</span>
            <span className={`font-bold ${savedTransaction.type === 'BUY' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {savedTransaction.type === 'BUY' ? 'BUY ORDER (Customer Payout)' : 'RETAIL SALE'}
            </span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Total Amount:</span>
            <span className="font-bold text-xl text-white font-sans">
              ${savedTransaction.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Payment Method:</span>
            <span className="font-bold text-white">{savedTransaction.payment.method} ({savedTransaction.payment.status})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setInvoiceModalOpen(true)}
            className="py-3 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>

          <button
            onClick={() => {
              if (user?.role === 'SUPER_ADMIN') {
                router.push('/admin/transactions');
              } else {
                router.push('/employee/transactions');
              }
            }}
            className="py-3 px-4 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <History className="w-4 h-4 text-tgb-gold" />
            <span>VIEW TRANSACTIONS</span>
          </button>

          <button
            onClick={() => {
              setIsCompletedSuccess(false);
              setSavedTransaction(null);
              setSelectedCustomer(null);
              setNotes('');
              setItems([
                {
                  id: `ITEM-INIT-${Date.now()}`,
                  isCustom: false,
                  category: 'Gold',
                  name: 'Gold Ring',
                  description: 'Standard XRF assayed gold piece.',
                  material: '14K Yellow Gold',
                  purity: '14K (58.5%)',
                  weight: 10,
                  unit: 'g',
                  quantity: 1,
                  estimatedMarketValue: 520.0,
                  offeredUnitPrice: 52.0,
                  totalPrice: 520.0,
                  images: [],
                }
              ]);
            }}
            className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>NEW TRANSACTION</span>
          </button>
        </div>

        {invoiceModalOpen && (
          <InvoiceViewModal
            isOpen={invoiceModalOpen}
            transaction={savedTransaction}
            onClose={() => setInvoiceModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Mode Toggle */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                txType === 'BUY'
                  ? 'bg-emerald-500 text-tgb-darknavy'
                  : 'bg-amber-500 text-tgb-darknavy'
              }`}
            >
              {txType === 'BUY' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              {txType === 'BUY' ? 'BUY FROM CUSTOMER' : 'SELL TO CUSTOMER'}
            </span>
            <span className="text-xs text-gray-400 font-mono">TGB-2026-XXXXXX</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display mt-1">
            {txType === 'BUY' ? 'New Precious Metals Buy Order' : 'New Retail Inventory Sale'}
          </h1>
        </div>

        {/* Buy vs Sell Switcher */}
        <div className="flex bg-tgb-darknavy rounded-xl p-1 border border-tgb-navyborder shrink-0">
          <button
            type="button"
            onClick={() => setTxType('BUY')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              txType === 'BUY'
                ? 'bg-emerald-500 text-tgb-darknavy shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" /> BUY FROM CUSTOMER
          </button>
          <button
            type="button"
            onClick={() => setTxType('SELL')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              txType === 'SELL'
                ? 'bg-amber-500 text-tgb-darknavy shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> SELL TO CUSTOMER
          </button>
        </div>
      </div>

      {/* SECTION 1: CUSTOMER SELECTION & INTAKE */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-tgb-navyborder">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-tgb-gold/15 text-tgb-gold flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Customer Identification</h2>
              <p className="text-[11px] text-gray-400">Search existing records or create a new Texas DPS verified profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNewCustomerModalOpen(true)}
            className="py-2 px-4 bg-tgb-gold/15 hover:bg-tgb-gold text-tgb-gold hover:text-tgb-darknavy border border-tgb-gold/40 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" /> + New Customer Profile
          </button>
        </div>

        {/* Customer Search Auto-Suggest Bar */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearchQuery}
                onFocus={() => setCustomerSearchDropdownOpen(true)}
                onChange={(e) => {
                  setCustomerSearchQuery(e.target.value);
                  setCustomerSearchDropdownOpen(true);
                }}
                placeholder="Search customer by name, phone (214-555-...), ID, or driver's license..."
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-9 pr-4 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold"
              />
            </div>
          </div>

          {/* Customer Dropdown Results */}
          {customerSearchDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-tgb-darknavy border border-tgb-navyborder rounded-xl shadow-2xl z-40 max-h-60 overflow-y-auto p-1.5 space-y-1">
              {filteredCustomers.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-400">
                  No matching customers found.{' '}
                  <button
                    onClick={() => {
                      setCustomerSearchDropdownOpen(false);
                      setNewCustomerModalOpen(true);
                    }}
                    className="text-tgb-gold font-bold hover:underline"
                  >
                    Create New Customer
                  </button>
                </div>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(c);
                      setCustomerSearchDropdownOpen(false);
                      setCustomerSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-tgb-navy flex items-center justify-between transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{c.fullName}</span>
                      <span className="text-[11px] text-gray-400">
                        {c.mobileNumber} • {c.idType}: {c.idNumber}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-tgb-gold font-bold">{c.id}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Customer Card */}
        {selectedCustomer && (
          <div className="bg-tgb-darknavy/90 border border-tgb-gold/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">{selectedCustomer.fullName}</span>
                <span className="font-mono text-[11px] text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded">
                  {selectedCustomer.id}
                </span>
              </div>
              <div className="text-gray-300 text-[11px] space-x-3">
                <span>Phone: <strong className="text-white font-mono">{selectedCustomer.mobileNumber}</strong></span>
                <span>Email: <strong className="text-white">{selectedCustomer.email || 'N/A'}</strong></span>
                <span>ID: <strong className="text-white">{selectedCustomer.idType} ({selectedCustomer.idNumber})</strong></span>
              </div>
              <div className="text-[11px] text-gray-400">
                Address: {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-tgb-navy border border-tgb-navyborder"
            >
              Change Customer
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: MULTI-ITEM BUILDER (Unlimited Items) */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-tgb-navyborder">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-tgb-gold/15 text-tgb-gold flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Itemized Valuation & Assay Entry ({items.length} {items.length === 1 ? 'Item' : 'Items'})
              </h2>
              <p className="text-[11px] text-gray-400">Add unlimited items with custom details and multi-angle photo captures</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddItem(false)}
              className="py-2 px-3.5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> + ADD ITEM
            </button>
            <button
              type="button"
              onClick={() => handleAddItem(true)}
              className="py-2 px-3.5 bg-tgb-darknavy hover:bg-tgb-navylight border border-tgb-gold/40 text-tgb-gold font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> + CUSTOM ITEM
            </button>
          </div>
        </div>

        {/* Item Cards Loop */}
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-tgb-darknavy border border-tgb-navyborder rounded-2xl p-5 space-y-4 relative shadow-lg hover:border-tgb-navyborder/80 transition-colors"
            >
              {/* Item Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-tgb-navyborder/60">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-tgb-navy text-white text-xs font-bold flex items-center justify-center border border-tgb-navyborder">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-white text-sm font-display">
                    {item.name || 'Unnamed Item'}
                  </span>
                  <span className="text-[10px] font-semibold text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded border border-tgb-gold/20">
                    {item.category}
                  </span>
                  {item.isCustom && (
                    <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Custom Entry
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">Item Total</span>
                    <span className="font-mono font-bold text-tgb-gold text-base">
                      ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 bg-tgb-navy hover:bg-rose-500/10 rounded-lg border border-tgb-navyborder transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Item Predefined Menu Selector OR Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Predefined Catalog Menu</label>
                  <select
                    onChange={(e) => handleSelectPredefinedMenu(idx, e.target.value)}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="">-- Choose from Catalog --</option>
                    {menuItems.map((m) => (
                      <option key={m.id} value={m.id}>
                        [{m.category}] {m.name} (${m.estPricePerUnit}/{m.typicalUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemFieldChange(idx, { name: e.target.value })}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Category *</label>
                  <select
                    value={item.category}
                    onChange={(e) => handleItemFieldChange(idx, { category: e.target.value as MetalCategory })}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Watches">Watches</option>
                    <option value="Coins & Currency">Coins & Currency</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Material / Alloy</label>
                  <input
                    type="text"
                    value={item.material}
                    onChange={(e) => handleItemFieldChange(idx, { material: e.target.value })}
                    placeholder="e.g. 14K Yellow Gold, Oystersteel"
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              {/* Purity, Weight, Quantity, Unit Price */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Purity / Grade</label>
                  <input
                    type="text"
                    value={item.purity}
                    onChange={(e) => handleItemFieldChange(idx, { purity: e.target.value })}
                    placeholder="14K (58.5%), VS1/G, 999 Fine"
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={item.weight}
                    onChange={(e) => handleItemFieldChange(idx, { weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Unit</label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemFieldChange(idx, { unit: e.target.value as any })}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="g">Grams (g)</option>
                    <option value="oz">Troy Oz (oz)</option>
                    <option value="dwt">Pennyweight (dwt)</option>
                    <option value="ct">Carats (ct)</option>
                    <option value="pcs">Pieces (pcs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemFieldChange(idx, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Offered Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.offeredUnitPrice}
                    onChange={(e) => handleItemFieldChange(idx, { offeredUnitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono text-emerald-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Calculated Item Total</label>
                  <div className="w-full bg-tgb-darknavy border border-tgb-gold/30 rounded-lg px-2.5 py-2 text-tgb-gold font-mono font-bold text-xs flex items-center">
                    ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Item Description Notes */}
              <div>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleItemFieldChange(idx, { description: e.target.value })}
                  placeholder="Appraisal notes: e.g. Olympus GoldXpert XRF tested 58.7% Au, clean hallmark stamp on clasp..."
                  className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              {/* ITEM IMAGES & CAMERA CAPTURE */}
              <div className="pt-2 border-t border-tgb-navyborder/50">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-gray-300 uppercase flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-tgb-gold" />
                    Item Photos ({item.images.length} Attached)
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer py-1 px-2.5 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3 text-tgb-gold" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleImageUpload(idx, e, 'General')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Thumbnails list */}
                <div className="flex flex-wrap gap-2.5">
                  {item.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-24 h-20 bg-tgb-navy border border-tgb-navyborder rounded-lg overflow-hidden group shadow"
                    >
                      <img src={img.url} alt={img.tag} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx, img.id)}
                          className="self-end p-1 bg-rose-500/80 hover:bg-rose-600 text-white rounded text-[10px]"
                          title="Delete photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="text-[9px] text-center font-bold text-tgb-gold uppercase truncate">
                          {img.tag}
                        </span>
                      </div>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-center text-gray-300 uppercase py-0.5 truncate group-hover:hidden">
                        {img.tag}
                      </span>
                    </div>
                  ))}

                  {item.images.length === 0 && (
                    <div className="text-[11px] text-gray-500 italic py-2">
                      No photos uploaded for this item. Drag & drop images or tap 'Upload Photos' to attach hallmark/front captures.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: PAYMENT & FINANCIAL SUMMARY */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
          <div className="w-8 h-8 rounded-lg bg-tgb-gold/15 text-tgb-gold flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Payment Method & Settlement</h2>
            <p className="text-[11px] text-gray-400">Select payment disbursement / collection mode and finalize transaction totals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Payment Method Selector & Inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Payment Disbursement Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['CASH', 'CARD', 'CHEQUE', 'WIRE'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === method
                        ? 'bg-tgb-gold text-tgb-darknavy border-tgb-gold shadow-md'
                        : 'bg-tgb-darknavy border-tgb-navyborder text-gray-300 hover:border-tgb-gold/40'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Specific Fields */}
            {paymentMethod === 'CARD' && (
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-3 animate-fade-in">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-tgb-gold" /> Card Terminal Reference
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Card Type</label>
                    <select
                      value={cardType}
                      onChange={(e) => setCardType(e.target.value as any)}
                      className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">American Express</option>
                      <option value="Discover">Discover</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Last 4 Digits Only *</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 4242"
                      className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">
                  PCI-DSS Compliance Notice: Full card numbers and CVV codes are never handled or stored.
                </p>
              </div>
            )}

            {/* Cheque Specific Fields */}
            {paymentMethod === 'CHEQUE' && (
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-3 animate-fade-in">
                <div className="text-xs font-bold text-white">Company / Cashier Cheque Details</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Cheque Number</label>
                    <input
                      type="text"
                      value={chequeNumber}
                      onChange={(e) => setChequeNumber(e.target.value)}
                      placeholder="#5024"
                      className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Issuing Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. JPMorgan Chase Texas"
                      className="w-full bg-tgb-navy border border-tgb-navyborder rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* General Transaction Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Transaction Notes & DPS Audit Memo
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add counter remarks, appraisal observations, customer requests..."
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold resize-none"
              ></textarea>
            </div>
          </div>

          {/* Financial Calculation Breakdown Panel */}
          <div className="lg:col-span-5 bg-tgb-darknavy border border-tgb-gold/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-tgb-gold uppercase tracking-widest pb-2 border-b border-tgb-navyborder">
              Financial Breakdown
            </h3>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Items Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
                <span className="font-mono font-bold text-white">
                  ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Adjustment / Discount:</span>
                <div className="flex items-center gap-1 w-28">
                  <span className="text-gray-400 font-mono">$</span>
                  <input
                    type="number"
                    step="1"
                    value={discountOrAdjustment}
                    onChange={(e) => setDiscountOrAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full bg-tgb-navy border border-tgb-navyborder rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <span>Texas Sales Tax ({taxRatePercent}%):</span>
                <span className="font-mono font-bold text-white">
                  ${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-3 border-t border-tgb-navyborder flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-white uppercase font-display">Grand Total:</span>
                <span className="text-2xl font-black font-mono text-tgb-gold">
                  ${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                <span>Settlement Method:</span>
                <span className="font-bold text-white">{paymentMethod}</span>
              </div>
            </div>

            {/* Save & Generate Invoice Trigger */}
            <div className="pt-4">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveTransaction}
                className="w-full py-4 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Saving Transaction & Generating DPS Invoice...</span>
                ) : (
                  <>
                    <Receipt className="w-4 h-4" />
                    <span>SAVE & GENERATE INVOICE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CUSTOMER REGISTRATION MODAL */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">New Customer Registration</h3>
              <button
                onClick={() => setNewCustomerModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.fullName}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, fullName: e.target.value })}
                    placeholder="John Doe"
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
                    placeholder="(214) 555-0100"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Government ID Type *</label>
                  <select
                    value={newCustomerForm.idType}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, idType: e.target.value as any })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="Drivers License">Driver's License (Texas/Other)</option>
                    <option value="Passport">US / International Passport</option>
                    <option value="State ID">State Photo ID</option>
                    <option value="Military ID">Military ID</option>
                    <option value="Other">Other Government ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">ID Number *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.idNumber}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, idNumber: e.target.value })}
                    placeholder="TX-DL-8492019"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  placeholder="123 Main St"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={newCustomerForm.city}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={newCustomerForm.state}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, state: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Zip</label>
                  <input
                    type="text"
                    value={newCustomerForm.zipCode}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, zipCode: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewCustomerModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Create & Attach Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATED INVOICE MODAL */}
      {savedTransaction && (
        <InvoiceViewModal
          isOpen={invoiceModalOpen}
          transaction={savedTransaction}
          onClose={() => {
            setInvoiceModalOpen(false);
            router.push('/admin/transactions');
          }}
        />
      )}
    </div>
  );
};

export default TransactionEntryForm;
