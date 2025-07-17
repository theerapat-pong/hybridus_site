import React, { useState, useEffect } from 'react';
import type { UserInfo } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CalculatorFormProps {
  onCalculate: (date: Date, isWednesdayAfternoon: boolean, userInfo: UserInfo) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
  const { t } = useLanguage();
  const [dateStr, setDateStr] = useState<string>('');
  const [isWednesday, setIsWednesday] = useState<boolean>(false);
  const [isWednesdayAfternoon, setIsWednesdayAfternoon] = useState<boolean>(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
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
    if (!firstName || !lastName) {
      setError(t('errorNameEmpty'));
      return;
    }
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
    const userInfo: UserInfo = { firstName, lastName, middleName, gender };
    onCalculate(birthDate, isWednesdayAfternoon, userInfo);
  };

  const inputStyles = "w-full p-3 bg-slate-900/70 border border-amber-600/50 rounded-md text-amber-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition";

  return (
    <div className="p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl transition-all duration-300 hover:shadow-amber-500/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
            <div>
                <label htmlFor="firstName" className="block text-lg font-medium text-amber-200 mb-2">{t('firstNameLabel')}</label>
                <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputStyles} required />
            </div>
             <div>
                <label htmlFor="middleName" className="block text-lg font-medium text-amber-200 mb-2">{t('middleNameLabel')}</label>
                <input type="text" id="middleName" value={middleName} onChange={e => setMiddleName(e.target.value)} className={inputStyles} />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-lg font-medium text-amber-200 mb-2">{t('lastNameLabel')}</label>
                <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className={inputStyles} required />
            </div>
        </div>

        <div>
            <label htmlFor="gender" className="block text-lg font-medium text-amber-200 mb-2">{t('genderLabel')}</label>
            <select id="gender" value={gender} onChange={e => setGender(e.target.value as any)} className={inputStyles}>
                <option value="female">{t('genderFemale')}</option>
                <option value="male">{t('genderMale')}</option>
                <option value="other">{t('genderOther')}</option>
            </select>
        </div>

        <div>
          <label htmlFor="birthdate" className="block text-lg font-medium text-amber-200 mb-2">
            {t('dateLabel')}
          </label>
          <input
            type="date"
            id="birthdate"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className={inputStyles}
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
        
        {error && <p className="text-red-400 text-center animate-fade-in">{error}</p>}

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