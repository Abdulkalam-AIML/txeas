'use client';

import React from 'react';
import { Transaction } from '@/types';
import PrintableInvoice from './PrintableInvoice';
import { invoiceService } from '@/services';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface InvoiceViewModalProps {
  isOpen: boolean;
  transaction: Transaction;
  onClose: () => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  transaction,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    invoiceService.printInvoice();
  };

  const handleDownloadTextReceipt = () => {
    const text = invoiceService.exportInvoiceAsText(transaction);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${transaction.invoiceNumber}_${transaction.customerName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-tgb-darknavy border border-tgb-gold/40 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl relative my-8 max-h-[92vh] flex flex-col">
        {/* Modal Action Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-tgb-navyborder shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-tgb-gold uppercase tracking-wider">
                Official Transaction Receipt Generated
              </span>
              <span className="font-mono text-xs text-white bg-tgb-navy px-2 py-0.5 rounded border border-tgb-navyborder">
                {transaction.invoiceNumber}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              Invoice #{transaction.invoiceNumber}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadTextReceipt}
              className="py-2.5 px-4 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-tgb-gold" />
              <span>Download TXT</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-tgb-navy hover:bg-tgb-navylight rounded-xl border border-tgb-navyborder"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          <PrintableInvoice transaction={transaction} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
