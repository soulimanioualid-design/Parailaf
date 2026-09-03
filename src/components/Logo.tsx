import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Parailaf Brand Icon: Modern Medical Cross & Health Pulse in Flyer Theme */}
      <div 
        className={`${iconSizes[size]} bg-gradient-to-br from-red-600 via-red-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-red-700/20 relative shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-200`}
      >
        {/* Subtle background glow circle */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 to-transparent opacity-70" />
        
        {/* Custom Medical Parapharmacy SVG Emblem */}
        <svg 
          className={size === 'sm' ? 'w-5 h-5 relative z-10' : size === 'lg' ? 'w-7 h-7 relative z-10' : 'w-6 h-6 relative z-10'} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Medical Parapharmacy Cross */}
          <path 
            d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z" 
            fill="currentColor" 
            className="text-white/20"
          />
          {/* Dynamic Heartbeat / Pulse Wave intersecting the cross */}
          <path 
            d="M3 12H7L9 7L13 17L15 11L17 13H21" 
            stroke="#fbbf24" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Center glow dot */}
          <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span 
            className={`${titleSizes[size]} font-extrabold tracking-tight font-heading ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            Para<span className={isLight ? 'text-red-400' : 'text-red-600'}>ilaf</span>
          </span>
          <span 
            className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
              isLight 
                ? 'bg-red-950/80 text-amber-300 border-red-800' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            MAROC
          </span>
        </div>

        {showSubtitle && (
          <p 
            className={`text-[10px] font-medium tracking-wide mt-1 ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Parapharmacie & Santé Glucose
          </p>
        )}
      </div>
    </div>
  );
};
