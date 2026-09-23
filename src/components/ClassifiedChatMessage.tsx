import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageStatusStamp, RubberStampBadge } from './RubberStampTool';
import { Lock, Unlock, Eye, EyeOff, ShieldAlert, KeyRound, Image as ImageIcon, Volume2, Scale, Award } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';
import { SecretDustWiper } from './SecretDustWiper';

interface ClassifiedChatMessageProps {
  message: ChatMessage;
  fontMode: 'typewriter' | 'handwritten_ink' | 'newspaper_ransom';
  onUnlockSuperSecret: (msgId: string, pin: string) => boolean;
  onNavigateToVerdict?: () => void;
  activeRole?: 'recipient' | 'author';
}

export const ClassifiedChatMessage: React.FC<ClassifiedChatMessageProps> = ({
  message,
  fontMode,
  onUnlockSuperSecret,
  onNavigateToVerdict,
  activeRole = 'recipient',
}) => {
  const isOutgoing = activeRole ? message.sender === activeRole : message.sender === 'recipient';
  const isAuthor = message.sender === 'author';
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Playback timer for voice notes
  useEffect(() => {
    let interval: any;
    if (isPlayingVoice) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const maxSec = message.voiceDurationSeconds || 7;
          if (prev >= maxSec) {
            setIsPlayingVoice(false);
            noirAudio.playKeyClick();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setPlaybackSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingVoice, message.voiceDurationSeconds]);

  const handleToggleVoicePlay = () => {
    if (isPlayingVoice) {
      noirAudio.playKeyClick();
      setIsPlayingVoice(false);
    } else {
      noirAudio.playCassetteMechanical();
      setIsPlayingVoice(true);
    }
  };

  // Handle revealing @secret message
  const handleRevealSecret = () => {
    noirAudio.playPaperRustle();
    setIsSecretRevealed((prev) => !prev);
  };

  // Handle unlocking @super_secret message with PIN
  const handleAttemptUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onUnlockSuperSecret(message.id, enteredPin);
    if (ok) {
      noirAudio.playSealOpen();
      setPinPromptOpen(false);
      setPinError('');
    } else {
      noirAudio.playStamp();
      setPinError('PIN noto\'g\'ri!');
    }
  };

  const fontClass = fontMode === 'handwritten_ink' ? 'font-handwritten-ink text-sm sm:text-base leading-snug' : 'font-dossier-code text-xs leading-relaxed';

  return (
    <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} max-w-full my-1 animate-message-slide-in`}>
      <div
        className={`max-w-[88%] p-3.5 rounded-lg shadow-md transition-all ${
          isOutgoing
            ? 'texture-aged-paper text-[#1e170e] border border-[#a69273] rounded-tr-xs'
            : 'bg-[#1b1f27] border border-[#3c3425] text-[#d6cdbe] rounded-tl-xs'
        }`}
      >
        {/* Special Case: @final message triggering Step 5 (Yakuniy Hukm) */}
        {message.isFinal || message.text.startsWith('@final') ? (
          <div className="space-y-2 select-none">
            <div className="flex items-center justify-between gap-2 border-b border-[#caa04b]/40 pb-1.5">
              <span className="font-case font-bold text-[9px] tracking-wider text-[#ffd977] border border-[#caa04b]/60 bg-[#2b2112]/90 px-2 py-0.5 rounded flex items-center gap-1">
                <Scale className="w-3 h-3 text-[#caa04b]" />
                <span>[ RASMIY XULOSA: @FINAL ]</span>
              </span>
              <Award className="w-3.5 h-3.5 text-[#ffd977] animate-pulse" />
            </div>

            <p className="text-xs leading-relaxed font-serif-vintage italic text-[#eeddbb]">
              &quot;{message.text.replace('@final', '').trim() || 'Muallif ishni yakuniy xulosa va hukm bosqichiga o\'tkazdi.'}&quot;
            </p>

            {onNavigateToVerdict && (
              <button
                type="button"
                onClick={() => {
                  noirAudio.playStamp();
                  onNavigateToVerdict();
                }}
                className="w-full mt-1.5 py-2 px-3 bg-gradient-to-r from-[#caa04b] via-[#e5be68] to-[#caa04b] text-[#1c1405] rounded-lg font-case font-extrabold text-[11px] flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>5. Yakuniy Hukmga o&apos;tish ➔</span>
              </button>
            )}
          </div>
        ) : message.isSuperSecret && !message.isUnlocked ? (
          <div className="space-y-2 select-none">
            <div className="flex items-center justify-between gap-2 border-b border-red-900/40 pb-1.5">
              <span className="font-case font-bold text-[9px] tracking-wider text-[#e63939] border border-[#bd2222]/50 bg-[#401212]/70 px-1.5 py-0.5 rounded-xs">
                [ СОВЕРШЕННО СЕКРЕТНО ]
              </span>
              <Lock className="w-3.5 h-3.5 text-[#e63939] animate-pulse" />
            </div>

            <p className="text-xs italic opacity-85">
              🔒 Maxfiy xabar. O&apos;qish uchun PIN-kod talab qilinadi.
            </p>

            {!pinPromptOpen ? (
              <button
                type="button"
                onClick={() => {
                  noirAudio.playKeyClick();
                  setPinPromptOpen(true);
                }}
                className="w-full py-1.5 px-2 bg-[#2d1212] hover:bg-[#3d1818] border border-red-900/60 rounded text-[11px] font-mono text-red-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <KeyRound className="w-3 h-3 text-red-400" />
                <span>PIN-kodni kiritib ochish</span>
              </button>
            ) : (
              <form onSubmit={handleAttemptUnlock} className="space-y-1.5 pt-1">
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  placeholder="PIN (masalan: 1234)"
                  value={enteredPin}
                  onChange={(e) => {
                    noirAudio.playKeyClick();
                    setEnteredPin(e.target.value);
                    setPinError('');
                  }}
                  className="w-full text-center bg-black/60 border border-red-800/80 rounded px-2 py-1 text-xs font-mono text-[#ffd977] outline-none"
                />

                {pinError && (
                  <p className="text-[10px] text-red-400 font-mono text-center">
                    {pinError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPinPromptOpen(false)}
                    className="text-[10px] font-mono text-[#998b76] hover:text-white px-2 py-1"
                  >
                    Bekor
                  </button>
                  <button
                    type="submit"
                    className="text-[10px] font-case font-bold px-3 py-1 bg-red-900/80 hover:bg-red-800 text-red-100 rounded border border-red-700 cursor-pointer"
                  >
                    Ochish
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : message.isSecret ? (
          /* Special Case B: @secret message with interactive coal/carbon dust wiper */
          <SecretDustWiper text={message.text} fontClass={fontClass} />
        ) : (
          /* Standard Chat Message (with fontMode applied) */
          <div>
            <p className={fontClass}>{message.text}</p>
          </div>
        )}

        {/* Media Attachment: Secret Polaroid Photo */}
        {message.mediaType === 'photo' && message.mediaUrl && (
          <div className="mt-2.5 p-2 bg-[#0e0f13] border border-[#4a3e2a] rounded-lg shadow-inner">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#caa04b] mb-1.5 uppercase">
              <ImageIcon className="w-3 h-3" />
              <span>ФОТО-ВЕЩДОК // УЛИКА</span>
            </div>
            <img
              src={message.mediaUrl}
              alt="Photo evidence"
              className="w-full max-h-48 object-cover rounded filter sepia-[0.35] contrast-[1.1] hover:filter-none transition-all cursor-pointer"
            />
            {message.mediaCaption && (
              <p className="mt-1 text-[10px] font-serif-vintage italic text-[#b8a994]">
                {message.mediaCaption}
              </p>
            )}
          </div>
        )}

        {/* Media Attachment: Secret Voice Note (Retro Rotating Cassette Tape) */}
        {message.mediaType === 'voice_note' && (
          <div
            onClick={handleToggleVoicePlay}
            className={`mt-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden group shadow-md ${
              isPlayingVoice
                ? 'bg-[#1c160f] border-[#caa04b] shadow-[0_0_15px_rgba(202,160,75,0.35)]'
                : 'bg-[#101217] border-[#3e3424] hover:border-[#caa04b]/70'
            }`}
            title={isPlayingVoice ? "Kassetani to'xtatish uchun bosing" : "Kassetani tinglash uchun bosing"}
          >
            {/* Top Tape Label Header */}
            <div className="flex items-center justify-between text-[9px] font-mono border-b border-[#382f21] pb-1 mb-2">
              <span className="flex items-center gap-1.5 font-bold text-[#e0cfb2]">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isPlayingVoice
                      ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse'
                      : 'bg-[#524128]'
                  }`}
                />
                <span className="uppercase font-case tracking-wider text-[#caa04b]">
                  {isPlayingVoice ? 'FONOGRAMMA YANGRAMOQDA' : 'OVOZLI FONOGRAMMA KASSETASI'}
                </span>
              </span>
              <span className="text-[#a89982] font-mono">
                {isPlayingVoice
                  ? `00:0${playbackSeconds} / 00:0${message.voiceDurationSeconds || 7}`
                  : `00:0${message.voiceDurationSeconds || 7}`}
              </span>
            </div>

            {/* Authentic Vintage Cassette Body */}
            <div className="relative bg-[#181a22] border-2 border-[#4b3c27] rounded-lg p-2 flex flex-col items-center shadow-inner">
              {/* Tape Brand Label Banner */}
              <div className="w-full bg-[#27231c] border-b border-[#4d3d28] py-0.5 px-2 flex items-center justify-between text-[8px] font-mono text-[#caa04b] mb-1.5">
                <span>BASF CrO2 60 // NOIR</span>
                <span className="text-[7.5px] text-[#8e816f]">SIDE A • STEREO</span>
              </div>

              {/* Central Acrylic Window with Two Rotating Spool Wheels */}
              <div className="relative w-full h-11 bg-[#0a0b0e] rounded-md border border-[#3e3220] flex items-center justify-around px-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Brown Magnetic Tape Ribbon bridging spools */}
                <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-3 bg-gradient-to-r from-[#241306] via-[#3d220c] to-[#241306] border-y border-[#522f12]/60 z-0" />

                {/* Left Spool Wheel (Aylanuvchi chap g'altak) */}
                <div
                  className={`relative z-10 w-7 h-7 rounded-full bg-[#ded2be] border-2 border-[#453724] shadow-md flex items-center justify-center transition-transform ${
                    isPlayingVoice ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '2.2s' }}
                >
                  {/* Spool Center Teeth */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1b1e27] border border-[#6b583c] flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#d6c7af]" />
                  </div>
                  {/* 3 Spoke notches */}
                  <div className="absolute w-full h-0.5 bg-[#453724]/40" />
                  <div className="absolute w-full h-0.5 bg-[#453724]/40 rotate-60" />
                  <div className="absolute w-full h-0.5 bg-[#453724]/40 -rotate-60" />
                </div>

                {/* Center Tape Counter / Window */}
                <div className="relative z-10 px-2 py-0.5 bg-[#171920] border border-[#3b301f] rounded text-[8px] font-mono text-[#ffd977] shadow-inner font-bold">
                  {isPlayingVoice ? '▶ RUN' : '❚❚ PAUSE'}
                </div>

                {/* Right Spool Wheel (Aylanuvchi o'ng g'altak) */}
                <div
                  className={`relative z-10 w-7 h-7 rounded-full bg-[#ded2be] border-2 border-[#453724] shadow-md flex items-center justify-center transition-transform ${
                    isPlayingVoice ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '2.2s' }}
                >
                  {/* Spool Center Teeth */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1b1e27] border border-[#6b583c] flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#d6c7af]" />
                  </div>
                  {/* 3 Spoke notches */}
                  <div className="absolute w-full h-0.5 bg-[#453724]/40" />
                  <div className="absolute w-full h-0.5 bg-[#453724]/40 rotate-60" />
                  <div className="absolute w-full h-0.5 bg-[#453724]/40 -rotate-60" />
                </div>
              </div>

              {/* Bottom Cassette Guide Head */}
              <div className="w-24 h-2 bg-[#2a241b] border-t border-[#443825] mt-1 rounded-t-xs flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#111317]" />
                <div className="w-5 h-0.5 bg-[#524128]" />
                <div className="w-1 h-1 rounded-full bg-[#111317]" />
              </div>
            </div>

            {/* Instruction below cassette */}
            <div className="mt-1.5 flex items-center justify-between text-[8.5px] font-mono text-[#8a7a66]">
              <span>
                {isPlayingVoice
                  ? 'Ovoz yangramoqda • To\'xtatish uchun kassetani bosing'
                  : 'Kassetani bosing — charxlar aylanib ovoz eshitiladi'}
              </span>
              <span className="text-[#caa04b]">[ DOLBY B ]</span>
            </div>
          </div>
        )}

        {/* Attached Custom Stamp (if manually stamped) */}
        {message.stamp && (
          <div className="mt-2 pt-1 border-t border-[#8f7b5e]/25">
            <RubberStampBadge stamp={message.stamp} size="xs" />
          </div>
        )}

        {/* Bottom Message Status Bar (Automatic Lifecycle Stamp & Time) */}
        <div className="mt-2 pt-1.5 border-t border-black/10 flex items-center justify-between gap-2 text-[10px]">
          {isOutgoing ? (
            /* Jo'natgan xabar: Vaqt chapda, Status shtamp vaqtning O'NG tomonida */
            <>
              <div className="font-mono text-[9.5px] opacity-75">
                <span>{message.timestamp}</span>
              </div>
              <MessageStatusStamp status={message.deliveryStatus} />
            </>
          ) : (
            /* Qabul qilgan xabar: Status shtamp CHAP tomonda, Vaqt o'ng tomonda */
            <>
              <MessageStatusStamp status={message.deliveryStatus} />
              <div className="font-mono text-[9.5px] opacity-75">
                <span>{message.timestamp}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <span className="text-[9px] text-[#5e5545] font-dossier-code mt-0.5 px-1">
        {isOutgoing ? 'Siz (Jo\'natilgan)' : message.sender === 'author' ? 'Автор письма (Анонимно)' : 'Получатель'}
      </span>
    </div>
  );
};
