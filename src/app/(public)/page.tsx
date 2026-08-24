'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GoldValuationCalculator from '@/components/public/GoldValuationCalculator';
import { QuoteModal } from '@/components/public/QuoteModal';
import {
  ShieldCheck,
  Award,
  Zap,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Gem,
  Watch,
  Coins,
  Scale,
  MapPin,
  Star,
  ChevronDown,
  Building,
  PhoneCall,
} from 'lucide-react';

export default function HomePage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    {
      title: 'Gold & Jewelry',
      desc: '10K, 14K, 18K, 22K, 24K scrap, estate pieces, chains, bangles, and dental gold.',
      icon: <Scale className="w-7 h-7 text-tgb-gold" />,
      href: '/gold-and-silver',
      highlight: '90-95% of Spot Payout',
    },
    {
      title: 'Fine Silver & Bullion',
      desc: '999 fine silver bars, Silver Eagles, sterling flatware, and scrap lots.',
      icon: <Coins className="w-7 h-7 text-gray-300" />,
      href: '/gold-and-silver',
      highlight: 'Immediate Counter Payout',
    },
    {
      title: 'GIA Diamonds',
      desc: 'Solitaire rings, loose stones, melee parcels, tennis bracelets, and certified estate jewels.',
      icon: <Gem className="w-7 h-7 text-cyan-300" />,
      href: '/diamonds',
      highlight: 'GIA Master Gemologist Assay',
    },
    {
      title: 'Luxury Watches',
      desc: 'Rolex, Patek Philippe, Audemars Piguet, Cartier, Omega, and Breitling timepieces.',
      icon: <Watch className="w-7 h-7 text-amber-300" />,
      href: '/luxury-watches',
      highlight: 'Highest Market Values',
    },
    {
      title: 'Bullion & Investment Bars',
      desc: 'American Eagles, Krugerrands, Canadian Maple Leafs, PAMP Suisse, and Valcambi.',
      icon: <Award className="w-7 h-7 text-tgb-goldlight" />,
      href: '/bullion',
      highlight: 'Live Spot Market Lock',
    },
    {
      title: 'Rare Coins & Collectibles',
      desc: 'Pre-1933 gold coins, Morgan dollars, graded numismatics, and vintage sports memorabilia.',
      icon: <Sparkles className="w-7 h-7 text-rose-300" />,
      href: '/coins-currency',
      highlight: 'Certified Numismatists',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Bring Your Items In',
      desc: 'Visit any of our 4 secure Texas flagship lounges (Dallas, Houston, Austin, San Antonio) or request a private courier appraisal.',
    },
    {
      num: '02',
      title: 'Scientific XRF Assay',
      desc: 'We test your precious metals right in front of you using Thermo Scientific XRF Spectrometers — 100% non-destructive and transparent.',
    },
    {
      num: '03',
      title: 'Guaranteed Highest Offer',
      desc: 'We calculate your payout using live real-time New York / London spot prices with minimal spreads.',
    },
    {
      num: '04',
      title: 'Immediate Cash or Wire',
      desc: 'Accept our offer and receive immediate cash, same-day bank wire, or certified company cashier cheque with a printed Texas DPS invoice.',
    },
  ];

  const testimonials = [
    {
      name: 'James C. Montgomery',
      city: 'Dallas, TX (Highland Park)',
      comment:
        'Sold an estate collection including a Rolex Submariner and several 1oz Gold Eagles. Texas Gold Buyers beat three other Dallas quotes by over $2,400. Professional, private, and paid via wire in 10 minutes.',
      rating: 5,
    },
    {
      name: 'Elena S. Garza',
      city: 'Houston, TX (Galleria)',
      comment:
        'The XRF spectrometer test right on the counter was amazing to watch. They showed me the exact 18K purity of my family bangles. Highest payout in Houston by far!',
      rating: 5,
    },
    {
      name: 'David & Rachel Vance',
      city: 'Austin, TX (Westlake)',
      comment:
        'Honest, upscale, and totally transparent. No pawnshop vibes — this is a high-end precious metals institution. The printed invoice and prompt bank wire gave us complete peace of mind.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'How do you determine the value of my gold and jewelry?',
      a: 'We use Thermo Scientific XRF (X-Ray Fluorescence) Spectrometers to determine the exact elemental karat composition without scratching or melting your pieces. We then weigh items on state-certified scales and apply the live precious metals spot price.',
    },
    {
      q: 'Do you pay immediately on the spot?',
      a: 'Yes! Upon agreeing to the appraisal quote, we provide instant cash, immediate same-day bank wire transfer, or certified company cheque, complete with an official DPS-compliant transaction receipt.',
    },
    {
      q: 'What identification do I need to sell gold in Texas?',
      a: 'In accordance with Texas Department of Public Safety (DPS) regulations for Precious Metal Dealers, you will need a valid government-issued photo ID (such as a Driver’s License, State ID, Military ID, or Passport).',
    },
    {
      q: 'Do you buy broken or damaged gold chains and rings?',
      a: 'Absolutely. Gold is valued by its pure precious metal content and weight, not its aesthetic condition. Broken jewelry, mismatched earrings, dental gold, and scrap lots are bought at full melt value.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-tgb-darknavy via-[#0B1B2A] to-tgb-darknavy">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tgb-gold/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tgb-navy/80 border border-tgb-gold/30 text-tgb-gold text-xs font-semibold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-tgb-goldlight" />
                The Lone Star State Premier Precious Metals Buyer
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white font-display tracking-tight leading-[1.1]">
                Highest Cash Payouts for <span className="gold-gradient-text">Gold, Silver, Diamonds & Luxury Watches</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Texas Gold Buyers provides private, laboratory-grade XRF assay valuations and guaranteed top market payouts. Walk in today for immediate cash or bank wire.
              </p>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-tgb-navylight/50 border border-tgb-navyborder text-xs text-gray-200">
                  <ShieldCheck className="w-5 h-5 text-tgb-gold shrink-0" />
                  <span>Licensed Texas DPS Precious Metal Dealer</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-tgb-navylight/50 border border-tgb-navyborder text-xs text-gray-200">
                  <Zap className="w-5 h-5 text-tgb-gold shrink-0" />
                  <span>Instant Wire or Cash at Counter</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-xl bg-tgb-navylight/50 border border-tgb-navyborder text-xs text-gray-200">
                  <Award className="w-5 h-5 text-tgb-gold shrink-0" />
                  <span>XRF Spectrometer Non-Destructive Assay</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="py-4 px-8 bg-gradient-to-r from-tgb-gold to-tgb-goldlight hover:from-tgb-goldlight hover:to-tgb-gold text-tgb-darknavy font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl hover:shadow-tgb-gold/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  GET YOUR FREE QUOTE
                </button>
                <a
                  href="tel:2145554653"
                  className="py-4 px-8 bg-tgb-navylight hover:bg-tgb-navy border border-tgb-gold/40 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-tgb-gold" />
                  CALL TEXAS GOLD BUYERS
                </a>
              </div>
            </div>

            {/* Right Column: Live Interactive Calculator */}
            <div className="lg:col-span-5">
              <GoldValuationCalculator onOpenQuote={() => setQuoteModalOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      {/* What We Buy Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs uppercase tracking-widest text-tgb-gold font-bold">Comprehensive Precious Metals Purchasing</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            What We Buy at Top Texas Rates
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            From single scrap gold rings to multi-million dollar estate coin & watch portfolios, our certified appraisers provide unmatched expertise and liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-tgb-navy/70 border border-tgb-navyborder rounded-2xl p-6 hover:border-tgb-gold/50 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-tgb-darknavy border border-tgb-navyborder flex items-center justify-center group-hover:border-tgb-gold/40 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-bold text-tgb-gold bg-tgb-gold/10 px-2.5 py-1 rounded-full border border-tgb-gold/20">
                    {cat.highlight}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-tgb-gold transition-colors font-display">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">{cat.desc}</p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-tgb-navyborder/60 flex items-center justify-between text-xs">
                <Link
                  href={cat.href}
                  className="text-tgb-gold group-hover:text-tgb-goldlight font-bold flex items-center gap-1.5 transition-colors"
                >
                  Learn More & View Rates <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-tgb-navy via-tgb-darknavy to-tgb-navy border-y border-tgb-navyborder py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="text-xs uppercase tracking-widest text-tgb-gold font-bold">The Texas Gold Buyers Advantage</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Simple, Transparent & Immediate 4-Step Process
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              We eliminated the opaque middleman markups and confusing pawn formulas. Here is how our frictionless appraisal works:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-tgb-darknavy/90 border border-tgb-navyborder rounded-2xl p-6 space-y-4">
                <div className="text-3xl font-black text-tgb-gold font-mono opacity-80">{step.num}</div>
                <h3 className="text-lg font-bold text-white font-display">{step.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs uppercase tracking-widest text-tgb-gold font-bold">Verified Client Reviews</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Trusted by Thousands Across Texas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-200 italic leading-relaxed">"{t.comment}"</p>
              <div className="pt-3 border-t border-tgb-navyborder text-xs">
                <strong className="text-white block font-medium">{t.name}</strong>
                <span className="text-tgb-gold text-[11px]">{t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Texas Locations Map / Lounge Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-tgb-navy via-tgb-darknavy to-tgb-navy border border-tgb-gold/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
                <Building className="w-3.5 h-3.5" /> 4 Texas Flagship Locations
              </div>
              <h2 className="text-3xl font-extrabold text-white font-display">
                Visit Our Secure Private Appraisal Suites
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Enjoy complimentary refreshments in our private VIP evaluation rooms. Walk-ins are always welcomed during business hours, or reserve a private concierge slot.
              </p>
              <div className="pt-2">
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  View All Branch Details & Hours <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-tgb-darknavy p-5 rounded-xl border border-tgb-navyborder space-y-2">
                <div className="flex items-center gap-2 text-tgb-gold font-bold text-sm">
                  <MapPin className="w-4 h-4" /> Dallas Flagship (Uptown)
                </div>
                <p className="text-xs text-gray-300">2600 McKinney Ave, Suite 400, Dallas, TX 75204</p>
                <div className="text-[11px] text-gray-400">Phone: (214) 555-4653</div>
              </div>

              <div className="bg-tgb-darknavy p-5 rounded-xl border border-tgb-navyborder space-y-2">
                <div className="flex items-center gap-2 text-tgb-gold font-bold text-sm">
                  <MapPin className="w-4 h-4" /> Houston Galleria Store
                </div>
                <p className="text-xs text-gray-300">5085 Westheimer Rd, Suite 2200, Houston, TX 77056</p>
                <div className="text-[11px] text-gray-400">Phone: (713) 555-4653</div>
              </div>

              <div className="bg-tgb-darknavy p-5 rounded-xl border border-tgb-navyborder space-y-2">
                <div className="flex items-center gap-2 text-tgb-gold font-bold text-sm">
                  <MapPin className="w-4 h-4" /> Austin Domain Branch
                </div>
                <p className="text-xs text-gray-300">11410 Century Oaks Terrace, Austin, TX 78758</p>
                <div className="text-[11px] text-gray-400">Phone: (512) 555-4653</div>
              </div>

              <div className="bg-tgb-darknavy p-5 rounded-xl border border-tgb-navyborder space-y-2">
                <div className="flex items-center gap-2 text-tgb-gold font-bold text-sm">
                  <MapPin className="w-4 h-4" /> San Antonio Riverwalk
                </div>
                <p className="text-xs text-gray-300">849 E Commerce St, San Antonio, TX 78205</p>
                <div className="text-[11px] text-gray-400">Phone: (210) 555-4653</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="text-xs uppercase tracking-widest text-tgb-gold font-bold">Frequently Asked Questions</div>
          <h2 className="text-3xl font-extrabold text-white font-display">Common Questions About Selling Gold</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-tgb-navy border border-tgb-navyborder rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-sm hover:text-tgb-gold transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-tgb-gold shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-tgb-navyborder/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </div>
  );
}
