'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Receipt,
} from 'lucide-react';
import InvoiceViewModal from '@/components/invoices/InvoiceViewModal';
import ImageUpload from '@/components/ui/image-upload';
import Image from 'next/image';

interface TransactionEntryFormProps {
  initialType?: TransactionType;
}

const ITEM_PRESETS = [
  'Gold Ring',
  'Gold Chain',
  'Gold Bracelet',
  'Gold Necklace',
  'Gold Coin',
  'Gold Bar',
  'Silver Ring',
  'Silver Chain',
  'Watch',
  'Diamond',
  'Other / Custom Item',
];

const GOLD_PURITIES = ['10K', '14K', '18K', '20K', '22K', '24K', 'Custom'];
const PAYMENT_METHODS: PaymentEntry['method'][] = [
  'Cash',
  'Card',
  'Bank Transfer',
  'Cheque',
  'Wire',
  'Store Credit',
  'UPI',
  'Other',
];

export const TransactionEntryForm: React.FC<TransactionEntryFormProps> = ({
  initialType = 'BUY',
}) => {
  const router = useRouter();
  const { user } = useAuth();

  // Mode: BUY vs SELL
  const [txType, setTxType] = useState<TransactionType>(initialType);

  // 1. Customer State
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

  // 2. Item Details & Purity State
  const [selectedItemPreset, setSelectedItemPreset] = useState('Gold Chain');
  const [customItemName, setCustomItemName] = useState('');
  const [itemType, setItemType] = useState('Jewelry');
  const [itemDescription, setItemDescription] = useState('');
  const [purity, setPurity] = useState('22K');
  const [customPurity, setCustomPurity] = useState('');

  // 3. Form Numeric Inputs (Clean Empty String State — No Pre-filled 0 / 04 bug!)
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('');
  const [customerPayout, setCustomerPayout] = useState('');
  const [payoutAdjustmentPercent, setPayoutAdjustmentPercent] = useState('');

  // SELL specific inputs
  const [basePrice, setBasePrice] = useState('');
  const [additionalChargePercent, setAdditionalChargePercent] = useState('50');

  // 4. Image Upload State
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 5. Multiple Payment Method Rows
  const [payments, setPayments] = useState<PaymentEntry[]>([
    {
      id: `PAY-${Date.now()}-1`,
      method: 'Cash',
      amount: '',
      cardType: 'Visa',
      cardLast4: '',
      chequeNumber: '',
      bankName: '',
      referenceNumber: '',
      notes: '',
    },
  ]);

  // 6. Notes & Submission UI state
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

  // Perform Centralized Calculations
  const effectiveItemName =
    selectedItemPreset === 'Other / Custom Item'
      ? customItemName.trim() || 'Custom Item'
      : selectedItemPreset;

  const effectivePurity = purity === 'Custom' ? customPurity.trim() || 'Custom Purity' : purity;

  const buyCalc = calculateBuyTransaction({
    weight: weight,
    ratePerGram: rate,
    customerPayout: customerPayout,
    payoutAdjustmentPercent: payoutAdjustmentPercent,
  });

  const sellCalc = calculateSellTransaction({
    weight: weight,
    basePrice: basePrice,
    additionalChargePercent: additionalChargePercent,
    taxRatePercent: 8.5,
  });

  const currentTotalDue = txType === 'BUY' ? buyCalc.finalCustomerPayout : sellCalc.customerTotal;

  // Auto-sync primary single payment row if user hasn't typed custom amounts
  useEffect(() => {
    if (payments.length === 1 && currentTotalDue > 0) {
      // If payment amount is empty or matches previous total
      if (payments[0].amount === '' || parseFloat(String(payments[0].amount)) === 0) {
        setPayments([{ ...payments[0], amount: currentTotalDue }]);
      }
    }
  }, [currentTotalDue]);

  const paymentSummary = calculatePaymentSummary(currentTotalDue, payments);

  // Add / Remove / Update Payment Rows
  const handleAddPaymentRow = () => {
    const remaining = Math.max(0, paymentSummary.remainingAmount);
    setPayments([
      ...payments,
      {
        id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        method: 'Card',
        amount: remaining > 0 ? remaining : '',
        cardType: 'Visa',
        cardLast4: '',
        chequeNumber: '',
        bankName: '',
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

  // Reset Form for New Transaction
  const handleResetForm = () => {
    setWeight('');
    setRate('');
    setCustomerPayout('');
    setPayoutAdjustmentPercent('');
    setBasePrice('');
    setAdditionalChargePercent('50');
    setImageUrl(null);
    setNotes('');
    setCustomItemName('');
    setCustomPurity('');
    setPayments([
      {
        id: `PAY-${Date.now()}`,
        method: 'Cash',
        amount: '',
        cardType: 'Visa',
        cardLast4: '',
        chequeNumber: '',
        bankName: '',
        referenceNumber: '',
        notes: '',
      },
    ]);
    setIsCompletedSuccess(false);
    setSavedTransaction(null);
  };

  // Submit Transaction to Database
  const handleSaveTransaction = async () => {
    if (!selectedCustomer) {
      alert('Please select or create a customer first.');
      return;
    }

    const numericWeight = parseFloat(weight) || 0;
    if (numericWeight <= 0) {
      alert('Please enter a valid weight.');
      return;
    }

    if (txType === 'BUY') {
      const numericRate = parseFloat(rate) || 0;
      if (numericRate <= 0) {
        alert('Please enter a market rate.');
        return;
      }
      if (buyCalc.finalCustomerPayout <= 0) {
        alert('Please enter the customer payout amount.');
        return;
      }
    } else {
      const numericBase = parseFloat(basePrice) || 0;
      if (numericBase <= 0) {
        alert('Please enter a base price.');
        return;
      }
    }

    if (paymentSummary.isExceed) {
      alert(`Payment exceeds total due by $${paymentSummary.difference.toFixed(2)}. Please adjust payments.`);
      return;
    }

    if (paymentSummary.isShort) {
      if (!confirm(`Payment is short by $${paymentSummary.difference.toFixed(2)}. Do you want to record this transaction as partially paid?`)) {
        return;
      }
    }

    setIsSaving(true);
    try {
      const isBuy = txType === 'BUY';
      const activeCalc = isBuy ? buyCalc : sellCalc;
      const totalAmount = currentTotalDue;

      const txItem = {
        id: `ITEM-${Date.now()}`,
        isCustom: selectedItemPreset === 'Other / Custom Item',
        category: 'Gold' as MetalCategory,
        name: effectiveItemName,
        itemType: itemType,
        description: itemDescription || `${effectivePurity} ${effectiveItemName}, weight: ${numericWeight}g`,
        material: 'Gold Alloy',
        purity: effectivePurity,
        weight: numericWeight,
        unit: 'g' as const,
        quantity: 1,
        ratePerGram: parseFloat(rate) || undefined,
        estimatedMarketValue: isBuy ? buyCalc.grossAmount : sellCalc.basePrice,
        offeredUnitPrice: isBuy ? +(buyCalc.finalCustomerPayout / numericWeight).toFixed(2) : sellCalc.customerTotal,
        totalPrice: totalAmount,
        imageUrl: imageUrl || undefined,
        images: imageUrl
          ? [{ id: `IMG-${Date.now()}`, url: imageUrl, tag: 'Front' as const, fileName: 'item.png', uploadedAt: new Date().toISOString() }]
          : [],
      };

      const normalizedPayments: PaymentEntry[] = payments.map((p) => ({
        ...p,
        amount: parseFloat(String(p.amount)) || 0,
      }));

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
        locationName: 'Texas Gold Buyers — Dallas Flagship (2427 W Mockingbird Ln)',
        transactionDate: new Date().toISOString(),
        status: 'COMPLETED',
        items: [txItem],
        subtotal: isBuy ? buyCalc.grossAmount : sellCalc.subtotal,
        discountOrAdjustment: isBuy ? buyCalc.adjustmentAmount : sellCalc.additionalChargeAmount,
        taxRatePercent: isBuy ? 0 : 8.5,
        taxAmount: isBuy ? 0 : sellCalc.taxAmount,
        finalTotal: totalAmount,
        marginPercent: activeCalc.marginPercent,
        marginAmount: activeCalc.marginAmount,
        profit: activeCalc.profit,
        imageUrl: imageUrl || undefined,
        payments: normalizedPayments,
        payment: {
          method: normalizedPayments[0]?.method || 'Cash',
          amount: paymentSummary.totalPaid,
          status: paymentSummary.isPaidInFull ? 'COMPLETED' : 'PENDING',
          referenceNumber: normalizedPayments[0]?.referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
          paidAt: new Date().toISOString(),
          cardLast4: normalizedPayments[0]?.cardLast4,
          cardType: normalizedPayments[0]?.cardType,
          chequeNumber: normalizedPayments[0]?.chequeNumber,
          bankName: normalizedPayments[0]?.bankName,
          notes: notes,
        },
        notes: notes,
        termsAccepted: true,
      });

      setSavedTransaction(newTx);
      setIsCompletedSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Transaction could not be completed. Please try again.');
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

        {/* Summary Card */}
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
            <span>Store Profit & Margin:</span>
            <span className="font-bold font-sans">
              ${Number(savedTransaction.profit || buyCalc.profit).toFixed(2)} ({Number(savedTransaction.marginPercent || buyCalc.marginPercent).toFixed(2)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Payment Breakdown:</span>
            <span className="font-bold text-white">
              {savedTransaction.payments?.map((p) => `${p.method}: $${Number(p.amount).toFixed(2)}`).join(' • ') || savedTransaction.payment.method}
            </span>
          </div>

          {savedTransaction.imageUrl && (
            <div className="pt-2 flex items-center gap-3">
              <span className="text-gray-400">Item Photo:</span>
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-tgb-gold/40">
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
            onClick={handleResetForm}
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
            {txType === 'BUY' ? 'Buy Gold & Precious Metals' : 'Sell Gold & Inventory Items'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {txType === 'BUY'
              ? 'Purchase scrap, bullion, coins, or jewelry with instant payout calculation.'
              : 'Retail sale from store stock with additional markup and Texas sales tax.'}
          </p>
        </div>

        {/* Mode Switcher */}
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

      {/* 2. STEP 1: CUSTOMER SELECTION */}
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

      {/* 3. STEP 2: ITEM & PURITY DETAILS */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
          <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Item Details & Gold Purity
          </h2>
        </div>

        {/* Item Preset Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Select Item <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedItemPreset}
              onChange={(e) => setSelectedItemPreset(e.target.value)}
              className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-tgb-gold focus:outline-none cursor-pointer"
            >
              {ITEM_PRESETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {selectedItemPreset === 'Other / Custom Item' && (
              <input
                type="text"
                placeholder="Enter custom item name (e.g. Platinum Diamond Watch)..."
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                className="mt-2 w-full bg-[#071320] border border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Category / Item Type
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-tgb-gold focus:outline-none cursor-pointer"
            >
              <option value="Jewelry">Jewelry</option>
              <option value="Coins & Currency">Coins & Bullion</option>
              <option value="Scrap & Melt">Scrap / Dental Gold</option>
              <option value="Luxury Watches">Luxury Watches</option>
              <option value="Diamonds">Diamonds & Gemstones</option>
              <option value="Estate">Estate / Heirloom</option>
            </select>
          </div>
        </div>

        {/* Purity / Karat Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-tgb-gold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Gold Purity / Karat <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-gray-400">Select hallmark</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {GOLD_PURITIES.map((p) => (
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
              placeholder="e.g. 21.6K, 916 Hallmark, or .925 Sterling"
              value={customPurity}
              onChange={(e) => setCustomPurity(e.target.value)}
              className="w-full bg-[#071320] border border-tgb-gold rounded-xl px-3.5 py-2.5 text-white text-xs"
            />
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Item Description / Condition Notes
          </label>
          <input
            type="text"
            placeholder="e.g. 14K Cuban link chain with lobster clasp, assayed at counter..."
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
          />
        </div>

        {/* Reusable Image Upload Component */}
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          label="Gold Item Photo / Assay Verification"
          helperText="Drag & drop or browse JPG, PNG, WEBP (Max 10MB)"
        />
      </div>

      {/* 4. STEP 3: TRANSACTION VALUES & VALUATION (BUY vs SELL) */}
      {txType === 'BUY' ? (
        /* ==================== BUY SCREEN ==================== */
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Weight, Rate & Customer Payout
            </h2>
          </div>

          {/* Clean Controlled Numeric Inputs (Start Empty - No 04 bug!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Weight in Grams (g) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Enter weight (e.g. 4.00)"
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  GRAMS
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Market / Reference Rate ($ / g) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={rate}
                  onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Enter rate (e.g. 60.00)"
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl pl-8 pr-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  / g
                </span>
              </div>
            </div>
          </div>

          {/* Customer Payout & Optional Adjustment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Customer Payout Amount <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-base">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={customerPayout}
                  onChange={(e) => setCustomerPayout(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Enter payout (e.g. 140.00)"
                  className="w-full bg-[#071320] border-2 border-emerald-500/60 focus:border-emerald-400 rounded-xl pl-8 pr-3.5 py-3 text-white font-mono text-lg font-black focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Payout Adjustment % (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={payoutAdjustmentPercent}
                  onChange={(e) => setPayoutAdjustmentPercent(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="e.g. 5"
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* BUY DEDICATED VISUAL PROFIT & ECONOMICS CARD */}
          <div className="bg-[#071320] border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-tgb-navyborder/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Buy Transaction Economics
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Staff View Only
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Market Value
                </span>
                <span className="text-xl font-bold text-white font-mono">
                  {buyCalc.hasValidInput ? `$${buyCalc.grossAmount.toFixed(2)}` : '—'}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {buyCalc.hasValidInput ? `${buyCalc.weight}g × $${buyCalc.ratePerGram}/g` : 'Enter weight & rate'}
                </span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Customer Payout
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {buyCalc.finalCustomerPayout > 0 ? `$${buyCalc.finalCustomerPayout.toFixed(2)}` : '—'}
                </span>
                <span className="text-[10px] text-gray-500 block">Amount Paid Out</span>
              </div>

              <div className="space-y-1 border-r border-tgb-navyborder/60">
                <span className="text-[11px] font-bold text-tgb-gold uppercase tracking-wider block">
                  Your Profit
                </span>
                <span className="text-2xl font-black text-tgb-gold font-mono">
                  {buyCalc.hasValidInput && buyCalc.finalCustomerPayout > 0 ? `$${buyCalc.profit.toFixed(2)}` : '—'}
                </span>
                <span className="text-[10px] text-gray-500 block">Market - Payout</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Margin
                </span>
                <span className="text-xl font-bold text-cyan-400 font-mono">
                  {buyCalc.hasValidInput && buyCalc.finalCustomerPayout > 0 ? `${buyCalc.marginPercent.toFixed(2)}%` : '—'}
                </span>
                <span className="text-[10px] text-gray-500 block">Profit Share</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== SELL SCREEN ==================== */
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Base Price, Additional Charge & Sales Tax
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Weight in Grams (g) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Enter weight (e.g. 4.00)"
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  GRAMS
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Base Selling Price ($) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Enter price (e.g. 250.00)"
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl pl-8 pr-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Additional Charge %
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={additionalChargePercent}
                  onChange={(e) => setAdditionalChargePercent(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="e.g. 50"
                  className="w-full bg-[#071320] border border-tgb-navyborder focus:border-tgb-gold rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* SELL DEDICATED VISUAL PROFIT & BREAKDOWN CARD */}
          <div className="bg-[#071320] border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-tgb-navyborder/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Sell Pricing & Tax Breakdown
              </span>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Texas Sales Tax 8.5%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#0a1827] rounded-xl border border-tgb-navyborder space-y-1">
                <span className="text-gray-400 block text-[10px] uppercase">Base Price</span>
                <span className="text-base font-bold text-white font-sans">
                  {sellCalc.hasValidInput ? `$${sellCalc.basePrice.toFixed(2)}` : '—'}
                </span>
              </div>

              <div className="p-3 bg-[#0a1827] rounded-xl border border-tgb-navyborder space-y-1">
                <span className="text-amber-400 block text-[10px] uppercase">
                  Additional Charge ({sellCalc.additionalChargePercent}%)
                </span>
                <span className="text-base font-bold text-amber-400 font-sans">
                  {sellCalc.hasValidInput ? `+$${sellCalc.additionalChargeAmount.toFixed(2)}` : '—'}
                </span>
              </div>

              <div className="p-3 bg-[#0a1827] rounded-xl border border-tgb-navyborder space-y-1">
                <span className="text-gray-300 block text-[10px] uppercase">Sales Tax (8.5%)</span>
                <span className="text-base font-bold text-gray-300 font-sans">
                  {sellCalc.hasValidInput ? `+$${sellCalc.taxAmount.toFixed(2)}` : '—'}
                </span>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 space-y-1">
                <span className="text-emerald-400 block text-[10px] uppercase font-bold">Your Profit</span>
                <span className="text-lg font-black text-emerald-400 font-sans">
                  {sellCalc.hasValidInput ? `$${sellCalc.profit.toFixed(2)}` : '—'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-tgb-navyborder/80 text-sm">
              <span className="font-bold text-gray-300 uppercase">Customer Total:</span>
              <span className="text-2xl font-black text-white font-sans">
                {sellCalc.hasValidInput ? `$${sellCalc.customerTotal.toFixed(2)}` : '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. STEP 4: MULTIPLE PAYMENT METHODS BREAKDOWN */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-tgb-navyborder">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Payment Breakdown (Multiple Methods Supported)
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddPaymentRow}
            className="py-1.5 px-3 bg-tgb-gold/15 hover:bg-tgb-gold/25 border border-tgb-gold/30 text-tgb-gold font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Payment
          </button>
        </div>

        {/* Dynamic Payment Rows with Method-Specific Fields */}
        <div className="space-y-3">
          {payments.map((p, idx) => (
            <div
              key={p.id || idx}
              className="bg-[#071320] border border-tgb-navyborder rounded-2xl p-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Method Selector */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Payment Method #{idx + 1}
                  </label>
                  <select
                    value={p.method}
                    onChange={(e) => handleUpdatePayment(idx, { method: e.target.value as any })}
                    className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-xl px-3 py-2 text-white text-xs font-bold focus:border-tgb-gold focus:outline-none cursor-pointer"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m === 'Cash' ? '💵 Cash' : m === 'Card' ? '💳 Card' : m === 'Bank Transfer' ? '🏦 Bank Transfer' : m === 'Cheque' ? '📝 Cheque' : m === 'Wire' ? '⚡ Wire' : '⚙️ Other'} {m}
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
                      type="text"
                      inputMode="decimal"
                      value={p.amount}
                      onChange={(e) => handleUpdatePayment(idx, { amount: e.target.value.replace(/[^0-9.]/g, '') })}
                      placeholder="Enter amount"
                      className="w-full bg-[#0a1827] border border-tgb-navyborder focus:border-tgb-gold rounded-xl pl-7 pr-3 py-2 text-white font-mono text-xs sm:text-sm font-bold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Reference / Memo */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Ref / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Reference / Transaction ID"
                    value={p.referenceNumber || ''}
                    onChange={(e) => handleUpdatePayment(idx, { referenceNumber: e.target.value })}
                    className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-xl px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none"
                  />
                </div>

                {/* Remove Button */}
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

              {/* Method-Specific Auxiliary Inputs */}
              {p.method === 'Card' && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-tgb-navyborder/60">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400">Card Brand</label>
                    <select
                      value={p.cardType || 'Visa'}
                      onChange={(e) => handleUpdatePayment(idx, { cardType: e.target.value as any })}
                      className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs"
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">American Express</option>
                      <option value="Discover">Discover</option>
                      <option value="Debit">Debit Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400">Last 4 Digits</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 4242"
                      value={p.cardLast4 || ''}
                      onChange={(e) => handleUpdatePayment(idx, { cardLast4: e.target.value })}
                      className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {p.method === 'Cheque' && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-tgb-navyborder/60">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400">Cheque Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 1042"
                      value={p.chequeNumber || ''}
                      onChange={(e) => handleUpdatePayment(idx, { chequeNumber: e.target.value })}
                      className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chase / Wells Fargo"
                      value={p.bankName || ''}
                      onChange={(e) => handleUpdatePayment(idx, { bankName: e.target.value })}
                      className="w-full bg-[#0a1827] border border-tgb-navyborder rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Multi-Payment Validation Summary */}
        <div className="bg-[#071320] border border-tgb-navyborder rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                paymentSummary.status === 'PAID IN FULL'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : paymentSummary.status === 'PARTIALLY PAID'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {paymentSummary.status}
            </span>
            <span className="text-gray-300">
              Total Due: <strong className="text-white">${currentTotalDue.toFixed(2)}</strong> • Total Paid: <strong className="text-white">${paymentSummary.totalPaid.toFixed(2)}</strong>
            </span>
          </div>

          {paymentSummary.isShort && (
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Remaining: ${paymentSummary.difference.toFixed(2)}
            </span>
          )}

          {paymentSummary.isExceed && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Exceeds by ${paymentSummary.difference.toFixed(2)}
            </span>
          )}

          {paymentSummary.isPaidInFull && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Balance: $0.00 (Paid in Full)
            </span>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Transaction Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="Special transaction notes, counter clerk remarks..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
          />
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
            <span>Recording Transaction in Supabase PostgreSQL...</span>
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>
                {txType === 'BUY'
                  ? `COMPLETE BUY — PAYOUT $${buyCalc.finalCustomerPayout.toFixed(2)}`
                  : `COMPLETE SALE — TOTAL $${sellCalc.customerTotal.toFixed(2)}`}
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
    </div>
  );
};

export default TransactionEntryForm;
