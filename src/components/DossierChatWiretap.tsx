import React, { useState, useRef, useEffect } from 'react';
import { DossierData, ChatMessage } from '../types';
import { ClassifiedChatMessage } from './ClassifiedChatMessage';
import { RetroPhoneModal } from './RetroPhoneModal';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';
import { useTouchScrollLock } from '../hooks/useTouchScrollLock';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  EyeOff,
  Lock,
  Phone,
  Radio,
  Image as ImageIcon,
  Mic,
  KeyRound,
  Paperclip,
  Archive,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Scale,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface DossierChatWiretapProps {
  dossier: DossierData;
  onPrev: () => void;
  onNext: () => void;
  onSendMessage: (
    text: string,
    sender: 'author' | 'recipient',
    options?: {
      isSecret?: boolean;
      isSuperSecret?: boolean;
      secretPin?: string;
      mediaType?: 'photo' | 'voice_note';
      mediaUrl?: string;
      mediaCaption?: string;
      voiceDurationSeconds?: number;
      isFinal?: boolean;
    }
  ) => void;
  onUnlockSuperSecretMessage: (msgId: string, pin: string) => boolean;
  activeRole: 'recipient' | 'author';
  onToggleRole: () => void;
  fontMode: 'typewriter' | 'handwritten_ink' | 'newspaper_ransom';
}

