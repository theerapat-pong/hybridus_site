import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { QRCodeComponent } from './QRCodeComponent';
import type { MahaboteResult, HoroscopeSections, ChatMessage, UserInfo, ChatState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { generateRandomAmount, generatePromptPayPayload, verifySlip } from '../services/paymentService';
import { UploadIcon } from './Icons';

// Component for a single message bubble
const MessageBox: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
           <span className="text-lg" role="img" aria-label="Astrologer Icon">🔮</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-amber-800/60 text-amber-50 rounded-br-none'
            : 'bg-slate-700/80 text-amber-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
};

// Typing indicator component
const TypingIndicator: React.FC<{ t: (key: string) => string }> = ({ t }) => (
    <div className="flex items-end gap-2 justify-start">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
           <span className="text-lg" role="img" aria-label="Astrologer Icon">🔮</span>
        </div>
        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-slate-700/80 text-amber-100 rounded-bl-none">
            <div className="flex items-center gap-1">
                <span className="text-amber-300">{t('chatTyping')}</span>
                <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);


interface ChatInterfaceProps {
  result: MahaboteResult;
  horoscope: HoroscopeSections;
  userInfo: UserInfo;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ result, horoscope, userInfo }) => {
  const { t, lang } = useLanguage();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Payment flow state
  const [chatState, setChatState] = useState<ChatState>('locked');
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [paymentQRData, setPaymentQRData] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const uploadSlipRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const fullName = `${userInfo.firstName} ${userInfo.middleName || ''} ${userInfo.lastName}`.trim();
    const genderText = {
        my: { male: 'ကျား', female: 'မ', other: 'အခြား' },
        th: { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' }
    };
    
    const systemInstructionTemplates = {
        my: `သင်သည် တိုက်ရိုက်၊ တိကျစွာ ဟောပြောတတ်သော မဟာဘုတ်ဗေဒင်ဆရာမကြီးတစ်ဦးဖြစ်သည်။ သင်သည် အောက်ပါအချက်အလက်များအပေါ် အခြေခံ၍ အသုံးပြုသူအတွက် ဟောစာတမ်းတစ်ခုကို ပေးခဲ့ပြီးဖြစ်သည်။

- အမည်: ${fullName}
- ကျား/မ: ${genderText.my[userInfo.gender]}
- မွေးနေ့: ${result.dayInfo.name.my}
- အကျဉ်းချုပ်ဟောစာတမ်း:
  - အထူးသတိပေးချက်: ${horoscope.warning}
  - စရိုက်: ${horoscope.personality}
  - စီးပွားရေး: ${horoscope.career}
  - အချစ်ရေး: ${horoscope.love}
  - ကျန်းမာရေး: ${horoscope.health}
  - အကြံဉာဏ်: ${horoscope.advice}

ယခု အသုံးပြုသူသည် သင့်ထံသို့ မေးခွန်းများမေးမြန်းလာမည်ဖြစ်သည်။
သင်၏တာဝန်မှာ- သင်၏အဖြေများသည် တိုတုတ်၊ တိကျပြီး တိုက်ရိုက်ဖြစ်ရမည်။ အသုံးပြုသူကို ကလေးတစ်ယောက်လို ဆက်ဆံခြင်းကို ရှောင်ကြဉ်ပါ။ သူတို့၏မေးခွန်းများကို ရိုးသားစွာနှင့် တိုက်ရိုက်ဖြေဆိုပါ၊ အဖြေသည် ကြမ်းတမ်းသည်ဟု ထင်ရလျှင်ပင် ဖြေဆိုပါ။ သင်၏အလုပ်မှာ အမှန်တရားကို ပြောရန်ဖြစ်ပြီး အားပေးစကားချည်း ပြောရန်မဟုတ်ပါ။`,
        th: `คุณคือโหรหญิงพม่าผู้เชี่ยวชาญด้านมหาโปตะที่พูดจาตรงไปตรงมาและมีประสบการณ์สูง คุณได้ให้คำทำนายแก่ผู้ใช้โดยอิงจากข้อมูลต่อไปนี้:

- ชื่อ: ${fullName}
- เพศ: ${genderText.th[userInfo.gender]}
- วันเกิด: ${result.dayInfo.name.th}
- คำทำนายสรุป:
  - คำเตือนพิเศษ: ${horoscope.warning}
  - นิสัย: ${horoscope.personality}
  - การงาน: ${horoscope.career}
  - ความรัก: ${horoscope.love}
  - สุขภาพ: ${horoscope.health}
  - คำแนะนำ: ${horoscope.advice}

ตอนนี้ผู้ใช้จะเริ่มถามคำถามกับคุณ
หน้าที่ของคุณคือ: คำตอบของคุณต้องกระชับ ตรงไปตรงมา และไม่อ้อมค้อม หลีกเลี่ยงการปลอบประโลมที่ยืดเยื้อ ตอบคำถามอย่างตรงไปตรงมาตามหลักโหราศาสตร์ แม้ว่าคำตอบนั้นอาจจะไม่ใช่สิ่งที่ผู้ใช้อยากได้ยินก็ตาม หน้าที่ของคุณคือการเป็นโหรที่ให้ความจริง ไม่ใช่เพียงแค่ผู้ให้กำลังใจ`
    };

    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstructionTemplates[lang],
      },
    });

    setChat(newChat);
    setMessages([{ role: 'model', text: t('chatInitialMessage') }]);
  }, [result, horoscope, lang, t, userInfo]);

  const sendMessageToApi = async (messageText: string) => {
    if (!chat || chatState !== 'unlocked') return;

    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsSending(true);

    try {
      const response = await chat.sendMessage({ message: userMessage.text });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: ChatMessage = { role: 'model', text: t('errorFetch') };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setChatState('locked'); // Re-lock chat for next question
    }
  };

  const handleStartPayment = () => {
    const amount = generateRandomAmount();
    const payload = generatePromptPayPayload(amount);
    setPaymentAmount(amount);
    setPaymentQRData(payload);
    setPaymentError(null);
    setChatState('awaiting_payment');
  };

  const handleCancelPayment = () => {
    setPaymentAmount(null);
    setPaymentQRData(null);
    setPaymentError(null);
    setChatState('locked');
  };

  const handleSlipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !paymentAmount) return;
      
      setChatState('verifying');
      setPaymentError(null);

      const result = await verifySlip(file, paymentAmount);

      if (result.success) {
          setChatState('unlocked');
      } else {
          const errorMessage = t((result.errorKey || 'errorVerificationFailed') as any, { 
              amount: paymentAmount.toFixed(2) 
          });
          setPaymentError(errorMessage);
          setChatState('awaiting_payment');
      }
      // Reset file input so user can upload the same file again if needed
      if(uploadSlipRef.current) {
        uploadSlipRef.current.value = "";
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSending || !chat) return;
    sendMessageToApi(userInput.trim());
  };

  const renderPaymentFlow = () => {
    const baseButtonStyles = "w-full flex items-center justify-center py-3 px-4 bg-amber-600 text-slate-900 text-base font-bold rounded-lg shadow-md hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50";

    switch(chatState) {
        case 'locked':
            return (
                <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                    <button onClick={handleStartPayment} className={baseButtonStyles}>
                        {t('payToAskButton')}
                    </button>
                </div>
            );

        case 'awaiting_payment':
            return (
                <div className="p-4 bg-slate-900/70 rounded-lg border border-amber-600/30 flex flex-col items-center gap-4 animate-fade-in">
                    <h4 className="font-bold text-amber-200 text-lg">{t('paymentForChat')}</h4>
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        {paymentQRData && <QRCodeComponent value={paymentQRData} size={160} level="M" />}
                    </div>
                    <div className="text-center">
                        <p className="text-amber-200/80 text-sm">{t('amountToPay')}</p>
                        <p className="text-amber-50 font-bold text-2xl tracking-wider">{paymentAmount?.toFixed(2)} THB</p>
                    </div>
                     <p className="text-amber-200 text-center text-sm">{t('paymentInstruction', { amount: paymentAmount?.toFixed(2) })}</p>
                    
                    <input type="file" accept="image/*" ref={uploadSlipRef} onChange={handleSlipUpload} className="hidden" />
                    <button onClick={() => uploadSlipRef.current?.click()} className={`${baseButtonStyles} w-full md:w-auto`}>
                        <UploadIcon /> {t('uploadSlipButton')}
                    </button>
                    
                    {paymentError && <p className="text-red-400 text-center animate-fade-in">{paymentError}</p>}

                    <button onClick={handleCancelPayment} className="text-sm text-amber-300/70 hover:text-amber-300 transition-colors">
                        {t('cancelPayment')}
                    </button>
                </div>
            );
            
        case 'verifying':
            return (
                <div className="p-4 bg-slate-900/50 rounded-lg text-center flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-amber-200 font-semibold">{t('verifyingSlip')}</span>
                </div>
            );

        case 'unlocked':
            return (
                 <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={t('chatPlaceholder')}
                        disabled={isSending}
                        className="flex-grow p-3 bg-slate-900/70 border border-amber-600/50 rounded-md text-amber-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition disabled:opacity-50"
                        aria-label={t('chatPlaceholder')}
                    />
                    <button
                        type="submit"
                        disabled={isSending || !userInput.trim()}
                        className="py-3 px-6 bg-amber-600 text-slate-900 font-bold rounded-lg shadow-md hover:bg-amber-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                        aria-label={t('chatSendButton')}
                    >
                        {t('chatSendButton')}
                    </button>
                </form>
            )
        default:
             return null;
    }
  }


  return (
      <div className="mt-8 border-t-2 border-amber-500/20 pt-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <h3 className="text-2xl font-semibold text-amber-200 mb-4 text-center">{t('chatTitle')}</h3>
        
        <div className="relative">
            <div className="h-80 max-h-[60vh] bg-slate-900/70 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto border border-amber-600/20 shadow-inner">
            {messages.map((msg, index) => (
                <MessageBox key={index} message={msg} />
            ))}
            {isSending && <TypingIndicator t={t} />}
            <div ref={messagesEndRef} />
            </div>
        </div>
        
        <div className="mt-4">
            {renderPaymentFlow()}
        </div>
      </div>
  );
};