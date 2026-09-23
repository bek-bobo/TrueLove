import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, Volume2, ShieldCheck, UserCheck } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { hapticFeedback } from '../utils/haptics';

interface RetroPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerNumber: string;
  recipientRole: 'author' | 'recipient';
}

export const RetroPhoneModal: React.FC<RetroPhoneModalProps> = ({
  isOpen,
  onClose,
  callerNumber,
  recipientRole,
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setSeconds(0);
      noirAudio.playPhoneDialTone();
      hapticFeedback.telephoneRing();

      // Automatically connect after 2.5s simulation of ring
      const connectTimeout = setTimeout(() => {
        noirAudio.playPhonePickup();
        setCallState('connected');
      }, 2500);

      return () => clearTimeout(connectTimeout);
    }
  }, [isOpen]);

  // Timer for connected call
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  if (!isOpen) return null;

  const handleEndCall = () => {
    noirAudio.playPhonePickup();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111317] border-2 border-[#3d3323] rounded-3xl p-6 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] animate-fadeIn">
        {/* Subtle background rotary dial aesthetic rings */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-4 border-dashed border-[#caa04b]/10 pointer-events-none" />

        {/* Top classified banner */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest text-[#caa04b] uppercase mb-4">
          <ShieldCheck className="w-3 h-3" />
          <span>ШИФРОВАННЫЙ КАНАЛ СВЯЗИ // 128-BIT NOIR</span>
        </div>

        {/* Phone Receiver Graphic */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#1b1e26] border-2 border-[#473a26] flex items-center justify-center relative shadow-inner mb-4">
          <PhoneCall
            className={`w-9 h-9 text-[#ffd977] ${
              callState === 'ringing' ? 'animate-bounce' : callState === 'connected' ? 'animate-pulse' : ''
            }`}
          />
          {callState === 'connected' && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
          )}
        </div>

        {/* Phone Number & Name */}
        <h3 className="font-case font-bold text-lg tracking-wider text-[#f4e8d3]">
          {callerNumber || '+998 •• ••• •• ••'}
        </h3>
        <p className="text-xs font-mono text-[#a39580] mt-1">
          {callState === 'ringing'
            ? 'Гудки... Соединение с абонентом'
            : callState === 'connected'
            ? 'Анонимный детективный голос на линии'
            : 'Вызов завершён'}
        </p>

        {/* Call Duration */}
        {callState === 'connected' && (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-xs font-mono text-emerald-300">
            {formatTime(seconds)} [ LIVE ENCRYPTED ]
          </div>
        )}

        {/* Secret Whisper Transcript / Audio representation */}
        {callState === 'connected' && (
          <div className="my-5 p-3.5 bg-[#171a22] rounded-xl border border-[#3b3223] text-left space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#caa04b]">
              <span>[ ШЁПОТ В ТРУБКЕ ]</span>
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <p className="font-serif-vintage italic text-xs text-[#ded1bc] leading-relaxed">
              &ldquo;Ты нашёл это письмо вовремя. Всё, что написано в досье — чистая правда. Доверься интуиции и ответь в чате...&rdquo;
            </p>
          </div>
        )}

        {/* Action Button: End Call */}
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(220,38,38,0.5)] active:scale-95 cursor-pointer transition-all"
            title="Завершить вызов"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
