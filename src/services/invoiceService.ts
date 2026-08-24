import { Transaction } from '@/types';

export const invoiceService = {
  getInvoiceFileName(transaction: Transaction): string {
    const cleanCustomer = transaction.customerName.replace(/[^a-zA-Z0-9]/g, '_');
    return `TexasGoldBuyers_Invoice_${transaction.invoiceNumber}_${cleanCustomer}.pdf`;
  },

  printInvoice(elementId = 'printable-invoice-area') {
    if (typeof window !== 'undefined') {
      window.print();
    }
  },

  exportInvoiceAsText(transaction: Transaction): string {
    return `
============================================================
              TEXAS GOLD BUYERS — TRANSACTION RECEIPT
============================================================
Invoice Number:   ${transaction.invoiceNumber}
Transaction ID:   ${transaction.id}
Date:             ${new Date(transaction.transactionDate).toLocaleString()}
Type:             ${transaction.type} (${transaction.type === 'BUY' ? 'Texas Gold Buyers Purchased From Customer' : 'Texas Gold Buyers Sold To Customer'})
Status:           ${transaction.status}

CUSTOMER INFORMATION:
Name:             ${transaction.customerName}
Phone:            ${transaction.customerPhone}
Email:            ${transaction.customerEmail}
Customer ID:      ${transaction.customerId}
Location:         ${transaction.locationName}
Handled By:       ${transaction.employeeName}

------------------------------------------------------------
ITEMIZED BREAKDOWN:
------------------------------------------------------------
${transaction.items
  .map(
    (item, idx) =>
      `${idx + 1}. [${item.category}] ${item.name}\n   Purity/Material: ${item.purity} | Weight: ${item.weight} ${item.unit} | Qty: ${item.quantity}\n   Unit Rate: $${item.offeredUnitPrice.toLocaleString()} | Item Total: $${item.totalPrice.toLocaleString()}`
  )
  .join('\n\n')}

------------------------------------------------------------
FINANCIAL SUMMARY:
------------------------------------------------------------
Subtotal:                $${transaction.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Adjustment / Discount:   $${transaction.discountOrAdjustment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Sales Tax:               $${transaction.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${transaction.taxRatePercent}%)
FINAL TOTAL:             $${transaction.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}

PAYMENT DETAILS:
Method:                  ${transaction.payment.method}
Amount Paid:             $${transaction.payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Reference #:             ${transaction.payment.referenceNumber}
${transaction.payment.cardLast4 ? `Card Ending In:          **** ${transaction.payment.cardLast4} (${transaction.payment.cardType || 'Card'})` : ''}
${transaction.payment.chequeNumber ? `Cheque Number:           #${transaction.payment.chequeNumber} (${transaction.payment.bankName})` : ''}

TERMS & LEGAL NOTICE:
Customer certifies all presented items are personal property and free of any liens.
Texas Gold Buyers operates in strict compliance with the Texas Department of Public Safety (DPS)
and Texas Precious Metal Dealer statutes.
============================================================
`.trim();
  },
};
