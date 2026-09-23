import React from 'react';

export type WaxSealType = 'classic_crest' | 'heart_lock' | 'classified_star' | 'skull_noir' | 'custom_initials';

interface CustomWaxSealProps {
  type?: WaxSealType;
  initials?: string;
  color?: 'crimson' | 'burgundy' | 'gold_bronze' | 'midnight_blue';
  size?: number;
  className?: string;
}

export const CustomWaxSeal: React.FC<CustomWaxSealProps> = ({
  type = 'classic_crest',
  initials = 'AL',
  color = 'crimson',
  size = 56,
  className = '',
}) => {
  // Wax colors
  const colorGradients = {
    crimson: {
      outer: 'from-[#8e1a1a] via-[#b52828] to-[#5a0c0c]',
      inner: 'from-[#6c1212] via-[#a82222] to-[#450909]',
      border: 'border-[#df4545]/40',
      shadow: 'shadow-[0_4px_14px_rgba(181,40,40,0.45)]',
      highlight: '#ff8a8a',
    },
    burgundy: {
      outer: 'from-[#521024] via-[#7a1835] to-[#360815]',
      inner: 'from-[#420a1c] via-[#6d132e] to-[#28040d]',
      border: 'border-[#aa2b4e]/40',
      shadow: 'shadow-[0_4px_14px_rgba(122,24,53,0.45)]',
      highlight: '#e86687',
    },
    gold_bronze: {
      outer: 'from-[#8a6828] via-[#caa04b] to-[#5a4214]',
      inner: 'from-[#694e1d] via-[#b38a37] to-[#44300d]',
      border: 'border-[#ffd977]/50',
      shadow: 'shadow-[0_4px_14px_rgba(202,160,75,0.45)]',
      highlight: '#fff3cb',
    },
    midnight_blue: {
      outer: 'from-[#14233c] via-[#213b63] to-[#0c1626]',
      inner: 'from-[#101c30] via-[#1a3256] to-[#080e18]',
      border: 'border-[#4a72ad]/40',
      shadow: 'shadow-[0_4px_14px_rgba(33,59,99,0.45)]',
      highlight: '#87adff',
    },
  };

  const currentTheme = colorGradients[color] || colorGradients.crimson;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Irregular dripping organic wax edge SVG backdrop */}
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 w-full h-full drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)]`}
      >
        <defs>
          <radialGradient id={`waxGrad-${color}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={currentTheme.highlight} stopOpacity="0.4" />
            <stop offset="45%" stopColor={color === 'gold_bronze' ? '#caa04b' : color === 'midnight_blue' ? '#213b63' : '#b52828'} />
            <stop offset="90%" stopColor={color === 'gold_bronze' ? '#44300d' : color === 'midnight_blue' ? '#080e18' : '#450909'} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
          </radialGradient>
        </defs>
        {/* Organic wavy melting wax disc */}
        <path
          d="M 50 4 
             C 62 3, 76 8, 86 19 
             C 96 30, 99 44, 96 58 
             C 93 72, 85 86, 73 93 
             C 60 99, 44 98, 30 94 
             C 17 90, 6 80, 3 67 
             C 1 54, 5 40, 12 28 
             C 20 15, 36 5, 50 4 Z"
          fill={`url(#waxGrad-${color})`}
          stroke={currentTheme.highlight}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
        {/* Secondary wax melt rim */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="#000"
          strokeOpacity="0.35"
          strokeWidth="2.5"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={currentTheme.highlight}
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </svg>

      {/* Raised center seal stamp emblem */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {type === 'custom_initials' ? (
          <span
            className="font-case font-black tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
            style={{
              fontSize: size * 0.28,
              color: currentTheme.highlight,
              textShadow: '0 0 2px rgba(0,0,0,0.8)',
            }}
          >
            {initials.slice(0, 3)}
          </span>
        ) : type === 'heart_lock' ? (
          <svg
            width={size * 0.42}
            height={size * 0.42}
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: currentTheme.highlight }}
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] opacity-95"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : type === 'classified_star' ? (
          <svg
            width={size * 0.42}
            height={size * 0.42}
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: currentTheme.highlight }}
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] opacity-95"
          >
            <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
          </svg>
        ) : (
          /* Classic Heraldic Shield Crest */
          <svg
            width={size * 0.44}
            height={size * 0.44}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: currentTheme.highlight }}
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] opacity-95"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
            <line x1="12" y1="6" x2="12" y2="16" />
            <line x1="8" y1="10" x2="16" y2="10" />
          </svg>
        )}
      </div>
    </div>
  );
};
