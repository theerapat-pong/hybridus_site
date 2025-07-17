import { GoogleGenAI, Type } from "@google/genai";
import { DAYS_OF_WEEK, HOUSES } from '../constants';
import type { MahaboteResult, HoroscopeSections } from '../types';
import type { Language } from '../i18n';

const BURMESE_ERA_OFFSET = 638;
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Calculates the Mahabote details based on birth date and language.
 * @param birthDate - The user's date of birth.
 * @param isWednesdayAfternoon - True if born on Wednesday afternoon (Rahu).
 * @param lang - The selected language ('my' or 'th').
 * @returns The calculated Mahabote result in the specified language.
 */
export const calculateMahabote = (birthDate: Date, isWednesdayAfternoon: boolean, lang: Language): MahaboteResult => {
  let dayOfWeekIndex = birthDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Adjust for Wednesday split
  if (dayOfWeekIndex === 3 && isWednesdayAfternoon) {
    dayOfWeekIndex = 4; // Rahu
  } else if (dayOfWeekIndex > 3) {
      // Shift Thursday, Friday, Saturday to make space for Rahu
      dayOfWeekIndex++;
  }
  
  const gregorianYear = birthDate.getFullYear();
  const burmeseYear = gregorianYear - BURMESE_ERA_OFFSET;
  
  const houseIndex = burmeseYear % 7;
  
  const dayInfo = DAYS_OF_WEEK[dayOfWeekIndex];
  const houseInfo = HOUSES[houseIndex];

  if (!dayInfo || !houseInfo) {
      throw new Error("Invalid date or calculation error.");
  }
  
  return {
    dayInfo: dayInfo,
    houseInfo: houseInfo,
    birthDayName: dayInfo.name[lang],
    houseName: houseInfo.name[lang],
    gregorianYear: gregorianYear,
    burmeseYear: burmeseYear
  };
};

/**
 * Generates a horoscope reading using the Gemini API in the specified language.
 * @param result - The Mahabote calculation result.
 * @param lang - The language for the horoscope ('my' or 'th').
 * @returns A promise that resolves to the structured horoscope object.
 */
