import { User, Customer, PredefinedMenuItem, Transaction, TransactionItem, AuditLog, Location, SpotPrices, ItemImage } from '@/types';

export const INITIAL_SPOT_PRICES: SpotPrices = {
  goldOz: 2514.80,
  silverOz: 29.45,
  platinumOz: 982.10,
  palladiumOz: 948.30,
  updatedAt: new Date().toISOString(),
  changeGold24h: 18.50,
  changeSilver24h: 0.42,
  changePlatinum24h: -4.20,
};

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'LOC-01',
    name: 'Dallas Flagship — Uptown',
    address: '2600 McKinney Ave, Suite 400',
    city: 'Dallas',
    state: 'TX',
    zip: '75204',
    phone: '(214) 555-GOLD (4653)',
    email: 'dallas@texasgoldbuyers.com',
    isPrimary: true,
  },
  {
    id: 'LOC-02',
    name: 'Houston Galleria Store',
    address: '5085 Westheimer Rd, Suite 2200',
    city: 'Houston',
    state: 'TX',
    zip: '77056',
    phone: '(713) 555-GOLD (4653)',
    email: 'houston@texasgoldbuyers.com',
    isPrimary: false,
  },
  {
    id: 'LOC-03',
    name: 'Austin Domain Branch',
    address: '11410 Century Oaks Terrace',
    city: 'Austin',
    state: 'TX',
    zip: '78758',
    phone: '(512) 555-GOLD (4653)',
    email: 'austin@texasgoldbuyers.com',
    isPrimary: false,
  },
  {
    id: 'LOC-04',
    name: 'San Antonio — Riverwalk',
    address: '849 E Commerce St',
    city: 'San Antonio',
    state: 'TX',
    zip: '78205',
    phone: '(210) 555-GOLD (4653)',
    email: 'sanantonio@texasgoldbuyers.com',
    isPrimary: false,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Alexander Sterling',
    email: 'admin@texasgoldbuyers.com',
    phone: '(214) 555-0100',
    role: 'SUPER_ADMIN',
    locationId: 'LOC-01',
    locationName: 'Dallas Flagship — Uptown',
    status: 'ACTIVE',
    joinedDate: '2023-01-10T08:00:00Z',
    lastLogin: '2026-08-24T09:15:00Z',
  },
  {
    id: 'USR-002',
    name: 'Michael Alvarez',
    email: 'employee@texasgoldbuyers.com',
    phone: '(214) 555-0144',
    role: 'EMPLOYEE',
    locationId: 'LOC-01',
    locationName: 'Dallas Flagship — Uptown',
    status: 'ACTIVE',
    joinedDate: '2023-04-15T09:00:00Z',
    lastLogin: '2026-08-24T08:45:00Z',
  },
  {
    id: 'USR-003',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@texasgoldbuyers.com',
    phone: '(713) 555-0192',
    role: 'EMPLOYEE',
    locationId: 'LOC-02',
    locationName: 'Houston Galleria Store',
    status: 'ACTIVE',
    joinedDate: '2023-08-01T09:00:00Z',
    lastLogin: '2026-08-23T16:20:00Z',
  },
  {
    id: 'USR-004',
    name: 'Marcus Vance',
    email: 'marcus.vance@texasgoldbuyers.com',
    phone: '(512) 555-0231',
    role: 'EMPLOYEE',
    locationId: 'LOC-03',
    locationName: 'Austin Domain Branch',
    status: 'ACTIVE',
    joinedDate: '2024-02-10T08:30:00Z',
    lastLogin: '2026-08-24T07:50:00Z',
  },
  {
    id: 'USR-005',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@texasgoldbuyers.com',
    phone: '(210) 555-0377',
    role: 'EMPLOYEE',
    locationId: 'LOC-04',
    locationName: 'San Antonio — Riverwalk',
    status: 'ACTIVE',
    joinedDate: '2024-06-18T09:00:00Z',
    lastLogin: '2026-08-22T17:10:00Z',
  },
  {
    id: 'USR-006',
    name: 'David Chen',
    email: 'david.chen@texasgoldbuyers.com',
    phone: '(214) 555-0488',
    role: 'EMPLOYEE',
    locationId: 'LOC-01',
    locationName: 'Dallas Flagship — Uptown',
    status: 'ACTIVE',
    joinedDate: '2024-09-01T08:00:00Z',
    lastLogin: '2026-08-24T08:10:00Z',
  },
];

