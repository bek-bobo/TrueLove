import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, CheckCircle2 } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface FingerprintBiometricStampProps {
  onVerified: () => void;
  label?: string;
  isCompleted?: boolean;
}

export const FingerprintBiometricStamp: React.FC<FingerprintBiometricStampProps> = ({
  onVerified,
  label = 'Rozilik bildirish uchun barmog\'ingizni 2 soniya bosib turing:',
  isCompleted = false,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [verified, setVerified] = useState(isCompleted);
  const timerRef = useRef<number | null>(null);

  // Sync with external completed state
  useEffect(() => {
    if (isCompleted && !verified) {
      setVerified(true);
      setProgress(100);
      setHolding(false);
    }
  }, [isCompleted, verified]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Handle completion safely in useEffect instead of inside functional state updater
  useEffect(() => {
    if (progress >= 100 && !verified) {
      setHolding(false);
      setVerified(true);
      noirAudio.playFingerprintPress();
      onVerified();
    }
  }, [progress, verified, onVerified]);

  const startHold = () => {
    if (verified || isCompleted) return;
    setHolding(true);
    noirAudio.playKeyClick();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const interval = 40; // 40ms * 50 steps = 2000ms (2 seconds)
    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 100;
        }
        return next;
      });
    }, interval);
  };

  const cancelHold = () => {
    if (verified || isCompleted) return;
    setHolding(false);
    setProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="w-full my-3 p-3.5 bg-[#12141a] border-2 border-[#3c3425] rounded-2xl shadow-xl text-[#ded1bd] relative overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2b2419] pb-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f5e6cc]">
          <Fingerprint className="w-3.5 h-3.5 text-[#caa04b]" />
          <span>SIYOHLI BARMOQ IZI // DAKTILOSKOPIYA</span>
        </div>

        <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
          verified
            ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
            : 'bg-[#221c15] border border-[#3b3122] text-[#9c8e7c]'
        }`}>
          {verified ? 'IDENTIFIKATSIYA' : 'KUTILMOQDA'}
        </span>
      </div>

      <div className="text-[11px] font-mono text-[#a89b88] mb-3 text-center">
        {verified ? 'Barmoq izingiz rasmiy ravishda hujjatga muhrlandi:' : label}
      </div>

      {/* Main Touch Pad / Fingerprint graphic */}
      <div className="flex flex-col items-center justify-center">
        {verified ? (
          /* Stamped Ink Fingerprint Whorl */
          <div className="relative p-4 rounded-full bg-[#e8dac0] border-2 border-[#8a7251] shadow-inner flex flex-col items-center justify-center animate-fadeIn">
            {/* Ink Fingerprint SVG graphic */}
            <svg
              className="w-16 h-20 text-[#1f1710] opacity-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
              <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
              <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
              <path d="M2 12a10 10 0 0 1 18-6" />
              <path d="M2 16h.01" />
              <path d="M21.8 16c.2-2 .131-5.354 0-6" />
              <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
              <path d="M8.65 22c.21-.66.45-1.32.57-2" />
              <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
            </svg>

            {/* Red Archival Stamp Banner across fingerprint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] whitespace-nowrap bg-[#8c2d2d]/90 text-[#ffdede] font-case font-extrabold text-[9px] px-2 py-0.5 border border-red-400 shadow-md">
              ROZILIK MUHRI // TASDIQ
            </div>
          </div>
        ) : (
          /* Interactive Sensor Pad */
          <div
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className={`relative w-24 h-24 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
              holding
                ? 'bg-[#291717] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-105'
                : 'bg-[#181a24] border-[#caa04b]/50 hover:border-[#caa04b] shadow-inner'
            }`}
          >
            {/* SVG Fingerprint Icon */}
            <Fingerprint className={`w-12 h-12 transition-colors ${
              holding ? 'text-red-400 animate-pulse' : 'text-[#caa04b]'
            }`} />

            {/* Circular Scanning Progress Ring */}
            {holding && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * progress) / 100}
                  className="transition-all duration-75"
                />
              </svg>
            )}
          </div>
        )}

        <div className="mt-2.5 text-center">
          {verified ? (
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Daktiloskopiya muvaffaqiyatli yakunlandi</span>
            </div>
          ) : (
            <div className="text-[9.5px] font-mono text-[#8a7a66]">
              {holding ? `Bosib turing: ${progress}%` : 'Barmog\'ingiz bilan bosing va ushlab turing'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
