'use client';

import React, { useEffect, useState } from 'react';
import { SpotPrices } from '@/types';
import { itemService } from '@/services';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

export const LiveSpotTicker: React.FC = () => {
  const [spots, setSpots] = useState<SpotPrices | null>(null);

  useEffect(() => {
    itemService.getSpotPrices().then(setSpots);
  }, []);

  if (!spots) return null;

  return (
    <div className="bg-tgb-darknavy/90 border-b border-tgb-navyborder/80 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Market Status */}
        <div className="flex items-center gap-2 text-tgb-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="font-medium text-gray-300">LIVE TEXAS SPOT MARKET:</span>
        </div>

        {/* Spot Rates Carousel / Bar */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {/* Gold */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-tgb-gold font-bold">GOLD (oz):</span>
            <span className="font-mono font-semibold text-white">${spots.goldOz.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="flex items-center text-[10px] text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" /> +${spots.changeGold24h}
            </span>
          </div>

          {/* Silver */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-gray-300 font-bold">SILVER (oz):</span>
            <span className="font-mono font-semibold text-white">${spots.silverOz.toFixed(2)}</span>
            <span className="flex items-center text-[10px] text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" /> +${spots.changeSilver24h}
            </span>
          </div>

          {/* Platinum */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-cyan-300 font-bold">PLATINUM (oz):</span>
            <span className="font-mono font-semibold text-white">${spots.platinumOz.toFixed(2)}</span>
            <span className="flex items-center text-[10px] text-rose-400 font-medium">
              <TrendingDown className="w-3 h-3" /> ${spots.changePlatinum24h}
            </span>
          </div>
        </div>

        {/* Guarantee Tag */}
        <div className="hidden lg:flex items-center gap-1.5 text-tgb-gold text-[11px] font-medium">
          <Clock className="w-3 h-3" />
          <span>Locked Spot Pricing Guaranteed at Counter</span>
        </div>
      </div>
    </div>
  );
};

export default LiveSpotTicker;
