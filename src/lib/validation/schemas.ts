import { z } from 'zod';

export const customerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  mobileNumber: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required').or(z.literal('')),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required').default('Dallas'),
  state: z.string().length(2, 'State code must be 2 letters').default('TX'),
  zipCode: z.string().min(5, 'Valid 5-digit zip code required'),
  idType: z.enum(['Drivers License', 'Passport', 'State ID', 'Military ID', 'Other']),
  idNumber: z.string().min(4, 'Government ID number is required'),
  dateOfBirth: z.string().optional(),
  notes: z.string().optional(),
});

export const itemImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  tag: z.enum(['Front', 'Back', 'Close-up', 'Hallmark', 'General']),
  fileName: z.string(),
  uploadedAt: z.string(),
});

export const transactionItemSchema = z.object({
  id: z.string(),
  isCustom: z.boolean().default(false),
  category: z.enum(['Gold', 'Silver', 'Diamond', 'Platinum', 'Watches', 'Coins & Currency', 'Collectibles', 'Other']),
  name: z.string().min(2, 'Item name is required'),
  description: z.string().optional(),
  material: z.string().min(1, 'Material is required'),
  purity: z.string().min(1, 'Purity is required'),
  weight: z.number().positive('Weight must be greater than zero'),
  unit: z.enum(['g', 'oz', 'dwt', 'ct', 'pcs']),
  quantity: z.number().int().positive().default(1),
  estimatedMarketValue: z.number().nonnegative(),
  offeredUnitPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  notes: z.string().optional(),
  images: z.array(itemImageSchema).default([]),
});

export const paymentDetailsSchema = z.object({
  method: z.enum(['CASH', 'CARD', 'CHEQUE', 'WIRE', 'STORE_CREDIT']),
  amount: z.number().positive('Payment amount must be greater than zero'),
  status: z.enum(['COMPLETED', 'PENDING', 'REFUNDED']).default('COMPLETED'),
  referenceNumber: z.string().min(1, 'Reference number is required'),
  paidAt: z.string(),
  notes: z.string().optional(),
  cardLast4: z.string().length(4, 'Card last 4 digits required').optional(),
  cardType: z.enum(['Visa', 'Mastercard', 'Amex', 'Discover', 'Debit']).optional(),
  cardAuthCode: z.string().optional(),
  chequeNumber: z.string().optional(),
  bankName: z.string().optional(),
  chequeDate: z.string().optional(),
});

export const employeeCreateSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid business email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  role: z.enum(['SUPER_ADMIN', 'EMPLOYEE']).default('EMPLOYEE'),
  locationId: z.string().min(1, 'Location is required'),
  locationName: z.string().min(1, 'Location name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const quoteRequestSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.string().email('Email is required').optional(),
  itemCategory: z.string().min(1, 'Category is required'),
  approxWeight: z.string().optional(),
  description: z.string().optional(),
  preferredLocation: z.string().optional(),
});
