import React, { useState, useEffect, useMemo } from 'react';

// Helper component for the brand logo
const LogoIcon: React.FC = () => (
    <div className="relative mb-8">
        <img
            src="brand-icon.png.webp"
            alt="Hybridus Tarot Logo"
            className="w-40 h-40 md:w-48 md:h-48 object-contain relative z-10 rounded-lg"
        />
        <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full animate-pulse"></div>
    </div>
);


// Translations for different languages
const translations = {
  th: {
    title: 'Hybridus Tarot ปิดปรับปรุง',
    subtitle: 'ขออภัยในความไม่สะดวก ขณะนี้เรากำลังปรับปรุงระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น',
    comingSoonTitle: 'Coming Soon!',
    comingSoonBody: 'เราจะกลับมาอีกครั้งกับ Hybridus Tarot ในเวอร์ชั่นใหม่ พร้อมการทำนายดวงชะตาจากไพ่ทาโรต์สุดแม่นยำ เตรียมพบกับโชคชะตาของคุณได้เร็วๆ นี้!',
    footer: 'สงวนลิขสิทธิ์',
  },
  en: {
    title: 'Hybridus Tarot Under Maintenance',
    subtitle: 'We apologize for the inconvenience. We are currently improving our system for a better experience.',
    comingSoonTitle: 'Coming Soon!',
    comingSoonBody: 'We will be back with Hybridus Tarot in a new version, featuring accurate Tarot card predictions. Get ready to discover your destiny soon!',
    footer: 'All Rights Reserved.',
  },
  my: {
    title: 'Hybridus Tarot ပြုပြင်ထိန်းသိမ်းနေသည်',
    subtitle: 'အဆင်မပြေမှုအတွက် တောင်းပန်အပ်ပါသည်။ ပိုမိုကောင်းမွန်သောအတွေ့အကြုံအတွက် ကျွန်ုပ်တို့၏စနစ်ကို အဆင့်မြှင့်တင်နေပါသည်။',
    comingSoonTitle: 'မကြာမီလာမည်!',
    comingSoonBody: 'Hybridus Tarot ၏ ဗားရှင်းအသစ်ဖြင့် ကျွန်ုပ်တို့ပြန်လည်ရောက်ရှိလာမည်ဖြစ်ပြီး တိကျသော Tarot ကတ်များဖြင့် ဗေဒင်ဟောကိန်းများပါဝင်မည်ဖြစ်ပါသည်။ သင်၏ကံကြမ္မာကို မကြာမီရှာဖွေတွေ့ရှိရန် အသင့်ပြင်ထားပါ။',
    footer: 'မူပိုင်ခွင့်များရယူပြီး။',
  }
};

const languages = Object.keys(translations) as Array<keyof typeof translations>;

// Component to render the animated text content
interface TextContentProps {
    content: typeof translations[keyof typeof translations];
    isFading: boolean;
}

const TextContent: React.FC<TextContentProps> = ({ content, isFading }) => {
    const animationClasses = `transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`;
    
    // Using min-height helps prevent layout shifts during content changes
    return (
        <div className={`${animationClasses} flex flex-col items-center`}>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-amber-200/90 mb-4 tracking-wider text-center min-h-[4rem] md:min-h-[4.5rem] flex items-center justify-center">
                {content.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-8 text-center min-h-[6rem] flex items-center justify-center">
                {content.subtitle}
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold font-display text-amber-300 mb-2 text-center min-h-[2.5rem] flex items-center justify-center">
                    {content.comingSoonTitle}
                </h2>
                <p className="text-gray-200 text-center min-h-[8rem] flex items-center justify-center">
                    {content.comingSoonBody}
                </p>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [langIndex, setLangIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Set an interval to cycle through languages
    const languageInterval = setInterval(() => {
      setIsFading(true); // Trigger the fade-out effect

      // Wait for fade-out to complete, then change language and fade back in
      setTimeout(() => {
        setLangIndex(prevIndex => (prevIndex + 1) % languages.length);
        setIsFading(false); // Trigger the fade-in effect
      }, 500); // This must match the CSS transition duration

    }, 8000); // Change language every 8 seconds (7.5s visible + 0.5s fade)

    // Clear the interval when the component is unmounted to prevent memory leaks
    return () => clearInterval(languageInterval);
  }, []);

  // Memoize the current content to avoid re-calculating on every render
  const currentContent = useMemo(() => translations[languages[langIndex]], [langIndex]);
  const currentFooter = useMemo(() => `© ${new Date().getFullYear()} Hybridus Tarot. ${currentContent.footer}`, [currentContent]);
  const footerAnimationClasses = `transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`;


  return (
    <main className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white min-h-screen flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        <div className="animate-fade-in-up flex flex-col items-center">
            
            <LogoIcon />
            
            <TextContent content={currentContent} isFading={isFading} />

            <footer className="mt-16 text-sm text-gray-500 min-h-[1.25rem]">
                <p className={footerAnimationClasses}>{currentFooter}</p>
            </footer>

        </div>
    </main>
  );
};

export default App;
