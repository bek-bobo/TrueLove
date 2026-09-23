import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound, Check, X } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { BrassRivet } from './VintagePaperClips';

interface SmartPrivacyLockProps {
  isLocked: boolean;
  savedPin?: string;
  onSetPin: (pin: string) => void;
  onUnlock: (pin: string) => boolean;
  onRemovePin: () => void;
}

export const SmartPrivacyLockModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (pin: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN-kod kamida 4 ta belgidan iborat bo\'lishi kerak');
      return;
    }
    if (pin !== confirmPin) {
      setError('Kiritilgan PIN-kodlar bir-biriga mos kelmadi');
      return;
    }

    noirAudio.playSealOpen();
    onSave(pin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171920] border border-[#3e3423] w-full max-w-sm rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#877864] hover:text-[#e4dac7] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#caa04b]">
          <KeyRound className="w-4 h-4" />
          <span>DOSYENI PIN BILAN MUHRLASH</span>
        </div>

        <h3 className="text-base font-serif-vintage font-bold text-[#f2e7d5] mt-1">
          Shaxsiy Maxfiylik Kaliti
        </h3>

        <p className="text-xs text-[#a19482] mt-1.5 leading-relaxed font-dossier-code">
          Ushbu dosye va chatni faqat o&apos;zingiz qayta o&apos;qishingiz uchun 4 xonali PIN-kod o&apos;rnating. Telefoni qo&apos;lingizga tushgan boshqa shaxslar xatni ocholmaydi.
        </p>

        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-[#8c7d69] mb-1">
              Yangi PIN-kod (masalan: 1998):
            </label>
            <input
              type="password"
              maxLength={8}
              value={pin}
              onChange={(e) => {
                noirAudio.playKeyClick();
                setPin(e.target.value);
                setError('');
              }}
              placeholder="••••"
              className="w-full text-center tracking-[0.4em] bg-[#0d0e12] border border-[#382f20] rounded-lg py-2 text-sm font-mono text-[#dfbd74] focus:border-[#caa04b] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#8c7d69] mb-1">
              PIN-kodni tasdiqlang:
            </label>
            <input
              type="password"
              maxLength={8}
              value={confirmPin}
              onChange={(e) => {
                noirAudio.playKeyClick();
                setConfirmPin(e.target.value);
                setError('');
              }}
              placeholder="••••"
              className="w-full text-center tracking-[0.4em] bg-[#0d0e12] border border-[#382f20] rounded-lg py-2 text-sm font-mono text-[#dfbd74] focus:border-[#caa04b] outline-none"
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-400 font-mono text-center">
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-mono text-[#918370] hover:text-[#e4dac7] cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 brass-glow rounded-lg text-xs font-case font-bold tracking-wider text-[#1b1407] cursor-pointer"
            >
              Muhrlab qulflash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Fullscreen Screen Lock when dossier has active PIN
export const DossierLockedScreen: React.FC<{
  caseNumber: string;
  onUnlock: (pin: string) => boolean;
}> = ({ caseNumber, onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(pinInput);
    if (success) {
      noirAudio.playSealOpen();
      setErrorMsg('');
    } else {
      noirAudio.playStamp();
      setErrorMsg('PIN-kod noto\'g\'ri kiritildi');
      setPinInput('');
    }
  };

  return (
    <div className="w-full sm:max-w-[420px] mx-auto min-h-[calc(100dvh-5.5rem)] sm:min-h-[640px] texture-leather rounded-none sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between border-0 sm:border-2 border-[#382d1c] shadow-none sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#30281b] text-[#8e816d]">
        <span className="font-case text-xs tracking-widest text-[#caa04b] font-bold">
          {caseNumber}
        </span>
        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
          Muhrlangan
        </span>
      </div>

      <div className="my-auto py-6 space-y-4">
        {/* Brass Safe Dial / Lock Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#ffd977] via-[#a67d32] to-[#45300f] p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#16181f] border border-[#2f271a] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#caa04b] animate-pulse" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-serif-vintage font-bold text-[#f2e7d5]">
            Ushbu dosye shaxsiy PIN bilan himoyalangan
          </h2>
          <p className="text-xs text-[#a19482] mt-1 font-dossier-code max-w-[280px] mx-auto leading-relaxed">
            Xat egasi tomonidan o&apos;rnatilgan 4 xonali kodni kiriting
          </p>
        </div>

        <form onSubmit={handleAttempt} className="max-w-[240px] mx-auto space-y-3 pt-2">
          <input
            type="password"
            maxLength={8}
            autoFocus
            value={pinInput}
            onChange={(e) => {
              noirAudio.playKeyClick();
              setPinInput(e.target.value);
              setErrorMsg('');
            }}
            placeholder="PIN kiriting"
            className="w-full text-center tracking-[0.4em] bg-[#0c0d12] border border-[#3e3423] rounded-lg py-2.5 text-sm font-mono text-[#dfbd74] focus:border-[#caa04b] outline-none"
          />

          {errorMsg && (
            <p className="text-[11px] text-red-400 font-mono">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 brass-glow rounded-lg text-xs font-case font-bold tracking-wider text-[#1a1306] cursor-pointer active:scale-95 transition-transform"
          >
            Dosyeni ochish
          </button>
        </form>
      </div>

      <div className="text-[10px] text-[#6d6251] font-mono border-t border-[#2a2318] pt-2">
        Anonimus Letter Maxfiylik Shifrlash Tizimi
      </div>
    </div>
  );
};
