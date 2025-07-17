import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { translations, Language, useTranslations as useTranslationsHook } from '../i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: any, replacements?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    // 1. Check for a language saved in localStorage.
    try {
        const savedLang = localStorage.getItem('language');
        if (savedLang === 'my' || savedLang === 'th') {
            return savedLang;
        }
    } catch (e) {
        console.warn('Could not access localStorage. Skipping persistence.');
    }

    // 2. If not found, check the browser's language.
    const browserLang = navigator.language?.toLowerCase();
    if (browserLang?.startsWith('th')) {
        return 'th';
    }
    // Default to Burmese for 'my' or any other language
    return 'my';
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, _setLang] = useState<Language>(getInitialLanguage);

  const setLang = useCallback((newLang: Language) => {
    try {
        localStorage.setItem('language', newLang);
    } catch (e) {
        console.warn('Could not access localStorage. Skipping persistence.');
    }
    _setLang(newLang);
  }, []);

  const toggleLanguage = useCallback(() => {
    _setLang(prevLang => {
      const newLang = prevLang === 'my' ? 'th' : 'my';
      try {
        localStorage.setItem('language', newLang);
      } catch (e) {
        console.warn('Could not access localStorage. Skipping persistence.');
      }
      return newLang;
    });
  }, []);

  const t = useTranslationsHook(lang);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLanguage,
    t,
  }), [lang, setLang, toggleLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};