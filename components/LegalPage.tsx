import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BackArrowIcon } from './Icons';

interface LegalPageProps {
  title: string;
  content: string;
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ title, content, onBack }) => {
    const { t } = useLanguage();

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl animate-fade-in">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 bg-slate-700/80 border border-amber-600/30 rounded-md text-amber-200 hover:bg-slate-700/70 transition-colors"
                >
                    <BackArrowIcon />
                    {t('backButton')}
                </button>
            </div>

            <h2 className="text-3xl font-bold text-amber-300 text-center mb-6">
                {title}
            </h2>

            <div
                className="legal-content text-amber-100/90"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};
