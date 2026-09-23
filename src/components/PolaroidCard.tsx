import React, { useState } from 'react';
import { noirAudio } from '../utils/audioAmbience';
import { Wind, Sparkles, Check } from 'lucide-react';

interface PolaroidCardProps {
  caption: string;
  theme: 'rain_street' | 'secret_door' | 'clock' | 'letter';
  rotation?: string;
  onClick?: () => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  caption,
  theme,
  rotation = '-rotate-2',
  onClick,
}) => {
  const [isDusty, setIsDusty] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [particles, setParticles] = useState<{ id: number; tx: number; ty: number; size: number }[]>([]);

  const handleBlowDust = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDusty) {
      noirAudio.playDustBlow();
      setIsBlowing(true);

      // Generate 14 randomized dust particles that fly off
      const newParticles = Array.from({ length: 14 }).map((_, i) => ({
        id: Date.now() + i,
        tx: (Math.random() - 0.5) * 120,
        ty: -20 - Math.random() * 80,
        size: Math.random() * 5 + 3,
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setIsDusty(false);
        setIsBlowing(false);
      }, 350);
    } else {
      // If already clean, tap can toggle re-dust or trigger paper rustle
      noirAudio.playPaperRustle();
      if (onClick) onClick();
    }
  };

  return (
    <div
      onClick={handleBlowDust}
      className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 ${rotation}`}
      title={isDusty ? 'Changni puflab tozalash uchun bosing!' : 'Kattalashtirib ko\'rish'}
    >
      {/* Golden Brass Thumbtack / Pin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#ffd977] via-[#b88c3c] to-[#73501a] shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center border border-[#fff2b2]/40">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ffeaad] shadow-inner opacity-80" />
        </div>
        <div className="absolute top-3 w-1 h-2 bg-black/40 blur-[1px] -rotate-12" />
      </div>

      {/* Polaroid Frame */}
      <div className="bg-[#ede4d1] p-2 pb-4 rounded-xs shadow-[0_8px_18px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.4)] border border-[#d2c2a0]/60 w-[138px] sm:w-[155px] relative">
        {/* Photo Canvas */}
        <div className="relative aspect-square w-full bg-[#101318] overflow-hidden rounded-[1px] border border-black/30">
          {theme === 'rain_street' ? (
            /* Noir wet street & solitary streetlamp */
            <div className={`relative w-full h-full bg-gradient-to-b from-[#0b0e14] via-[#161a22] to-[#1a1e28] flex items-center justify-center transition-all duration-500 ${
              isDusty ? 'filter blur-[1.2px] contrast-75 brightness-75' : 'filter contrast-110 brightness-105'
            }`}>
              {/* Rain Streaks */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
              
              {/* Glowing Vintage Lantern */}
              <div className="absolute top-4 right-7 w-5 h-5 rounded-full bg-[#fde08b]/40 blur-md animate-pulse" />
              <div className="absolute top-5 right-8 w-2 h-2 rounded-full bg-[#fff4cc]" />
              
              {/* Lamp Post Silhouette */}
              <svg className="absolute inset-0 w-full h-full text-[#080a0f]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M 68 20 L 72 20 L 71 35 L 70 85 L 74 95 L 66 95 L 69 85 Z" />
                <path d="M 66 18 C 66 14 74 14 74 18 L 73 22 L 67 22 Z" />
                <ellipse cx="60" cy="85" rx="30" ry="8" fill="#ffd977" fillOpacity="0.12" />
                <ellipse cx="40" cy="90" rx="20" ry="5" fill="#ffd977" fillOpacity="0.08" />
              </svg>

              {/* Fog overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>
          ) : (
            /* Noir mysterious stairway & door */
            <div className={`relative w-full h-full bg-gradient-to-b from-[#08090c] via-[#15171d] to-[#1f2229] flex items-center justify-center transition-all duration-500 ${
              isDusty ? 'filter blur-[1.2px] contrast-75 brightness-75' : 'filter contrast-110 brightness-105'
            }`}>
              {/* Light under door */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-16 bg-[#0c0d12] border border-[#3b372f] shadow-inner">
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ffeaad] shadow-[0_0_12px_#ffeaad]" />
                <div className="absolute top-3 right-2 w-1 h-1 rounded-full bg-[#d4af37]" />
              </div>
              
              {/* Dark Stairs */}
              <svg className="absolute bottom-0 inset-x-0 w-full h-12 text-[#0c0e12]" viewBox="0 0 100 50">
                <polygon points="10,50 90,50 82,38 18,38" fill="#14171d" />
                <polygon points="18,38 82,38 75,26 25,26" fill="#101217" />
                <polygon points="25,26 75,26 68,14 32,14" fill="#0c0e12" />
                <line x1="18" y1="38" x2="82" y2="38" stroke="#cca253" strokeOpacity="0.25" strokeWidth="1" />
                <line x1="25" y1="26" x2="75" y2="26" stroke="#cca253" strokeOpacity="0.25" strokeWidth="1" />
              </svg>
            </div>
          )}

          {/* DUST COATING LAYER */}
          {isDusty && (
            <div className={`absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none flex flex-col items-center justify-center p-2 text-center ${
              isBlowing ? 'opacity-0 scale-105' : 'opacity-100'
            }`}
              style={{
                backgroundColor: 'rgba(189, 173, 146, 0.78)',
                backgroundImage: 'radial-gradient(rgba(100, 80, 50, 0.25) 1px, transparent 1px), repeating-linear-gradient(45deg, rgba(80,60,30,0.06) 0, rgba(80,60,30,0.06) 2px, transparent 2px, transparent 6px)',
              }}
            >
              {/* Dust icon and tap prompt */}
              <div className="bg-black/60 backdrop-blur-xs px-2 py-1 rounded-sm border border-[#caa04b]/40 shadow-lg text-[9.5px] font-mono text-[#f5ebd7] flex items-center gap-1 animate-pulse">
                <Wind className="w-3 h-3 text-[#caa04b]" />
                <span>Puflang</span>
              </div>
              <span className="text-[8px] font-mono text-[#4a3b26] mt-1 font-bold">
                Arxiv changi
              </span>
            </div>
          )}

          {/* Flying dust particles explosion when blowing */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute z-20 rounded-full bg-[#d9cbb4] animate-dust-particle pointer-events-none shadow-sm"
              style={
                {
                  left: '50%',
                  top: '50%',
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Cleaned Badge if dust was blown */}
          {!isDusty && (
            <div className="absolute top-1 right-1 z-10 bg-emerald-950/80 border border-emerald-500/60 rounded px-1 py-0.2 text-[8px] font-case font-bold text-emerald-300 tracking-wider shadow">
              [ OCHILDI ]
            </div>
          )}

          {/* Film Grain & Vignette */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Handwritten caption */}
        <div className="mt-2 text-center">
          <p className="font-['Caveat',cursive,'Special_Elite',cursive] text-[13px] text-[#423a2f] tracking-wide leading-none font-medium italic">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
};
