import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import DemoRoleSwitcherBanner from '@/components/DemoRoleSwitcherBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Texas Gold Buyers — Premier Precious Metals, Bullion & Estate Appraisers',
  description:
    'Texas premier gold, silver, diamond, and luxury watch buyer. Instant transparent valuations, certified assay testing, highest payouts, and enterprise business management.',
  keywords: [
    'Texas Gold Buyers',
    'Sell Gold Dallas',
    'Sell Gold Houston',
    'Precious Metals Austin',
    'Bullion San Antonio',
    'Rolex Buyer Texas',
    'Diamond Buyer',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen bg-tgb-darknavy text-tgb-warmgray flex flex-col antialiased selection:bg-tgb-gold selection:text-tgb-darknavy">
        <AuthProvider>
          <DemoRoleSwitcherBanner />
          <div className="flex-1 flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
