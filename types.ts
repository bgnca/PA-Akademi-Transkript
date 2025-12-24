
export interface TranscriptSegment {
  id: number;
  speaker: string;
  text: string;
  timestamp: string; // "MM:SS" format
  isUnclear?: boolean;
}

export interface TranscriptionResult {
  segments: TranscriptSegment[];
  fullText: string;
}

export enum AudioSourceType {
  FILE_UPLOAD = 'FILE_UPLOAD'
}

export interface AudioData {
  blob: Blob;
  url: string;
  type: AudioSourceType;
  fileName?: string;
  duration?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

export interface ScaleRecord {
  id: string;
  clientAlias: string;
  date: string;
  name: string; // e.g. "Beck Depresyon Envanteri"
  score: number;
  maxScore?: number; // Optional reference
  interpretation?: string; // AI or manual note
  nextScheduledDate?: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  title: string;
  clientAlias?: string; // Danışan Rumuzu
  sessionNumber?: string; // Kaçıncı Seans
  duration: number;
  transcript: string | TranscriptSegment[]; // Can be legacy string or new JSON structure
  report?: string;
  critique?: string;
  critiqueApproach?: string;
  bulkAnalysisId?: string; // If this session was part of a bulk analysis
}

export type PlanType = 'Free' | 'Giriş' | 'Standart' | 'Gelişmiş' | string; // Extended string to allow custom plans

export interface PlanConfig {
  id: string;
  name: string;
  type: PlanType;
  minutes: number;
  price: string;
  features: string[];
  color: string; // Tailwind class string
  icon: 'Zap' | 'Star' | 'Crown';
  recommended?: boolean;
  campaign?: {
    active: boolean;
    discountText: string; // e.g. "%20 İndirim"
    validUntil?: string; // YYYY-MM-DD
  };
}

export interface UserCredits {
  plan: PlanType;
  remainingSeconds: number;
  totalSeconds: number;
}

// New Types for Productization
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  plan: PlanType;
  avatar?: string;
  joinedDate?: string;
}

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}