export const DossierChatWiretap: React.FC<DossierChatWiretapProps> = ({
  dossier,
  onPrev,
  onNext,
  onSendMessage,
  onUnlockSuperSecretMessage,
  activeRole,
  onToggleRole,
  fontMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'normal' | 'secret' | 'super_secret' | 'final'>('normal');
  const [superSecretPin, setSuperSecretPin] = useState('1234');
  const [isSettingSuperSecretPin, setIsSettingSuperSecretPin] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [pinEditDraft, setPinEditDraft] = useState('');

  // Final Step 5 (@final) summons state and confirmation
  const [showFinalConfirmModal, setShowFinalConfirmModal] = useState(false);
  const [finalDraftText, setFinalDraftText] = useState('');

  // Check if @final command has been dispatched into the case
  const isFinalUnlocked = dossier.messages.some(
    (m) => m.isFinal || m.text.startsWith('@final') || m.text.includes('@final')
  );

  // 1. Pagination / Archival storage for chat messages (shows last 4 by default)
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isDustBlowing, setIsDustBlowing] = useState(false);
  const [dustParticles, setDustParticles] = useState<{ id: number; tx: number; ty: number; size: number }[]>([]);

  // 2. Auto-expanding Textarea reference
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevCountRef = useRef(dossier.messages.length);

  // Passive touch scroll lock preventing parent page bouncing/jumping
  const touchLockRef = useTouchScrollLock<HTMLDivElement>(true);

  // 3. Attachment popover & staged media
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [stagedMedia, setStagedMedia] = useState<{
    type: 'photo' | 'voice_note';
    url?: string;
    caption?: string;
    duration?: number;
  } | null>(null);

  // Auto-expand textarea downwards smoothly without showing vertical scrollbar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 130);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputText]);

  // Handle Send action
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !stagedMedia) return;

    let textToSend = inputText.trim();

    // Intercept @final from Author: Requires explicit confirmation before sending!
    if (
      activeRole === 'author' &&
      (textToSend.startsWith('@final') || textToSend === '@final' || selectedMode === 'final')
    ) {
      const cleanDraft = textToSend.replace('@final', '').trim();
      setFinalDraftText(cleanDraft || 'Ishni yakunlash va oxirgi hukm chiqarish vaqti keldi.');
      setShowFinalConfirmModal(true);
      return;
    }

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

    // If only sending media without text, provide a default note
    if (!textToSend && stagedMedia) {
      textToSend = stagedMedia.type === 'photo' ? 'Dalil fotosurati ilova qilindi' : 'Ovozli maxfiy xabar qoldirildi';
    }

    noirAudio.playKeyClick();
    hapticFeedback.messageReceived();
    onSendMessage(textToSend, activeRole, {
      isSecret,
      isSuperSecret,
      secretPin: pin,
      mediaType: stagedMedia?.type,
      mediaUrl: stagedMedia?.url,
      mediaCaption: stagedMedia?.caption,
      voiceDurationSeconds: stagedMedia?.duration,
    });

    setInputText('');
    setStagedMedia(null);
    setIsAttachmentMenuOpen(false);
    setSelectedMode('normal');

    // Trigger typing presence simulation for other party
    if (activeRole === 'recipient') {
      setTimeout(() => {
        setIsOtherTyping(true);
        noirAudio.playKeyClick();
      }, 1400);

      setTimeout(() => {
        setIsOtherTyping(false);
        // Simulate author auto-reply
        onSendMessage('Har bir so\'z o\'z vaqtida ma\'noga ega bo\'ladi.', 'author');
      }, 4200);
    }

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Author confirmed sending @final summons to Step 5
  const handleConfirmSendFinal = () => {
    setShowFinalConfirmModal(false);
    noirAudio.playStamp();
    const finalMsg = finalDraftText.trim() || 'Ishni yakunlash va oxirgi hukm chiqarish vaqti keldi.';
    onSendMessage(finalMsg, 'author', {
      isFinal: true,
    });
    setInputText('');
    setFinalDraftText('');
    setSelectedMode('normal');
  };

  // Attach sample archive photo
  const handlePickSamplePhoto = () => {
    noirAudio.playStamp();
    const samplePhotos = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
    ];
    const pickedPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setStagedMedia({
      type: 'photo',
      url: pickedPhoto,
      caption: 'Arxiv hujjatlari orasidan topilgan dalil surati // 1988',
    });
    setIsAttachmentMenuOpen(false);
  };

  // Upload custom photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024; // 1.5MB
    if (file.size > MAX_PHOTO_BYTES) {
      setFileUploadError('Rasm juda katta (max 1.5MB). Iltimos kichikroq fotosurat tanlang.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setFileUploadError(null);

    noirAudio.playStamp();
    const reader = new FileReader();
    reader.onload = () => {
      setStagedMedia({
        type: 'photo',
        url: reader.result as string,
        caption: `Biriktirilgan dalil: ${file.name}`,
      });
      setIsAttachmentMenuOpen(false);
    };
    reader.readAsDataURL(file);
  };

  // Attach voice note / golosovoy
  const handleAttachVoiceNote = () => {
    noirAudio.playCassetteMechanical();
    setStagedMedia({
      type: 'voice_note',
      duration: 7,
      caption: 'Fonogramma // Ovozli maxfiy lenta (0:07)',
    });
    setIsAttachmentMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    noirAudio.playKeyClick();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Open archive in batches of 3 with dust puff effect
  const handleOpenArchive = () => {
    noirAudio.playDustBlow();
    setIsDustBlowing(true);

    // Generate 16 randomized vintage dust particles blowing outwards
    const newParticles = Array.from({ length: 16 }).map((_, i) => ({
      id: Date.now() + i,
      tx: (Math.random() - 0.5) * 140,
      ty: (Math.random() - 0.5) * 60 - 15,
      size: Math.random() * 4 + 2.5,
    }));
    setDustParticles(newParticles);

    setTimeout(() => {
      setIsDustBlowing(false);
      setDustParticles([]);
    }, 700);

    setVisibleCount((prev) => Math.min(dossier.messages.length, prev + 3));
  };

  // Only scroll down when a NEW message arrives or typing changes - NOT on archive open!
  useEffect(() => {
    if (dossier.messages.length > prevCountRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      hapticFeedback.messageReceived();
      // Subtle, low-frequency paper slide sound effect complementing the 0.3s message-slide-in animation
      noirAudio.playPaperSlide();
    } else if (isOtherTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevCountRef.current = dossier.messages.length;
  }, [dossier.messages.length, isOtherTyping]);

  // Compute pagination slices
  const totalMessages = dossier.messages.length;
  const archivedCount = Math.max(0, totalMessages - visibleCount);
  const displayedMessages = dossier.messages.slice(-visibleCount);

  return (
    <div
      ref={touchLockRef}
      className="w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[660px] bg-[#14151b] border-0 sm:border-2 border-[#3c3425] rounded-none sm:rounded-3xl p-2.5 sm:p-5 flex flex-col justify-between shadow-none sm:shadow-[0_15px_45px_rgba(0,0,0,0.85)] relative overflow-hidden select-none"
    >
      {/* Background Vintage Grid Texture */}
      <div className="absolute inset-0 texture-aged-paper opacity-5 pointer-events-none rounded-none sm:rounded-3xl" />

      {/* Top Header Row (Mobile-Clean, Never Wraps, Perfect Hierarchy) */}
      <div className="relative flex items-center justify-between pb-2.5 border-b border-[#30281c] z-10 gap-1.5">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => {
            noirAudio.playPaperRustle();
            onPrev();
          }}
          className="text-xs font-mono text-[#a89b88] hover:text-[#e4dac7] flex items-center gap-1 cursor-pointer transition-colors py-1 px-1 -ml-1 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Maktub</span>
        </button>

        {/* Centered Step Pill (No wrapping, whitespace-nowrap) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181a24] border border-[#caa04b]/40 shrink-0 shadow-inner">
          <Radio className="w-3 h-3 text-[#caa04b] animate-pulse shrink-0" />
          <span className="font-case text-[10px] sm:text-xs tracking-wider text-[#d6b77c] font-bold whitespace-nowrap">
            5-QADAM: TELEGRAF
          </span>
        </div>

        {/* Right Actions: Phone Icon Button & Role Switcher */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsPhoneModalOpen(true)}
            className="p-1.5 rounded-lg border border-[#caa04b]/50 bg-[#2b2214] text-[#ffd977] hover:bg-[#382b17] transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center shrink-0"
            title="Detektiv telefon qo'ng'irog'i"
          >
            <Phone className="w-3.5 h-3.5 text-[#ffd977]" />
          </button>

          <button
            type="button"
            onClick={onToggleRole}
            className="px-2 py-1 rounded-lg text-[9px] font-mono border border-[#443828] bg-[#1a1712] text-[#c9b798] hover:text-white cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0"
            title="Suhbatdosh rolini almashtirish"
          >
            {activeRole === 'recipient' ? 'Qabul qiluvchi' : 'Muallif'}
          </button>
        </div>
      </div>

      {/* Center Messages Log (With Archival Pagination) */}
      <div className="relative my-2.5 flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 dossier-scroll-lock">
        <div className="text-center py-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#73634e] bg-[#1a1d26] px-3 py-1 rounded-full border border-[#2e2619]">
            ••• SHIFRLANGAN RADIOLINIYA •••
          </span>
        </div>

        {/* 🗄️ Archival Telegrams Header: Reveal in batches of 3 */}
        {archivedCount > 0 ? (
          <div className="relative flex flex-col items-center gap-1 my-1">
            {/* Dust puff particles blowing outwards */}
            {isDustBlowing && (
              <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                {dustParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full bg-[#caa04b] shadow-[0_0_8px_rgba(202,160,75,0.9)] animate-ping"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      transform: `translate(${p.tx}px, ${p.ty}px)`,
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenArchive}
              className="relative px-3.5 py-1.5 rounded-full bg-[#161922] hover:bg-[#202533] border border-[#caa04b]/50 text-[10px] font-mono text-[#caa04b] hover:text-[#ffd977] flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all group"
            >
              <Archive className="w-3.5 h-3.5 text-[#caa04b] group-hover:rotate-12 transition-transform" />
              <span>Arxiv: {archivedCount} ta eski telegramma (Ochish +3)</span>
              <ChevronUp className="w-3 h-3 text-[#caa04b]" />
            </button>
          </div>
        ) : totalMessages > 4 && visibleCount > 4 ? (
          <div className="flex justify-center my-0.5">
            <button
              type="button"
              onClick={() => {
                noirAudio.playPaperRustle();
                setVisibleCount(4);
              }}
              className="text-[9.5px] font-mono text-[#786c5b] hover:text-[#caa04b] flex items-center gap-1 cursor-pointer underline"
            >
              <span>Arxivni yopish (Faqat oxirgi 4 ta xabar)</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        ) : null}

        {/* Render visible slice of messages */}
        {displayedMessages.map((msg) => (
          <ClassifiedChatMessage
            key={msg.id}
            message={msg}
            fontMode={fontMode}
            onUnlockSuperSecret={onUnlockSuperSecretMessage}
            onNavigateToVerdict={onNext}
            activeRole={activeRole}
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

      {/* Bottom Message Input Box */}
      <div className="relative pt-2 border-t border-[#292218] z-10 space-y-2">
        {/* Classified Selector Bar: Normal | @secret | @super_secret | @final */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
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

            {/* Author Exclusive: @final trigger button */}
            {activeRole === 'author' && (
              <button
                type="button"
                onClick={() => {
                  setFinalDraftText(inputText.trim() || 'Ishni yakunlash va oxirgi hukm chiqarish vaqti keldi.');
                  setShowFinalConfirmModal(true);
                }}
                className="px-2 py-0.5 rounded cursor-pointer transition-all flex items-center gap-1 text-[#ffd977] bg-[#2d2212] hover:bg-[#3d2f19] border border-[#caa04b]/70 font-bold shadow-xs active:scale-95"
                title="5-qadam: Yakuniy Hukmni ochish buyrug'i"
              >
                <Scale className="w-2.5 h-2.5 text-[#caa04b]" />
                <span>@final</span>
              </button>
            )}
          </div>
        </div>

        {/* Super Secret PIN indicator if active */}
        {selectedMode === 'super_secret' && (
          <div className="flex items-center justify-between text-[10px] font-mono bg-red-950/40 border border-red-800/40 px-2 py-1 rounded text-red-200 gap-2">
            {!isSettingSuperSecretPin ? (
              <>
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-red-400" />
                  <span>PIN o&apos;rnatildi: <b>{superSecretPin}</b></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPinEditDraft(superSecretPin);
                    setIsSettingSuperSecretPin(true);
                  }}
                  className="underline text-red-300 hover:text-white cursor-pointer shrink-0"
                >
                  O&apos;zgartirish
                </button>
              </>
            ) : (
              <form
                className="flex items-center gap-1.5 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleaned = pinEditDraft.trim();
                  if (cleaned.length >= 4) {
                    setSuperSecretPin(cleaned);
                    setIsSettingSuperSecretPin(false);
                  }
                }}
              >
                <KeyRound className="w-3 h-3 text-red-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={pinEditDraft}
                  onChange={(e) => setPinEditDraft(e.target.value)}
                  placeholder="Yangi PIN (kamida 4 ta belgi)"
                  className="flex-1 min-w-0 bg-[#1b1010] border border-red-700/60 rounded px-1.5 py-0.5 text-red-100 placeholder-red-400/40 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={pinEditDraft.trim().length < 4}
                  className="text-emerald-300 hover:text-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingSuperSecretPin(false)}
                  className="text-red-300 hover:text-white cursor-pointer shrink-0"
                >
                  Bekor
                </button>
              </form>
            )}
          </div>
        )}

        {/* Staged Media Attachment Preview (Above Input) */}
        {stagedMedia && (
          <div className="p-1.5 px-2.5 rounded-lg bg-[#1f1b13] border border-[#caa04b]/70 flex items-center justify-between text-[10.5px] font-mono text-[#eeddbf] shadow-md animate-fadeIn">
            <div className="flex items-center gap-2 truncate">
              {stagedMedia.type === 'photo' ? (
                <ImageIcon className="w-3.5 h-3.5 text-[#caa04b] shrink-0" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              <span className="truncate">{stagedMedia.caption || (stagedMedia.type === 'photo' ? 'Fotosurat ilova qilindi' : 'Ovozli xabar')}</span>
            </div>
            <button
              type="button"
              onClick={() => setStagedMedia(null)}
              className="p-1 text-red-400 hover:text-red-200 cursor-pointer ml-2"
              title="Biriktirmani o'chirish"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Text Input Row with [Textarea Auto-expand] + [Paperclip Attachment] + [Send] */}
        <form onSubmit={handleSend} className="relative flex gap-2 items-end">
          {/* Auto-expanding Textarea without scrollbar */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedMode === 'secret'
                  ? 'Qora lenta ostidagi sirli xabar yozing...'
                  : selectedMode === 'super_secret'
                  ? 'PIN bilan shifrlanadigan maxfiy xabar...'
                  : 'Anonim xabar kiriting...'
              }
              rows={1}
              className={`w-full py-2 px-3 rounded-xl text-xs font-mono focus:outline-hidden resize-none overflow-hidden transition-all border ${
                selectedMode === 'super_secret'
                  ? 'bg-[#1b1010] border-red-700/60 text-red-100 placeholder-red-400/50'
                  : selectedMode === 'secret'
                  ? 'bg-[#1a1212] border-[#7d2f2f] text-rose-100 placeholder-rose-300/40'
                  : 'bg-[#181a22] border-[#383022] text-[#ecdab8] placeholder-[#7d705c] focus:border-[#caa04b]'
              }`}
            />
          </div>

          {/* 📎 Skripka (Paperclip) Button for Photos & Voice Notes */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                noirAudio.playPaperRustle();
                setIsAttachmentMenuOpen((prev) => !prev);
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-center ${
                isAttachmentMenuOpen || stagedMedia
                  ? 'bg-[#3b2d18] border-[#ffd977] text-[#ffd977] shadow-[0_0_12px_rgba(202,160,75,0.4)] scale-105'
                  : 'bg-[#1e202a] border-[#3e3424] text-[#a89b88] hover:text-[#caa04b] hover:border-[#caa04b]'
              }`}
              title="Skripka: Fotosurat yoki Ovozli xabar ilova qilish"
            >
              <Paperclip className="w-4 h-4 rotate-[-45deg]" />
            </button>

            {/* Skripka Attachment Popover Menu */}
            {isAttachmentMenuOpen && (
              <div className="absolute bottom-12 right-0 w-60 p-2.5 rounded-2xl bg-[#13151d] border-2 border-[#caa04b]/60 shadow-[0_10px_30px_rgba(0,0,0,0.95)] z-40 space-y-2 animate-fadeIn select-none">
                <div className="text-[10px] font-mono font-bold uppercase text-[#caa04b] border-b border-[#2d2417] pb-1.5 px-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 rotate-[-45deg]" />
                    <span>ILOVA BIRIKTIRISH</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAttachmentMenuOpen(false)}
                    className="text-[#8e816f] hover:text-white cursor-pointer px-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Option 1: Pick from Device Camera / Gallery */}
                <label className="w-full p-2 rounded-xl bg-[#1b1e2a] hover:bg-[#262b3c] border border-[#3e3425] text-[#ecdab8] text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4 text-[#caa04b]" />
                  <span>📷 Qurilmadan Rasm yuklash</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {fileUploadError && (
                  <p className="text-[10px] font-mono text-red-300 px-1 -mt-1">{fileUploadError}</p>
                )}

                {/* Option 1b: Arxiv Maxfiy Surati */}
                <button
                  type="button"
                  onClick={handlePickSamplePhoto}
                  className="w-full p-2 rounded-xl bg-[#1b1e2a] hover:bg-[#262b3c] border border-[#3e3425] text-[#ecdab8] text-xs font-mono flex items-center gap-2 cursor-pointer text-left transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>🎞️ Arxiv dalil fotosurati</span>
                </button>

                {/* Option 2: Voice Note / Golosovoy */}
                <button
                  type="button"
                  onClick={handleAttachVoiceNote}
                  className="w-full p-2 rounded-xl bg-[#1b1e2a] hover:bg-[#262b3c] border border-[#3e3425] text-[#ecdab8] text-xs font-mono flex items-center gap-2 cursor-pointer text-left transition-colors"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>🎙️ Ovozli xabar (Golosovoy)</span>
                </button>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !stagedMedia}
            className="p-2.5 rounded-xl bg-[#caa04b] text-[#1c1405] hover:bg-[#e0b559] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center shrink-0"
            title="Telegramma yuborish"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Advance to Step 5 (Verdict & Final Decision) */}
        {isFinalUnlocked ? (
          <button
            type="button"
            onClick={() => {
              noirAudio.playPaperRustle();
              onNext();
            }}
            className="w-full mt-1 py-2.5 px-4 bg-gradient-to-r from-[#caa04b] via-[#e5be68] to-[#caa04b] hover:brightness-110 text-[#1a1306] rounded-xl font-case font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(202,160,75,0.4)] active:scale-98 animate-pulse"
          >
            <Scale className="w-4 h-4" />
            <span>5. Yakuniy Hukm &amp; Natijaga o&apos;tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : activeRole === 'author' ? (
          <button
            type="button"
            onClick={() => {
              setFinalDraftText(inputText.trim() || 'Ishni yakunlash va oxirgi hukm chiqarish vaqti keldi.');
              setShowFinalConfirmModal(true);
            }}
            className="w-full mt-1 py-2 px-3 bg-[#1e202c] hover:bg-[#272b3c] border border-[#caa04b]/60 text-[#ffd977] rounded-xl font-case font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <Scale className="w-3.5 h-3.5 text-[#caa04b]" />
            <span>@final — Yakuniy Hukm bosqichini ochish</span>
          </button>
        ) : (
          <div className="w-full mt-1 py-2 px-3 bg-[#13151c] border border-[#2b2518] text-[#8e816d] rounded-xl font-mono text-[10px] flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500/60 animate-ping" />
            <span>Muallif tomonidan yakuniy xulosa (@final) kutilmoqda...</span>
          </div>
        )}
      </div>

      {/* ⚖️ Final Confirmation Modal (@final trigger) */}
      {showFinalConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-[#161821] border-2 border-[#caa04b] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.95)] space-y-3.5 text-[#ecdab8]">
            <div className="flex items-center gap-2 border-b border-[#3c3322] pb-2 text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
              <h3 className="font-case font-bold text-sm tracking-wider uppercase">
                YAKUNIY HUKMNI JO&apos;NATISH
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono leading-relaxed text-[#d6cdbe]">
              <p className="font-bold text-white text-[13px]">
                Aniq jo&apos;natmoqchimisiz?
              </p>
              <p className="text-[11px] text-[#a89a85] leading-normal">
                Ushbu buyruq (@final) ishni yakuniy xulosa bosqichiga (<span className="text-[#ffd977] font-bold">5-qadam: Yakuniy Hukm</span>) o&apos;tkazadi va tomonlar qaror qabul qilishi uchun yakuniy varaqani ochadi.
              </p>
              {finalDraftText && (
                <div className="p-2 bg-[#0e1015] rounded-lg border border-[#3c3425] text-[11px] italic text-[#ffd977]">
                  &quot;{finalDraftText}&quot;
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#31291b]">
              <button
                type="button"
                onClick={() => setShowFinalConfirmModal(false)}
                className="py-2 px-3.5 rounded-xl border border-[#4b3f2c] bg-[#12141a] text-xs font-mono text-[#a89a85] hover:text-white cursor-pointer transition-colors"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                onClick={handleConfirmSendFinal}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#caa04b] to-[#e4be68] text-[#1c1405] text-xs font-case font-extrabold hover:brightness-110 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ha, jo&apos;natilsin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retro Phone Intercom Call Modal */}
      <RetroPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        callerNumber={dossier.recipientPhone || '+998 90 ••• •• 05'}
        recipientRole={activeRole}
      />
    </div>
  );
};
