import { DemoRepository } from '@/lib/demoRepository';
import { Transaction, TransactionType } from '@/types';

export interface SearchTransactionParams {
  query?: string;
  type?: 'ALL' | 'BUY' | 'SELL';
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  locationId?: string;
  category?: string;
  paymentMethod?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    return await DemoRepository.getTransactions();
  },

  async getById(id: string): Promise<Transaction | undefined> {
    return await DemoRepository.getTransactionById(id);
  },

  async getByCustomerId(customerId: string): Promise<Transaction[]> {
    return await DemoRepository.getTransactionsByCustomerId(customerId);
  },

  async search(params: SearchTransactionParams): Promise<Transaction[]> {
    return await DemoRepository.searchTransactions(params);
  },

  async create(data: Omit<Transaction, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    return await DemoRepository.createTransaction(data);
  },

  async voidTransaction(id: string, reason: string, voidedByUserId: string): Promise<Transaction> {
    return await DemoRepository.voidTransaction(id, reason, voidedByUserId);
  },

  async getHistoricalSummary(year?: number) {
    const all = await DemoRepository.getTransactions();
    const filtered = year
      ? all.filter((t) => new Date(t.transactionDate).getFullYear() === year)
      : all;

    const completed = filtered.filter((t) => t.status === 'COMPLETED');
    const buys = completed.filter((t) => t.type === 'BUY');
    const sells = completed.filter((t) => t.type === 'SELL');

    return {
      totalCount: filtered.length,
      completedCount: completed.length,
      voidedCount: filtered.filter((t) => t.status === 'VOIDED').length,
      buyCount: buys.length,
      buyAmount: buys.reduce((acc, t) => acc + t.finalTotal, 0),
      sellCount: sells.length,
      sellAmount: sells.reduce((acc, t) => acc + t.finalTotal, 0),
      totalVolume: completed.reduce((acc, t) => acc + t.finalTotal, 0),
    };
  },
};
