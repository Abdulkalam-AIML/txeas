'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { QuoteModal } from '@/components/public/QuoteModal';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <Mail className="w-3.5 h-3.5" /> Direct Support & Appraisals
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Contact Texas Gold Buyers
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Speak directly with a senior precious metals appraiser or schedule a private consultation at any of our 4 Texas lounges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
              <h2 className="text-xl font-bold text-white font-display">Corporate Contact Center</h2>
              
              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-tgb-gold shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-sm">Direct Appraisal Line:</strong>
                    <a href="tel:2145554653" className="text-tgb-gold hover:underline font-mono font-bold text-base">
                      (214) 555-GOLD (4653)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-tgb-gold shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-sm">Email Inquiries:</strong>
                    <a href="mailto:appraisals@texasgoldbuyers.com" className="text-gray-200 hover:text-white">
                      appraisals@texasgoldbuyers.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-tgb-gold shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-sm">Operating Hours:</strong>
                    Monday – Friday: 9:00 AM – 6:00 PM CST<br />
                    Saturday: 10:00 AM – 4:00 PM CST<br />
                    Sunday: Closed (Private Vault appointments by request)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-tgb-darknavy border border-tgb-gold/30 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-tgb-gold">Texas DPS Registered Dealer</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Operating under Texas Precious Metal Dealer License #TX-PMD-49210. Armed security and private valuation suites on-site.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white font-display">Message Sent!</h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out. An appraiser will contact you shortly to answer your inquiry or confirm your appointment.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-tgb-gold text-tgb-darknavy font-bold rounded-lg text-xs uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white font-display">Send a Confidential Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. William Travis"
                      className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(214) 555-0100"
                      className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Branch / Location Preference</label>
                    <select className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold">
                      <option>Dallas Flagship — Uptown</option>
                      <option>Houston Galleria Store</option>
                      <option>Austin Domain Branch</option>
                      <option>San Antonio Riverwalk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Message / Items to Appraise</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide any details about your jewelry, watches, gold coins, or questions..."
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-tgb-gold to-tgb-goldlight text-tgb-darknavy font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Confidential Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
