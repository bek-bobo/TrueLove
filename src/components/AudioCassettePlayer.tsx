import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  CloudRain,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

interface AudioCassettePlayerProps {
  title?: string;
  duration?: number; // duration in seconds
  authorName?: string;
  customAudioUrl?: string;
}

export const AudioCassettePlayer: React.FC<AudioCassettePlayerProps> = ({
  title = 'FONOGRAMMA #05 // NOIR JAZZ & YOMG\'IR',
  duration = 90,
  authorName = 'Detektiv Fonoteka (1988)',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playJazz, setPlayJazz] = useState(true);
  const [playRain, setPlayRain] = useState(true);
  const [jazzVolume, setJazzVolume] = useState(0.8);
  const [rainVolume, setRainVolume] = useState(0.7);
  const [showMixer, setShowMixer] = useState(false);
  
  // Real-time VU meter peak simulation
  const [vuLevelLeft, setVuLevelLeft] = useState(25);
  const [vuLevelRight, setVuLevelRight] = useState(30);

  const timerRef = useRef<number | null>(null);
  const vuAnimRef = useRef<number | null>(null);

  const togglePlay = () => {
    noirAudio.playCassetteMechanical();
    if (isPlaying) {
      setIsPlaying(false);
      noirAudio.playMix(false, false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      noirAudio.setJazzVolume(jazzVolume);
      noirAudio.setRainVolume(rainVolume);
      noirAudio.playMix(playJazz, playRain);
    }
  };

  const handleReset = () => {
    noirAudio.playCassetteMechanical();
    setIsPlaying(false);
    setCurrentTime(0);
    noirAudio.playMix(false, false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleToggleJazz = () => {
    const nextState = !playJazz;
    setPlayJazz(nextState);
    if (isPlaying) {
      noirAudio.playMix(nextState, playRain);
    }
  };

  const handleToggleRain = () => {
    const nextState = !playRain;
    setPlayRain(nextState);
    if (isPlaying) {
      noirAudio.playMix(playJazz, nextState);
    }
  };

  const handleJazzVolumeChange = (vol: number) => {
    setJazzVolume(vol);
    noirAudio.setJazzVolume(vol);
  };

  const handleRainVolumeChange = (vol: number) => {
    setRainVolume(vol);
    noirAudio.setRainVolume(vol);
  };

  // Tape playback counter
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            noirAudio.playMix(false, false);
            if (timerRef.current) clearInterval(timerRef.current);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, playJazz, playRain]);

  // VU meter jitter animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const leftBase = playJazz ? 45 + Math.random() * 45 : 15 + Math.random() * 15;
        const rightBase = playRain ? 40 + Math.random() * 40 : 15 + Math.random() * 15;
        setVuLevelLeft(Math.min(95, Math.max(10, Math.round(leftBase * (playJazz ? jazzVolume : 0.3)))));
        setVuLevelRight(Math.min(95, Math.max(10, Math.round(rightBase * (playRain ? rainVolume : 0.3)))));
      }, 120);
      return () => clearInterval(interval);
    } else {
      setVuLevelLeft(0);
      setVuLevelRight(0);
    }
  }, [isPlaying, playJazz, playRain, jazzVolume, rainVolume]);

  const progressPercent = Math.min(100, (currentTime / duration) * 100);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#13151c] border-2 border-[#3d3324] rounded-2xl p-4 shadow-[0_14px_35px_rgba(0,0,0,0.8)] text-[#ded1bd] relative overflow-hidden select-none">
      {/* 4 Corner Vintage Screws */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#201a14] border border-[#5a4833] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8c7453]" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#201a14] border border-[#5a4833] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8c7453]" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#201a14] border border-[#5a4833] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8c7453]" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#201a14] border border-[#5a4833] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#8c7453]" />
      </div>

      {/* Cassette Header Bar with Dolby & Brand Badge */}
      <div className="flex items-center justify-between border-b border-[#2e261a] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-case font-extrabold text-[11px] tracking-widest text-[#f5e6cc]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#2b1818] border border-red-900/60 text-red-300 font-bold uppercase">
            NOIR TAPE // C-90
          </span>
          <button
            type="button"
            onClick={() => setShowMixer((prev) => !prev)}
            className={`p-1 rounded text-xs transition-colors cursor-pointer border ${
              showMixer
                ? 'bg-[#3b2b17] border-[#caa04b] text-[#ffd977]'
                : 'bg-[#181a22] border-[#31271b] text-[#938573] hover:text-white'
            }`}
            title="Jazz va Yomg'ir ovoz mikserini ochish"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cassette Body Window with 2 Spinning Tape Spools & Center VU-Meter */}
      <div className="bg-[#0b0c10] border-2 border-[#2b2216] rounded-xl p-3 shadow-inner relative">
        <div className="flex items-center justify-between gap-3">
          {/* Left Reel Spool (Feed Reel) */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#171922] border-2 border-[#caa04b]/40 shadow-inner">
            {/* Spinning geared hub */}
            <div
              className={`w-11 h-11 rounded-full border-2 border-dashed border-[#d6b05d] flex items-center justify-center transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3.2s' }}
            >
              {/* 3 teeth notches */}
              <div className="w-4 h-4 rounded-full bg-[#0a0b0e] border border-[#caa04b] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#caa04b] rounded-full" />
              </div>
            </div>
            {/* Dark magnetic tape pack shrinking */}
            <div
              className="absolute rounded-full bg-[#3c2a17] pointer-events-none opacity-40 transition-all duration-500"
              style={{
                width: `${Math.max(18, 48 - (progressPercent * 0.26))}px`,
                height: `${Math.max(18, 48 - (progressPercent * 0.26))}px`,
              }}
            />
          </div>

          {/* Center Glass Window with Analog VU-Meter */}
          <div className="flex-1 bg-[#050608] border border-[#2b2419] rounded-lg h-14 px-3 flex flex-col justify-center shadow-inner relative overflow-hidden">
            {/* Magnetic Tape Bridge Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#4a341f] opacity-60" />

            {/* Glowing Vintage Analog VU Equalizer Bars */}
            {isPlaying ? (
              <div className="space-y-1 z-10">
                {/* Left channel (Jazz) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-[#caa04b] w-3 font-bold">L</span>
                  <div className="flex-1 h-2 bg-[#12141a] rounded-sm overflow-hidden flex gap-0.5 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-100 rounded-xs"
                      style={{ width: `${vuLevelLeft}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-[#8a7a66] w-6 text-right">
                    {playJazz ? 'JAZZ' : 'MUTE'}
                  </span>
                </div>

                {/* Right channel (Rain) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-[#6ab0ff] w-3 font-bold">R</span>
                  <div className="flex-1 h-2 bg-[#12141a] rounded-sm overflow-hidden flex gap-0.5 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-500 transition-all duration-100 rounded-xs"
                      style={{ width: `${vuLevelRight}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-[#8a7a66] w-6 text-right">
                    {playRain ? 'RAIN' : 'MUTE'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center z-10 space-y-0.5">
                <div className="text-[10px] font-mono tracking-wider text-[#caa04b]">
                  ▶ KASSETANI YOQISH
                </div>
                <div className="text-[8.5px] font-mono text-[#736551]">
                  Dolby Stereo • 44.1 kHz
                </div>
              </div>
            )}
          </div>

          {/* Right Reel Spool (Take-Up Reel) */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#171922] border-2 border-[#caa04b]/40 shadow-inner">
            {/* Spinning geared hub */}
            <div
              className={`w-11 h-11 rounded-full border-2 border-dashed border-[#d6b05d] flex items-center justify-center transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3.2s' }}
            >
              <div className="w-4 h-4 rounded-full bg-[#0a0b0e] border border-[#caa04b] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#caa04b] rounded-full" />
              </div>
            </div>
            {/* Dark magnetic tape pack growing */}
            <div
              className="absolute rounded-full bg-[#3c2a17] pointer-events-none opacity-40 transition-all duration-500"
              style={{
                width: `${Math.min(48, 20 + (progressPercent * 0.28))}px`,
                height: `${Math.min(48, 20 + (progressPercent * 0.28))}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Progress Tape Bar & Time Display */}
      <div className="mt-3 space-y-1">
        <div className="w-full h-1.5 bg-[#0e0f14] rounded-full overflow-hidden border border-[#292218]">
          <div
            className="h-full bg-gradient-to-r from-[#b38634] via-[#ffd977] to-[#e4a339] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#8a7c67]">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[#caa04b] font-bold">{authorName}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Interactive Sound Mixer Drawer (Jazz + Rain Controls) */}
      {showMixer && (
        <div className="mt-3 p-3 rounded-xl bg-[#0c0e14] border border-[#382f22] space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#252016] pb-1.5">
            <span className="text-[#e2d3bd] font-bold flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#caa04b]" />
              <span>Ovoz Mikseri (Noir Jazz &amp; Yomg&apos;ir)</span>
            </span>
            <span className="text-[9.5px] text-[#caa04b]">Jonli Balans</span>
          </div>

          {/* Track 1: Noir Jazz Slider & Switch */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <button
                type="button"
                onClick={handleToggleJazz}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  playJazz
                    ? 'bg-[#291f13] text-[#ffd977] border border-[#caa04b]'
                    : 'bg-[#15171e] text-[#6b6255] border border-[#2b251c]'
                }`}
              >
                <Music className="w-3 h-3" />
                <span>Noir Saksafon &amp; Patefon</span>
              </button>
              <span className="text-[#a89984]">{Math.round(jazzVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={jazzVolume}
              onChange={(e) => handleJazzVolumeChange(parseFloat(e.target.value))}
              disabled={!playJazz}
              className="w-full accent-[#caa04b] cursor-pointer h-1.5 bg-[#1a1c24] rounded-lg"
            />
          </div>

          {/* Track 2: Noir Rain Slider & Switch */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <button
                type="button"
                onClick={handleToggleRain}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  playRain
                    ? 'bg-[#142333] text-[#78c0ff] border border-[#2f6399]'
                    : 'bg-[#15171e] text-[#6b6255] border border-[#2b251c]'
                }`}
              >
                <CloudRain className="w-3 h-3" />
                <span>Tungi Yomg&apos;ir Shovqini</span>
              </button>
              <span className="text-[#a89984]">{Math.round(rainVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rainVolume}
              onChange={(e) => handleRainVolumeChange(parseFloat(e.target.value))}
              disabled={!playRain}
              className="w-full accent-[#4a9eff] cursor-pointer h-1.5 bg-[#1a1c24] rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Cassette Mechanical Key Controls */}
      <div className="mt-3 pt-2.5 border-t border-[#2d251a] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowMixer((prev) => !prev)}
          className="text-[10.5px] font-mono text-[#8a7c67] hover:text-[#caa04b] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-[#caa04b]" />
          <span>{showMixer ? 'Mikserni yopish' : 'Jazz / Yomg\'ir mikseri'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Rewind */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-md bg-[#1f222c] border border-[#3b3224] text-[#a1927e] hover:text-white transition-colors cursor-pointer active:scale-95 shadow-xs"
            title="Kassetani boshiga qaytarish (Rewind)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Main Play / Pause Push Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="px-4 py-1.5 rounded-md brass-glow font-case font-bold text-xs text-[#1c1407] flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pauza</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tinglash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
