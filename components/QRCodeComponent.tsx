import React, { useEffect, useState } from 'react';
import * as QRCode from 'qrcode';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ 
  value, 
  size = 160, 
  level = 'M',
  className = ''
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          errorCorrectionLevel: level,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (value) {
      generateQR();
    }
  }, [value, size, level]);

  if (!qrDataUrl) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img 
      src={qrDataUrl} 
      alt="QR Code" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
};
