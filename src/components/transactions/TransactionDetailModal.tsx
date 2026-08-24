'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types';
import { transactionService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import InvoiceViewModal from '@/components/invoices/InvoiceViewModal';
import {
  X,
  Printer,
  Ban,
  Clock,
  User,
  MapPin,
  Scale,
  CreditCard,
  History,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Camera,
  ExternalLink,
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onTransactionUpdated?: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onTransactionUpdated,
}) => {
  const { user, role } = useAuth();
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const isAdmin = role === 'SUPER_ADMIN';
  const isBuy = transaction.type === 'BUY';
  const isVoided = transaction.status === 'VOIDED';

  const handleVoid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voidReason.trim()) {
      alert('Please state a reason for voiding this transaction.');
      return;
    }

    try {
      await transactionService.voidTransaction(transaction.id, voidReason, user?.id || 'ADMIN');
      setVoidModalOpen(false);
      if (onTransactionUpdated) onTransactionUpdated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Could not void transaction');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="bg-tgb-navy border border-tgb-gold/30 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-tgb-navyborder">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    isBuy ? 'bg-emerald-500 text-tgb-darknavy' : 'bg-amber-500 text-tgb-darknavy'
                  }`}
                >
                  {isBuy ? 'BUY FROM CUSTOMER' : 'SELL TO CUSTOMER'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    isVoided
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                Transaction #{transaction.id}
              </h2>
              <div className="text-xs text-gray-400 font-mono">
                Invoice Reference: <strong className="text-tgb-gold">{transaction.invoiceNumber}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInvoiceModalOpen(true)}
                className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4" /> View / Print Official Invoice
              </button>

              {isAdmin && !isVoided && (
                <button
                  onClick={() => setVoidModalOpen(true)}
                  className="py-2.5 px-3.5 bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                  title="Void Transaction (Super Admin Only)"
                >
                  <Ban className="w-3.5 h-3.5" /> Void
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white bg-tgb-darknavy rounded-xl border border-tgb-navyborder"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voided Warning Notice if applicable */}
          {isVoided && (
            <div className="bg-rose-500/15 border border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">This transaction was VOIDED on {new Date(transaction.voidedAt || transaction.updatedAt).toLocaleDateString()}</strong>
                <p className="mt-0.5 text-rose-300">Reason: {transaction.voidReason || 'Administrative cancellation'}</p>
              </div>
            </div>
          )}

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-1 text-xs">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Customer Details</span>
              <div className="text-sm font-bold text-white">{transaction.customerName}</div>
              <div className="text-gray-300 font-mono">{transaction.customerPhone}</div>
              <div className="text-[11px] text-tgb-gold">{transaction.customerId}</div>
            </div>

            <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-1 text-xs">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Staff & Location</span>
              <div className="text-sm font-bold text-white">{transaction.employeeName}</div>
              <div className="text-gray-300">{transaction.locationName}</div>
              <div className="text-[11px] text-gray-400">Time: {new Date(transaction.transactionDate).toLocaleString()}</div>
            </div>

            <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-1 text-xs">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Settlement Summary</span>
              <div className="text-lg font-black text-tgb-gold font-mono">
                ${transaction.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-gray-300">
                Method: <strong className="text-white">{transaction.payment.method}</strong> ({transaction.payment.referenceNumber})
              </div>
            </div>
          </div>

          {/* Itemized Breakdown with Multi-Angle Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center justify-between">
              <span>Itemized Assets ({transaction.items.length} {transaction.items.length === 1 ? 'Item' : 'Items'})</span>
              <span className="text-xs text-tgb-gold font-mono font-bold">
                Subtotal: ${transaction.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </h3>

            <div className="space-y-4">
              {transaction.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-tgb-darknavy border border-tgb-navyborder rounded-2xl p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-tgb-navyborder/60">
                    <div>
                      <span className="text-sm font-bold text-white">
                        #{idx + 1}. {item.name}
                      </span>
                      <span className="ml-2 text-[10px] text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="font-mono text-base font-black text-tgb-gold">
                      ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Material / Alloy</span>
                      <span className="font-semibold text-white">{item.material}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Assayed Purity</span>
                      <span className="font-mono font-semibold text-emerald-400">{item.purity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Weight & Unit</span>
                      <span className="font-mono text-white">
                        {item.weight} {item.unit} (Qty: {item.quantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Unit Rate</span>
                      <span className="font-mono text-white">${item.offeredUnitPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {item.description && (
                    <div className="text-[11px] text-gray-300 bg-tgb-navy p-2.5 rounded-lg border border-tgb-navyborder">
                      {item.description}
                    </div>
                  )}

                  {/* Photo Gallery for this Item */}
                  {item.images && item.images.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Attached Appraisal Captures ({item.images.length} Photos)
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {item.images.map((img) => (
                          <div
                            key={img.id}
                            onClick={() => setSelectedZoomImage(img.url)}
                            className="w-28 h-20 bg-tgb-navy border border-tgb-navyborder rounded-xl overflow-hidden cursor-pointer hover:border-tgb-gold/60 transition-all shadow group relative"
                          >
                            <img src={img.url} alt={img.tag} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                              Zoom
                            </div>
                            <span className="absolute bottom-0 left-0 right-0 bg-black/75 text-[9px] text-center text-tgb-gold uppercase py-0.5 truncate">
                              {img.tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Audit Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-tgb-navyborder">
            <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-2 text-xs">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                Payment Verification
              </span>
              <div className="flex justify-between text-gray-300">
                <span>Method:</span>
                <strong className="text-white">{transaction.payment.method}</strong>
              </div>
              {transaction.payment.cardLast4 && (
                <div className="flex justify-between text-gray-300">
                  <span>Card Ending:</span>
                  <span className="font-mono">**** {transaction.payment.cardLast4} ({transaction.payment.cardType})</span>
                </div>
              )}
              {transaction.payment.chequeNumber && (
                <div className="flex justify-between text-gray-300">
                  <span>Cheque:</span>
                  <span className="font-mono">#{transaction.payment.chequeNumber} ({transaction.payment.bankName})</span>
                </div>
              )}
              <div className="flex justify-between text-gray-300">
                <span>Disbursed/Collected:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${transaction.payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder space-y-2 text-xs">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-tgb-gold" /> Audit History & Retention
              </span>
              <div className="text-gray-300 text-[11px] space-y-1">
                <div>Created: {new Date(transaction.createdAt).toLocaleString()} by {transaction.employeeName}</div>
                <div>Last Updated: {new Date(transaction.updatedAt).toLocaleString()}</div>
                <div>Retention Status: <strong className="text-emerald-400">5+ Year DPS Archive Locked</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceModalOpen && (
        <InvoiceViewModal
          isOpen={invoiceModalOpen}
          transaction={transaction}
          onClose={() => setInvoiceModalOpen(false)}
        />
      )}

      {/* Void Modal */}
      {voidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-display text-rose-400">
              Void Transaction #{transaction.id}
            </h3>
            <p className="text-xs text-gray-300">
              Super Admin authorization required. Voiding leaves an immutable audit record and updates customer totals.
            </p>

            <form onSubmit={handleVoid} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Reason for Voiding *</label>
                <textarea
                  required
                  rows={3}
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Customer cancelled order before vault transfer..."
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-rose-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVoidModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg"
                >
                  Confirm Void Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {selectedZoomImage && (
        <div
          onClick={() => setSelectedZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="max-w-3xl max-h-[85vh] p-2 bg-tgb-darknavy rounded-2xl border border-tgb-gold/40 shadow-2xl">
            <img src={selectedZoomImage} alt="High resolution capture" className="max-h-[80vh] w-auto rounded-xl mx-auto" />
            <div className="text-center text-xs text-gray-300 mt-2">Click anywhere to close</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionDetailModal;
