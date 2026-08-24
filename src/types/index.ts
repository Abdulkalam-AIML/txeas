export type Role = 'SUPER_ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  employeeCode?: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  locationId: string;
  locationName: string;
  status: 'ACTIVE' | 'DISABLED';
  joinedDate: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface Customer {
  id: string; // e.g. TGB-CUS-000001
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  idType: 'Drivers License' | 'Passport' | 'State ID' | 'Military ID' | 'Other';
  idNumber: string;
  dateOfBirth?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  totalTransactionsCount?: number;
  totalBuyAmount?: number;
  totalSellAmount?: number;
}

export type TransactionType = 'BUY' | 'SELL';

export type MetalCategory = 
  | 'Gold'
  | 'Silver'
  | 'Diamond'
  | 'Platinum'
  | 'Watches'
  | 'Coins & Currency'
  | 'Collectibles'
  | 'Other';

export interface PredefinedMenuItem {
  id: string;
  category: MetalCategory;
  name: string;
  defaultMaterial: string;
  defaultPurity: string;
  typicalUnit: 'g' | 'oz' | 'dwt' | 'ct' | 'pcs';
  estPricePerUnit?: number;
  description?: string;
}

export interface ItemImage {
  id: string;
  url: string;
  tag: 'Front' | 'Back' | 'Close-up' | 'Hallmark' | 'General';
  fileName: string;
  uploadedAt: string;
}

export interface PaymentEntry {
  id: string;
  method: 'Cash' | 'Card' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Other';
  amount: number;
  referenceNumber?: string;
  notes?: string;
}

export interface TransactionItem {
  id: string;
  isCustom: boolean;
  category: MetalCategory;
  name: string;
  itemType?: string; // e.g. Gold Ring, Gold Chain, etc.
  description?: string;
  material?: string;
  purity: string;   // e.g. 24K, 22K, 20K, 18K, 14K, 10K, Custom
  weight: number;   // numeric weight in grams
  unit: 'g' | 'oz' | 'dwt' | 'ct' | 'pcs';
  quantity: number;
  ratePerGram?: number;
  estimatedMarketValue: number; // based on current spot/market rates
  offeredUnitPrice: number;    // agreed unit buy/sell price
  totalPrice: number;          // quantity * offeredUnitPrice
  notes?: string;
  imageUrl?: string;
  images: ItemImage[];
}

export type PaymentMethod = 'CASH' | 'CARD' | 'CHEQUE' | 'WIRE' | 'STORE_CREDIT' | 'Cash' | 'Card' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Other';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  referenceNumber: string;
  paidAt: string;
  notes?: string;
  cardLast4?: string;
  cardType?: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Debit';
  cardAuthCode?: string;
  chequeNumber?: string;
  bankName?: string;
  chequeDate?: string;
}

export interface Transaction {
  id: string; // e.g. TGB-2026-000001
  invoiceNumber: string; // e.g. INV-2026-000001
  type: TransactionType; // 'BUY' | 'SELL'
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  transactionDate: string; // ISO string e.g. 2026-08-24T10:30:00Z
  status: 'COMPLETED' | 'VOIDED' | 'PENDING';
  items: TransactionItem[];
  subtotal: number;
  discountOrAdjustment: number;
  taxRatePercent: number;
  taxAmount: number;
  finalTotal: number;
  marginPercent?: number;
  marginAmount?: number;
  profit?: number;
  imageUrl?: string;
  payments?: PaymentEntry[];
  payment: PaymentDetails;
  notes?: string;
  termsAccepted: boolean;
  customerSignature?: string;
  employeeSignature?: string;
  createdAt: string;
  updatedAt: string;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: 
    | 'LOGIN' 
    | 'LOGOUT' 
    | 'CUSTOMER_CREATED' 
    | 'CUSTOMER_UPDATED' 
    | 'TRANSACTION_CREATED' 
    | 'TRANSACTION_UPDATED' 
    | 'TRANSACTION_VOIDED' 
    | 'EMPLOYEE_CREATED' 
    | 'EMPLOYEE_UPDATED' 
    | 'EMPLOYEE_DISABLED' 
    | 'INVOICE_GENERATED' 
    | 'REPORT_GENERATED' 
    | 'SETTINGS_UPDATED' 
    | 'ITEM_CREATED' 
    | 'MENU_UPDATED';
  entity: 'TRANSACTION' | 'CUSTOMER' | 'EMPLOYEE' | 'INVOICE' | 'REPORT' | 'SETTINGS' | 'AUTH' | 'ITEM';
  entityId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  beforeState?: any;
  afterState?: any;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface SpotPrices {
  goldOz: number;
  silverOz: number;
  platinumOz: number;
  palladiumOz: number;
  updatedAt: string;
  changeGold24h: number;
  changeSilver24h: number;
  changePlatinum24h: number;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  locationId?: string;
  transactionType?: 'ALL' | 'BUY' | 'SELL';
  category?: string;
  paymentMethod?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
}
