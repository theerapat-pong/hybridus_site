import React from 'react';
import type { HoroscopeSections } from '../types';

export const LotusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-400">
      <path d="M12.75 2.1a.75.75 0 00-1.5 0v1.864a13.43 13.43 0 00-4.664 2.125.75.75 0 00.916 1.185 11.93 11.93 0 018.596 0A.75.75 0 0017.414 6.09a13.43 13.43 0 00-4.664-2.125V2.1zM8.086 7.276a.75.75 0 00-1.06 1.06l.823.823a13.419 13.419 0 00-2.435 3.323.75.75 0 101.4.53 11.92 11.92 0 012.164-2.95l-.892-.891zM16.974 9.159l-.892.891a11.92 11.92 0 012.164 2.95.75.75 0 101.4-.53 13.419 13.419 0 00-2.435-3.323.75.75 0 10-1.06-1.06l.823-.823zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM4.646 12.75a.75.75 0 000 1.5h1.864a13.43 13.43 0 002.125 4.664.75.75 0 101.185-.916 11.93 11.93 0 010-8.596.75.75 0 00-1.185-.916A13.43 13.43 0 006.51 11.25H4.646zm14.708 0h-1.864a13.43 13.43 0 00-2.125-4.664.75.75 0 10-1.185.916 11.93 11.93 0 010 8.596.75.75 0 101.185.916A13.43 13.43 0 0017.49 14.25h1.864a.75.75 0 000-1.5zM9.858 17.414a.75.75 0 10-.916-1.185 11.93 11.93 0 01-2.164-2.95l.892-.891a.75.75 0 10-1.06-1.06l-.823.823a13.419 13.419 0 002.435 3.323zm6.06-2.369l.892.891a13.419 13.419 0 002.435-3.323.75.75 0 10-1.4-.53 11.92 11.92 0 01-2.164 2.95l.892.891a.75.75 0 101.06 1.06l-.823-.823a.75.75 0 00-.916 1.185 13.43 13.43 0 004.664 2.125.75.75 0 10.53-1.4 11.92 11.92 0 01-3.929-1.879zM12 18.75a.75.75 0 00.75-.75v-1.864a13.43 13.43 0 004.664-2.125.75.75 0 10-.916-1.185 11.93 11.93 0 01-8.596 0A.75.75 0 106.586 16.09a13.43 13.43 0 004.664 2.125v1.864a.75.75 0 00.75.75z" />
    </svg>
);

export const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5 mr-2"}>
        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.342 1.374a3.026 3.026 0 01.64 2.298V16.5a3.026 3.026 0 01-.64 2.298 4.027 4.027 0 01-2.342 1.374 49.52 49.52 0 01-5.312 0 4.027 4.027 0 01-2.342-1.374 3.026 3.026 0 01-.64-2.298V6.743a3.026 3.026 0 01.64-2.298A4.027 4.027 0 019.344 3.071zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

export const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5 mr-2"}>
      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 inline-block mr-3 text-red-300/80">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

export const PalmIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-amber-500/50 mx-auto mb-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.588 8.188a7.5 7.5 0 11-16.144-4.258.75.75 0 01.352-1.026l3.6-1.8a.75.75 0 00.352-1.026l-1.8-3.6a.75.75 0 011.026-.352z" />
    </svg>
);

export const SectionIcon: React.FC<{ type: keyof Omit<HoroscopeSections, 'warning'> }> = ({ type }) => {
    let path = <></>;
    switch (type) {
        case 'personality':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />;
            break;
        case 'career':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25v-4.07m2.25-4.22a2.25 2.25 0 012.25-2.25h3v-2.25a2.25 2.25 0 012.25-2.25h3.75a2.25 2.25 0 012.25 2.25v2.25h3a2.25 2.25 0 012.25 2.25m-15-4.22l.01-.001M18 10.5l.01-.001" />;
            break;
        case 'love':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />;
            break;
        case 'health':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />;
            break;
        case 'advice':
            path = <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.518a.562.562 0 01.32.959l-4.48 3.26a.563.563 0 00-.182.635l1.703 5.242a.562.562 0 01-.812.622l-4.48-3.26a.563.563 0 00-.676 0l-4.48 3.26a.562.562 0 01-.812-.622l1.703-5.242a.563.563 0 00-.182-.635l-4.48-3.26a.562.562 0 01.32-.959h5.518a.563.563 0 00.475-.345L11.48 3.5z" />;
            break;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block mr-3 align-text-bottom text-amber-300/80">
            {path}
        </svg>
    );
};

export const UpArrowIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

export const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);