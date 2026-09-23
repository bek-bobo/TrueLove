import React, { useState, useRef, useEffect } from 'react';
import { DossierData, ChatMessage, RubberStamp } from '../types';
import { BrassRivet, BulldogClip, VintageSealStar, CoffeeStain } from './VintagePaperClips';
import { RubberStampTool, RubberStampBadge } from './RubberStampTool';
import { SmartPrivacyLockModal } from './SmartPrivacyLock';
import { ClassifiedChatMessage } from './ClassifiedChatMessage';
import { CustomWaxSeal } from './CustomWaxSeal';
import { AudioCassettePlayer } from './AudioCassettePlayer';
import { BurnDossierModal } from './BurnDossierModal';
import { MatchFlameHeatScrap } from './MatchFlameHeatScrap';
import { RetroPhoneModal } from './RetroPhoneModal';
import { NewspaperRansomLetter } from './NewspaperRansomLetter';
import { noirAudio } from '../utils/audioAmbience';
import { 
  ArrowLeft, 
  ArrowRight, 
  Paperclip, 
  Lock, 
  ShieldCheck, 
  Flame, 
  KeyRound,
  PenTool, 
  Type, 
  Newspaper,
  Shield, 
  Eye, 
  EyeOff,
  Sparkles,
  Phone,
  Camera,
  Mic,
  Image as ImageIcon
} from 'lucide-react';

interface DossierLetterAndChatProps {
  dossier: DossierData;
  onPrev: () => void;
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
  onUnlockSuperSecretMessage: (msgId: string, pin: string) => boolean;
  activeRole: 'recipient' | 'author';
  onToggleRole: () => void;
  fontMode: 'typewriter' | 'handwritten_ink' | 'newspaper_ransom';
  onToggleFontMode: () => void;
  watermarkEnabled: boolean;
  onToggleWatermark: () => void;
  onBurnDossier?: () => void;
}

