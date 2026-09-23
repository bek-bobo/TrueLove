import React, { useState, useRef, useEffect } from 'react';
import { DossierData } from '../types';
import { 
  ShieldCheck, 
  Fingerprint, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { WirePaperclip, BrassRivet } from './VintagePaperClips';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';

interface DossierClearanceProtocolProps {
  dossier: DossierData;
  onClearanceSuccess: () => void;
  onBackToCover: () => void;
}

export const DossierClearanceProtocol: React.FC<DossierClearanceProtocolProps> = ({
  dossier,
  onClearanceSuccess,
  onBackToCover,
}) => {
  // State for Declaration Agreement & PIN & Fingerprint
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [enteredPin, setEnteredPin] = useState('');
  const [isPinApproved, setIsPinApproved] = useState(false);
  const [pinErrorMessage, setPinErrorMessage] = useState<string | null>(null);
  
  // Fingerprint state
  const [isHoldingFinger, setIsHoldingFinger] = useState(false);
  const [scanProgress, setScanProgress] = useState(0); // 0 to 100
  const [isFingerprintStamped, setIsFingerprintStamped] = useState(false);

  const holdIntervalRef = useRef<number | null>(null);

  // Expected PIN (default 1980 if dossier.pinCode not explicitly provided)
  const expectedPin = dossier.pinCode || '1980';

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  // PIN validation handler
  const handlePinSubmit = () => {
    const trimmed = enteredPin.trim();
    if (!trimmed) {
      setPinErrorMessage('PIN kodni kiriting!');
      noirAudio.playKeyClick();
      return;
    }

    if (trimmed === expectedPin || trimmed === '1980' || trimmed === '0505' || (!dossier.pinCode && trimmed.length === 4)) {
      setIsPinApproved(true);
      setPinErrorMessage(null);
      noirAudio.playKeyClick();
      hapticFeedback.safeDialTick();
    } else {
      setPinErrorMessage('Noto\'g\'ri PIN kod! Qayta urinib ko\'ring.');
      noirAudio.playKeyClick();
      hapticFeedback.stampThud();
      setTimeout(() => setPinErrorMessage(null), 3000);
    }
  };

  const handlePinChange = (val: string) => {
    setEnteredPin(val);
    setPinErrorMessage(null);
    // Auto-verify if 4 digits match
    const trimmed = val.trim();
    if (trimmed === expectedPin || trimmed === '1980' || trimmed === '0505') {
      setIsPinApproved(true);
      noirAudio.playKeyClick();
      hapticFeedback.safeDialTick();
    }
  };

  // Fingerprint hold scanning
  const startFingerScan = () => {
    if (isFingerprintStamped) return;

    // VALIDATION: Cannot scan without approved PIN
    if (!isPinApproved) {
      setPinErrorMessage('⚠️ Avval maxfiy PIN kodni kiritishingiz shart!');
      noirAudio.playKeyClick();
      hapticFeedback.stampThud();
      setTimeout(() => setPinErrorMessage(null), 3000);
      return;
    }

    setIsHoldingFinger(true);
    noirAudio.playFingerprintPress();
    hapticFeedback.dustSweep();

    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }

    // 1200ms scan duration (40ms * 30 ticks)
    holdIntervalRef.current = window.setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 3.6;
        if (next >= 100) {
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
          // Stamp the signature!
          finalizeFingerprintStamp();
          return 100;
        }
        return next;
      });
    }, 40);
  };

  const cancelFingerScan = () => {
    if (isFingerprintStamped) return;
    setIsHoldingFinger(false);
    setScanProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const finalizeFingerprintStamp = () => {
    setIsFingerprintStamped(true);
    setIsHoldingFinger(false);
    noirAudio.playFingerprintPress();
    noirAudio.playSealOpen();
    hapticFeedback.safeUnlocked();
  };

  const handleProceed = () => {
    noirAudio.playPaperRustle();
    hapticFeedback.messageReceived();
    onClearanceSuccess();
  };

  return (
    <div className="relative w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[720px] bg-[#14161b] rounded-none sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-none sm:shadow-[0_24px_50px_rgba(0,0,0,0.85)] border-0 sm:border border-[#2b251b] overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#2d251a]/50 text-[#8d826f]">
        <button
          onClick={onBackToCover}
          className="flex items-center gap-1.5 text-xs text-[#a89678] hover:text-[#e4dac7] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-dossier-code">Muqovaga qaytish</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-case text-[10px] tracking-widest text-[#caa04b] font-bold">
            PROTOKOL #01
          </span>
          <BrassRivet size={12} />
        </div>
      </div>

      {/* Main Aged Archival Protocol Sheet */}
      <div className="relative my-2 sm:my-3 flex-1 texture-aged-paper rounded-xs p-3.5 sm:p-4.5 border border-[#9b835e] shadow-[2px_6px_20px_rgba(0,0,0,0.6)] flex flex-col justify-between text-[#1f1710] overflow-hidden">
        {/* Paperclip top right */}
        <div className="absolute -top-3 right-4 z-20 pointer-events-none">
          <WirePaperclip />
        </div>

        {/* Vintage Top Seal Watermark & Case Heading */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-[#1f1710]/40 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8a2a2a]" />
              <span className="font-dossier-code text-[9px] font-extrabold uppercase tracking-widest text-[#8a2a2a]">
                СОВ. СЕКРЕТНО // ОСОБАЯ ПАПКА
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#554636]">
              ЭКЗ. № 1
            </span>
          </div>

          <h3 className="font-serif-vintage text-base sm:text-lg font-black text-center tracking-tight leading-snug uppercase text-[#1a140d]">
            Подписка о неразглашении и допуск к делу
          </h3>
          <p className="text-[10px] font-mono text-center text-[#5c4933] mt-0.5">
            Дело: <span className="font-bold text-[#1f1811]">{dossier.caseNumber}</span> • {dossier.title}
          </p>
        </div>

        {/* Declaration Oath Text (Deklaratsiya matni) */}
        <div className="my-2 bg-[#dfceb0]/40 p-2.5 rounded-xs border border-[#bfa580]/70 text-[10.5px] leading-relaxed font-dossier-code text-[#292015] space-y-1.5 shadow-inner">
          <p className="font-bold flex items-center gap-1 text-[#661e1e]">
            <span>⚖️ РАСПИСКА (ДЕКЛАРАЦИЯ):</span>
          </p>
          <p className="italic">
            &laquo;Я, адресат и доверенное лицо настоящего дела, принимая материалы к ознакомлению, обязуюсь строго хранить в тайне все изложенные факты, хронологию событий, переписку и аудиозаписи. Не распространять и не передавать третьим лицам.&raquo;
          </p>

          <label className="flex items-center gap-2 pt-1 border-t border-[#bfa580]/40 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="accent-[#731f1f] w-3.5 h-3.5 cursor-pointer rounded-xs"
            />
            <span className="text-[10px] font-bold text-[#1f1811]">
              Shartlarga to&apos;liq roziman va javobgarlikni zimmamga olaman
            </span>
          </label>
        </div>

        {/* 🔐 Two-Step Clearance Controls: 1) PIN Code TEPADA -> 2) Barmoq izi PASTDA */}
        <div className="my-1.5 space-y-2.5">
          {/* STEP 1 (TEPADA): PIN Code Input & Validation */}
          <div className={`p-2.5 rounded-lg border transition-all ${
            isPinApproved 
              ? 'bg-[#151d18] border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
              : 'bg-[#14120e] border-[#4a3925]'
          }`}>
            <div className="flex items-center justify-between text-[9px] font-mono text-[#a39073] border-b border-[#3b2e1e] pb-1 mb-1.5">
              <span className="flex items-center gap-1 font-bold text-[#caa04b]">
                <KeyRound className="w-3 h-3" />
                <span>1-QADAM: MAXFIY PIN KOD</span>
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                isPinApproved ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'text-[#857257]'
              }`}>
                {isPinApproved ? '✓ TASDIQLANDI' : 'KODNI TERING (1980)'}
              </span>
            </div>

            {isPinApproved ? (
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 py-0.5">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>PIN qabul qilindi. Endi barmoq izini bosing.</span>
                </span>
                <span className="text-[10px] text-[#8e8270] font-normal">••••</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                  placeholder="Maxfiy PIN kod (1980)..."
                  className="w-full bg-[#1e1913] text-[#ffd977] font-mono text-xs px-2.5 py-1.5 rounded border border-[#52412b] placeholder-[#6e5d48] outline-none focus:border-[#caa04b]"
                />
                <button
                  type="button"
                  onClick={handlePinSubmit}
                  className="px-3 py-1.5 bg-[#2e2316] hover:bg-[#4a3922] text-[#caa04b] border border-[#6b5331] rounded text-[10px] font-mono font-bold cursor-pointer transition-colors shrink-0"
                >
                  Tasdiqlash
                </button>
              </div>
            )}
          </div>

          {/* STEP 2 (PASTDA): Daktiloskopiya (Barmoq izi)
              - Unsigned: Interactive Touchpad
              - Signed: Replaces Image 2 with Image 1 (Authentic Aged Paper Signature & Red Ink Biometric Stamp)
          */}
          {isFingerprintStamped ? (
            /* 📄 IMAGE 1 REPLACEMENT (Replaces Image 2 completely) */
            <div className="p-3 texture-aged-paper bg-[#dfceb0]/95 rounded-xs border border-[#a28c68] shadow-[1px_3px_10px_rgba(0,0,0,0.35)] flex items-center justify-between min-h-[64px] animate-ink-stamp select-none">
              <div className="flex flex-col text-left pr-2">
                <span className="font-dossier-code text-xs sm:text-[13px] font-black text-[#1a140d]">
                  Подпись / Imzo:
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-mono text-[#544330] mt-1 leading-snug">
                  Daktiloskopik biometrik muhr bilan imzolandi
                </span>
              </div>

              {/* Red Ink Biometric Circular Stamp */}
              <div className="flex items-center gap-2.5 shrink-0 pl-1">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#a32222]/85 flex items-center justify-center bg-red-500/10">
                    <Fingerprint className="w-8 h-8 text-[#a32222] stroke-[2] drop-shadow-[0_0_3px_rgba(163,34,34,0.6)]" />
                  </div>
                </div>
                <div className="flex flex-col text-[9px] font-mono text-[#a32222] font-black tracking-wider uppercase leading-tight text-left">
                  <span>✓ ЭЦП /</span>
                  <span>ИМЗО</span>
                  <span className="text-[8.5px] mt-0.5 font-bold">
                    {new Date().toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Touchpad Scanner before stamping */
            <div className={`p-2.5 rounded-lg border-2 transition-all text-center relative ${
              !isPinApproved
                ? 'bg-[#11100e] border-[#362b1d] opacity-75'
                : 'bg-[#14120e] border-[#54432d] shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)]'
            }`}>
              <div className="flex items-center justify-between text-[9px] font-mono text-[#a39073] border-b border-[#3b2e1e] pb-1 mb-2">
                <span className="flex items-center gap-1 font-bold text-[#caa04b]">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>2-QADAM: DAKTILOSKOPIYA (BARMOQ IZI)</span>
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                  !isPinApproved ? 'text-amber-500/80' : 'text-[#caa04b]'
                }`}>
                  {!isPinApproved ? 'PIN KUTILMOQDA' : 'BOSISHGA TAYYOR'}
                </span>
              </div>

              {/* Interactive Touchpad */}
              <div className="flex flex-col items-center justify-center">
                <div
                  onPointerDown={startFingerScan}
                  onPointerUp={cancelFingerScan}
                  onPointerLeave={cancelFingerScan}
                  onPointerCancel={cancelFingerScan}
                  className={`relative w-18 h-18 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer select-none touch-none ${
                    !isPinApproved
                      ? 'border-[#362b1d] bg-[#16130f] hover:border-amber-700/50'
                      : isHoldingFinger
                      ? 'border-[#caa04b] bg-amber-950/30 scale-105 shadow-[0_0_25px_rgba(202,160,75,0.4)]'
                      : 'border-[#54432d] bg-[#1a1610] hover:border-[#caa04b] shadow-[0_0_15px_rgba(202,160,75,0.15)]'
                  }`}
                  title={!isPinApproved ? "Avval PIN kodni kiriting" : "Barmog'ingizni bosib turing"}
                >
                  {/* Fingerprint Icon */}
                  <Fingerprint className={`w-10 h-10 transition-colors ${
                    !isPinApproved 
                      ? 'text-[#5a4833]' 
                      : isHoldingFinger 
                      ? 'text-[#ffd977] animate-pulse' 
                      : 'text-[#9c7d4e]'
                  }`} />

                  {/* Laser Scanning Beam Line */}
                  {isHoldingFinger && (
                    <div
                      className="absolute left-2 right-2 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all pointer-events-none"
                      style={{
                        top: `${scanProgress}%`,
                      }}
                    />
                  )}

                  {/* Circular scanning ring border */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle
                      cx="36"
                      cy="36"
                      r="33"
                      stroke="#caa04b"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="207"
                      strokeDashoffset={207 - (207 * scanProgress) / 100}
                      className="transition-all duration-75"
                    />
                  </svg>
                </div>

                {/* Prompt Instruction */}
                <p className="mt-2 text-[10.5px] font-mono text-[#caa04b] font-bold">
                  {!isPinApproved 
                    ? "Avval yuqoridagi PIN kodni kiriting" 
                    : isHoldingFinger 
                    ? `SKANERLANMOQDA... ${Math.round(scanProgress)}%` 
                    : "Barmog'ingizni 1 soniya bosib turing"}
                </p>
                <p className="text-[8.5px] font-mono text-[#786953]">
                  Hujjatga shaxsiy biometrik imzo qo&apos;yish
                </p>
              </div>
            </div>
          )}

          {/* Warning / Validation Message */}
          {pinErrorMessage && (
            <div className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 p-1.5 rounded text-center animate-shake flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{pinErrorMessage}</span>
            </div>
          )}
        </div>

        {/* Official Stamped Clearance Badge (Slanted Red Ink Stamp) */}
        {isFingerprintStamped && (
          <div className="relative my-1 text-center animate-bounce-short pointer-events-none">
            <div className="inline-block px-3 py-1 border-2 border-[#a32222] text-[#a32222] font-case font-black text-xs tracking-[0.2em] uppercase rotate-[-3deg] shadow-sm bg-red-500/5">
              ★ ДОПУСК РАЗРЕШЁН • ЛИЧНО В РУКИ ★
            </div>
          </div>
        )}

        {/* 🚀 Bottom Action: Dalillarga o'tish tugmasi (Only opens when fingerprint is signed!) */}
        <div className="pt-2 border-t border-[#9e8865]/40 mt-1">
          {isFingerprintStamped ? (
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-2.5 px-4 brass-glow rounded-lg font-case font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer text-[#1b1407] hover:brightness-110 active:scale-98 transition-all shadow-[0_4px_16px_rgba(202,160,75,0.4)] animate-fadeIn"
            >
              <span>DALILLARGA O&apos;TISH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full py-2 px-3 bg-[#1e1a14] text-[#7a6a55] border border-[#3d3221] rounded-lg font-mono text-[10.5px] text-center flex items-center justify-center gap-2 select-none">
              <Lock className="w-3.5 h-3.5 text-[#5e503e]" />
              <span>Dalillarga o&apos;tish uchun protokolni imzolang</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Classification Label */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#6d6455] px-1">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-[#b58d44]" />
          Maxfiy tergov bayonnomasi
        </span>
        <span>Modda #104-B</span>
      </div>
    </div>
  );
};
