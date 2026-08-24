'use client';

import React, { useState } from 'react';
import GoldValuationCalculator from '@/components/public/GoldValuationCalculator';
import { QuoteModal } from '@/components/public/QuoteModal';
import { ShieldCheck, Award, Sparkles, Scale, CheckCircle2, Phone } from 'lucide-react';

export default function SellYourGoldPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <Scale className="w-3.5 h-3.5" /> Direct Payout Guarantee
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Sell Your Gold for Top Cash in Texas
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Calculate your live payout below, visit any of our 4 flagship locations, and receive immediate funds via cash, bank wire, or company cheque.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <GoldValuationCalculator onOpenQuote={() => setQuoteOpen(true)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-3">
            <div className="text-tgb-gold font-bold text-base font-display">1. Bring Any Condition</div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Broken chains, single earrings, dental gold, 10k to 24k jewelry, coins, and bullion are all purchased at full pure melt rate.
            </p>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-3">
            <div className="text-tgb-gold font-bold text-base font-display">2. Live XRF Analysis</div>
            <p className="text-xs text-gray-300 leading-relaxed">
              We test the exact purity right in front of you with non-destructive X-ray fluorescence spectrometers. No guessing.
            </p>
          </div>
          <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-3">
            <div className="text-tgb-gold font-bold text-base font-display">3. Immediate Payment</div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Receive cash on the spot or direct Federal Reserve bank wire transfers with an official Texas DPS printed transaction receipt.
            </p>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
