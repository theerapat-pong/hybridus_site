import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onPolicyClick: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onAccept, onPolicyClick }) => {
  const { t } = useLanguage();

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 animate-fade-in-up"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent"
    >
      <div className="bg-slate-900/80 backdrop-blur-md p-4 shadow-lg shadow-black/30">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-amber-100 flex-grow">
            {t('cookieConsentMessage')}{' '}
            <button onClick={onPolicyClick} className="underline hover:text-amber-300 transition-colors">
              {t('cookieLink')}
            </button>
          </p>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-amber-600 text-slate-900 font-bold rounded-md hover:bg-amber-500 transition-colors duration-300 flex-shrink-0"
          >
            {t('cookieConsentAccept')}
          </button>
        </div>
      </div>
    </div>
  );
};