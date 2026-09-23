// Haptic Vibration Feedback Utilities via Web Vibration API

export const hapticFeedback = {
  // Check if navigator.vibrate is supported
  isSupported: (): boolean => {
    return typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function';
  },

  // Trigger custom pattern safely
  vibrate: (pattern: number | number[]) => {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration errors (e.g. if blocked by browser policy)
    }
  },

  // 1. New Message Received / Sent in Telegraf chat (Distinct double pulse)
  messageReceived: () => {
    hapticFeedback.vibrate([45, 60, 45]);
  },

  // 2. Safe Dial Mechanical Tick (Single crisp subtle tick)
  safeDialTick: () => {
    hapticFeedback.vibrate(10);
  },

  // 3. Safe Unlocked Success (Triumphant double beat)
  safeUnlocked: () => {
    hapticFeedback.vibrate([60, 50, 100]);
  },

  // 4. Dust wiping / scratching off secret soot layer (Gentle friction buzz)
  dustSweep: () => {
    hapticFeedback.vibrate(12);
  },

  // 5. Secret fully revealed (Satisfying soft pulse)
  secretRevealed: () => {
    hapticFeedback.vibrate([30, 40, 60]);
  },

  // 6. Magnifier lens crossing a secret clue
  lensClueFound: () => {
    hapticFeedback.vibrate(20);
  },

  // 7. Rubber stamp pressed onto paper
  stampThud: () => {
    hapticFeedback.vibrate([35, 30, 20]);
  },

  // 8. Vintage telephone ringtone vibration cadence
  telephoneRing: () => {
    hapticFeedback.vibrate([200, 100, 200, 800]);
  },
};
