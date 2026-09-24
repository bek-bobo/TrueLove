import React, { useState } from 'react';
import { DossierData, RubberStamp } from '../types';
import { BulldogClip, CoffeeStain } from './VintagePaperClips';
import { RubberStampTool, RubberStampBadge } from './RubberStampTool';
import { MatchFlameHeatScrap } from './MatchFlameHeatScrap';
import { NewspaperRansomLetter } from './NewspaperRansomLetter';
import { AudioCassettePlayer } from './AudioCassettePlayer';
import { PerforatedTicket } from './PerforatedTicket';
import { CustomWaxSeal } from './CustomWaxSeal';
import { noirAudio } from '../utils/audioAmbience';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  PenTool,
  Type,
  Newspaper,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileStack,
} from 'lucide-react';

interface DossierLetterProps {
  dossier: DossierData;
  onPrev: () => void;
  onNext: () => void;
  onApplyStampToDossier: (stamp: RubberStamp) => void;
  fontMode: 'typewriter' | 'handwritten_ink' | 'newspaper_ransom';
  onToggleFontMode: () => void;
  watermarkEnabled: boolean;
  onToggleWatermark: () => void;
  activeRole: 'recipient' | 'author';
}

export const DossierLetter: React.FC<DossierLetterProps> = ({
  dossier,
  onPrev,
  onNext,
  onApplyStampToDossier,
  fontMode,
  onToggleFontMode,
  watermarkEnabled,
  onToggleWatermark,
  activeRole,
}) => {
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);
  const evidenceItemCount = 2 + (dossier.hasAudioCassette ? 1 : 0);

  const letterFontClass =
    fontMode === 'handwritten_ink'
      ? 'font-handwritten-ink text-base sm:text-lg leading-relaxed text-[#2c1d11]'
      : 'font-serif-vintage text-sm leading-relaxed text-[#231a0e]';

  return (
    <div className="w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[660px] bg-[#14151b] border-0 sm:border-2 border-[#3c3425] rounded-none sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-none sm:shadow-[0_15px_45px_rgba(0,0,0,0.85)] relative overflow-hidden select-none">
      {/* Subtle Texture Grain Overlay */}
      <div className="absolute inset-0 texture-aged-paper opacity-5 pointer-events-none rounded-none sm:rounded-3xl" />

      {/* Top Header Row with Navigation & Styling Switcher */}
      <div className="relative flex items-center justify-between pb-3 border-b border-[#30281c] z-10">
        <button
          onClick={() => {
            noirAudio.playPaperRustle();
            onPrev();
          }}
          className="text-xs font-mono text-[#a89b88] hover:text-[#e4dac7] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Xronologiya</span>
        </button>

        <span className="font-case text-xs tracking-[0.25em] text-[#d6b77c] font-bold">
          4-QADAM: MAKTUB
        </span>

        {/* Font Mode & Anti-Screenshot Watermark */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Typewriter vs Handwritten Ink vs Newspaper Cutouts */}
          <button
            onClick={() => {
              noirAudio.playPaperRustle();
              onToggleFontMode();
            }}
            className={`p-1.5 rounded border transition-colors cursor-pointer text-[10px] flex items-center gap-1 ${
              fontMode === 'newspaper_ransom'
                ? 'bg-[#3b1717] border-red-700 text-red-200'
                : fontMode === 'handwritten_ink'
                ? 'bg-[#292215] border-[#caa04b] text-[#ffd977]'
                : 'bg-[#181a22] border-[#31291c] text-[#8e816e] hover:text-white'
            }`}
            title="Matn uslubini almashtirish: Qo'lyozma • Mashinka • Gazeta qirqimlari"
          >
            {fontMode === 'newspaper_ransom' ? (
              <Newspaper className="w-3 h-3 text-red-300" />
            ) : fontMode === 'handwritten_ink' ? (
              <PenTool className="w-3 h-3 text-[#ffd977]" />
            ) : (
              <Type className="w-3 h-3" />
            )}
            <span className="font-mono text-[9.5px] hidden sm:inline">
              {fontMode === 'newspaper_ransom'
                ? 'Gazeta'
                : fontMode === 'handwritten_ink'
                ? 'Qo\'lyozma'
                : 'Mashinka'}
            </span>
          </button>

          {/* Toggle Anti-Screenshot Watermark */}
          <button
            onClick={() => {
              noirAudio.playKeyClick();
              onToggleWatermark();
            }}
            className={`p-1.5 rounded border transition-colors cursor-pointer text-[10px] ${
              watermarkEnabled
                ? 'bg-[#182635] border-cyan-800 text-cyan-300'
                : 'bg-[#181a22] border-[#31291c] text-[#8e816e]'
            }`}
            title={watermarkEnabled ? 'Skrinshot himoyasini o\'chirish' : 'Skrinshot himoya watermarkini yoqish'}
          >
            <Shield className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Middle Scrollable Section: The Letter Paper, Invisible Ink & Rubber Stamps */}
      <div className="relative my-2.5 flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 dossier-scroll-lock">
        {/* Pinned Secret Letter */}
        <div className="relative pt-1.5">
          {/* Bulldog Binder Clip holding the letter on the top-right corner */}
          <div className="absolute -top-1.5 right-6 z-20">
            <BulldogClip />
          </div>

          {/* Aged Letter Paper Card with optional anti-screenshot watermark */}
          <div
            className={`texture-aged-paper p-4 sm:p-5 rounded-xs border border-[#a28d6c] shadow-[2px_8px_20px_rgba(0,0,0,0.7)] relative overflow-hidden ${
              watermarkEnabled ? 'anti-screenshot-watermark' : ''
            }`}
          >
            {/* Confidential Watermark text banner if enabled */}
            {watermarkEnabled && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 select-none rotate-[-30deg]">
                <span className="font-case font-black text-xl text-[#3b2b13] tracking-[0.3em]">
                  CONFIDENTIAL // DELO #05 // DO NOT SCREENSHOT
                </span>
              </div>
            )}

            {/* Header row: Stamp Banner + PIN protection status */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-block border border-[#8e3535] px-2.5 py-0.5 text-[11px] font-case font-bold tracking-[0.18em] text-[#8e3535] uppercase bg-[#ecdab8]/60">
                {dossier.letterHeadline}
              </div>

              {dossier.pinCode && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#2d6a36] bg-[#d3e5d6]/70 px-2 py-0.5 rounded border border-[#2d6a36]/40">
                  <Lock className="w-2.5 h-2.5" />
                  <span>PIN muhrlangan</span>
                </div>
              )}
            </div>

            {/* Letter Body Lines */}
            {fontMode === 'newspaper_ransom' ? (
              <div className="space-y-3.5 my-2">
                {dossier.letterBody.map((paragraph, idx) => (
                  <NewspaperRansomLetter key={idx} text={paragraph} />
                ))}
              </div>
            ) : (
              <div className={`space-y-2.5 ${letterFontClass}`}>
                {dossier.letterBody.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Vintage Coffee Cup Ring Stain Overlay on paper */}
            <div className="absolute -bottom-8 -left-8 opacity-45 pointer-events-none select-none">
              <CoffeeStain size={110} />
            </div>

            {/* Render any rubber stamps applied to this letter */}
            {dossier.stamps && dossier.stamps.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[#877254]/20 flex flex-wrap gap-2 items-center">
                {dossier.stamps.map((stamp) => (
                  <RubberStampBadge key={stamp.id} stamp={stamp} size="xs" />
                ))}
              </div>
            )}

            {/* Closing Line & Custom VIP Wax Seal */}
            <div className="mt-3 pt-2 border-t border-[#877254]/30 flex items-center justify-between">
              <span className="text-xs font-serif-vintage italic font-bold text-[#443320]">
                {dossier.letterClosing}
              </span>
              <div className="flex items-center gap-1.5">
                <CustomWaxSeal
                  type={dossier.waxSealType || 'classic_crest'}
                  initials={dossier.waxSealInitials || 'AL'}
                  color={dossier.waxSealColor || 'crimson'}
                  size={38}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Qo'shimcha Dalillar: accordion — sahifa ochilganda faqat asosiy xat
            ko'rinadi, qo'shimcha widget'lar so'rab olinganda ochiladi */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              noirAudio.playPaperRustle();
              setIsEvidenceExpanded((prev) => !prev);
            }}
            aria-expanded={isEvidenceExpanded}
            className="w-full flex items-center gap-2 px-0.5 py-1 cursor-pointer group"
          >
            <div className="h-px flex-1 bg-[#30281c] group-hover:bg-[#4a3f2a] transition-colors" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#8a7d68] group-hover:text-[#c4b69f] uppercase whitespace-nowrap flex items-center gap-1.5 transition-colors">
              <FileStack className="w-3 h-3" />
              Qo&apos;shimcha Dalillar ({evidenceItemCount})
              {isEvidenceExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </span>
            <div className="h-px flex-1 bg-[#30281c] group-hover:bg-[#4a3f2a] transition-colors" />
          </button>

          {isEvidenceExpanded && (
            <div className="flex flex-col gap-3 mt-2.5 animate-fadeIn">
              <div className="px-0.5">
                <MatchFlameHeatScrap
                  hiddenSecretText={
                    dossier.secretMatchNote ||
                    '«Seni hech qachon unutmaganman. Bu xat tasodif emas edi.»'
                  }
                />
              </div>

              {dossier.hasAudioCassette && (
                <div className="px-0.5">
                  <AudioCassettePlayer
                    title={dossier.cassetteTitle || 'FONOGRAMMA #05 // ATMOSFERA MIKSI'}
                    authorName="Fon effekti (Jazz + Yomg'ir)"
                    duration={28}
                  />
                </div>
              )}

              <div className="px-0.5">
                <PerforatedTicket
                  title="MAXFIY TAKLIFNOMA: 2 KISHILIK QAHVA YOKI KECHKI OVQAT"
                  subtitle="Ushbu chipta istalgan paytda kofe yoki kechki ovqat uchun amal qiladi"
                  ticketNumber="NOIR-TICKET #05-VIP"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rubber Stamp Applicator Toolbox */}
        <div className="p-2.5 rounded-xl bg-[#1a1c24] border border-[#332b1e] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#a89b88] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#caa04b]" />
            <span>Maktubga rasmiy shtamp bosing:</span>
          </div>
          <RubberStampTool
            onApplyStamp={onApplyStampToDossier}
            stampedBy={activeRole}
          />
        </div>
      </div>

      {/* Footer Navigation CTA to Step 4 (Classified Chat Wiretap) */}
      <div className="pt-2 border-t border-[#292218]">
        <button
          onClick={() => {
            noirAudio.playPaperRustle();
            onNext();
          }}
          className="w-full py-3 px-5 brass-glow rounded-lg font-case font-bold text-sm tracking-[0.14em] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] hover:brightness-110 cursor-pointer text-[#1d1607] shadow-[0_6px_16px_rgba(180,134,52,0.4)]"
        >
          <span>4. Shifrlangan Telegrafga o&apos;tish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
