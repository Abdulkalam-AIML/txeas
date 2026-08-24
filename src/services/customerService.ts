import { createClient } from '@/utils/supabase/client';
import { Customer } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

function mapDbCustomer(row: any): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    mobileNumber: row.phone,
    email: row.email || '',
    address: row.address || '',
    city: row.city || 'Dallas',
    state: row.state || 'TX',
    zipCode: row.zip_code || '75201',
    idType: row.id_type || 'Drivers License',
    idNumber: row.id_number || '',
    dateOfBirth: row.date_of_birth || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    totalTransactionsCount: row.total_transactions_count || 0,
    totalBuyAmount: row.total_buy_amount || 0,
    totalSellAmount: row.total_sell_amount || 0,
  };
}

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapDbCustomer);
    }
    return await DemoRepository.getCustomers();
  },

  async getById(id: string): Promise<Customer | undefined> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return mapDbCustomer(data);
    }
    return await DemoRepository.getCustomerById(id);
  },

  async search(query: string): Promise<Customer[]> {
    const supabase = createClient();
    const q = query.trim();
    if (!q) return this.getAll();

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,id_number.ilike.%${q}%`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(mapDbCustomer);
    }
    return await DemoRepository.searchCustomers(query);
  },

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalTransactionsCount' | 'totalBuyAmount' | 'totalSellAmount'>): Promise<Customer> {
    const supabase = createClient();
    const customerCode = `TGB-CUS-${Date.now().toString().slice(-6)}`;

    const { data: inserted, error } = await supabase
      .from('customers')
      .insert({
        customer_code: customerCode,
        full_name: data.fullName,
        phone: data.mobileNumber,
        email: data.email || null,
        address: data.address,
        city: data.city || 'Dallas',
        state: data.state || 'TX',
        zip_code: data.zipCode || '75201',
        id_type: data.idType,
        id_number: data.idNumber,
        date_of_birth: data.dateOfBirth || null,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (!error && inserted) {
      const created = mapDbCustomer(inserted);
      await DemoRepository.createCustomer({ ...data, id: created.id } as any);
      return created;
    }

    if (error) {
      console.warn('Supabase customer insert notice:', error.message);
    }

    return await DemoRepository.createCustomer(data);
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const supabase = createClient();
    const dbPayload: any = {};
    if (updates.fullName) dbPayload.full_name = updates.fullName;
    if (updates.mobileNumber) dbPayload.phone = updates.mobileNumber;
    if (updates.email !== undefined) dbPayload.email = updates.email;
    if (updates.address) dbPayload.address = updates.address;
    if (updates.city) dbPayload.city = updates.city;
    if (updates.state) dbPayload.state = updates.state;
    if (updates.zipCode) dbPayload.zip_code = updates.zipCode;
    if (updates.idType) dbPayload.id_type = updates.idType;
    if (updates.idNumber) dbPayload.id_number = updates.idNumber;
    if (updates.notes !== undefined) dbPayload.notes = updates.notes;
    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('customers')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      const updated = mapDbCustomer(data);
      await DemoRepository.updateCustomer(id, updates);
      return updated;
    }

    return await DemoRepository.updateCustomer(id, updates);
  },
};