export const INITIAL_PREDEFINED_ITEMS: PredefinedMenuItem[] = [
  // Gold
  { id: 'MENU-G-01', category: 'Gold', name: 'Gold Ring', defaultMaterial: '14K Yellow Gold', defaultPurity: '14K (58.5%)', typicalUnit: 'g', estPricePerUnit: 52.0 },
  { id: 'MENU-G-02', category: 'Gold', name: 'Gold Chain', defaultMaterial: '14K Yellow Gold', defaultPurity: '14K (58.5%)', typicalUnit: 'g', estPricePerUnit: 52.0 },
  { id: 'MENU-G-03', category: 'Gold', name: 'Gold Bracelet', defaultMaterial: '18K Yellow Gold', defaultPurity: '18K (75.0%)', typicalUnit: 'g', estPricePerUnit: 66.5 },
  { id: 'MENU-G-04', category: 'Gold', name: 'Gold Necklace', defaultMaterial: '14K White Gold', defaultPurity: '14K (58.5%)', typicalUnit: 'g', estPricePerUnit: 52.0 },
  { id: 'MENU-G-05', category: 'Gold', name: 'Gold Earrings', defaultMaterial: '14K Yellow Gold', defaultPurity: '14K (58.5%)', typicalUnit: 'g', estPricePerUnit: 52.0 },
  { id: 'MENU-G-06', category: 'Gold', name: 'Gold Coin (1 oz American Eagle)', defaultMaterial: '22K Gold Bullion', defaultPurity: '22K (91.67%)', typicalUnit: 'oz', estPricePerUnit: 2450.0 },
  { id: 'MENU-G-07', category: 'Gold', name: 'Gold Bar (1 oz .9999)', defaultMaterial: '24K Fine Gold', defaultPurity: '24K (99.99%)', typicalUnit: 'oz', estPricePerUnit: 2490.0 },
  { id: 'MENU-G-08', category: 'Gold', name: 'Gold Pendant', defaultMaterial: '14K Yellow Gold', defaultPurity: '14K (58.5%)', typicalUnit: 'g', estPricePerUnit: 52.0 },
  { id: 'MENU-G-09', category: 'Gold', name: 'Gold Bangle', defaultMaterial: '22K Indian Gold', defaultPurity: '22K (91.6%)', typicalUnit: 'g', estPricePerUnit: 78.0 },
  { id: 'MENU-G-10', category: 'Gold', name: 'Gold Scrap / Melt Lot', defaultMaterial: 'Mixed Karat Gold', defaultPurity: '10K-18K Assorted', typicalUnit: 'dwt', estPricePerUnit: 68.0 },

  // Silver
  { id: 'MENU-S-01', category: 'Silver', name: 'Silver Ring', defaultMaterial: '925 Sterling Silver', defaultPurity: '92.5%', typicalUnit: 'g', estPricePerUnit: 0.85 },
  { id: 'MENU-S-02', category: 'Silver', name: 'Silver Chain', defaultMaterial: '925 Sterling Silver', defaultPurity: '92.5%', typicalUnit: 'g', estPricePerUnit: 0.85 },
  { id: 'MENU-S-03', category: 'Silver', name: 'Silver Bracelet', defaultMaterial: '925 Sterling Silver', defaultPurity: '92.5%', typicalUnit: 'g', estPricePerUnit: 0.85 },
  { id: 'MENU-S-04', category: 'Silver', name: 'Silver Coin (1 oz Silver Eagle)', defaultMaterial: '999 Fine Silver', defaultPurity: '99.9%', typicalUnit: 'oz', estPricePerUnit: 28.5 },
  { id: 'MENU-S-05', category: 'Silver', name: 'Silver Bar (10 oz Fine Silver)', defaultMaterial: '999 Fine Silver', defaultPurity: '99.9%', typicalUnit: 'oz', estPricePerUnit: 28.0 },
  { id: 'MENU-S-06', category: 'Silver', name: 'Sterling Silver Flatware / Hollowware', defaultMaterial: '925 Sterling Silver', defaultPurity: '92.5%', typicalUnit: 'oz', estPricePerUnit: 25.5 },
  { id: 'MENU-S-07', category: 'Silver', name: 'Silver Scrap Lot', defaultMaterial: 'Mixed Silver', defaultPurity: '80%-92.5%', typicalUnit: 'oz', estPricePerUnit: 24.0 },

  // Diamond
  { id: 'MENU-D-01', category: 'Diamond', name: 'Diamond Solitaire Ring', defaultMaterial: '14K Gold + Natural Diamond', defaultPurity: 'VS2 / F Color', typicalUnit: 'ct', estPricePerUnit: 2200.0 },
  { id: 'MENU-D-02', category: 'Diamond', name: 'Diamond Tennis Bracelet', defaultMaterial: '18K White Gold + Diamonds', defaultPurity: 'SI1 / G-H Color 5.0ctw', typicalUnit: 'ct', estPricePerUnit: 950.0 },
  { id: 'MENU-D-03', category: 'Diamond', name: 'Diamond Stud Earrings', defaultMaterial: '14K White Gold + Diamonds', defaultPurity: 'VVS2 / E Color 1.5ctw', typicalUnit: 'ct', estPricePerUnit: 1800.0 },
  { id: 'MENU-D-04', category: 'Diamond', name: 'Diamond Necklace / Choker', defaultMaterial: '18K White Gold + Diamonds', defaultPurity: 'VS1 / F Color', typicalUnit: 'ct', estPricePerUnit: 1400.0 },
  { id: 'MENU-D-05', category: 'Diamond', name: 'Loose Certified Diamond (GIA)', defaultMaterial: 'Natural Diamond', defaultPurity: 'VVS1 / D Color Round Cut', typicalUnit: 'ct', estPricePerUnit: 4500.0 },
  { id: 'MENU-D-06', category: 'Diamond', name: 'Diamond Jewelry Estate Lot', defaultMaterial: 'Mixed Gold & Diamonds', defaultPurity: 'Mixed Estate Grades', typicalUnit: 'pcs', estPricePerUnit: 1250.0 },

  // Platinum
  { id: 'MENU-P-01', category: 'Platinum', name: 'Platinum Ring / Band', defaultMaterial: '950 Platinum', defaultPurity: '95.0%', typicalUnit: 'g', estPricePerUnit: 29.5 },
  { id: 'MENU-P-02', category: 'Platinum', name: 'Platinum Chain', defaultMaterial: '950 Platinum', defaultPurity: '95.0%', typicalUnit: 'g', estPricePerUnit: 29.5 },
  { id: 'MENU-P-03', category: 'Platinum', name: 'Platinum Bracelet', defaultMaterial: '950 Platinum', defaultPurity: '95.0%', typicalUnit: 'g', estPricePerUnit: 29.5 },
  { id: 'MENU-P-04', category: 'Platinum', name: 'Platinum Coin (1 oz Platypus/Eagle)', defaultMaterial: '9995 Fine Platinum', defaultPurity: '99.95%', typicalUnit: 'oz', estPricePerUnit: 960.0 },
  { id: 'MENU-P-05', category: 'Platinum', name: 'Platinum Jewelry Estate Piece', defaultMaterial: '950 Platinum', defaultPurity: '95.0%', typicalUnit: 'g', estPricePerUnit: 31.0 },

  // Watches
  { id: 'MENU-W-01', category: 'Watches', name: 'Rolex Submariner Date', defaultMaterial: 'Oystersteel / Cerachrom', defaultPurity: 'Swiss Automatic', typicalUnit: 'pcs', estPricePerUnit: 11500.0 },
  { id: 'MENU-W-02', category: 'Watches', name: 'Rolex Day-Date 40 Presidential', defaultMaterial: '18K Yellow Gold', defaultPurity: '18K Gold Swiss', typicalUnit: 'pcs', estPricePerUnit: 34000.0 },
  { id: 'MENU-W-03', category: 'Watches', name: 'Cartier Santos de Cartier', defaultMaterial: 'Stainless Steel / 18K Bezel', defaultPurity: 'Automatic Caliber', typicalUnit: 'pcs', estPricePerUnit: 6800.0 },
  { id: 'MENU-W-04', category: 'Watches', name: 'Omega Speedmaster Professional', defaultMaterial: 'Stainless Steel / Hesalite', defaultPurity: 'Manual Wind Chrono', typicalUnit: 'pcs', estPricePerUnit: 5200.0 },
  { id: 'MENU-W-05', category: 'Watches', name: 'Patek Philippe Calatrava / Nautilus', defaultMaterial: '18K Rose Gold / Steel', defaultPurity: 'Grand Complication', typicalUnit: 'pcs', estPricePerUnit: 42000.0 },
  { id: 'MENU-W-06', category: 'Watches', name: 'Other Luxury Timepiece (Breitling/Audemars)', defaultMaterial: 'Precious Metal / Steel', defaultPurity: 'Swiss Chronometer', typicalUnit: 'pcs', estPricePerUnit: 4500.0 },

  // Coins & Currency
  { id: 'MENU-C-01', category: 'Coins & Currency', name: 'Pre-1933 $20 Saint-Gaudens Double Eagle', defaultMaterial: '90% Gold / 10% Copper', defaultPurity: '0.9675 oz AGW', typicalUnit: 'pcs', estPricePerUnit: 2550.0 },
  { id: 'MENU-C-02', category: 'Coins & Currency', name: 'Morgan Silver Dollar (1878-1921 MS63+)', defaultMaterial: '90% Silver', defaultPurity: '0.7734 oz ASW', typicalUnit: 'pcs', estPricePerUnit: 65.0 },
  { id: 'MENU-C-03', category: 'Coins & Currency', name: 'Rare US Currency (Large Size / Gold Certificate)', defaultMaterial: 'Paper / Linen Currency', defaultPurity: 'Crisp Uncirculated / Fine', typicalUnit: 'pcs', estPricePerUnit: 450.0 },
  { id: 'MENU-C-04', category: 'Coins & Currency', name: 'Graded NGC/PCGS Ancient Gold/Silver Stater', defaultMaterial: 'Ancient Electrum / Gold', defaultPurity: 'Ch XF / Strike 5/5', typicalUnit: 'pcs', estPricePerUnit: 1400.0 },

  // Collectibles
  { id: 'MENU-COL-01', category: 'Collectibles', name: 'High-Grade Vintage Sports Card (PSA Graded)', defaultMaterial: 'Vintage Cardboard', defaultPurity: 'PSA 8/9/10 Gem Mint', typicalUnit: 'pcs', estPricePerUnit: 1200.0 },
  { id: 'MENU-COL-02', category: 'Collectibles', name: '1st Edition Pokémon Holographic Card', defaultMaterial: 'Vintage WotC Cardstock', defaultPurity: 'CGC / PSA Graded', typicalUnit: 'pcs', estPricePerUnit: 850.0 },
  { id: 'MENU-COL-03', category: 'Collectibles', name: 'Golden/Silver Age Graded Comic Book (CGC)', defaultMaterial: 'Vintage Newsprint Comic', defaultPurity: 'CGC 9.2+ Universal', typicalUnit: 'pcs', estPricePerUnit: 1600.0 },
  { id: 'MENU-COL-04', category: 'Collectibles', name: 'Fine Texas Antique & Historical Memorabilia', defaultMaterial: 'Bronze / Silver / Relic', defaultPurity: 'Authentic Certified', typicalUnit: 'pcs', estPricePerUnit: 900.0 },
];

