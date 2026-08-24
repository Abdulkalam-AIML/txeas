import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'stacked';
  theme?: 'dark' | 'light'; // dark background (default) or light background
}

export const TexasGoldBuyersLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'dark',
}) => {
  // Dimensions
  const heightMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 84,
  };

  const currentHeight = heightMap[size];

  // Star Icon SVG
  const StarIcon = (
    <svg
      viewBox="0 0 100 100"
      className="shrink-0 drop-shadow-sm"
      style={{ height: currentHeight, width: currentHeight }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 5-pointed Gold Star */}
      <polygon
        points="50,6 64,36 97,38 72,61 79,94 50,76 21,94 28,61 3,38 36,36"
        fill="#C99A3E"
        stroke="#E2BD69"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Subtle Star Facet Gradient overlay */}
      <polygon
        points="50,6 64,36 50,76"
        fill="#E2BD69"
        opacity="0.25"
      />
      {/* T Inset */}
      <g fill={theme === 'dark' ? '#071522' : '#071522'}>
        {/* Top bar of T */}
        <rect x="34" y="32" width="32" height="7.5" rx="1" />
        {/* Stem of T */}
        <rect x="44.5" y="38" width="11" height="28" rx="1" />
      </g>
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{StarIcon}</div>;
  }

  const textColorTexas = theme === 'dark' ? 'text-white' : 'text-tgb-darknavy';
  const textColorGold = '#C99A3E';

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        {StarIcon}
        <div className="mt-2 text-center">
          <span
            className={`font-black tracking-[0.22em] uppercase leading-none block font-sans ${textColorTexas}`}
            style={{ fontSize: currentHeight * 0.45 }}
          >
            TEXAS
          </span>
          <span
            className="font-bold tracking-[0.32em] uppercase leading-tight block font-sans"
            style={{ color: textColorGold, fontSize: currentHeight * 0.26 }}
          >
            GOLD BUYERS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {StarIcon}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-[0.22em] uppercase leading-none font-sans ${textColorTexas}`}
          style={{ fontSize: currentHeight * 0.46 }}
        >
          TEXAS
        </span>
        <span
          className="font-bold tracking-[0.34em] uppercase leading-tight font-sans mt-1"
          style={{ color: textColorGold, fontSize: currentHeight * 0.26 }}
        >
          GOLD BUYERS
        </span>
      </div>
    </div>
  );
};

export default TexasGoldBuyersLogo;
