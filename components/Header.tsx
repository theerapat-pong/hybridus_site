
import React from 'react';

const LotusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-400">
      <path d="M12.75 2.1a.75.75 0 00-1.5 0v1.864a13.43 13.43 0 00-4.664 2.125.75.75 0 00.916 1.185 11.93 11.93 0 018.596 0A.75.75 0 0017.414 6.09a13.43 13.43 0 00-4.664-2.125V2.1zM8.086 7.276a.75.75 0 00-1.06 1.06l.823.823a13.419 13.419 0 00-2.435 3.323.75.75 0 101.4.53 11.92 11.92 0 012.164-2.95l-.892-.891zM16.974 9.159l-.892.891a11.92 11.92 0 012.164 2.95.75.75 0 101.4-.53 13.419 13.419 0 00-2.435-3.323.75.75 0 10-1.06-1.06l.823-.823zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM4.646 12.75a.75.75 0 000 1.5h1.864a13.43 13.43 0 002.125 4.664.75.75 0 101.185-.916 11.93 11.93 0 010-8.596.75.75 0 00-1.185-.916A13.43 13.43 0 006.51 11.25H4.646zm14.708 0h-1.864a13.43 13.43 0 00-2.125-4.664.75.75 0 10-1.185.916 11.93 11.93 0 010 8.596.75.75 0 101.185.916A13.43 13.43 0 0017.49 14.25h1.864a.75.75 0 000-1.5zM9.858 17.414a.75.75 0 10-.916-1.185 11.93 11.93 0 01-2.164-2.95l.892-.891a.75.75 0 10-1.06-1.06l-.823.823a13.419 13.419 0 002.435 3.323zm6.06-2.369l.892.891a13.419 13.419 0 002.435-3.323.75.75 0 10-1.4-.53 11.92 11.92 0 01-2.164 2.95l.892.891a.75.75 0 101.06 1.06l-.823-.823a.75.75 0 00-.916 1.185 13.43 13.43 0 004.664 2.125.75.75 0 10.53-1.4 11.92 11.92 0 01-3.929-1.879zM12 18.75a.75.75 0 00.75-.75v-1.864a13.43 13.43 0 004.664-2.125.75.75 0 10-.916-1.185 11.93 11.93 0 01-8.596 0A.75.75 0 106.586 16.09a13.43 13.43 0 004.664 2.125v1.864a.75.75 0 00.75.75z" />
    </svg>
  );

interface HeaderProps {
    t: (key: string) => string;
    onToggleLanguage: () => void;
    currentLang: string;
}

export const Header: React.FC<HeaderProps> = ({ t, onToggleLanguage, currentLang }) => {
  return (
    <header className="relative text-center flex flex-col items-center">
        <div className="absolute top-0 right-0">
            <button
                onClick={onToggleLanguage}
                className="px-4 py-2 bg-slate-800/70 border border-amber-500/30 rounded-md text-amber-200 hover:bg-slate-700/70 transition-colors"
            >
                {currentLang === 'my' ? 'ไทย' : 'မြန်မာ'}
            </button>
        </div>
        <LotusIcon />
        <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mt-2" style={{ textShadow: '0 2px 4px rgba(251, 191, 36, 0.3)' }}>
            {t('appTitle')}
        </h1>
        <p className="text-lg text-amber-100/80 mt-2">
            {t('appSubtitle')}
        </p>
    </header>
  );
};
