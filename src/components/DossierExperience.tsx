import React, { useState } from 'react';
import { DossierData, DossierStep, RubberStamp } from '../types';
import { DossierCover } from './DossierCover';
import { DossierClearanceProtocol } from './DossierClearanceProtocol';
import { DossierTimeline } from './DossierTimeline';
import { DossierLetter } from './DossierLetter';
import { DossierChatWiretap } from './DossierChatWiretap';
import { DossierVerdict } from './DossierVerdict';
import { DossierLockedScreen } from './SmartPrivacyLock';
import { DeliveryTrackerConsole } from './DeliveryTrackerConsole';
import { CandleFlickerOverlay } from './CandleFlickerOverlay';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Smartphone, 
  Monitor, 
  BookOpen, 
  Clock, 
  FileText,
  Radio,
  MessageSquareQuote,
  Award,
  Lock,
  Music,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { useTouchScrollLock } from '../hooks/useTouchScrollLock';

interface DossierExperienceProps {
  dossier: DossierData;
  onSendMessage: (
    text: string, 
    sender: 'author' | 'recipient',
    options?: {
      isSecret?: boolean;
      isSuperSecret?: boolean;
      secretPin?: string;
      stamp?: RubberStamp;
      mediaType?: 'photo' | 'voice_note';
      mediaUrl?: string;
      mediaCaption?: string;
      voiceDurationSeconds?: number;
    }
  ) => void;
  onApplyStampToDossier: (stamp: RubberStamp) => void;
  onSetPinCode: (pin: string) => void;
  onUnlockDossier: (pin: string) => boolean;
  onToggleLockState: () => void;
  onUnlockSuperSecretMessage: (msgId: string, pin: string) => boolean;
  activeRole: 'recipient' | 'author';
  onToggleRole: () => void;
  onBurnDossier?: () => void;
}

