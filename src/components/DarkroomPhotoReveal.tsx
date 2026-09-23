import React, { useState, useEffect } from 'react';
import { Droplets, RotateCcw, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface DarkroomPhotoRevealProps {
  imageUrl?: string;
  caption?: string;
  dateStamp?: string;
}

export const DarkroomPhotoReveal: React.FC<DarkroomPhotoRevealProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  caption = 'DALIL #05: O\'sha tunda olingan maxfiy kadr (O\'sha paytlar)',
  dateStamp = 'KODAK TRI-X 400 // 1988',
}) => {
  const [developmentProgress, setDevelopmentProgress] = useState(0); // 0 to 100%
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [isFullyDeveloped, setIsFullyDeveloped] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isDeveloping && developmentProgress < 100) {
      timer = setInterval(() => {
        setDevelopmentProgress((prev) => {
          if (prev >= 98) {
            setIsFullyDeveloped(true);
            setIsDeveloping(false);
            noirAudio.playStamp();
            return 100;
          }
          return prev + 4;
        });
      }, 90);
    }
    return () => clearInterval(timer);
  }, [isDeveloping, developmentProgress]);

  const handleStartDeveloping = () => {
    noirAudio.playPaperRustle();
    setIsDeveloping(true);
  };

  const handleReset = () => {
    noirAudio.playPaperRustle();
    setDevelopmentProgress(0);
    setIsFullyDeveloped(false);
    setIsDeveloping(false);
  };

  // Compute filter: at 0% it's inverted negative; at 100% it's warm vintage sepia
  const filterStyle = isFullyDeveloped
    ? 'sepia(0.65) contrast(1.15) brightness(0.95)'
    : `invert(${Math.max(0, 1 - developmentProgress / 100)}) sepia(${developmentProgress / 100}) contrast(${1.4 - (developmentProgress / 200)})`;

  return (
    <div className="w-full my-3 p-3.5 bg-[#0e1015] border-2 border-[#3c3425] rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.85)] text-[#ded1bd] relative overflow-hidden select-none">
      {/* Red Darkroom Safe Light Glow when developing */}
      {isDeveloping && (
        <div className="absolute inset-0 bg-red-950/35 pointer-events-none z-20 animate-pulse" />
      )}

      {/* 35mm Film Strip Top Header */}
      <div className="flex items-center justify-between border-b border-[#292218] pb-2 mb-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8dac6]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse" />
          <span>FOTOLABORATORIYA // QIZIL CHIROQ</span>
        </div>

        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#2b1616] border border-red-900 text-red-300 font-bold uppercase tracking-wider">
          {dateStamp}
        </span>
      </div>

      {/* 35mm Sprocket Holes Header */}
      <div className="flex justify-between px-2 py-1 bg-black/90 rounded-t-lg border-x border-t border-[#2d2417]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-[#221c15] rounded-xs border border-[#443725]" />
        ))}
      </div>

      {/* Main Photographic Paper in Chemical Tray */}
      <div className="relative border-x border-[#2d2417] bg-[#050608] p-2 flex flex-col items-center overflow-hidden">
        <div
          className="relative w-full max-h-[220px] rounded-sm overflow-hidden border border-[#52412b] transition-all duration-300"
          style={{
            boxShadow: isDeveloping
              ? '0 0 25px rgba(220, 38, 38, 0.45)'
              : '0 4px 15px rgba(0,0,0,0.8)',
          }}
        >
          <img
            src={imageUrl}
            alt="Classified Evidence"
            className="w-full h-48 sm:h-52 object-cover transition-all duration-200"
            style={{ filter: filterStyle }}
          />

          {/* Development progress water level overlay */}
          {!isFullyDeveloped && (
            <div
              className="absolute inset-0 bg-red-950/25 backdrop-blur-[0.5px] pointer-events-none transition-all"
              style={{ opacity: 1 - developmentProgress / 100 }}
            />
          )}

          {/* Overlay Status Tag */}
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/85 border border-[#5a4832] text-[10px] font-mono text-[#ecdab8] flex items-center gap-1.5 shadow-md">
            {isFullyDeveloped ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Rivojlantirildi: 100%</span>
              </>
            ) : isDeveloping ? (
              <>
                <Droplets className="w-3 h-3 text-red-400 animate-bounce" />
                <span>Kimyoviy reaksiya: {developmentProgress}%</span>
              </>
            ) : (
              <span>Negativ holat (0%)</span>
            )}
          </div>
        </div>
      </div>

      {/* 35mm Sprocket Holes Footer */}
      <div className="flex justify-between px-2 py-1 bg-black/90 rounded-b-lg border-x border-b border-[#2d2417]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-[#221c15] rounded-xs border border-[#443725]" />
        ))}
      </div>

      {/* Caption description line */}
      <div className="mt-2 text-center text-[10px] font-mono text-[#a89984]">
        {caption}
      </div>

      {/* Modern Retro Mobile-Optimized Trigger Button Panel */}
      <div className="mt-2.5 pt-2 border-t border-[#292218] flex flex-col gap-2">
        {isFullyDeveloped ? (
          /* Finished State: Elegant Vintage Bar with Reset */
          <div className="flex items-center justify-between bg-[#151821] p-2 rounded-xl border border-[#3b3223]">
            <span className="text-[11px] font-case font-bold text-[#ffd977] flex items-center gap-1.5 pl-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Surat arxivdan muvaffaqiyatli tiklandi</span>
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="py-1.5 px-3 bg-[#242836] hover:bg-[#303648] border border-[#524430] text-[10px] font-mono font-bold text-[#ffd977] rounded-lg cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Qayta ko&apos;rish</span>
            </button>
          </div>
        ) : (
          /* Mobile-Friendly Retro Tactile Push Button */
          <button
            type="button"
            onClick={handleStartDeveloping}
            disabled={isDeveloping}
            className={`w-full py-3 px-4 rounded-xl border font-case font-extrabold text-xs tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-[0.98] transition-all ${
              isDeveloping
                ? 'bg-gradient-to-r from-[#3a1414] via-[#521c1c] to-[#3a1414] border-red-700/80 text-red-200'
                : 'bg-gradient-to-r from-[#caa04b] via-[#e2be6d] to-[#caa04b] text-[#1c1407] border-[#fff0c8] hover:brightness-110 shadow-[0_4px_16px_rgba(202,160,75,0.35)]'
            }`}
          >
            {isDeveloping ? (
              <>
                <Droplets className="w-4 h-4 text-red-400 animate-spin" />
                <span>KIMYOVIY VANNADA OCHILMOQDA ({developmentProgress}%)...</span>
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white/50 shadow-[0_0_6px_rgba(239,68,68,0.8)] shrink-0" />
                <span>SURATNI CHIQARISH (FOTOLABORATORIYA)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
