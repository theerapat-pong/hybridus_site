import React from 'react';
import type { MahaboteResult, HoroscopeSections } from '../types';
import type { Language } from '../i18n';
import { ChatInterface } from './ChatInterface';

interface ResultDisplayProps {
  result: MahaboteResult;
  horoscope: HoroscopeSections | null;
  onReset: () => void;
  t: (key: string) => string;
  lang: Language;
}

const InfoCard: React.FC<{ title: string; value: string; icon?: string; subValue?: string }> = ({ title, value, icon, subValue }) => (
    <div className="flex-1 p-4 bg-slate-900/50 rounded-lg border border-amber-600/30 text-center flex flex-col justify-center h-full">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">{title}</h3>
        <p className="text-xl font-bold text-amber-50 mt-1">{icon} {value}</p>
        {subValue && <p className="text-xs text-amber-200/70 mt-1">{subValue}</p>}
    </div>
);

const WarningSection: React.FC<{ title: string; content: string; }> = ({ title, content }) => {
    return (
        <div 
          className="bg-red-900/40 rounded-lg border-2 border-red-500/50 p-5 my-8 animate-fade-in-up shadow-lg shadow-red-900/30"
          style={{ animationDelay: '100ms' }}
        >
            <h3 className="text-xl font-semibold text-red-200 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 inline-block mr-3 text-red-300/80">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{title}</span>
            </h3>
            <div className="whitespace-pre-wrap text-red-100 leading-relaxed text-left opacity-90">
                {content}
            </div>
        </div>
    );
};


const SectionIcon: React.FC<{ type: keyof Omit<HoroscopeSections, 'warning'> }> = ({ type }) => {
    let path = <></>;
    switch (type) {
        case 'personality':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />;
            break;
        case 'career':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25v-4.07m2.25-4.22a2.25 2.25 0 012.25-2.25h3v-2.25a2.25 2.25 0 012.25-2.25h3.75a2.25 2.25 0 012.25 2.25v2.25h3a2.25 2.25 0 012.25 2.25m-15-4.22l.01-.001M18 10.5l.01-.001" />;
            break;
        case 'love':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />;
            break;
        case 'health':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />;
            break;
        case 'advice':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.518a.562.562 0 01.32.959l-4.48 3.26a.563.563 0 00-.182.635l1.703 5.242a.562.562 0 01-.812.622l-4.48-3.26a.563.563 0 00-.676 0l-4.48 3.26a.562.562 0 01-.812-.622l1.703-5.242a.563.563 0 00-.182-.635l-4.48-3.26a.562.562 0 01.32-.959h5.518a.563.563 0 00.475-.345L11.48 3.5z" />;
            break;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block mr-3 align-text-bottom text-amber-300/80">
            {path}
        </svg>
    );
};

const HoroscopeSection: React.FC<{ title: string; content: string; iconType: keyof Omit<HoroscopeSections, 'warning'>, index: number }> = ({ title, content, iconType, index }) => {
    return (
        <div 
          className="bg-slate-900/60 rounded-lg border border-amber-600/20 p-5 animate-fade-in-up"
          style={{ animationDelay: `${index * 120}ms` }}
        >
            <h3 className="text-xl font-semibold text-amber-200 mb-3 flex items-center">
                <SectionIcon type={iconType} />
                <span>{title}</span>
            </h3>
            <div className="whitespace-pre-wrap text-amber-50 leading-relaxed text-left opacity-90">
                {content}
            </div>
        </div>
    );
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, horoscope, onReset, t, lang }) => {
  const sections = horoscope ? [
      { title: t('sectionPersonality'), content: horoscope.personality, type: 'personality' as const },
      { title: t('sectionCareer'), content: horoscope.career, type: 'career' as const },
      { title: t('sectionLove'), content: horoscope.love, type: 'love' as const },
      { title: t('sectionHealth'), content: horoscope.health, type: 'health' as const },
      { title: t('sectionAdvice'), content: horoscope.advice, type: 'advice' as const },
  ] : [];

  const yearConversionString = t('infoYearCalcContent')
      .replace('{gregorian}', result.gregorianYear.toString())
      .replace('{burmese}', result.burmeseYear.toString());

  return (
    <div className="p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-amber-300">{t('resultTitle')}</h2>
            <p className="text-amber-100/80">{t('resultSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
           <InfoCard title={t('infoBirthDay')} value={result.dayInfo.name[lang]} icon={result.dayInfo.icon} subValue={`( ${result.dayInfo.animal[lang]} )`} />
           <InfoCard title={t('infoHouse')} value={result.houseInfo.name[lang]} subValue={result.houseInfo.meaning[lang]}/>
           <InfoCard title={t('infoYearCalcTitle')} value={yearConversionString} />
        </div>
        
        {horoscope ? (
          <>
            <WarningSection title={t('sectionWarning')} content={horoscope.warning} />
            <div className="border-t-2 border-amber-500/10 my-6"></div>
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-amber-200 mb-2 text-center">{t('horoscopeTitle')}</h3>
                {sections.map((section, index) => (
                    <HoroscopeSection 
                        key={section.type} 
                        title={section.title}
                        content={section.content}
                        iconType={section.type}
                        index={index}
                    />
                ))}
                <ChatInterface result={result} horoscope={horoscope} t={t} lang={lang} />
            </div>
          </>
        ) : (
            <div className="text-center text-amber-200 py-8">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-amber-400" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg" fill="none">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                <span>{t('preparingHoroscope')}</span>
              </div>
            </div>
        )}
        
        <div className="text-center mt-8">
            <button
                onClick={onReset}
                className="py-2 px-8 bg-amber-600 text-slate-900 text-base font-bold rounded-lg shadow-md hover:bg-amber-500 transform hover:-translate-y-0.5 transition-all duration-300"
            >
                {t('tryAgainButton')}
            </button>
        </div>
    </div>
  );
};