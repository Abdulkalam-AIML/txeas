'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';

export default function FaqPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Texas Gold Buyers evaluate precious metals?',
      a: 'We use Thermo Scientific XRF (X-Ray Fluorescence) Spectrometers. This laboratory method shoots harmless X-rays into the metal alloy to measure exact percentages of Gold, Silver, Platinum, Palladium, and alloys with atomic accuracy. There is no acid scratching or destructive testing.',
    },
    {
      q: 'How quickly do I get paid?',
      a: 'Immediately upon accepting our appraisal. We offer immediate cash in hand, same-day Federal Reserve bank wire transfers, or certified cashier cheques. The entire process typically takes 10 to 15 minutes.',
    },
    {
      q: 'What government regulations do you follow in Texas?',
      a: 'We operate in strict compliance with the Texas Department of Public Safety (DPS) regulatory statutes governing Precious Metal Dealers (Chapter 1956, Texas Occupations Code). All scales are certified by the Texas Department of Agriculture.',
    },
    {
      q: 'Do you buy broken jewelry, dental gold, or scrap?',
      a: 'Yes. Condition does not affect metal value. We purchase broken necklaces, single earrings, bent rings, dental crowns, and industrial scrap purely based on metal content and weight.',
    },
    {
      q: 'What diamonds and luxury watches do you accept?',
      a: 'We buy GIA, EGL, and uncertified natural diamonds from 0.50 carats up to 15+ carats. For watches, we buy luxury Swiss timepieces including Rolex, Patek Philippe, Audemars Piguet, Cartier, Omega, and Breitling with or without original box and papers.',
    },
    {
      q: 'Do I need to make an appointment before visiting?',
      a: 'Walk-ins are welcomed during standard business hours at all four Texas locations. If you have an exceptionally large estate collection ($50,000+), booking a private VIP suite in advance guarantees dedicated senior gemologist attention.',
    },
    {
      q: 'Will you match or beat another dealer’s quote?',
      a: 'Yes. We pride ourselves on having the highest payout rates in the state. Bring any written, dated appraisal from a licensed Texas precious metal dealer and we will gladly beat it.',
    },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <HelpCircle className="w-3.5 h-3.5" /> Answers & Guidance
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Everything you need to know about selling precious metals, diamonds, bullion, and luxury watches in Texas.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-tgb-navy border border-tgb-navyborder rounded-xl overflow-hidden shadow-lg">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-bold text-sm hover:text-tgb-gold transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-tgb-gold shrink-0 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-tgb-navyborder/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-tgb-darknavy border border-tgb-gold/30 rounded-2xl p-8 text-center space-y-4 mt-12">
          <h3 className="text-xl font-bold text-white font-display">Have a Question Not Listed Here?</h3>
          <p className="text-xs text-gray-300">Call our Dallas appraisal desk directly or request a confidential online estimate.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setQuoteOpen(true)}
              className="py-3 px-6 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              Get Free Online Quote
            </button>
            <a
              href="tel:2145554653"
              className="py-3 px-6 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2"
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
