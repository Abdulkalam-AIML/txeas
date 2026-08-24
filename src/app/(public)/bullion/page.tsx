'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import GoldValuationCalculator from '@/components/public/GoldValuationCalculator';
import { Award, ShieldCheck, TrendingUp, Sparkles, Scale } from 'lucide-react';

export default function BullionPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const bullionItems = [
    { title: 'Gold Eagles & Buffalos', desc: '1 oz, 1/2 oz, 1/4 oz, and 1/10 oz United States Mint gold coins.' },
    { title: 'Canadian Gold & Silver Maples', desc: '.9999 fine pure gold and silver bullion with micro-engraved radial lines.' },
    { title: 'South African Krugerrands', desc: '22K historic investment gold coins traded at live world spot benchmark.' },
    { title: '100 oz & 10 oz Silver Bars', desc: 'Engelhard, Johnson Matthey, Scottsdale Mint, and Sunshine Silver bars.' },
    { title: 'PAMP Suisse & Valcambi Bars', desc: 'Assay-card sealed .9999 fine gold, silver, and platinum ingots.' },
    { title: 'Platinum & Palladium Rounds', desc: 'American Platinum Eagles, Platypus, and 1 oz pure investment ingots.' },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <Award className="w-3.5 h-3.5" /> High Volume Institutional & Private Bullion
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Buy & Sell Bullion in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Locked real-time spot benchmark pricing on gold bars, silver ingots, and sovereign government bullion coins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-white font-display">Texas Most Trusted Bullion Trading Floor</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Whether liquidating a single 1 oz American Gold Eagle or a multi-million dollar institutional bullion depository vault, Texas Gold Buyers executes with zero hidden fees, immediate bank wire liquidity, and complete discretion.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-tgb-navy p-4 rounded-xl border border-tgb-navyborder text-xs">
                <strong className="text-white block mb-1">Instant Bank Wire</strong>
                Federal Reserve Fedwire settlement directly to your account.
              </div>
              <div className="bg-tgb-navy p-4 rounded-xl border border-tgb-navyborder text-xs">
                <strong className="text-white block mb-1">Assay Verification</strong>
                Sigma Metalytics Precious Metal Verifiers for sealed assay cards.
              </div>
            </div>
            <button
              onClick={() => setQuoteOpen(true)}
              className="py-3 px-6 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
            >
              Get Live Bullion Quote
            </button>
          </div>

          <div className="lg:col-span-6">
            <GoldValuationCalculator onOpenQuote={() => setQuoteOpen(true)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bullionItems.map((item, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-2 shadow-xl hover:border-tgb-gold/50 transition-colors">
              <h3 className="text-base font-bold text-white font-display text-tgb-gold">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
