
import React from 'react';

// Using a style tag for the keyframes and complex styles to keep the component self-contained.
const styles = `
@keyframes crystal-ball-glow {
  0%, 100% {
    box-shadow: 0 0 25px rgba(251, 191, 36, 0.4), 
                0 0 50px rgba(251, 191, 36, 0.3), 
                inset 0 0 15px rgba(255, 255, 255, 0.4),
                inset 0 -10px 15px rgba(100, 50, 150, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 35px rgba(251, 191, 36, 0.6), 
                0 0 70px rgba(251, 191, 36, 0.5), 
                inset 0 0 20px rgba(255, 255, 255, 0.6),
                inset 0 -10px 15px rgba(120, 70, 170, 0.4);
    transform: scale(1.03);
  }
}

@keyframes crystal-ball-swirl {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.2); }
}
`;

export const CrystalBallSpinner: React.FC = () => {
    return (
        <>
            <style>{styles}</style>
            <div className="flex flex-col items-center justify-center">
                <div 
                    className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-amber-300/30"
                    style={{
                        background: 'radial-gradient(circle at 50% 40%, #c8d4ff, #96b4ff 70%, #5064c8 100%)',
                        animation: 'crystal-ball-glow 3.5s ease-in-out infinite',
                    }}
                >
                    {/* Inner mist/galaxy effect */}
                    <div 
                        className="absolute top-1/2 left-1/2 w-[180%] h-[180%]"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)',
                            animation: 'crystal-ball-swirl 10s linear infinite',
                        }}
                    ></div>
                    <div 
                        className="absolute top-1/2 left-1/2 w-[150%] h-[150%]"
                        style={{
                             background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 50%)',
                             animation: 'crystal-ball-swirl 15s linear infinite reverse',
                        }}
                    ></div>
                     {/* Sparkles */}
                    <span className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[50%]" style={{ animation: 'sparkle 3s infinite ease-in-out', animationDelay: '0s' }}></span>
                    <span className="absolute w-2 h-2 bg-white rounded-full top-[40%] left-[25%]" style={{ animation: 'sparkle 4s infinite ease-in-out', animationDelay: '0.5s' }}></span>
                    <span className="absolute w-1 h-1 bg-white rounded-full top-[75%] left-[30%]" style={{ animation: 'sparkle 3.5s infinite ease-in-out', animationDelay: '1s' }}></span>
                    <span className="absolute w-2 h-2 bg-white rounded-full top-[60%] left-[75%]" style={{ animation: 'sparkle 2.5s infinite ease-in-out', animationDelay: '1.5s' }}></span>
                    <span className="absolute w-1 h-1 bg-white rounded-full top-[30%] left-[80%]" style={{ animation: 'sparkle 4.5s infinite ease-in-out', animationDelay: '2s' }}></span>

                </div>
                {/* Base of the crystal ball */}
                <div 
                    className="w-28 h-8 md:w-32 md:h-10 -mt-4 bg-gradient-to-b from-[#4a3a3a] to-[#2a1e1e] rounded-b-xl shadow-inner"
                    style={{
                        borderBottom: '4px solid #1a0e0e',
                        borderLeft: '2px solid #1a0e0e',
                        borderRight: '2px solid #1a0e0e',
                    }}
                ></div>
            </div>
        </>
    );
};
