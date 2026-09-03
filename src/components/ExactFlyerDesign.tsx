import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  ShoppingBag,
  Eye,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Upload,
  RefreshCw,
  X,
  Plus,
  ShieldCheck,
  Truck,
  PhoneCall
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import flyerGenerated from '../assets/images/freestyle_promo_flyer_1788255081953.jpg';

interface ExactFlyerDesignProps {
  onZoom?: () => void;
}

export const ExactFlyerDesign: React.FC<ExactFlyerDesignProps> = ({ onZoom }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pack4 = PRODUCTS.find(p => p.id === 'pack-4-fsl2-plus') || PRODUCTS[0];
  const pack10 = PRODUCTS.find(p => p.id === 'pack-10-fsl2-plus') || PRODUCTS[1];
  const libre3 = PRODUCTS.find(p => p.id === 'fsl3-plus-nouveau') || PRODUCTS[2];
  const omnipod = PRODUCTS.find(p => p.id === 'omnipod-5-pods-10pack') || PRODUCTS[3];

  // Load saved custom image from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('parailaf_flyer_image_custom');
      if (saved) {
        setCustomImage(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImage(result);
          try {
            localStorage.setItem('parailaf_flyer_image_custom', result);
          } catch {
            // ignore quota errors
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomImage(null);
    try {
      localStorage.removeItem('parailaf_flyer_image_custom');
    } catch {
      // ignore
    }
  };

  const handleQuickOrder = (product: typeof pack4, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border-4 border-[#c8102e] overflow-hidden text-slate-900 font-sans relative group">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Banner with Red & Gold Branding */}
      <div className="bg-gradient-to-r from-[#b71124] via-[#cb1429] to-[#b71124] text-white py-3 px-4 text-center relative shadow-md">
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
          <h2 className="text-xl sm:text-3xl font-black tracking-widest uppercase font-serif drop-shadow-sm">
            EXCLUSIVITÉ
          </h2>
          <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
        </div>

        <div className="absolute right-3 top-2 flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/20 hover:bg-white/30 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
            title="Charger l'image originale exacte depuis votre appareil"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Changer l'image</span>
          </button>

          {onZoom && (
            <button
              onClick={onZoom}
              className="bg-white/20 hover:bg-white/30 text-white p-1 rounded-lg transition cursor-pointer"
              title="Agrandir"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Flyer Image Container (100% Unaltered Image Display) */}
      <div className="relative bg-slate-50 flex flex-col items-center cursor-pointer" onClick={onZoom}>
        
        {/* The Exact Poster Image */}
        <div className="w-full relative">
          <img 
            src={customImage || flyerGenerated} 
            alt="Affiche Officielle FreeStyle Libre Maroc" 
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain block select-none"
          />

          {/* Quick upload trigger pill if custom image is not yet loaded */}
          {!customImage && (
            <div className="absolute top-3 left-3 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg border border-amber-500 flex items-center gap-1.5 animate-pulse cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importer l'image originale exacte</span>
              </button>
            </div>
          )}

          {customImage && (
            <div className="absolute top-3 left-3 z-20">
              <button
                onClick={handleResetImage}
                className="bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>
          )}

          {/* Subtle Hover Action Hint */}
          <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/10 transition-colors pointer-events-none flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Cliquez pour voir en grand
            </span>
          </div>
        </div>

        {/* Quick Order Bar Under the Flyer */}
        <div className="w-full bg-white p-3 border-t-2 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Commander un produit de l'affiche :
            </p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> En stock
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            <button
              onClick={(e) => handleQuickOrder(pack4, e)}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-300 p-2 rounded-xl text-left transition cursor-pointer group/btn"
            >
              <span className="block text-[10px] font-black uppercase text-amber-900">Pack 4 Pièces</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-sm font-black text-[#c8102e]">540 DH</span>
                <span className="text-[9px] text-slate-500 font-bold">135 DH/u</span>
              </div>
              <span className="block text-[9px] text-red-600 font-bold mt-0.5 group-hover/btn:underline">
                Commander &rarr;
              </span>
            </button>

            <button
              onClick={(e) => handleQuickOrder(pack10, e)}
              className="bg-red-50 hover:bg-red-100 border border-red-300 p-2 rounded-xl text-left transition cursor-pointer group/btn"
            >
              <span className="block text-[10px] font-black uppercase text-red-900">Pack 10 Pièces</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-sm font-black text-[#c8102e]">530 DH</span>
                <span className="text-[9px] text-slate-500 font-bold">53 DH/u</span>
              </div>
              <span className="block text-[9px] text-red-600 font-bold mt-0.5 group-hover/btn:underline">
                Commander &rarr;
              </span>
            </button>

            <button
              onClick={(e) => handleQuickOrder(libre3, e)}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-2 rounded-xl text-left transition cursor-pointer group/btn"
            >
              <span className="block text-[10px] font-black uppercase text-[#002f6c]">Libre 3 PLUS</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-sm font-black text-slate-900">800 DH</span>
                <span className="text-[9px] text-amber-600 font-bold">Nouveau</span>
              </div>
              <span className="block text-[9px] text-[#002f6c] font-bold mt-0.5 group-hover/btn:underline">
                Commander &rarr;
              </span>
            </button>

            <button
              onClick={(e) => handleQuickOrder(omnipod, e)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded-xl text-left transition cursor-pointer group/btn"
            >
              <span className="block text-[10px] font-black uppercase text-slate-700">Omnipod 5</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-sm font-black text-slate-900">3000 DH</span>
                <span className="text-[9px] text-slate-500 font-bold">10 Pods</span>
              </div>
              <span className="block text-[9px] text-[#002f6c] font-bold mt-0.5 group-hover/btn:underline">
                Commander &rarr;
              </span>
            </button>

          </div>
        </div>

      </div>

      {/* Reassurance Footer Strip */}
      <div className="bg-[#002f6c] text-white p-2.5 text-[10px] font-bold border-t-2 border-[#c8102e]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Produit original certifié</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Livraison partout au Maroc</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Service client disponible</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Paiement à la réception</span>
          </div>
        </div>
      </div>

    </div>
  );
};
