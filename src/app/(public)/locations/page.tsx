'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, Building } from 'lucide-react';

export default function LocationsPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const branches = [
    {
      name: 'Dallas Flagship — Uptown',
      address: '2600 McKinney Ave, Suite 400',
      city: 'Dallas',
      state: 'TX',
      zip: '75204',
      phone: '(214) 555-GOLD (4653)',
      email: 'dallas@texasgoldbuyers.com',
      hours: 'Mon – Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 4:00 PM | Sun: Closed',
      features: ['Private VIP Appraisal Suites', 'Armed Security On-Site', 'Instant Fedwire & Cash Payouts', 'Complimentary Valet Parking'],
    },
    {
      name: 'Houston Galleria Store',
      address: '5085 Westheimer Rd, Suite 2200',
      city: 'Houston',
      state: 'TX',
      zip: '77056',
      phone: '(713) 555-GOLD (4653)',
      email: 'houston@texasgoldbuyers.com',
      hours: 'Mon – Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 4:00 PM | Sun: Closed',
      features: ['Galleria Financial Center Location', 'Full Horology & Diamond Laboratory', 'Institutional Bullion Vault', 'Bilingual Appraisers (English & Spanish)'],
    },
    {
      name: 'Austin Domain Branch',
      address: '11410 Century Oaks Terrace',
      city: 'Austin',
      state: 'TX',
      zip: '78758',
      phone: '(512) 555-GOLD (4653)',
      email: 'austin@texasgoldbuyers.com',
      hours: 'Mon – Fri: 9:30 AM – 6:00 PM | Sat: 10:00 AM – 3:00 PM | Sun: Closed',
      features: ['Domain Northside Private Suite', 'Same-Day Crypto / Wire Liquidity', 'Estate & Heirloom Appraisals', 'Walk-Ins Welcome'],
    },
    {
      name: 'San Antonio — Riverwalk',
      address: '849 E Commerce St',
      city: 'San Antonio',
      state: 'TX',
      zip: '78205',
      phone: '(210) 555-GOLD (4653)',
      email: 'sanantonio@texasgoldbuyers.com',
      hours: 'Mon – Fri: 9:00 AM – 5:30 PM | Sat: 10:00 AM – 3:00 PM | Sun: Closed',
      features: ['Downtown Historic Financial Building', 'High-Volume Scrap & Bullion Desk', 'GIA Certified Staff', 'Direct Wire Payouts'],
    },
  ];

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tgb-gold/10 border border-tgb-gold/20 text-tgb-gold text-xs font-semibold uppercase">
            <Building className="w-3.5 h-3.5" /> 4 Texas Flagship Lounges
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Our Texas Locations
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Visit any of our secure, private appraisal suites across Dallas, Houston, Austin, and San Antonio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {branches.map((b, i) => (
            <div key={i} className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl hover:border-tgb-gold/40 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-tgb-gold" />
                  {b.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Address:</span> {b.address}, {b.city}, {b.state} {b.zip}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-tgb-gold" />
                  <a href={`tel:${b.phone.replace(/\D/g, '')}`} className="text-white hover:text-tgb-gold font-mono font-bold">
                    {b.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-tgb-gold" />
                  <a href={`mailto:${b.email}`} className="text-gray-300 hover:text-white">
                    {b.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-tgb-gold" />
                  <span>{b.hours}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-tgb-navyborder">
                <div className="text-[11px] font-semibold uppercase text-tgb-gold mb-2">Lounge Amenities</div>
                <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-300">
                  {b.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tgb-gold"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="w-full py-3 bg-tgb-darknavy hover:bg-tgb-navylight border border-tgb-gold/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Schedule Appointment at This Location
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
