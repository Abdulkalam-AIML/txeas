'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { Gem, ShieldCheck, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DiamondsPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const diamondCategories = [
    { title: 'GIA & EGL Solitaires', desc: 'Round Brilliant, Cushion, Oval, Emerald, Radiant, Princess, and Pear cuts from 0.50 ct to 15.0+ carats.' },
    { title: 'Diamond Tennis Bracelets & Necklaces', desc: 'Estate and modern diamond riviere tennis necklaces, chokers, and multi-carat bracelets.' },
    { title: 'Estate & Vintage Diamond Jewelry', desc: 'Art Deco, Victorian, Edwardian, and mid-century platinum and diamond heirlooms.' },
    { title: 'Loose Certified Diamonds', desc: 'Graded stones with GIA, AGS, IGI, or HRD laboratory dossiers.' },
    { title: 'Fancy Colored Diamonds', desc: 'Natural Fancy Yellow (Canary), Pink, Blue, and Green diamonds with provenance.' },
    { title: 'Melee Diamond Parcels', desc: 'Commercial quantities of accent diamonds from estate liquidation and jeweler closeouts.' },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase">
            <Gem className="w-3.5 h-3.5" /> Certified GIA Gemology Appraisals
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Sell Diamonds & Fine Jewelry in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Our in-house Graduate Gemologists evaluate the 4Cs (Cut, Color, Clarity, Carat Weight) to pay maximum international market value.
          </p>
        </div>

        {/* 4Cs & Expertise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-2xl font-bold text-white font-display">The Texas Gold Buyers Diamond Standard</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Unlike typical pawn shops that only value the precious metal and discount the diamonds to zero, Texas Gold Buyers pays premium cash for diamonds of all shapes and sizes.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-tgb-darknavy p-3.5 rounded-xl border border-tgb-navyborder text-xs">
                <strong className="text-cyan-300 block mb-1">Carat Weight</strong>
                High liquidity for large single stones (2ct, 3ct, 5ct+).
              </div>
              <div className="bg-tgb-darknavy p-3.5 rounded-xl border border-tgb-navyborder text-xs">
                <strong className="text-cyan-300 block mb-1">Cut Grade</strong>
                Premium premiums for Excellent/Ideal cut proportions.
              </div>
              <div className="bg-tgb-darknavy p-3.5 rounded-xl border border-tgb-navyborder text-xs">
                <strong className="text-cyan-300 block mb-1">Color Grade</strong>
                D-to-Z color evaluation under daylight spectrometer lamps.
              </div>
              <div className="bg-tgb-darknavy p-3.5 rounded-xl border border-tgb-navyborder text-xs">
                <strong className="text-cyan-300 block mb-1">Clarity Grade</strong>
                Flawless (FL) down to I1 using 10x and 60x darkfield microscopes.
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setQuoteOpen(true)}
                className="py-3 px-6 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
              >
                Schedule Diamond Appraisal
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-tgb-darknavy via-tgb-navy to-tgb-darknavy border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-300" /> What We Purchase
            </h3>
            <div className="space-y-3">
              {diamondCategories.map((d, i) => (
                <div key={i} className="bg-tgb-darknavy/80 p-3.5 rounded-xl border border-tgb-navyborder">
                  <h4 className="text-sm font-bold text-white mb-0.5">{d.title}</h4>
                  <p className="text-xs text-gray-300">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