export const getHoroscopeReading = async (result: MahaboteResult, lang: Language): Promise<HoroscopeSections> => {
  const model = "gemini-2.5-flash";

  const schemaDescriptions = {
    my: {
      warning: "အသုံးပြုသူ၏ ကံကြမ္မာတွင် အရေးကြီးသော သတိပေးချက် သို့မဟုတ် ထိုးထွင်းသိမြင်မှု။ ဥပမာ၊ ကျန်းမာရေး သတိပေးချက်များ၊ ဖြစ်နိုင်ချေရှိသော အန္တရာယ်များ၊ သို့မဟုတ် အရေးတကြီး အကြံဉာဏ်။ ဤအရာသည် တိုက်ရိုက်ဖြစ်ပြီး အရေးယူရန် လှုံ့ဆော်သင့်သည်။",
      personality: "အထွေထွေ စရိုက်လက္ခဏာများ။",
      career: "အလုပ်အကိုင်နှင့် ငွေကြေးအလားအလာ။",
      love: "အချစ်ရေးနှင့် ဆက်ဆံရေးဆိုင်ရာ အကြံပြုချက်။",
      health: "ကျန်းမာရေးဆိုင်ရာ အကြံပြုချက်။",
      advice: "ဆောင်ရန်၊ ရှောင်ရန်၊ ကံကောင်းစေသည့်အရာများ။"
    },
    th: {
      warning: "คำเตือนที่สำคัญที่สุดหรือข้อมูลเชิงลึกเกี่ยวกับดวงชะตาของผู้ใช้ อาจเป็นความเสี่ยงด้านสุขภาพ การเงิน หรือความสัมพันธ์ ควรเป็นข้อความที่ตรงไปตรงมาและกระตุ้นให้เกิดการตระหนักรู้",
      personality: "ลักษณะนิสัยโดยทั่วไป",
      career: "แนวโน้มด้านอาชีพและการเงิน",
      love: "คำแนะนำด้านความรักและความสัมพันธ์",
      health: "คำแนะนำด้านสุขภาพ",
      advice: "สิ่งที่ควรทำ, สิ่งที่ควรหลีกเลี่ยง, สิ่งเสริมดวง"
    }
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      warning: { type: Type.STRING, description: schemaDescriptions[lang].warning },
      personality: { type: Type.STRING, description: schemaDescriptions[lang].personality },
      career: { type: Type.STRING, description: schemaDescriptions[lang].career },
      love: { type: Type.STRING, description: schemaDescriptions[lang].love },
      health: { type: Type.STRING, description: schemaDescriptions[lang].health },
      advice: { type: Type.STRING, description: schemaDescriptions[lang].advice }
    },
    required: ["warning", "personality", "career", "love", "health", "advice"]
  };
  
  const promptTemplates = {
      my: `သင်သည် မဟာဘုတ်ဗေဒင်ပညာတွင် အထူးကျွမ်းကျင်သော မြန်မာဗေဒင်ဆရာမကြီးတစ်ဦးဖြစ်သည်။ သင်၏ဟောကြားချက်များသည် တိကျပြီး တိုက်ရိုက်ကျသည်။

အသုံးပြုသူ၏ အချက်အလက်များ:
- မွေးနေ့: ${result.dayInfo.name.my} (${result.dayInfo.planet.my} ဂြိုလ်, ${result.dayInfo.animal.my} တိရစ္ဆာန်)
- မဟာဘုတ်ဘုခ်: ${result.houseInfo.name.my} (${result.houseInfo.meaning.my})
- တွက်ချက်သည့်နှစ်: ခရစ်နှစ် ${result.gregorianYear} မှ မြန်မာသက္ကရာဇ် ${result.burmeseYear} သို့ ပြောင်း။

လမ်းညွှန်ချက်များ:
1.  **ဟောကြားသည့်လေသံ:** သင်၏လေသံသည် တိုက်ရိုက်၊ ရှင်းလင်းပြီး အတွေ့အကြုံရင့်ကျက်သော ဗေဒင်ဆရာမတစ်ဦးကဲ့သို့ ဖြစ်ရမည်။ ကောင်းသည်ဖြစ်စေ၊ ဆိုးသည်ဖြစ်စေ အမှန်အတိုင်း ဟောကြားပါ။ အားနာစရာမလိုပါ။ သင်၏ရည်ရွယ်ချက်မှာ အမှန်တရားကိုဖော်ပြပြီး လက်တွေ့ကျသောအကြံဉာဏ်များပေးရန်ဖြစ်သည်။
2.  **အရေးကြီးဆုံးအပိုင်း (Warning):** အသုံးပြုသူ၏ကံကြမ္မာမှ အရေးကြီးဆုံးသော သတိပေးချက် သို့မဟုတ် ထိုးထွင်းသိမြင်မှုတစ်ခုကို ဖော်ထုတ်ပါ။ ၎င်းသည် ကျန်းမာရေး၊ ဘဏ္ဍာရေး၊ သို့မဟုတ် ဆက်ဆံရေးဆိုင်ရာ အန္တရာယ်တစ်ခု ဖြစ်နိုင်သည်။ တိုက်ရိုက်၊ ရိုးသားပြီး အပိုအလိုမရှိ ပြောပါ။
3.  **အသေးစိတ်ကဏ္ဍများ:** JSON schema ကို အသေးစိတ်ဟောကိန်းများဖြင့် ကဏ္ဍတစ်ခုစီအတွက် ဖြည့်စွက်ပါ။ JSON field များအတွင်းရှိ အဖြေအားလုံးသည် မြန်မာစာဖြင့်သာဖြစ်ရမည်။`,
      th: `คุณคือโหรหญิงผู้เชี่ยวชาญด้านโหราศาสตร์มหาโปตะของพม่าที่มีประสบการณ์สูง คำทำนายของคุณขึ้นชื่อเรื่องความแม่นยำและตรงไปตรงมา

ข้อมูลผู้ใช้:
- วันเกิด: ${result.dayInfo.name.th} (ดาวเคราะห์ ${result.dayInfo.planet.th}, สัตว์สัญลักษณ์ ${result.dayInfo.animal.th})
- ภพมหาโปตะ: ${result.houseInfo.name.th} (ความหมาย: ${result.houseInfo.meaning.th})
- ปีที่ใช้คำนวณ: แปลงจาก ค.ศ. ${result.gregorianYear} เป็น จ.ศ. ${result.burmeseYear}

คำแนะนำ:
1.  **โทนการทำนาย:** โทนของคุณต้องตรงไปตรงมา ไม่อ้อมค้อม เหมือนโหรหญิงผู้มีประสบการณ์สูงที่พูดตามความเป็นจริง ไม่จำเป็นต้องเน้นแต่ด้านบวกเพียงอย่างเดียว หากมีเรื่องต้องเตือนให้เตือนอย่างตรงไปตรงมา เป้าหมายของคุณคือการให้ข้อมูลที่จริงแท้และคำแนะนำที่นำไปใช้ได้จริง
2.  **ส่วนที่สำคัญที่สุด (Warning):** ให้ระบุคำเตือนหรือข้อมูลเชิงลึกที่สำคัญที่สุดจากดวงชะตาของผู้ใช้ อาจเป็นความเสี่ยงด้านสุขภาพ การเงิน หรือความสัมพันธ์ ขอให้พูดอย่างตรงไปตรงมา ซื่อสัตย์ และไม่อ้อมค้อม
3.  **หมวดหมู่ chi tiết:** กรุณากรอกข้อมูลใน JSON schema ด้วยคำทำนายที่ละเอียดสำหรับแต่ละหมวดหมู่ การตอบสนองทั้งหมดในฟิลด์ JSON ต้องเป็นภาษาไทยเท่านั้น`
  }

  const prompt = promptTemplates[lang];

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });
    
    const horoscopeData = JSON.parse(response.text);
    
    if (horoscopeData.warning && horoscopeData.personality && horoscopeData.career && horoscopeData.love && horoscopeData.health && horoscopeData.advice) {
        return horoscopeData as HoroscopeSections;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }
  } catch (error) {
    console.error("Gemini API call failed or returned invalid data:", error);
    throw new Error("Failed to generate or parse horoscope from Gemini API.");
  }
};