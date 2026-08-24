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

  // Mode: BUY (from customer) vs SELL (to customer)
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

  // BUY Mode Specific Calculation State
  const [buyItemName, setBuyItemName] = useState('14K Gold Scrap / Estate');
  const [buyCategory, setBuyCategory] = useState<MetalCategory>('Gold');
  const [buyWeight, setBuyWeight] = useState<number>(4.0);
  const [buyRate, setBuyRate] = useState<number>(60.0);
  const [buyCustomerPayout, setBuyCustomerPayout] = useState<number>(140.0);
  const [buyAdjustmentType, setBuyAdjustmentType] = useState<'none' | 'fixed' | 'percent'>('none');
  const [buyAdjustmentValue, setBuyAdjustmentValue] = useState<number>(0);

  // SELL Mode Specific Calculation State
  const [sellItemName, setSellItemName] = useState('14K Gold Chain / Bullion');
  const [sellCategory, setSellCategory] = useState<MetalCategory>('Gold');
  const [sellWeight, setSellWeight] = useState<number>(4.0);
  const [sellBasePrice, setSellBasePrice] = useState<number>(250.0);
  const [sellAdditionalChargePercent, setSellAdditionalChargePercent] = useState<number>(50.0);
  const [sellTaxRatePercent, setSellTaxRatePercent] = useState<number>(8.5);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState<Transaction | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load initial customers
  useEffect(() => {
    customerService.getAll().then((data) => {
      setCustomers(data);
      if (data.length > 0 && !selectedCustomer) {
        setSelectedCustomer(data[0]);
      }
    });
  }, []);

  // Filtered customer search list
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

  // BUY Calculations
  const buyMarketValue = +(Math.max(0, buyWeight) * Math.max(0, buyRate)).toFixed(2);
  let buyAdjustmentAmount = 0;
  if (buyAdjustmentType === 'percent') {
    buyAdjustmentAmount = +(buyCustomerPayout * (buyAdjustmentValue / 100)).toFixed(2);
  } else if (buyAdjustmentType === 'fixed') {
    buyAdjustmentAmount = +buyAdjustmentValue;
  }
  const finalBuyPayout = +(Math.max(0, buyCustomerPayout + buyAdjustmentAmount)).toFixed(2);
  const buyGrossMargin = +(buyMarketValue - finalBuyPayout).toFixed(2);
  const buyMarginPercent = buyMarketValue > 0 ? +((buyGrossMargin / buyMarketValue) * 100).toFixed(2) : 0;

  // SELL Calculations
  const sellAdditionalChargeAmount = +(Math.max(0, sellBasePrice) * (Math.max(0, sellAdditionalChargePercent) / 100)).toFixed(2);
  const sellSubtotal = +(Math.max(0, sellBasePrice) + sellAdditionalChargeAmount).toFixed(2);
  const sellTaxAmount = +(sellSubtotal * (Math.max(0, sellTaxRatePercent) / 100)).toFixed(2);
  const finalSellTotal = +(sellSubtotal + sellTaxAmount).toFixed(2);

  // Submit Transaction
  const handleSaveTransaction = async () => {
    if (!selectedCustomer) {
      alert('Please select or create a customer first.');
      return;
    }

    setIsSaving(true);
    try {
      let txItem: TransactionItem;
      let subtotalAmount = 0;
      let finalTotalAmount = 0;
      let taxAmountVal = 0;
      let taxRateVal = 0;
      let adjustmentVal = 0;

      if (txType === 'BUY') {
        subtotalAmount = buyMarketValue;
        finalTotalAmount = finalBuyPayout;
        adjustmentVal = buyAdjustmentAmount;
        taxAmountVal = 0;
        taxRateVal = 0;

        txItem = {
          id: `ITEM-${Date.now()}`,
          isCustom: true,
          category: buyCategory,
          name: buyItemName,
          description: `Assayed weight: ${buyWeight}g @ $${buyRate}/g market benchmark. Customer Payout: $${finalBuyPayout}. Gross Margin: $${buyGrossMargin} (${buyMarginPercent}%).`,
          material: 'Assayed Gold Alloy',
          purity: 'Standard Assay',
          weight: buyWeight,
          unit: 'g',
          quantity: 1,
          estimatedMarketValue: buyMarketValue,
          offeredUnitPrice: buyWeight > 0 ? +(finalBuyPayout / buyWeight).toFixed(2) : finalBuyPayout,
          totalPrice: finalBuyPayout,
          images: [],
        };
      } else {
        subtotalAmount = sellSubtotal;
        finalTotalAmount = finalSellTotal;
        taxAmountVal = sellTaxAmount;
        taxRateVal = sellTaxRatePercent;
        adjustmentVal = sellAdditionalChargeAmount;

        txItem = {
          id: `ITEM-${Date.now()}`,
          isCustom: true,
          category: sellCategory,
          name: sellItemName,
          description: `Base Price: $${sellBasePrice} + Additional Charge (${sellAdditionalChargePercent}%: $${sellAdditionalChargeAmount}) + Sales Tax (${sellTaxRatePercent}%: $${sellTaxAmount}).`,
          material: 'Precious Metals Inventory',
          purity: 'Minted / Certified',
          weight: sellWeight,
          unit: 'g',
          quantity: 1,
          estimatedMarketValue: sellBasePrice,
          offeredUnitPrice: sellSubtotal,
          totalPrice: sellSubtotal,
          images: [],
        };
      }

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
        locationName: user?.locationName || 'Dallas Flagship — Uptown',
        transactionDate: new Date().toISOString(),
        status: 'COMPLETED',
        items: [txItem],
        subtotal: subtotalAmount,
        discountOrAdjustment: adjustmentVal,
        taxRatePercent: taxRateVal,
        taxAmount: taxAmountVal,
        finalTotal: finalTotalAmount,
        payment: {
          method: paymentMethod,
          amount: finalTotalAmount,
          status: 'COMPLETED',
          referenceNumber: `REF-${Date.now().toString().slice(-6)}`,
          paidAt: new Date().toISOString(),
          cardLast4: paymentMethod === 'CARD' ? cardLast4 || '4242' : undefined,
          chequeNumber: paymentMethod === 'CHEQUE' ? chequeNumber || '5001' : undefined,
          bankName: paymentMethod === 'CHEQUE' ? bankName || 'Chase Bank' : undefined,
          notes: paymentNotes,
        },
        notes: paymentNotes,
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
      <div className="max-w-2xl mx-auto my-6 bg-[#0a1827] border border-tgb-gold/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fade-in">
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
            Texas Gold Buyers • 2427 W Mockingbird Ln, Dallas, TX 75235
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
              {savedTransaction.type === 'BUY' ? 'BUY FROM CUSTOMER (Payout)' : 'SELL TO CUSTOMER (Retail)'}
            </span>
          </div>
          <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2">
            <span className="text-gray-400">{savedTransaction.type === 'BUY' ? 'Total Paid to Customer:' : 'Total Received from Customer:'}</span>
            <span className="font-bold text-xl text-white font-sans">
              ${savedTransaction.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          {savedTransaction.type === 'BUY' && (
            <div className="flex justify-between border-b border-tgb-navyborder/80 pb-2 text-emerald-400">
              <span>Your Gross Margin (Internal):</span>
              <span className="font-bold font-sans">
                ${buyGrossMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({buyMarginPercent}%)
              </span>
            </div>
          )}
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
              {txType === 'BUY' ? 'BUY FROM CUSTOMER' : 'SELL TO CUSTOMER'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display mt-1">
            {txType === 'BUY' ? 'Buy Gold & Precious Metals' : 'Sell Inventory to Customer'}
          </h1>
        </div>

        {/* Large Touch-Friendly Mode Switcher */}
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

        {/* Selected Customer Card or Search */}
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
                placeholder="Search customer by name, phone number, or email..."
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

      {/* 3. STEP 2: TRANSACTION DETAILS (BUY vs SELL) */}
      {txType === 'BUY' ? (
        /* ==================== BUY WORKFLOW ==================== */
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Gold Weight & Market Valuation
            </h2>
          </div>

          {/* Item Description & Karat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Gold / Item Type
              </label>
              <select
                value={buyItemName}
                onChange={(e) => {
                  setBuyItemName(e.target.value);
                  // preset typical rates
                  if (e.target.value.includes('10K')) setBuyRate(34.0);
                  else if (e.target.value.includes('14K')) setBuyRate(48.0);
                  else if (e.target.value.includes('18K')) setBuyRate(62.0);
                  else if (e.target.value.includes('22K') || e.target.value.includes('24K')) setBuyRate(81.0);
                  else if (e.target.value.includes('Silver')) setBuyRate(0.95);
                }}
                className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-tgb-gold focus:outline-none cursor-pointer"
              >
                <option value="10K Gold Scrap / Jewelry">10K Gold Scrap / Estate</option>
                <option value="14K Gold Scrap / Estate">14K Gold Scrap / Estate</option>
                <option value="18K Gold Fine Jewelry">18K Gold Fine Jewelry</option>
                <option value="22K / 24K Pure Gold Bullion">22K / 24K Pure Gold Bullion</option>
                <option value="999 Fine Silver Bar">999 Fine Silver Bar</option>
                <option value="Sterling Silver Jewelry (.925)">Sterling Silver Jewelry (.925)</option>
                <option value="Custom Gold / Diamond Piece">Custom Gold / Diamond Piece</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Weight in Grams (g)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={buyWeight || ''}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value) || 0;
                    setBuyWeight(w);
                    // auto calculate suggested payout (e.g. ~60% of market)
                    const mv = w * buyRate;
                    setBuyCustomerPayout(+(mv * 0.6).toFixed(2));
                  }}
                  placeholder="e.g. 4.00"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:border-tgb-gold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  GRAMS
                </span>
              </div>
            </div>
          </div>

          {/* Rate & Customer Payout Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Market Rate ($ / gram)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={buyRate || ''}
                  onChange={(e) => {
                    const r = parseFloat(e.target.value) || 0;
                    setBuyRate(r);
                    const mv = buyWeight * r;
                    setBuyCustomerPayout(+(mv * 0.6).toFixed(2));
                  }}
                  placeholder="e.g. 60.00"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:border-tgb-gold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  $/g
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Customer Payout (Amount Paid to Customer)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-base">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={buyCustomerPayout || ''}
                  onChange={(e) => setBuyCustomerPayout(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 140.00"
                  className="w-full bg-[#071320] border-2 border-emerald-500/60 focus:border-emerald-400 rounded-xl pl-8 pr-3.5 py-3 text-white font-mono text-lg font-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* GROSS MARGIN & PROFIT CARD (Visible only to authorized staff) */}
          <div className="bg-[#071320] border border-tgb-gold/40 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1 border-r border-tgb-navyborder/60">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Market Value
              </span>
              <span className="text-lg font-bold text-white font-mono">
                ${buyMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-gray-500 block">{buyWeight}g × ${buyRate}/g</span>
            </div>

            <div className="space-y-1 border-r border-tgb-navyborder/60">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Customer Payout
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                ${finalBuyPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-gray-500 block">Money Paid Out</span>
            </div>

            <div className="space-y-1 border-r border-tgb-navyborder/60">
              <span className="text-[11px] font-bold text-tgb-gold uppercase tracking-wider block">
                Your Gross Margin
              </span>
              <span className="text-xl font-black text-tgb-gold font-mono">
                ${buyGrossMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-gray-500 block">Market - Payout</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Margin %
              </span>
              <span className="text-lg font-bold text-cyan-400 font-mono">
                {buyMarginPercent}%
              </span>
              <span className="text-[10px] text-gray-500 block">Profit Share</span>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== SELL WORKFLOW ==================== */
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Retail Sale Pricing & Tax Breakdown
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Item Description
              </label>
              <input
                type="text"
                value={sellItemName}
                onChange={(e) => setSellItemName(e.target.value)}
                placeholder="e.g. 14K Gold Bracelet"
                className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-tgb-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Base Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sellBasePrice || ''}
                  onChange={(e) => setSellBasePrice(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 250.00"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl pl-8 pr-3.5 py-3 text-white font-mono text-base font-bold focus:border-tgb-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Additional Charge % & Sales Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Additional Charge %
                </label>
                <span className="text-[10px] text-gray-400">Enter percentage, not $</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={sellAdditionalChargePercent || ''}
                  onChange={(e) => setSellAdditionalChargePercent(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 50"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:border-tgb-gold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold">
                  % (+${sellAdditionalChargeAmount.toFixed(2)})
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Sales Tax Rate %
                </label>
                <span className="text-[10px] text-gray-400">Texas Standard 8.5%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sellTaxRatePercent || ''}
                  onChange={(e) => setSellTaxRatePercent(parseFloat(e.target.value) || 0)}
                  placeholder="8.5"
                  className="w-full bg-[#071320] border border-tgb-navyborder rounded-xl px-3.5 py-3 text-white font-mono text-base font-bold focus:border-tgb-gold focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  % (+${sellTaxAmount.toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* SELL FINANCIAL BREAKDOWN CARD */}
          <div className="bg-[#071320] border border-tgb-gold/40 rounded-2xl p-5 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between text-gray-300 pb-1.5 border-b border-tgb-navyborder/80">
              <span>Base Price:</span>
              <span className="font-bold">${sellBasePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-amber-400 pb-1.5 border-b border-tgb-navyborder/80">
              <span>Additional Charge ({sellAdditionalChargePercent}%):</span>
              <span className="font-bold">+${sellAdditionalChargeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300 pb-1.5 border-b border-tgb-navyborder/80">
              <span>Subtotal:</span>
              <span className="font-bold">${sellSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300 pb-1.5 border-b border-tgb-navyborder/80">
              <span>Sales Tax ({sellTaxRatePercent}%):</span>
              <span className="font-bold">+${sellTaxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white text-base font-black pt-1">
              <span>CUSTOMER TOTAL:</span>
              <span className="text-tgb-gold font-sans text-xl">${finalSellTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. STEP 3: PAYMENT METHOD & FINAL CONFIRMATION */}
      <div className="bg-tgb-navy border border-tgb-navyborder rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-tgb-navyborder">
          <span className="w-6 h-6 rounded-full bg-tgb-gold/20 text-tgb-gold text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Settlement & Payment Method
          </h2>
        </div>

        {/* Big Touch-Friendly Payment Method Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['CASH', 'CARD', 'WIRE', 'CHEQUE'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 ${
                paymentMethod === method
                  ? 'bg-tgb-gold text-tgb-darknavy border-tgb-gold shadow-lg scale-[1.02]'
                  : 'bg-[#071320] text-gray-300 border-tgb-navyborder hover:border-tgb-gold/40'
              }`}
            >
              <span>{method === 'CASH' ? '💵 Cash' : method === 'CARD' ? '💳 Card' : method === 'WIRE' ? '🏦 Wire' : '📝 Cheque'}</span>
              <span>{method}</span>
            </button>
          ))}
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
            <span>Processing Transaction in Supabase...</span>
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>
                {txType === 'BUY'
                  ? `COMPLETE BUY — PAYOUT $${finalBuyPayout.toFixed(2)}`
                  : `COMPLETE SELL — RECEIVE $${finalSellTotal.toFixed(2)}`}
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
              <h3 className="text-lg font-bold text-white font-display">Add New Customer</h3>
              <button
                onClick={() => setCustomerModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
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
                  className="flex-1 py-2.5 rounded-xl bg-tgb-navy text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy text-xs font-bold"
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
