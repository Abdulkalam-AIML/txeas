'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { ShieldCheck, Award, Zap, Scale, CheckCircle2, ArrowRight, Building, Phone } from 'lucide-react';

export default function HowItWorksPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Walk In or Schedule a VIP Suite',
      desc: 'Visit our Dallas Flagship, Houston Galleria, Austin Domain, or San Antonio Riverwalk lounge. Walk-ins are always welcomed, or book a private appointment for large estate evaluations.',
    },
    {
      num: '02',
      title: 'Real-Time Spectrometer Purity Assay',
      desc: 'Watch as our certified technicians test your precious metals right in front of you using calibrated Thermo Scientific XRF analyzers. We measure the exact karat purity without acid or scratches.',
    },
    {
      num: '03',
      title: 'Certified Scale Weight & Market Spot Calculation',
      desc: 'Items are weighed on state-certified Class II legal trade scales. Payouts are computed live against world market spot rates with full transparency.',
    },
    {
      num: '04',
      title: 'Instant Cash, Bank Wire, or Company Cheque',
      desc: 'Upon accepting our guaranteed high offer, receive immediate cash in hand, same-day Fedwire transfer, or official company check with a printed Texas DPS transaction receipt.',
    },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <Zap className="w-3.5 h-3.5" /> Frictionless Transparent Process
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            How Texas Gold Buyers Works
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            From arrival to immediate payment in under 15 minutes. Discover why over 15,000 Texans trust us for precious metal liquidations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((s, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-8 space-y-4 shadow-xl">
              <div className="text-3xl font-black text-tgb-gold font-mono">{s.num}</div>
              <h3 className="text-xl font-bold text-white font-display">{s.title}</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-tgb-navy via-tgb-darknavy to-tgb-navy border border-tgb-gold/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white font-display">Ready for an In-Person Valuation?</h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            No appointment necessary during normal business hours. Bring your valid photo ID and items for immediate payout.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setQuoteOpen(true)}
              className="py-4 px-8 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg"
            >
              Get Your Free Instant Estimate
            </button>
            <a
              href="tel:2145554653"
              className="py-4 px-8 bg-tgb-navylight border border-tgb-gold/40 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-tgb-gold" /> (214) 555-GOLD
            </a>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
