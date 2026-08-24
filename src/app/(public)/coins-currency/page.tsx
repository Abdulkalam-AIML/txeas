'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { Coins, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CoinsCurrencyPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const coinList = [
    { name: 'Pre-1933 US Gold Coins', desc: 'Saint-Gaudens $20 Double Eagles, Liberty Heads, Indian Head $10, $5, and $2.50 gold coins.' },
    { name: 'Morgan & Peace Silver Dollars', desc: '1878-1935 key dates, Carson City (CC) mintmarks, and high-grade uncirculated rolls.' },
    { name: 'Graded PCGS & NGC Slabs', desc: 'Mint State (MS), Proof (PR), and strike-designated certified coins.' },
    { name: 'Ancient & World Numismatics', desc: 'Greek, Roman, Byzantine gold solidi, British Sovereigns, and Spanish 8 Reales.' },
    { name: 'Rare US Paper Currency', desc: 'Large-size currency, Gold Certificates, National Bank Notes, and Star notes.' },
    { name: '90% Junk Silver Bags', desc: 'Pre-1965 dimes, quarters, and Franklin/Walking Liberty half dollars bought in bulk.' },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase">
            <Coins className="w-3.5 h-3.5" /> Certified Numismatists On Staff
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Sell Rare Coins & Currency in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            We evaluate numismatic rarity, strike, luster, and key dates — not just the melt value. Authorized PCGS & NGC submission dealers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {coinList.map((item, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-2 shadow-xl hover:border-tgb-gold/50 transition-colors">
              <h3 className="text-base font-bold text-white font-display text-tgb-gold">{item.name}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-tgb-navy via-tgb-darknavy to-tgb-navy border border-tgb-gold/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white font-display">Have a Coin Collection or Estate Album?</h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Bring your coin albums, certified slabs, or inherited safe deposit boxes for an itemized appraisal with immediate liquidation options.
          </p>
          <button
            onClick={() => setQuoteOpen(true)}
            className="py-4 px-8 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg"
          >
            Request Free Coin Collection Appraisal
          </button>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
