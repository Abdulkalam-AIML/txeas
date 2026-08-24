'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import TexasGoldBuyersLogo from '@/components/Logo';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    itemCategory: 'Gold Jewelry',
    approxWeight: '',
    description: '',
    preferredLocation: 'Dallas Flagship — Uptown',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-tgb-navy border border-tgb-gold/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg bg-tgb-darknavy/60 hover:bg-tgb-darknavy transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Quote Request Received!</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-tgb-gold">{formData.name}</strong>. A senior precious metals appraiser at our{' '}
              <strong className="text-white">{formData.preferredLocation}</strong> will review your items and call you within 15 minutes with a transparent estimate.
            </p>
            <div className="bg-tgb-darknavy p-4 rounded-xl border border-tgb-navyborder text-left text-xs space-y-1.5 text-gray-300 mt-4">
              <div><strong className="text-white">Phone:</strong> {formData.phone}</div>
              <div><strong className="text-white">Category:</strong> {formData.itemCategory}</div>
              <div><strong className="text-white">Location:</strong> {formData.preferredLocation}</div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-6 px-8 py-3 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold rounded-xl transition-all shadow-lg text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <TexasGoldBuyersLogo size="sm" className="mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white font-display">Get Your Free Instant Valuation</h3>
              <p className="text-xs text-tgb-muted mt-1">
                No obligation. Highest market payout guarantee across Texas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Michael Vance"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(214) 555-0123"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold"
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
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-tgb-gold focus:ring-1 focus:ring-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Item Category *
                  </label>
                  <select
                    value={formData.itemCategory}
                    onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="Gold Jewelry">Gold Jewelry (10K-24K)</option>
                    <option value="Gold Coins & Bullion">Gold Coins & Bullion</option>
                    <option value="Silver Bullion & Flatware">Silver Bullion & Flatware</option>
                    <option value="Diamonds & Solitaires">Diamonds & Solitaires</option>
                    <option value="Luxury Watches (Rolex/Cartier)">Luxury Watches (Rolex / Cartier)</option>
                    <option value="Platinum & Estate Lots">Platinum & Estate Lots</option>
                    <option value="Rare Coins & Collectibles">Rare Coins & Collectibles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Item Details / Approximate Weight
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 14k gold rope chain approx 32 grams, 1 diamond ring 1.5 carat round..."
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-tgb-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Preferred Texas Location
                </label>
                <select
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-tgb-gold"
                >
                  <option value="Dallas Flagship — Uptown">Dallas Flagship — Uptown (2600 McKinney Ave)</option>
                  <option value="Houston Galleria Store">Houston Galleria Store (5085 Westheimer Rd)</option>
                  <option value="Austin Domain Branch">Austin Domain Branch (11410 Century Oaks)</option>
                  <option value="San Antonio — Riverwalk">San Antonio — Riverwalk (849 E Commerce St)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  <Sparkles className="w-4 h-4" />
                  SUBMIT FOR INSTANT APPRAISAL QUOTE
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-tgb-gold" />
                <span>100% Confidential • Licensed Texas Precious Metal Dealer</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
