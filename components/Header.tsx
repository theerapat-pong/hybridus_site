import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LotusIcon } from './Icons';

interface HeaderProps {
    title: string;
    subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <header className="relative text-center flex flex-col items-center">
        <div className="absolute top-0 right-0">
            <button
                onClick={toggleLanguage}
                className="px-4 py-2 bg-slate-800/70 border border-amber-500/30 rounded-md text-amber-200 hover:bg-slate-700/70 transition-colors"
            >
                {lang === 'my' ? 'ไทย' : 'မြန်မာ'}
            </button>
        </div>
        <LotusIcon />
        <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mt-2" style={{ textShadow: '0 2px 4px rgba(251, 191, 36, 0.3)' }}>
            {title}
        </h1>
        <p className="text-lg text-amber-100/80 mt-2">
            {subtitle}
        </p>
    </header>
  );
};