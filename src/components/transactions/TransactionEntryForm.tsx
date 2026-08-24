'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Customer,
  Transaction,
  TransactionType,
  MetalCategory,
} from '@/types';
import {
  customerService,
  transactionService,
  fileService,
} from '@/services';
import {
  calculateBuyTransaction,
  calculateSellTransaction,
  calculatePaymentSummary,
  PaymentEntry,
} from '@/lib/calculations';
import {
  Plus,
  Trash2,
  Upload,
  Search,
  UserPlus,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  CreditCard,
  Building,
  Calendar,
  X,
  Printer,
  History,
  Scale,
  Sparkles,
  DollarSign,
  TrendingUp,
  Percent,
  Check,
  ChevronDown,
  Info,
  Image as ImageIcon,
  AlertTriangle,
  ZoomIn,
} from 'lucide-react';
import InvoiceViewModal from '@/components/invoices/InvoiceViewModal';
import Image from 'next/image';

interface TransactionEntryFormProps {
  initialType?: TransactionType;
}

const PURITY_OPTIONS = ['24K', '22K', '20K', '18K', '14K', '10K', 'Custom'];
const ITEM_NAMES = [
  'Gold Ring',
  'Gold Chain',
  'Gold Bracelet',
  'Gold Necklace',
  'Gold Coin',
  'Gold Earrings',
  'Gold Bar / Bullion',
  'Custom Item',
];
const PAYMENT_METHODS: PaymentEntry['method'][] = [
  'Cash',
  'Card',
  'Bank Transfer',
  'UPI',
  'Cheque',
  'Other',
];

