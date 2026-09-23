import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Sparkles, Wind } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';

interface SecretDustWiperProps {
  text: string;
  fontClass: string;
}

export const SecretDustWiper: React.FC<SecretDustWiperProps> = ({ text, fontClass }) => {
  // Wipe progress percentage from 0 to 100
  const [wipeProgress, setWipeProgress] = useState<number>(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState<boolean>(false);
  const [isWiping, setIsWiping] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const accumulatedDistanceRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFullyRevealed) return;
    setIsWiping(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    noirAudio.playPaperRustle();
    hapticFeedback.dustSweep();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isWiping || isFullyRevealed || !lastPosRef.current) return;

    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    lastPosRef.current = { x: e.clientX, y: e.clientY };

    if (dist > 3) {
      accumulatedDistanceRef.current += dist;

      // 280px total stroke length roughly needed to wipe clean
      const newProgress = Math.min(100, Math.round((accumulatedDistanceRef.current / 220) * 100));
      setWipeProgress(newProgress);

      // Play soft rustle and haptic every few strokes
      if (Math.round(newProgress) % 15 === 0) {
        noirAudio.playPaperRustle();
        hapticFeedback.dustSweep();
      }

      // If user wiped enough (> 65%), auto-reveal completely!
      if (newProgress >= 65) {
        setIsFullyRevealed(true);
        setWipeProgress(100);
        noirAudio.playSealOpen();
        hapticFeedback.secretRevealed();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsWiping(false);
    lastPosRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleResetDust = () => {
    noirAudio.playPaperRustle();
    hapticFeedback.safeDialTick();
    setWipeProgress(0);
    setIsFullyRevealed(false);
    accumulatedDistanceRef.current = 0;
  };

  const handleQuickReveal = () => {
    setIsFullyRevealed(true);
    setWipeProgress(100);
    noirAudio.playSealOpen();
    hapticFeedback.secretRevealed();
  };

  return (
    <div className="space-y-1.5 select-none">
      {/* Top Header bar with status and action buttons */}
      <div className="flex items-center justify-between gap-2 border-b border-[#a83232]/30 pb-1">
        <span className="font-case font-bold text-[9px] tracking-wider text-[#d45b5b] border border-[#a83232]/50 bg-[#381616]/60 px-1.5 py-0.5 rounded-xs flex items-center gap-1">
          <Wind className="w-2.5 h-2.5 text-[#e48383]" />
          <span>[ KO&apos;MIR CHANGI // @SECRET ]</span>
        </span>

        <div className="flex items-center gap-2">
          {isFullyRevealed ? (
            <button
              type="button"
              onClick={handleResetDust}
              className="text-[9.5px] text-[#caa04b] hover:text-[#ffd977] flex items-center gap-1 cursor-pointer font-mono"
              title="Qayta chang bilan yopish"
            >
              <EyeOff className="w-3 h-3" />
              <span>Yopish</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleQuickReveal}
              className="text-[9.5px] text-[#8e806c] hover:text-[#caa04b] flex items-center gap-1 cursor-pointer font-mono"
              title="To'g'ridan-to'g'ri ochish"
            >
              <Eye className="w-3 h-3" />
              <span>Tezkor ochish</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Dust Layer Container (High-contrast charcoal encrypted slate) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative overflow-hidden rounded-lg p-3 bg-[#111319] border-2 border-[#caa04b]/70 shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)] touch-none cursor-grab active:cursor-grabbing transition-all min-h-[48px] flex items-center"
      >
        {/* Underneath: The Secret Message (Bright, crisp and high-contrast on dark charcoal slate) */}
        <p className={`${fontClass} relative z-10 transition-all font-mono font-bold tracking-wider text-xs sm:text-[13px] break-words select-text ${
          isFullyRevealed ? 'text-[#fff1c2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]' : 'text-[#c7baa4]'
        }`}>
          {text}
        </p>

        {/* Overlay: Vintage Coal/Carbon Dust Blanket */}
        {!isFullyRevealed && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-150 pointer-events-none select-none bg-gradient-to-r from-[#0d0c0a] via-[#1a1612] to-[#0c0b09]"
            style={{
              opacity: Math.max(0, 1 - wipeProgress / 75),
              filter: `contrast(${1 + wipeProgress * 0.01})`,
            }}
          >
            {/* Visual soot / coal grain dots */}
            <div className="absolute inset-0 opacity-40 texture-aged-paper pointer-events-none" />

            {/* Instruction tooltip inside dust */}
            <div className="relative z-10 flex items-center gap-1.5 text-[10.5px] font-mono text-[#a89578] px-2 py-1 rounded bg-black/60 border border-[#3b3223] shadow-md animate-pulse">
              <span>🧹 Barmog&apos;ingiz bilan changni arting...</span>
              <span className="text-[9px] text-[#caa04b] font-bold">
                ({wipeProgress}%)
              </span>
            </div>

            {/* Soft charcoal powder smudge marks */}
            <div
              className="absolute h-1 bg-[#caa04b]/40 rounded-full blur-[1px] transition-all"
              style={{
                width: `${wipeProgress}%`,
                bottom: '4px',
                left: '6px',
              }}
            />
          </div>
        )}

        {/* Revealed Sparkle Badge */}
        {isFullyRevealed && (
          <div className="absolute top-1 right-1.5 pointer-events-none opacity-80">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd977] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
