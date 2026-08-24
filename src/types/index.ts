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

export interface TransactionItem {
  id: string;
  isCustom: boolean;
  category: MetalCategory;
  name: string;
  description?: string;
  material: string; // e.g. 14K Yellow Gold, 999 Fine Silver, Platinum
  purity: string;   // e.g. 14K (58.5%), 24K (99.9%), 925 Sterling, VVS1/G
  weight: number;   // numeric weight
  unit: 'g' | 'oz' | 'dwt' | 'ct' | 'pcs';
  quantity: number;
  estimatedMarketValue: number; // based on current spot/market rates
  offeredUnitPrice: number;    // agreed unit buy/sell price
  totalPrice: number;          // quantity * offeredUnitPrice
  notes?: string;
  images: ItemImage[];
}

export type PaymentMethod = 'CASH' | 'CARD' | 'CHEQUE' | 'WIRE' | 'STORE_CREDIT';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  referenceNumber: string;
  paidAt: string;
  notes?: string;
  // Card specific (safe only, no CVV or full PAN)
  cardLast4?: string;
  cardType?: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Debit';
  cardAuthCode?: string;
  // Cheque specific
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
  payment: PaymentDetails;
  notes?: string;
  termsAccepted: boolean;
  customerSignature?: string; // data URL / typed
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
