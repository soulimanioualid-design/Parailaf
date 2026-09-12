import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STANDALONE_PROMO_550, STANDALONE_PROMO_850, STANDALONE_PROMO_3000 } from '../data/products';
import { BRAND_CONFIG } from '../data/config';
import { Product } from '../types';
import imgPromoFSL2 from '../assets/images/active_parailaf_promo_flyer_custom_img.jpg';
import imgPromoFSL3 from '../assets/images/active_parailaf_promo_flyer_fsl3_custom_img.jpg';
import imgPromoOmnipod from '../assets/images/active_parailaf_promo_flyer_omnipod_custom_img.jpg';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';

interface PromoFlyerItemProps {
  product: Product;
  defaultImage: string;
  storageKey: string;
  badgeLabel: string;
  title: string;
  versionHighlight: string;
  subtitle: string;
  durationLabel: string;
  whatsappMessageText: string;
  headerGradientClass: string;
  badgeColorClass: string;
  highlights?: Array<{ title: string; desc: string }>;
  certLabel?: string;
}

const PromoFlyerCard: React.FC<PromoFlyerItemProps> = ({
  product,
  defaultImage,
  storageKey,
  badgeLabel,
  title,
  versionHighlight,
  subtitle,
  durationLabel,
  whatsappMessageText,
  headerGradientClass,
  badgeColorClass,
  highlights,
  certLabel = "Dispositif Médical Certifié Abbott",
}) => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const [customImage, setCustomImage] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved || defaultImage;
    } catch {
      return defaultImage;
    }
  });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    try {
      // Local first
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCustomImage(saved);
      }
      
      // Firestore listener
      const unsub = onSnapshot(doc(db, 'images', storageKey), (snap) => {
        if (snap.exists() && snap.data().data) {
          setCustomImage(snap.data().data);
          try { localStorage.setItem(storageKey, snap.data().data); } catch {}
        } else {
          setCustomImage(null);
          try { localStorage.removeItem(storageKey); } catch {}
        }
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, [storageKey]);

  const handleOrderNow = () => {
    addToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const whatsappUrl = `https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(whatsappMessageText)}`;
  const currentImageSrc = customImage || defaultImage;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl overflow-hidden flex flex-col h-full">
      
      {/* Header Bar of the Card */}
      <div className={`${headerGradientClass} text-white px-4 sm:px-6 py-3 flex items-center justify-center shadow-sm text-center`}>
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight font-heading leading-tight">
          {title} <span className="text-white/90">{versionHighlight}</span>
        </h3>
      </div>

      {/* Subtitle inside Card */}
      {subtitle && (
        <div className="pt-4 pb-2 px-4 text-center flex flex-col justify-center">
          <p className="text-slate-600 text-xs sm:text-sm font-medium mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}

      {/* Main Visual Image (Prominently Displayed) */}
      <div className="relative bg-slate-100 flex items-center justify-center p-2 sm:p-4 group flex-grow">
        <div 
          onClick={() => setIsZoomed(true)} 
          className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md cursor-pointer relative"
        >
          <img 
            src={currentImageSrc} 
            alt={`${title} ${versionHighlight} - ${badgeLabel}`} 
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain max-h-[580px] sm:max-h-[640px] block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Click to Zoom Overlay Hint */}
          <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5" />
              Cliquez
            </span>
          </div>
        </div>
      </div>

      {/* Key Advantages Summary from Flyer */}
      <div className="bg-amber-50/70 border-t border-b border-amber-200/80 px-4 py-3.5 mt-auto">
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          {highlights && highlights.length > 0 ? (
            highlights.map((h, i) => (
              <div key={i} className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">{h.title}</p>
                <p className="text-[11px] text-slate-500">{h.desc}</p>
              </div>
            ))
          ) : (
            <>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Sans Piqûres</p>
                <p className="text-[11px] text-slate-500">Mesure continue 24h/24</p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Alertes Directes</p>
                <p className="text-[11px] text-slate-500">Hypo & Hyperglycémie</p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">{durationLabel}</p>
                <p className="text-[11px] text-slate-500">Liberté au quotidien</p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="font-extrabold text-slate-900">Application Mobile</p>
                <p className="text-[11px] text-slate-500">Suivi facile LibreLink</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons: Commande & WhatsApp */}
      <div className="p-5 bg-white space-y-4 text-center">
        
        {/* The 2 Requested Buttons */}
        <div className="flex flex-col items-stretch justify-center gap-3.5 max-w-xl mx-auto pt-2">
          
          {/* Button 1: Commande Directe */}
          <button
            onClick={handleOrderNow}
            className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-600/25 flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Passer Commande</span>
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
              alt={`${title} ${versionHighlight} - Agrandie`} 
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
                <span>Commander</span>
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

    </div>
  );
};

export const SoloPromoFlyerSection: React.FC = () => {
  const { allProducts } = useCart();
  const prodFSL2 = allProducts.find(p => p.id === STANDALONE_PROMO_550.id) || STANDALONE_PROMO_550;
  const prodFSL3 = allProducts.find(p => p.id === STANDALONE_PROMO_850.id) || STANDALONE_PROMO_850;
  const prodOmnipod = allProducts.find(p => p.id === STANDALONE_PROMO_3000.id) || STANDALONE_PROMO_3000;

  return (
    <section id="offre-exclusive-affiche" className="py-12 sm:py-16 bg-gradient-to-b from-slate-100 via-white to-slate-50 border-t-2 border-slate-200 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600 animate-pulse" />
            <span>Offres Spéciales Exclusives • Affiches Promo</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-heading">
            Promotions <span className="text-red-600">Officielles & Exclusives</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Commandez directement au prix promotionnel affiché avec livraison express partout au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1er Produit Affiche : FreeStyle Libre 2 PLUS */}
          <PromoFlyerCard
            product={prodFSL2}
            defaultImage={imgPromoFSL2}
            storageKey="parailaf_promo_flyer_custom_img"
            badgeLabel={`PROMOTION ${prodFSL2.price} DH`}
            title="FreeStyle Libre 2"
            versionHighlight=""
            subtitle={prodFSL2.shortDescription || "Système officiel de mesure du glucose en continu 24h/24 sans piqûre au bout des doigts."}
            durationLabel="Jusqu’à 14-15 Jours"
            whatsappMessageText={`Bonjour, je souhaite commander l'Offre Spéciale ${prodFSL2.name} à ${prodFSL2.price} DH.`}
            headerGradientClass="bg-gradient-to-r from-red-700 via-red-600 to-red-700"
            badgeColorClass="bg-amber-400"
            certLabel="Dispositif Médical Certifié Abbott"
          />
          {/* 2ème Produit Affiche : FreeStyle Libre 3 PLUS */}
          <PromoFlyerCard
            product={prodFSL3}
            defaultImage={imgPromoFSL3}
            storageKey="parailaf_promo_flyer_fsl3_custom_img"
            badgeLabel={`PROMOTION ${prodFSL3.price} DH`}
            title="FreeStyle Libre 3"
            versionHighlight=""
            subtitle={prodFSL3.shortDescription || "Capteur nouvelle génération ultra-discret, mesure continue sans piqûres, alertes en temps réel."}
            durationLabel="Jusqu’à 15 Jours"
            whatsappMessageText={`Bonjour, je souhaite commander l'Offre Spéciale ${prodFSL3.name} à ${prodFSL3.price} DH.`}
            headerGradientClass="bg-gradient-to-r from-slate-900 via-slate-800 to-red-700"
            badgeColorClass="bg-amber-400"
            certLabel="Dispositif Médical Certifié Abbott"
          />
          {/* 3ème Produit Affiche : Omnipod 5 (Boîte de 5 Pods) */}
          <PromoFlyerCard
            product={prodOmnipod}
            defaultImage={imgPromoOmnipod}
            storageKey="parailaf_promo_flyer_omnipod_custom_img"
            badgeLabel={`PROMOTION ${prodOmnipod.price} DH`}
            title="Omnipod DASH"
            versionHighlight=""

            subtitle={prodOmnipod.shortDescription || "Système automatisé d'administration d'insuline tubeless (sans tubulure) de nouvelle génération."}
            durationLabel="Pack 5 Pods (15 Jours)"
            whatsappMessageText={`Bonjour, je souhaite commander l'Offre Spéciale ${prodOmnipod.name} à ${prodOmnipod.price} DH.`}
            headerGradientClass="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700"
            badgeColorClass="bg-amber-300"
            certLabel="Dispositif Médical Certifié Insulet"
            highlights={[
              { title: "Sans Tubes", desc: "Design tubeless discret" },
              { title: "Régulation Auto", desc: "Ajuste toutes les 5 min" },
              { title: "Boîte 5 Pods", desc: "Jusqu'à 15 jours de gestion" },
              { title: "Étanche IP28", desc: "Eau jusqu'à 7,6 mètres" }
            ]}
          />
        </div>

      </div>

    </section>
  );
};
