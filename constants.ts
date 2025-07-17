
import type { DayOfWeek } from './types';

export const DAYS_OF_WEEK: { [key: number]: DayOfWeek } = {
  0: { name: { my: 'တနင်္ဂနွေ', th: 'วันอาทิตย์' }, animal: { my: 'ဂဠုန်', th: 'ครุฑ' }, planet: { my: 'နေ', th: 'อาทิตย์' }, icon: '☀️' },
  1: { name: { my: 'တနင်္လာ', th: 'วันจันทร์' }, animal: { my: 'ကျား', th: 'เสือ' }, planet: { my: 'လ', th: 'จันทร์' }, icon: '🌙' },
  2: { name: { my: 'အင်္ဂါ', th: 'วันอังคาร' }, animal: { my: 'ခြင်္သေ့', th: 'สิงห์' }, planet: { my: 'အင်္ဂါ', th: 'อังคาร' }, icon: '🦁' },
  3: { name: { my: 'ဗုဒ္ဓဟူး', th: 'วันพุธ' }, animal: { my: 'ဆင်', th: 'ช้าง' }, planet: { my: 'ဗုဒ္ဓဟူး', th: 'พุธ' }, icon: '🐘' },
  4: { name: { my: 'ရာဟု', th: 'ราหู' }, animal: { my: 'ဟိုင်း', th: 'ช้างไม่มีงา' }, planet: { my: 'ရာဟု', th: 'ราหู' }, icon: '🐘' }, // Wednesday Afternoon
  5: { name: { my: 'ကြာသပတေး', th: 'วันพฤหัสบดี' }, animal: { my: 'ကြွက်', th: 'หนู' }, planet: { my: 'ကြာသပတေး', th: 'พฤหัสบดี' }, icon: '🐭' },
  6: { name: { my: 'သောကြာ', th: 'วันศุกร์' }, animal: { my: 'ပူး', th: 'หนูตะเภา' }, planet: { my: 'သောကြာ', th: 'ศุกร์' }, icon: '🐹' },
  7: { name: { my: 'စနေ', th: 'วันเสาร์' }, animal: { my: 'နဂါး', th: 'นาค' }, planet: { my: 'စနေ', th: 'เสาร์' }, icon: '🐉' }
};
