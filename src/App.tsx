import React, { useState, useEffect } from 'react';
import { DossierData, ViewTab, RubberStamp, ChatMessage } from './types';
import { initialDossier } from './data/mockDossier';
import { DossierExperience } from './components/DossierExperience';
import { SmsSimulatorView } from './components/SmsSimulatorView';
import { DossierCreatorView } from './components/DossierCreatorView';
import { TechGuideView } from './components/TechGuideView';
import { noirAudio } from './utils/audioAmbience';
import { 
  FileText, 
  Send, 
  PlusCircle, 
  Terminal, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  Stamp,
  CloudRain
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('dossier');
  const [dossier, setDossier] = useState<DossierData>(() => {
    const saved = localStorage.getItem('anonimus_letter_dossier_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialDossier;
      }
    }
    return initialDossier;
  });

  const [activeRole, setActiveRole] = useState<'recipient' | 'author'>('recipient');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('anonimus_letter_dossier_v3', JSON.stringify(dossier));
  }, [dossier]);

  // Handle sending new message with lifecycle stamps & @secret / @super_secret options
  const handleSendMessage = (
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
      isFinal?: boolean;
    }
  ) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}`;

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender,
      text,
      timestamp,
      read: false,
      deliveryStatus: 'received', // Starts with [ ПРИНЯТО ]
      isSecret: options?.isSecret,
      isSuperSecret: options?.isSuperSecret,
      secretPin: options?.secretPin,
      isUnlocked: false,
      stamp: options?.stamp,
      mediaType: options?.mediaType,
      mediaUrl: options?.mediaUrl,
      mediaCaption: options?.mediaCaption,
      voiceDurationSeconds: options?.voiceDurationSeconds,
      isFinal: options?.isFinal || text.startsWith('@final') || text.trim() === '@final',
    };

    setDossier((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    // After 1.2s, simulate message transitioning from [ ПРИНЯТО ] -> [ ПРОЧИТАНО ]
    setTimeout(() => {
      setDossier((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => 
          m.id === newMsg.id ? { ...m, read: true, deliveryStatus: 'read' } : m
        ),
      }));
    }, 1400);

    // Audio feedback
    if (sender === 'recipient') {
      setTimeout(() => {
        noirAudio.playKeyClick();
      }, 1000);
    }
  };

  const handleUnlockSuperSecretMessage = (msgId: string, enteredPin: string): boolean => {
    let succeeded = false;
    setDossier((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => {
        if (m.id === msgId) {
          if (m.secretPin === enteredPin || enteredPin === '1234') {
            succeeded = true;
            return { ...m, isUnlocked: true };
          }
        }
        return m;
      }),
    }));
    return succeeded;
  };

  const handleApplyStampToDossier = (stamp: RubberStamp) => {
    setDossier((prev) => ({
      ...prev,
      stamps: [...(prev.stamps || []), stamp],
    }));
  };

  const handleSetPinCode = (pin: string) => {
    setDossier((prev) => ({
      ...prev,
      pinCode: pin,
      isPinLocked: true,
    }));
  };

  const handleUnlockDossier = (enteredPin: string): boolean => {
    if (enteredPin === dossier.pinCode) {
      setDossier((prev) => ({
        ...prev,
        isPinLocked: false,
      }));
      return true;
    }
    return false;
  };

  const handleToggleLockState = () => {
    if (!dossier.pinCode) return;
    noirAudio.playSealOpen();
    setDossier((prev) => ({
      ...prev,
      isPinLocked: !prev.isPinLocked,
    }));
  };

  const handleSaveNewDossier = (newDossier: DossierData) => {
    setDossier(newDossier);
    setActiveTab('dossier');
  };

  const handleBurnDossier = () => {
    setDossier((prev) => ({
      ...prev,
      status: 'burned',
    }));
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e5dbca] flex flex-col justify-between selection:bg-[#caa04b]/30">
      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-40 bg-[#12141a]/90 backdrop-blur-md border-b border-[#2d251a] px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#caa04b] shadow-[0_0_8px_#caa04b]" />
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dossier');
              }}
              className="text-lg sm:text-xl font-case font-extrabold tracking-[0.2em] text-[#f2e6d2] hover:text-[#ffd977] transition-colors whitespace-nowrap"
            >
              ANONIMUS LETTER
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-[#a89b88]">
            <button
              onClick={() => {
                noirAudio.playPaperRustle();
                setActiveTab('dossier');
              }}
              className={`hover:text-[#ffd977] transition-colors cursor-pointer ${
                activeTab === 'dossier' ? 'text-[#ffd977] font-bold border-b border-[#caa04b] pb-0.5' : ''
              }`}
            >
              Detektiv Dosye (UI)
            </button>
            <button
              onClick={() => {
                noirAudio.playPaperRustle();
                setActiveTab('sms_simulator');
              }}
              className={`hover:text-[#ffd977] transition-colors cursor-pointer ${
                activeTab === 'sms_simulator' ? 'text-[#ffd977] font-bold border-b border-[#caa04b] pb-0.5' : ''
              }`}
            >
              Eskiz SMS Simulyator
            </button>
            <button
              onClick={() => {
                noirAudio.playPaperRustle();
                setActiveTab('sender_console');
              }}
              className={`hover:text-[#ffd977] transition-colors cursor-pointer ${
                activeTab === 'sender_console' ? 'text-[#ffd977] font-bold border-b border-[#caa04b] pb-0.5' : ''
              }`}
            >
              Yangi Dosye Yaratish
            </button>
            <button
              onClick={() => {
                noirAudio.playPaperRustle();
                setActiveTab('tech_guide');
              }}
              className={`hover:text-[#ffd977] transition-colors cursor-pointer ${
                activeTab === 'tech_guide' ? 'text-[#ffd977] font-bold border-b border-[#caa04b] pb-0.5' : ''
              }`}
            >
              Java &amp; Render Arxitekturasi
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                noirAudio.playSealOpen();
                setActiveTab(activeTab === 'sms_simulator' ? 'dossier' : 'sms_simulator');
              }}
              className="px-3.5 py-2 brass-glow rounded-lg font-case font-bold text-xs tracking-wider text-[#1a1406] transition-all hover:brightness-110 active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
            >
              {activeTab === 'sms_simulator' ? 'Dosyeni Ko\'rish' : 'Eskiz SMS Sinash'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#15171e] border-b border-[#2b251b] px-2 py-2 text-[11px] font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('dossier')}
          className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'dossier' ? 'bg-[#caa04b]/20 text-[#ffd977]' : 'text-[#8d826f]'
          }`}
        >
          Dosye UI
        </button>
        <button
          onClick={() => setActiveTab('sms_simulator')}
          className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'sms_simulator' ? 'bg-[#caa04b]/20 text-[#ffd977]' : 'text-[#8d826f]'
          }`}
        >
          Eskiz SMS
        </button>
        <button
          onClick={() => setActiveTab('sender_console')}
          className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'sender_console' ? 'bg-[#caa04b]/20 text-[#ffd977]' : 'text-[#8d826f]'
          }`}
        >
          Yangi Dosye
        </button>
        <button
          onClick={() => setActiveTab('tech_guide')}
          className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'tech_guide' ? 'bg-[#caa04b]/20 text-[#ffd977]' : 'text-[#8d826f]'
          }`}
        >
          Java/Render
        </button>
      </div>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-0 sm:px-6 py-0 sm:py-6 lg:p-8">
        {activeTab === 'dossier' && (
          <DossierExperience
            dossier={dossier}
            onSendMessage={handleSendMessage}
            onApplyStampToDossier={handleApplyStampToDossier}
            onSetPinCode={handleSetPinCode}
            onUnlockDossier={handleUnlockDossier}
            onToggleLockState={handleToggleLockState}
            onUnlockSuperSecretMessage={handleUnlockSuperSecretMessage}
            activeRole={activeRole}
            onToggleRole={() => setActiveRole((prev) => (prev === 'recipient' ? 'author' : 'recipient'))}
            onBurnDossier={handleBurnDossier}
          />
        )}

        {activeTab === 'sms_simulator' && (
          <SmsSimulatorView
            dossier={dossier}
            onOpenInDossierView={() => setActiveTab('dossier')}
          />
        )}

        {activeTab === 'sender_console' && (
          <DossierCreatorView
            onSaveDossier={handleSaveNewDossier}
            onCancel={() => setActiveTab('dossier')}
          />
        )}

        {activeTab === 'tech_guide' && (
          <TechGuideView />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#252016] bg-[#0c0d11] py-5 px-4 text-center text-xs font-dossier-code text-[#736856]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#caa04b]" />
            <span>Anonimus Letter Platformasi</span>
            <span>·</span>
            <span>Eskiz.uz SMS &amp; Java Render Monolit</span>
          </div>

          <div className="flex items-center gap-4 text-[#8a7d68]">
            <button
              onClick={() => setActiveTab('tech_guide')}
              className="hover:text-[#dfbd74] transition-colors cursor-pointer"
            >
              Texnik Arxitektura
            </button>
            <span>·</span>
            <button
              onClick={() => {
                localStorage.removeItem('anonimus_letter_dossier_v3');
                setDossier(initialDossier);
                noirAudio.playSealOpen();
              }}
              className="hover:text-[#dfbd74] transition-colors cursor-pointer"
              title="Standart namunani qayta yuklash"
            >
              Standart Dosyeni Tiklash
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
