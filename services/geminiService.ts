
import { GoogleGenAI, Type } from "@google/genai";
import { DAYS_OF_WEEK } from '../constants';
import type { MahaboteResult, HoroscopeSections, UserInfo, PalmReadingResult } from '../types';
import type { Language } from '../i18n';

// The Burmese New Year (Thingyan) marks the change in the year.
// Before Thingyan, the offset is larger. After, it's smaller.
const BURMESE_YEAR_AD_OFFSET_BEFORE_THINGYAN = 639;
const BURMESE_YEAR_AD_OFFSET_AFTER_THINGYAN = 638;
// Thingyan's date varies but is usually in mid-April. We use a fixed cut-off for simplicity.
const THINGYAN_CUTOFF_MONTH = 3; // April (0-indexed, so 3 is April)
const THINGYAN_CUTOFF_DAY = 17; // April 17th

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
  
  // Adjust for Wednesday split (Rahu)
  if (dayOfWeekIndex === 3 && isWednesdayAfternoon) {
    dayOfWeekIndex = 4; // Rahu
  } else if (dayOfWeekIndex > 3) {
      // Shift Thursday, Friday, Saturday to make space for Rahu
      dayOfWeekIndex++;
  }
  
  const gregorianYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDayOfMonth = birthDate.getDate();

  // Determine if the birth date is before the Burmese New Year (Thingyan)
  const isBeforeThingyan = birthMonth < THINGYAN_CUTOFF_MONTH || (birthMonth === THINGYAN_CUTOFF_MONTH && birthDayOfMonth < THINGYAN_CUTOFF_DAY);

  // Calculate the Burmese Year based on the timing relative to Thingyan for accuracy
  const burmeseYear = isBeforeThingyan 
    ? gregorianYear - BURMESE_YEAR_AD_OFFSET_BEFORE_THINGYAN 
    : gregorianYear - BURMESE_YEAR_AD_OFFSET_AFTER_THINGYAN;
  
  const dayInfo = DAYS_OF_WEEK[dayOfWeekIndex];

  if (!dayInfo) {
      throw new Error("Invalid date or calculation error.");
  }
  
  return {
    dayInfo: dayInfo,
    birthDayName: dayInfo.name[lang],
    gregorianYear: gregorianYear,
    burmeseYear: burmeseYear
  };
};

/**
 * Generates a horoscope reading using the Gemini API in the specified language.
 * @param result - The Mahabote calculation result.
 * @param userInfo - The user's personal information (name, gender).
 * @param lang - The language for the horoscope ('my' or 'th').
 * @returns A promise that resolves to the structured horoscope object.
 */
