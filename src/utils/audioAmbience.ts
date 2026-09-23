/**
 * Synthesizes retro typewriter, rubber stamp thuds, rain ambience, and mechanical click sounds using Web Audio API.
 * 100% self-contained, no external mp3 assets required.
 */
class NoirAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isRainPlaying: boolean = false;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;

  // Noir Jazz & Vinyl crackle
  private isJazzPlaying: boolean = false;
  private jazzInterval: any = null;
  private vinylNode: AudioNode | null = null;
  private vinylGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.isRainPlaying) this.stopRainAmbience();
      if (this.isJazzPlaying) this.stopNoirJazz();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isJazzActive(): boolean {
    return this.isJazzPlaying;
  }

  public toggleNoirJazz(): boolean {
    if (this.isJazzPlaying) {
      this.stopNoirJazz();
      return false;
    } else {
      this.startNoirJazz();
      return true;
    }
  }

  private startNoirJazz() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // 1. Vinyl Record Crackle / Needle Hiss
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Occasional vinyl pops
        const isPop = Math.random() < 0.002;
        data[i] = isPop ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.04;
      }

      const vinyl = this.ctx.createBufferSource();
      vinyl.buffer = buffer;
      vinyl.loop = true;

      const vinylFilter = this.ctx.createBiquadFilter();
      vinylFilter.type = 'bandpass';
      vinylFilter.frequency.value = 1800;

      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      vinyl.connect(vinylFilter);
      vinylFilter.connect(this.vinylGain);
      this.vinylGain.connect(this.ctx.destination);
      vinyl.start();
      this.vinylNode = vinyl;

      // 2. Slow, Smokey Saxophone / Rhodes chord notes progression in D minor
      const scale = [146.83, 174.61, 220.00, 261.63, 293.66, 349.23, 440.00]; // D, F, A, C, D, F, A
      let noteIndex = 0;

      const playSaxNote = () => {
        if (!this.ctx || !this.isJazzPlaying) return;
        try {
          const t = this.ctx.currentTime;
          const freq = scale[noteIndex % scale.length];
          noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1) % scale.length;

          // Rich warm saxophone harmonic (triangle + slight sine detune)
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(freq, t);
          // slight jazz vibrato
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(freq * 1.002, t);

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, t);
          filter.frequency.exponentialRampToValueAtTime(450, t + 2.2);

          // Smooth breathy envelope
          noteGain.gain.setValueAtTime(0.001, t);
          noteGain.gain.linearRampToValueAtTime(0.05, t + 0.4);
          noteGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(this.ctx.destination);

          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 2.5);
          osc2.stop(t + 2.5);
        } catch {}
      };

      // Play immediately and then repeat with dreamy tempo
      playSaxNote();
      this.jazzInterval = setInterval(() => {
        if (Math.random() > 0.15) playSaxNote();
      }, 2600);

      this.isJazzPlaying = true;
    } catch {
      this.isJazzPlaying = false;
    }
  }

  private stopNoirJazz() {
    try {
      if (this.vinylNode && 'stop' in this.vinylNode) {
        (this.vinylNode as AudioBufferSourceNode).stop();
      }
      this.vinylNode = null;
      if (this.jazzInterval) {
        clearInterval(this.jazzInterval);
        this.jazzInterval = null;
      }
      this.isJazzPlaying = false;
    } catch {
      this.isJazzPlaying = false;
    }
  }

  // Heavy wooden rubber stamp thud
  public playStamp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      // 1. Low thud
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.15);

      oscGain.gain.setValueAtTime(0.28, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);

      // 2. Paper contact noise
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    } catch {
      // Audio fallback
    }
  }

  // Typewriter key click sound
  public playKeyClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio playback silently falls back
    }
  }

  // Vintage Brass seal / case opening sound
  public playSealOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Silently fall back
    }
  }

  // Paper rustle sound
  public playPaperRustle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Silently fall back
    }
  }

  // Air breath / dust blow whoosh sound
  public playDustBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const duration = 0.45;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + duration);
    } catch {
      // Silently fall back
    }
  }

  // Fire burning & crackle sound
  public playFireBurn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const duration = 2.4;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 2.5 : 0;
        data[i] = (Math.random() * 2 - 1) * 0.15 + crackle;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore
    }
  }

  // Cassette mechanical click & tape hiss
  public playCassetteMechanical() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Click 1 (Button depress)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }

  // Gentle Noir Rain Ambience Loop
  public toggleRainAmbience(): boolean {
    if (this.isRainPlaying) {
      this.stopRainAmbience();
      return false;
    } else {
      this.startRainAmbience();
      return true;
    }
  }

  public isRainActive(): boolean {
    return this.isRainPlaying;
  }

  private startRainAmbience() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Create 2-second looped noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 750;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      noise.start();
      this.rainNode = noise;
      this.isRainPlaying = true;
    } catch {
      this.isRainPlaying = false;
    }
  }

  private stopRainAmbience() {
    try {
      if (this.rainNode && 'stop' in this.rainNode) {
        (this.rainNode as AudioBufferSourceNode).stop();
      }
      this.rainNode = null;
      this.isRainPlaying = false;
    } catch {
      this.isRainPlaying = false;
    }
  }

  public setRainVolume(vol: number) {
    if (this.rainGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol)) * 0.08;
      this.rainGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  public setJazzVolume(vol: number) {
    if (this.vinylGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol)) * 0.12;
      this.vinylGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  public playMix(jazz: boolean, rain: boolean) {
    if (jazz && !this.isJazzPlaying) {
      this.startNoirJazz();
    } else if (!jazz && this.isJazzPlaying) {
      this.stopNoirJazz();
    }

    if (rain && !this.isRainPlaying) {
      this.startRainAmbience();
    } else if (!rain && this.isRainPlaying) {
      this.stopRainAmbience();
    }
  }

  // Realistic Match Strike sound (scratching sulfur + initial whoosh hiss)
  public playMatchStrike() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Friction scratch
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2800, t);
      bandpass.frequency.exponentialRampToValueAtTime(1400, t + 0.18);
      bandpass.Q.value = 3.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);

      // 2. Flare flame pop
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.35);

      oscGain.gain.setValueAtTime(0.001, t);
      oscGain.gain.setValueAtTime(0.2, t + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t + 0.08);
      osc.stop(t + 0.35);
    } catch {}
  }

  // Retro phone rotary dial tone & connection buzz
  public playPhoneDialTone() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Dual-tone multi-frequency (classic 350Hz + 440Hz European/Soviet dial tone)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.frequency.value = 425;
      osc2.frequency.value = 450;

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 1.2);
      osc2.stop(t + 1.2);
    } catch {}
  }

  // Phone pickup click
  public playPhonePickup() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.09);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch {}
  }

  // Rotary Safe Dial Click (metallic tooth click)
  public playSafeClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    } catch {}
  }

  // Heavy steel vault safe door unlock ("KLANK-CHING!")
  public playSafeUnlock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Heavy bass impact
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(120, t);
      osc1.frequency.exponentialRampToValueAtTime(30, t + 0.35);
      gain1.gain.setValueAtTime(0.4, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.35);

      // Metallic ring resonance
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(540, t + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(420, t + 0.6);
      gain2.gain.setValueAtTime(0.001, t);
      gain2.gain.setValueAtTime(0.25, t + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.6);
    } catch {}
  }

  // Realistic paper tearing / ripping sound
  public playPaperRip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High frequency friction bursting
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI * 16) * Math.exp(-i / (bufferSize * 0.7));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch {}
  }

  // Thumbprint ink press contact
  public playFingerprintPress() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch {}
  }

  // Subtle, low-frequency tactile paper slide sound effect for sliding chat messages
  public playPaperSlide() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const duration = 0.28;

      // 1. Low-frequency paper friction noise texture (gliding across surface)
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const progress = i / bufferSize;
        // Soft analog friction grain, decaying smoothly
        const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.4);
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter: warm low-pass with slight resonance around 320Hz sliding down to 180Hz
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, t);
      filter.frequency.exponentialRampToValueAtTime(190, t + duration);
      filter.Q.setValueAtTime(1.4, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t);
      noiseGain.gain.linearRampToValueAtTime(0.14, t + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);

      // 2. Subtle low-frequency body slide tone (analog whoosh 110Hz -> 55Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + duration);

      oscGain.gain.setValueAtTime(0.001, t);
      oscGain.gain.linearRampToValueAtTime(0.08, t + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    } catch {}
  }
}

export const noirAudio = new NoirAudioService();
