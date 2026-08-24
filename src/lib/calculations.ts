/**
 * Centralized Calculation Engine for Texas Gold Buyers
 * Single source of truth for BUY, SELL, Margin, Profit, and Payment Splitting.
 */

export interface BuyCalculationInput {
  weight: number;
  ratePerGram: number;
  marginPercent: number;
}

export interface BuyCalculationResult {
  grossAmount: number; // Weight * Rate
  marginPercent: number;
  marginAmount: number; // Gross Amount * (Margin% / 100)
  amountPaidToCustomer: number; // Gross Amount - Margin Amount
  profit: number; // Expected Profit = Margin Amount
}

export interface SellCalculationInput {
  weight?: number;
  ratePerGram?: number;
  baseCost: number; // Base cost / value of item
  marginPercent: number; // Additional margin %
}

export interface SellCalculationResult {
  baseCost: number;
  marginPercent: number;
  marginAmount: number; // Base Cost * (Margin% / 100)
  sellingAmount: number; // Base Cost + Margin Amount
  profit: number; // Profit = Selling Amount - Base Cost = Margin Amount
}

export interface PaymentEntry {
  id: string;
  method: 'Cash' | 'Card' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Other';
  amount: number;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentSummaryResult {
  totalPayable: number;
  totalPaid: number;
  remainingAmount: number;
  paymentStatus: 'Fully Paid' | 'Partially Paid' | 'Unpaid';
  isExact: boolean;
  isShort: boolean;
  isExceed: boolean;
  difference: number;
}

/**
 * Calculates BUY Gold Transaction (Store buys from customer)
 * Gross Amount = Weight * Rate
 * Margin Amount = Gross Amount * (Margin% / 100)
 * Amount Paid to Customer = Gross Amount - Margin Amount
 * Profit = Margin Amount
 */
export function calculateBuyTransaction(input: BuyCalculationInput): BuyCalculationResult {
  const weight = Math.max(0, Number(input.weight) || 0);
  const rate = Math.max(0, Number(input.ratePerGram) || 0);
  const marginPct = Math.max(0, Number(input.marginPercent) || 0);

  const grossAmount = +(weight * rate).toFixed(2);
  const marginAmount = +((grossAmount * marginPct) / 100).toFixed(2);
  const amountPaidToCustomer = +(Math.max(0, grossAmount - marginAmount)).toFixed(2);
  const profit = marginAmount;

  return {
    grossAmount,
    marginPercent: marginPct,
    marginAmount,
    amountPaidToCustomer,
    profit,
  };
}

/**
 * Calculates SELL Gold Transaction (Store sells to customer)
 * Base Cost = entered base cost or (weight * rate)
 * Margin Amount = Base Cost * (Margin% / 100)
 * Selling Amount = Base Cost + Margin Amount
 * Profit = Margin Amount
 */
export function calculateSellTransaction(input: SellCalculationInput): SellCalculationResult {
  let baseCost = Math.max(0, Number(input.baseCost) || 0);
  if (baseCost === 0 && input.weight && input.ratePerGram) {
    baseCost = +(input.weight * input.ratePerGram).toFixed(2);
  }
  const marginPct = Math.max(0, Number(input.marginPercent) || 0);

  const marginAmount = +((baseCost * marginPct) / 100).toFixed(2);
  const sellingAmount = +(baseCost + marginAmount).toFixed(2);
  const profit = marginAmount;

  return {
    baseCost,
    marginPercent: marginPct,
    marginAmount,
    sellingAmount,
    profit,
  };
}

/**
 * Validates and summarizes multiple payment method rows
 */
export function calculatePaymentSummary(totalPayable: number, payments: PaymentEntry[]): PaymentSummaryResult {
  const payable = Math.max(0, Number(totalPayable) || 0);
  const totalPaid = +payments.reduce((sum, p) => sum + (Math.max(0, Number(p.amount) || 0)), 0).toFixed(2);
  const diff = +(payable - totalPaid).toFixed(2);

  const isExact = Math.abs(diff) < 0.01;
  const isShort = diff > 0.01;
  const isExceed = diff < -0.01;
  const remainingAmount = isShort ? diff : 0;

  let paymentStatus: 'Fully Paid' | 'Partially Paid' | 'Unpaid' = 'Unpaid';
  if (totalPaid >= payable && payable > 0) {
    paymentStatus = 'Fully Paid';
  } else if (totalPaid > 0 && totalPaid < payable) {
    paymentStatus = 'Partially Paid';
  } else if (totalPaid === 0) {
    paymentStatus = 'Unpaid';
  }

  return {
    totalPayable: payable,
    totalPaid,
    remainingAmount,
    paymentStatus,
    isExact,
    isShort,
    isExceed,
    difference: Math.abs(diff),
  };
}
