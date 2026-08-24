import { createClient } from '@/utils/supabase/client';
import { Transaction, TransactionItem, PaymentDetails, PaymentEntry } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

function mapDbTransaction(
  tx: any,
  items: any[] = [],
  payment?: any,
  customer?: any,
  employee?: any,
  location?: any,
  paymentList: any[] = []
): Transaction {
  const mappedItems: TransactionItem[] = (items || []).map((i) => ({
    id: i.id,
    isCustom: !i.item_id,
    category: i.category || 'Gold',
    name: i.item_name || 'Gold Item',
    itemType: i.item_type || i.item_name,
    description: i.description || undefined,
    material: i.material || 'Gold',
    purity: i.purity || '22K',
    weight: Number(i.weight) || 1,
    unit: i.unit || 'g',
    quantity: Number(i.quantity) || 1,
    ratePerGram: Number(i.unit_price) || undefined,
    estimatedMarketValue: Number(i.estimated_value) || 0,
    offeredUnitPrice: Number(i.unit_price) || 0,
    totalPrice: Number(i.total_price) || 0,
    notes: i.notes || undefined,
    imageUrl: i.image_url || undefined,
    images: i.image_url
      ? [{ id: `IMG-${i.id}`, url: i.image_url, tag: 'General', fileName: 'item-image.png', uploadedAt: tx.created_at }]
      : [],
  }));

  // Map multiple payment method rows
  const mappedPayments: PaymentEntry[] = (paymentList && paymentList.length > 0)
    ? paymentList.map((p) => ({
        id: p.id,
        method: p.payment_method || 'Cash',
        amount: Number(p.amount) || 0,
        referenceNumber: p.reference_number || undefined,
        notes: p.notes || undefined,
      }))
    : payment
    ? [
        {
          id: payment.id || `PAY-${tx.id}`,
          method: payment.payment_method || 'Cash',
          amount: Number(payment.amount) || Number(tx.total_amount) || 0,
          referenceNumber: payment.reference_number,
          notes: payment.notes,
        },
      ]
    : [
        {
          id: `PAY-${tx.id}`,
          method: 'Cash',
          amount: Number(tx.total_amount) || 0,
        },
      ];

  const primaryPayment = payment || (paymentList && paymentList[0]);

  const mappedPayment: PaymentDetails = primaryPayment
    ? {
        method: primaryPayment.payment_method || 'CASH',
        amount: Number(primaryPayment.amount) || Number(tx.total_amount) || 0,
        status: primaryPayment.payment_status || 'COMPLETED',
        referenceNumber: primaryPayment.reference_number || `REF-${tx.id.slice(0, 8)}`,
        paidAt: primaryPayment.payment_date || tx.created_at,
        cardLast4: primaryPayment.card_last_four || undefined,
        cardType: primaryPayment.card_type || undefined,
        chequeNumber: primaryPayment.cheque_number || undefined,
        bankName: primaryPayment.bank_name || undefined,
        notes: primaryPayment.notes || undefined,
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
    customerPhone: customer?.phone || tx.customer_phone || '(469) 453-5339',
    customerEmail: customer?.email || tx.customer_email || 'client@texasgoldbuyers.com',
    customerAddress: customer?.address || tx.customer_address,
    employeeId: tx.employee_id,
    employeeName: employee?.full_name || tx.employee_name || 'Alexander Sterling',
    locationId: tx.location_id,
    locationName: location?.name || tx.location_name || 'Dallas Flagship — 2427 W Mockingbird Ln',
    transactionDate: tx.transaction_date || tx.created_at,
    status: tx.status,
    items: mappedItems,
    subtotal: Number(tx.subtotal) || 0,
    discountOrAdjustment: Number(tx.discount) || 0,
    taxRatePercent: Number(tx.tax_rate_percent) || 0,
    taxAmount: Number(tx.tax) || 0,
    finalTotal: Number(tx.total_amount) || 0,
    marginPercent: Number(tx.margin_percentage) || undefined,
    marginAmount: Number(tx.margin_amount) || undefined,
    profit: Number(tx.profit) || undefined,
    imageUrl: mappedItems[0]?.imageUrl,
    payments: mappedPayments,
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
          (tx.payments && tx.payments[0]) || null,
          tx.customer,
          tx.employee,
          tx.location,
          tx.payments || []
        )
      );
    }

    return DemoRepository.getTransactions();
  },

  async getById(id: string): Promise<Transaction | null> {
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
        (tx.payments && tx.payments[0]) || null,
        tx.customer,
        tx.employee,
        tx.location,
        tx.payments || []
      );
    }

    const fallback = await DemoRepository.getTransactionById(id);
    return fallback || null;
  },

  async getByCustomerId(customerId: string): Promise<Transaction[]> {
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
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (!error && txList && txList.length > 0) {
      return txList.map((tx: any) =>
        mapDbTransaction(
          tx,
          tx.items || [],
          (tx.payments && tx.payments[0]) || null,
          tx.customer,
          tx.employee,
          tx.location,
          tx.payments || []
        )
      );
    }

    return DemoRepository.getTransactionsByCustomerId(customerId);
  },

  async search(params: SearchTransactionParams = {}): Promise<Transaction[]> {
    const all = await this.getAll();
    let results = [...all];

    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.invoiceNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerPhone.includes(q) ||
          t.items.some((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      );
    }

    if (params.type && params.type !== 'ALL') {
      results = results.filter((t) => t.type === params.type);
    }

    if (params.employeeId) {
      results = results.filter((t) => t.employeeId === params.employeeId);
    }

    if (params.locationId) {
      results = results.filter((t) => t.locationId === params.locationId);
    }

    if (params.status) {
      results = results.filter((t) => t.status === params.status);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'amount_high':
          results.sort((a, b) => b.finalTotal - a.finalTotal);
          break;
        case 'amount_low':
          results.sort((a, b) => a.finalTotal - b.finalTotal);
          break;
      }
    }

    return results;
  },

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const supabase = createClient();

    let custId = data.customerId;
    let empId = data.employeeId;
    let locId = data.locationId;

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

    const { data: dbEmp } = await supabase.from('profiles').select('id').limit(1).single();
    if (dbEmp) empId = dbEmp.id;

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
          material: item.material || 'Gold',
          purity: item.purity || '22K',
          weight: item.weight,
          unit: item.unit || 'g',
          quantity: item.quantity || 1,
          unit_price: item.offeredUnitPrice,
          estimated_value: item.estimatedMarketValue,
          offered_price: item.offeredUnitPrice,
          total_price: item.totalPrice,
          notes: item.notes || null,
          image_url: item.imageUrl || null,
        }));
        await supabase.from('transaction_items').insert(itemsPayload);
      }

      // 3. Insert payment records (support multiple payment methods)
      if (data.payments && data.payments.length > 0) {
        const paymentPayloads = data.payments.map((p) => ({
          transaction_id: insertedTx.id,
          payment_method: p.method,
          amount: p.amount,
          payment_status: 'COMPLETED',
          reference_number: p.referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
          notes: p.notes || null,
        }));
        await supabase.from('payments').insert(paymentPayloads);
      } else if (data.payment) {
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
        user_name: data.employeeName || 'Staff Member',
        user_role: 'super_admin',
        action: 'CREATE',
        entity_type: 'TRANSACTION',
        entity_id: insertedTx.id,
        details: `Created ${data.type} order ${invNumber} for $${Number(data.finalTotal).toFixed(2)} (${data.customerName}).`,
      });

      const fullTx = mapDbTransaction(
        insertedTx,
        data.items as any,
        data.payment,
        {
          full_name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail,
          address: data.customerAddress,
        },
        {
          full_name: data.employeeName,
        },
        {
          name: data.locationName,
        },
        data.payments || []
      );

      return fullTx;
    }

    // Fallback to local demo repository
    return DemoRepository.createTransaction(data as any);
  },

  async voidTransaction(id: string, reason: string): Promise<Transaction> {
    const supabase = createClient();
    const { data: updatedTx, error } = await supabase
      .from('transactions')
      .update({
        status: 'VOIDED',
        void_reason: reason,
        voided_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (!error && updatedTx) {
      return this.getById(id) as Promise<Transaction>;
    }

    return DemoRepository.voidTransaction(id, reason, 'ADMIN');
  },
};
