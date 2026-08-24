import React from 'react';
import { Shield } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-tgb-darknavy flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-tgb-navy border border-tgb-gold/30 flex items-center justify-center animate-pulse">
        <Shield className="w-6 h-6 text-tgb-gold" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white font-display tracking-wide">
          Loading Texas Gold Buyers
        </h3>
        <p className="text-xs text-gray-500 font-mono">Retrieving secure data...</p>
      </div>
    </div>
  );
}
