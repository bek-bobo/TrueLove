import React from 'react';

// Golden Bulldog Binder Clip
export const BulldogClip: React.FC<{ className?: string; orientation?: 'top' | 'side' }> = ({
  className = '',
  orientation = 'top',
}) => {
  return (
    <div
      className={`relative inline-block pointer-events-none select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)] ${className}`}
      aria-hidden="true"
    >
      <svg
        width="34"
        height="30"
        viewBox="0 0 40 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={orientation === 'side' ? 'rotate-90' : ''}
      >
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d78c" />
            <stop offset="35%" stopColor="#caa04b" />
            <stop offset="70%" stopColor="#7c5c21" />
            <stop offset="100%" stopColor="#d8b461" />
          </linearGradient>
          <linearGradient id="brassDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#443213" />
            <stop offset="100%" stopColor="#1a1408" />
          </linearGradient>
        </defs>

        {/* Wire Loop handle top */}
        <path
          d="M 12 18 C 12 6, 28 6, 28 18"
          stroke="url(#brassGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Clip Body clamp */}
        <rect x="5" y="16" width="30" height="15" rx="2" fill="url(#brassDark)" />
        <rect x="7" y="18" width="26" height="11" rx="1.5" fill="url(#brassGrad)" />
        <rect x="9" y="20" width="22" height="7" rx="1" fill="#2d2211" />

        {/* Highlights */}
        <line x1="6" y1="17" x2="34" y2="17" stroke="#fff4cc" strokeOpacity="0.4" strokeWidth="1" />
      </svg>
    </div>
  );
};

// Wire Paperclip (Silver / Brass)
export const WirePaperclip: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-block pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${className}`}>
      <svg width="22" height="34" viewBox="0 0 24 38" fill="none">
        <path
          d="M 7 12 L 7 28 C 7 34, 17 34, 17 28 L 17 7 C 17 2, 3 2, 3 9 L 3 31 C 3 38, 21 38, 21 30 L 21 14"
          stroke="#b0bcc7"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 7.5 12 L 7.5 28 C 7.5 33, 16.5 33, 16.5 28 L 16.5 7"
          stroke="#eef4f8"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// Brass Rivet / Button on Cover
export const BrassRivet: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 18 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br from-[#f8df93] via-[#b38634] to-[#4e3713] shadow-[0_2px_6px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center p-[2px] border border-[#ffecb3]/40 ${className}`}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#694e1d] to-[#deb55d] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1e1507] shadow-inner" />
      </div>
    </div>
  );
};

// Stamped Star / Seal Emblem
export const VintageSealStar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#caa04b]">
        {/* 8-point vintage star */}
        <polygon points="12,1 14.5,8 22,8.5 16,13.5 18,21 12,16.5 6,21 8,13.5 2,8.5 9.5,8" opacity="0.9" />
      </svg>
    </div>
  );
};

// Coffee Ring Stain Overlay SVG
export const CoffeeStain: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 100 }) => {
  return (
    <div className={`pointer-events-none select-none opacity-45 mix-blend-multiply ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#6b4724]">
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4.5" strokeDasharray="30 8 18 12 40 6" strokeOpacity="0.4" />
        <circle cx="48" cy="49" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 12 25 15" strokeOpacity="0.3" />
        <ellipse cx="58" cy="46" rx="8" ry="4" fill="currentColor" fillOpacity="0.15" />
        <ellipse cx="36" cy="62" rx="5" ry="3" fill="currentColor" fillOpacity="0.12" />
      </svg>
    </div>
  );
};
