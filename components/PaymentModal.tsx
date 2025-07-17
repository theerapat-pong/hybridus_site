import React from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
  amount: number; // in smallest unit, e.g., satang for THB
  isProcessing: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, t, amount, isProcessing }) => {
  if (!isOpen) return null;

  const displayAmount = (amount / 100).toFixed(2);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-800 border border-amber-500/30 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md m-4 text-center text-amber-50"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold text-amber-300 mb-2">{t('paymentModalTitle')}</h2>
        <p className="text-amber-100/80 mb-6">{t('paymentModalDesc')}</p>
        
        <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-amber-600/20">
            <p className="text-sm text-amber-300 uppercase">{t('paymentModalAmountLabel')}</p>
            <p className="text-4xl font-bold text-white">{displayAmount} <span className="text-xl">THB</span></p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-slate-700 text-amber-100 font-bold rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {t('paymentModalCancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-amber-600 text-slate-900 font-bold rounded-lg shadow-md hover:bg-amber-500 transform hover:-translate-y-0.5 transition-all duration-300 disabled:bg-slate-500 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessing ? t('paymentModalProcessing') : t('paymentModalConfirm')}
          </button>
        </div>

      </div>
    </div>
  );
};
