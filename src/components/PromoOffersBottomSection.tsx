import React from 'react';
import { 
  Sparkles, 
  Gift, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Truck, 
  Banknote,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { BRAND_CONFIG } from '../data/config';

export const PromoOffersBottomSection: React.FC = () => {
  const { addToCart, setIsCartOpen } = useCart();

  const pack4 = PRODUCTS.find(p => p.id === 'pack-4-fsl2-plus') || PRODUCTS[0];
  const pack10 = PRODUCTS.find(p => p.id === 'pack-10-fsl2-plus') || PRODUCTS[1];
  const libre3 = PRODUCTS.find(p => p.id === 'fsl3-plus-nouveau') || PRODUCTS[2];
  const omnipod = PRODUCTS.find(p => p.id === 'omnipod-5-pods-10pack') || PRODUCTS[3];

  return (
    <section id="offres-promo" className="py-14 sm:py-16 bg-gradient-to-b from-slate-100/90 via-white to-slate-50 border-t border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600 animate-pulse" />
            <span>Offres Exclusives & Tarifs Promotionnels</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-950 font-heading">
            Capteurs & Lecteurs <br />
            <span className="text-[#002f6c]">FreeStyle Libre</span> <span className="text-red-600">2 & 3 PLUS</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Suivez votre glycémie en temps réel <strong>sans piqûre au doigt</strong>. Profitez de nos packs promotionnels avec <strong>livraison rapide à domicile et paiement en espèces à la livraison</strong>.
          </p>
        </div>

        {/* Quick Flyer Highlights Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-xl space-y-6 max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                  Sélection Rapide des Meilleurs Packs
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Cliquez sur un pack pour commander immédiatement
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Stock Disponible au Maroc
            </span>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Pack 4 */}
            <div 
              onClick={() => {
                addToCart(pack4, 1);
                setIsCartOpen(true);
              }}
              className="bg-amber-50/70 hover:bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 hover:border-amber-400 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-xs text-amber-950 font-black uppercase tracking-wider">Pack 4 Pièces</p>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">POPULAIRE</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">FreeStyle Libre 2 PLUS</p>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-black text-red-600">540 DH</span>
                  <span className="text-xs text-slate-600 font-bold">135 DH/u</span>
                </div>
              </div>
              <p className="text-xs text-red-600 font-black mt-3 pt-2 border-t border-amber-200 group-hover:underline flex items-center justify-between">
                <span>Commander</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>

            {/* Pack 10 */}
            <div 
              onClick={() => {
                addToCart(pack10, 1);
                setIsCartOpen(true);
              }}
              className="bg-red-50/70 hover:bg-red-50 p-4 rounded-2xl border-2 border-red-300 hover:border-red-400 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-xs text-red-950 font-black uppercase tracking-wider">Pack 10 Pièces</p>
                  <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">ÉCO MAX</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">5 mois de surveillance</p>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-black text-red-600">530 DH</span>
                  <span className="text-xs text-slate-600 font-bold">53 DH/u</span>
                </div>
              </div>
              <p className="text-xs text-red-600 font-black mt-3 pt-2 border-t border-red-200 group-hover:underline flex items-center justify-between">
                <span>Commander</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>

            {/* Libre 3 PLUS */}
            <div 
              onClick={() => {
                addToCart(libre3, 1);
                setIsCartOpen(true);
              }}
              className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 hover:border-[#002f6c] transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-xs text-[#002f6c] font-black uppercase tracking-wider">Libre 3 PLUS</p>
                  <span className="text-[10px] bg-[#002f6c] text-white font-bold px-2 py-0.5 rounded-full">NOUVEAU</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Mesure 1 seconde</p>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-black text-slate-900">800 DH</span>
                  <span className="text-xs text-slate-500 font-bold">Unité 15J</span>
                </div>
              </div>
              <p className="text-xs text-[#002f6c] font-black mt-3 pt-2 border-t border-slate-200 group-hover:underline flex items-center justify-between">
                <span>Commander</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>

            {/* Omnipod 5 */}
            <div 
              onClick={() => {
                addToCart(omnipod, 1);
                setIsCartOpen(true);
              }}
              className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-xs text-slate-900 font-black uppercase tracking-wider">Omnipod 5</p>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">10 PODS</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Sans tubulure (Tubeless)</p>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-black text-slate-900">3000 DH</span>
                  <span className="text-xs text-slate-500 font-bold">Boîte 10</span>
                </div>
              </div>
              <p className="text-xs text-[#002f6c] font-black mt-3 pt-2 border-t border-slate-200 group-hover:underline flex items-center justify-between">
                <span>Commander</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>

          </div>

          {/* Main Action Buttons */}
          <div className="pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3.5">
              <button
                onClick={() => {
                  addToCart(pack4, 1);
                  setIsCartOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Commander le Pack 4 Pièces (540 DH)</span>
              </button>

              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent("Bonjour Parailaf, je souhaite commander les capteurs FreeStyle Libre de l'affiche promotionnelle.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-base"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Commander par WhatsApp ({BRAND_CONFIG.displayPhone})</span>
              </a>
            </div>

            {/* Reassurance Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-600 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Paiement à la livraison
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                Produits certifiés d'origine
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                Livraison express partout au Maroc
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
