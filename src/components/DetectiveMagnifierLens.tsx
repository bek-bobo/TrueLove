import React, { useState, useRef } from 'react';
import { Search, Sparkles, Hand } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';

interface DetectiveMagnifierLensProps {
  hiddenClueText?: string;
  className?: string;
}

export const DetectiveMagnifierLens: React.FC<DetectiveMagnifierLensProps> = ({
  hiddenClueText = "DALIL #08: Ushbu maktub qahva hidini saqlab qolgan. 21:00 da o'sha yerda kutaman.",
  className = '',
}) => {
  // Center of the optical circular lens
  const [lensPos, setLensPos] = useState<{ x: number; y: number }>({ x: 95, y: 55 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Offset from touch point to lens center:
  // The handle is held lower at bottom-right of the lens (~52px right, ~74px down).
  // Therefore, lens center is: pointerX - 52, pointerY - 74.
  // This positions the glass high above the user's thumb so the finger never obstructs the clue!
  const HANDLE_OFFSET_X = 52;
  const HANDLE_OFFSET_Y = 74;

  const updateCoordinates = (clientX: number, clientY: number, isTouch = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate raw pointer position relative to board
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;

    // Offset lens center so finger rests comfortably lower on the handle
    const targetLensX = pointerX - HANDLE_OFFSET_X;
    const targetLensY = pointerY - HANDLE_OFFSET_Y;

    // Clamp lens within viewable borders
    const clampedX = Math.max(34, Math.min(rect.width - 34, targetLensX));
    const clampedY = Math.max(26, Math.min(rect.height - 24, targetLensY));

    setLensPos({ x: clampedX, y: clampedY });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateCoordinates(e.clientX, e.clientY, e.pointerType === 'touch');
    noirAudio.playPaperRustle();
    hapticFeedback.dustSweep();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateCoordinates(e.clientX, e.clientY, e.pointerType === 'touch');
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    hapticFeedback.safeDialTick();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* Top Helper Label */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span className="text-[10.5px] font-mono text-[#caa04b] flex items-center gap-1.5 font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>🔎 Lupani dastasidan ushlab matn ustida suring:</span>
        </span>
        <span className="text-[9px] font-mono text-[#a89b88] flex items-center gap-1 animate-pulse">
          <Hand className="w-2.5 h-2.5 text-[#caa04b]" />
          <span>Dasta barmoq ostida</span>
        </span>
      </div>

      {/* Main Inspection Board with Optical Reveal */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative min-h-[160px] sm:min-h-[165px] p-4 pb-8 bg-[#14120f] border-2 border-[#52442e] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing touch-none shadow-[inset_0_2px_15px_rgba(0,0,0,0.85)]"
      >
        {/* Document Header Marker */}
        <div className="flex items-center justify-between text-[9px] font-mono text-[#78664d] border-b border-[#3b301f] pb-1 mb-2">
          <span>ARXIV XULOSASI // MAXFIY QAYD</span>
          <span>№ 08-QAHVA DOG&apos;I</span>
        </div>

        {/* LAYER 1: Base background text (Coffee-blurred, smudged, unreadable to naked eye) */}
        <div className="relative py-2">
          <p className="font-mono text-sm sm:text-base tracking-wide text-[#8a7251] filter blur-[3px] opacity-40 leading-relaxed select-none pointer-events-none">
            {hiddenClueText}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[8.5px] font-mono text-[#544633]">
            <span>[ Siyoh qahva dog&apos;i ostida qolgan — matn ko&apos;rinmaydi ]</span>
          </div>
        </div>

        {/* LAYER 2: Crystal-clear, high-contrast magnified text REVEALED ONLY under circular lens clip-path */}
        <div
          className="absolute inset-0 p-4 pb-8 pointer-events-none transition-none"
          style={{
            clipPath: `circle(44px at ${lensPos.x}px ${lensPos.y}px)`,
            backgroundColor: 'rgba(28, 22, 14, 0.96)',
          }}
        >
          {/* Header replica inside lens */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#caa04b] border-b border-[#caa04b]/40 pb-1 mb-2">
            <span>ARXIV XULOSASI // MAXFIY QAYD</span>
            <span>[ 3x OPTIK KATTALASHTIRISH ]</span>
          </div>

          <div className="relative py-2">
            <p className="font-mono font-bold text-sm sm:text-base tracking-wide text-[#ffe89d] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-relaxed">
              {hiddenClueText}
            </p>
          </div>
        </div>

        {/* LAYER 3: The Vintage Brass Magnifying Glass Frame following pointer position */}
        <div
          className="absolute pointer-events-none transition-transform duration-75 ease-out z-30"
          style={{
            left: `${lensPos.x}px`,
            top: `${lensPos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Circular Brass Rim (Elevated above finger) */}
          <div className="relative w-[92px] h-[92px] rounded-full border-[3.5px] border-[#caa04b] shadow-[0_0_20px_rgba(0,0,0,0.95),inset_0_0_12px_rgba(202,160,75,0.4)] flex items-center justify-center">
            {/* Glass Curvature Reflection */}
            <div className="absolute top-2 left-3 w-7 h-2 rounded-full bg-white/35 rotate-[-30deg] pointer-events-none" />

            {/* Subtle Center Optical Crosshair */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#caa04b]/40 pointer-events-none" />

            {/* Brass & Dark Oak Turned Handle (Extended lower so finger never covers lens) */}
            <div className="absolute -bottom-15 -right-15 w-24 h-5 bg-gradient-to-r from-[#3b2512] via-[#5c3a1b] to-[#241508] rounded-full border-2 border-[#b88c42] rotate-45 shadow-[3px_8px_16px_rgba(0,0,0,0.95)] pointer-events-none flex items-center justify-between px-2">
              {/* Handle Brass Ring Ferrule */}
              <div className="w-3 h-full bg-[#d4af58] rounded-xs border-r border-[#694d1b]" />
              
              {/* Finger placement tactile ribs */}
              <div className="flex gap-1.5 opacity-75">
                <div className="w-0.5 h-3.5 bg-[#e8c878]" />
                <div className="w-0.5 h-3.5 bg-[#e8c878]" />
                <div className="w-0.5 h-3.5 bg-[#e8c878]" />
                <div className="w-0.5 h-3.5 bg-[#e8c878]" />
              </div>

              {/* End Brass Cap */}
              <div className="w-2.5 h-full bg-[#d4af58] rounded-full border-l border-[#694d1b]" />
            </div>

            {/* Visual Touch Target Cue positioned right on the lower handle grip */}
            <div className="absolute top-[120px] left-[98px] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#caa04b] bg-amber-400/20 animate-ping" />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-[#caa04b] border border-[#ffe082] shadow-[0_0_8px_#caa04b]" />
              {!isDragging && (
                <span className="absolute -bottom-5 font-mono text-[8px] font-bold text-[#ffd977] whitespace-nowrap bg-black/90 px-1.5 py-0.5 rounded border border-[#caa04b]/50 shadow-md">
                  [ 👆 Dastani shu yerdan ushlang ]
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
