import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { translations, Language, useTranslations as useTranslationsHook } from '../i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: any, replacements?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('my');

  const toggleLanguage = useCallback(() => {
    setLang(prevLang => (prevLang === 'my' ? 'th' : 'my'));
  }, []);

  const t = useTranslationsHook(lang);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLanguage,
    t,
  }), [lang, toggleLanguage, t]);

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
