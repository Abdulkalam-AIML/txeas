'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import GoldValuationCalculator from '@/components/public/GoldValuationCalculator';
import { ShieldCheck, Award, Sparkles, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

export default function GoldAndSilverPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const karatList = [
    { karat: '24K Gold', purity: '99.9% Pure', desc: 'Pure investment bullion bars, coins, and Asian 9999 gold jewelry.' },
    { karat: '22K Gold', purity: '91.6% Pure', desc: 'High-karat Indian, Middle Eastern, and European bridal gold bangles and chains.' },
    { karat: '18K Gold', purity: '75.0% Pure', desc: 'Luxury designer jewelry from Cartier, Tiffany, Bulgari, and Van Cleef & Arpels.' },
    { karat: '14K Gold', purity: '58.5% Pure', desc: 'The most popular American fine jewelry standard for rings, necklaces, and bracelets.' },
    { karat: '10K Gold', purity: '41.7% Pure', desc: 'Durable class rings, vintage charms, and solid gold jewelry.' },
    { karat: 'Fine Silver (.999)', purity: '99.9% Pure', desc: 'Silver rounds, 10oz, 100oz, and 1000oz silver investment bars.' },
    { karat: 'Sterling Silver (.925)', purity: '92.5% Pure', desc: 'Flatware sets, tea services, Tiffany sterling, and estate silverware.' },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <Scale className="w-3.5 h-3.5" /> High-Purity Precious Metals
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Sell Gold & Silver in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Get paid up to 95% of live precious metal melt value. Non-destructive XRF assay testing on-site with same-day cash or bank wire.
          </p>
        </div>

        {/* Calculator and info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-white font-display">
              Why Sell Your Gold & Silver to Texas Gold Buyers?
            </h2>
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3 bg-tgb-navy p-4 rounded-xl border border-tgb-navyborder">
                <CheckCircle2 className="w-5 h-5 text-tgb-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-0.5">Transparent Scientific Assays</strong>
                  We test purity right in front of you using Olympus/Thermo XRF spectrometers. No guessing, acid scratching, or arbitrary formulas.
                </div>
              </div>
              <div className="flex items-start gap-3 bg-tgb-navy p-4 rounded-xl border border-tgb-navyborder">
                <CheckCircle2 className="w-5 h-5 text-tgb-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-0.5">Certified Texas Legal Scales</strong>
                  Every scale is calibrated and registered with the Texas Department of Agriculture for exact gram and troy ounce precision.
                </div>
              </div>
              <div className="flex items-start gap-3 bg-tgb-navy p-4 rounded-xl border border-tgb-navyborder">
                <CheckCircle2 className="w-5 h-5 text-tgb-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-0.5">Highest Market Guarantee</strong>
                  If you receive a legitimate written offer from any licensed Texas dealer on the same day, we will beat it.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setQuoteOpen(true)}
                className="py-3 px-6 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Request Free Appraisal Quote
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <GoldValuationCalculator onOpenQuote={() => setQuoteOpen(true)} />
          </div>
        </div>

        {/* Karat Breakdown Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white font-display mb-6">Purity Standards & What We Buy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {karatList.map((k, i) => (
              <div key={i} className="bg-tgb-darknavy p-5 rounded-xl border border-tgb-navyborder space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white font-display">{k.karat}</span>
                  <span className="text-xs font-bold text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded">{k.purity}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
