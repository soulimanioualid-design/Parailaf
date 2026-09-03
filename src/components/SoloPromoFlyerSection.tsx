import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Phone, 
  Maximize2, 
  X, 
  Upload, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { BRAND_CONFIG } from '../data/config';
import imgPromoOujda from '../assets/images/freestyle_promo_oujda_1788441986495.jpg';

export const SoloPromoFlyerSection: React.FC = () => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find the 550 DH promo product
  const promoProduct = PRODUCTS.find(p => p.id === 'fsl2-plus-promo-550') || PRODUCTS[0];

  // Retrieve any custom uploaded flyer from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('parailaf_promo_flyer_custom_img');
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
            localStorage.setItem('parailaf_promo_flyer_custom_img', result);
          } catch {
            // ignore
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderNow = () => {
    addToCart(promoProduct, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Parailaf Oujda, je souhaite commander l'Offre Spéciale FreeStyle Libre 2 PLUS à 550 DH de l'affiche promotionnelle.`
  );
  const whatsappUrl = `https://wa.me/${BRAND_CONFIG.whatsapp}?text=${whatsappMessage}`;

  const currentImageSrc = customImage || imgPromoOujda;

  return (
    <section id="offre-exclusive-affiche" className="py-12 sm:py-16 bg-gradient-to-b from-slate-100 via-white to-slate-50 border-t-2 border-slate-200 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden File Input for Image Updating */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Title & Badge */}
        <div className="text-center mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600 animate-pulse" />
            <span>Offre Spéciale Exclusivité Affiche</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-heading">
            FreeStyle Libre 2 <span className="text-red-600">PLUS</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Système officiel de mesure du glucose en continu 24h/24 sans piqûre au bout des doigts.
          </p>
        </div>

        {/* The Standalone Card with Main Image + Buttons */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl overflow-hidden">
          
          {/* Header Bar of the Card */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                PROMOTION 550 DH
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white/95">
                PARAILAF — Lazaret, Oujda
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZoomed(true)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Agrandir l'affiche"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zoom</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Remplacer par une autre image"
              >
                <Upload className="w-3 h-3" />
                <span className="hidden sm:inline">Changer l'image</span>
              </button>
            </div>
          </div>

          {/* Main Visual Image (Prominently Displayed) */}
          <div className="relative bg-slate-100 flex items-center justify-center p-2 sm:p-4 group">
            <div 
              onClick={() => setIsZoomed(true)} 
              className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md cursor-pointer relative"
            >
              <img 
                src={currentImageSrc} 
                alt="Offre Spéciale FreeStyle Libre 2 PLUS - Promo 550 DH" 
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[580px] sm:max-h-[640px] block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Click to Zoom Overlay Hint */}
              <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Cliquez pour agrandir l'affiche
                </span>
              </div>
            </div>
          </div>

          {/* Key Advantages Summary from Flyer */}
          <div className="bg-amber-50/70 border-t border-b border-amber-200/80 px-4 sm:px-6 py-3.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Sans Piqûres</p>
                <p className="text-[11px] text-slate-500">Mesure continue 24h/24</p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Alertes Directes</p>
                <p className="text-[11px] text-slate-500">Hypo & Hyperglycémie</p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Jusqu’à 14-15 Jours</p>
                <p className="text-[11px] text-slate-500">Liberté au quotidien</p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Application Mobile</p>
                <p className="text-[11px] text-slate-500">Suivi facile LibreLink</p>
              </div>
            </div>
          </div>

          {/* Price & The Two Action Buttons: Commande & WhatsApp */}
          <div className="p-5 sm:p-7 bg-white space-y-4 text-center">
            
            {/* Price Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
                  550 DH
                </span>
                <span className="text-base text-slate-400 line-through font-bold">
                  750 DH
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                En stock • Paiement en espèces à la livraison
              </span>
            </div>

            {/* The 2 Requested Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3.5 max-w-xl mx-auto pt-2">
              
              {/* Button 1: Commande Directe */}
              <button
                onClick={handleOrderNow}
                className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-600/25 flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Passer Commande (550 DH)</span>
              </button>

              {/* Button 2: WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Commander par WhatsApp</span>
              </a>

            </div>

            {/* Reassurance Guarantees & Contact Info */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Truck className="w-4 h-4 text-blue-600" />
                Livraison rapide partout au Maroc
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Produit certifié d'origine scellé Abbott
              </span>
              <a 
                href={`tel:${BRAND_CONFIG.phone}`}
                className="flex items-center gap-1.5 font-bold text-red-600 hover:underline"
              >
                <Phone className="w-4 h-4" />
                {BRAND_CONFIG.displayPhone}
              </a>
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Direction Lazaret - Oujda
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox for Zoom */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[95vh] w-full flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute -top-12 right-0 sm:right-2 text-white/90 hover:text-white bg-white/20 p-2 rounded-full transition cursor-pointer"
              title="Fermer le zoom"
            >
              <X className="w-6 h-6" />
            </button>

            <img 
              src={currentImageSrc} 
              alt="Affiche Promotionnelle Agrandie" 
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
            />

            <div className="mt-3 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                  handleOrderNow();
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Commander (550 DH)</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
