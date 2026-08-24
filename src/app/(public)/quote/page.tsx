'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import TexasGoldBuyersLogo from '@/components/Logo';

export default function QuotePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    itemCategory: 'Gold Jewelry (10K-24K)',
    approxWeight: '',
    description: '',
    preferredLocation: 'Dallas Flagship — Uptown',
  });

  return (
    <div className="py-12 space-y-12 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-3">
        <TexasGoldBuyersLogo size="md" className="mx-auto mb-2" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Request an Official Appraisal Quote
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Receive a transparent market valuation from our master gemologists and precious metal appraisers.
        </p>
      </div>

      <div className="bg-tgb-navy border border-tgb-gold/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {isSubmitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white font-display">Quote Request Submitted!</h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-tgb-gold">{formData.fullName}</strong>. Our senior appraisal team at{' '}
              <strong className="text-white">{formData.preferredLocation}</strong> will review your details and contact you in under 15 minutes.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 px-6 py-2.5 bg-tgb-gold text-tgb-darknavy font-bold rounded-xl text-xs uppercase"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Marcus Alvarez"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(214) 555-0100"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Item Category *
                </label>
                <select
                  value={formData.itemCategory}
                  onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
                >
                  <option>Gold Jewelry (10K-24K)</option>
                  <option>Gold Coins & Bullion</option>
                  <option>Fine Silver & Sterling</option>
                  <option>Diamonds & Solitaires</option>
                  <option>Luxury Watches (Rolex / Patek / Cartier)</option>
                  <option>Platinum & Estate Lots</option>
                  <option>Rare Coins & Collectibles</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Item Description / Quantities / Approximate Weight
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="List items, karat stamps (e.g. 14k, 18k), weight, or watch reference..."
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Preferred Texas Lounge
              </label>
              <select
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-tgb-gold"
              >
                <option>Dallas Flagship — Uptown (2600 McKinney Ave)</option>
                <option>Houston Galleria Store (5085 Westheimer Rd)</option>
                <option>Austin Domain Branch (11410 Century Oaks)</option>
                <option>San Antonio Riverwalk (849 E Commerce St)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Submit For Free Instant Valuation
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-tgb-gold" />
              <span>Confidential • 100% Free • No Obligation</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