// Helper to generate SVG placeholder data URLs for realistic item images
export function generateItemPlaceholderDataUrl(category: string, title: string, tag: string): string {
  const bgColors: Record<string, string> = {
    Gold: '#1a1608',
    Silver: '#10171d',
    Diamond: '#0d1c26',
    Platinum: '#141a20',
    Watches: '#121218',
    'Coins & Currency': '#18150c',
    Collectibles: '#161214',
  };
  const bg = bgColors[category] || '#0d151f';
  const accent = '#C99A3E';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${bg}" />
    <rect x="12" y="12" width="376" height="276" rx="8" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="4 4"/>
    <circle cx="200" cy="115" r="50" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="2"/>
    <text x="200" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="${accent}" text-anchor="middle">TGB</text>
    <text x="200" y="195" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">${title.slice(0, 30)}</text>
    <rect x="140" y="215" width="120" height="24" rx="12" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1"/>
    <text x="200" y="231" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="${accent}" text-anchor="middle">VIEW: ${tag.toUpperCase()}</text>
    <text x="200" y="270" font-family="system-ui, sans-serif" font-size="10" fill="#8A9BA8" text-anchor="middle">TEXAS GOLD BUYERS • HIGH-RES DEMO CAPTURE</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Seed generation function for 110+ customers and 350+ transactions
export function generateSeedCustomers(): Customer[] {
  const firstNames = [
    'William', 'James', 'Charles', 'Robert', 'David', 'Richard', 'Thomas', 'Christopher', 'Daniel', 'Matthew',
    'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Nancy', 'Margaret', 'Lisa', 'Betty', 'Dorothy', 'Sandra', 'Ashley', 'Kimberly', 'Donna', 'Emily',
    'Austin', 'Travis', 'Houston', 'Dallas', 'Colt', 'Wyatt', 'Beau', 'Garrett', 'Hunter', 'Cody'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
  ];
  const texasCities = [
    { city: 'Dallas', zip: '75201', state: 'TX' },
    { city: 'Houston', zip: '77002', state: 'TX' },
    { city: 'Austin', zip: '78701', state: 'TX' },
    { city: 'San Antonio', zip: '78205', state: 'TX' },
    { city: 'Fort Worth', zip: '76102', state: 'TX' },
    { city: 'Plano', zip: '75024', state: 'TX' },
    { city: 'Frisco', zip: '75034', state: 'TX' },
    { city: 'Arlington', zip: '76011', state: 'TX' },
    { city: 'The Woodlands', zip: '77380', state: 'TX' },
    { city: 'Sugar Land', zip: '77479', state: 'TX' },
  ];
  const streetNames = ['Lone Star Blvd', 'Preston Rd', 'Westheimer Pkwy', 'Congress Ave', 'Alamo Plaza', 'Hill Country Way', 'Legacy Dr', 'Rodeo Trail', 'Bluebonnet Lane', 'Pecan Grove Rd'];

  const customers: Customer[] = [];

  for (let i = 1; i <= 120; i++) {
    const fn = firstNames[(i * 7) % firstNames.length];
    const ln = lastNames[(i * 11) % lastNames.length];
    const cityObj = texasCities[i % texasCities.length];
    const streetNum = 1000 + (i * 37) % 8900;
    const street = streetNames[i % streetNames.length];
    const idPad = String(i).padStart(6, '0');
    const phone = `(${210 + (i % 4) * 4})(555-${String(1000 + i * 19).slice(-4)})`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i % 5 === 0 ? i : ''}@gmail.com`;

    // Spread registration from 2023 to 2026
    const year = i < 30 ? 2024 : i < 80 ? 2025 : 2026;
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');
    const createdAt = `${year}-${month}-${day}T10:${String(i % 60).padStart(2, '0')}:00Z`;

    customers.push({
      id: `TGB-CUS-${idPad}`,
      fullName: `${fn} ${ln}`,
      mobileNumber: phone,
      email: email,
      address: `${streetNum} ${street}`,
      city: cityObj.city,
      state: 'TX',
      zipCode: cityObj.zip,
      idType: i % 10 === 0 ? 'Passport' : 'Drivers License',
      idNumber: `TX-DL-${String(84900000 + i * 1432).slice(0, 8)}`,
      dateOfBirth: `19${60 + (i % 38)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
      notes: i % 4 === 0 ? 'VIP Collector. Prefers bullion and high-end Swiss timepieces.' : 'Local estate seller.',
      createdAt,
      updatedAt: createdAt,
      totalTransactionsCount: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
    });
  }

  return customers;
}

