import React, { useState } from 'react';
import { DossierData } from '../types';
import { Send, Smartphone, Copy, Check, ExternalLink, ShieldAlert, Zap, MessageSquare } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface SmsSimulatorViewProps {
  dossier: DossierData;
  onOpenInDossierView: () => void;
}

export const SmsSimulatorView: React.FC<SmsSimulatorViewProps> = ({
  dossier,
  onOpenInDossierView,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(dossier.recipientPhone);
  const [smsText, setSmsText] = useState(
    `Sizga maxfiy dosye keldi [${dossier.caseNumber}]. Bir martalik xavfsiz havola: https://anonimus-letter.uz/d/${dossier.token}`
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://anonimus-letter.uz/d/${dossier.token}`);
    setIsCopied(true);
    noirAudio.playKeyClick();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendSimulatedSms = () => {
    noirAudio.playKeyClick();
    setIsSent(true);
    setShowNotification(false);

    // Simulate SMS network delivery latency
    setTimeout(() => {
      setShowNotification(true);
      noirAudio.playSealOpen();
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#191b22] border border-[#30281b] p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-dossier-code text-[#caa04b]">
              <Zap className="w-3.5 h-3.5" />
              <span>ESKIZ.UZ SMS SHLYUZI SIMULYATORI</span>
            </div>
            <h2 className="text-xl font-bold font-serif-vintage text-[#f0e4cf] mt-1">
              Bir martalik maxfiy havola yuborish
            </h2>
            <p className="text-xs text-[#a39682] mt-1">
              Eskiz orqali yuborilgan SMS qabul qiluvchi telefonida xuddi shunday ko&apos;rinadi va bosilganda detektiv interfeysni ochadi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-[#252833] hover:bg-[#323645] border border-[#3e392d] text-xs font-mono rounded-lg flex items-center gap-2 text-[#dcd1be] transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#caa04b]" />}
              <span>{isCopied ? 'Nusxalandi!' : 'Havolani nusxalash'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column interactive demo: Dispatcher on Left, Smartphone on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispatcher Settings */}
        <div className="lg:col-span-7 bg-[#16181f] border border-[#2d281e] p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-case font-bold tracking-wider text-[#d6b77c] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#caa04b]" />
              <span>SMS Yuborish Formasi (Eskiz.uz API)</span>
            </h3>

            {/* Recipient Phone */}
            <div>
              <label className="block text-xs font-mono text-[#a69985] mb-1.5">
                Qabul qiluvchi telefon raqami (O&apos;zbekiston):
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full bg-[#101217] border border-[#362f22] rounded-lg px-3.5 py-2.5 text-xs font-mono text-[#e5d9c5] focus:border-[#caa04b] outline-none"
              />
            </div>

            {/* SMS Message Text */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#a69985] mb-1.5">
                <span>SMS matni va shifrlangan URL:</span>
                <span className="text-[#caa04b]">{smsText.length} belgi</span>
              </div>
              <textarea
                rows={3}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full bg-[#101217] border border-[#362f22] rounded-lg p-3 text-xs font-mono text-[#e5d9c5] focus:border-[#caa04b] outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Eskiz API JSON payload preview */}
            <div className="bg-[#0e0f14] p-3 rounded-lg border border-[#222530]">
              <div className="text-[11px] font-mono text-[#877a68] mb-1">
                Eskiz.uz POST so&apos;rovi (Java HttpClient / Retrofit orqali):
              </div>
              <pre className="text-[11px] font-mono text-[#caa04b] overflow-x-auto p-1">
{`POST https://notify.eskiz.uz/api/message/sms/send
Authorization: Bearer <TOKEN>
{
  "mobile_phone": "${phoneNumber.replace(/\D/g, '')}",
  "message": "${smsText}",
  "from": "4546"
}`}
              </pre>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#29241b]">
            <button
              onClick={handleSendSimulatedSms}
              className="w-full py-3 brass-glow rounded-lg font-case font-bold text-xs tracking-widest text-[#1d1607] flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>Eskiz orqali SMS jo&apos;natish (Simulyatsiya)</span>
            </button>
          </div>
        </div>

        {/* Right: Phone Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-[300px] h-[580px] bg-[#0c0d12] border-4 border-[#2d2f38] rounded-[38px] p-3 shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden">
            {/* Dynamic Island / Speaker */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#161822]" />
            </div>

            {/* Simulated Lock Screen / SMS App */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Status bar */}
              <div className="flex items-center justify-between px-3 text-[10px] text-zinc-400 font-mono">
                <span>09:41</span>
                <span>Ucell 5G 100%</span>
              </div>

              {/* Notification Banner when SMS sent */}
              <div className="my-auto space-y-3">
                {showNotification ? (
                  <div
                    onClick={onOpenInDossierView}
                    className="bg-[#1f222d]/95 backdrop-blur-md border border-[#484232] p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-[#272b38] transition-all transform animate-bounce duration-500"
                    title="Dosyeni ochish uchun bosing"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#caa04b]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>SMS XABAR (Eskiz)</span>
                      </div>
                      <span className="text-[9px] text-zinc-400">Hozirgina</span>
                    </div>

                    <p className="text-[11px] text-zinc-200 leading-snug">
                      {smsText}
                    </p>

                    <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-[#dfbd74] font-semibold">
                      <span>Xatni ochish</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-zinc-500 text-xs font-mono">
                    {isSent ? (
                      <div className="space-y-2">
                        <div className="w-5 h-5 border-2 border-[#caa04b] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p>SMS yetkazilmoqda...</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Smartphone className="w-8 h-8 mx-auto opacity-40 mb-2" />
                        <p>Chap tarafdagi tugmani bosib SMS yuboring</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-zinc-600 rounded-full mx-auto" />
            </div>
          </div>

          <div className="mt-3 text-center">
            <button
              onClick={onOpenInDossierView}
              className="text-xs text-[#caa04b] hover:text-[#ffd977] underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ushbu xatni qabul qiluvchi ekranida ko&apos;rish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
