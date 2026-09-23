import React, { useState } from 'react';
import { Flame, AlertTriangle } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface BurnDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBurn: () => void;
  caseNumber: string;
}

export const BurnDossierModal: React.FC<BurnDossierModalProps> = ({
  isOpen,
  onClose,
  onConfirmBurn,
  caseNumber,
}) => {
  const [isBurningAnimation, setIsBurningAnimation] = useState(false);

  if (!isOpen) return null;

  const handleExecuteBurn = () => {
    noirAudio.playFireBurn();
    setIsBurningAnimation(true);
    setTimeout(() => {
      onConfirmBurn();
      setIsBurningAnimation(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-sm bg-[#120a0a] border-2 border-red-700/80 rounded-2xl p-5 shadow-[0_20px_50px_rgba(255,50,0,0.3)] text-center relative overflow-hidden transition-all ${
        isBurningAnimation ? 'animate-paper-burn pointer-events-none' : 'animate-fadeIn'
      }`}>
        {/* Glow effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-600/30 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 mx-auto rounded-full bg-red-950/80 border border-red-600/80 flex items-center justify-center mb-3">
          <Flame className={`w-7 h-7 text-orange-400 ${isBurningAnimation ? 'animate-bounce' : 'animate-pulse'}`} />
        </div>

        <h3 className="font-case font-extrabold text-base tracking-widest text-[#ffd9b3] uppercase">
          {caseNumber} — YOQIB YUBORISH
        </h3>

        <p className="text-xs font-mono text-[#d6a5a5] mt-2 leading-relaxed">
          {isBurningAnimation ? (
            <span className="text-orange-300 font-bold animate-pulse">
              🔥 Olov qog&apos;ozni yoqmoqda... Barcha dalillar kulga aylanmoqda...
            </span>
          ) : (
            'Haqiqatan ham ushbu maxfiy dosyeni yoqib yubormoqchimisiz? Xat va barcha suhbatlar butunlay yo\'q bo\'ladi va qayta tiklanmaydi!'
          )}
        </p>

        {!isBurningAnimation && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#241717] border border-[#4a2e2e] text-xs font-mono text-[#cfb8b8] hover:text-white transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>

            <button
              type="button"
              onClick={handleExecuteBurn}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-800 to-orange-700 hover:from-red-700 hover:to-orange-600 text-xs font-case font-bold tracking-wider text-white shadow-[0_4px_14px_rgba(220,38,38,0.5)] cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Olov yoqish</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
