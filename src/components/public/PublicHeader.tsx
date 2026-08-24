'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TexasGoldBuyersLogo from '@/components/Logo';
import LiveSpotTicker from './LiveSpotTicker';
import { QuoteModal } from './QuoteModal';
import { Phone, Menu, X, Shield, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { label: 'Gold & Silver', href: '/gold-and-silver' },
    { label: 'Diamonds', href: '/diamonds' },
    { label: 'Luxury Watches', href: '/luxury-watches' },
    { label: 'Bullion', href: '/bullion' },
    { label: 'Coins & Currency', href: '/coins-currency' },
    { label: 'Collectibles', href: '/collectibles' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Locations', href: '/locations' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-[29px] z-40 bg-tgb-darknavy/95 backdrop-blur-md border-b border-tgb-navyborder shadow-xl">
        <LiveSpotTicker />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="shrink-0 flex items-center group">
            <TexasGoldBuyersLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-gray-200">
            {navLinks.slice(0, 7).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 hover:text-tgb-gold ${
                    isActive ? 'text-tgb-gold font-semibold border-b-2 border-tgb-gold' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Phone CTA */}
            <a
              href="tel:2145554653"
              className="hidden md:flex items-center gap-2 text-xs text-gray-300 hover:text-white px-3 py-2 rounded-lg bg-tgb-navylight/60 border border-tgb-navyborder transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-tgb-gold" />
              <div className="text-left leading-tight">
                <span className="text-[10px] text-tgb-muted block uppercase">Call Texas Gold Buyers</span>
                <span className="font-bold text-white font-mono">(214) 555-GOLD</span>
              </div>
            </a>

            {/* Primary Quote CTA */}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="py-2.5 px-4 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-lg hover:shadow-tgb-gold/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              GET YOUR FREE QUOTE
            </button>

            {/* Portal Link */}
            <Link
              href={user ? '/portal/dashboard' : '/login'}
              className="py-2.5 px-3.5 bg-tgb-navylight hover:bg-tgb-navyborder text-gray-200 hover:text-white text-xs font-semibold rounded-lg border border-tgb-navyborder transition-colors flex items-center gap-1.5"
              title="Staff & Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-tgb-gold" />
              <span className="hidden lg:inline">{user ? 'Portal' : 'Staff Login'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="py-1.5 px-2.5 bg-tgb-gold text-tgb-darknavy font-bold text-[11px] rounded uppercase"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white bg-tgb-navylight rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-tgb-navy border-t border-tgb-navyborder px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname === link.href ? 'bg-tgb-gold text-tgb-darknavy font-bold' : 'text-gray-300 hover:bg-tgb-darknavy'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-tgb-navyborder space-y-2">
              <a
                href="tel:2145554653"
                className="w-full flex items-center justify-center gap-2 py-3 bg-tgb-darknavy text-white text-xs font-bold rounded-lg border border-tgb-navyborder"
              >
                <Phone className="w-4 h-4 text-tgb-gold" />
                CALL (214) 555-GOLD (4653)
              </a>
              <Link
                href={user ? '/portal/dashboard' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-tgb-navylight text-tgb-gold text-xs font-bold rounded-lg border border-tgb-gold/30"
              >
                <Lock className="w-4 h-4" />
                ENTERPRISE BUSINESS PORTAL
              </Link>
            </div>
          </div>
        )}
      </header>

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </>
  );
};

export default PublicHeader;
