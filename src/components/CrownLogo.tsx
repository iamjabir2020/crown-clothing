import React from 'react';

interface CrownLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const CrownLogo: React.FC<CrownLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  lightMode = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base tracking-widest',
    md: 'text-xl tracking-[0.25em]',
    lg: 'text-2xl tracking-[0.3em]',
  };

  const subtextSizes = {
    sm: 'text-[9px] tracking-[0.3em]',
    md: 'text-[10px] tracking-[0.35em]',
    lg: 'text-xs tracking-[0.4em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Crown emblem with blue and red fleur-de-lis elements */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer Royal Shield / Crest subtle contour */}
          <path
            d="M50 5 L88 20 C88 58 68 85 50 95 C32 85 12 58 12 20 Z"
            fill={lightMode ? '#0f172a' : '#ffffff'}
            stroke="#1e3a8a"
            strokeWidth="3.5"
            className="transition-colors"
          />

          {/* Golden / Royal Inner Base Arch */}
          <path
            d="M26 62 Q50 67 74 62 L74 67 Q50 72 26 67 Z"
            fill="#d97706"
          />

          {/* Crown Base Crown Band */}
          <path
            d="M24 55 H76 V62 H24 Z"
            fill="#1e3a8a"
          />

          {/* Crown Spikes / Coronet */}
          {/* Left Wing */}
          <polygon points="24,55 30,35 40,55" fill="#1e3a8a" />
          {/* Right Wing */}
          <polygon points="76,55 70,35 60,55" fill="#1e3a8a" />
          {/* Center Crown Peak */}
          <polygon points="42,55 50,28 58,55" fill="#1e3a8a" />

          {/* Central Red Fleur-de-lis Petals */}
          {/* Center Petal */}
          <path
            d="M50 34 C47 40 46 45 47 50 C49 49 51 49 53 50 C54 45 53 40 50 34 Z"
            fill="#dc2626"
          />
          {/* Left Fleur Curve */}
          <path
            d="M48 45 C44 43 40 45 42 49 C45 51 47 48 48 45 Z"
            fill="#dc2626"
          />
          {/* Right Fleur Curve */}
          <path
            d="M52 45 C56 43 60 45 58 49 C55 51 53 48 52 45 Z"
            fill="#dc2626"
          />
          {/* Fleur Horizontal Band */}
          <rect x="44" y="49" width="12" height="2" rx="1" fill="#f59e0b" />

          {/* Crown Jewels on Spikes (Red & Blue) */}
          <circle cx="30" cy="33" r="2.5" fill="#dc2626" />
          <circle cx="50" cy="26" r="3" fill="#f59e0b" stroke="#dc2626" strokeWidth="1" />
          <circle cx="70" cy="33" r="2.5" fill="#dc2626" />

          {/* Base Jewels */}
          <circle cx="36" cy="58.5" r="1.8" fill="#ffffff" />
          <circle cx="50" cy="58.5" r="2.2" fill="#dc2626" />
          <circle cx="64" cy="58.5" r="1.8" fill="#ffffff" />

          {/* Fleur-de-lis lower tie */}
          <polygon points="48,51 52,51 50,54" fill="#dc2626" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-serif font-bold uppercase ${textSizes[size]} ${
              lightMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            CROWN
          </span>
          <span
            className={`font-sans font-medium uppercase text-rose-600 ${subtextSizes[size]}`}
          >
            CLOTHING
          </span>
        </div>
      )}
    </div>
  );
};