export function generateSeedTransactions(customers: Customer[], employees: User[]): { transactions: Transaction[]; auditLogs: AuditLog[] } {
  const transactions: Transaction[] = [];
  const auditLogs: AuditLog[] = [];

  const paymentMethods: Array<'CASH' | 'CARD' | 'CHEQUE' | 'WIRE'> = ['CASH', 'CARD', 'CHEQUE', 'WIRE'];
  const cardTypes: Array<'Visa' | 'Mastercard' | 'Amex' | 'Discover'> = ['Visa', 'Mastercard', 'Amex', 'Discover'];
  const banks = ['JPMorgan Chase Texas', 'Bank of America Texas', 'Frost Bank', 'Wells Fargo TX', 'PNC Bank Dallas'];

  let txCounter = 1;

  // We will generate 350 transactions across 2024, 2025, and 2026
  for (let i = 0; i < 360; i++) {
    const customer = customers[i % customers.length];
    const employee = employees[i % employees.length];
    const isBuy = i % 4 !== 3; // 75% BUY, 25% SELL (typical gold buyer profile)
    const type = isBuy ? 'BUY' : 'SELL';

    // Year distribution:
    // 0 - 80 => 2024
    // 81 - 220 => 2025
    // 221 - 359 => 2026
    let year = 2026;
    if (i < 90) year = 2024;
    else if (i < 240) year = 2025;

    const monthNum = 1 + (i % 12);
    const month = String(monthNum).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');
    const hour = String(9 + (i % 9)).padStart(2, '0');
    const min = String((i * 17) % 60).padStart(2, '0');
    const txDate = `${year}-${month}-${day}T${hour}:${min}:00Z`;

    const txId = `TGB-${year}-${String(txCounter).padStart(6, '0')}`;
    const invoiceId = `INV-${year}-${String(txCounter).padStart(6, '0')}`;

    // Item count per transaction: 1 to 6 items!
    const itemCount = 1 + (i % 5);
    const items: TransactionItem[] = [];
    let subtotal = 0;

    for (let k = 0; k < itemCount; k++) {
      const menuIndex = (i * 3 + k * 7) % INITIAL_PREDEFINED_ITEMS.length;
      const isCustomItem = k === 2 && (i % 3 === 0);
      const menuItem = INITIAL_PREDEFINED_ITEMS[menuIndex];

      let itemName = menuItem.name;
      let category = menuItem.category;
      let material = menuItem.defaultMaterial;
      let purity = menuItem.defaultPurity;
      let unit = menuItem.typicalUnit;
      let weight = 1;
      let unitPrice = menuItem.estPricePerUnit || 100;
      let qty = 1;

      if (isCustomItem) {
        itemName = `Custom Estate ${category} Piece #${k + 1}`;
        material = 'Handcrafted 18K / Platinum Estate Alloy';
        purity = '18K Custom (750 Fine)';
        weight = 18.5 + (k * 4.2);
        unit = 'g';
        unitPrice = 72.0;
        qty = 1;
      } else if (unit === 'g') {
        weight = +(5 + ((i + k * 11) % 45) + ((i % 10) * 0.4)).toFixed(1);
      } else if (unit === 'oz') {
        weight = +(1 + (k % 4)).toFixed(2);
      } else if (unit === 'ct') {
        weight = +(0.8 + ((i + k) % 5) * 0.75).toFixed(2);
      }

      const totalItemPrice = +(qty * unitPrice * (unit === 'g' || unit === 'oz' || unit === 'ct' ? weight : 1)).toFixed(2);
      subtotal += totalItemPrice;

      // Realistic multi-angle image previews
      const views: Array<'Front' | 'Back' | 'Close-up' | 'Hallmark'> = ['Front', 'Back', 'Close-up', 'Hallmark'];
      const images: ItemImage[] = views.slice(0, 2 + (k % 3)).map((view, vIdx) => ({
        id: `IMG-${txId}-${k + 1}-${vIdx + 1}`,
        url: generateItemPlaceholderDataUrl(category, itemName, view),
        tag: view,
        fileName: `${itemName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${view.toLowerCase()}.jpg`,
        uploadedAt: txDate,
      }));

      items.push({
        id: `ITEM-${txId}-${k + 1}`,
        isCustom: isCustomItem,
        category,
        name: itemName,
        description: `Verified in store. Standard purity assay passed via XRF Spectrometer.`,
        material,
        purity,
        weight,
        unit,
        quantity: qty,
        estimatedMarketValue: +(totalItemPrice * 1.15).toFixed(2),
        offeredUnitPrice: unitPrice,
        totalPrice: totalItemPrice,
        notes: k === 0 ? 'Assayed with Olympus GoldXpert XRF.' : undefined,
        images,
      });
    }

    subtotal = +subtotal.toFixed(2);
    const discountOrAdjustment = i % 8 === 0 ? -50.0 : 0;
    const taxRatePercent = type === 'SELL' ? 8.25 : 0; // In TX, bullion/scrap buy is zero sales tax; retail sell has tax
    const taxAmount = +(type === 'SELL' ? (subtotal + discountOrAdjustment) * (taxRatePercent / 100) : 0).toFixed(2);
    const finalTotal = +(subtotal + discountOrAdjustment + taxAmount).toFixed(2);

    const pMethod = paymentMethods[i % paymentMethods.length];
    const isVoided = i === 42 || i === 188; // Exactly 2 voided records for demonstration

    transactions.push({
      id: txId,
      invoiceNumber: invoiceId,
      type,
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.mobileNumber,
      customerEmail: customer.email,
      customerAddress: customer.address,
      employeeId: employee.id,
      employeeName: employee.name,
      locationId: employee.locationId,
      locationName: employee.locationName,
      transactionDate: txDate,
      status: isVoided ? 'VOIDED' : 'COMPLETED',
      items,
      subtotal,
      discountOrAdjustment,
      taxRatePercent,
      taxAmount,
      finalTotal,
      payment: {
        method: pMethod,
        amount: finalTotal,
        status: isVoided ? 'REFUNDED' : 'COMPLETED',
        referenceNumber: `REF-${year}-${100000 + i * 3}`,
        paidAt: txDate,
        cardLast4: pMethod === 'CARD' ? String(1000 + (i * 73) % 9000) : undefined,
        cardType: pMethod === 'CARD' ? cardTypes[i % cardTypes.length] : undefined,
        cardAuthCode: pMethod === 'CARD' ? `AUTH-${900000 + i}` : undefined,
        chequeNumber: pMethod === 'CHEQUE' ? String(4000 + i * 7) : undefined,
        bankName: pMethod === 'CHEQUE' ? banks[i % banks.length] : undefined,
        chequeDate: pMethod === 'CHEQUE' ? txDate.split('T')[0] : undefined,
      },
      notes: `In-store counter evaluation at ${employee.locationName}. Verified ID and customer intake.`,
      termsAccepted: true,
      createdAt: txDate,
      updatedAt: txDate,
      voidReason: isVoided ? 'Customer requested test transaction cancellation prior to vault transfer.' : undefined,
      voidedBy: isVoided ? 'USR-001' : undefined,
      voidedAt: isVoided ? txDate : undefined,
    });

    // Update customer stats
    if (!isVoided) {
      customer.totalTransactionsCount = (customer.totalTransactionsCount || 0) + 1;
      if (type === 'BUY') {
        customer.totalBuyAmount = +( (customer.totalBuyAmount || 0) + finalTotal ).toFixed(2);
      } else {
        customer.totalSellAmount = +( (customer.totalSellAmount || 0) + finalTotal ).toFixed(2);
      }
    }

    // Add Audit Log for each transaction
    auditLogs.push({
      id: `AUD-${year}-${String(i + 1).padStart(6, '0')}`,
      timestamp: txDate,
      userId: employee.id,
      userName: employee.name,
      role: employee.role,
      action: 'TRANSACTION_CREATED',
      entity: 'TRANSACTION',
      entityId: txId,
      details: `${employee.name} created ${type} transaction ${txId} (${itemCount} items, Total: $${finalTotal.toLocaleString()}) for customer ${customer.fullName}`,
      ipAddress: `192.168.1.${10 + (i % 20)}`,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) TGB-Terminal/1.0',
    });

    if (isVoided) {
      auditLogs.push({
        id: `AUD-VOID-${year}-${String(i + 1).padStart(6, '0')}`,
        timestamp: txDate,
        userId: 'USR-001',
        userName: 'Alexander Sterling',
        role: 'SUPER_ADMIN',
        action: 'TRANSACTION_VOIDED',
        entity: 'TRANSACTION',
        entityId: txId,
        details: `Super Admin voided transaction ${txId}. Reason: Customer requested cancellation before settlement.`,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) TGB-Terminal/Admin',
      });
    }

    txCounter++;
  }

  return { transactions, auditLogs };
}
