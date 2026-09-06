import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Layers, 
  ShoppingBag,
  Eye,
  Trash2
} from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { compressImageFile } from '../utils/imageCompressor';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

import defaultHeroFlyer from '../assets/images/freestyle_promo_flyer_1788255081953.jpg';
import defaultFlyerFL2 from '../assets/images/freestyle_promo_oujda_1788441986495.jpg';
import defaultFlyerFL3 from '../assets/images/freestyle_libre3_promo_flyer_1788452962096.jpg';
import defaultFlyerOmnipod from '../assets/images/omnipod_5_promo_flyer_1788454250818.jpg';

export const AdminMediaManager: React.FC = () => {
  const { showToast, productCustomImages, updateProductImage } = useCart();

  // Sub tab inside Media Manager
  const [mediaSubTab, setMediaSubTab] = useState<'banners' | 'promos' | 'products'>('banners');

  // Hero Banners State
  const [heroImages, setHeroImages] = useState<{ desktop: string | null; mobile: string | null }>({
    desktop: null,
    mobile: null,
  });

  // Solo Promo Flyers State
  const [promoFL2, setPromoFL2] = useState<string | null>(null);
  const [promoFL3, setPromoFL3] = useState<string | null>(null);
  const [promoOmnipod, setPromoOmnipod] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Hidden File Input Refs
  const desktopHeroRef = useRef<HTMLInputElement>(null);
  const mobileHeroRef = useRef<HTMLInputElement>(null);
  const promoFL2Ref = useRef<HTMLInputElement>(null);
  const promoFL3Ref = useRef<HTMLInputElement>(null);
  const promoOmnipodRef = useRef<HTMLInputElement>(null);
  const productFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 1. Subscribe to Hero Banner
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'images', 'parailaf_flyer_image_custom'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setHeroImages({
            desktop: data.desktop || data.data || null,
            mobile: data.mobile || data.data || null,
          });
        } else {
          setHeroImages({ desktop: null, mobile: null });
        }
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 2. Subscribe to Solo Promos
  useEffect(() => {
    try {
      const u1 = onSnapshot(doc(db, 'images', 'parailaf_flyer_fl2'), (s) => setPromoFL2(s.exists() && s.data().data ? s.data().data : null));
      const u2 = onSnapshot(doc(db, 'images', 'parailaf_flyer_fl3'), (s) => setPromoFL3(s.exists() && s.data().data ? s.data().data : null));
      const u3 = onSnapshot(doc(db, 'images', 'parailaf_flyer_omnipod5'), (s) => setPromoOmnipod(s.exists() && s.data().data ? s.data().data : null));

      return () => {
        u1();
        u2();
        u3();
      };
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Upload Handlers
  const handleUploadHero = async (device: 'desktop' | 'mobile', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingAction(`hero_${device}`);
      showToast("Optimisation et envoi de l'image...");
      const maxWidth = device === 'desktop' ? 1920 : 1200;
      const compressed = await compressImageFile(file, maxWidth, 0.85);

      const updated = { ...heroImages, [device]: compressed };
      setHeroImages(updated);
      try {
        localStorage.setItem(`parailaf_flyer_${device}`, compressed);
      } catch {}

      await setDoc(doc(db, 'images', 'parailaf_flyer_image_custom'), {
        desktop: updated.desktop || "",
        mobile: updated.mobile || "",
        updatedAt: new Date().toISOString()
      }, { merge: true });

      showToast(`✓ Bannière Hero (${device === 'desktop' ? 'PC' : 'Mobile'}) mise à jour !`);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la mise à jour de l'image.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetHero = async (device: 'desktop' | 'mobile') => {
    try {
      setLoadingAction(`hero_reset_${device}`);
      const updated = { ...heroImages, [device]: null };
      setHeroImages(updated);
      try {
        localStorage.removeItem(`parailaf_flyer_${device}`);
      } catch {}

      await setDoc(doc(db, 'images', 'parailaf_flyer_image_custom'), {
        desktop: updated.desktop || "",
        mobile: updated.mobile || "",
        updatedAt: new Date().toISOString()
      }, { merge: true });

      showToast(`✓ Bannière Hero (${device === 'desktop' ? 'PC' : 'Mobile'}) réinitialisée.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadSoloPromo = async (key: string, name: string, file: File) => {
    try {
      setLoadingAction(`promo_${key}`);
      showToast(`Optimisation de l'affiche ${name}...`);
      const compressed = await compressImageFile(file, 1400, 0.85);

      try {
        localStorage.setItem(key, compressed);
      } catch {}

      await setDoc(doc(db, 'images', key), {
        data: compressed,
        updatedAt: new Date().toISOString()
      });

      showToast(`✓ Affiche ${name} enregistrée et diffusée en direct !`);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la mise à jour.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetSoloPromo = async (key: string, name: string) => {
    try {
      setLoadingAction(`promo_reset_${key}`);
      try {
        localStorage.removeItem(key);
      } catch {}

      await setDoc(doc(db, 'images', key), {
        data: "",
        updatedAt: new Date().toISOString()
      });

      showToast(`✓ Affiche ${name} réinitialisée à l'image par défaut.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadProduct = async (productId: string, productName: string, file: File) => {
    try {
      setLoadingAction(`prod_${productId}`);
      showToast(`Optimisation de l'image pour ${productName}...`);
      const compressed = await compressImageFile(file, 1000, 0.85);
      await updateProductImage(productId, compressed);
      showToast(`✓ Image du produit "${productName}" mise à jour !`);
    } catch (err) {
      console.error(err);
      showToast("Erreur de sauvegarde de l'image produit.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetProduct = async (productId: string, productName: string) => {
    try {
      setLoadingAction(`prod_reset_${productId}`);
      await updateProductImage(productId, null);
      showToast(`✓ Image du produit "${productName}" réinitialisée.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/30 text-red-300 text-xs font-bold border border-red-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Administration Sécurisée
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">
            Gestionnaire des Médias & Affiches
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Modifiez ici toutes les photos et affiches du site. Les visiteurs sur la vitrine publique ne peuvent pas modifier les images : les changements se font uniquement depuis ce panneau d'administration et sont synchronisés en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300">Synchronisation Cloud Active</span>
        </div>
      </div>

      {/* Media Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setMediaSubTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            mediaSubTab === 'banners'
              ? 'bg-[#002f6c] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Affiche Principale Hero (PC & Mobile)</span>
        </button>

        <button
          onClick={() => setMediaSubTab('promos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            mediaSubTab === 'promos'
              ? 'bg-[#002f6c] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Affiches Spéciales (Solo Promos)</span>
        </button>

        <button
          onClick={() => setMediaSubTab('products')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            mediaSubTab === 'products'
              ? 'bg-[#002f6c] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Images Produits Catalogue ({PRODUCTS.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: HERO BANNERS (DESKTOP & MOBILE) */}
      {mediaSubTab === 'banners' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              L'affiche principale Hero s'adapte à l'écran de l'utilisateur. Vous pouvez définir une image spécifique pour les ordinateurs (<strong>PC / Desktop</strong>, format paysage 1920 × 700 recommandé) et une autre pour les téléphones (<strong>Mobile</strong>, format portrait).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Desktop Banner Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#002f6c]" />
                    <h4 className="font-black text-slate-900 text-base">Affiche Ordinateur (PC)</h4>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    heroImages.desktop ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {heroImages.desktop ? 'Image Personnalisée Active' : 'Image Par Défaut'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Affichée sur les écrans PC et tablettes larges. Recommandé : 1920 × 700 px (couvre toute la largeur).
                </p>

                {/* Preview Thumbnail */}
                <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                  <img
                    src={heroImages.desktop || defaultHeroFlyer}
                    alt="Aperçu Desktop"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-bold">
                    Aperçu PC
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <input
                  type="file"
                  ref={desktopHeroRef}
                  onChange={(e) => handleUploadHero('desktop', e)}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  disabled={loadingAction === 'hero_desktop'}
                  onClick={() => desktopHeroRef.current?.click()}
                  className="flex-1 bg-[#002f6c] hover:bg-[#002352] disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{loadingAction === 'hero_desktop' ? 'Envoi...' : 'Téléverser Image PC'}</span>
                </button>

                {heroImages.desktop && (
                  <button
                    disabled={loadingAction === 'hero_reset_desktop'}
                    onClick={() => handleResetHero('desktop')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Rétablir</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Banner Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-red-600" />
                    <h4 className="font-black text-slate-900 text-base">Affiche Téléphone (Mobile)</h4>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    heroImages.mobile ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {heroImages.mobile ? 'Image Personnalisée Active' : 'Image Par Défaut'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Affichée sur téléphones mobiles. Format vertical ou carré adapté aux écrans verticaux.
                </p>

                {/* Preview Thumbnail */}
                <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                  <img
                    src={heroImages.mobile || defaultHeroFlyer}
                    alt="Aperçu Mobile"
                    className="h-full object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-bold">
                    Aperçu Mobile
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <input
                  type="file"
                  ref={mobileHeroRef}
                  onChange={(e) => handleUploadHero('mobile', e)}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  disabled={loadingAction === 'hero_mobile'}
                  onClick={() => mobileHeroRef.current?.click()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{loadingAction === 'hero_mobile' ? 'Envoi...' : 'Téléverser Image Mobile'}</span>
                </button>

                {heroImages.mobile && (
                  <button
                    disabled={loadingAction === 'hero_reset_mobile'}
                    onClick={() => handleResetHero('mobile')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Rétablir</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: SOLO PROMO FLYERS */}
      {mediaSubTab === 'promos' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-500">
            Ces 3 affiches correspondent aux sections d'offres spéciales en bas de page (FreeStyle Libre 2 PLUS, FreeStyle Libre 3 PLUS et Omnipod 5).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. FreeStyle Libre 2 PLUS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm">FreeStyle Libre 2 PLUS</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">550 DH</span>
                </div>
                <div className="w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  <img
                    src={promoFL2 || defaultFlyerFL2}
                    alt="FreeStyle Libre 2 PLUS"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="file"
                  ref={promoFL2Ref}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadSoloPromo('parailaf_flyer_fl2', 'FreeStyle Libre 2 PLUS', f);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => promoFL2Ref.current?.click()}
                  className="flex-1 bg-[#002f6c] hover:bg-[#002352] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Remplacer</span>
                </button>

                {promoFL2 && (
                  <button
                    onClick={() => handleResetSoloPromo('parailaf_flyer_fl2', 'FreeStyle Libre 2 PLUS')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. FreeStyle Libre 3 PLUS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm">FreeStyle Libre 3 PLUS</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">850 DH</span>
                </div>
                <div className="w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  <img
                    src={promoFL3 || defaultFlyerFL3}
                    alt="FreeStyle Libre 3 PLUS"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="file"
                  ref={promoFL3Ref}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadSoloPromo('parailaf_flyer_fl3', 'FreeStyle Libre 3 PLUS', f);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => promoFL3Ref.current?.click()}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Remplacer</span>
                </button>

                {promoFL3 && (
                  <button
                    onClick={() => handleResetSoloPromo('parailaf_flyer_fl3', 'FreeStyle Libre 3 PLUS')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Omnipod 5 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm">Omnipod 5 (Boîte de 5 Pods)</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">3000 DH</span>
                </div>
                <div className="w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  <img
                    src={promoOmnipod || defaultFlyerOmnipod}
                    alt="Omnipod 5"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="file"
                  ref={promoOmnipodRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadSoloPromo('parailaf_flyer_omnipod5', 'Omnipod 5', f);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => promoOmnipodRef.current?.click()}
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Remplacer</span>
                </button>

                {promoOmnipod && (
                  <button
                    onClick={() => handleResetSoloPromo('parailaf_flyer_omnipod5', 'Omnipod 5')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 3: CATALOG PRODUCTS */}
      {mediaSubTab === 'products' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Personnalisez la photo principale de chaque produit dans le catalogue public. Les modifications s'appliquent immédiatement sur les cartes produits et la modale de détails.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.map((prod) => {
              const currentImg = (productCustomImages && productCustomImages[prod.id]) || prod.image;
              const isCustom = !!(productCustomImages && productCustomImages[prod.id]);

              return (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="h-36 w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden mb-2 relative flex items-center justify-center">
                      <img
                        src={currentImg}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {isCustom && (
                        <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          Personnalisée
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</h5>
                    <p className="text-[11px] font-black text-red-600">{prod.price} DH</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={(el) => (productFileRefs.current[prod.id] = el)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadProduct(prod.id, prod.name, f);
                      }}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      onClick={() => productFileRefs.current[prod.id]?.click()}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Changer</span>
                    </button>

                    {isCustom && (
                      <button
                        onClick={() => handleResetProduct(prod.id, prod.name)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold p-2 rounded-xl transition cursor-pointer"
                        title="Rétablir l'image originale"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
