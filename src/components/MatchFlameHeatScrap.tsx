import React, { useState, useRef, useEffect } from 'react';
import { Flame, Sparkles, AlertCircle } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface MatchFlameHeatScrapProps {
  hiddenSecretText: string;
  isRevealed?: boolean;
  onRevealed?: () => void;
}

export const MatchFlameHeatScrap: React.FC<MatchFlameHeatScrapProps> = ({
  hiddenSecretText,
  isRevealed = false,
  onRevealed,
}) => {
  const [revealed, setRevealed] = useState(isRevealed);
  const [isStriking, setIsStriking] = useState(false);
  const [heatProgress, setHeatProgress] = useState(isRevealed ? 100 : 0);
  const [isDraggingMatch, setIsDraggingMatch] = useState(false);
  const [matchPos, setMatchPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Handle striking match
  const handleStrikeMatch = () => {
    if (revealed) return;
    noirAudio.playMatchStrike();
    setIsStriking(true);
    setHeatProgress(15);
  };

  // Heating up paper as user holds mouse/touch over scrap
  const startHeating = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isStriking || revealed) return;
    setIsDraggingMatch(true);
    updateMatchPosition(e);

    intervalRef.current = window.setInterval(() => {
      setHeatProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRevealed(true);
          noirAudio.playPaperRustle();
          if (onRevealed) onRevealed();
          return 100;
        }
        return prev + 6;
      });
    }, 120);
  };

  const stopHeating = () => {
    setIsDraggingMatch(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateMatchPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = Math.max(10, Math.min(rect.width - 10, clientX - rect.left));
    const y = Math.max(10, Math.min(rect.height - 10, clientY - rect.top));
    setMatchPos({ x, y });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDraggingMatch) {
      updateMatchPosition(e);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="relative my-4 rounded-xl border border-[#7a6442]/60 bg-[#120f0a] p-3.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#3d3221]">
        <div className="flex items-center gap-1.5 text-[11px] font-case font-bold tracking-widest text-[#e8c078] uppercase">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>Секретные невидимые чернила</span>
        </div>
        <span className="text-[10px] font-mono text-[#8a7b66]">
          {revealed ? '🔥 ПРОЯВЛЕНО' : isStriking ? '🔥 Удерживайте огонь' : '⚡ Требуется огонь'}
        </span>
      </div>

      {/* Interactive Paper Area */}
      <div
        ref={containerRef}
        onMouseDown={startHeating}
        onMouseUp={stopHeating}
        onMouseLeave={stopHeating}
        onMouseMove={handleMove}
        onTouchStart={startHeating}
        onTouchEnd={stopHeating}
        onTouchMove={handleMove}
        className={`relative min-h-[90px] rounded-lg p-3 select-none transition-all duration-300 ${
          revealed
            ? 'texture-aged-paper border border-[#8f7752] shadow-md'
            : isStriking
            ? 'bg-[#2b2214] border border-orange-500/50 cursor-crosshair'
            : 'bg-[#18150f] border border-[#382f1f] cursor-pointer'
        }`}
      >
        {/* Subtle Heat Glow on Paper while holding match */}
        {isDraggingMatch && !revealed && (
          <div
            className="absolute pointer-events-none w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-orange-400/35 via-yellow-600/15 to-transparent blur-md transition-transform"
            style={{ left: `${matchPos.x}px`, top: `${matchPos.y}px` }}
          />
        )}

        {/* Charred/Burnt edge vintage aesthetic when heated */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 ${heatProgress * 0.4}px rgba(139, 69, 19, ${heatProgress * 0.008})`,
            backgroundColor: revealed ? 'transparent' : `rgba(230, 200, 150, ${heatProgress * 0.007})`,
          }}
        />

        {/* The Secret Text (Reveals progressively from invisible to toasted brown ink) */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center min-h-[64px]">
          {revealed ? (
            <div className="animate-fadeIn space-y-1">
              <span className="text-[9.5px] font-mono tracking-widest text-[#7a481e] uppercase font-bold">
                [ ТОЛЬКО ДЛЯ ТВОИХ ГЛАЗ // ПРОЯВЛЕНО ТЕПЛОМ ]
              </span>
              <p className="font-['Caveat',cursive] text-lg sm:text-xl font-bold text-[#44220b] leading-tight px-2 drop-shadow-sm">
                &ldquo;{hiddenSecretText}&rdquo;
              </p>
            </div>
          ) : isStriking ? (
            <div className="space-y-1">
              <div
                className="font-['Caveat',cursive] text-base font-bold transition-all duration-300"
                style={{
                  color: `rgba(90, 45, 12, ${Math.max(0.1, heatProgress / 100)})`,
                  filter: `blur(${Math.max(0, (100 - heatProgress) * 0.05)}px)`,
                }}
              >
                {hiddenSecretText}
              </div>
              <p className="text-[11px] font-mono text-orange-300/80 animate-pulse">
                Barmog&apos;ingizni ushlab turing ({heatProgress}%) — Qog&apos;oz qizimoqda...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center py-2">
              <p className="font-mono text-xs text-[#a3947e] italic">
                Bu qog&apos;oz parchasida limon sharbati bilan yozilgan yashirin xat bor...
              </p>
              <button
                type="button"
                onClick={handleStrikeMatch}
                className="mt-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white font-case font-bold text-[11px] tracking-wider flex items-center gap-1.5 shadow-[0_2px_8px_rgba(217,119,6,0.5)] active:scale-95 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-yellow-300" />
                <span>Gugurtni chaqish (Зажечь спичку)</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Matchstick Graphic when dragging */}
        {isDraggingMatch && !revealed && (
          <div
            className="absolute pointer-events-none z-30 transition-transform -translate-x-2 -translate-y-8 select-none"
            style={{ left: `${matchPos.x}px`, top: `${matchPos.y}px` }}
          >
            {/* Flame */}
            <div className="w-4 h-6 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 rounded-full blur-[0.5px] animate-pulse shadow-[0_0_12px_#ff9900]" />
            {/* Burnt match stick */}
            <div className="w-1.5 h-7 bg-[#4a2e18] -mt-1 rounded-b-sm border-t-2 border-[#1a1006]" />
          </div>
        )}
      </div>

      {/* Footer hint */}
      {!revealed && isStriking && (
        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#8a7b66]">
          <span>Maslahat: Ekranga bosib turing, olov harorati xatni qoraytiradi.</span>
          <span className="text-orange-400 font-bold">{heatProgress}%</span>
        </div>
      )}
    </div>
  );
};
