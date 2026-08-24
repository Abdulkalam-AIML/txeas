'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import TexasGoldBuyersLogo from '@/components/Logo';
import { ShieldCheck, Award, Building, Users, Scale, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> Institutional Credibility & Heritage
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            About Texas Gold Buyers
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Founded on the core principles of honest assay testing, zero hidden dealer margins, and immediate liquidity for estate owners, collectors, and precious metals investors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <h2 className="text-2xl font-bold text-white font-display">
              Redefining Precious Metals Appraisal in the Lone Star State
            </h2>
            <p>
              For decades, Texans looking to sell family jewelry, bullion holdings, or luxury timepieces were forced to navigate predatory pawn shops, mail-in envelopes with hidden fees, or opaque jeweler discounts.
            </p>
            <p>
              Texas Gold Buyers was built to offer an institutional alternative. We invested in laboratory-grade Thermo Scientific and Olympus XRF Spectrometers across all our flagship lounges, enabling 100% non-destructive, atomic-level karat verification in under 30 seconds right in front of our clients.
            </p>
            <p>
              Operating under strict compliance with the Texas Department of Public Safety (DPS) and Texas Department of Agriculture certified scales, we guarantee the highest cash and bank wire payouts in the state.
            </p>
          </div>

          <div className="lg:col-span-6 bg-tgb-navy border border-tgb-gold/30 rounded-2xl p-8 space-y-6 shadow-2xl text-center">
            <TexasGoldBuyersLogo size="lg" className="mx-auto" />
            <div className="grid grid-cols-2 gap-4 text-left pt-2">
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder">
                <div className="text-2xl font-black text-tgb-gold font-mono">$150M+</div>
                <div className="text-[11px] text-gray-400">Precious Metals Liquidated</div>
              </div>
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder">
                <div className="text-2xl font-black text-tgb-gold font-mono">15,000+</div>
                <div className="text-[11px] text-gray-400">Satisfied Texas Clients</div>
              </div>
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder">
                <div className="text-2xl font-black text-tgb-gold font-mono">4 Lounges</div>
                <div className="text-[11px] text-gray-400">Dallas, Houston, Austin, SA</div>
              </div>
              <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder">
                <div className="text-2xl font-black text-tgb-gold font-mono">100% XRF</div>
                <div className="text-[11px] text-gray-400">Non-Destructive Assay</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
