export interface TimelineNode {
  id: string;
  stage: 'past' | 'pause' | 'present';
  title: string; // e.g. "Тогда", "Пауза", "Сегодня"
  description: string;
  polaroidCaption?: string;
  polaroidTheme?: 'rain_street' | 'secret_door' | 'clock' | 'letter';
  redactedNotes?: string[];
  isRedactedRevealed?: boolean;
}

export type StampLifecycleStatus = 'received' | 'read' | 'pending';

export interface RubberStamp {
  id: string;
  type: 'approved' | 'read' | 'in_progress' | 'secret' | 'top_secret';
  text: string;
  color: string;
  rotation: number;
  timestamp: string;
  stampedBy: 'author' | 'recipient';
}

export interface ChatMessage {
  id: string;
  sender: 'author' | 'recipient';
  text: string;
  timestamp: string;
  read: boolean;
  // Dynamic Lifecycle Status
  deliveryStatus: StampLifecycleStatus;
  // Special Classified modes
  isSecret?: boolean; // @secret - redacted tape tap to reveal
  isSuperSecret?: boolean; // @super_secret - locked by PIN
  secretPin?: string;
  isUnlocked?: boolean; // if recipient unlocked it
  stamp?: RubberStamp;
  // Rich media attachments (Photos & Voice notes)
  mediaType?: 'photo' | 'voice_note';
  mediaUrl?: string; // base64 / blob / local URL
  mediaCaption?: string;
  voiceDurationSeconds?: number;
  isFinal?: boolean;
}

export interface DossierData {
  id: string;
  token: string; // for recipient URL
  authorKey: string; // for sender management & chat
  caseNumber: string; // "ДЕЛО № 05"
  title: string; // "Одно дело осталось незавершённым"
  invitationText: string; // "Это приглашение - не случайность. Если ты здесь, значит, пора вернуться к истории."
  category: string; // "ЛИЧНОЕ"
  access: string; // "ТОЛЬКО ДЛЯ ТЕБЯ"
  secrecyTab: string; // "ХРАНИТЬ В СЕКРЕТЕ"
  recipientPhone: string;
  senderPhone?: string;
  timeline: TimelineNode[];
  unfinishedList: string[];
  letterHeadline: string; // "ФИНАЛ - ЗА НАМИ"
  letterBody: string[];
  letterClosing: string; // "Если захочешь."
  createdAt: string;
  viewsCount: number;
  maxViews: number;
  burnAfterRead: boolean;
  status: 'active' | 'opened' | 'burned';
  messages: ChatMessage[];
  stamps: RubberStamp[];
  // Smart Privacy Lock
  pinCode?: string;
  isPinLocked?: boolean;
  // New features requested by user
  fontMode?: 'typewriter' | 'handwritten_ink' | 'newspaper_ransom';
  watermarkEnabled?: boolean;
  hasCoffeeStain?: boolean;
  isOtherTyping?: boolean; // Typewriter typing presence
  // VIP Wax Seal & Cassette
  waxSealType?: 'classic_crest' | 'heart_lock' | 'classified_star' | 'skull_noir' | 'custom_initials';
  waxSealInitials?: string;
  waxSealColor?: 'crimson' | 'burgundy' | 'gold_bronze' | 'midnight_blue';
  hasAudioCassette?: boolean;
  cassetteTitle?: string;
  // Secret Match Flame (Invisible Ink)
  secretMatchNote?: string;
  isSecretMatchRevealed?: boolean;
  // Synchronized Secret Open
  syncOpenTime?: string; // e.g. "23:00" or ISO string
  isClearanceGranted?: boolean;
}

export type ViewTab = 'dossier' | 'sender_console' | 'sms_simulator' | 'tech_guide';
export type DossierStep = 'cover' | 'clearance' | 'timeline' | 'letter' | 'chat' | 'verdict' | string;
