'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, Shield, Award, Sparkles } from 'lucide-react';

interface GoldValuationCalculatorProps {
  onOpenQuote: () => void;
}

export const GoldValuationCalculator: React.FC<GoldValuationCalculatorProps> = ({ onOpenQuote }) => {
  const [metal, setMetal] = useState<'Gold' | 'Silver' | 'Platinum'>('Gold');
  const [karat, setKarat] = useState<number>(14); // 10, 14, 18, 22, 24
  const [weight, setWeight] = useState<number>(25);
  const [unit, setUnit] = useState<'g' | 'oz' | 'dwt'>('g');

  // Baseline Spot Prices
  const spotRates = {
    Gold: 2514.80, // $/oz
    Silver: 29.45,
    Platinum: 982.10,
  };

  const purityFactors: Record<number, number> = {
    10: 10 / 24, // 41.7%
    14: 14 / 24, // 58.33%
    18: 18 / 24, // 75.0%
    22: 22 / 24, // 91.67%
    24: 1.0,     // 99.9%
  };

  // Convert weight to Troy Oz
  let weightInOz = weight;
  if (unit === 'g') weightInOz = weight / 31.1035;
  if (unit === 'dwt') weightInOz = (weight * 1.55517) / 31.1035;

  let purityMultiplier = 1.0;
  if (metal === 'Gold') {
    purityMultiplier = purityFactors[karat] || 0.585;
  } else if (metal === 'Silver') {
    purityMultiplier = 0.925; // Sterling standard
  } else if (metal === 'Platinum') {
    purityMultiplier = 0.950;
  }

  // Pure metal melt value
  const spotRate = spotRates[metal];
  const pureMeltValue = weightInOz * purityMultiplier * spotRate;

  // Texas Gold Buyers competitive payout percentage: 90% - 94% on scrap/bullion
  const estimatedPayoutMin = pureMeltValue * 0.90;
  const estimatedPayoutMax = pureMeltValue * 0.95;

  return (
    <div className="bg-gradient-to-b from-tgb-navy to-tgb-darknavy border border-tgb-gold/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-tgb-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-tgb-navyborder">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tgb-gold/15 text-tgb-gold flex items-center justify-center border border-tgb-gold/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">Instant Payout Estimator</h3>
            <p className="text-xs text-tgb-muted">Live market pricing powered by Texas precious metal assays</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3 h-3" /> Top Texas Rates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Input Controls */}
        <div className="space-y-4">
          {/* Metal Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Select Precious Metal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Gold', 'Silver', 'Platinum'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetal(m)}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                    metal === m
                      ? 'bg-tgb-gold text-tgb-darknavy shadow-md'
                      : 'bg-tgb-darknavy text-gray-300 border border-tgb-navyborder hover:border-tgb-gold/50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Karat selector if Gold */}
          {metal === 'Gold' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Gold Purity (Karat)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[10, 14, 18, 22, 24].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKarat(k)}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      karat === k
                        ? 'bg-tgb-goldlight text-tgb-darknavy shadow-sm'
                        : 'bg-tgb-darknavy text-gray-300 border border-tgb-navyborder hover:text-white'
                    }`}
                  >
                    {k}K
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weight & Unit */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Weight & Unit of Measurement
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                className="flex-1 bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white font-mono text-base focus:outline-none focus:border-tgb-gold"
              />
              <div className="flex bg-tgb-darknavy rounded-lg p-0.5 border border-tgb-navyborder">
                {(['g', 'oz', 'dwt'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase ${
                      unit === u
                        ? 'bg-tgb-gold text-tgb-darknavy font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {u === 'g' ? 'Grams' : u === 'oz' ? 'Troy Oz' : 'DWT'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Estimation Box */}
        <div className="bg-tgb-darknavy/90 border border-tgb-gold/40 rounded-xl p-5 text-center space-y-3 relative">
          <div className="text-xs uppercase tracking-widest text-tgb-gold font-bold">
            Estimated Instant Cash Payout
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight gold-gradient-text">
            ${Math.max(0, estimatedPayoutMin).toLocaleString(undefined, { maximumFractionDigits: 0 })} – $
            {Math.max(0, estimatedPayoutMax).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>

          <div className="text-[11px] text-gray-400">
            Spot Rate Applied: <span className="text-gray-200 font-mono">${spotRate.toFixed(2)}/oz</span> •{' '}
            {metal === 'Gold' ? `${karat}K (${(purityMultiplier * 100).toFixed(1)}% pure)` : metal}
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenQuote}
              className="w-full py-3 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
            >
              Lock This Price Today <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
            <Shield className="w-3.5 h-3.5 text-tgb-gold" />
            <span>XRF Non-destructive Assay • Immediate Wire or Cash</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldValuationCalculator;
