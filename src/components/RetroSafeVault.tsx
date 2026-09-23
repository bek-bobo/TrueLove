import React, { useState, useRef, useEffect, useCallback } from 'react';
import { KeyRound, Sparkles, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';

interface RetroSafeVaultProps {
  targetCombination?: [number, number]; // e.g. [19, 8]
  secretClueTitle?: string;
  secretClueText?: string;
  hint?: string;
}

export const RetroSafeVault: React.FC<RetroSafeVaultProps> = ({
  targetCombination = [19, 8],
  secretClueTitle = 'PAUZA DAVRIDAGI PO\'LAT SEYF',
  secretClueText = '«O\'sha kuni aytilmagan haqiqat: Men har bir daqiqani eslab qolganman. Vaqt to\'xtagan edi.»',
  hint = 'Ko\'rsatma: Birinchi uchrashgan sana (19) va oy (08)',
}) => {
  const [currentNum, setCurrentNum] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0); // in degrees
  const [enteredCombo, setEnteredCombo] = useState<number[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dialRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number>(0);
  const lastTickNumRef = useRef<number>(0);

  // 40 total increments on a standard vault dial (0 to 39)
  // Each increment is 360 / 40 = 9 degrees
  const updateNumberFromAngle = useCallback((deg: number) => {
    // Normalize to [0, 360)
    let normalized = deg % 360;
    if (normalized < 0) normalized += 360;
    
    // Reverse dial mapping so clockwise or counterclockwise matches standard top index
    const num = Math.round(normalized / 9) % 40;
    if (num !== lastTickNumRef.current) {
      noirAudio.playSafeClick();
      hapticFeedback.safeDialTick();
      lastTickNumRef.current = num;
      setCurrentNum(num);
    }
  }, []);

  const getAngleAndDistance = (clientX: number, clientY: number) => {
    if (!dialRef.current) return { angle: 0, dist: 0 };
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI;
    const dist = Math.hypot(dx, dy);
    return { angle: deg, dist };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isUnlocked) return;
    const { angle, dist } = getAngleAndDistance(e.clientX, e.clientY);
    
    // If user tapped directly inside the central hub (< 38px radius), do not initiate rotational drag
    if (dist < 38) {
      return;
    }

    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    lastAngleRef.current = angle;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isUnlocked) return;
    const { angle } = getAngleAndDistance(e.clientX, e.clientY);

    // Compute differential angle and normalize across the [-180, 180] discontinuity boundary
    let angleDiff = angle - lastAngleRef.current;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    lastAngleRef.current = angle;

    setRotationAngle((prev) => {
      const newTotal = prev + angleDiff;
      updateNumberFromAngle(newTotal);
      return newTotal;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Mouse wheel rotation support: smoothly rotates dial 9 degrees per tick
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isUnlocked) return;
    e.preventDefault();
    e.stopPropagation();
    const direction = e.deltaY > 0 ? 1 : -1;
    const step = direction * 9; // 1 dial increment = 9 degrees
    setRotationAngle((prev) => {
      const nextAngle = prev + step;
      updateNumberFromAngle(nextAngle);
      return nextAngle;
    });
  };

  // Step button click handlers for ultra-precise manual dialing
  const handleStepDial = (stepDir: number) => {
    if (isUnlocked) return;
    const step = stepDir * 9;
    setRotationAngle((prev) => {
      const next = prev + step;
      updateNumberFromAngle(next);
      return next;
    });
  };

  const handleSelectNumber = () => {
    noirAudio.playSafeClick();
    const nextCombo = [...enteredCombo, currentNum];
    
    // Check if this step is correct
    const expected = targetCombination[enteredCombo.length];
    if (currentNum === expected) {
      if (nextCombo.length === targetCombination.length) {
        // Safe unlocked!
        noirAudio.playSafeUnlock();
        hapticFeedback.safeUnlocked();
        setIsUnlocked(true);
        setEnteredCombo(nextCombo);
        setTimeout(() => setDoorOpen(true), 400);
      } else {
        hapticFeedback.stampThud();
        setEnteredCombo(nextCombo);
      }
    } else {
      // Wrong number, reset combo
      hapticFeedback.stampThud();
      setEnteredCombo([]);
    }
  };

  const handleResetVault = () => {
    noirAudio.playSafeClick();
    hapticFeedback.safeDialTick();
    setIsUnlocked(false);
    setDoorOpen(false);
    setEnteredCombo([]);
    setCurrentNum(0);
    setRotationAngle(0);
    lastTickNumRef.current = 0;
  };

  return (
    <div className="w-full my-3 p-4 bg-[#111319] border-2 border-[#3c3425] rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_10px_25px_rgba(0,0,0,0.8)] text-[#ded1bd] relative overflow-hidden select-none">
      {/* Heavy Steel Corner Rivets */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#1e222d] border border-[#534531] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8b7554]" />
      </div>
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#1e222d] border border-[#534531] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8b7554]" />
      </div>
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#1e222d] border border-[#534531] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8b7554]" />
      </div>
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#1e222d] border border-[#534531] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8b7554]" />
      </div>

      {/* Header Docket Bar */}
      <div className="flex items-center justify-between border-b border-[#2b2519] pb-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f0e2cb]">
          <KeyRound className="w-3.5 h-3.5 text-[#caa04b]" />
          <span className="font-case tracking-wider">KOMBINATSIYALI PO&apos;LAT SEYF</span>
        </div>

        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
          isUnlocked
            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
            : 'bg-red-950 border-red-800 text-red-300'
        }`}>
          {isUnlocked ? '[ OCHIQ // UNLOCKED ]' : '[ QULFLANGAN // ROTARY DIAL ]'}
        </span>
      </div>

      {/* Vault Door or Revealed Inside Secret */}
      {doorOpen ? (
        /* Inside Safe Content */
        <div className="p-3.5 rounded-xl bg-[#1a1510] border border-[#caa04b]/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#3d311d] pb-1.5">
            <span className="font-case text-[11px] font-bold text-[#ffd977] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{secretClueTitle}</span>
            </span>
            <button
              onClick={handleResetVault}
              className="text-[9.5px] font-mono text-[#a89b88] hover:text-white cursor-pointer underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Qayta qulflash</span>
            </button>
          </div>

          <div className="p-3 bg-[#e8dac1] text-[#2c1d11] rounded shadow-inner font-serif-vintage text-xs leading-relaxed border border-[#9b8564]">
            <p className="italic">&quot;{secretClueText}&quot;</p>
            <div className="mt-2 pt-1 border-t border-[#8b7454]/40 flex items-center justify-between text-[9.5px] font-mono font-bold text-[#632424]">
              <span>[ DALIL № 05-X // TEKSHIRILDI ]</span>
              <span>PO&apos;LAT SEYFDAN OLINDI</span>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Brass Safe Dial Interface */
        <div className="flex flex-col items-center py-1 space-y-3">
          {/* Target combo progress indicators */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#a89b88]">
            <span>Kiritilgan kod:</span>
            <div className="flex items-center gap-1.5 font-bold">
              {targetCombination.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-8 h-7 rounded flex items-center justify-center border text-xs font-mono ${
                    enteredCombo[idx] !== undefined
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                      : 'bg-[#151720] border-[#382f22] text-[#6e6353]'
                  }`}
                >
                  {enteredCombo[idx] !== undefined ? String(enteredCombo[idx]).padStart(2, '0') : '••'}
                </span>
              ))}
            </div>
          </div>

          {/* Rotary Dial Wheel (Interactive Circular Drag) */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Red Fixed Pointer Triangle (Always Upright at 12 o'clock) */}
            <div className="w-3 h-3 bg-red-600 clip-path-triangle shadow-[0_0_10px_rgba(239,68,68,0.9)] z-30 mb-0.5 animate-pulse" />

            <div className="flex items-center gap-3">
              {/* Left Step Button (-1) */}
              <button
                type="button"
                onClick={() => handleStepDial(-1)}
                className="w-8 h-8 rounded-full border border-[#4a3c26] bg-[#1a1711] text-[#caa04b] hover:text-[#ffd977] hover:border-[#caa04b] flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-sm"
                title="1 qadam chapga (-)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dial Housing & Ring */}
              <div
                ref={dialRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#3b301f] via-[#1e1b15] to-[#0c0d12] border-4 border-[#caa04b]/70 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(0,0,0,0.9)] flex items-center justify-center relative touch-none select-none cursor-grab ${
                  isDragging ? 'cursor-grabbing scale-102 border-[#ffd977]' : ''
                }`}
              >
                {/* Rotating Rim with engraved marks */}
                <div
                  className="absolute inset-2 rounded-full border-2 border-dashed border-[#bfa163]/50 pointer-events-none transition-transform duration-75"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  {/* 8 Main Major Radial Ticks around rim */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-3 bg-[#e8c67a] left-1/2 -ml-0.5 top-0 origin-bottom"
                      style={{
                        transformOrigin: 'bottom center',
                        height: '14px',
                        transform: `rotate(${angle}deg) translateY(-2px)`,
                      }}
                    />
                  ))}
                </div>

                {/* Center Non-Rotating Knurled Brass Hub - Digits stay completely UPRIGHT! */}
                <div
                  onClick={handleSelectNumber}
                  className="relative z-20 w-18 h-18 rounded-full bg-gradient-to-tr from-[#120f08] via-[#2c200e] to-[#120f08] border-2 border-[#caa04b] flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-[#ffd977] active:scale-95 transition-all"
                  title="Raqamni kiritish uchun bosing"
                >
                  {/* Current Number Display: Always strictly upright, never upside down! */}
                  <span className="font-mono font-extrabold text-xl text-[#ffd977] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {String(currentNum).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] font-mono text-[#a39074] uppercase tracking-wider mt-0.5 group-hover:text-amber-300">
                    KIRITISH
                  </span>
                </div>
              </div>

              {/* Right Step Button (+1) */}
              <button
                type="button"
                onClick={() => handleStepDial(1)}
                className="w-8 h-8 rounded-full border border-[#4a3c26] bg-[#1a1711] text-[#caa04b] hover:text-[#ffd977] hover:border-[#caa04b] flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-sm"
                title="1 qadam o'ngga (+)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction under the dial */}
            <div className="mt-2 text-[10.5px] font-mono text-[#a89b88] flex items-center gap-1.5">
              <span>↻ Diskni aylantiring, g&apos;ildirakdan foydalaning yoki tugmani bosing</span>
            </div>
          </div>

          {/* Action Confirmation Button (Big Finger-Friendly Touch) */}
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={handleSelectNumber}
              className="w-full max-w-[260px] py-2 px-4 rounded-xl brass-glow font-case font-bold text-xs text-[#1c1407] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-[#3a2807]" />
              <span>Raqamni Kiritish: [{String(currentNum).padStart(2, '0')}]</span>
            </button>
          </div>

          {/* Hint Line */}
          <div className="text-[10px] font-mono text-[#caa04b] bg-[#1a1711] px-3 py-1 rounded-full border border-[#312718] flex items-center gap-1">
            <span>💡 {hint}</span>
          </div>
        </div>
      )}
    </div>
  );
};