export const getHoroscopeReading = async (result: MahaboteResult, userInfo: UserInfo, lang: Language): Promise<HoroscopeSections> => {
  const model = "gemini-2.5-flash";
  const fullName = `${userInfo.firstName} ${userInfo.middleName || ''} ${userInfo.lastName}`.trim();
  const genderText = {
      my: { male: 'ကျား', female: 'မ', other: 'အခြား' },
      th: { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' }
  };

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
- အမည်: ${fullName}
- ကျား/မ: ${genderText.my[userInfo.gender]}
- မွေးနေ့: ${result.dayInfo.name.my} (${result.dayInfo.planet.my} ဂြိုလ်, ${result.dayInfo.animal.my} တိရစ္ဆာန်)
- တွက်ချက်သည့်နှစ်: ခရစ်နှစ် ${result.gregorianYear} မှ မြန်မာသက္ကရာဇ် ${result.burmeseYear} သို့ ပြောင်း။

လမ်းညွှန်ချက်များ:
1.  **ဟောကြားသည့်လေသံ:** သင်၏လေသံသည် တိုက်ရိုက်၊ ရှင်းလင်းပြီး အတွေ့အကြုံရင့်ကျက်သော ဗေဒင်ဆရာမတစ်ဦးကဲ့သို့ ဖြစ်ရမည်။ အသုံးပြုသူ၏အမည်နှင့် ကျား/မ အချက်အလက်ကို ထည့်သွင်းစဉ်းစား၍ ဟောကြားချက်ကို ပိုမိုပုဂ္ဂိုလ်ရေးဆန်အောင် ပြုလုပ်ပါ၊ သို့သော် တိုက်ရိုက်ဟောပြောသည့်ဟန်ကို မပြောင်းလဲပါနှင့်။ ကောင်းသည်ဖြစ်စေ၊ ဆိုးသည်ဖြစ်စေ အမှန်အတိုင်း ဟောကြားပါ။ အားနာစရာမလိုပါ။ သင်၏ရည်ရွယ်ချက်မှာ အမှန်တရားကိုဖော်ပြပြီး လက်တွေ့ကျသောအကြံဉာဏ်များပေးရန်ဖြစ်သည်။
2.  **အရေးကြီးဆုံးအပိုင်း (Warning):** အသုံးပြုသူ၏ကံကြမ္မာမှ အရေးကြီးဆုံးသော သတိပေးချက် သို့မဟုတ် ထိုးထွင်းသိမြင်မှုတစ်ခုကို ဖော်ထုတ်ပါ။ ၎င်းသည် ကျန်းမာရေး၊ ဘဏ္ဍာရေး၊ သို့မဟုတ် ဆက်ဆံရေးဆိုင်ရာ အန္တရာယ်တစ်ခု ဖြစ်နိုင်သည်။ တိုက်ရိုက်၊ ရိုးသားပြီး အပိုအလိုမရှိ ပြောပါ။
3.  **အသေးစိတ်ကဏ္ဍများ:** JSON schema ကို အသေးစိတ်ဟောကိန်းများဖြင့် ကဏ္ဍတစ်ခုစီအတွက် ဖြည့်စွက်ပါ။ JSON field များအတွင်းရှိ အဖြေအားလုံးသည် မြန်မာစာဖြင့်သာဖြစ်ရမည်။`,
      th: `คุณคือโหรหญิงผู้เชี่ยวชาญด้านโหราศาสตร์มหาโปตะของพม่าที่มีประสบการณ์สูง คำทำนายของคุณขึ้นชื่อเรื่องความแม่นยำและตรงไปตรงมา

ข้อมูลผู้ใช้:
- ชื่อ: ${fullName}
- เพศ: ${genderText.th[userInfo.gender]}
- วันเกิด: ${result.dayInfo.name.th} (ดาวเคราะห์ ${result.dayInfo.planet.th}, สัตว์สัญลักษณ์ ${result.dayInfo.animal.th})
- ปีที่ใช้คำนวณ: แปลงจาก ค.ศ. ${result.gregorianYear} เป็น จ.ศ. ${result.burmeseYear}

คำแนะนำ:
1.  **โทนการทำนาย:** โทนของคุณต้องตรงไปตรงมา ไม่อ้อมค้อม เหมือนโหรหญิงผู้มีประสบการณ์สูงที่พูดตามความเป็นจริง พิจารณาชื่อและเพศของผู้ใช้เพื่อทำให้คำทำนายมีความเป็นส่วนตัวมากขึ้น แต่ยังคงรักษาสไตล์การพูดที่ตรงไปตรงมา ไม่จำเป็นต้องเน้นแต่ด้านบวกเพียงอย่างเดียว หากมีเรื่องต้องเตือนให้เตือนอย่างตรงไปตรงมา เป้าหมายของคุณคือการให้ข้อมูลที่จริงแท้และคำแนะนำที่นำไปใช้ได้จริง
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

/**
 * Converts a File object to a generative part for the Gemini API.
 * @param file The file to convert.
 * @returns A promise that resolves with the generative part object.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string } }> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      mimeType: file.type,
      data: await base64EncodedDataPromise,
    }
  };
};

/**
 * Generates a palm reading using the Gemini API.
 * @param imageFile - The image file of the user's palm.
 * @param lang - The language for the reading ('my' or 'th').
 * @returns A promise that resolves to the structured palm reading result.
 */
export const getPalmReading = async (imageFile: File, lang: Language): Promise<PalmReadingResult> => {
  const model = "gemini-2.5-flash";
  const imagePart = await fileToGenerativePart(imageFile);

  const schema = {
    type: Type.OBJECT,
    properties: {
      analysis: {
        type: Type.OBJECT,
        description: "Textual analysis of each major palm line.",
        properties: {
          heart: { type: Type.STRING, description: "Detailed analysis of the Heart Line (love, emotions)." },
          head: { type: Type.STRING, description: "Detailed analysis of the Head Line (intellect, communication)." },
          life: { type: Type.STRING, description: "Detailed analysis of the Life Line (health, vitality)." },
          fate: { type: Type.STRING, description: "Detailed analysis of the Fate Line (career, life path)." },
        },
        required: ['heart', 'head', 'life', 'fate']
      },
      lines: {
        type: Type.ARRAY,
        description: "Array of objects containing the coordinates for the main palm lines.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, enum: ['heart', 'head', 'life', 'fate'], description: "Name of the line: 'heart', 'head', 'life', or 'fate'." },
            points: {
              type: Type.ARRAY,
              description: "An array of normalized {x, y} coordinates tracing the line.",
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER, description: "Normalized x-coordinate (from 0.0 at left to 1.0 at right)." },
                  y: { type: Type.NUMBER, description: "Normalized y-coordinate (from 0.0 at top to 1.0 at bottom)." },
                },
                required: ['x', 'y']
              }
            }
          },
          required: ['name', 'points']
        }
      }
    },
    required: ['analysis', 'lines']
  };

  const promptTemplates = {
    my: `သင်သည် လက်ခဏာပညာတွင် အလွန်တိကျသော AI ဗေဒင်ဆရာတစ်ဦးဖြစ်သည်။ သင်၏ အဓိကတာဝန်မှာ ပေးထားသော လက်ဖဝါးဓာတ်ပုံကို ခွဲခြမ်းစိတ်ဖြာပြီး အောက်ပါ JSON schema အတိုင်း တိကျစွာ ပြန်လည်ဖြေကြားရန်ဖြစ်သည်:

1.  **လမ်းကြောင်းများကို တိကျစွာ ရှာဖွေပါ:** ဓာတ်ပုံထဲမှ အဓိကလမ်းကြောင်း (၄)ခု - နှလုံးလမ်းကြောင်း (heart), ဦးခေါင်းလမ်းကြောင်း (head), အသက်လမ်းကြောင်း (life), နှင့် ကံလမ်းကြောင်း (fate) - ကို **အမြင့်ဆုံး တိကျမှုဖြင့်** ရှာဖွေပါ။
    -   **နှလုံးလမ်းကြောင်း:** များသောအားဖြင့် လက်ဖဝါးအပေါ်ပိုင်းတွင် ကန့်လန့်ဖြတ်တည်ရှိသည်။
    -   **ဦးခေါင်းလမ်းကြောင်း:** များသောအားဖြင့် နှလုံးလမ်းကြောင်းအောက်တွင် စတင်သည်။
    -   **အသက်လမ်းကြောင်း:** များသောအားဖြင့် လက်မ၏ အောက်ခြေကို ဝိုက်ပတ်နေသည်။
    -   **ကံလမ်းကြောင်း:** များသောအားဖြင့် လက်ဖဝါးအောက်ခြေမှ အပေါ်သို့ ဒေါင်လိုက်တက်သွားသည်။ (မชัดเจนပါက ထည့်ရန်ไม่จำเป็น)
2.  **พิกัดများကို မှတ်သားပါ:** လမ်းကြောင်းတစ်ခုစီ၏ အကွေးအကောက်အတိုင်း တိကျစွာလိုက်ရန်အတွက် အနည်းဆုံး **အမှတ် ၁၀ ခု** ပေးပါ။ พิกัดများသည် (0.0 မှ 1.0) အတွင်းရှိ normalized coordinate ဖြစ်ရမည်။ (0,0) သည် ပုံ၏ ဘယ်ဘက်အပေါ်ထောင့်ဖြစ်ပြီး (1,1) သည် ညာဘက်အောက်ထောင့်ဖြစ်သည်။ **ပုံထဲတွင် မชัดเจนသော သို့မဟုတ် မမြင်နိုင်သော လမ်းကြောင်းများကို မှန်းဆပြီး မထည့်ပါနှင့်။**
3.  **အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာပါ:** သင်ရှာတွေ့သော လမ်းကြောင်းတစ်ခုစီ၏ အဓိပ္ပာယ်ကို အသေးစိတ်ခွဲခြမ်းစိတ်ဖြာပါ။ သင်၏ဟောကြားချက်သည် လေးနက်မှုရှိပြီး ထိုးထွင်းသိမြင်မှုရှိပါစေ။
4.  **JSON ဖြင့် ဖြေကြားပါ:** အဖြေทั้งหมดကို သတ်မှတ်ထားသော JSON format ဖြင့်သာ ပြန်လည်ဖြေကြားပါ။ အဖြေทั้งหมด မြန်မာဘာသာဖြင့် ဖြစ်ရမည်။`,
    th: `คุณคือ AI โหรผู้เชี่ยวชาญด้านการพยากรณ์ลายมือ (Palmistry) ที่มีความแม่นยำสูงยิ่งยวด หน้าที่สำคัญที่สุดของคุณคือวิเคราะห์ภาพฝ่ามือที่ได้รับและตอบกลับในรูปแบบ JSON ที่กำหนดไว้อย่างเคร่งครัด:

1.  **ระบุเส้นลายมือให้แม่นยำที่สุด:** ค้นหาเส้นลายมือหลัก 4 เส้นในภาพ: เส้นใจ (heart), เส้นสมอง (head), เส้นชีวิต (life), และเส้นวาสนา (fate) ด้วยความแม่นยำสูงสุด
    -   **เส้นใจ (Heart):** โดยทั่วไปจะวิ่งในแนวนอนบริเวณด้านบนของฝ่ามือ
    -   **เส้นสมอง (Head):** โดยทั่วไปจะเริ่มใกล้กับเส้นชีวิตและวิ่งข้ามฝ่ามือไป
    -   **เส้นชีวิต (Life):** โดยทั่วไปจะโค้งรอบฐานของนิ้วหัวแม่มือ
    -   **เส้นวาสนา (Fate):** โดยทั่วไปจะวิ่งในแนวตั้งจากฐานของฝ่ามือขึ้นไป (หากไม่ชัดเจน ไม่จำเป็นต้องใส่)
2.  **ระบุพิกัดอย่างละเอียด:** สำหรับแต่ละเส้น ให้สร้างชุดของพิกัด (coordinates) แบบ normalized (ค่าระหว่าง 0.0 ถึง 1.0) ที่ลากตามเส้นนั้นๆ **อย่างน้อย 10 จุด** เพื่อให้สามารถลากเส้นโค้งได้สมจริง (0,0) คือมุมบนซ้าย และ (1,1) คือมุมล่างขวา **หากเส้นใดไม่ชัดเจนหรือไม่ปรากฏในภาพ ห้ามคาดเดาหรือสร้างเส้นขึ้นมาเองเด็ดขาด**
3.  **วิเคราะห์อย่างละเอียด:** เขียนคำทำนายอย่างละเอียดสำหรับแต่ละเส้นที่คุณหาเจอ โปรดให้คำทำนายที่ลึกซึ้งและให้ข้อมูลเชิงลึก บาลานซ์ระหว่างจุดแข็งและคำเตือน
4.  **ตอบกลับเป็น JSON เท่านั้น:** ส่งคำตอบทั้งหมดในรูปแบบ JSON ตาม schema ที่กำหนดเท่านั้น และข้อความทั้งหมดต้องเป็นภาษาไทย`,
  };

  const textPart = { text: promptTemplates[lang] };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const readingData = JSON.parse(response.text);
    // Basic validation
    if (readingData.analysis && readingData.lines) {
        return readingData as PalmReadingResult;
    } else {
        throw new Error("Invalid JSON structure for palm reading received from API.");
    }
  } catch (error) {
    console.error("Gemini API call for palm reading failed:", error);
    throw new Error("Failed to generate palm reading from Gemini API.");
  }
};
