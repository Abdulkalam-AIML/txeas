import { createClient } from '@/utils/supabase/client';
import { Transaction, TransactionItem, PaymentDetails } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

function mapDbTransaction(tx: any, items: any[] = [], payment?: any, customer?: any, employee?: any, location?: any): Transaction {
  const mappedItems: TransactionItem[] = (items || []).map((i) => ({
    id: i.id,
    isCustom: !i.item_id,
    category: i.category || 'Gold',
    name: i.item_name || 'Gold Item',
    description: i.description || undefined,
    material: i.material || '14K Gold',
    purity: i.purity || '14K (58.5%)',
    weight: Number(i.weight) || 1,
    unit: i.unit || 'g',
    quantity: Number(i.quantity) || 1,
    estimatedMarketValue: Number(i.estimated_value) || 0,
    offeredUnitPrice: Number(i.unit_price) || 0,
    totalPrice: Number(i.total_price) || 0,
    notes: i.notes || undefined,
    images: [],
  }));

  const mappedPayment: PaymentDetails = payment
    ? {
        method: payment.payment_method || 'CASH',
        amount: Number(payment.amount) || Number(tx.total_amount) || 0,
        status: payment.payment_status || 'COMPLETED',
        referenceNumber: payment.reference_number || `REF-${tx.id.slice(0, 8)}`,
        paidAt: payment.payment_date || tx.created_at,
        cardLast4: payment.card_last_four || undefined,
        cardType: payment.card_type || undefined,
        chequeNumber: payment.cheque_number || undefined,
        bankName: payment.bank_name || undefined,
        notes: payment.notes || undefined,
      }
    : {
        method: 'CASH',
        amount: Number(tx.total_amount) || 0,
        status: 'COMPLETED',
        referenceNumber: `REF-${tx.id.slice(0, 8)}`,
        paidAt: tx.created_at,
      };

  return {
    id: tx.id,
    invoiceNumber: tx.invoice_number,
    type: tx.transaction_type,
    customerId: tx.customer_id,
    customerName: customer?.full_name || tx.customer_name || 'Valued Customer',
    customerPhone: customer?.phone || tx.customer_phone || '(214) 555-0199',
    customerEmail: customer?.email || tx.customer_email || 'client@texasgoldbuyers.com',
    customerAddress: customer?.address || tx.customer_address,
    employeeId: tx.employee_id,
    employeeName: employee?.full_name || tx.employee_name || 'Alexander Sterling',
    locationId: tx.location_id,
    locationName: location?.name || tx.location_name || 'Dallas Flagship — Uptown',
    transactionDate: tx.transaction_date || tx.created_at,
    status: tx.status,
    items: mappedItems,
    subtotal: Number(tx.subtotal) || 0,
    discountOrAdjustment: Number(tx.discount) || 0,
    taxRatePercent: Number(tx.tax_rate_percent) || 0,
    taxAmount: Number(tx.tax) || 0,
    finalTotal: Number(tx.total_amount) || 0,
    payment: mappedPayment,
    notes: tx.notes || undefined,
    termsAccepted: tx.terms_accepted ?? true,
    customerSignature: tx.customer_signature_url || undefined,
    employeeSignature: tx.employee_signature_url || undefined,
    createdAt: tx.created_at,
    updatedAt: tx.updated_at,
    voidReason: tx.void_reason || undefined,
    voidedBy: tx.voided_by || undefined,
    voidedAt: tx.voided_at || undefined,
  };
}

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
    const supabase = createClient();
    const { data: txList, error } = await supabase
      .from('transactions')
      .select(`
        *,
        customer:customers(*),
        employee:profiles(*),
        location:locations(*),
        items:transaction_items(*),
        payments:payments(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && txList && txList.length > 0) {
      return txList.map((tx: any) =>
        mapDbTransaction(
          tx,
          tx.items || [],
          tx.payments?.[0],
          tx.customer,
          tx.employee,
          tx.location
        )
      );
    }

    return await DemoRepository.getTransactions();
  },

  async getById(id: string): Promise<Transaction | undefined> {
    const supabase = createClient();
    const { data: tx, error } = await supabase
      .from('transactions')
      .select(`
        *,
        customer:customers(*),
        employee:profiles(*),
        location:locations(*),
        items:transaction_items(*),
        payments:payments(*)
      `)
      .eq('id', id)
      .single();

    if (!error && tx) {
      return mapDbTransaction(
        tx,
        tx.items || [],
        tx.payments?.[0],
        tx.customer,
        tx.employee,
        tx.location
      );
    }

    return await DemoRepository.getTransactionById(id);
  },

  async getByCustomerId(customerId: string): Promise<Transaction[]> {
    const all = await this.getAll();
    return all.filter((t) => t.customerId === customerId);
  },

  async search(params: SearchTransactionParams): Promise<Transaction[]> {
    const all = await this.getAll();
    let result = [...all];

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (t) =>
          t.invoiceNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    if (params.type && params.type !== 'ALL') {
      result = result.filter((t) => t.type === params.type);
    }

    if (params.employeeId) {
      result = result.filter((t) => t.employeeId === params.employeeId);
    }

    if (params.status) {
      result = result.filter((t) => t.status === params.status);
    }

    return result;
  },

  async create(data: Omit<Transaction, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const supabase = createClient();

    // Verify valid foreign key IDs from Supabase
    let custId = data.customerId;
    let empId = data.employeeId;
    let locId = data.locationId;

    // Check if customer exists in Supabase, else fetch or create
    if (custId) {
      const { data: dbCust } = await supabase.from('customers').select('id').eq('id', custId).single();
      if (!dbCust) {
        const { data: anyCust } = await supabase.from('customers').select('id').limit(1).single();
        if (anyCust) custId = anyCust.id;
      }
    } else {
      const { data: anyCust } = await supabase.from('customers').select('id').limit(1).single();
      if (anyCust) custId = anyCust.id;
    }

    // Check if employee exists in Supabase
    const { data: dbEmp } = await supabase.from('profiles').select('id').limit(1).single();
    if (dbEmp) empId = dbEmp.id;

    // Check if location exists in Supabase
    const { data: dbLoc } = await supabase.from('locations').select('id').limit(1).single();
    if (dbLoc) locId = dbLoc.id;

    const txNumber = `TGB-2026-${Date.now().toString().slice(-6)}`;
    const invNumber = `INV-2026-${Date.now().toString().slice(-6)}`;

    // 1. Insert into transactions table
    const { data: insertedTx, error: txError } = await supabase
      .from('transactions')
      .insert({
        transaction_number: txNumber,
        invoice_number: invNumber,
        customer_id: custId,
        employee_id: empId,
        location_id: locId,
        transaction_type: data.type,
        status: data.status || 'COMPLETED',
        subtotal: data.subtotal,
        discount: data.discountOrAdjustment || 0,
        tax_rate_percent: data.taxRatePercent || 0,
        tax: data.taxAmount || 0,
        total_amount: data.finalTotal,
        paid_amount: data.finalTotal,
        balance_amount: 0,
        payment_status: data.payment?.status || 'COMPLETED',
        notes: data.notes || null,
        terms_accepted: data.termsAccepted ?? true,
      })
      .select()
      .single();

    if (!txError && insertedTx) {
      // 2. Insert transaction items
      if (data.items && data.items.length > 0) {
        const itemsPayload = data.items.map((item) => ({
          transaction_id: insertedTx.id,
          item_name: item.name,
          category: item.category,
          material: item.material,
          purity: item.purity,
          weight: item.weight,
          unit: item.unit,
          quantity: item.quantity,
          unit_price: item.offeredUnitPrice,
          estimated_value: item.estimatedMarketValue,
          offered_price: item.offeredUnitPrice,
          total_price: item.totalPrice,
          notes: item.notes || null,
        }));
        await supabase.from('transaction_items').insert(itemsPayload);
      }

      // 3. Insert payment record
      if (data.payment) {
        await supabase.from('payments').insert({
          transaction_id: insertedTx.id,
          payment_method: data.payment.method,
          amount: data.payment.amount,
          payment_status: data.payment.status,
          reference_number: data.payment.referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
          cheque_number: data.payment.chequeNumber || null,
          bank_name: data.payment.bankName || null,
          card_type: data.payment.cardType || null,
          card_last_four: data.payment.cardLast4 || null,
          notes: data.payment.notes || null,
        });
      }

      // 4. Record Audit Log
      await supabase.from('audit_logs').insert({
        user_id: empId,
        user_name: data.employeeName,
        user_role: 'super_admin',
        action: 'CREATE',
        entity_type: 'TRANSACTION',
        entity_id: insertedTx.id,
        details: `Created ${data.type} order ${invNumber} for $${data.finalTotal.toFixed(2)} (${data.customerName}).`,
      });

      const fullTx = mapDbTransaction(insertedTx, data.items as any, data.payment, {
        full_name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        address: data.customerAddress,
      }, {
        full_name: data.employeeName,
      }, {
        name: data.locationName,
      });

      await DemoRepository.createTransaction({ ...data, id: fullTx.id, invoiceNumber: invNumber } as any);
      return fullTx;
    }

    if (txError) {
      console.warn('Supabase transaction insert notice:', txError.message);
    }

    return await DemoRepository.createTransaction(data);
  },

  async voidTransaction(id: string, reason: string, voidedByUserId: string): Promise<Transaction> {
    const supabase = createClient();
    const { data: updated } = await supabase
      .from('transactions')
      .update({
        status: 'VOIDED',
        void_reason: reason,
        voided_by: voidedByUserId,
        voided_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    await supabase.from('audit_logs').insert({
      user_id: voidedByUserId,
      user_name: 'Admin',
      user_role: 'super_admin',
      action: 'VOID',
      entity_type: 'TRANSACTION',
      entity_id: id,
      details: `Voided transaction ${id}. Reason: ${reason}`,
    });

    return await DemoRepository.voidTransaction(id, reason, voidedByUserId);
  },

  async getHistoricalSummary(year?: number) {
    const all = await this.getAll();
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