export const TransactionEntryForm: React.FC<TransactionEntryFormProps> = ({
  initialType = 'BUY',
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode: BUY vs SELL
  const [txType, setTxType] = useState<TransactionType>(initialType);

  // Customer State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    driversLicense: '',
  });

  // Item Details State
  const [itemName, setItemName] = useState('Gold Chain');
  const [customItemName, setCustomItemName] = useState('');
  const [itemType, setItemType] = useState('Jewelry');
  const [itemDescription, setItemDescription] = useState('');
  const [purity, setPurity] = useState('22K');
  const [customPurity, setCustomPurity] = useState('');

  // Controlled String Inputs (Fixes auto-0 / 04 input bug)
  const [weightInput, setWeightInput] = useState('4.00');
  const [rateInput, setRateInput] = useState('60.00');
  const [marginPercentInput, setMarginPercentInput] = useState('20');
  const [baseCostInput, setBaseCostInput] = useState('240.00');

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Multiple Payment Methods State
  const [payments, setPayments] = useState<PaymentEntry[]>([
    {
      id: `PAY-INIT-${Date.now()}`,
      method: 'Cash',
      amount: 192.0,
      referenceNumber: '',
      notes: '',
    },
  ]);

  // Transaction Notes & UI State
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState<Transaction | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  // Load initial customers
  useEffect(() => {
    customerService.getAll().then((data) => {
      setCustomers(data);
      if (data.length > 0 && !selectedCustomer) {
        setSelectedCustomer(data[0]);
      }
    });
  }, []);

  // Filtered customer search
  const filteredCustomers = customerSearchQuery.trim()
    ? customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
          c.mobileNumber.includes(customerSearchQuery) ||
          c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
          c.idNumber.toLowerCase().includes(customerSearchQuery.toLowerCase())
      )
    : customers.slice(0, 5);

  // Quick Customer Creation
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.fullName.trim() || !newCustomer.phone.trim()) {
      alert('Please enter customer full name and phone number.');
      return;
    }

    try {
      const created = await customerService.create({
        fullName: newCustomer.fullName.trim(),
        mobileNumber: newCustomer.phone.trim(),
        email: newCustomer.email.trim(),
        address: '2427 W Mockingbird Ln',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75235',
        idType: 'Drivers License',
        idNumber: newCustomer.driversLicense.trim() || 'N/A',
      });

      setCustomers([created, ...customers]);
      setSelectedCustomer(created);
      setCustomerModalOpen(false);
      setNewCustomer({ fullName: '', phone: '', email: '', driversLicense: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to save customer');
    }
  };

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setIsUploadingImage(true);
      const processed = await fileService.processUploadedFile(file, 'Front');
      setImagePreview(processed.url);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Dynamic Numeric Parsing
  const parsedWeight = Math.max(0, parseFloat(weightInput) || 0);
  const parsedRate = Math.max(0, parseFloat(rateInput) || 0);
  const parsedMarginPct = Math.max(0, parseFloat(marginPercentInput) || 0);
  const parsedBaseCost = Math.max(0, parseFloat(baseCostInput) || 0);

  // Centralized Calculations
  const effectivePurity = purity === 'Custom' ? customPurity || 'Custom Gold' : purity;
  const effectiveItemName = itemName === 'Custom Item' ? customItemName || 'Custom Gold Piece' : itemName;

  const buyCalculation = calculateBuyTransaction({
    weight: parsedWeight,
    ratePerGram: parsedRate,
    marginPercent: parsedMarginPct,
  });

  const sellCalculation = calculateSellTransaction({
    weight: parsedWeight,
    ratePerGram: parsedRate,
    baseCost: parsedBaseCost > 0 ? parsedBaseCost : +(parsedWeight * parsedRate).toFixed(2),
    marginPercent: parsedMarginPct,
  });

  const targetTotal = txType === 'BUY' ? buyCalculation.amountPaidToCustomer : sellCalculation.sellingAmount;

  // Auto-sync first payment amount if only 1 payment row exists
  useEffect(() => {
    if (payments.length === 1) {
      setPayments([{ ...payments[0], amount: targetTotal }]);
    }
  }, [targetTotal, txType]);

  const paymentSummary = calculatePaymentSummary(targetTotal, payments);

  // Add / Remove Payment Rows
  const handleAddPaymentRow = () => {
    const remaining = Math.max(0, paymentSummary.remainingAmount);
    setPayments([
      ...payments,
      {
        id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        method: 'Cash',
        amount: remaining,
        referenceNumber: '',
        notes: '',
      },
    ]);
  };

  const handleRemovePaymentRow = (index: number) => {
    if (payments.length <= 1) {
      alert('At least one payment method is required.');
      return;
    }
    const updated = [...payments];
    updated.splice(index, 1);
    setPayments(updated);
  };

  const handleUpdatePayment = (index: number, fields: Partial<PaymentEntry>) => {
    const updated = [...payments];
    updated[index] = { ...updated[index], ...fields };
    setPayments(updated);
  };

  // Submit Transaction
  const handleSaveTransaction = async () => {
    if (!selectedCustomer) {
      alert('Please select or create a customer first.');
      return;
    }

    if (parsedWeight <= 0) {
      alert('Please enter a valid positive weight.');
      return;
    }

    if (parsedRate <= 0 && parsedBaseCost <= 0) {
      alert('Please enter a valid rate per gram or base cost.');
      return;
    }

    if (!paymentSummary.isExact && paymentSummary.isShort) {
      if (!confirm(`Payment is short by $${paymentSummary.difference.toFixed(2)}. Proceed as partially paid?`)) {
        return;
      }
    }

    setIsSaving(true);
    try {
      const activeCalc = txType === 'BUY' ? buyCalculation : sellCalculation;
      const finalAmount = targetTotal;

      const txItem = {
        id: `ITEM-${Date.now()}`,
        isCustom: itemName === 'Custom Item',
        category: 'Gold' as MetalCategory,
        name: effectiveItemName,
        itemType: itemType,
        description: itemDescription || `${effectivePurity} ${effectiveItemName}, weight: ${parsedWeight}g @ $${parsedRate}/g.`,
        material: 'Gold Alloy',
        purity: effectivePurity,
        weight: parsedWeight,
        unit: 'g' as const,
        quantity: 1,
        ratePerGram: parsedRate,
        estimatedMarketValue: txType === 'BUY' ? buyCalculation.grossAmount : sellCalculation.baseCost,
        offeredUnitPrice: txType === 'BUY' ? +(buyCalculation.amountPaidToCustomer / (parsedWeight || 1)).toFixed(2) : sellCalculation.sellingAmount,
        totalPrice: finalAmount,
        imageUrl: imagePreview || undefined,
        images: imagePreview
          ? [{ id: `IMG-${Date.now()}`, url: imagePreview, tag: 'Front' as const, fileName: 'item.png', uploadedAt: new Date().toISOString() }]
          : [],
      };

      const newTx = await transactionService.create({
        type: txType,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.fullName,
        customerPhone: selectedCustomer.mobileNumber,
        customerEmail: selectedCustomer.email,
        customerAddress: selectedCustomer.address,
        employeeId: user?.id || 'e1000000-0000-0000-0000-000000000001',
        employeeName: user?.name || 'Alexander Sterling',
        locationId: user?.locationId || 'c1000000-0000-0000-0000-000000000001',
        locationName: 'Dallas Flagship — 2427 W Mockingbird Ln',
        transactionDate: new Date().toISOString(),
        status: 'COMPLETED',
        items: [txItem],
        subtotal: txType === 'BUY' ? buyCalculation.grossAmount : sellCalculation.baseCost,
        discountOrAdjustment: 0,
        taxRatePercent: 0,
        taxAmount: 0,
        finalTotal: finalAmount,
        marginPercent: parsedMarginPct,
        marginAmount: activeCalc.marginAmount,
        profit: activeCalc.profit,
        imageUrl: imagePreview || undefined,
        payments: payments,
        payment: {
          method: payments[0]?.method || 'Cash',
          amount: paymentSummary.totalPaid,
          status: paymentSummary.paymentStatus === 'Fully Paid' ? 'COMPLETED' : 'PENDING',
          referenceNumber: payments[0]?.referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
          paidAt: new Date().toISOString(),
          notes: notes || payments[0]?.notes,
        },
        notes: notes,
        termsAccepted: true,
      });

      setSavedTransaction(newTx);
      setIsCompletedSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to complete transaction.');
    } finally {
      setIsSaving(false);
    }
  };

  // SUCCESS COMPLETION SCREEN
  if (isCompletedSuccess && savedTransaction) {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-[#0a1827] border border-tgb-gold/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-tgb-gold">
            Official Texas Record Audited & Recorded
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            TRANSACTION COMPLETED
          </h2>
          <p className="text-xs text-gray-400">
            Texas Gold Buyers • 2427 W Mockingbird Ln, Dallas, TX 75235 • +1 (469) 453-5339
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-[#071320] border border-tgb-navyborder rounded-2xl p-6 text-left space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Receipt # / Invoice:</span>
            <span className="font-bold text-tgb-gold">{savedTransaction.invoiceNumber}</span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Customer:</span>
            <span className="font-bold text-white">{savedTransaction.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Transaction Type:</span>
            <span className={`font-bold ${savedTransaction.type === 'BUY' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {savedTransaction.type === 'BUY' ? 'BUY GOLD (Customer Payout)' : 'SELL GOLD (Customer Sale)'}
            </span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Item & Purity:</span>
            <span className="font-bold text-white font-sans">
              {savedTransaction.items[0]?.purity} {savedTransaction.items[0]?.name} ({savedTransaction.items[0]?.weight}g)
            </span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">Total Transaction Amount:</span>
            <span className="font-bold text-xl text-white font-sans">
              ${savedTransaction.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2 text-emerald-400">
            <span>Store Margin & Expected Profit:</span>
            <span className="font-bold font-sans">
              ${(savedTransaction.profit || buyCalculation.profit).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({parsedMarginPct}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Payment Breakdown:</span>
            <span className="font-bold text-white">
              {savedTransaction.payments?.map((p) => `${p.method}: $${p.amount.toFixed(2)}`).join(' • ') || savedTransaction.payment.method}
            </span>
          </div>

          {/* Item Image Thumbnail if present */}
          {savedTransaction.imageUrl && (
            <div className="pt-2 flex items-center gap-3">
              <span className="text-gray-400">Item Photo:</span>
              <div
                onClick={() => setShowImageZoom(true)}
                className="relative w-12 h-12 rounded-lg overflow-hidden border border-tgb-gold/40 cursor-pointer hover:opacity-80"
              >
                <Image src={savedTransaction.imageUrl} alt="Gold Item" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setInvoiceModalOpen(true)}
            className="py-3.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
            className="py-3.5 px-4 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <History className="w-4 h-4 text-tgb-gold" />
            <span>VIEW TRANSACTIONS</span>
          </button>

          <button
            onClick={() => {
              setIsCompletedSuccess(false);
              setSavedTransaction(null);
              setImagePreview(null);
            }}
            className="py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. TOP HEADER & MODE SWITCHER */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                txType === 'BUY'
                  ? 'bg-emerald-500 text-tgb-darknavy'
                  : 'bg-amber-500 text-tgb-darknavy'
              }`}
            >
              {txType === 'BUY' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              {txType === 'BUY' ? 'BUY GOLD FROM CUSTOMER' : 'SELL GOLD TO CUSTOMER'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display mt-1">
            {txType === 'BUY' ? 'Buy Gold & Precious Metals' : 'Sell Gold & Estate Jewelry'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {txType === 'BUY'
              ? 'Purchase scrap, bullion, coins, or jewelry with dynamic margin and instant payout.'
              : 'Retail sale from vault stock with margin calculation and item image tracking.'}
          </p>
        </div>

        {/* Big Touch-Friendly Mode Switcher */}
        <div className="flex bg-[#071320] rounded-2xl p-1.5 border border-tgb-navyborder shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTxType('BUY')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              txType === 'BUY'
                ? 'bg-emerald-500 text-tgb-darknavy shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" /> BUY
          </button>
          <button
            type="button"
            onClick={() => setTxType('SELL')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              txType === 'SELL'
                ? 'bg-amber-500 text-tgb-darknavy shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> SELL
          </button>
        </div>
      </div>

      {/* 2. STEP 1: CUSTOMER INFORMATION */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-tgb-navyborder">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Information
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCustomerModalOpen(true)}
            className="py-1.5 px-3 bg-tgb-gold/15 hover:bg-tgb-gold/25 border border-tgb-gold/30 text-tgb-gold font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" /> + New Customer
          </button>
        </div>

        {selectedCustomer ? (
          <div className="bg-[#071320] border border-tgb-gold/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{selectedCustomer.fullName}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                  ✓ Selected
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>📞 {selectedCustomer.mobileNumber}</span>
                {selectedCustomer.email && <span>✉️ {selectedCustomer.email}</span>}
                {selectedCustomer.idNumber && selectedCustomer.idNumber !== 'N/A' && (
                  <span>🪪 DL: {selectedCustomer.idNumber}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-tgb-navy border border-tgb-navyborder self-start sm:self-auto cursor-pointer"
            >
              Change Customer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customer by name, phone number, email, or DL #..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl pl-10 pr-4 py-3 text-white text-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {filteredCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="p-3 bg-[#071320] border border-tgb-navyborder hover:border-tgb-gold/40 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <div className="font-bold text-white text-xs truncate">{cust.fullName}</div>
                    <div className="text-[11px] text-gray-400">{cust.mobileNumber}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(cust)}
                    className="py-1.5 px-3 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs rounded-lg cursor-pointer shrink-0"
                  >
                    SELECT
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. STEP 2: ITEM DETAILS, PURITY, & IMAGE UPLOAD */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
          <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Item Details, Purity & Photos
          </h2>
        </div>

        {/* Item Selection & Custom Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Item Name
            </label>
            <select
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-tgb-gold focus:outline-none cursor-pointer"
            >
              {ITEM_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {itemName === 'Custom Item' && (
              <input
                type="text"
                placeholder="Enter custom item name..."
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                className="mt-2 w-full bg-[#071320] border border-tgb-gold rounded-xl px-3.5 py-2 text-white text-xs"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Item Category / Type
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-tgb-gold focus:outline-none cursor-pointer"
            >
              <option value="Jewelry">Gold Jewelry</option>
              <option value="Bullion">Gold Bullion / Minted Bars</option>
              <option value="Coins">Gold Coins / Sovereigns</option>
              <option value="Scrap">Dental / Scrap Gold</option>
              <option value="Estate">Estate / Heirloom</option>
            </select>
          </div>
        </div>

        {/* Gold Purity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-tgb-gold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Gold Purity <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {PURITY_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurity(p)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  purity === p
                    ? 'bg-tgb-gold text-tgb-darknavy border-tgb-gold shadow-md scale-[1.02]'
                    : 'bg-[#071320] text-gray-300 border-tgb-navyborder hover:border-tgb-gold/40'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {purity === 'Custom' && (
            <input
              type="text"
              placeholder="e.g. 21.6K (90.0%) or 916 Hallmark"
              value={customPurity}
              onChange={(e) => setCustomPurity(e.target.value)}
              className="w-full bg-[#071320] border border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
            />
          )}
        </div>

        {/* Image Upload Drag & Drop Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
            <span>Gold Item Photo (Optional)</span>
            <span className="text-[10px] text-gray-400">JPG, PNG, WEBP (Max 10MB)</span>
          </label>

          {imagePreview ? (
            <div className="bg-[#071320] border border-tgb-gold/40 rounded-2xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setShowImageZoom(true)}
                  className="relative w-14 h-14 rounded-xl overflow-hidden border border-tgb-navyborder cursor-pointer group"
                >
                  <Image src={imagePreview} alt="Item Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Item Image Uploaded</span>
                  <span className="text-[10px] text-emerald-400">✓ Verified Asset Attached</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-3 bg-tgb-navy border border-tgb-navyborder text-gray-300 hover:text-white rounded-lg text-xs font-semibold"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  fileService.processUploadedFile(file).then((p) => setImagePreview(p.url));
                }
              }}
              className="border-2 border-dashed border-tgb-navyborder hover:border-tgb-gold/60 rounded-2xl p-6 text-center cursor-pointer bg-[#071320]/60 transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-tgb-gold/10 text-tgb-gold flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs text-gray-300 font-semibold">
                Drag and drop gold photo here, or <span className="text-tgb-gold">Browse Files</span>
              </div>
              <div className="text-[10px] text-gray-500">
                Front, hallmark, or scale verification photo
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleImageFileChange}
          />
        </div>
      </div>

      {/* 4. STEP 3: TRANSACTION VALUATION & MARGIN (BUY vs SELL) */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
          <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {txType === 'BUY' ? 'Gold Weight, Rate & Buy Margin' : 'Base Cost, Selling Rate & Sale Margin'}
          </h2>
        </div>

        {/* Dynamic Inputs (Clean Controlled Strings - No 04 bug!) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Weight (g) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="e.g. 4.00"
                className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                GRAMS
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Gold Rate ($ / g) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="e.g. 60.00"
                className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl pl-8 pr-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                / g
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-tgb-gold uppercase tracking-wider">
              Store Margin % <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={marginPercentInput}
                onChange={(e) => setMarginPercentInput(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="e.g. 20"
                className="w-full bg-[#071320] border-2 border-tgb-gold/60 focus:border-tgb-gold rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tgb-gold font-bold">
                %
              </span>
            </div>
          </div>
        </div>

        {/* 3 HIGHLY VISIBLE REQUIRED VALUES IN SUMMARY CARD */}
        <div className="bg-[#071320] border-2 border-tgb-gold/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-tgb-navyborder/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Transaction Economics Summary
            </span>
            <span className="text-[11px] font-bold text-tgb-gold bg-tgb-gold/10 px-2.5 py-0.5 rounded-full border border-tgb-gold/30">
              Live Verified Math
            </span>
          </div>

          {txType === 'BUY' ? (
            /* BUY SUMMARY BREAKDOWN */
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Gross Gold Value
                </span>
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  ${buyCalculation.grossAmount.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">{parsedWeight}g × ${parsedRate}/g</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-tgb-gold uppercase tracking-wider block">
                  Margin %
                </span>
                <span className="text-base sm:text-lg font-bold text-tgb-gold font-mono">
                  {buyCalculation.marginPercent.toFixed(2)}%
                </span>
                <span className="text-[9px] text-gray-500 block">Store Retained</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-tgb-gold uppercase tracking-wider block">
                  Margin Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-tgb-gold font-mono">
                  ${buyCalculation.marginAmount.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Gross × Margin%</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Amount Paid to Customer
                </span>
                <span className="text-base sm:text-xl font-black text-emerald-400 font-mono">
                  ${buyCalculation.amountPaidToCustomer.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Gross - Margin</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Expected Profit
                </span>
                <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
                  ${buyCalculation.profit.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Locked Spread</span>
              </div>
            </div>
          ) : (
            /* SELL SUMMARY BREAKDOWN */
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Base Cost
                </span>
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  ${sellCalculation.baseCost.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Acquisition Value</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Margin %
                </span>
                <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                  {sellCalculation.marginPercent.toFixed(2)}%
                </span>
                <span className="text-[9px] text-gray-500 block">Retail Markup</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Margin Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                  ${sellCalculation.marginAmount.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Cost × Margin%</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
                  Selling Amount
                </span>
                <span className="text-base sm:text-xl font-black text-white font-mono">
                  ${sellCalculation.sellingAmount.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Cost + Margin</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Expected Profit
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                  ${sellCalculation.profit.toFixed(2)}
                </span>
                <span className="text-[9px] text-gray-500 block">Net Realized Gain</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. STEP 4: MULTIPLE PAYMENT METHODS SYSTEM */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-tgb-navyborder">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Disbursement & Multiple Payment Splits
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddPaymentRow}
            className="py-1.5 px-3 bg-tgb-gold/15 hover:bg-tgb-gold/25 border border-tgb-gold/30 text-tgb-gold font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Payment Method
          </button>
        </div>

        {/* Dynamic Payment Rows */}
        <div className="space-y-3">
          {payments.map((p, idx) => (
            <div
              key={p.id || idx}
              className="bg-[#071320] border border-tgb-navyborder rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Payment Method Selector */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Method #{idx + 1}
                </label>
                <select
                  value={p.method}
                  onChange={(e) => handleUpdatePayment(idx, { method: e.target.value as any })}
                  className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-xl px-3 py-2 text-white text-xs font-bold focus:border-tgb-gold focus:outline-none cursor-pointer"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m === 'Cash' ? '💵 Cash' : m === 'Card' ? '💳 Card' : m === 'Bank Transfer' ? '🏦 Bank Transfer' : m === 'UPI' ? '📱 UPI' : m === 'Cheque' ? '📝 Cheque' : '⚙️ Other'} {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={p.amount === 0 ? '' : p.amount}
                    onChange={(e) => handleUpdatePayment(idx, { amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full bg-[#0a1827] border border-tgb-navyborder focus:border-tgb-gold rounded-xl pl-7 pr-3 py-2 text-white font-mono text-xs sm:text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Reference / Notes */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Reference # (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TX-984201"
                  value={p.referenceNumber || ''}
                  onChange={(e) => handleUpdatePayment(idx, { referenceNumber: e.target.value })}
                  className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-xl px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none"
                />
              </div>

              {/* Remove Row Button */}
              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  disabled={payments.length <= 1}
                  onClick={() => handleRemovePaymentRow(idx)}
                  className="p-2 text-gray-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer rounded-lg hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Payment Validation Status Banner */}
        <div className="bg-[#071320] border border-tgb-navyborder rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                paymentSummary.paymentStatus === 'Fully Paid'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : paymentSummary.paymentStatus === 'Partially Paid'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {paymentSummary.paymentStatus}
            </span>
            <span className="text-gray-300">
              Total Required: <strong className="text-white">${targetTotal.toFixed(2)}</strong> • Paid: <strong className="text-white">${paymentSummary.totalPaid.toFixed(2)}</strong>
            </span>
          </div>

          {paymentSummary.isShort && (
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Payment short by ${paymentSummary.difference.toFixed(2)}
            </span>
          )}

          {paymentSummary.isExceed && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Payment exceeds total by ${paymentSummary.difference.toFixed(2)}
            </span>
          )}

          {paymentSummary.isExact && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Exact Amount Balanced
            </span>
          )}
        </div>

        {/* Complete Transaction Button */}
        <button
          type="button"
          disabled={isSaving || !selectedCustomer}
          onClick={handleSaveTransaction}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-2 cursor-pointer ${
            txType === 'BUY'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-tgb-darknavy shadow-emerald-500/20'
              : 'bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy shadow-tgb-gold/20'
          }`}
        >
          {isSaving ? (
            <span>Processing and Recording in Supabase PostgreSQL...</span>
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>
                {txType === 'BUY'
                  ? `COMPLETE BUY — PAYOUT $${buyCalculation.amountPaidToCustomer.toFixed(2)} (PROFIT $${buyCalculation.profit.toFixed(2)})`
                  : `COMPLETE SALE — RECEIVE $${sellCalculation.sellingAmount.toFixed(2)} (PROFIT $${sellCalculation.profit.toFixed(2)})`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* NEW CUSTOMER MODAL */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a1827] border border-tgb-gold/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Add Customer</h3>
              <button
                onClick={() => setCustomerModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={newCustomer.fullName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. (469) 555-0199"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. john.smith@email.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">
                  Driver&apos;s License (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TX-DL-9482019"
                  value={newCustomer.driversLicense}
                  onChange={(e) => setNewCustomer({ ...newCustomer, driversLicense: e.target.value })}
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-tgb-navy text-gray-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy text-xs font-bold cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE ZOOM MODAL */}
      {showImageZoom && imagePreview && (
        <div
          onClick={() => setShowImageZoom(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-2xl w-full max-h-[80vh] aspect-square rounded-2xl overflow-hidden border border-tgb-gold/50 shadow-2xl">
            <Image src={imagePreview} alt="Enlarged Gold Item" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionEntryForm;
