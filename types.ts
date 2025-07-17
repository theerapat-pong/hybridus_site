export interface HoroscopeSections {
  warning: string;
  personality: string;
  career: string;
  love: string;
  health: string;
  advice: string;
}

export interface LanguageMap {
  my: string;
  th: string;
}

export interface DayOfWeek {
  name: LanguageMap;
  animal: LanguageMap;
  planet: LanguageMap;
  icon: string;
}

export interface House {
  name: LanguageMap;
  meaning: LanguageMap;
}

export interface MahaboteResult {
  dayInfo: DayOfWeek;
  birthDayName: string; // Name in current language
  gregorianYear: number;
  burmeseYear: number;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female' | 'other';
}

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

// Types for Palm Reading
export interface PalmPoint {
  x: number;
  y: number;
}

export interface PalmLine {
  name: 'heart' | 'head' | 'life' | 'fate';
  points: PalmPoint[];
}

export interface PalmLineAnalysis {
  heart: string;
  head: string;
  life: string;
  fate: string;
}

export interface PalmReadingResult {
  lines: PalmLine[];
  analysis: PalmLineAnalysis;
}

// For page navigation
export type Page = 'main' | 'terms' | 'privacy' | 'cookie';