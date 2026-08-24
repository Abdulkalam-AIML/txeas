'use client';

import React from 'react';
import { Transaction } from '@/types';
import TexasGoldBuyersLogo from '@/components/Logo';

interface PrintableInvoiceProps {
  transaction: Transaction;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ transaction }) => {
  const isBuy = transaction.type === 'BUY';

  return (
    <div
      id="printable-invoice-area"
      className="printable-content bg-white text-black p-8 sm:p-10 max-w-4xl mx-auto rounded-2xl shadow-xl border border-gray-200 font-sans text-xs space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-900">
        <div>
          <TexasGoldBuyersLogo size="md" theme="light" />
          <div className="text-[11px] text-gray-700 mt-2 space-y-0.5 font-medium">
            <div className="font-bold text-gray-900">Texas Gold Buyers</div>
            <div>2427 W Mockingbird Ln • Dallas, TX 75235</div>
            <div>Phone: +1 (469) 453-5339 • info@texasgoldbuyers.com</div>
            <div className="text-gray-500 text-[10px]">
              Texan Owned & Operated • Texas DPS Regulated Dealer #TX-PMD-49210
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right space-y-1">
          <div
            className={`inline-block px-3 py-1 rounded text-xs font-black uppercase tracking-wider text-white ${
              isBuy ? 'bg-emerald-800' : 'bg-amber-800'
            }`}
          >
            {isBuy ? 'OFFICIAL BUY INTAKE RECEIPT' : 'RETAIL SALE INVOICE'}
          </div>
          <div className="text-sm font-black font-mono text-gray-900">
            {transaction.invoiceNumber}
          </div>
          <div className="text-[11px] text-gray-600">
            <strong>Tx #:</strong> {transaction.id}
          </div>
          <div className="text-[11px] text-gray-600">
            <strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Customer & Location Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="space-y-1">
          <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
            {isBuy ? 'Seller (Customer):' : 'Buyer (Customer):'}
          </span>
          <div className="text-sm font-bold text-gray-900">{transaction.customerName}</div>
          <div className="text-gray-700">Phone: {transaction.customerPhone}</div>
          {transaction.customerEmail && <div className="text-gray-700">Email: {transaction.customerEmail}</div>}
          <div className="text-gray-600 text-[11px]">Dallas, TX Store Location</div>
        </div>

        <div className="space-y-1 sm:text-right">
          <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
            Store & Appraiser:
          </span>
          <div className="text-sm font-bold text-gray-900">Texas Gold Buyers Flagship</div>
          <div className="text-gray-700">Appraiser / Staff: {transaction.employeeName}</div>
          <div className="text-gray-700 font-mono">Payment Ref: {transaction.payment.referenceNumber}</div>
          <div className="text-gray-700">Payment Status: <strong className="text-emerald-700">{transaction.payment.status}</strong></div>
        </div>
      </div>

      {/* Itemized Table */}
      <div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-[10px] uppercase font-bold text-gray-700">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Item Description</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2 text-right">Weight</th>
              <th className="py-2 px-2 text-right">Qty</th>
              <th className="py-2 px-2 text-right">Rate / Unit</th>
              <th className="py-2 px-2 text-right">Total ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transaction.items.map((item, idx) => (
              <tr key={item.id} className="text-gray-800">
                <td className="py-2.5 px-2 font-bold">{idx + 1}</td>
                <td className="py-2.5 px-2">
                  <span className="font-bold text-gray-900 block">{item.name}</span>
                  {item.description && (
                    <span className="text-[10px] text-gray-500 block">{item.description}</span>
                  )}
                </td>
                <td className="py-2.5 px-2">{item.category}</td>
                <td className="py-2.5 px-2 text-right font-mono font-semibold">
                  {item.weight} {item.unit}
                </td>
                <td className="py-2.5 px-2 text-right font-mono">{item.quantity}</td>
                <td className="py-2.5 px-2 text-right font-mono">
                  ${item.offeredUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2.5 px-2 text-right font-mono font-bold text-gray-900">
                  ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-gray-800 items-start">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
            Payment Disbursement:
          </span>
          <div className="flex justify-between">
            <span className="text-gray-600">Method:</span>
            <strong className="text-gray-900">{transaction.payment.method}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isBuy ? 'Amount Paid Out:' : 'Amount Received:'}</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">
              ${transaction.payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-mono font-semibold">
              ${transaction.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          {transaction.discountOrAdjustment !== 0 && (
            <div className="flex justify-between">
              <span>{isBuy ? 'Adjustment:' : 'Additional Charges:'}</span>
              <span className="font-mono text-gray-800">
                ${transaction.discountOrAdjustment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          {transaction.taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Sales Tax ({transaction.taxRatePercent}%):</span>
              <span className="font-mono font-semibold">
                ${transaction.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-300 text-sm font-black text-gray-900">
            <span>{isBuy ? 'FINAL PAYOUT:' : 'FINAL TOTAL:'}</span>
            <span className="font-mono text-base">
              ${transaction.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Texas DPS Certification */}
      <div className="p-3.5 bg-gray-100 rounded-lg text-[10px] text-gray-600 leading-relaxed border border-gray-300">
        <strong>TEXAS STATUTORY PRECIOUS METAL DEALER CERTIFICATION:</strong> In compliance with Chapter 1956 of the Texas Occupations Code, the customer certifies that they are the sole lawful owner of all presented items, free of all liens. Texas Gold Buyers operates under Dallas, TX regulatory jurisdiction.
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 pt-4">
        <div className="space-y-3">
          <div className="border-b border-gray-800 pb-1 text-gray-400 font-mono text-[10px]">
            {transaction.customerName} (Counter Sign)
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-700 block">Customer Signature</span>
        </div>

        <div className="space-y-3">
          <div className="border-b border-gray-800 pb-1 text-gray-400 font-mono text-[10px]">
            {transaction.employeeName} (Appraiser #TX-4921)
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-700 block">Authorized Appraiser Signature</span>
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;