export const DossierExperience: React.FC<DossierExperienceProps> = ({
  dossier,
  onSendMessage,
  onApplyStampToDossier,
  onSetPinCode,
  onUnlockDossier,
  onToggleLockState,
  onUnlockSuperSecretMessage,
  activeRole,
  onToggleRole,
  onBurnDossier,
}) => {
  const [currentStep, setCurrentStep] = useState<DossierStep>('cover');
  const [isMuted, setIsMuted] = useState(noirAudio.getMuted());
  const [isRainActive, setIsRainActive] = useState(noirAudio.isRainActive());
  const [viewMode, setViewMode] = useState<'single_phone' | 'all_three'>('single_phone');
  
  // Font mode & Watermark state
  const [fontMode, setFontMode] = useState<'typewriter' | 'handwritten_ink' | 'newspaper_ransom'>(dossier.fontMode || 'handwritten_ink');
  const [watermarkEnabled, setWatermarkEnabled] = useState(dossier.watermarkEnabled !== undefined ? dossier.watermarkEnabled : true);
  
  // Ambient Noir Jazz & Candle Room
  const [isJazzActive, setIsJazzActive] = useState(noirAudio.isJazzActive());
  const [isCandleActive, setIsCandleActive] = useState(false);

  // Custom JS touch-lock butunlay o'chirildi — barcha ekranlarda (shu
  // jumladan Timeline/Letter/Chat/Verdict) endi scroll 100% brauzerning
  // o'z tabiiy mexanizmi orqali ishlaydi. Ichki ro'yxatlar oxiriga
  // yetganda tashqi sahifa "sakramasligi" esa CSS'dagi
  // "overscroll-behavior: contain" (.dossier-scroll-lock klassi,
  // src/index.css) orqali JS'siz ta'minlanadi — bu ancha ishonchli.
  const touchLockRef = useTouchScrollLock<HTMLDivElement>(false);

  // Sync state whenever active dossier changes
  React.useEffect(() => {
    if (dossier.fontMode) {
      setFontMode(dossier.fontMode);
    }
    if (dossier.watermarkEnabled !== undefined) {
      setWatermarkEnabled(dossier.watermarkEnabled);
    }
  }, [dossier.id, dossier.fontMode, dossier.watermarkEnabled]);

  const toggleSound = () => {
    const muted = noirAudio.toggleMute();
    setIsMuted(muted);
    setIsRainActive(noirAudio.isRainActive());
    setIsJazzActive(noirAudio.isJazzActive());
  };

  const toggleRain = () => {
    const active = noirAudio.toggleRainAmbience();
    setIsRainActive(active);
  };

  const toggleJazz = () => {
    const active = noirAudio.toggleNoirJazz();
    setIsJazzActive(active);
  };

  const toggleCandle = () => {
    noirAudio.playMatchStrike();
    setIsCandleActive((prev) => !prev);
  };

  // Scalable Step Registry (Can be expanded to 6-7 steps seamlessly)
  const steps: { key: DossierStep; stepNumber: number; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { key: 'cover', stepNumber: 1, label: '1. Muqova (ДЕЛО № 05)', shortLabel: '1. Muqova', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: 'clearance', stepNumber: 2, label: '2. Protokol & Otpechatka', shortLabel: '2. Protokol', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { key: 'timeline', stepNumber: 3, label: '3. Xronologiya & Lupa', shortLabel: '3. Dalillar', icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'letter', stepNumber: 4, label: '4. Asl Maktub & Siyoh', shortLabel: '4. Maktub', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'chat', stepNumber: 5, label: '5. Shifrlangan Telegraf', shortLabel: '5. Telegraf', icon: <Radio className="w-3.5 h-3.5" /> },
    { key: 'verdict', stepNumber: 6, label: '6. Yakuniy Hukm & Yoqish', shortLabel: '6. Hukm', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  // If dossier is currently locked with PIN
  if (dossier.isPinLocked && dossier.pinCode) {
    return (
      <div className="py-6">
        <DossierLockedScreen
          caseNumber={dossier.caseNumber}
          onUnlock={onUnlockDossier}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Experience Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-[#171920] border-y sm:border border-[#2d251a] p-2 sm:p-3 rounded-none sm:rounded-2xl max-w-4xl mx-auto">
        {/* Step Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto p-1 bg-[#101217] rounded-lg sm:rounded-xl border border-[#272116] max-w-full">
          {steps.map((s) => {
            const isActive = currentStep === s.key;
            return (
              <button
                key={s.key}
                onClick={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep(s.key);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-case font-bold tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'brass-glow text-[#1b1407] shadow-sm'
                    : 'text-[#9c8e7b] hover:text-[#e4dac7] hover:bg-white/5'
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Gentle Rain Ambience Toggle */}
          <button
            onClick={toggleRain}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRainActive
                ? 'bg-[#1e2a3a] border-cyan-700/60 text-cyan-300'
                : 'bg-[#12141a] border-[#29241c] text-[#716551] hover:text-[#c4b69f]'
            }`}
            title={isRainActive ? 'Yomg\'ir fonini o\'chirish' : 'Detektiv yomg\'ir fonini yoqish'}
          >
            <CloudRain className={`w-4 h-4 ${isRainActive ? 'animate-bounce text-cyan-300' : ''}`} />
            <span className="font-mono text-[11px] hidden sm:inline">
              {isRainActive ? 'Yomg\'ir' : 'Yomg\'ir'}
            </span>
          </button>

          {/* Noir Jazz Saxophone & Vinyl Ambient Toggle */}
          <button
            onClick={toggleJazz}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isJazzActive
                ? 'bg-[#2b1f14] border-[#caa04b] text-[#ffd977] ring-1 ring-[#caa04b]/40'
                : 'bg-[#12141a] border-[#29241c] text-[#716551] hover:text-[#c4b69f]'
            }`}
            title={isJazzActive ? 'Noir Jazz musiqasini o\'chirish' : 'Detektiv Jazz & Saksafon fonini yoqish'}
          >
            <Music className={`w-4 h-4 ${isJazzActive ? 'animate-pulse text-[#ffd977]' : ''}`} />
            <span className="font-mono text-[11px] hidden sm:inline">
              {isJazzActive ? 'Jazz: ON' : 'Noir Jazz'}
            </span>
          </button>

          {/* Candlelight Flicker Mode Toggle */}
          <button
            onClick={toggleCandle}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isCandleActive
                ? 'bg-[#3b2310] border-orange-500 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                : 'bg-[#12141a] border-[#29241c] text-[#716551] hover:text-[#c4b69f]'
            }`}
            title={isCandleActive ? 'Sham yorug\'ini o\'chirish' : 'Tungi xona va sham shulasini yoqish'}
          >
            <Flame className={`w-4 h-4 ${isCandleActive ? 'text-orange-400 animate-bounce' : ''}`} />
            <span className="font-mono text-[11px] hidden sm:inline">
              {isCandleActive ? 'Sham: ON' : 'Sham shulasi'}
            </span>
          </button>

          {/* Typewriter Audio toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-[#292215] border-[#b58d44] text-[#dfbe7e]'
                : 'bg-[#12141a] border-[#29241c] text-[#716551]'
            }`}
            title={isMuted ? 'Ovozni yoqish' : 'Ovozni o\'chirish'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#ffd977]" />}
            <span className="font-mono text-[11px] hidden sm:inline">
              {!isMuted ? 'Ovoz' : 'O\'chiq'}
            </span>
          </button>

          {/* PIN Lock toggle (if PIN exists) */}
          {dossier.pinCode && (
            <button
              onClick={onToggleLockState}
              className="p-2 rounded-lg bg-[#271c1c] border border-red-900/50 text-red-300 hover:text-red-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Dosyeni hoziroq qulflab qo'yish"
            >
              <Lock className="w-4 h-4" />
              <span className="font-mono text-[11px] hidden sm:inline">Qulflash</span>
            </button>
          )}

          {/* Toggle 3 screens side-by-side (like in the photo) vs Single Phone */}
          <button
            onClick={() => setViewMode((prev) => (prev === 'single_phone' ? 'all_three' : 'single_phone'))}
            className="p-2 rounded-lg bg-[#1a1c24] border border-[#2f281e] text-[#cfc4b1] hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            title="Barcha ekranlarni yonma-yon panorama ko'rish"
          >
            {viewMode === 'single_phone' ? (
              <>
                <Monitor className="w-4 h-4 text-[#caa04b]" />
                <span className="font-mono text-[11px] hidden sm:inline">Panorama (5 UI)</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#caa04b]" />
                <span className="font-mono text-[11px] hidden sm:inline">Telefon</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Delivery Tracker HUD (Visible ONLY to Author) */}
      <div className="max-w-4xl mx-auto px-2">
        <DeliveryTrackerConsole
          dossier={dossier}
          activeRole={activeRole}
          currentStep={currentStep}
        />
      </div>

      {/* Main View Area */}
      {viewMode === 'all_three' ? (
        /* Panoramic Side-by-Side View of all Steps */
        <div className="space-y-4">
          <div className="text-center text-xs font-dossier-code text-[#caa04b] flex items-center justify-center gap-2">
            <span>6 TA BOSQICHLI DETEKTIV FLOW: TO&apos;LIQ PANORAMA</span>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 pt-1 px-4 max-w-full snap-x snap-mandatory">
            {/* Screen 1: Cover */}
            <div className="flex flex-col items-center shrink-0 w-[380px] snap-center">
              <div className="text-[11px] font-mono text-[#caa04b] mb-2 uppercase tracking-widest font-bold bg-[#14161f] px-3 py-1 rounded-full border border-[#2f271a]">
                1-Qadam: Maxfiy Muqova
              </div>
              <DossierCover
                dossier={dossier}
                onOpenDossier={() => {
                  noirAudio.playSealOpen();
                  setCurrentStep('clearance');
                }}
              />
            </div>

            {/* Screen 2: Clearance Protocol */}
            <div className="flex flex-col items-center shrink-0 w-[380px] snap-center">
              <div className="text-[11px] font-mono text-[#caa04b] mb-2 uppercase tracking-widest font-bold bg-[#14161f] px-3 py-1 rounded-full border border-[#2f271a]">
                2-Qadam: Ruxsat Protokoli &amp; Otpechatka
              </div>
              <DossierClearanceProtocol
                dossier={dossier}
                onClearanceSuccess={() => setCurrentStep('timeline')}
                onBackToCover={() => setCurrentStep('cover')}
              />
            </div>

            {/* Screen 3: Timeline */}
            <div className="flex flex-col items-center shrink-0 w-[380px] snap-center">
              <div className="text-[11px] font-mono text-[#caa04b] mb-2 uppercase tracking-widest font-bold bg-[#14161f] px-3 py-1 rounded-full border border-[#2f271a]">
                3-Qadam: Xronologiya &amp; Lupa
              </div>
              <DossierTimeline
                dossier={dossier}
                onPrev={() => setCurrentStep('clearance')}
                onNext={() => setCurrentStep('letter')}
              />
            </div>

            {/* Screen 4: Asl Maktub */}
            <div className="flex flex-col items-center shrink-0 w-[380px] snap-center">
              <div className="text-[11px] font-mono text-[#caa04b] mb-2 uppercase tracking-widest font-bold bg-[#14161f] px-3 py-1 rounded-full border border-[#2f271a]">
                4-Qadam: Asl Maktub &amp; Siyoh
              </div>
              <DossierLetter
                dossier={dossier}
                onPrev={() => setCurrentStep('timeline')}
                onNext={() => setCurrentStep('chat')}
                onApplyStampToDossier={onApplyStampToDossier}
                fontMode={fontMode}
                onToggleFontMode={() => setFontMode((f) => {
                  if (f === 'handwritten_ink') return 'typewriter';
                  if (f === 'typewriter') return 'newspaper_ransom';
                  return 'handwritten_ink';
                })}
                watermarkEnabled={watermarkEnabled}
                onToggleWatermark={() => setWatermarkEnabled((w) => !w)}
                activeRole={activeRole}
              />
            </div>

            {/* Screen 5: Shifrlangan Telegraf */}
            <div className="flex flex-col items-center shrink-0 w-[380px] snap-center">
              <div className="text-[11px] font-mono text-[#caa04b] mb-2 uppercase tracking-widest font-bold bg-[#14161f] px-3 py-1 rounded-full border border-[#2f271a]">
                5-Qadam: Shifrlangan Telegraf
              </div>
              <DossierChatWiretap
                dossier={dossier}
                onPrev={() => setCurrentStep('letter')}
                onNext={() => setCurrentStep('verdict')}
                onSendMessage={onSendMessage}
                onUnlockSuperSecretMessage={onUnlockSuperSecretMessage}
                activeRole={activeRole}
                onToggleRole={onToggleRole}
                fontMode={fontMode}
              />
            </div>

            {/* Screen 6: Yakuniy Hukm */}
            <div className="flex flex-col items-center shrink-0 w-[380px] snap-center">
              <div className="text-[11px] font-mono text-[#caa04b] mb-2 uppercase tracking-widest font-bold bg-[#14161f] px-3 py-1 rounded-full border border-[#2f271a]">
                6-Qadam: Yakuniy Hukm &amp; Yoqish
              </div>
              <DossierVerdict
                dossier={dossier}
                onPrev={() => setCurrentStep('chat')}
                onRestart={() => setCurrentStep('cover')}
                onSendMessage={(text) => onSendMessage(text, 'recipient')}
                onBurnDossier={onBurnDossier}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Single Phone Interactive View */
        <div ref={touchLockRef} className="relative flex justify-center py-0 sm:py-2 px-0 sm:px-2">
          {/* Noir Ambient Breathing Spotlight (Asta-sekin yonib-o'chuvchi sirli yorug'lik effekti) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[460px] h-[300px] sm:h-[460px] rounded-full bg-gradient-to-tr from-amber-600/15 via-[#caa04b]/20 to-yellow-600/10 pointer-events-none animate-noir-breathing -z-10" />

          {currentStep === 'cover' && (
            <div className="w-full sm:max-w-[420px] animate-fadeIn">
              <DossierCover
                dossier={dossier}
                onOpenDossier={() => {
                  noirAudio.playSealOpen();
                  setCurrentStep('clearance');
                }}
              />
            </div>
          )}

          {currentStep === 'clearance' && (
            <div className="w-full sm:max-w-[420px] animate-fadeIn">
              <DossierClearanceProtocol
                dossier={dossier}
                onClearanceSuccess={() => {
                  setCurrentStep('timeline');
                }}
                onBackToCover={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('cover');
                }}
              />
            </div>
          )}

          {currentStep === 'timeline' && (
            <div className="w-full sm:max-w-[420px] animate-fadeIn">
              <DossierTimeline
                dossier={dossier}
                onPrev={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('clearance');
                }}
                onNext={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('letter');
                }}
              />
            </div>
          )}

          {(currentStep === 'letter' || currentStep === 'letter_chat') && (
            <div className="w-full sm:max-w-[420px] animate-fadeIn">
              <DossierLetter
                dossier={dossier}
                onPrev={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('timeline');
                }}
                onNext={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('chat');
                }}
                onApplyStampToDossier={onApplyStampToDossier}
                fontMode={fontMode}
                onToggleFontMode={() => setFontMode((f) => {
                  if (f === 'handwritten_ink') return 'typewriter';
                  if (f === 'typewriter') return 'newspaper_ransom';
                  return 'handwritten_ink';
                })}
                watermarkEnabled={watermarkEnabled}
                onToggleWatermark={() => setWatermarkEnabled((w) => !w)}
                activeRole={activeRole}
              />
            </div>
          )}

          {currentStep === 'chat' && (
            <div className="w-full sm:max-w-[420px] animate-fadeIn">
              <DossierChatWiretap
                dossier={dossier}
                onPrev={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('letter');
                }}
                onNext={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('verdict');
                }}
                onSendMessage={onSendMessage}
                onUnlockSuperSecretMessage={onUnlockSuperSecretMessage}
                activeRole={activeRole}
                onToggleRole={onToggleRole}
                fontMode={fontMode}
              />
            </div>
          )}

          {currentStep === 'verdict' && (
            <div className="w-full sm:max-w-[420px] animate-fadeIn">
              <DossierVerdict
                dossier={dossier}
                onPrev={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('chat');
                }}
                onRestart={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep('cover');
                }}
                onSendMessage={(text) => onSendMessage(text, 'recipient')}
                onBurnDossier={onBurnDossier}
              />
            </div>
          )}
        </div>
      )}

      {/* Atmospheric Candle Flicker Room Overlay */}
      <CandleFlickerOverlay
        isActive={isCandleActive}
        onToggle={toggleCandle}
      />
    </div>
  );
};
