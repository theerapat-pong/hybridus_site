
import React, { useState, useEffect } from 'react';

interface CalculatorFormProps {
  onCalculate: (date: Date, isWednesdayAfternoon: boolean) => void;
  t: (key: string) => string;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, t }) => {
  const [dateStr, setDateStr] = useState<string>('');
  const [isWednesday, setIsWednesday] = useState<boolean>(false);
  const [isWednesdayAfternoon, setIsWednesdayAfternoon] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (dateStr) {
      const date = new Date(dateStr);
      setIsWednesday(date.getDay() === 3);
    } else {
      setIsWednesday(false);
    }
  }, [dateStr]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateStr) {
      setError(t('errorDateEmpty'));
      return;
    }
    const birthDate = new Date(dateStr);
    if (isNaN(birthDate.getTime())) {
        setError(t('errorDateInvalid'));
        return;
    }
    setError('');
    onCalculate(birthDate, isWednesdayAfternoon);
  };

  return (
    <div className="p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl transition-all duration-300 hover:shadow-amber-500/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="birthdate" className="block text-lg font-medium text-amber-200 mb-2">
            {t('dateLabel')}
          </label>
          <input
            type="date"
            id="birthdate"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full p-3 bg-slate-900/70 border border-amber-600/50 rounded-md text-amber-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
          />
        </div>

        {isWednesday && (
          <div className="p-4 bg-slate-900/50 rounded-md border border-amber-600/30">
            <p className="text-amber-200 mb-3">{t('wednesdayLabel')}</p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="wednesday_period"
                  checked={!isWednesdayAfternoon}
                  onChange={() => setIsWednesdayAfternoon(false)}
                  className="form-radio h-5 w-5 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
                />
                <span className="text-amber-100">{t('wednesdayMorning')}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="wednesday_period"
                  checked={isWednesdayAfternoon}
                  onChange={() => setIsWednesdayAfternoon(true)}
                  className="form-radio h-5 w-5 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
                />
                <span className="text-amber-100">{t('wednesdayAfternoon')}</span>
              </label>
            </div>
          </div>
        )}
        
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-600 text-slate-900 text-lg font-bold rounded-lg shadow-md hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1 transition-all duration-300"
          >
            {t('calculateButton')}
          </button>
        </div>
      </form>
    </div>
  );
};
