import React, { useState } from 'react';
import { Scissors, CheckCircle2, Ticket, Sparkles } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface PerforatedTicketProps {
  title?: string;
  subtitle?: string;
  ticketNumber?: string;
  onTear?: () => void;
}

export const PerforatedTicket: React.FC<PerforatedTicketProps> = ({
  title = 'MAXFIY TAKLIFNOMA: 2 KISHILIK UCHRASHUV',
  subtitle = 'Ushbu chipta istalgan paytda kofe yoki kechki ovqat uchun amal qiladi',
  ticketNumber = 'NOIR-TICKET #05-VIP',
  onTear,
}) => {
  const [isTorn, setIsTorn] = useState(false);
  const [tearProgress, setTearProgress] = useState(0);

  const handleTearTicket = () => {
    if (isTorn) return;
    noirAudio.playPaperRip();
    setIsTorn(true);
    if (onTear) onTear();
  };

  return (
    <div className="w-full my-3 select-none">
      <div className="text-[10px] font-mono text-[#caa04b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <Ticket className="w-3 h-3" />
        <span>Yirtib olinadigan maxsus chipta:</span>
      </div>

      <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl overflow-hidden border-2 border-[#8b7352] bg-[#f2e2c4] text-[#2c1d11] shadow-lg">
        {/* Left / Main Stub Body */}
        <div className={`flex-1 p-3.5 flex flex-col justify-between transition-all ${
          isTorn ? 'opacity-90' : ''
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-[#a88d6b] pb-1.5 mb-1.5">
              <span className="font-case font-bold text-xs tracking-wider text-[#822a2a]">
                {ticketNumber}
              </span>
              <span className="text-[9px] font-mono text-[#5a4834] uppercase font-bold">
                BIR MARTALIK // 1988
              </span>
            </div>

            <h4 className="font-serif-vintage text-sm font-bold text-[#231a0e] leading-snug">
              {title}
            </h4>

            <p className="text-[11px] font-serif-vintage italic text-[#4a3a27] mt-1">
              &quot;{subtitle}&quot;
            </p>
          </div>

          <div className="mt-3 pt-1 border-t border-[#a88d6b]/50 flex items-center justify-between text-[9px] font-mono text-[#69543e]">
            <span>Amal qilish muddati: Cheksiz</span>
            <span>№ 05-XULOSA</span>
          </div>
        </div>

        {/* Perforation Dashed Divider Line with Half-Circle Cutouts */}
        <div className="relative flex sm:flex-col items-center justify-between bg-[#dfcbb0] py-2 px-1 border-y sm:border-y-0 sm:border-x border-dashed border-[#856c4d]">
          {/* Top Notch */}
          <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#14151b] border border-[#3c3425]" />

          <div className="p-1 rounded-full bg-[#f2e2c4] border border-[#8b7352] text-[#822a2a] my-auto">
            <Scissors className="w-3.5 h-3.5 rotate-90 sm:rotate-0" />
          </div>

          {/* Bottom Notch */}
          <div className="hidden sm:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#14151b] border border-[#3c3425]" />
        </div>

        {/* Right / Tear-Off Counterfoil (Stub Coupon) */}
        <div className={`p-3 bg-[#e6d3b3] border-t sm:border-t-0 sm:border-l border-[#b59a76] flex flex-col justify-between items-center text-center sm:w-36 transition-all duration-500 ${
          isTorn
            ? 'bg-emerald-100 text-emerald-950 translate-x-2 sm:translate-y-2 shadow-inner border-emerald-600'
            : ''
        }`}>
          <div className="text-[9px] font-mono font-bold tracking-widest text-[#7a3232] uppercase">
            KUPON #05
          </div>

          {isTorn ? (
            <div className="my-2 space-y-1 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="text-[10px] font-case font-bold text-emerald-900 leading-tight">
                YIRTIB OLINDI!
              </div>
              <div className="text-[8.5px] font-mono text-emerald-800">
                Sizga saqlandi
              </div>
            </div>
          ) : (
            <div className="my-2 space-y-1">
              <div className="text-[10px] font-mono text-[#5b4a36]">
                Ushbu kuponni o&apos;zingizga oling
              </div>
              <button
                type="button"
                onClick={handleTearTicket}
                className="w-full py-1.5 px-2 bg-[#8c3232] hover:bg-[#a63d3d] text-white rounded font-case font-bold text-[10px] tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span>YIRTIB OLISH</span>
              </button>
            </div>
          )}

          <div className="text-[8px] font-mono text-[#78654e]">
            {isTorn ? 'Kod: VERIFIED' : 'Chiziqdan uzing'}
          </div>
        </div>
      </div>
    </div>
  );
};
