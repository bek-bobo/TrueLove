import React, { useState } from 'react';
import { DossierData } from '../types';
import {
  FolderPlus,
  Check,
  PenTool,
  Type,
  Newspaper,
  Shield,
  Flame,
  Radio,
  Award,
  Clock,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';
import { CustomWaxSeal, WaxSealType } from './CustomWaxSeal';

interface DossierCreatorViewProps {
  onSaveDossier: (newDossier: DossierData) => void;
  onCancel: () => void;
}

export const DossierCreatorView: React.FC<DossierCreatorViewProps> = ({
  onSaveDossier,
  onCancel,
}) => {
  const [caseNumber, setCaseNumber] = useState('ДЕЛО № 07');
  const [title, setTitle] = useState('Одно дело осталось незавершённым');
  const [invitationText, setInvitationText] = useState(
    'Это приглашение — не случайность. Если ты здесь, значит, пора вернуться к истории.'
  );
  const [recipientPhone, setRecipientPhone] = useState('+998 90 123 45 67');
  const [letterHeadline, setLetterHeadline] = useState('ФИНАЛ — ЗА НАМИ');
  const [letterBody1, setLetterBody1] = useState('Спасибо, что открываешь это письмо.');
  const [letterBody2, setLetterBody2] = useState('Мне было важно написать то, о чём мы молчали.');
  const [unfinished1, setUnfinished1] = useState('разговор, который мы отложили');
  const [unfinished2, setUnfinished2] = useState('главный невысказанный вопрос');
  const [unfinished3, setUnfinished3] = useState('история без точки');

  // Maktub shrifti: standart yaratishda tanlash (Handwritten Ink vs Typewriter vs Newspaper Cutouts)
  const [fontMode, setFontMode] = useState<'handwritten_ink' | 'typewriter' | 'newspaper_ransom'>('handwritten_ink');
  
  // VIP Qizil Muhr tanlash
  const [waxSealType, setWaxSealType] = useState<WaxSealType>('classic_crest');
  const [waxSealColor, setWaxSealColor] = useState<'crimson' | 'burgundy' | 'gold_bronze' | 'midnight_blue'>('crimson');
  const [waxSealInitials, setWaxSealInitials] = useState('№07');

  // Ovozli Detektiv Kassetasi
  const [hasAudioCassette, setHasAudioCassette] = useState(true);
  const [cassetteTitle, setCassetteTitle] = useState('FONOGRAMMA #07 // OVOZLI DALIL');

  // Gugurt alangasi (Invisible Ink)
  const [secretMatchNote, setSecretMatchNote] = useState('«Seni hech qachon unutmaganman. Bu xat tasodif emas edi.»');

  // Bir vaqtda ochish (Synchronized Opening)
  const [syncOpenTime, setSyncOpenTime] = useState('23:00');
  const [hasSyncOpen, setHasSyncOpen] = useState(false);

  // Ixtiyoriy o'z-o'zini yo'q qilish (Burn after read)
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [maxViews, setMaxViews] = useState(5);
  // Skrinshotdan himoya
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const normalizedPhone = recipientPhone.trim().replace(/\s+/g, '');
  const isPhoneValid = /^\+?[0-9\s]{9,15}$/.test(normalizedPhone);
  const hasRequiredText = Boolean(
    title.trim() && invitationText.trim() && letterBody1.trim()
  );
  const canContinueFromText = isPhoneValid && hasRequiredText;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canContinueFromText) {
      setCurrentStep(1);
      return;
    }

    noirAudio.playSealOpen();

    const randomToken = 'dossier-' + Math.random().toString(36).substring(2, 8);
    const authorKey = 'auth-' + Math.random().toString(36).substring(2, 10);

    const newDossier: DossierData = {
      id: randomToken,
      token: randomToken,
      authorKey: authorKey,
      caseNumber: caseNumber.trim() || 'ДЕЛО № 01',
      title: title.trim(),
      invitationText: invitationText.trim(),
      category: 'ЛИЧНОЕ',
      access: 'ТОЛЬКО ДЛЯ ТЕБЯ',
      secrecyTab: 'ХРАНИТЬ В СЕКРЕТЕ',
      recipientPhone: recipientPhone.trim(),
      fontMode: fontMode,
      watermarkEnabled: watermarkEnabled,
      burnAfterRead: burnAfterRead,
      waxSealType: waxSealType,
      waxSealColor: waxSealColor,
      waxSealInitials: waxSealInitials.trim() || '№01',
      hasAudioCassette: hasAudioCassette,
      cassetteTitle: cassetteTitle.trim() || 'FONOGRAMMA // OVOZLI DALIL',
      secretMatchNote: secretMatchNote.trim(),
      syncOpenTime: hasSyncOpen ? syncOpenTime.trim() : undefined,
      timeline: [
        {
          id: 'step-1',
          stage: 'past',
          title: 'Тогда',
          description: 'Когда всё только начиналось и казалось простым.',
          polaroidCaption: 'первые шаги',
          polaroidTheme: 'rain_street',
        },
        {
          id: 'step-2',
          stage: 'pause',
          title: 'Пауза',
          description: 'Время, когда молчание затянулось.',
          redactedNotes: ['Тайные мысли', 'Невысказанные слова'],
          isRedactedRevealed: false,
        },
        {
          id: 'step-3',
          stage: 'present',
          title: 'Сегодня',
          description: 'Момент, когда можно всё прояснить.',
          polaroidCaption: 'дело ждёт продолжения',
          polaroidTheme: 'secret_door',
        },
      ],
      unfinishedList: [unfinished1, unfinished2, unfinished3].filter(Boolean),
      letterHeadline: letterHeadline.trim() || 'ФИНАЛ — ЗА НАМИ',
      letterBody: [letterBody1, letterBody2].filter(Boolean),
      letterClosing: 'Если захочешь.',
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      maxViews: maxViews,
      status: 'active',
      messages: [],
      stamps: [],
    };

    onSaveDossier(newDossier);
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#171920] border border-[#30281b] p-6 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#2d251a]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#caa04b]">
            <FolderPlus className="w-4 h-4" />
            <span>YANGI MAXFIY DOSYE YARATISH</span>
          </div>
          <h2 className="text-xl font-bold font-serif-vintage text-[#f2e6d2] mt-1">
            Anonim Maktub &amp; Dosye Konstruktori
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#101217] border border-[#2d251a] p-1.5">
          {[
            { step: 1 as const, label: '1. Matn' },
            { step: 2 as const, label: '2. Stil/Dizayn' },
            { step: 3 as const, label: '3. Xavfsizlik va jo\'natish' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step === 1 || canContinueFromText) {
                  noirAudio.playPaperRustle();
                  setCurrentStep(item.step);
                }
              }}
              disabled={item.step > 1 && !canContinueFromText}
              className={`rounded-lg px-2 py-2 text-[10px] sm:text-xs font-mono transition-colors ${
                currentStep === item.step
                  ? 'bg-[#2a2318] border border-[#caa04b] text-[#ffd977]'
                  : 'border border-transparent text-[#8e816f] hover:text-[#d8cdb8] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
        {/* Style Selection: Maktub Shrifti (Standart tanlov) */}
        <div className="bg-[#12141a] p-3.5 rounded-xl border border-[#332b1e] space-y-2">
          <label className="block text-xs font-mono text-[#e8dac5] font-bold">
            1. Maktub uslubi va shrifitini tanlang:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                noirAudio.playPaperRustle();
                setFontMode('handwritten_ink');
              }}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                fontMode === 'handwritten_ink'
                  ? 'bg-[#261f14] border-[#caa04b] text-[#ffd977] shadow-[0_0_12px_rgba(202,160,75,0.2)]'
                  : 'bg-[#181a22] border-[#2b251a] text-[#8e816f] hover:text-[#d8cdb8]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <PenTool className="w-4 h-4 text-[#caa04b]" />
                <span>Siyohli Qo&apos;lyozma</span>
              </div>
              <p className="font-['Caveat',cursive] text-sm text-[#e4cba0] mt-1.5 leading-snug">
                &quot;Xuddi qalamda yozilgandek shaxsiy va iliq maktub...&quot;
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                noirAudio.playKeyClick();
                setFontMode('typewriter');
              }}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                fontMode === 'typewriter'
                  ? 'bg-[#261f14] border-[#caa04b] text-[#ffd977] shadow-[0_0_12px_rgba(202,160,75,0.2)]'
                  : 'bg-[#181a22] border-[#2b251a] text-[#8e816f] hover:text-[#d8cdb8]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <Type className="w-4 h-4 text-[#caa04b]" />
                <span>Yozuv Mashinkasi</span>
              </div>
              <p className="font-mono text-xs text-[#a89b88] mt-1.5 leading-snug">
                &quot;Detektiv arxiv dosyesi bosma shriftdagi maktub...&quot;
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                noirAudio.playPaperRustle();
                setFontMode('newspaper_ransom');
              }}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                fontMode === 'newspaper_ransom'
                  ? 'bg-[#3b1717] border-red-600 text-red-200 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                  : 'bg-[#181a22] border-[#2b251a] text-[#8e816f] hover:text-[#d8cdb8]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <Newspaper className="w-4 h-4 text-red-400" />
                <span>Gazeta Qirqimlari</span>
              </div>
              <p className="text-[11px] text-[#e0b0b0] mt-1.5 leading-snug">
                Eski gazetalardan alohida kesib yopishtirilgan xat.
              </p>
            </button>
          </div>
        </div>

        {/* VIP Qizil Muhr (Custom Wax Seal) Tanlovi */}
        <div className="bg-[#12141a] p-3.5 rounded-xl border border-[#332b1e] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-[#e8dac5] font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-red-400" />
              <span>2. VIP Mumli Muhr (Custom Wax Seal):</span>
            </label>
            <span className="text-[10px] font-mono text-[#caa04b] uppercase font-bold">Premium Detal</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Live Preview of Wax Seal */}
            <div className="p-3 bg-[#0d0f14] rounded-xl border border-[#2b2418] flex items-center justify-center">
              <CustomWaxSeal
                type={waxSealType}
                color={waxSealColor}
                initials={waxSealInitials}
                size={54}
              />
            </div>

            {/* Seal Controls */}
            <div className="flex-1 space-y-2 min-w-[200px]">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="block text-[10px] text-[#8e816f] mb-1">Muhr shakli:</span>
                  <select
                    value={waxSealType}
                    onChange={(e) => setWaxSealType(e.target.value as WaxSealType)}
                    className="w-full bg-[#181a22] border border-[#362f22] rounded px-2 py-1 text-[#e5d8c3] outline-none"
                  >
                    <option value="classic_crest">Geraldo Qalqon (Klassik)</option>
                    <option value="heart_lock">Qulfli Yurak (Kasseta)</option>
                    <option value="classified_star">Maxfiy 8-Qirrali Yulduz</option>
                    <option value="custom_initials">Shaxsiy Harflar (Initsial)</option>
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] text-[#8e816f] mb-1">Mum rangi:</span>
                  <select
                    value={waxSealColor}
                    onChange={(e) => setWaxSealColor(e.target.value as any)}
                    className="w-full bg-[#181a22] border border-[#362f22] rounded px-2 py-1 text-[#e5d8c3] outline-none"
                  >
                    <option value="crimson">Alvon Qizil (Crimson)</option>
                    <option value="burgundy">Burgundiya To&apos;q Qizil</option>
                    <option value="gold_bronze">Oltin Bronza</option>
                    <option value="midnight_blue">Tungi Ko&apos;k</option>
                  </select>
                </div>
              </div>

              {waxSealType === 'custom_initials' && (
                <div>
                  <span className="block text-[10px] text-[#8e816f] mb-0.5">Muhrdagi harflar (2-3 harf):</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={waxSealInitials}
                    onChange={(e) => setWaxSealInitials(e.target.value.toUpperCase())}
                    className="w-24 bg-[#181a22] border border-[#362f22] rounded px-2 py-1 text-xs font-bold text-[#caa04b] outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ovozli Detektiv Kassetasi (Audio Evidence) */}
        <div className="bg-[#12141a] p-3.5 rounded-xl border border-[#332b1e] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-[#e8dac5] font-bold flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAudioCassette}
                onChange={(e) => setHasAudioCassette(e.target.checked)}
                className="accent-[#caa04b]"
              />
              <Radio className="w-4 h-4 text-[#caa04b]" />
              <span>3. Ovozli Detektiv Kassetasi (Audio Cassette qo&apos;shish)</span>
            </label>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">[ DOLBY NOISE ]</span>
          </div>

          {hasAudioCassette && (
            <div className="mt-2">
              <input
                type="text"
                value={cassetteTitle}
                onChange={(e) => setCassetteTitle(e.target.value)}
                placeholder="FONOGRAMMA #07 // OVOZLI DALIL"
                className="w-full bg-[#181a22] border border-[#362f22] rounded px-3 py-1.5 text-xs font-mono text-[#caa04b] outline-none"
              />
              <p className="text-[10.5px] text-[#8e816f] mt-1">
                Qabul qiluvchi xat bilan birga aylanuvchi magnitafon kassetasi orqali ovozli dalilni tinglashi mumkin.
              </p>
            </div>
          )}
        </div>

        {/* 4. Gugurt Alangasi (Invisible Ink Lemon Juice) */}
        <div className="bg-[#12141a] p-3.5 rounded-xl border border-[#332b1e] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#e8dac5] font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>4. Ko&apos;rinmas Siyohli Qog&apos;oz (Gugurt bilan isitilganda ochiladi)</span>
            </span>
            <span className="text-[10px] font-mono text-orange-400 font-bold">[ ИСКРА ]</span>
          </div>
          <input
            type="text"
            value={secretMatchNote}
            onChange={(e) => setSecretMatchNote(e.target.value)}
            placeholder="«Seni hech qachon unutmaganman. Bu xat tasodif emas edi.»"
            className="w-full bg-[#181a22] border border-[#362f22] rounded px-3 py-1.5 text-xs text-[#ffd977] outline-none"
          />
          <p className="text-[10.5px] text-[#8e816f]">
            Qabul qiluvchi ekranda gugurtni chaqib, qog&apos;ozni qizdirganda limon sharbati qorayib ushbu yashirin jumla namoyon bo&apos;ladi.
          </p>
        </div>

          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
        {/* 5. Bir vaqtda ochish (Synchronized Opening Time) */}
        <div className="bg-[#12141a] p-3.5 rounded-xl border border-[#332b1e] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-[#e8dac5] font-bold flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSyncOpen}
                onChange={(e) => setHasSyncOpen(e.target.checked)}
                className="accent-[#caa04b]"
              />
              <Clock className="w-4 h-4 text-amber-400" />
              <span>5. &quot;Bir vaqtda ochish&quot; (Synchronized Secret Open)</span>
            </label>
            <span className="text-[10px] font-mono text-amber-300 font-bold">[ VAQT MUHRI ]</span>
          </div>

          {hasSyncOpen && (
            <div className="mt-2.5 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-[#a89b88]">Ochilish vaqti:</span>
                <input
                  type="time"
                  value={syncOpenTime}
                  onChange={(e) => setSyncOpenTime(e.target.value)}
                  className="bg-[#181a22] border border-[#362f22] rounded px-3 py-1.5 text-xs font-mono text-[#ffd977] outline-none font-bold"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setSyncOpenTime('21:00')}
                    className="px-2 py-1 bg-[#1a1e28] hover:bg-[#252b3b] text-[#ffd977] rounded border border-[#373227] cursor-pointer"
                  >
                    21:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setSyncOpenTime('22:00')}
                    className="px-2 py-1 bg-[#1a1e28] hover:bg-[#252b3b] text-[#ffd977] rounded border border-[#373227] cursor-pointer"
                  >
                    22:00
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      now.setHours(now.getHours() + 1);
                      const hh = String(now.getHours()).padStart(2, '0');
                      const mm = String(now.getMinutes()).padStart(2, '0');
                      setSyncOpenTime(`${hh}:${mm}`);
                    }}
                    className="px-2 py-1 bg-[#1a1e28] hover:bg-[#252b3b] text-[#caa04b] rounded border border-[#373227] cursor-pointer"
                  >
                    +1 soat
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#caa04b] bg-[#1a1710] p-2 rounded-lg border border-[#3b3223]">
                💡 <b>Dual-Timer Ko&apos;rinishi:</b> Qabul qiluvchi ekranda bir vaqtning o&apos;zida <b>1) Qachon ochilishi</b> va <b>2) Qancha vaqt qolgani (jonli sekundomer)</b>ni parallel ko&apos;rib turadi.
              </div>
            </div>
          )}
        </div>

          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
        {/* Row 1: Case Number & Recipient Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#a89b88] mb-1">
              Dosye raqami (Sarlavha shtampi):
            </label>
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full bg-[#101217] border border-[#362f22] rounded-lg px-3 py-2 text-xs font-case font-bold text-[#caa04b] outline-none"
              placeholder="ДЕЛО № 05"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#a89b88] mb-1">
              Qabul qiluvchi telefon raqami (SMS uchun):
            </label>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              aria-invalid={!isPhoneValid}
              aria-describedby={!isPhoneValid ? 'recipient-phone-error' : undefined}
              className={`w-full bg-[#101217] border rounded-lg px-3 py-2 text-xs font-mono text-[#e4dac7] outline-none ${
                isPhoneValid ? 'border-[#362f22]' : 'border-red-700'
              }`}
              placeholder="+998 90 123 45 67"
            />
            {!isPhoneValid && (
              <p id="recipient-phone-error" className="text-[10px] font-mono text-red-300 mt-1">
                Telefon raqamini +998 90 123 45 67 ko&apos;rinishida kiriting.
              </p>
            )}
          </div>
        </div>

        {/* Cover Title */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <label className="block text-xs font-mono text-[#a89b88]">
              Muqovadagi asosiy sarlavha (Katta harflarda):
            </label>
            <span className="text-[10px] font-mono text-[#716654]">{title.length}/60</span>
          </div>
          <input
            type="text"
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!title.trim()}
            className={`w-full bg-[#101217] border rounded-lg px-3 py-2 text-xs font-serif-vintage font-bold text-[#f2e6d2] outline-none ${
              title.trim() ? 'border-[#362f22]' : 'border-red-700'
            }`}
          />
          {!title.trim() && (
            <p className="text-[10px] font-mono text-red-300 mt-1">Sarlavha kiritilishi shart.</p>
          )}
        </div>

        {/* Cover Subtitle */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <label className="block text-xs font-mono text-[#a89b88]">
              Muqovadagi maxfiy taklif matni:
            </label>
            <span className="text-[10px] font-mono text-[#716654]">{invitationText.length}/180</span>
          </div>
          <textarea
            rows={2}
            maxLength={180}
            value={invitationText}
            onChange={(e) => setInvitationText(e.target.value)}
            aria-invalid={!invitationText.trim()}
            className={`w-full bg-[#101217] border rounded-lg p-3 text-xs text-[#d8cdb8] outline-none resize-none leading-relaxed ${
              invitationText.trim() ? 'border-[#362f22]' : 'border-red-700'
            }`}
          />
          {!invitationText.trim() && (
            <p className="text-[10px] font-mono text-red-300 mt-1">Taklif matni kiritilishi shart.</p>
          )}
        </div>

        {/* Unfinished items */}
        <div>
          <label className="block text-xs font-mono text-[#a89b88] mb-1">
            Tugallanmagan masalalar (3 ta punkt):
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={unfinished1}
              onChange={(e) => setUnfinished1(e.target.value)}
              className="w-full bg-[#101217] border border-[#362f22] rounded-lg px-3 py-2 text-xs text-[#d8cdb8] outline-none"
              placeholder="1-punkt..."
            />
            <input
              type="text"
              value={unfinished2}
              onChange={(e) => setUnfinished2(e.target.value)}
              className="w-full bg-[#101217] border border-[#362f22] rounded-lg px-3 py-2 text-xs text-[#d8cdb8] outline-none"
              placeholder="2-punkt..."
            />
            <input
              type="text"
              value={unfinished3}
              onChange={(e) => setUnfinished3(e.target.value)}
              className="w-full bg-[#101217] border border-[#362f22] rounded-lg px-3 py-2 text-xs text-[#d8cdb8] outline-none"
              placeholder="3-punkt..."
            />
          </div>
        </div>

        {/* Secret Letter Content */}
        <div className="border-t border-[#2d251a] pt-4">
          <label className="block text-xs font-case font-bold tracking-wider text-[#caa04b] mb-2">
            Maxfiy Xat Qismi (3-Sahifa):
          </label>
          <input
            type="text"
            value={letterHeadline}
            onChange={(e) => setLetterHeadline(e.target.value)}
            className="w-full bg-[#101217] border border-[#362f22] rounded-lg px-3 py-2 text-xs font-case font-bold text-[#caa04b] outline-none mb-2"
            placeholder="Xat sarlavhasi (masalan: ФИНАЛ — ЗА НАМИ)"
          />
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] font-mono text-[#8e816f]">1-xatboshi</span>
                <span className="text-[10px] font-mono text-[#716654]">{letterBody1.length}/180</span>
              </div>
              <textarea
                rows={2}
                maxLength={180}
                value={letterBody1}
                onChange={(e) => setLetterBody1(e.target.value)}
                aria-invalid={!letterBody1.trim()}
                className={`w-full bg-[#101217] border rounded-lg p-2.5 text-xs text-[#d8cdb8] outline-none resize-none leading-relaxed ${
                  letterBody1.trim() ? 'border-[#362f22]' : 'border-red-700'
                }`}
                placeholder="Xatning 1-xatboshisi..."
              />
              {!letterBody1.trim() && (
                <p className="text-[10px] font-mono text-red-300 mt-1">Birinchi xatboshi kiritilishi shart.</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] font-mono text-[#8e816f]">2-xatboshi</span>
                <span className="text-[10px] font-mono text-[#716654]">{letterBody2.length}/180</span>
              </div>
              <textarea
                rows={2}
                maxLength={180}
                value={letterBody2}
                onChange={(e) => setLetterBody2(e.target.value)}
                className="w-full bg-[#101217] border border-[#362f22] rounded-lg p-2.5 text-xs text-[#d8cdb8] outline-none resize-none leading-relaxed"
                placeholder="Xatning 2-xatboshisi..."
              />
            </div>
          </div>
        </div>

          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
        {/* Security Options (Watermark & Optional Burn) */}
        <div className="border-t border-[#2d251a] pt-3 space-y-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#cfc4b2]">
            <input
              type="checkbox"
              checked={watermarkEnabled}
              onChange={(e) => setWatermarkEnabled(e.target.checked)}
              className="accent-[#caa04b]"
            />
            <Shield className="w-3.5 h-3.5 text-[#caa04b]" />
            <span>Skrinshotga qarshi suv belgisi (Watermark)</span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#12141a] border border-[#332b1e] p-3">
            <label className="flex items-center gap-2 cursor-pointer text-[#cfc4b2]">
              <input
                type="checkbox"
                checked={burnAfterRead}
                onChange={(e) => setBurnAfterRead(e.target.checked)}
                className="accent-red-600"
              />
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>O&apos;qilgach o&apos;z-o&apos;zini yoqib yuborish</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#8e816f]">Ko&apos;rish limiti:</span>
              <div className="flex items-center gap-1.5" role="group" aria-label="Maksimal ko'rishlar soni">
              {[3, 5, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMaxViews(value)}
                  aria-pressed={maxViews === value}
                  className={`min-w-9 rounded-lg border px-2.5 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer ${
                    maxViews === value
                      ? 'bg-[#2a2318] border-[#caa04b] text-[#ffd977]'
                      : 'bg-[#181a22] border-[#362f22] text-[#8e816f] hover:text-[#d8cdb8]'
                  }`}
                >
                  {value}
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>

          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#2d251a]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-xs font-mono text-[#a39682] hover:text-[#e4dac7] transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep((prev) => (prev === 3 ? 2 : 1));
                }}
                className="px-4 py-2.5 rounded-lg border border-[#3a3123] text-xs font-mono text-[#cfc4b2] hover:text-white hover:border-[#594a31] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Orqaga
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                disabled={currentStep === 1 && !canContinueFromText}
                onClick={() => {
                  noirAudio.playPaperRustle();
                  setCurrentStep((prev) => (prev === 1 ? 2 : 3));
                }}
                className="py-2.5 px-5 brass-glow rounded-lg font-case font-bold text-xs tracking-widest text-[#1d1607] flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <span>Keyingi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canContinueFromText}
                className="py-2.5 px-6 brass-glow rounded-lg font-case font-bold text-xs tracking-widest text-[#1d1607] flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                <span>Dosyeni yaratish va faollashtirish</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
