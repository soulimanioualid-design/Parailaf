import React, { useState } from 'react';
import { 
  Flame, 
  ShoppingBag,
  Eye,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Zap,
  PhoneCall,
  MessageCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { BRAND_CONFIG } from '../data/config';
import flyerImage from '../assets/images/freestyle_promo_flyer_1788255081953.jpg';

interface FlyerPosterProps {
  onZoom?: () => void;
  showTabs?: boolean;
}

export const FlyerPoster: React.FC<FlyerPosterProps> = ({ onZoom, showTabs = true }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [viewMode, setViewMode] = useState<'image' | 'interactive'>('image');

  const pack4 = PRODUCTS.find(p => p.id === 'pack-4-fsl2-plus') || PRODUCTS[0];
  const pack10 = PRODUCTS.find(p => p.id === 'pack-10-fsl2-plus') || PRODUCTS[1];
  const libre3 = PRODUCTS.find(p => p.id === 'fsl3-plus-nouveau') || PRODUCTS[2];
  const omnipod = PRODUCTS.find(p => p.id === 'omnipod-5-pods-10pack') || PRODUCTS[3];
  const lecteur = PRODUCTS.find(p => p.id === 'fsl2-lecteur-officiel') || PRODUCTS[4];
  const patchs = PRODUCTS.find(p => p.id === 'patch-fixation-pack-10') || PRODUCTS[5];
  const lingettes = PRODUCTS.find(p => p.id === 'lingettes-alcoolisees-100') || PRODUCTS[6];
  const trousse = PRODUCTS.find(p => p.id === 'trousse-transport-rigide') || PRODUCTS[7];

  const handleOrder = (product: typeof pack4, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border-4 border-red-600 overflow-hidden text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] relative group">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-3 px-4 text-center relative shadow-md">
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-wider uppercase font-heading drop-shadow-sm">
            EXCLUSIVITÉ
          </h2>
          <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
        </div>

        {onZoom && (
          <button
            onClick={onZoom}
            className="absolute right-3 top-2.5 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full text-xs transition cursor-pointer flex items-center gap-1 font-bold"
            title="Agrandir en plein écran"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px]">Plein écran</span>
          </button>
        )}
      </div>

      {/* Optional Mode Switcher: Image View vs Interactive Breakdown */}
      {showTabs && (
        <div className="bg-slate-100 p-1.5 flex items-center justify-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setViewMode('image')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'image'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Image Officielle</span>
          </button>
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'interactive'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vue Interactive & Commandes</span>
          </button>
        </div>
      )}

      {/* Main Flyer Display Area */}
      {viewMode === 'image' ? (
        <div className="relative bg-slate-100 flex flex-col items-center">
          {/* Main Poster Image */}
          <div className="relative w-full cursor-pointer overflow-hidden" onClick={onZoom}>
            <img 
              src={flyerImage} 
              alt="Affiche Promotionnelle Exclusivité FreeStyle Libre Maroc" 
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Subtle Overlay Hint on hover */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                Cliquez pour agrandir
              </span>
            </div>
          </div>

          {/* Quick Action Floating Bar below image */}
          <div className="w-full p-3 bg-white border-t border-slate-200">
            <p className="text-center text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Commander un pack de l'affiche :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleOrder(pack4)}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-900 p-2 rounded-xl text-center transition cursor-pointer"
              >
                <span className="block text-[10px] font-black uppercase text-amber-900">Pack 4 Pièces</span>
                <span className="block text-sm font-black text-red-600">540 DH</span>
              </button>

              <button
                onClick={() => handleOrder(pack10)}
                className="bg-red-50 hover:bg-red-100 border border-red-300 text-slate-900 p-2 rounded-xl text-center transition cursor-pointer"
              >
                <span className="block text-[10px] font-black uppercase text-red-900">Pack 10 Pièces</span>
                <span className="block text-sm font-black text-red-600">530 DH</span>
              </button>

              <button
                onClick={() => handleOrder(libre3)}
                className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-slate-900 p-2 rounded-xl text-center transition cursor-pointer"
              >
                <span className="block text-[10px] font-black uppercase text-[#002f6c]">Libre 3 PLUS</span>
                <span className="block text-sm font-black text-slate-900">800 DH</span>
              </button>

              <button
                onClick={() => handleOrder(omnipod)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 p-2 rounded-xl text-center transition cursor-pointer"
              >
                <span className="block text-[10px] font-black uppercase text-slate-700">Omnipod 5</span>
                <span className="block text-sm font-black text-slate-900">3000 DH</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Breakdown View */
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Top Product Showcase (FreeStyle Libre 2 PLUS) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            <div className="sm:col-span-7 space-y-2.5 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#002f6c] leading-none">
                  FreeStyle
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Libre 2
                  </span>
                  <span className="bg-[#002f6c] text-white px-2 py-0.5 rounded-md text-xl sm:text-2xl font-black">
                    PLUS
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                Une liberté au quotidien, un suivi en toute simplicité.
              </p>

              <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                <p>• <strong>Jusqu'à 15 jours</strong> de suivi continu</p>
                <p>• Lecture facile avec <strong>l'application LibreLink</strong></p>
                <p>• <strong>Alertes en temps réel</strong> pour plus de sérénité</p>
                <p>• Des décisions éclairées pour mieux agir</p>
              </div>
            </div>

            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
              <div className="w-full text-center space-y-2">
                <span className="bg-amber-400 text-slate-950 font-black text-xs py-1 px-3 rounded-lg shadow-xs inline-block">
                  BOÎTE SCELLÉE ABBOTT
                </span>
                <div className="w-20 h-20 mx-auto rounded-full bg-white border-4 border-amber-400 flex items-center justify-center shadow-md">
                  <div className="text-center">
                    <span className="block text-[10px] font-extrabold text-[#002f6c]">FreeStyle</span>
                    <span className="block text-sm font-black text-slate-900">Libre 2</span>
                    <span className="block text-[9px] font-bold bg-[#002f6c] text-white rounded px-1">PLUS</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-700">Autonomie 15 Jours</p>
              </div>
            </div>

          </div>

          {/* Central OFFRES SPÉCIALES */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="inline-block bg-[#002f6c] text-white font-black text-xs sm:text-sm px-6 py-1.5 rounded-full shadow uppercase tracking-wider border-2 border-red-500">
                OFFRES SPÉCIALES
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* 4 PIÈCES */}
              <div 
                onClick={() => handleOrder(pack4)}
                className="bg-white rounded-2xl p-4 border-2 border-amber-400 shadow-md hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-3xl font-black text-slate-900">4 </span>
                    <span className="text-xs font-black text-slate-600 uppercase">PIÈCES</span>
                    <p className="text-[11px] text-slate-500 font-semibold">FreeStyle Libre 2 PLUS</p>
                  </div>
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">
                    Top Vente
                  </span>
                </div>

                <div className="my-3 py-2 bg-amber-50/80 rounded-xl text-center border border-amber-200">
                  <div className="text-3xl font-black text-red-600">
                    540 <span className="text-base font-bold">DH</span>
                  </div>
                  <span className="inline-block bg-[#002f6c] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md mt-1">
                    135 DH / PIÈCE
                  </span>
                </div>

                <button 
                  onClick={(e) => handleOrder(pack4, e)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Commander 4 Pièces</span>
                </button>
              </div>

              {/* 10 PIÈCES */}
              <div 
                onClick={() => handleOrder(pack10)}
                className="bg-white rounded-2xl p-4 border-2 border-red-500 shadow-md hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-3xl font-black text-slate-900">10 </span>
                    <span className="text-xs font-black text-slate-600 uppercase">PIÈCES</span>
                    <p className="text-[11px] text-slate-500 font-semibold">FreeStyle Libre 2 PLUS</p>
                  </div>
                  <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded animate-pulse">
                    Mega Éco
                  </span>
                </div>

                <div className="my-3 py-2 bg-red-50/80 rounded-xl text-center border border-red-200">
                  <div className="text-3xl font-black text-red-600">
                    530 <span className="text-base font-bold">DH</span>
                  </div>
                  <span className="inline-block bg-[#002f6c] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md mt-1">
                    53 DH / PIÈCE
                  </span>
                </div>

                <button 
                  onClick={(e) => handleOrder(pack10, e)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Commander 10 Pièces</span>
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* FreeStyle Libre 3 PLUS */}
            <div 
              onClick={() => handleOrder(libre3)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:border-red-400 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="bg-[#002f6c] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  NOUVEAU !
                </span>
                <span className="text-base font-black text-red-600">800 DH</span>
              </div>
              <h4 className="text-sm font-black text-slate-900">FreeStyle Libre 3 PLUS</h4>
              <p className="text-[11px] text-slate-600 mt-1 mb-2">Suivi continu 15 jours sans scan, taille réduite.</p>
              <button 
                onClick={(e) => handleOrder(libre3, e)}
                className="w-full bg-slate-900 hover:bg-red-600 text-white text-xs font-bold py-1.5 rounded-lg transition"
              >
                Commander Libre 3 PLUS
              </button>
            </div>

            {/* Omnipod 5 */}
            <div 
              onClick={() => handleOrder(omnipod)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:border-amber-400 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  OMNIPOD 5
                </span>
                <span className="text-base font-black text-red-600">3000 DH</span>
              </div>
              <h4 className="text-sm font-black text-slate-900">Pods Omnipod 5 (Pack 10)</h4>
              <p className="text-[11px] text-slate-600 mt-1 mb-2">Système de pompe automatisée sans tubulure.</p>
              <button 
                onClick={(e) => handleOrder(omnipod, e)}
                className="w-full bg-[#002f6c] hover:bg-red-600 text-white text-xs font-bold py-1.5 rounded-lg transition"
              >
                Commander Omnipod 5
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Footer Banner */}
      <div className="bg-[#002f6c] text-white p-3.5 space-y-2 border-t-2 border-red-500">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <span className="text-amber-300">Paiement à la livraison :</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Virement bancaire</span>
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px] font-black">Espèces</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Chèque</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-200 text-center pt-2 border-t border-white/10">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Produit certifié d'origine</span>
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
            <span>Garantie authenticité</span>
          </div>
        </div>
      </div>

    </div>
  );
};
