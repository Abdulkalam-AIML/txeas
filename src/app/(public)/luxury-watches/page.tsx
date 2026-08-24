'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { Watch, ShieldCheck, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LuxuryWatchesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const brands = [
    { name: 'Rolex', models: 'Submariner, Daytona, GMT-Master II, Datejust, Day-Date Presidential, Sea-Dweller, Sky-Dweller, Explorer.' },
    { name: 'Patek Philippe', models: 'Nautilus, Aquanaut, Calatrava, Grand Complications, Annual Calendar.' },
    { name: 'Audemars Piguet', models: 'Royal Oak, Royal Oak Offshore, Code 11.59.' },
    { name: 'Cartier', models: 'Santos de Cartier, Tank Francaise, Ballon Bleu, Panthère, Pasha.' },
    { name: 'Omega', models: 'Speedmaster Professional Moonwatch, Seamaster Diver 300M, Planet Ocean, Constellation.' },
    { name: 'Breitling & Tudor', models: 'Navitimer, Chronomat, Black Bay, Pelagos, Superocean.' },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase">
            <Watch className="w-3.5 h-3.5" /> High Horology Appraisals
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Sell Luxury Watches in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Texas leading buyer of Rolex, Patek Philippe, Audemars Piguet, Cartier, and Omega. Box and papers preferred, but loose watches welcomed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {brands.map((b, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-3 shadow-xl hover:border-tgb-gold/50 transition-colors">
              <div className="text-xl font-bold text-white font-display text-tgb-gold">{b.name}</div>
              <p className="text-xs text-gray-300 leading-relaxed"><strong className="text-white">Popular References:</strong> {b.models}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-tgb-navy via-tgb-darknavy to-tgb-navy border border-tgb-gold/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white font-display">Have a Luxury Timepiece to Sell?</h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We authenticate serial numbers, movement calibers, and bracelet condition on the spot. Walk out with immediate funds.
          </p>
          <button
            onClick={() => setQuoteOpen(true)}
            className="py-4 px-8 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg"
          >
            Get Instant Watch Valuation
          </button>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
