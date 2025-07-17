
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultDisplay } from './components/ResultDisplay';
import { CrystalBallSpinner } from './components/CrystalBallSpinner';
import { calculateMahabote, getHoroscopeReading } from './services/geminiService';
import type { MahaboteResult, HoroscopeSections } from './types';
import { useTranslations, Language } from './i18n';
import { ScrollToTopButton } from './components/ScrollToTopButton';

const App: React.FC = () => {
  const [result, setResult] = useState<MahaboteResult | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeSections | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lang, setLang] = useState<Language>('my');

  const t = useTranslations(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t('appTitle');
  }, [lang, t]);
  
  const handleReset = useCallback(() => {
    setResult(null);
    setHoroscope(null);
    setError('');
    setIsLoading(false);
  }, []);

  const handleCalculate = useCallback(async (birthDate: Date, isWednesdayAfternoon: boolean) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setHoroscope(null);

    try {
      const mahaboteResult = calculateMahabote(birthDate, isWednesdayAfternoon, lang);
      setResult(mahaboteResult);
      
      const reading = await getHoroscopeReading(mahaboteResult, lang);
      setHoroscope(reading);

    } catch (e) {
      console.error(e);
      setError(t('errorFetch'));
    } finally {
      setIsLoading(false);
    }
  }, [lang, t]);

  const toggleLanguage = useCallback(() => {
    setLang(prevLang => prevLang === 'my' ? 'th' : 'my');
    handleReset();
  }, [handleReset]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a0e0e] to-[#1a1a2e] text-amber-50 selection:bg-amber-500 selection:text-slate-900">
      <div 
        className="absolute inset-0 bg-repeat bg-center opacity-5" 
        style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/traditional-damask.png)'}}
      ></div>
      <div className="relative container mx-auto px-4 py-8">
        <Header t={t} onToggleLanguage={toggleLanguage} currentLang={lang} />
        <main className="mt-8 max-w-3xl mx-auto">
          {(!result && !isLoading) && <CalculatorForm onCalculate={handleCalculate} t={t} />}
          
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

          {result && !isLoading && (
            <ResultDisplay result={result} horoscope={horoscope} onReset={handleReset} t={t} lang={lang} />
          )}
        </main>
         <footer className="text-center mt-12 text-amber-500/50 text-sm">
            <p>{t('footerText')}</p>
            <p className="mt-2">Copyright &copy; {new Date().getFullYear()} hybridus.site. All Rights Reserved.</p>
        </footer>
      </div>
      <ScrollToTopButton t={t} />
    </div>
  );
};

export default App;
