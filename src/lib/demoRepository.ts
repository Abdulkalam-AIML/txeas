import {
  User,
  Customer,
  Transaction,
  PredefinedMenuItem,
  Location,
  AuditLog,
  SpotPrices,
  ReportFilter,
  TransactionType,
} from '@/types';
import {
  INITIAL_LOCATIONS,
  INITIAL_PREDEFINED_ITEMS,
  INITIAL_SPOT_PRICES,
  INITIAL_USERS,
  generateSeedCustomers,
  generateSeedTransactions,
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'tgb_demo_users_v1',
  CUSTOMERS: 'tgb_demo_customers_v1',
  TRANSACTIONS: 'tgb_demo_transactions_v1',
  ITEMS: 'tgb_demo_items_v1',
  LOCATIONS: 'tgb_demo_locations_v1',
  AUDIT_LOGS: 'tgb_demo_audit_logs_v1',
  SPOT_PRICES: 'tgb_demo_spot_prices_v1',
  ACTIVE_USER: 'tgb_demo_active_user_v1',
};

class DemoRepositorySingleton {
  private users: User[] = [];
  private customers: Customer[] = [];
  private transactions: Transaction[] = [];
  private items: PredefinedMenuItem[] = [];
  private locations: Location[] = [];
  private auditLogs: AuditLog[] = [];
  private spotPrices: SpotPrices = INITIAL_SPOT_PRICES;
  private activeUser: User | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    // Load from local storage if available in browser
    if (typeof window !== 'undefined') {
      try {
        const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
        const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const storedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
        const storedLocations = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
        const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
        const storedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);

        if (storedUsers && storedCustomers && storedTransactions) {
          this.users = JSON.parse(storedUsers);
          this.customers = JSON.parse(storedCustomers);
          this.transactions = JSON.parse(storedTransactions);
          this.items = storedItems ? JSON.parse(storedItems) : INITIAL_PREDEFINED_ITEMS;
          this.locations = storedLocations ? JSON.parse(storedLocations) : INITIAL_LOCATIONS;
          this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [];
          this.activeUser = storedUser ? JSON.parse(storedUser) : this.users[0];
          this.isInitialized = true;
          return;
        }
      } catch (e) {
        console.warn('Could not read from localStorage, using fresh seed data', e);
      }
    }

    // Seed data generation
    this.users = [...INITIAL_USERS];
    this.locations = [...INITIAL_LOCATIONS];
    this.items = [...INITIAL_PREDEFINED_ITEMS];
    this.customers = generateSeedCustomers();
    const seedTx = generateSeedTransactions(this.customers, this.users);
    this.transactions = seedTx.transactions;
    this.auditLogs = seedTx.auditLogs;
    this.activeUser = this.users[0]; // default to Super Admin
    this.isInitialized = true;

    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(this.customers));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(this.items));
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(this.locations));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      if (this.activeUser) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(this.activeUser));
      }
    } catch (e) {
      console.warn('LocalStorage save failed (possible quota limit)', e);
    }
  }

  public resetDemoData() {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    }
    this.isInitialized = false;
    this.init();
  }

  // --- Auth & Session ---
  public async getActiveUser(): Promise<User | null> {
    this.init();
    return this.activeUser;
  }

  public async setActiveUser(user: User | null): Promise<void> {
    this.activeUser = user;
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      }
    }
  }

  public async getUsers(): Promise<User[]> {
    this.init();
    return [...this.users];
  }

  public async getUserById(id: string): Promise<User | undefined> {
    this.init();
    return this.users.find((u) => u.id === id);
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    this.init();
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public async getUserByIdOrCode(idOrCode: string): Promise<User | undefined> {
    this.init();
    const clean = idOrCode.trim().toLowerCase();
    
    // Direct code / id match
    const found = this.users.find(
      (u) =>
        u.id.toLowerCase() === clean ||
        (u.employeeCode && u.employeeCode.toLowerCase() === clean) ||
        u.email.toLowerCase() === clean
    );
    if (found) return found;

    // Support common alias inputs (e.g. 'admin', 'employee', 'tgb-adm-001', 'tgb-emp-002')
    if (clean === 'admin' || clean === 'tgb-adm-001' || clean === 'tgb-admin-001' || clean === 'emp-001') {
      return this.users.find((u) => u.role === 'SUPER_ADMIN');
    }
    if (clean === 'employee' || clean === 'tgb-emp-002' || clean === 'emp-002') {
      return this.users.find((u) => u.role === 'EMPLOYEE');
    }

    return undefined;
  }

  public async createEmployee(empData: Omit<User, 'id' | 'joinedDate'>): Promise<User> {
    this.init();
    const newId = `USR-${String(this.users.length + 1).padStart(3, '0')}`;
    const newEmp: User = {
      ...empData,
      id: newId,
      joinedDate: new Date().toISOString(),
      status: 'ACTIVE',
    };
    this.users.push(newEmp);
    this.saveToStorage();

    await this.logAudit({
      userId: this.activeUser?.id || 'SYSTEM',
      userName: this.activeUser?.name || 'Super Admin',
      role: this.activeUser?.role || 'SUPER_ADMIN',
      action: 'EMPLOYEE_CREATED',
      entity: 'EMPLOYEE',
      entityId: newId,
      details: `Created new employee ${newEmp.name} (${newEmp.email}) assigned to ${newEmp.locationName}`,
    });

    return newEmp;
  }

  public async updateEmployee(id: string, updates: Partial<User>): Promise<User> {
    this.init();
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Employee not found');
    const oldEmp = { ...this.users[idx] };
    this.users[idx] = { ...this.users[idx], ...updates };
    this.saveToStorage();

    await this.logAudit({
      userId: this.activeUser?.id || 'SYSTEM',
      userName: this.activeUser?.name || 'Super Admin',
      role: this.activeUser?.role || 'SUPER_ADMIN',
      action: updates.status === 'DISABLED' ? 'EMPLOYEE_DISABLED' : 'EMPLOYEE_UPDATED',
      entity: 'EMPLOYEE',
      entityId: id,
      details: `Updated employee ${oldEmp.name} details.`,
      beforeState: oldEmp,
      afterState: this.users[idx],
    });

    return this.users[idx];
  }

  // --- Customers ---
  public async getCustomers(): Promise<Customer[]> {
    this.init();
    return [...this.customers];
  }

  public async getCustomerById(id: string): Promise<Customer | undefined> {
    this.init();
    return this.customers.find((c) => c.id === id);
  }

  public async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalTransactionsCount' | 'totalBuyAmount' | 'totalSellAmount'>): Promise<Customer> {
    this.init();
    const newId = `TGB-CUS-${String(this.customers.length + 1).padStart(6, '0')}`;
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
      totalTransactionsCount: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
    };
    this.customers.unshift(newCustomer);
    this.saveToStorage();

    await this.logAudit({
      userId: this.activeUser?.id || 'SYSTEM',
      userName: this.activeUser?.name || 'Employee',
      role: this.activeUser?.role || 'EMPLOYEE',
      action: 'CUSTOMER_CREATED',
      entity: 'CUSTOMER',
      entityId: newId,
      details: `Registered customer ${newCustomer.fullName} (Phone: ${newCustomer.mobileNumber}, DL: ${newCustomer.idNumber})`,
      afterState: newCustomer,
    });

    return newCustomer;
  }

  public async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    this.init();
    const idx = this.customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Customer not found');
    const old = { ...this.customers[idx] };
    this.customers[idx] = {
      ...this.customers[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage();

    await this.logAudit({
      userId: this.activeUser?.id || 'SYSTEM',
      userName: this.activeUser?.name || 'Staff',
      role: this.activeUser?.role || 'EMPLOYEE',
      action: 'CUSTOMER_UPDATED',
      entity: 'CUSTOMER',
      entityId: id,
      details: `Updated customer ${old.fullName} record`,
      beforeState: old,
      afterState: this.customers[idx],
    });

    return this.customers[idx];
  }

  public async searchCustomers(query: string): Promise<Customer[]> {
    this.init();
    if (!query.trim()) return this.customers.slice(0, 50);
    const q = query.toLowerCase().trim();
    return this.customers.filter((c) =>
      c.fullName.toLowerCase().includes(q) ||
      c.mobileNumber.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.idNumber.toLowerCase().includes(q)
    );
  }

  // --- Transactions ---
  public async getTransactions(): Promise<Transaction[]> {
    this.init();
    return [...this.transactions];
  }

  public async getTransactionById(id: string): Promise<Transaction | undefined> {
    this.init();
    return this.transactions.find((t) => t.id === id || t.invoiceNumber === id);
  }

  public async getTransactionsByCustomerId(customerId: string): Promise<Transaction[]> {
    this.init();
    return this.transactions.filter((t) => t.customerId === customerId);
  }

  public async createTransaction(data: Omit<Transaction, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    this.init();
    const year = new Date().getFullYear();
    const txNum = this.transactions.length + 1;
    const txId = `TGB-${year}-${String(txNum).padStart(6, '0')}`;
    const invoiceNum = `INV-${year}-${String(txNum).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const newTx: Transaction = {
      ...data,
      id: txId,
      invoiceNumber: invoiceNum,
      createdAt: now,
      updatedAt: now,
    };

    this.transactions.unshift(newTx);

    // Update customer aggregate stats
    const custIdx = this.customers.findIndex((c) => c.id === newTx.customerId);
    if (custIdx !== -1) {
      const cust = this.customers[custIdx];
      cust.totalTransactionsCount = (cust.totalTransactionsCount || 0) + 1;
      if (newTx.type === 'BUY') {
        cust.totalBuyAmount = +( (cust.totalBuyAmount || 0) + newTx.finalTotal ).toFixed(2);
      } else {
        cust.totalSellAmount = +( (cust.totalSellAmount || 0) + newTx.finalTotal ).toFixed(2);
      }
      cust.updatedAt = now;
    }

    this.saveToStorage();

    await this.logAudit({
      userId: newTx.employeeId,
      userName: newTx.employeeName,
      role: this.activeUser?.role || 'EMPLOYEE',
      action: 'TRANSACTION_CREATED',
      entity: 'TRANSACTION',
      entityId: txId,
      details: `Created ${newTx.type} transaction ${txId} (${newTx.items.length} items, Total: $${newTx.finalTotal.toLocaleString()}) for customer ${newTx.customerName}`,
      afterState: newTx,
    });

    return newTx;
  }

  public async voidTransaction(id: string, reason: string, voidedByUserId: string): Promise<Transaction> {
    this.init();
    const idx = this.transactions.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');
    const tx = this.transactions[idx];
    tx.status = 'VOIDED';
    tx.voidReason = reason;
    tx.voidedBy = voidedByUserId;
    tx.voidedAt = new Date().toISOString();
    tx.updatedAt = new Date().toISOString();

    this.saveToStorage();

    await this.logAudit({
      userId: voidedByUserId,
      userName: this.activeUser?.name || 'Super Admin',
      role: 'SUPER_ADMIN',
      action: 'TRANSACTION_VOIDED',
      entity: 'TRANSACTION',
      entityId: id,
      details: `Voided transaction ${id}. Reason: ${reason}`,
    });

    return tx;
  }

  // --- Search & Filtering Engine ---
  public async searchTransactions(options: {
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
  }): Promise<Transaction[]> {
    this.init();
    let results = [...this.transactions];

    // Text Query
    if (options.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      results = results.filter((tx) =>
        tx.id.toLowerCase().includes(q) ||
        tx.invoiceNumber.toLowerCase().includes(q) ||
        tx.customerName.toLowerCase().includes(q) ||
        tx.customerPhone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        tx.customerId.toLowerCase().includes(q) ||
        tx.employeeName.toLowerCase().includes(q) ||
        tx.items.some((item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q)
        )
      );
    }

    // Type filter
    if (options.type && options.type !== 'ALL') {
      results = results.filter((tx) => tx.type === options.type);
    }

    // Date range filters
    if (options.startDate) {
      const start = new Date(options.startDate).getTime();
      results = results.filter((tx) => new Date(tx.transactionDate).getTime() >= start);
    }
    if (options.endDate) {
      const end = new Date(options.endDate + 'T23:59:59Z').getTime();
      results = results.filter((tx) => new Date(tx.transactionDate).getTime() <= end);
    }

    // Employee filter
    if (options.employeeId && options.employeeId !== 'ALL') {
      results = results.filter((tx) => tx.employeeId === options.employeeId);
    }

    // Location filter
    if (options.locationId && options.locationId !== 'ALL') {
      results = results.filter((tx) => tx.locationId === options.locationId);
    }

    // Category filter
    if (options.category && options.category !== 'ALL') {
      results = results.filter((tx) =>
        tx.items.some((i) => i.category.toLowerCase() === options.category?.toLowerCase())
      );
    }

    // Payment method filter
    if (options.paymentMethod && options.paymentMethod !== 'ALL') {
      results = results.filter((tx) => tx.payment.method === options.paymentMethod);
    }

    // Status filter
    if (options.status && options.status !== 'ALL') {
      results = results.filter((tx) => tx.status === options.status);
    }

    // Sorting
    const sortBy = options.sortBy || 'newest';
    results.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      }
      if (sortBy === 'amount_high') {
        return b.finalTotal - a.finalTotal;
      }
      if (sortBy === 'amount_low') {
        return a.finalTotal - b.finalTotal;
      }
      return 0;
    });

    return results;
  }

  // --- Predefined Catalog Items ---
  public async getPredefinedItems(): Promise<PredefinedMenuItem[]> {
    this.init();
    return [...this.items];
  }

  public async addPredefinedItem(item: Omit<PredefinedMenuItem, 'id'>): Promise<PredefinedMenuItem> {
    this.init();
    const newId = `MENU-CUSTOM-${Date.now()}`;
    const newItem: PredefinedMenuItem = { ...item, id: newId };
    this.items.push(newItem);
    this.saveToStorage();

    await this.logAudit({
      userId: this.activeUser?.id || 'SUPER_ADMIN',
      userName: this.activeUser?.name || 'Super Admin',
      role: 'SUPER_ADMIN',
      action: 'ITEM_CREATED',
      entity: 'ITEM',
      entityId: newId,
      details: `Added new menu item ${newItem.name} in category ${newItem.category}`,
    });

    return newItem;
  }

  public async updatePredefinedItem(id: string, updates: Partial<PredefinedMenuItem>): Promise<PredefinedMenuItem> {
    this.init();
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    this.items[idx] = { ...this.items[idx], ...updates };
    this.saveToStorage();
    return this.items[idx];
  }

  // --- Locations ---
  public async getLocations(): Promise<Location[]> {
    this.init();
    return [...this.locations];
  }

  // --- Spot Rates ---
  public async getSpotPrices(): Promise<SpotPrices> {
    this.init();
    return { ...this.spotPrices };
  }

  // --- Audit Logs ---
  public async getAuditLogs(options?: {
    action?: string;
    entity?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    query?: string;
  }): Promise<AuditLog[]> {
    this.init();
    let logs = [...this.auditLogs];

    if (options?.query) {
      const q = options.query.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.details.toLowerCase().includes(q) ||
          l.userName.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q)
      );
    }
    if (options?.action && options.action !== 'ALL') {
      logs = logs.filter((l) => l.action === options.action);
    }
    if (options?.entity && options.entity !== 'ALL') {
      logs = logs.filter((l) => l.entity === options.entity);
    }
    if (options?.userId && options.userId !== 'ALL') {
      logs = logs.filter((l) => l.userId === options.userId);
    }

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  }

  public async logAudit(entry: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'> & { ipAddress?: string; userAgent?: string }): Promise<AuditLog> {
    this.init();
    const newLog: AuditLog = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ipAddress: entry.ipAddress || '192.168.1.1',
      userAgent: entry.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'TGB-Server/1.0'),
    };
    this.auditLogs.unshift(newLog);
    this.saveToStorage();
    return newLog;
  }

  // --- Dashboard & Analytics Engine ---
  public async getDashboardAnalytics(timeframe: 'today' | '7days' | '30days' | '3months' | '1year' | 'all' = '30days') {
    this.init();
    const now = new Date();
    let cutoff = new Date(0);

    if (timeframe === 'today') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeframe === '7days') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === '30days') {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeframe === '3months') {
      cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (timeframe === '1year') {
      cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    // Filter valid (non-voided) transactions in range
    const validTx = this.transactions.filter(
      (tx) => tx.status === 'COMPLETED' && new Date(tx.transactionDate) >= cutoff
    );

    // Today's specific metrics
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayTx = this.transactions.filter(
      (tx) => tx.status === 'COMPLETED' && new Date(tx.transactionDate).getTime() >= todayStart
    );

    const todayBuyAmount = todayTx
      .filter((t) => t.type === 'BUY')
      .reduce((sum, t) => sum + t.finalTotal, 0);

    const todaySellAmount = todayTx
      .filter((t) => t.type === 'SELL')
      .reduce((sum, t) => sum + t.finalTotal, 0);

    // Total metrics in timeframe
    const totalTransactions = validTx.length;
    const totalBuyValue = validTx
      .filter((t) => t.type === 'BUY')
      .reduce((sum, t) => sum + t.finalTotal, 0);
    const totalSellValue = validTx
      .filter((t) => t.type === 'SELL')
      .reduce((sum, t) => sum + t.finalTotal, 0);
    const totalVolume = totalBuyValue + totalSellValue;

    // Weight calculations (Gold purchased vs sold in grams and troy oz)
    let goldPurchasedGrams = 0;
    let goldSoldGrams = 0;
    let silverPurchasedGrams = 0;
    let platinumPurchasedGrams = 0;

    validTx.forEach((tx) => {
      tx.items.forEach((item) => {
        let grams = item.weight;
        if (item.unit === 'oz') grams = item.weight * 31.1035;
        if (item.unit === 'dwt') grams = item.weight * 1.55517;

        if (item.category === 'Gold') {
          if (tx.type === 'BUY') goldPurchasedGrams += grams;
          else goldSoldGrams += grams;
        } else if (item.category === 'Silver') {
          silverPurchasedGrams += grams;
        } else if (item.category === 'Platinum') {
          platinumPurchasedGrams += grams;
        }
      });
    });

    // Category Value Breakdown
    const categoryBreakdown: Record<string, { count: number; buyValue: number; sellValue: number }> = {};
    validTx.forEach((tx) => {
      tx.items.forEach((item) => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = { count: 0, buyValue: 0, sellValue: 0 };
        }
        categoryBreakdown[item.category].count += item.quantity;
        if (tx.type === 'BUY') {
          categoryBreakdown[item.category].buyValue += item.totalPrice;
        } else {
          categoryBreakdown[item.category].sellValue += item.totalPrice;
        }
      });
    });

    // Payment Method Breakdown
    const paymentBreakdown: Record<string, { count: number; total: number }> = {};
    validTx.forEach((tx) => {
      const method = tx.payment.method;
      if (!paymentBreakdown[method]) {
        paymentBreakdown[method] = { count: 0, total: 0 };
      }
      paymentBreakdown[method].count += 1;
      paymentBreakdown[method].total += tx.finalTotal;
    });

    // Employee Performance Leaderboard
    const employeePerformance: Record<string, { name: string; count: number; totalValue: number; buyValue: number; sellValue: number }> = {};
    validTx.forEach((tx) => {
      if (!employeePerformance[tx.employeeId]) {
        employeePerformance[tx.employeeId] = {
          name: tx.employeeName,
          count: 0,
          totalValue: 0,
          buyValue: 0,
          sellValue: 0,
        };
      }
      employeePerformance[tx.employeeId].count += 1;
      employeePerformance[tx.employeeId].totalValue += tx.finalTotal;
      if (tx.type === 'BUY') employeePerformance[tx.employeeId].buyValue += tx.finalTotal;
      else employeePerformance[tx.employeeId].sellValue += tx.finalTotal;
    });

    // Monthly Trend Data (Last 12 months)
    const monthlyTrends: Array<{ month: string; buy: number; sell: number; count: number }> = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 11; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      const monthTx = this.transactions.filter((tx) => {
        if (tx.status !== 'COMPLETED') return false;
        const txDate = new Date(tx.transactionDate);
        return txDate.getFullYear() === d.getFullYear() && txDate.getMonth() === d.getMonth();
      });

      const buyVal = monthTx.filter((t) => t.type === 'BUY').reduce((acc, t) => acc + t.finalTotal, 0);
      const sellVal = monthTx.filter((t) => t.type === 'SELL').reduce((acc, t) => acc + t.finalTotal, 0);

      monthlyTrends.push({
        month: label,
        buy: +buyVal.toFixed(2),
        sell: +sellVal.toFixed(2),
        count: monthTx.length,
      });
    }

    return {
      totalCustomers: this.customers.length,
      activeEmployees: this.users.filter((u) => u.status === 'ACTIVE' && u.role === 'EMPLOYEE').length,
      todayTransactionsCount: todayTx.length,
      todayBuyAmount,
      todaySellAmount,
      totalTransactions,
      totalVolume,
      totalBuyValue,
      totalSellValue,
      goldPurchasedGrams: +goldPurchasedGrams.toFixed(1),
      goldPurchasedOz: +(goldPurchasedGrams / 31.1035).toFixed(2),
      goldSoldGrams: +goldSoldGrams.toFixed(1),
      goldSoldOz: +(goldSoldGrams / 31.1035).toFixed(2),
      silverPurchasedOz: +(silverPurchasedGrams / 31.1035).toFixed(2),
      platinumPurchasedGrams: +platinumPurchasedGrams.toFixed(1),
      categoryBreakdown,
      paymentBreakdown,
      employeePerformance: Object.values(employeePerformance).sort((a, b) => b.totalValue - a.totalValue),
      monthlyTrends,
    };
  }
}

export const DemoRepository = new DemoRepositorySingleton();
