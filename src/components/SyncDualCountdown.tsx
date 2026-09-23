import React, { useState, useEffect } from 'react';
import { Clock, Hourglass, Calendar, CheckCircle2, Sparkles, Bell } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface SyncDualCountdownProps {
  syncOpenTime?: string; // e.g. "21:00" or "2026-09-23T21:00:00"
  onTimeReached?: () => void;
}

export const SyncDualCountdown: React.FC<SyncDualCountdownProps> = ({
  syncOpenTime = '21:00',
  onTimeReached,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isReady: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isReady: false });

  // Parse target date/time
  const getTargetDate = (): Date => {
    const now = new Date();
    // Check if it's "HH:MM"
    if (/^\d{1,2}:\d{2}$/.test(syncOpenTime.trim())) {
      const [hours, minutes] = syncOpenTime.trim().split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      // If time already passed today, assume it's for today or already reachable
      return target;
    }

    // Try parsing as ISO or standard date
    const parsed = new Date(syncOpenTime);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    // Default: today at 21:00
    const fallback = new Date();
    fallback.setHours(21, 0, 0, 0);
    return fallback;
  };

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = getTargetDate();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft((prev) => (prev.isReady ? prev : { hours: 0, minutes: 0, seconds: 0, isReady: true }));
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setTimeLeft({ hours, minutes, seconds, isReady: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [syncOpenTime]);

  // Safely notify when time is reached
  useEffect(() => {
    if (timeLeft.isReady && onTimeReached) {
      onTimeReached();
    }
  }, [timeLeft.isReady, onTimeReached]);

  const padZero = (n: number) => String(n).padStart(2, '0');

  // Format the human-readable display of "Qachon ochiladi"
  const formattedScheduledTime = () => {
    if (/^\d{1,2}:\d{2}$/.test(syncOpenTime.trim())) {
      return `Bugun, soat ${syncOpenTime.trim()} da`;
    }
    const target = getTargetDate();
    return `Soat ${padZero(target.getHours())}:${padZero(target.getMinutes())} da`;
  };

  return (
    <div className="w-full my-2.5 space-y-2">
      {/* Dual Information Cards: 1. Qachon ochilishi & 2. Qancha vaqt qolgani */}
      <div className="grid grid-cols-2 gap-2 text-left">
        {/* Box 1: Qachon Ochilishi (Exact Scheduled Moment) */}
        <div className="bg-[#181a24] border border-[#a47b31]/60 rounded-xl p-2.5 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-[#b89552] font-bold">
            <Calendar className="w-3 h-3 text-[#ffd977]" />
            <span>1. Ochilish Vaqti</span>
          </div>

          <div className="mt-1.5 font-case font-bold text-xs sm:text-sm text-[#fff0d0] flex items-baseline gap-1">
            <span>{formattedScheduledTime()}</span>
          </div>

          <div className="text-[8.5px] font-mono text-[#8c7b64] mt-0.5">
            Sinxronlashtirilgan payt
          </div>
        </div>

        {/* Box 2: Qancha Qolgani (Live Ticking Countdown) */}
        <div className={`border rounded-xl p-2.5 shadow-md flex flex-col justify-between relative overflow-hidden transition-colors ${
          timeLeft.isReady
            ? 'bg-[#15291b] border-emerald-500/80 text-emerald-100'
            : 'bg-[#1c1813] border-[#caa04b] text-[#ffd977]'
        }`}>
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider font-bold">
            <div className="flex items-center gap-1.5 text-[#ffd977]">
              <Hourglass className={`w-3 h-3 ${timeLeft.isReady ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} style={{ animationDuration: '6s' }} />
              <span>2. Qolgan Vaqt</span>
            </div>
            {!timeLeft.isReady && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>

          {/* Digital Timer Digits */}
          <div className="mt-1 font-mono font-bold text-xs sm:text-sm tracking-widest flex items-center gap-1">
            {timeLeft.isReady ? (
              <span className="text-emerald-300 font-case text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vaqt yetdi!
              </span>
            ) : (
              <div className="flex items-center gap-0.5 text-[#ffe8a8]">
                <span className="bg-[#0b0c10] px-1 py-0.5 rounded border border-[#caa04b]/40">
                  {padZero(timeLeft.hours)}
                </span>
                <span className="text-amber-500/80">:</span>
                <span className="bg-[#0b0c10] px-1 py-0.5 rounded border border-[#caa04b]/40">
                  {padZero(timeLeft.minutes)}
                </span>
                <span className="text-amber-500/80">:</span>
                <span className="bg-[#0b0c10] px-1 py-0.5 rounded border border-[#caa04b]/40 text-orange-400 animate-pulse">
                  {padZero(timeLeft.seconds)}
                </span>
              </div>
            )}
          </div>

          <div className="text-[8.5px] font-mono text-[#a39077] mt-0.5">
            {timeLeft.isReady ? 'Muhrni ochish mumkin' : 'Jonli soniyalar hisobi'}
          </div>
        </div>
      </div>

      {/* Synchronized Status Banner */}
      <div className={`px-2.5 py-1.5 rounded-lg border text-center text-[10px] font-mono flex items-center justify-center gap-1.5 ${
        timeLeft.isReady
          ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-300 animate-pulse'
          : 'bg-[#151720] border-[#362e21] text-[#caa04b]'
      }`}>
        {timeLeft.isReady ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Maxfiy vaqt keldi: Endi mum muhrni sindirishingiz mumkin!</span>
          </>
        ) : (
          <>
            <Bell className="w-3 h-3 text-[#caa04b]" />
            <span>Ikkala tomon ham xatni ayni shu daqiqada birgalikda ochadi.</span>
          </>
        )}
      </div>
    </div>
  );
};