export const DossierLetterAndChat: React.FC<DossierLetterAndChatProps> = ({
  dossier,
  onPrev,
  onSendMessage,
  onApplyStampToDossier,
  onSetPinCode,
  onUnlockSuperSecretMessage,
  activeRole,
  onToggleRole,
  fontMode,
  onToggleFontMode,
  watermarkEnabled,
  onToggleWatermark,
  onBurnDossier,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isBurned, setIsBurned] = useState(dossier.status === 'burned');
  
  // Classified mode states
  const [selectedMode, setSelectedMode] = useState<'normal' | 'secret' | 'super_secret'>('normal');
  const [superSecretPin, setSuperSecretPin] = useState('1234');
  const [isSettingSuperSecretPin, setIsSettingSuperSecretPin] = useState(false);

  // Typing presence simulation
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    let textToSend = inputText.trim();
    let isSecret = selectedMode === 'secret';
    let isSuperSecret = selectedMode === 'super_secret';
    let pin = isSuperSecret ? superSecretPin : undefined;

    // Detect if user typed @secret or @super_secret in the text directly
    if (textToSend.startsWith('@secret ')) {
      isSecret = true;
      textToSend = textToSend.replace('@secret ', '');
    } else if (textToSend.startsWith('@super_secret ')) {
      isSuperSecret = true;
      textToSend = textToSend.replace('@super_secret ', '');
      if (!pin) pin = '1234';
    }

    noirAudio.playKeyClick();
    onSendMessage(textToSend, activeRole, {
      isSecret,
      isSuperSecret,
      secretPin: pin,
    });

    setInputText('');
    setSelectedMode('normal');

    // Trigger typing presence simulation for other party
    if (activeRole === 'recipient') {
      setTimeout(() => {
        setIsOtherTyping(true);
        noirAudio.playKeyClick();
      }, 1500);

      setTimeout(() => {
        setIsOtherTyping(false);
        // Simulate author auto-reply
        onSendMessage('Har bir so\'z o\'z vaqtida ma\'noga ega bo\'ladi.', 'author');
      }, 4500);
    }

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Attach quick sample detective evidence photo
  const handleAttachPhoto = () => {
    noirAudio.playStamp();
    const samplePhotos = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
    ];
    const pickedPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    onSendMessage('Ushbu dalil fotosuratini tekshirib ko\'ring:', activeRole, {
      mediaType: 'photo',
      mediaUrl: pickedPhoto,
      mediaCaption: 'Arxiv hujjatlari orasidan topilgan surat // 1988',
    });
  };

  // Attach quick voice memo (Fonogramma)
  const handleAttachVoice = () => {
    noirAudio.playCassetteMechanical();
    onSendMessage('Ovozli maxfiy xabar qoldirildi:', activeRole, {
      mediaType: 'voice_note',
      voiceDurationSeconds: 7,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    noirAudio.playKeyClick();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBurn = () => {
    setIsBurnModalOpen(true);
  };

  const handleConfirmBurn = () => {
    setIsBurnModalOpen(false);
    setIsBurned(true);
    if (onBurnDossier) {
      onBurnDossier();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dossier.messages, dossier.stamps, isOtherTyping]);

  if (isBurned) {
    return (
      <div className="w-full max-w-[420px] mx-auto min-h-[640px] bg-[#0c0d10] border-2 border-red-950 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-2xl animate-fadeIn">
        <div className="my-auto space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center animate-pulse">
            <Flame className="w-10 h-10 text-orange-500" />
          </div>

          <h2 className="text-xl font-case font-bold tracking-widest text-[#f5d0a6]">
            ДОСЬЕ УНИЧТОЖЕНО
          </h2>

          <p className="text-xs text-[#a69680] font-dossier-code max-w-[280px]">
            Ushbu xat va barcha anonim suhbatlar o&apos;z-o&apos;zini yo&apos;q qildi. Hech qanday iz qolmadi.
          </p>

          <button
            onClick={() => setIsBurned(false)}
            className="text-xs text-[#caa04b] underline font-mono cursor-pointer pt-4"
          >
            Dosyeni qayta ko&apos;rish (Simulyatsiya)
          </button>
        </div>
      </div>
    );
  }

  const letterFontClass = fontMode === 'handwritten_ink' 
    ? 'font-handwritten-ink text-base sm:text-lg leading-relaxed text-[#2c1d11]' 
    : 'font-serif-vintage text-sm leading-relaxed text-[#231a0e]';

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-[640px] bg-[#14151b] border-2 border-[#3c3425] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.85)] relative overflow-hidden select-none">
      {/* Subtle Texture Grain Overlay */}
      <div className="absolute inset-0 texture-aged-paper opacity-5 pointer-events-none rounded-3xl" />

      {/* Top Header Row with Navigation & Role Switcher */}
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
          {dossier.caseNumber}
        </span>

        {/* Font Mode, Watermark & Detective Phone Call */}
        <div className="flex items-center gap-1.5">
          {/* Retro Telephone Call trigger */}
          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="p-1.5 rounded border border-[#caa04b]/40 bg-[#2b2214] text-[#ffd977] hover:bg-[#382b17] transition-all cursor-pointer text-[10px] flex items-center gap-1 animate-pulse"
            title="Detektiv telefon qo'ng'irog'i (Interaktiv trubka)"
          >
            <Phone className="w-3 h-3 text-[#ffd977]" />
            <span className="font-mono text-[9px] hidden sm:inline">Qo&apos;ng&apos;iroq</span>
          </button>

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
              {fontMode === 'newspaper_ransom' ? 'Gazeta' : fontMode === 'handwritten_ink' ? 'Qo\'lyozma' : 'Mashinka'}
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

      {/* Middle Scrollable Section: Letter, Invisible Ink Flame, Audio Cassette & Chat */}
      <div className="relative my-2 flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
        {/* Top Pinned Secret Letter */}
        <div className="relative pt-1.5">
          {/* Bulldog Binder Clip holding the letter on the top-right corner */}
          <div className="absolute -top-1.5 right-6 z-20">
            <BulldogClip />
          </div>

          {/* Aged Letter Paper Card with optional anti-screenshot watermark */}
          <div className={`texture-aged-paper p-4 sm:p-5 rounded-xs border border-[#a28d6c] shadow-[2px_6px_16px_rgba(0,0,0,0.65)] relative overflow-hidden ${
            watermarkEnabled ? 'anti-screenshot-watermark' : ''
          }`}>
            {/* Confidential Watermark text banner if enabled */}
            {watermarkEnabled && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 select-none rotate-[-30deg]">
                <span className="font-case font-black text-xl text-[#3b2b13] tracking-[0.3em]">
                  CONFIDENTIAL // DELO #05 // DO NOT SCREENSHOT
                </span>
              </div>
            )}

            {/* Header row: Stamp Banner + Rubber Stamps */}
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

            {/* Closing Line & Vintage Star or VIP Wax Seal */}
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

        {/* Gugurt Alangasi (Invisible Ink / Simulated Match Flame) */}
        <div className="px-0.5">
          <MatchFlameHeatScrap
            hiddenSecretText={dossier.secretMatchNote || '«Seni hech qachon unutmaganman. Bu xat tasodif emas edi.»'}
          />
        </div>

        {/* Audio Cassette Player (Voice Evidence) if enabled */}
        {dossier.hasAudioCassette && (
          <div className="px-0.5">
            <AudioCassettePlayer
              title={dossier.cassetteTitle || 'FONOGRAMMA #05 // OVOZLI DALIL'}
              authorName="Muallif (Anonim)"
              duration={28}
            />
          </div>
        )}

        {/* Action Bar: Manual Rubber Stamp, PIN Protect & Burn */}
        <div className="relative flex items-center justify-between px-1 py-0.5">
          <div className="flex items-center gap-2">
            <RubberStampTool
              onApplyStamp={onApplyStampToDossier}
              stampedBy={activeRole}
            />

            <button
              onClick={() => setIsPinModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-[#222530] border border-[#3f382a] text-[11px] font-mono text-[#d6c7af] hover:text-[#ffd977] hover:border-[#caa04b] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="O'qilgandan so'ng PIN-kod o'rnatish"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#caa04b]" />
              <span>{dossier.pinCode ? 'PIN o\'zgartirish' : 'PIN muhr'}</span>
            </button>
          </div>

          <button
            onClick={handleBurn}
            className="text-[10px] font-mono text-[#8a4f4f] hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors p-1"
            title="Dosyeni butunlay yoqib yuborish (Burn)"
          >
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Yoqish</span>
          </button>
        </div>

        {/* Live Anonymous Chat Messages with Lifecycle Stamps & @secret/@super_secret support */}
        <div className="space-y-2.5 px-1">
          {dossier.messages.map((msg) => (
            <ClassifiedChatMessage
              key={msg.id}
              message={msg}
              fontMode={fontMode}
              onUnlockSuperSecret={onUnlockSuperSecretMessage}
            />
          ))}

          {/* Typing Presence Animation */}
          {isOtherTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#caa04b] px-3 py-1.5 bg-[#171922] border border-[#362f22] rounded-lg max-w-[260px] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#caa04b] animate-ping" />
              <span>Muallif mashinkada yozmoqda...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom Message Input Box */}
      <div className="relative pt-2 border-t border-[#292218] z-10 space-y-2">
        {/* Classified Selector Bar: Normal | @secret | @super_secret */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#877964]">Rejim:</span>

            <button
              type="button"
              onClick={() => setSelectedMode('normal')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                selectedMode === 'normal'
                  ? 'bg-[#2a2417] text-[#ffd977] border border-[#caa04b] font-bold'
                  : 'text-[#7e7261] hover:text-white'
              }`}
            >
              Oddiy
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('secret')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                selectedMode === 'secret'
                  ? 'bg-[#381a1a] text-[#ff9999] border border-[#a83232] font-bold'
                  : 'text-[#7e7261] hover:text-[#ff9999]'
              }`}
              title="Qora lenta bilan yopish — ustiga bosilganda ochiladi"
            >
              <EyeOff className="w-2.5 h-2.5" />
              <span>@secret</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('super_secret');
                setIsSettingSuperSecretPin(true);
              }}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                selectedMode === 'super_secret'
                  ? 'bg-red-950 text-red-200 border border-red-500 font-bold'
                  : 'text-[#7e7261] hover:text-red-300'
              }`}
              title="PIN-kod bilan qulflash — faqat kod terilganda ochiladi"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>@super_secret</span>
            </button>
          </div>

          {selectedMode === 'super_secret' && (
            <div className="text-[10px] text-red-300 font-mono">
              PIN: <strong>{superSecretPin}</strong>
            </div>
          )}
        </div>

        {/* Input Box Card with Media Attachment buttons (Photo + Voice) */}
        <form onSubmit={handleSend} className="space-y-2">
          <div className={`relative texture-card-dark rounded-lg p-2.5 border shadow-inner transition-colors ${
            selectedMode === 'super_secret'
              ? 'border-red-700/80 bg-[#1f1010]'
              : selectedMode === 'secret'
              ? 'border-[#943939]/80'
              : 'border-[#3f3523] focus-within:border-[#caa04b]'
          }`}>
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setInputText(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedMode === 'super_secret'
                  ? '🔒 O\'ta maxfiy xabar (PIN bilan qulflanadi)...'
                  : selectedMode === 'secret'
                  ? '🕶️ Yashirin xabar (Qora lenta bilan yopiladi)...'
                  : 'Напиши здесь... Только ты и я знаем, что важно.'
              }
              className="w-full bg-transparent resize-none outline-none text-xs text-[#dfd4c0] placeholder-[#6b604e] font-dossier-code leading-relaxed"
            />

            {/* Bottom tools row: Attach photo & voice buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-[#292218]/80 text-[#716551]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAttachPhoto}
                  className="text-[10px] font-mono hover:text-[#caa04b] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Detektiv rasm biriktirish (Base64/Local)"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Foto</span>
                </button>

                <button
                  type="button"
                  onClick={handleAttachVoice}
                  className="text-[10px] font-mono hover:text-[#caa04b] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Ovozli dalil yuborish (Fonogramma)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Ovoz</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-mono opacity-80">
                  {selectedMode === 'super_secret'
                    ? '[ СОВЕРШЕННО СЕКРЕТНО ]'
                    : selectedMode === 'secret'
                    ? '[ ХРАНИТЬ В ТАЙНЕ ]'
                    : 'Отправка -> [ ПРИНЯТО ]'}
                </span>

                <span className="text-[10px] font-mono">
                  {inputText.length} / 500
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: "Ответить анонимно ->" */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-full py-3 px-5 brass-glow rounded-lg font-case font-bold text-sm tracking-[0.14em] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] hover:brightness-110 cursor-pointer text-[#1d1607] shadow-[0_6px_16px_rgba(180,134,52,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Ответить анонимно</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Smart Privacy Lock Modal */}
      <SmartPrivacyLockModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSave={(pin) => onSetPinCode(pin)}
      />

      {/* Burn Dossier Modal */}
      <BurnDossierModal
        isOpen={isBurnModalOpen}
        onClose={() => setIsBurnModalOpen(false)}
        onConfirmBurn={handleConfirmBurn}
        caseNumber={dossier.caseNumber}
      />

      {/* Retro Detective Telephone Call Modal */}
      <RetroPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        callerNumber={dossier.recipientPhone || '+998 90 123 45 67'}
        recipientRole={activeRole}
      />
    </div>
  );
};
