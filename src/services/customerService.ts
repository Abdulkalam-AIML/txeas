import { DemoRepository } from '@/lib/demoRepository';
import { Customer } from '@/types';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    return await DemoRepository.getCustomers();
  },

  async getById(id: string): Promise<Customer | undefined> {
    return await DemoRepository.getCustomerById(id);
  },

  async search(query: string): Promise<Customer[]> {
    return await DemoRepository.searchCustomers(query);
  },

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalTransactionsCount' | 'totalBuyAmount' | 'totalSellAmount'>): Promise<Customer> {
    return await DemoRepository.createCustomer(data);
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    return await DemoRepository.updateCustomer(id, updates);
  },
};
