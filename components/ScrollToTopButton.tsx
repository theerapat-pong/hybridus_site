import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UpArrowIcon } from './Icons';

export const ScrollToTopButton: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            title={t('scrollToTopButton')}
            aria-label={t('scrollToTopButton')}
            className={`fixed bottom-6 right-6 p-3 rounded-full bg-amber-600/80 text-slate-900 shadow-lg backdrop-blur-sm hover:bg-amber-500 transform hover:-translate-y-1 transition-all duration-300 z-50 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
        >
            <UpArrowIcon />
        </button>
    );
};