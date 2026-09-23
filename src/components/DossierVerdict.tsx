import React, { useState } from 'react';
import { DossierData } from '../types';
import { BurnDossierModal } from './BurnDossierModal';
import { CustomWaxSeal } from './CustomWaxSeal';
import { FingerprintBiometricStamp } from './FingerprintBiometricStamp';
import { noirAudio } from '../utils/audioAmbience';
import {
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Award,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface DossierVerdictProps {
  dossier: DossierData;
  onPrev: () => void;
  onRestart: () => void;
  onSendMessage: (text: string, sender: 'recipient') => void;
  onBurnDossier?: () => void;
}

export const DossierVerdict: React.FC<DossierVerdictProps> = ({
  dossier,
  onPrev,
  onRestart,
  onSendMessage,
  onBurnDossier,
}) => {
  const [decision, setDecision] = useState<'none' | 'accepted' | 'thinking' | 'burned'>('none');
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);
  const [isBurned, setIsBurned] = useState(dossier.status === 'burned');
  const [customReply, setCustomReply] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleAccept = () => {
    noirAudio.playStamp();
    setDecision('accepted');
    onSendMessage('Men maktubni o\'qidim va uchrashuv taklifingizni qabul qildim.', 'recipient');
  };

  const handleThinking = () => {
    noirAudio.playStamp();
    setDecision('thinking');
    onSendMessage('Maktubingizni o\'qidim. Barchasini tushunishim uchun biroz vaqt kerak.', 'recipient');
  };

  const handleBurn = () => {
    setIsBurnModalOpen(true);
  };

  const handleConfirmBurn = () => {
    setIsBurnModalOpen(false);
    setIsBurned(true);
    setDecision('burned');
    if (onBurnDossier) {
      onBurnDossier();
    }
  };

  const handleSendCustomReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReply.trim()) return;
    noirAudio.playStamp();
    onSendMessage(customReply.trim(), 'recipient');
    setCustomReply('');
    setIsSent(true);
  };

  if (isBurned) {
    return (
      <div className="w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[660px] bg-[#0c0d10] border-0 sm:border-2 border-red-950 rounded-none sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between items-center text-center shadow-none sm:shadow-2xl animate-fadeIn">
        <div className="my-auto space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <Flame className="w-10 h-10 text-orange-500" />
          </div>

          <h2 className="text-xl font-case font-bold tracking-widest text-[#f5d0a6]">
            ДОСЬЕ УНИЧТОЖЕНО
          </h2>

          <p className="text-xs text-[#a69680] font-dossier-code max-w-[280px] leading-relaxed mx-auto">
            Ushbu xat, dalillar va anonim telegraf suhbatlari o&apos;z-o&apos;zini yo&apos;q qildi. Kuldan boshqa hech qanday iz qolmadi.
          </p>

          <button
            onClick={() => {
              setIsBurned(false);
              setDecision('none');
            }}
            className="text-xs text-[#caa04b] underline font-mono cursor-pointer pt-4 hover:text-amber-200"
          >
            Dosyeni qayta tiklash (Simulyatsiya)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[660px] bg-[#14151b] border-0 sm:border-2 border-[#3c3425] rounded-none sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-none sm:shadow-[0_15px_45px_rgba(0,0,0,0.85)] relative overflow-hidden select-none">
      {/* Background Texture */}
      <div className="absolute inset-0 texture-aged-paper opacity-5 pointer-events-none rounded-none sm:rounded-3xl" />

      {/* Top Header Row */}
      <div className="relative flex items-center justify-between pb-3 border-b border-[#30281c] z-10">
        <button
          onClick={() => {
            noirAudio.playPaperRustle();
            onPrev();
          }}
          className="text-xs font-mono text-[#a89b88] hover:text-[#e4dac7] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Telegraf</span>
        </button>

        <span className="font-case text-xs tracking-[0.2em] text-[#d6b77c] font-bold">
          5-QADAM: YAKUNIY HUKM
        </span>

        <button
          onClick={onRestart}
          className="text-[10px] font-mono text-[#caa04b] hover:text-[#ffe28a] flex items-center gap-1 cursor-pointer"
          title="Dosyeni boshidan ko'rish"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Boshiga</span>
        </button>
      </div>

      {/* Middle Content */}
      <div className="relative my-2.5 flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5">
        {/* Dossier Closure Summary Card */}
        <div className="texture-aged-paper p-4 rounded-xl border border-[#9b8564] shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-case text-xs tracking-wider text-[#792424] font-bold">
              ВЕРДИКТ ПО ДЕЛУ № 05
            </span>
            <CustomWaxSeal
              type={dossier.waxSealType || 'classic_crest'}
              initials={dossier.waxSealInitials || 'AL'}
              color={dossier.waxSealColor || 'crimson'}
              size={32}
            />
          </div>

          <p className="text-xs font-serif-vintage text-[#2e2316] leading-relaxed italic">
            &quot;Barcha dalillar ko&apos;rib chiqildi. Xronologiya o&apos;rganildi, maktub o&apos;qildi va telegraf orqali so&apos;zlar aytildi. Endi yakuniy nuqtani qo&apos;yish sizning ixtiyoringizda.&quot;
          </p>

          <div className="mt-3 pt-2 border-t border-[#8b7657]/40 flex items-center justify-between text-[10px] font-mono text-[#5b4a36]">
            <span>Holat: {dossier.status === 'opened' ? 'O\'qildi va ochildi' : 'Yopilmoqda'}</span>
            <span>Ko&apos;rishlar: {dossier.viewsCount} / {dossier.maxViews}</span>
          </div>
        </div>

        {/* 3 Main Final Action Paths */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono text-[#baa991] tracking-wider uppercase">
            Yakuniy qaroringizni tanlang:
          </label>

          {/* Siyohli Barmoq Izi // Daktiloskopik Tasdiq */}
          <FingerprintBiometricStamp
            isCompleted={decision === 'accepted'}
            onVerified={() => {
              handleAccept();
            }}
            label="Rozilik bildirish va taklifni qabul qilish uchun barmog'ingizni bosib turing:"
          />

          {/* Option 1: Accept / Agreed */}
          <button
            type="button"
            onClick={handleAccept}
            className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
              decision === 'accepted'
                ? 'bg-[#18291a] border-emerald-600 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-[#181b22] border-[#2e271a] text-[#ded2be] hover:border-emerald-700/60'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold font-case tracking-wide text-emerald-300">
                1. QABUL QILINDI // ROZIMAN
              </div>
              <p className="text-[11px] text-[#a89d89] mt-0.5">
                Maktub qabul qilindi. Uchrashuv va suhbatga tayyorman.
              </p>
            </div>
          </button>

          {/* Option 2: Need Time */}
          <button
            type="button"
            onClick={handleThinking}
            className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
              decision === 'thinking'
                ? 'bg-[#292215] border-[#caa04b] text-[#ffe29a] shadow-[0_0_15px_rgba(202,160,75,0.2)]'
                : 'bg-[#181b22] border-[#2e271a] text-[#ded2be] hover:border-[#caa04b]/60'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#332410] border border-[#caa04b]/50 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-[#ffd977]" />
            </div>
            <div>
              <div className="text-xs font-bold font-case tracking-wide text-[#ffd977]">
                2. O&apos;YLAB KO&apos;RAMAN // VAQT KERAK
              </div>
              <p className="text-[11px] text-[#a89d89] mt-0.5">
                Barcha aytilganlarni anglab yetish uchun vaqt so&apos;rayman.
              </p>
            </div>
          </button>

          {/* Option 3: Burn Dossier Ritual */}
          <button
            type="button"
            onClick={handleBurn}
            className="w-full p-3 rounded-xl border border-red-900/60 bg-[#201010] text-red-200 hover:bg-[#2c1414] hover:border-red-600 cursor-pointer transition-all flex items-start gap-3 shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-700/60 flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold font-case tracking-wide text-red-300">
                3. DOSYENI YOQIB YUBORISH // КРЕМАЦИЯ
              </div>
              <p className="text-[11px] text-red-300/80 mt-0.5">
                Dosyeni kulga aylantirish. Tarix shu yerda hech qanday izsiz tugaydi.
              </p>
            </div>
          </button>
        </div>

        {/* Custom Closing Message Box */}
        <div className="p-3 rounded-xl bg-[#171a22] border border-[#2e271c] space-y-2">
          <label className="text-[11px] font-mono text-[#c4b59c] flex items-center gap-1.5">
            <Send className="w-3 h-3 text-[#caa04b]" />
            <span>Muallifga maxsus yakuniy javob yozish:</span>
          </label>

          <form onSubmit={handleSendCustomReply} className="flex gap-2">
            <input
              type="text"
              value={customReply}
              onChange={(e) => setCustomReply(e.target.value)}
              placeholder="O'z fikringiz yoki yakuniy so'zingiz..."
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-mono bg-[#111318] border border-[#3b3223] text-[#f0e4cf] focus:outline-hidden focus:border-[#caa04b]"
            />
            <button
              type="submit"
              disabled={!customReply.trim()}
              className="px-3 py-1.5 bg-[#caa04b] text-[#1a1409] font-mono text-xs font-bold rounded-lg hover:bg-[#e0b559] disabled:opacity-40 cursor-pointer"
            >
              Yuborish
            </button>
          </form>

          {isSent && (
            <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Xabaringiz shifrlangan telegrafga muvaffaqiyatli qo&apos;shildi!</span>
            </p>
          )}
        </div>

        {/* Archival Case Certificate Docket */}
        <div className="p-3 rounded-xl bg-[#12141a] border border-[#2d251a] flex items-center justify-between text-[11px] font-mono text-[#8a7c68]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ARXIV DOKETI: {dossier.caseNumber}</span>
          </div>
          <span className="text-[#caa04b] font-bold">YOPILDI // ARCHIVED</span>
        </div>
      </div>

      {/* Burn Modal */}
      <BurnDossierModal
        isOpen={isBurnModalOpen}
        onClose={() => setIsBurnModalOpen(false)}
        onConfirmBurn={handleConfirmBurn}
        caseNumber={dossier.caseNumber}
      />
    </div>
  );
};
