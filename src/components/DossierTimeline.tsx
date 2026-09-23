import React, { useState } from 'react';
import { DossierData } from '../types';
import { BrassRivet, BulldogClip, WirePaperclip, CoffeeStain } from './VintagePaperClips';
import { PolaroidCard } from './PolaroidCard';
import { DetectiveMagnifierLens } from './DetectiveMagnifierLens';
import { DarkroomPhotoReveal } from './DarkroomPhotoReveal';
import { RetroSafeVault } from './RetroSafeVault';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface DossierTimelineProps {
  dossier: DossierData;
  onPrev: () => void;
  onNext: () => void;
}

export const DossierTimeline: React.FC<DossierTimelineProps> = ({
  dossier,
  onPrev,
  onNext,
}) => {
  // Secret Lines under blackout redaction tape
  const pauseSecretLines = [
    'Есть что сказать',
    'Без лишних слов',
    'Слова остались в тишине',
    'Но время не стёрло память',
  ];

  // Initially show first 2 revealed like in user's Image 2!
  const [revealedTapes, setRevealedTapes] = useState<number[]>([0, 1]);

  const toggleTape = (idx: number) => {
    noirAudio.playPaperRustle();
    hapticFeedback.dustSweep();
    setRevealedTapes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAllTapes = () => {
    noirAudio.playPaperRustle();
    hapticFeedback.safeDialTick();
    if (revealedTapes.length === pauseSecretLines.length) {
      setRevealedTapes([]);
    } else {
      setRevealedTapes(pauseSecretLines.map((_, i) => i));
    }
  };

  return (
    <div className="relative w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[720px] bg-[#14161b] rounded-none sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-none sm:shadow-[0_24px_50px_rgba(0,0,0,0.85)] border-0 sm:border border-[#2b251b] overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d251a]/50 text-[#8d826f]">
        <button
          onClick={onPrev}
          className="flex items-center gap-1 text-xs text-[#a89678] hover:text-[#e4dac7] transition-colors cursor-pointer"
          title="Вернуться к обложке"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-dossier-code">Обложка</span>
        </button>

        <span className="font-case text-xs tracking-[0.25em] text-[#d6b77c] font-bold">
          {dossier.caseNumber}
        </span>

        <BrassRivet size={16} />
      </div>

      {/* Main Investigation Board Area */}
      <div className="relative my-3 flex-1 overflow-y-auto pr-1 flex flex-col gap-5 dossier-scroll-lock">
        {/* Torn Kraft Paper Header: "Как это было" */}
        <div className="relative self-start mt-1">
          <div className="texture-aged-paper px-5 py-1.5 rounded-xs shadow-[2px_3px_8px_rgba(0,0,0,0.5)] border border-[#a48e6c] -rotate-1">
            <h3 className="font-serif-vintage text-base font-bold text-[#231a0e] tracking-tight">
              Как это было
            </h3>
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="relative pl-3">
          {/* Vertical Golden Connecting Wire */}
          <div className="absolute left-[17px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-[#caa04b] via-[#856321] to-[#caa04b]/40" />

          {/* Step 1: Тогда */}
          <div className="space-y-3 mb-6">
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {/* Timeline Brass Node */}
                <div className="relative mt-1 z-10">
                  <BrassRivet size={12} />
                </div>

                {/* Text note */}
                <div className="flex-1 pr-1">
                  <h4 className="font-serif-vintage text-base font-bold text-[#dfbe7e] tracking-wide">
                    Тогда
                  </h4>
                  <p className="mt-1 text-xs text-[#c2b49d] leading-relaxed font-dossier-code">
                    Мы начали это дело с чистого листа.
                    <br />
                    И всё было важно.
                  </p>
                </div>
              </div>
            </div>

            {/* 🎞️ Тогда: Fotolaboratoriya (35mm Negativ Plyonkani Qizil Chiroqda Chiqarish) */}
            <div className="ml-5">
              <DarkroomPhotoReveal
                imageUrl="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
                caption="DALIL #05: O'sha tunda olingan maxfiy kadr (O'sha paytlar)"
              />
            </div>

            {/* ☕ Qahva dog'i hamda 🔎 Lupa (Detective Magnifier Lens) */}
            <div className="ml-5 relative">
              <div className="relative texture-kraft-paper p-3 rounded-xl border border-[#967d58] shadow-md overflow-hidden">
                {/* Coffee Stain overlay right on this evidence */}
                <div className="absolute -top-3 -right-3 pointer-events-none opacity-85">
                  <CoffeeStain size={85} />
                </div>
                <div className="text-[10px] font-mono text-[#4a3622] font-bold mb-1.5 flex items-center gap-1">
                  <span>☕ QAHVA DOG&apos;I VA SIRLI QAYD</span>
                </div>
                <DetectiveMagnifierLens
                  hiddenClueText={dossier.secretMatchNote || "DALIL #08: Ushbu maktub qahva hidini saqlab qolgan. 21:00 da o'sha yerda kutaman."}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Пауза + Секретно (Merged into a unified torn lined notebook scrap like in Image 2) */}
          <div className="space-y-3 mb-6">
            <div className="relative flex items-start gap-3">
              {/* Timeline Brass Node */}
              <div className="relative mt-1 z-10">
                <BrassRivet size={12} />
              </div>

              {/* The Unified Torn Notebook Page (Matches Image 2 exactly) */}
              <div className="relative flex-1 -mt-1">
                {/* Wire Paperclip pinned on the top right */}
                <div className="absolute -top-3.5 right-3 z-30 pointer-events-none">
                  <WirePaperclip />
                </div>

                {/* Torn Lined Notepad Scrap */}
                <div className="texture-aged-paper p-3 sm:p-4 rounded-xs border border-[#a48e6c] shadow-[2px_5px_15px_rgba(0,0,0,0.55)] rotate-[-0.5deg] relative overflow-hidden">
                  {/* Spiral Binder Punched Holes on Left Edge */}
                  <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-around py-3 pointer-events-none opacity-85">
                    <div className="w-2 h-2 rounded-full bg-[#181512] shadow-inner" />
                    <div className="w-2 h-2 rounded-full bg-[#181512] shadow-inner" />
                    <div className="w-2 h-2 rounded-full bg-[#181512] shadow-inner" />
                    <div className="w-2 h-2 rounded-full bg-[#181512] shadow-inner" />
                  </div>

                  {/* Paper Content: Shifted right past holes */}
                  <div className="pl-3.5">
                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-[#8a7251]/30 pb-1.5 mb-2">
                      <h4 className="font-serif-vintage text-base font-extrabold text-[#241c13] tracking-wide flex items-center gap-1.5">
                        <span>Пауза</span>
                        <span className="text-[10px] font-mono text-[#7a6448] font-normal">• 1980</span>
                      </h4>

                      <button
                        type="button"
                        onClick={toggleAllTapes}
                        className="text-[9px] font-mono text-[#5b4a35] hover:text-[#241c13] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        {revealedTapes.length === pauseSecretLines.length ? (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Скрыть все</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            <span>Открыть все</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Intro Narrative */}
                    <div className="text-xs text-[#3b2e1e] leading-snug font-dossier-code mb-2.5 space-y-0.5">
                      <p>Потом наступила пауза.</p>
                      <p>Без финала. Без точки.</p>
                    </div>

                    {/* Interactive Redaction Blackout Tapes (Like Image 2!) */}
                    <div className="space-y-1.5 pt-1 border-t border-dashed border-[#8a7251]/40">
                      <div className="text-[9px] font-mono text-[#6e583c] uppercase tracking-widest flex items-center justify-between mb-1">
                        <span>🔒 СЕКРЕТНЫЕ СТРОКИ:</span>
                        <span className="text-[8px] text-[#9c8465] lowercase italic">(нажмите на полосу)</span>
                      </div>

                      {pauseSecretLines.map((line, idx) => {
                        const isRevealed = revealedTapes.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleTape(idx)}
                            className="relative cursor-pointer transition-all duration-200 select-none group"
                            title={isRevealed ? "Нажмите, чтобы скрыть" : "Нажмите, чтобы снять ленту"}
                          >
                            {isRevealed ? (
                              /* Revealed Typewriter Strip on cream slip */
                              <div className="px-2 py-1 bg-[#ede0c9] border border-[#a8906e] shadow-xs rounded-[1px] font-dossier-code text-xs text-[#1c160f] flex items-center justify-between animate-fadeIn group-hover:brightness-95">
                                <span className="font-bold">{line}</span>
                                <span className="text-[8px] text-[#8c7456] opacity-70 font-mono">№{idx + 1}</span>
                              </div>
                            ) : (
                              /* Black Solid Redaction Tape Strip (Like Image 2) */
                              <div className="h-6 bg-[#16120d] hover:bg-[#261f18] rounded-[1px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_1px_3px_rgba(0,0,0,0.5)] flex items-center justify-between px-2.5 transition-colors">
                                <div className="w-8 h-1 bg-[#2b241c] rounded-full" />
                                <span className="text-[8px] font-mono text-[#6d5b45] group-hover:text-[#caa04b] tracking-wider uppercase transition-colors">
                                  [ ЗАСЕКРЕЧЕНО ]
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* 🔐 Pauzadan keyin Seyf turadi! (Rotary Combination Safe Dial) */}
            <div className="ml-5">
              <RetroSafeVault
                targetCombination={[19, 8]}
                secretClueTitle="PAUZA DAVRIDAGI PO'LAT SEYF"
                secretClueText={dossier.secretMatchNote || "«O'sha kuni aytilmagan haqiqat: Men har bir daqiqani eslab qolganman. Vaqt to'xtagan edi.»"}
                hint="Ko'rsatma: Tanaffus siri (19) va (08)"
              />
            </div>
          </div>

          {/* Step 3: Сегодня */}
          <div className="relative flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3 flex-1">
              {/* Timeline Brass Node */}
              <div className="relative mt-1 z-10">
                <BrassRivet size={12} />
              </div>

              {/* Text note */}
              <div className="flex-1 pr-1">
                <h4 className="font-serif-vintage text-base font-bold text-[#dfbe7e] tracking-wide">
                  Сегодня
                </h4>
                <p className="mt-1 text-xs text-[#c2b49d] leading-relaxed font-dossier-code">
                  Но некоторые вопросы не теряют смысла.
                  <br />
                  И ответы всё ещё имеют значение.
                </p>
              </div>
            </div>

            {/* Polaroid 2: Changni puflanadigan rasm qolaveradi! */}
            <div className="shrink-0 -mt-2">
              <PolaroidCard
                caption="дело ждёт продолжения"
                theme="secret_door"
                rotation="rotate-2"
                onClick={() => noirAudio.playPaperRustle()}
              />
            </div>
          </div>
        </div>

        {/* Bottom Pinned Kraft Scrap: "Что осталось незавершённым:" with Bulldog Clip */}
        <div className="relative mt-2 pt-2">
          {/* Bulldog Binder Clip holding the note */}
          <div className="absolute -top-3 left-6 z-20">
            <BulldogClip />
          </div>

          {/* Kraft Paper Note */}
          <div className="relative texture-kraft-paper p-4 pt-5 rounded-xs border border-[#9b835e] shadow-[2px_6px_16px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Coffee Stain Overlay in the right corner */}
            <div className="absolute -bottom-6 -right-6 pointer-events-none">
              <CoffeeStain size={110} />
            </div>

            <h4 className="font-serif-vintage text-sm font-bold text-[#231a0e] tracking-tight border-b border-[#826e4d]/40 pb-1.5">
              Что осталось незавершённым:
            </h4>

            <ul className="mt-2.5 space-y-1.5 text-xs text-[#2c2215] font-dossier-code">
              {dossier.unfinishedList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#882b2b] font-bold select-none">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="pt-2">
        <button
          onClick={() => {
            noirAudio.playPaperRustle();
            onNext();
          }}
          className="w-full py-3 px-5 brass-glow rounded-lg font-case font-bold text-sm tracking-[0.14em] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] hover:brightness-110 cursor-pointer text-[#1d1607] shadow-[0_6px_16px_rgba(180,134,52,0.4)]"
        >
          <span>3. Maktubni o'qish / Читать письмо</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
