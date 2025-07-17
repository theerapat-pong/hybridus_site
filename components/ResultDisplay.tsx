import React from 'react';
import type { MahaboteResult, HoroscopeSections, UserInfo } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatInterface } from './ChatInterface';
import { SectionIcon, WarningIcon } from './Icons';

interface ResultDisplayProps {
  result: MahaboteResult;
  horoscope: HoroscopeSections | null;
  onReset: () => void;
  userInfo: UserInfo;
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
                <WarningIcon />
                <span>{title}</span>
            </h3>
            <div className="whitespace-pre-wrap text-red-100 leading-relaxed text-left opacity-90">
                {content}
            </div>
        </div>
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

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, horoscope, onReset, userInfo }) => {
  const { t, lang } = useLanguage();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
           <InfoCard title={t('infoBirthDay')} value={result.dayInfo.name[lang]} icon={result.dayInfo.icon} subValue={`( ${result.dayInfo.animal[lang]} )`} />
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
                <ChatInterface result={result} horoscope={horoscope} userInfo={userInfo} />
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