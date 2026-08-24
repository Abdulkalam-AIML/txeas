'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { Sparkles, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CollectiblesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const categories = [
    { title: 'PSA / BGS Vintage Sports Cards', desc: 'Mantle, Jordan, Brady, Gretzky, Kobe, Ruth high-grade rookie cards and vintage sets.' },
    { title: 'Pokémon & TCG 1st Editions', desc: 'Base Set 1st Edition Shadowless Charizard, sealed booster boxes, and PSA 10 gem mints.' },
    { title: 'CGC / CBCS Golden & Silver Age Comics', desc: 'Key issue Marvel and DC superhero first appearances from Action Comics to Amazing Fantasy.' },
    { title: 'Fine Texas & Western Antiques', desc: 'Sterling silver spurs, historical Texas revolvers, bronze sculptures, and historic documents.' },
    { title: 'Autographed & Certified Memorabilia', desc: 'JSA, PSA/DNA, and Beckett certified game-worn jerseys and historic autographs.' },
    { title: 'Luxury Estate Collections', desc: 'Museum-grade antiques, rare chronometers, and unique investment-grade curios.' },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> High-End Alternative Assets & Collectibles
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Sell High-Value Collectibles in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            From PSA 10 sports cards to vintage CGC comic keys and historic Texas memorabilia, we provide immediate 6-figure liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((item, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-2 shadow-xl hover:border-tgb-gold/50 transition-colors">
              <h3 className="text-base font-bold text-white font-display text-tgb-gold">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-tgb-navy via-tgb-darknavy to-tgb-navy border border-tgb-gold/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white font-display">Appraise Your High-End Collectibles</h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Skip slow online consignment fees and 20% auction house commissions. Get an instant cash or wire offer today.
          </p>
          <button
            onClick={() => setQuoteOpen(true)}
            className="py-4 px-8 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg"
          >
            Submit Collectibles for Valuation
          </button>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
