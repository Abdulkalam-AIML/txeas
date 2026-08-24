import { PaymentDetails, PaymentMethod } from '@/types';

export const paymentService = {
  createPaymentRecord(
    method: PaymentMethod,
    amount: number,
    extra?: {
      cardLast4?: string;
      cardType?: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Debit';
      cardAuthCode?: string;
      chequeNumber?: string;
      bankName?: string;
      chequeDate?: string;
      referenceNumber?: string;
      notes?: string;
    }
  ): PaymentDetails {
    const ref = extra?.referenceNumber || `REF-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    return {
      method,
      amount,
      status: 'COMPLETED',
      referenceNumber: ref,
      paidAt: new Date().toISOString(),
      notes: extra?.notes,
      cardLast4: extra?.cardLast4,
      cardType: extra?.cardType,
      cardAuthCode: extra?.cardAuthCode,
      chequeNumber: extra?.chequeNumber,
      bankName: extra?.bankName,
      chequeDate: extra?.chequeDate,
    };
  },
};
