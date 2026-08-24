/**
 * Centralized Calculation Engine for Texas Gold Buyers
 * Single source of truth for BUY, SELL, Margin, Profit, Tax, and Payment Splitting.
 */

export interface BuyCalculationInput {
  weight: number | string;
  ratePerGram: number | string;
  customerPayout?: number | string;
  marginPercent?: number | string;
  payoutAdjustmentPercent?: number | string;
}

export interface BuyCalculationResult {
  hasValidInput: boolean;
  weight: number;
  ratePerGram: number;
  grossAmount: number; // Market Value = Weight * Rate
  customerPayout: number; // Base payout to customer
  adjustmentPercent: number;
  adjustmentAmount: number; // Adjustment Amount
  finalCustomerPayout: number; // Customer Payout + Adjustment
  marginAmount: number; // Gross Amount - Final Customer Payout
  marginPercent: number; // (Margin Amount / Gross Amount) * 100
  profit: number; // Profit = Margin Amount
}

export interface SellCalculationInput {
  weight?: number | string;
  basePrice: number | string; // Base price of gold item
  additionalChargePercent?: number | string; // e.g. 50%
  taxRatePercent?: number | string; // e.g. 8.5%
}

export interface SellCalculationResult {
  hasValidInput: boolean;
  weight: number;
  basePrice: number;
  additionalChargePercent: number;
  additionalChargeAmount: number; // Base Price * (Additional Charge % / 100)
  marginAmount: number; // Same as additionalChargeAmount
  subtotal: number; // Base Price + Additional Charge Amount
  taxRatePercent: number;
  taxAmount: number; // Subtotal * (Tax Rate % / 100)
  customerTotal: number; // Subtotal + Tax Amount
  profit: number; // Profit = Additional Charge Amount
  marginPercent: number;
}

export interface PaymentEntry {
  id: string;
  method: 'Cash' | 'Card' | 'Cheque' | 'Wire' | 'Bank Transfer' | 'Store Credit' | 'UPI' | 'Other';
  amount: number | string;
  cardType?: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Debit';
  cardLast4?: string;
  chequeNumber?: string;
  bankName?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentSummaryResult {
  totalDue: number;
  totalPaid: number;
  remainingAmount: number;
  isPaidInFull: boolean;
  isShort: boolean;
  isExceed: boolean;
  difference: number;
  status: 'PAID IN FULL' | 'PARTIALLY PAID' | 'UNPAID';
}

/**
 * Calculates BUY Gold Transaction (Store buys from customer)
 */
export function calculateBuyTransaction(input: BuyCalculationInput): BuyCalculationResult {
  const weight = parseFloat(String(input.weight)) || 0;
  const rate = parseFloat(String(input.ratePerGram)) || 0;
  const hasValidInput = weight > 0 && rate > 0;

  const grossAmount = hasValidInput ? +(weight * rate).toFixed(2) : 0;
  
  let customerPayout = parseFloat(String(input.customerPayout));
  if (isNaN(customerPayout) && input.marginPercent !== undefined) {
    const mPct = parseFloat(String(input.marginPercent)) || 0;
    const mAmt = +((grossAmount * mPct) / 100).toFixed(2);
    customerPayout = Math.max(0, grossAmount - mAmt);
  } else if (isNaN(customerPayout)) {
    customerPayout = +(grossAmount * 0.6).toFixed(2); // default placeholder
  }

  const adjPct = parseFloat(String(input.payoutAdjustmentPercent)) || 0;
  const adjustmentAmount = adjPct !== 0 ? +((customerPayout * adjPct) / 100).toFixed(2) : 0;
  const finalCustomerPayout = +(Math.max(0, customerPayout + adjustmentAmount)).toFixed(2);

  const marginAmount = +(grossAmount - finalCustomerPayout).toFixed(2);
  const marginPercent = grossAmount > 0 ? +((marginAmount / grossAmount) * 100).toFixed(2) : 0;
  const profit = marginAmount;

  return {
    hasValidInput,
    weight,
    ratePerGram: rate,
    grossAmount,
    customerPayout,
    adjustmentPercent: adjPct,
    adjustmentAmount,
    finalCustomerPayout,
    marginAmount,
    marginPercent,
    profit,
  };
}

/**
 * Calculates SELL Gold Transaction (Store sells to customer)
 */
export function calculateSellTransaction(input: SellCalculationInput): SellCalculationResult {
  const weight = parseFloat(String(input.weight)) || 0;
  const basePrice = parseFloat(String(input.basePrice)) || 0;
  const hasValidInput = basePrice > 0;

  const addPct = parseFloat(String(input.additionalChargePercent)) || 0;
  const additionalChargeAmount = hasValidInput ? +((basePrice * addPct) / 100).toFixed(2) : 0;
  const subtotal = +(basePrice + additionalChargeAmount).toFixed(2);

  const taxPct = input.taxRatePercent !== undefined ? parseFloat(String(input.taxRatePercent)) : 8.5;
  const taxAmount = +(subtotal * (taxPct / 100)).toFixed(2);
  const customerTotal = +(subtotal + taxAmount).toFixed(2);

  const profit = additionalChargeAmount;
  const marginPercent = basePrice > 0 ? +((additionalChargeAmount / basePrice) * 100).toFixed(2) : 0;

  return {
    hasValidInput,
    weight,
    basePrice,
    additionalChargePercent: addPct,
    additionalChargeAmount,
    marginAmount: additionalChargeAmount,
    subtotal,
    taxRatePercent: taxPct,
    taxAmount,
    customerTotal,
    profit,
    marginPercent,
  };
}

/**
 * Validates and summarizes multiple payment method rows
 */
export function calculatePaymentSummary(totalDue: number, payments: PaymentEntry[]): PaymentSummaryResult {
  const due = Math.max(0, Number(totalDue) || 0);
  const totalPaid = +payments.reduce((sum, p) => sum + (Math.max(0, parseFloat(String(p.amount)) || 0)), 0).toFixed(2);
  const diff = +(due - totalPaid).toFixed(2);

  const isPaidInFull = Math.abs(diff) < 0.01 && due > 0;
  const isShort = diff > 0.01;
  const isExceed = diff < -0.01;
  const remainingAmount = isShort ? diff : 0;

  let status: 'PAID IN FULL' | 'PARTIALLY PAID' | 'UNPAID' = 'UNPAID';
  if (isPaidInFull || (totalPaid >= due && due > 0)) {
    status = 'PAID IN FULL';
  } else if (totalPaid > 0 && totalPaid < due) {
    status = 'PARTIALLY PAID';
  }

  return {
    totalDue: due,
    totalPaid,
    remainingAmount,
    isPaidInFull,
    isShort,
    isExceed,
    difference: Math.abs(diff),
    status,
  };
}
