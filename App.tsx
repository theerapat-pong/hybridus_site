import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultDisplay } from './components/ResultDisplay';
import { CrystalBallSpinner } from './components/CrystalBallSpinner';
import { calculateMahabote, getHoroscopeReading } from './services/geminiService';
import type { MahaboteResult, HoroscopeSections, UserInfo, Page } from './types';
import { useLanguage } from './contexts/LanguageContext';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { PalmReader } from './components/PalmReader';
import { LegalPage } from './components/LegalPage';
import { CookieConsentBanner } from './components/CookieConsentBanner';

const App: React.FC = () => {
  const [result, setResult] = useState<MahaboteResult | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeSections | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mode, setMode] = useState<'birth' | 'palm'>('birth');
  const [activePage, setActivePage] = useState<Page>('main');
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);

  const { lang, t } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
    const title = mode === 'birth' ? t('appTitle') : t('palmReadingTitle');
    document.title = title;
  }, [lang, t, mode]);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'true') {
      setShowCookieBanner(true);
    }
  }, []);
  
  const handleReset = useCallback(() => {
    setResult(null);
    setHoroscope(null);
    setError('');
    setIsLoading(false);
    setUserInfo(null);
  }, []);

  const handleCalculate = useCallback(async (birthDate: Date, isWednesdayAfternoon: boolean, userInfo: UserInfo) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setHoroscope(null);
    setUserInfo(userInfo);

    try {
      const mahaboteResult = calculateMahabote(birthDate, isWednesdayAfternoon, lang);
      setResult(mahaboteResult);
      
      const reading = await getHoroscopeReading(mahaboteResult, userInfo, lang);
      setHoroscope(reading);

    } catch (e) {
      console.error(e);
      setError(t('errorFetch'));
    } finally {
      setIsLoading(false);
    }
  }, [lang, t]);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieBanner(false);
  };

  const appTitle = mode === 'birth' ? t('appTitle') : t('palmReadingTitle');
  const appSubtitle = mode === 'birth' ? t('appSubtitle') : t('palmReadingSubtitle');

  const renderMainContent = () => {
    if (mode === 'birth') {
      return (
        <>
          {(!result && !isLoading) && <CalculatorForm onCalculate={handleCalculate} />}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl animate-fade-in">
              <CrystalBallSpinner />
              <p 
                className="mt-6 text-xl font-bold text-amber-300 tracking-wider animate-pulse"
                style={{ textShadow: '0 1px 3px rgba(251, 191, 36, 0.5)' }}
              >
                {t('calculating')}
              </p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center bg-red-900/50 border border-red-500/50 rounded-lg">
              <p className="text-red-300">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-amber-600 text-slate-900 font-bold rounded-md hover:bg-amber-500 transition-colors duration-300"
              >
                {t('resetButton')}
              </button>
            </div>
          )}

          {result && userInfo && !isLoading && (
            <ResultDisplay result={result} horoscope={horoscope} onReset={handleReset} userInfo={userInfo} />
          )}
        </>
      );
    }
    
    if (mode === 'palm') {
      return <PalmReader />;
    }
    
    return null;
  };

  const renderPage = () => {
    if (activePage !== 'main') {
      const title = t(`${activePage}Title` as any);
      const content = t(`${activePage}Content` as any);
      return <LegalPage title={title} content={content} onBack={() => setActivePage('main')} />;
    }

    return (
      <>
        <div className="my-8 flex justify-center">
            <div className="flex rounded-lg p-1 bg-slate-800/50 border border-amber-500/30 shadow-md">
              <button
                onClick={() => { setMode('birth'); handleReset(); }}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
                  mode === 'birth' ? 'bg-amber-600 text-slate-900 shadow' : 'text-amber-200 hover:bg-slate-700/50'
                }`}
              >
                {t('birthDateAstrology')}
              </button>
              <button
                onClick={() => setMode('palm')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
                  mode === 'palm' ? 'bg-amber-600 text-slate-900 shadow' : 'text-amber-200 hover:bg-slate-700/50'
                }`}
              >
                {t('palmReading')}
              </button>
            </div>
          </div>
          <main className="max-w-3xl mx-auto">
            {renderMainContent()}
          </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a0e0e] to-[#1a1a2e] text-amber-50 selection:bg-amber-500 selection:text-slate-900">
      <div 
        className="absolute inset-0 bg-repeat bg-center opacity-5" 
        style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/traditional-damask.png)'}}
      ></div>
      <div className="relative container mx-auto px-4 py-8">
        <Header 
          title={appTitle}
          subtitle={appSubtitle}
        />
        
        {renderPage()}
        
        <footer className="text-center mt-12 text-amber-500/60 text-sm">
          <p className="mb-4 text-amber-200/80 font-semibold border border-amber-500/20 bg-slate-800/30 rounded-md p-2 max-w-md mx-auto">{t('aiDisclaimer')}</p>
          <div className="flex justify-center items-center gap-x-4 mb-3">
              <button onClick={() => setActivePage('terms')} className="hover:text-amber-300 transition-colors">{t('termsLink')}</button>
              <span className="text-amber-500/40">•</span>
              <button onClick={() => setActivePage('privacy')} className="hover:text-amber-300 transition-colors">{t('privacyLink')}</button>
              <span className="text-amber-500/40">•</span>
              <button onClick={() => setActivePage('cookie')} className="hover:text-amber-300 transition-colors">{t('cookieLink')}</button>
          </div>
          <p className="mt-2 text-amber-500/40">Copyright &copy; {new Date().getFullYear()} hybridus.site. All Rights Reserved.</p>
        </footer>
      </div>
      <ScrollToTopButton />
      {showCookieBanner && activePage === 'main' && (
          <CookieConsentBanner
              onAccept={handleAcceptCookies}
              onPolicyClick={() => setActivePage('cookie')}
          />
      )}
    </div>
  );
};

export default App;