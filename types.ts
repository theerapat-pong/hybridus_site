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
  houseInfo: House;
  birthDayName: string; // Name in current language
  houseName: string; // Name in current language
  gregorianYear: number;
  burmeseYear: number;
}

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}