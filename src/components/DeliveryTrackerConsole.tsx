import React from 'react';
import { DossierData, DossierStep } from '../types';
import { Eye, Clock, CheckCircle2, MapPin, Smartphone, ShieldCheck, Flame, Radio } from 'lucide-react';

interface DeliveryTrackerConsoleProps {
  dossier: DossierData;
  activeRole: 'author' | 'recipient';
  currentStep: DossierStep;
}

export const DeliveryTrackerConsole: React.FC<DeliveryTrackerConsoleProps> = ({
  dossier,
  activeRole,
  currentStep,
}) => {
  // Only show this tactical HUD if activeRole is 'author'
  if (activeRole !== 'author') return null;

  const stepLabels: Record<string, string> = {
    cover: '1-Sahifa (Muqova ochilishi kutilmoqda)',
    timeline: '2-Sahifa (Xronologiya & lupa tekshirilmoqda)',
    letter: '3-Sahifa (Asl maktub & siyoh o\'qilmoqda)',
    chat: '4-Sahifa (Shifrlangan telegraf faol)',
    verdict: '5-Sahifa (Yakuniy hukm ko\'rilmoqda)',
    letter_chat: '3-Sahifa (Maktub va chat)',
  };

  return (
    <div className="w-full bg-[#111319] border-2 border-[#b58d44]/50 rounded-2xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.85)] text-[#d4c8b6] mb-4 relative overflow-hidden animate-fadeIn">
      {/* Background radar grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffd977_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d251a] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-case font-extrabold text-xs tracking-widest text-[#ffd977] uppercase">
            KURYER KUZATUVI // RADAR HUD (Faqat Muallif uchun)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-[#8e816f]">Qabul qiluvchi:</span>
          <span className="text-emerald-400 font-bold">{dossier.recipientPhone}</span>
        </div>
      </div>

      {/* Real-time Tracking Steps Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        {/* Metric 1: Live Status */}
        <div className="bg-[#0b0c10] border border-[#272015] rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[10px] text-[#7d705c] uppercase flex items-center justify-between">
            <span>Hozirgi Holat:</span>
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-emerald-300 font-bold mt-1 text-xs">
            {stepLabels[currentStep]}
          </div>
          <div className="text-[9.5px] text-[#7d705c] mt-1">
            Ko&apos;rishlar soni: <strong className="text-white">{dossier.viewsCount} marta</strong>
          </div>
        </div>

        {/* Metric 2: Security & Lock */}
        <div className="bg-[#0b0c10] border border-[#272015] rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[10px] text-[#7d705c] uppercase flex items-center justify-between">
            <span>Xavfsizlik Muhrlari:</span>
            <ShieldCheck className="w-3 h-3 text-[#caa04b]" />
          </div>
          <div className="text-xs text-[#d6b77c] font-bold mt-1">
            {dossier.pinCode ? `PIN: ${dossier.pinCode}` : 'PIN o\'rnatilmagan'}
          </div>
          <div className="text-[9.5px] text-[#7d705c] mt-1">
            Shtamplar: <strong className="text-[#ffd977]">{dossier.stamps?.length || 0} ta urilgan</strong>
          </div>
        </div>

        {/* Metric 3: SMS Dispatch & Token */}
        <div className="bg-[#0b0c10] border border-[#272015] rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[10px] text-[#7d705c] uppercase flex items-center justify-between">
            <span>Eskiz SMS Marshruti:</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-xs text-[#a99c89] font-mono mt-1 truncate">
            Havola: <span className="text-[#caa04b]">/d/{dossier.token}</span>
          </div>
          <div className="text-[9.5px] text-emerald-400 font-bold mt-1">
            Yetkazildi (Delivered)
          </div>
        </div>
      </div>
    </div>
  );
};
