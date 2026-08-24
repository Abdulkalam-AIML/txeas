'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TexasGoldBuyersLogo from '@/components/Logo';
import { QuoteModal } from './QuoteModal';
import { ShieldCheck, MapPin, Phone, Mail, Clock, Award, Lock, Sparkles, ExternalLink } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-tgb-darknavy border-t border-tgb-navyborder text-gray-400 text-xs">
        {/* Upper Banner with Quick CTA */}
        <div className="bg-gradient-to-r from-tgb-navy via-tgb-navylight to-tgb-navy border-b border-tgb-gold/20 py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-white font-display">
                Ready to Sell Your Gold, Silver or Luxury Watches?
              </h4>
              <p className="text-sm text-gray-300 mt-1">
                Experience Texas highest guaranteed payouts, immediate wire or cash, and private VIP appraisal rooms.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="py-3 px-6 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                GET YOUR FREE QUOTE
              </button>
              <a
                href="tel:2145554653"
                className="py-3 px-6 bg-tgb-darknavy hover:bg-tgb-navy border border-tgb-gold/40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-tgb-gold" />
                (214) 555-GOLD
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Credential */}
            <div className="lg:col-span-2 space-y-4">
              <TexasGoldBuyersLogo size="md" />
              <p className="text-gray-300 text-xs leading-relaxed max-w-sm">
                Texas Gold Buyers is the Lone Star State premier accredited buyer of fine jewelry, scrap gold, bullion, GIA certified diamonds, rare coins, and luxury Swiss timepieces.
              </p>
              <div className="flex flex-col gap-1.5 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tgb-gold shrink-0" />
                  <span>Licensed Texas Precious Metal Dealer (DPS Regulated)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-tgb-gold shrink-0" />
                  <span>Certified GIA Gemologists & Thermo Scientific XRF Assays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-tgb-gold shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 6:00 PM • Private Appointments Available</span>
                </div>
              </div>
            </div>

            {/* Col 2: What We Buy */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider font-display">What We Buy</h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="/gold-and-silver" className="hover:text-tgb-gold transition-colors">Gold Jewelry (10K-24K)</Link></li>
                <li><Link href="/gold-and-silver" className="hover:text-tgb-gold transition-colors">Scrap & Melt Gold</Link></li>
                <li><Link href="/diamonds" className="hover:text-tgb-gold transition-colors">GIA Diamonds & Solitaires</Link></li>
                <li><Link href="/luxury-watches" className="hover:text-tgb-gold transition-colors">Rolex & Patek Philippe</Link></li>
                <li><Link href="/bullion" className="hover:text-tgb-gold transition-colors">Gold & Silver Bullion Bars</Link></li>
                <li><Link href="/coins-currency" className="hover:text-tgb-gold transition-colors">Rare Coins & Currency</Link></li>
                <li><Link href="/collectibles" className="hover:text-tgb-gold transition-colors">High-End Collectibles</Link></li>
              </ul>
            </div>

            {/* Col 3: Texas Locations */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider font-display">Texas Locations</h5>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/locations" className="hover:text-tgb-gold transition-colors block">
                    <strong className="text-white block">Dallas Flagship (Uptown)</strong>
                    <span className="text-gray-400 text-[11px]">2600 McKinney Ave, Suite 400</span>
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="hover:text-tgb-gold transition-colors block">
                    <strong className="text-white block">Houston Galleria Store</strong>
                    <span className="text-gray-400 text-[11px]">5085 Westheimer Rd, Suite 2200</span>
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="hover:text-tgb-gold transition-colors block">
                    <strong className="text-white block">Austin Domain Branch</strong>
                    <span className="text-gray-400 text-[11px]">11410 Century Oaks Terrace</span>
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="hover:text-tgb-gold transition-colors block">
                    <strong className="text-white block">San Antonio Riverwalk</strong>
                    <span className="text-gray-400 text-[11px]">849 E Commerce St</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Corporate & Portal */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider font-display">Business Portal</h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="/about" className="hover:text-tgb-gold transition-colors">About Texas Gold Buyers</Link></li>
                <li><Link href="/how-it-works" className="hover:text-tgb-gold transition-colors">How It Works</Link></li>
                <li><Link href="/faq" className="hover:text-tgb-gold transition-colors">Frequently Asked Questions</Link></li>
                <li><Link href="/contact" className="hover:text-tgb-gold transition-colors">Contact Support</Link></li>
                <li className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tgb-navylight border border-tgb-gold/30 text-tgb-gold hover:bg-tgb-gold hover:text-tgb-darknavy font-bold transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" /> Staff & Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-tgb-navyborder/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} Texas Gold Buyers LLC. All Rights Reserved. DPS License #TX-PMD-49210.</p>
            <div className="flex items-center gap-4 text-gray-400">
              <span>Security Defense-in-Depth</span>
              <span>•</span>
              <span>FastAPI & PostgreSQL Ready</span>
              <span>•</span>
              <span>Cloudflare R2 Ready</span>
            </div>
          </div>
        </div>
      </footer>

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </>
  );
};

export default PublicFooter;
