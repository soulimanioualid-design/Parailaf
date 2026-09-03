import React, { useState } from 'react';
import { 
  Eye, 
  Maximize2, 
  X 
} from 'lucide-react';
import { ExactFlyerDesign } from './ExactFlyerDesign';

export const HeroSection: React.FC = () => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/70 text-slate-900 pt-4 pb-10 sm:pt-6 sm:pb-14 border-b border-slate-200">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* The Exact Promotional Flyer (Centered in Hero) */}
        <div className="flex flex-col items-center">
          
          <div className="w-full relative shadow-2xl rounded-3xl">
            <ExactFlyerDesign onZoom={() => setIsZoomOpen(true)} />
          </div>

          {/* Quick Helper under the flyer */}
          <div className="mt-3 flex items-center justify-between w-full max-w-2xl px-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Cliquez sur les packs sous l'affiche pour commander
            </span>
            <button
              onClick={() => setIsZoomOpen(true)}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Agrandir l'affiche
            </button>
          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox Modal for the Flyer */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="fixed top-4 right-4 z-50 p-2.5 bg-white text-slate-900 rounded-full shadow-2xl hover:bg-slate-200 cursor-pointer"
            aria-label="Fermer le plein écran"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-3xl w-full my-auto py-8">
            <ExactFlyerDesign />
          </div>
        </div>
      )}

    </section>
  );
};
