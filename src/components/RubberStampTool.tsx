import React, { useState } from 'react';
import { RubberStamp, StampLifecycleStatus } from '../types';
import { noirAudio } from '../utils/audioAmbience';
import { Stamp } from 'lucide-react';

interface RubberStampToolProps {
  onApplyStamp: (stamp: RubberStamp) => void;
  stampedBy: 'author' | 'recipient';
}

export const STAMP_PRESETS = [
  {
    type: 'read' as const,
    text: 'ПРОЧИТАНО',
    color: '#2a4b7c',
    label: 'Прочитано',
    borderColor: 'border-[#2a4b7c]',
    textColor: 'text-[#4882ce]',
    bgColor: 'bg-[#1b2b45]/40',
  },
  {
    type: 'approved' as const,
    text: 'ПРИНЯТО',
    color: '#2d6a36',
    label: 'Принято',
    borderColor: 'border-[#2d6a36]',
    textColor: 'text-[#489956]',
    bgColor: 'bg-[#1b3823]/40',
  },
  {
    type: 'in_progress' as const,
    text: 'ОТВЕТ В ПУТИ',
    color: '#b3802e',
    label: 'Ответ в пути',
    borderColor: 'border-[#b3802e]',
    textColor: 'text-[#d6a247]',
    bgColor: 'bg-[#3b2b13]/40',
  },
  {
    type: 'secret' as const,
    text: 'ХРАНИТЬ В ТАЙНЕ',
    color: '#a83232',
    label: 'В тайне',
    borderColor: 'border-[#a83232]',
    textColor: 'text-[#c74c4c]',
    bgColor: 'bg-[#381616]/40',
  },
  {
    type: 'top_secret' as const,
    text: 'СОВЕРШЕННО СЕКРЕТНО',
    color: '#bd2222',
    label: 'Секретно',
    borderColor: 'border-[#bd2222]',
    textColor: 'text-[#e63939]',
    bgColor: 'bg-[#401212]/40',
  },
];

// Visual Rubber Stamp Badge with tactile ink effect
export const RubberStampBadge: React.FC<{
  stamp: RubberStamp;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ stamp, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'text-[8.5px] px-1 py-0.2 border',
    sm: 'text-[10px] px-2 py-0.5 border',
    md: 'text-[11.5px] px-2.5 py-1 border-2',
    lg: 'text-sm px-4 py-1.5 border-[2.5px]',
  };

  return (
    <div
      style={{
        transform: `rotate(${stamp.rotation}deg)`,
        borderColor: stamp.color,
        color: stamp.color,
        textShadow: `0 0 1px ${stamp.color}40`,
        boxShadow: `inset 0 0 4px ${stamp.color}20`,
      }}
      className={`inline-block font-case font-black tracking-[0.16em] select-none rounded-[2px] uppercase opacity-95 transition-transform ${sizeClasses[size]} ${className}`}
    >
      <span>[ {stamp.text} ]</span>
    </div>
  );
};

// Automatic Lifecycle Status Pill for Chat Messages
export const MessageStatusStamp: React.FC<{ status: StampLifecycleStatus }> = ({ status }) => {
  if (status === 'received') {
    return (
      <span className="font-case font-bold text-[9px] tracking-wider text-[#3d8c4c] border border-[#2d6a36]/50 bg-[#162e1c]/60 px-1.5 py-0.2 rounded-xs select-none">
        [ ПРИНЯТО ]
      </span>
    );
  }
  if (status === 'read') {
    return (
      <span className="font-case font-bold text-[9px] tracking-wider text-[#5293e6] border border-[#2a4b7c]/50 bg-[#162740]/60 px-1.5 py-0.2 rounded-xs select-none">
        [ ПРОЧИТАНО ]
      </span>
    );
  }
  return (
    <span className="font-case font-bold text-[9px] tracking-wider text-[#d49f3e] border border-[#b3802e]/50 bg-[#362711]/60 px-1.5 py-0.2 rounded-xs select-none">
      [ ОТВЕТ В ПУТИ ]
    </span>
  );
};

export const RubberStampTool: React.FC<RubberStampToolProps> = ({
  onApplyStamp,
  stampedBy,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (preset: (typeof STAMP_PRESETS)[0]) => {
    noirAudio.playStamp();

    // Random slight rotation between -5 and +5 degrees for authentic stamp look
    const randomRotation = Math.floor(Math.random() * 10) - 5;

    const newStamp: RubberStamp = {
      id: 'stamp-' + Date.now(),
      type: preset.type,
      text: preset.text,
      color: preset.color,
      rotation: randomRotation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stampedBy,
    };

    onApplyStamp(newStamp);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          noirAudio.playPaperRustle();
          setIsOpen((prev) => !prev);
        }}
        className="px-2.5 py-1 rounded-md bg-[#222530] border border-[#3f382a] text-[11px] font-mono text-[#d6c7af] hover:text-[#ffd977] hover:border-[#caa04b] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        title="Retro siyohli shtamp bosish"
      >
        <Stamp className="w-3.5 h-3.5 text-[#caa04b]" />
        <span>Shtamp bosish</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 z-50 bg-[#141620] border border-[#3e3423] p-3 rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.92)] w-[275px] space-y-2 backdrop-blur-md">
          <div className="text-[10px] font-mono text-[#8d7e68] border-b border-[#2d2518] pb-1.5 flex items-center justify-between">
            <span>Shtampni tanlang (Siyohli pechat):</span>
            <span className="text-[#caa04b] font-bold">Retro</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-0.5">
            {STAMP_PRESETS.map((preset) => (
              <button
                key={preset.text}
                type="button"
                onClick={() => handleSelect(preset)}
                className={`w-full px-3 py-2 rounded text-[10.5px] font-case font-bold tracking-wider flex items-center justify-between transition-colors cursor-pointer border ${preset.borderColor} ${preset.bgColor} ${preset.textColor} hover:brightness-125`}
              >
                <span className="truncate whitespace-nowrap">[ {preset.text} ]</span>
                <span className="text-[9.5px] opacity-75 font-mono ml-2 whitespace-nowrap shrink-0">urish ›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
