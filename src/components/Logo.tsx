import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'stacked';
  theme?: 'dark' | 'light';
}

export const TexasGoldBuyersLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'dark',
}) => {
  const sizeMap = {
    sm: 36,
    md: 48,
    lg: 72,
    xl: 96,
  };

  const dim = sizeMap[size];

  const EmblemImage = (
    <div
      className="relative shrink-0 rounded-full overflow-hidden shadow-lg border border-tgb-gold/30 bg-black flex items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      <Image
        src="/brand/texas-gold-buyers-logo.png"
        alt="Texas Gold Buyers Official Logo"
        width={dim}
        height={dim}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{EmblemImage}</div>;
  }

  const textColorTexas = theme === 'dark' ? 'text-white' : 'text-tgb-darknavy';
  const textColorGold = '#C99A3E';

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        {EmblemImage}
        <div className="mt-2 text-center">
          <span
            className={`font-black tracking-[0.22em] uppercase leading-none block font-sans ${textColorTexas}`}
            style={{ fontSize: dim * 0.42 }}
          >
            TEXAS
          </span>
          <span
            className="font-bold tracking-[0.28em] uppercase leading-tight block font-sans mt-0.5"
            style={{ color: textColorGold, fontSize: dim * 0.22 }}
          >
            GOLD BUYERS
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold block mt-0.5">
            TEXAN OWNED & OPERATED
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {EmblemImage}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-[0.2em] uppercase leading-none font-sans ${textColorTexas}`}
          style={{ fontSize: Math.max(16, dim * 0.4) }}
        >
          TEXAS
        </span>
        <span
          className="font-bold tracking-[0.28em] uppercase leading-tight font-sans mt-0.5"
          style={{ color: textColorGold, fontSize: Math.max(11, dim * 0.24) }}
        >
          GOLD BUYERS
        </span>
        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-gray-400 font-semibold mt-0.5">
          Texan Owned & Operated
        </span>
      </div>
    </div>
  );
};

export default TexasGoldBuyersLogo;
