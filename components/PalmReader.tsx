import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getPalmReading } from '../services/geminiService';
import { resizeImage } from '../utils/image';
import type { PalmReadingResult, PalmLineAnalysis } from '../types';
import { CrystalBallSpinner } from './CrystalBallSpinner';
import { CameraIcon, UploadIcon, PalmIcon } from './Icons';

const lineColors: { [key: string]: string } = {
  heart: '#FF6347', // Tomato Red
  head: '#4682B4',  // Steel Blue
  life: '#32CD32',  // Lime Green
  fate: '#FFD700',  // Gold
};

export const PalmReader: React.FC = () => {
  const { t, lang } = useLanguage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PalmReadingResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const drawLines = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && image && ctx && analysis) {
      // Match canvas size to the displayed image size for accurate drawing
      canvas.width = image.clientWidth;
      canvas.height = image.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

      analysis.lines.forEach(line => {
        if (line.points.length < 2) return;

        const color = lineColors[line.name.toLowerCase()] || '#FFFFFF'; // Default to white
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 5;
        
        const firstPoint = line.points[0];
        ctx.moveTo(firstPoint.x * canvas.width, firstPoint.y * canvas.height);

        for (let i = 1; i < line.points.length; i++) {
          const point = line.points[i];
          ctx.lineTo(point.x * canvas.width, point.y * canvas.height);
        }
        ctx.stroke();
      });
    }
  };

  useEffect(() => {
    // Redraw lines on window resize to handle responsiveness
    window.addEventListener('resize', drawLines);
    return () => {
      window.removeEventListener('resize', drawLines);
    };
  }, [analysis]); // Re-add listener if analysis data changes


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit initial file size
        setError(t('errorImageSize'));
        return;
      }
      
      setError('');
      setIsLoading(true); // Show spinner during resize
      
      try {
        // Resize the image for faster uploads and analysis
        const resizedFile = await resizeImage(file, 1024, 1024);
        setImageFile(resizedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setIsLoading(false); // Hide spinner after resize and preview load
        };
        reader.readAsDataURL(resizedFile);
        setAnalysis(null); // Reset previous analysis
      } catch (err) {
          console.error("Image processing error:", err);
          setError(t('errorPalmAnalysis')); // Generic error for processing
          setIsLoading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const palmReading = await getPalmReading(imageFile, lang);
      setAnalysis(palmReading);
    } catch (e) {
      console.error(e);
      setError(t('errorPalmAnalysis'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
      setImageFile(null);
      setImagePreview(null);
      setAnalysis(null);
      setError('');
      setIsLoading(false);
  };

  const baseButtonStyles = "w-full md:w-auto flex-1 inline-flex items-center justify-center py-3 px-4 bg-amber-600 text-slate-900 text-base font-bold rounded-lg shadow-md hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl animate-fade-in">
        <CrystalBallSpinner />
        <p className="mt-6 text-xl font-bold text-amber-300 tracking-wider animate-pulse" style={{ textShadow: '0 1px 3px rgba(251, 191, 36, 0.5)' }}>
          {analysis ? t('analyzingPalm') : t('preparingHoroscope')}
        </p>
      </div>
    );
  }

  if (analysis && imagePreview) {
      const analysisSections: { key: keyof PalmLineAnalysis; title: string; }[] = [
          { key: 'heart', title: t('lineHeart') },
          { key: 'head', title: t('lineHead') },
          { key: 'life', title: t('lineLife') },
          { key: 'fate', title: t('lineFate') },
      ];

      return (
          <div className="p-4 md:p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl animate-fade-in">
              <h2 className="text-3xl font-bold text-amber-300 text-center mb-6">{t('palmAnalysisResultTitle')}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                      <div className="relative w-full max-w-md mx-auto border-2 border-amber-600/30 rounded-lg shadow-lg">
                          <img 
                              ref={imageRef} 
                              src={imagePreview} 
                              alt={t('imagePreview')} 
                              className="w-full h-auto rounded-md" 
                              onLoad={drawLines}
                          />
                          <canvas 
                              ref={canvasRef} 
                              className="absolute top-0 left-0 w-full h-full pointer-events-none"
                          />
                      </div>
                      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-amber-600/20 max-w-md mx-auto w-full">
                          <h4 className="font-bold text-center text-amber-200 mb-2">{t('lineLegendTitle')}</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              {Object.keys(lineColors).map(key => (
                                  <div key={key} className="flex items-center">
                                      <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: lineColors[key], boxShadow: `0 0 5px ${lineColors[key]}` }}></span>
                                      <span className="text-amber-100">{t(`line${key.charAt(0).toUpperCase() + key.slice(1)}` as any)}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {analysisSections.filter(({key}) => analysis.analysis[key]).map(({ key, title }, index) => (
                          <div key={key} className="bg-slate-900/60 rounded-lg border border-amber-600/20 p-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                              <h3 className="text-xl font-semibold text-amber-200 mb-2 flex items-center">
                                  <span className="w-5 h-5 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: lineColors[key], boxShadow: `0 0 6px ${lineColors[key]}` }}></span>
                                  {title}
                              </h3>
                              <p className="whitespace-pre-wrap text-amber-50 leading-relaxed opacity-90 text-sm">
                                  {analysis.analysis[key]}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="text-center mt-8">
                  <button onClick={handleReset} className="py-2 px-8 bg-amber-600 text-slate-900 text-base font-bold rounded-lg shadow-md hover:bg-amber-500 transform hover:-translate-y-0.5 transition-all duration-300">
                      {t('tryAgainPalmButton')}
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl transition-all duration-300 hover:shadow-amber-500/20 animate-fade-in">
        <div className="text-center">
             <h2 className="text-3xl font-bold text-amber-300">{t('palmReadingTitle')}</h2>
             <p className="text-amber-100/80 mt-1">{t('palmReadingSubtitle')}</p>
        </div>
        
        <div className="mt-8">
          {!imagePreview ? (
             <div className="border-2 border-dashed border-amber-500/30 rounded-lg p-8 text-center flex flex-col items-center">
                <PalmIcon />
                <p className="text-amber-200 mb-6">{t('uploadInstruction')}</p>
                
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm">
                   <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
                   <button onClick={() => cameraInputRef.current?.click()} className={baseButtonStyles}>
                       <CameraIcon /> {t('takePictureButton')}
                   </button>
                   
                   <input type="file" accept="image/*" ref={uploadInputRef} onChange={handleFileChange} className="hidden" />
                   <button onClick={() => uploadInputRef.current?.click()} className={baseButtonStyles}>
                       <UploadIcon /> {t('uploadPictureButton')}
                   </button>
                </div>
             </div>
          ) : (
             <div className="text-center">
                <p className="font-semibold text-amber-200 mb-4">{t('imagePreview')}</p>
                <img src={imagePreview} alt={t('imagePreview')} className="max-h-80 w-auto mx-auto rounded-lg shadow-lg mb-6" />
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button onClick={handleAnalyze} className={baseButtonStyles}>
                      {t('analyzeButton')}
                    </button>
                    <button onClick={handleReset} className={`${baseButtonStyles} bg-slate-600 hover:bg-slate-500`}>
                      {t('resetButton')}
                    </button>
                </div>
             </div>
          )}

          {error && <p className="text-red-400 text-center mt-4 animate-fade-in">{error}</p>}
        </div>
    </div>
  );
};