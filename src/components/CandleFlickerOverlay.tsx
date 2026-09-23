import React from 'react';

interface CandleFlickerOverlayProps {
  isActive: boolean;
  onToggle: () => void;
}

export const CandleFlickerOverlay: React.FC<CandleFlickerOverlayProps> = ({
  isActive,
  onToggle,
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-1000">
      {/* Heavy vignette shadow covering borders */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />

      {/* Warm flickering golden amber candlelight radial glow */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-color-dodge animate-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(255, 180, 70, 0.45) 0%, rgba(180, 100, 20, 0.25) 45%, rgba(10, 8, 5, 0.85) 85%)',
          animationDuration: '3.2s',
        }}
      />

      {/* Floating candle flame icon with controls in bottom left */}
      <div className="absolute bottom-5 left-5 pointer-events-auto flex items-center gap-2 bg-[#1b150c]/90 border border-[#caa04b]/60 px-3.5 py-1.5 rounded-full shadow-[0_4px_20px_rgba(202,160,75,0.4)] backdrop-blur-md">
        {/* Animated burning candle flame */}
        <div className="relative w-3.5 h-6 flex flex-col items-center justify-end">
          <div className="w-1.5 h-3 bg-gradient-to-t from-orange-500 via-yellow-300 to-white rounded-full animate-bounce shadow-[0_0_8px_#ffb732]" />
          <div className="w-2.5 h-3 bg-amber-900 rounded-t-xs" />
        </div>

        <span className="text-[11px] font-mono text-[#ffd977] font-bold tracking-wider">
          SHAM SHULASI YONMOQDA
        </span>

        <button
          type="button"
          onClick={onToggle}
          className="ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#caa04b]/20 hover:bg-[#caa04b]/40 text-[#ffd977] border border-[#caa04b]/40 cursor-pointer transition-colors"
        >
          O&apos;chirish
        </button>
      </div>
    </div>
  );
};
