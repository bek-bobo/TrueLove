import React, { useState } from 'react';
import { DossierData } from '../types';
import { BrassRivet } from './VintagePaperClips';
import { CustomWaxSeal } from './CustomWaxSeal';
import { SyncDualCountdown } from './SyncDualCountdown';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';
import { Lock, Eye, FolderOpen, Sparkles } from 'lucide-react';

interface DossierCoverProps {
  dossier: DossierData;
  onOpenDossier: () => void;
  isRecipientView?: boolean;
}

export const DossierCover: React.FC<DossierCoverProps> = ({
  dossier,
  onOpenDossier,
}) => {
  const [isUnwinding, setIsUnwinding] = useState(false);

  const handleOpen = () => {
    if (isUnwinding) return;
    setIsUnwinding(true);
    noirAudio.playSealOpen();
    noirAudio.playPaperRustle();
    hapticFeedback.safeUnlocked();

    setTimeout(() => {
      onOpenDossier();
    }, 650);
  };

  return (
    <div className="relative w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5rem)] sm:min-h-[680px] texture-leather animate-paper-flicker rounded-none sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-none sm:shadow-[0_24px_50px_rgba(0,0,0,0.85)] border-0 sm:border-2 border-[#3c3425] overflow-hidden select-none">
      {/* Ambient Pulsing Candle Vignette Light (Sirli va jonli nur shulasi) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#caa04b]/12 blur-3xl pointer-events-none animate-noir-breathing" />
      <div className="absolute -bottom-20 right-0 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none animate-noir-breathing" style={{ animationDelay: '2s' }} />

      {/* Secret Classification Side Tab (Right) */}
      <div className="absolute right-0 top-1/4 -translate-y-1/2 translate-x-[2px] z-10">
        <div className="bg-[#b39158] text-[#1b1509] text-[9px] font-bold tracking-[0.25em] py-5 px-1.5 rounded-l-md shadow-[-3px_2px_8px_rgba(0,0,0,0.6)] [writing-mode:vertical-rl] rotate-180 border-y border-l border-[#dfbe7e]">
          {dossier.secrecyTab}
        </div>
      </div>

      {/* Top Header Bar: Authentic Archival Dossier Heading */}
      <div className="flex items-center justify-between pb-2 border-b border-[#3b3223] text-[#8d826f] relative z-10">
        <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-[#caa04b]">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>АРХИВ // ОСОБАЯ ПАПКА</span>
        </div>

        <div className="stamp-red px-2.5 py-0.5 font-case font-extrabold text-xs tracking-[0.2em] border border-[#b53c3c]">
          {dossier.caseNumber}
        </div>

        <div className="flex items-center gap-1">
          <BrassRivet size={14} />
        </div>
      </div>

      {/* Central Content Area */}
      <div className="relative my-auto flex flex-col justify-between py-2">
        {/* Central Aged Paper Card */}
        <div className="relative my-2 mx-auto w-full texture-aged-paper rounded-sm p-4 sm:p-5 shadow-[3px_6px_18px_rgba(0,0,0,0.7)] border border-[#a48e6c] flex flex-col items-center text-center">
          {/* Paper subtle corner folds */}
          <div className="absolute top-0 right-0 border-t-[10px] border-r-[10px] border-t-transparent border-r-[#8b7654]" />

          <h2 className="font-serif-vintage text-xl sm:text-2xl font-black text-[#1b1610] tracking-tight leading-snug">
            {dossier.title}
          </h2>

          <p className="mt-2 text-xs sm:text-[13px] text-[#423727] leading-relaxed max-w-[290px]">
            {dossier.invitationText}
          </p>

          {/* VIP Wax Seal Emblem */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <CustomWaxSeal
              type={dossier.waxSealType || 'classic_crest'}
              initials={dossier.waxSealInitials || 'AL'}
              color={dossier.waxSealColor || 'crimson'}
              size={54}
            />
          </div>

          {/* Dual Synchronized Secret Open Countdown */}
          {dossier.syncOpenTime && (
            <SyncDualCountdown syncOpenTime={dossier.syncOpenTime} />
          )}
        </div>

        {/* 🧵 The Interactive Manila String Fastener & Brass Grommet (Matches Image 2 exactly) */}
        <div className="relative flex flex-col items-center justify-center py-4 my-1">
          {/* Glowing Aura & Shimmering Golden Dust Specks (Jalb qiluvchi nurlar va dog'lar) */}
          <div className="relative flex items-center justify-center">
            {/* Soft Ambient Gold Pulse */}
            <div className="absolute -inset-4 rounded-full bg-[#caa04b]/25 blur-md animate-pulse pointer-events-none" />
            
            {/* Shimmering Halo Ring */}
            <div className="absolute -inset-7 rounded-full border border-[#caa04b]/30 animate-ping opacity-35 pointer-events-none" />

            {/* Glowing Vintage Speckles (Yonib-o'chuvchi dog'lar) */}
            <span className="absolute -top-3 -left-3 w-2 h-2 rounded-full bg-[#ffd977] shadow-[0_0_8px_#ffd977] animate-ping opacity-75 pointer-events-none" />
            <span className="absolute -bottom-2 -right-3 w-2.5 h-2.5 rounded-full bg-[#caa04b] shadow-[0_0_10px_#caa04b] animate-pulse opacity-85 pointer-events-none" />
            <span className="absolute top-1 -right-4 w-1.5 h-1.5 rounded-full bg-[#fff4cc] shadow-[0_0_6px_#fff] animate-bounce opacity-80 pointer-events-none" />

            {/* Interactive Brass Fastener Disc */}
            <button
              type="button"
              onClick={handleOpen}
              className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full cursor-pointer transition-all duration-500 z-20 group focus:outline-none ${
                isUnwinding ? 'scale-115 rotate-180' : 'hover:scale-108 active:scale-95'
              }`}
              title="Ipni yeching va deloni oching"
            >
              {/* Layer 1: Heavy Drop Shadow */}
              <div className="absolute inset-0 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.9)]" />

              {/* Layer 2: Outer Machined Brass Bezel */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffd977] via-[#b38634] to-[#3a280d] p-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_5px_rgba(0,0,0,0.8)] flex items-center justify-center">
                {/* Layer 3: Inner Metallic Convex Ring (Matches Image 2) */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#694e1d] via-[#deb55d] to-[#45310e] flex items-center justify-center border border-[#2b1f0c] relative shadow-inner">
                  {/* Subtle Metallic Sheen Arc */}
                  <div className="absolute inset-1 rounded-full border-t border-white/40 pointer-events-none" />
                  
                  {/* Center Deep Eyelet Rivet Hole */}
                  <div className="w-5 h-5 rounded-full bg-[#120e09] border-2 border-[#2b1f0c] shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)]" />
                </div>
              </div>

              {/* Layer 4: Twisted Heavy Cord/Thread wrapped in figure-8 (Matches Image 2) */}
              <svg
                className={`absolute -inset-4 w-[112px] h-[112px] pointer-events-none transition-all duration-500 ${
                  isUnwinding ? 'opacity-0 scale-125' : 'opacity-95'
                }`}
                viewBox="0 0 100 100"
                fill="none"
              >
                {/* Thread Drop Shadow */}
                <path
                  d="M 16 78 C 30 55 42 32 50 49 C 58 66 68 56 86 64"
                  stroke="#000000"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeOpacity="0.65"
                />
                {/* Dark Charcoal Thread Main Body */}
                <path
                  d="M 16 76 C 30 54 42 30 50 48 C 58 65 68 55 86 62"
                  stroke="#28303b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Secondary loop across the rivet hole */}
                <path
                  d="M 40 24 C 54 36 53 62 48 76"
                  stroke="#20262f"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                {/* Thread Highlights & Twisted Fiber Texture */}
                <path
                  d="M 16 76 C 30 54 42 30 50 48 C 58 65 68 55 86 62"
                  stroke="#4f5968"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray="4 3"
                />
                <path
                  d="M 40 24 C 54 36 53 62 48 76"
                  stroke="#4f5968"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="3 2"
                />
              </svg>
            </button>
          </div>

          {/* Magnetic Call to Action: Glowing Vintage Label beneath fastener */}
          <div
            onClick={handleOpen}
            className="mt-3.5 flex flex-col items-center cursor-pointer group select-none"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241c13]/90 border border-[#caa04b]/60 shadow-[0_2px_8px_rgba(0,0,0,0.5)] group-hover:border-[#ffd977] transition-all">
              <Sparkles className="w-3 h-3 text-[#ffd977] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-case font-bold text-[10.5px] sm:text-[11px] tracking-[0.18em] text-[#caa04b] group-hover:text-[#ffd977] transition-colors">
                {isUnwinding ? 'OCHILMOQDA...' : 'РАЗВЯЖИТЕ НИТЬ • OCHISH'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#8a7a63] mt-1 group-hover:text-[#b5a38b] transition-colors">
              (Muhrlangan ip ustiga bosing)
            </span>
          </div>
        </div>

        {/* 📋 Bottom Stamped Docket (Matches User Reference Image: Категория: Личное \n Доступ: Только для тебя) */}
        <div className="mt-2.5 mx-auto w-full p-2.5 sm:p-3 texture-aged-paper rounded-xs border border-[#a28e6f]/80 shadow-[1px_2px_8px_rgba(0,0,0,0.4)]">
          <div className="font-dossier-code text-xs sm:text-[13px] leading-relaxed text-[#241d14] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-[#645037]">Категория:</span>
              <span className="text-[#1a140d] tracking-wide">{dossier.category || 'Личное'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-[#645037]">Доступ:</span>
              <span className="text-[#872727] tracking-wide">{dossier.access || 'Только для тебя'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer subtle info */}
      <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#8d826f] font-dossier-code border-t border-[#3b3223]">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-[#b58d44]" />
          Шифрованное досье
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-[#b58d44]" />
          Просмотров: {dossier.viewsCount}
        </span>
      </div>
    </div>
  );
};

