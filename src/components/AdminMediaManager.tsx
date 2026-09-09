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
  Trash2,
  Link as LinkIcon,
  Search,
  X,
  ExternalLink,
  Video,
  Check
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

interface AdminMediaManagerProps {
  onPreviewSection?: (sectionId: string) => void;
}

interface UrlModalState {
  isOpen: boolean;
  targetType: 'hero_desktop' | 'hero_mobile' | 'promo_fl2' | 'promo_fl3' | 'promo_omnipod' | 'product' | 'video';
  targetId?: string;
  title: string;
  url: string;
}

export const AdminMediaManager: React.FC<AdminMediaManagerProps> = ({ onPreviewSection }) => {
  const { showToast, productCustomImages, updateProductImage } = useCart();

  // Sub tab inside Media Manager
  const [mediaSubTab, setMediaSubTab] = useState<'banners' | 'promos' | 'products' | 'video'>('banners');

  // Hero Banners State
  const [heroImages, setHeroImages] = useState<{ desktop: string | null; mobile: string | null }>({
    desktop: null,
    mobile: null,
  });

  // Solo Promo Flyers State
  const [promoFL2, setPromoFL2] = useState<string | null>(null);
  const [promoFL3, setPromoFL3] = useState<string | null>(null);
  const [promoOmnipod, setPromoOmnipod] = useState<string | null>(null);

  // Video Thumbnail State
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [dragOverCard, setDragOverCard] = useState<string | null>(null);

  // Product search and filter state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'freestyle-sensors' | 'freestyle-readers' | 'omnipod-pumps' | 'accessories'>('all');

  // Modal URL State
  const [urlModal, setUrlModal] = useState<UrlModalState>({
    isOpen: false,
    targetType: 'hero_desktop',
    title: '',
    url: '',
  });

  // Hidden File Input Refs
  const desktopHeroRef = useRef<HTMLInputElement>(null);
  const mobileHeroRef = useRef<HTMLInputElement>(null);
  const promoFL2Ref = useRef<HTMLInputElement>(null);
  const promoFL3Ref = useRef<HTMLInputElement>(null);
  const promoOmnipodRef = useRef<HTMLInputElement>(null);
  const videoThumbnailRef = useRef<HTMLInputElement>(null);
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
      const u4 = onSnapshot(doc(db, 'images', 'parailaf_video_thumbnail'), (s) => setVideoThumbnail(s.exists() && s.data()?.data ? s.data().data : null));

      return () => {
        u1();
        u2();
        u3();
        u4();
      };
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save Hero Banner (File or URL)
  const saveHeroImage = async (device: 'desktop' | 'mobile', imageValue: string | null) => {
    try {
      setLoadingAction(`hero_${device}`);
      const updated = { ...heroImages, [device]: imageValue };
      setHeroImages(updated);

      if (imageValue) {
        try { localStorage.setItem(`parailaf_flyer_${device}`, imageValue); } catch {}
      } else {
        try { localStorage.removeItem(`parailaf_flyer_${device}`); } catch {}
      }

      await setDoc(doc(db, 'images', 'parailaf_flyer_image_custom'), {
        desktop: updated.desktop || "",
        mobile: updated.mobile || "",
        updatedAt: new Date().toISOString()
      }, { merge: true });

      if (imageValue) {
        showToast(`✓ Bannière Hero (${device === 'desktop' ? 'PC' : 'Mobile'}) mise à jour avec succès !`);
      } else {
        showToast(`✓ Bannière Hero (${device === 'desktop' ? 'PC' : 'Mobile'}) réinitialisée.`);
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'enregistrement de l'image.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadHero = async (device: 'desktop' | 'mobile', file: File) => {
    try {
      setLoadingAction(`hero_${device}`);
      showToast("Optimisation et envoi de l'image...");
      const maxWidth = device === 'desktop' ? 1920 : 1200;
      const compressed = await compressImageFile(file, maxWidth, 0.85);
      await saveHeroImage(device, compressed);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la compression de l'image.");
      setLoadingAction(null);
    }
  };

  // Save Solo Promo (File or URL)
  const saveSoloPromo = async (key: string, name: string, imageValue: string | null) => {
    try {
      setLoadingAction(`promo_${key}`);
      if (imageValue) {
        try { localStorage.setItem(key, imageValue); } catch {}
        await setDoc(doc(db, 'images', key), {
          data: imageValue,
          updatedAt: new Date().toISOString()
        });
        showToast(`✓ Affiche "${name}" enregistrée et synchronisée !`);
      } else {
        try { localStorage.removeItem(key); } catch {}
        await setDoc(doc(db, 'images', key), {
          data: "",
          updatedAt: new Date().toISOString()
        });
        showToast(`✓ Affiche "${name}" réinitialisée.`);
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la sauvegarde.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadSoloPromo = async (key: string, name: string, file: File) => {
    try {
      setLoadingAction(`promo_${key}`);
      showToast(`Optimisation de l'affiche ${name}...`);
      const compressed = await compressImageFile(file, 1400, 0.85);
      await saveSoloPromo(key, name, compressed);
    } catch (err) {
      console.error(err);
      showToast("Erreur de compression.");
      setLoadingAction(null);
    }
  };

  // Save Product Image
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

  // Save Video Thumbnail
  const saveVideoThumbnail = async (imageValue: string | null) => {
    try {
      setLoadingAction('video_thumb');
      if (imageValue) {
        try { localStorage.setItem('parailaf_video_thumbnail', imageValue); } catch {}
        await setDoc(doc(db, 'images', 'parailaf_video_thumbnail'), {
          data: imageValue,
          updatedAt: new Date().toISOString()
        });
        showToast("✓ Miniature de la vidéo officielle mise à jour !");
      } else {
        try { localStorage.removeItem('parailaf_video_thumbnail'); } catch {}
        await setDoc(doc(db, 'images', 'parailaf_video_thumbnail'), {
          data: "",
          updatedAt: new Date().toISOString()
        });
        showToast("✓ Miniature de la vidéo réinitialisée à l'originale.");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur de sauvegarde de la miniature.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Submit URL Modal
  const handleUrlModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = urlModal.url.trim();
    if (!cleanUrl) {
      showToast("Veuillez saisir une URL valide.");
      return;
    }

    setUrlModal(prev => ({ ...prev, isOpen: false }));

    switch (urlModal.targetType) {
      case 'hero_desktop':
        await saveHeroImage('desktop', cleanUrl);
        break;
      case 'hero_mobile':
        await saveHeroImage('mobile', cleanUrl);
        break;
      case 'promo_fl2':
        await saveSoloPromo('parailaf_flyer_fl2', 'FreeStyle Libre 2 PLUS', cleanUrl);
        break;
      case 'promo_fl3':
        await saveSoloPromo('parailaf_flyer_fl3', 'FreeStyle Libre 3 PLUS', cleanUrl);
        break;
      case 'promo_omnipod':
        await saveSoloPromo('parailaf_flyer_omnipod5', 'Omnipod 5', cleanUrl);
        break;
      case 'product':
        if (urlModal.targetId) {
          const prod = PRODUCTS.find(p => p.id === urlModal.targetId);
          await updateProductImage(urlModal.targetId, cleanUrl);
          showToast(`✓ Image URL assignée au produit "${prod?.name || ''}" !`);
        }
        break;
      case 'video':
        await saveVideoThumbnail(cleanUrl);
        break;
    }
  };

  // Filtered Products
  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          prod.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || prod.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#002f6c] to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-300 text-xs font-bold border border-red-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Gestion Totale des Images (Backend Admin)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
            Gestionnaire des Médias & Photos du Site
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Vous avez la main totale pour remplacer n'importe quelle image : téléversez un fichier depuis votre appareil ou collez un lien URL. Les changements sont synchronisés sur le Cloud Firestore en temps réel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">Synchronisation Active</span>
          </div>

          {onPreviewSection && (
            <button
              onClick={() => onPreviewSection('hero')}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              title="Voir la vitrine publique"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Voir sur le site</span>
            </button>
          )}
        </div>
      </div>

      {/* Media Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setMediaSubTab('banners')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            mediaSubTab === 'banners'
              ? 'bg-[#002f6c] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Monitor className="w-4 h-4 text-amber-400" />
          <span>1. Affiche Principale Hero (PC & Mobile)</span>
        </button>

        <button
          onClick={() => setMediaSubTab('promos')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            mediaSubTab === 'promos'
              ? 'bg-[#002f6c] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>2. Affiches Spéciales Promo ({3})</span>
        </button>

        <button
          onClick={() => setMediaSubTab('products')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            mediaSubTab === 'products'
              ? 'bg-[#002f6c] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-rose-400" />
          <span>3. Catalogue Produits ({PRODUCTS.length})</span>
        </button>

        <button
          onClick={() => setMediaSubTab('video')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            mediaSubTab === 'video'
              ? 'bg-[#002f6c] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4 text-purple-400" />
          <span>4. Miniature Vidéo</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: HERO BANNERS (DESKTOP & MOBILE)               */}
      {/* ======================================================== */}
      {mediaSubTab === 'banners' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              L'affiche Hero en haut du site s'adapte automatiquement à l'écran du visiteur. Vous pouvez téléverser un fichier ou renseigner une URL pour la version <strong>PC (Desktop 1920 × 700)</strong> et pour la version <strong>Téléphone (Mobile vertical)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Desktop Banner Card */}
            <div 
              className={`bg-white rounded-3xl border ${dragOverCard === 'hero_desktop' ? 'border-amber-500 ring-2 ring-amber-400' : 'border-slate-200'} p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all`}
              onDragOver={(e) => { e.preventDefault(); setDragOverCard('hero_desktop'); }}
              onDragLeave={() => setDragOverCard(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverCard(null);
                const file = e.dataTransfer.files?.[0];
                if (file) handleUploadHero('desktop', file);
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#002f6c] flex items-center justify-center font-black">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Affiche Ordinateur (PC)</h4>
                      <p className="text-[11px] text-slate-500">Format paysage recommandé : 1920 × 700 px</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    heroImages.desktop ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {heroImages.desktop ? 'Image Personnalisée Active' : 'Image Originale'}
                  </span>
                </div>

                {/* Preview Thumbnail */}
                <div className="w-full h-52 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                  <img
                    src={heroImages.desktop || defaultHeroFlyer}
                    alt="Aperçu Desktop"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-amber-300" />
                    <span>Aperçu PC</span>
                  </div>
                  {dragOverCard === 'hero_desktop' && (
                    <div className="absolute inset-0 bg-amber-500/80 text-white flex items-center justify-center font-black text-sm">
                      Déposez le fichier ici pour remplacer
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={desktopHeroRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadHero('desktop', f);
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  disabled={loadingAction === 'hero_desktop'}
                  onClick={() => desktopHeroRef.current?.click()}
                  className="flex-1 min-w-[130px] bg-[#002f6c] hover:bg-[#002352] disabled:opacity-50 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{loadingAction === 'hero_desktop' ? 'Envoi...' : 'Téléverser Fichier'}</span>
                </button>

                <button
                  onClick={() => setUrlModal({
                    isOpen: true,
                    targetType: 'hero_desktop',
                    title: 'Affiche Ordinateur (PC)',
                    url: heroImages.desktop || '',
                  })}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="Saisir un lien URL direct"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Coller URL</span>
                </button>

                {heroImages.desktop && (
                  <button
                    disabled={loadingAction === 'hero_desktop'}
                    onClick={() => saveHeroImage('desktop', null)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Rétablir</span>
                  </button>
                )}

                {onPreviewSection && (
                  <button
                    onClick={() => onPreviewSection('hero')}
                    className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title="Voir le résultat sur le site"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Banner Card */}
            <div 
              className={`bg-white rounded-3xl border ${dragOverCard === 'hero_mobile' ? 'border-red-500 ring-2 ring-red-400' : 'border-slate-200'} p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all`}
              onDragOver={(e) => { e.preventDefault(); setDragOverCard('hero_mobile'); }}
              onDragLeave={() => setDragOverCard(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverCard(null);
                const file = e.dataTransfer.files?.[0];
                if (file) handleUploadHero('mobile', file);
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Affiche Téléphone (Mobile)</h4>
                      <p className="text-[11px] text-slate-500">Format vertical ou carré adapté aux smartphones</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    heroImages.mobile ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {heroImages.mobile ? 'Image Personnalisée Active' : 'Image Originale'}
                  </span>
                </div>

                {/* Preview Thumbnail */}
                <div className="w-full h-52 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                  <img
                    src={heroImages.mobile || defaultHeroFlyer}
                    alt="Aperçu Mobile"
                    className="h-full object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-red-400" />
                    <span>Aperçu Mobile</span>
                  </div>
                  {dragOverCard === 'hero_mobile' && (
                    <div className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center font-black text-sm">
                      Déposez le fichier ici pour remplacer
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={mobileHeroRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadHero('mobile', f);
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  disabled={loadingAction === 'hero_mobile'}
                  onClick={() => mobileHeroRef.current?.click()}
                  className="flex-1 min-w-[130px] bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{loadingAction === 'hero_mobile' ? 'Envoi...' : 'Téléverser Fichier'}</span>
                </button>

                <button
                  onClick={() => setUrlModal({
                    isOpen: true,
                    targetType: 'hero_mobile',
                    title: 'Affiche Téléphone (Mobile)',
                    url: heroImages.mobile || '',
                  })}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="Saisir un lien URL direct"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Coller URL</span>
                </button>

                {heroImages.mobile && (
                  <button
                    disabled={loadingAction === 'hero_mobile'}
                    onClick={() => saveHeroImage('mobile', null)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Rétablir</span>
                  </button>
                )}

                {onPreviewSection && (
                  <button
                    onClick={() => onPreviewSection('hero')}
                    className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title="Voir le résultat sur le site"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: SOLO PROMO FLYERS                              */}
      {/* ======================================================== */}
      {mediaSubTab === 'promos' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Ces 3 affiches correspondent aux offres exclusives présentées sur la page d'accueil. Vous pouvez téléverser votre propre affiche promotionnelle (format flyer vertical) ou insérer un lien web direct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Promo 1: FL2 PLUS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm">FreeStyle Libre 2 PLUS</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">550 DH</span>
                </div>
                <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  <img
                    src={promoFL2 || defaultFlyerFL2}
                    alt="FreeStyle Libre 2 PLUS"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Fichier</span>
                </button>

                <button
                  onClick={() => setUrlModal({
                    isOpen: true,
                    targetType: 'promo_fl2',
                    title: 'Affiche FreeStyle Libre 2 PLUS',
                    url: promoFL2 || '',
                  })}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                  title="Saisir un lien URL"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>URL</span>
                </button>

                {promoFL2 && (
                  <button
                    onClick={() => saveSoloPromo('parailaf_flyer_fl2', 'FreeStyle Libre 2 PLUS', null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {onPreviewSection && (
                  <button
                    onClick={() => onPreviewSection('offre-exclusive-affiche')}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl"
                    title="Voir sur le site"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Promo 2: FL3 PLUS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm">FreeStyle Libre 3 PLUS</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">850 DH</span>
                </div>
                <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  <img
                    src={promoFL3 || defaultFlyerFL3}
                    alt="FreeStyle Libre 3 PLUS"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
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
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Fichier</span>
                </button>

                <button
                  onClick={() => setUrlModal({
                    isOpen: true,
                    targetType: 'promo_fl3',
                    title: 'Affiche FreeStyle Libre 3 PLUS',
                    url: promoFL3 || '',
                  })}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                  title="Saisir un lien URL"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>URL</span>
                </button>

                {promoFL3 && (
                  <button
                    onClick={() => saveSoloPromo('parailaf_flyer_fl3', 'FreeStyle Libre 3 PLUS', null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {onPreviewSection && (
                  <button
                    onClick={() => onPreviewSection('offre-exclusive-affiche')}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl"
                    title="Voir sur le site"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Promo 3: Omnipod 5 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm">Omnipod 5 (Boîte de 5 Pods)</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">3000 DH</span>
                </div>
                <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                  <img
                    src={promoOmnipod || defaultFlyerOmnipod}
                    alt="Omnipod 5"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
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
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Fichier</span>
                </button>

                <button
                  onClick={() => setUrlModal({
                    isOpen: true,
                    targetType: 'promo_omnipod',
                    title: 'Affiche Omnipod 5',
                    url: promoOmnipod || '',
                  })}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                  title="Saisir un lien URL"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>URL</span>
                </button>

                {promoOmnipod && (
                  <button
                    onClick={() => saveSoloPromo('parailaf_flyer_omnipod5', 'Omnipod 5', null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl"
                    title="Rétablir l'image par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {onPreviewSection && (
                  <button
                    onClick={() => onPreviewSection('offre-exclusive-affiche')}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl"
                    title="Voir sur le site"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: CATALOG PRODUCTS                               */}
      {/* ======================================================== */}
      {mediaSubTab === 'products' && (
        <div className="space-y-4">
          
          {/* Controls: Search and Categories */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Rechercher un produit à modifier..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'freestyle-sensors', label: 'Capteurs' },
                { id: 'freestyle-readers', label: 'Lecteurs' },
                { id: 'omnipod-pumps', label: 'Pompes & Pods' },
                { id: 'accessories', label: 'Accessoires' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setProductCategoryFilter(c.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    productCategoryFilter === c.id
                      ? 'bg-[#002f6c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

          </div>

          <p className="text-xs text-slate-500">
            Personnalisez la photo principale de chaque produit dans le catalogue. Les modifications s'appliquent immédiatement sur les cartes produits, le panier et la vue détaillée.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => {
              const currentImg = (productCustomImages && productCustomImages[prod.id]) || prod.image;
              const isCustom = !!(productCustomImages && productCustomImages[prod.id]);

              return (
                <div 
                  key={prod.id} 
                  className={`bg-white rounded-3xl border ${dragOverCard === `prod_${prod.id}` ? 'border-red-500 ring-2 ring-red-400' : 'border-slate-200'} p-3.5 shadow-xs flex flex-col justify-between space-y-3 transition`}
                  onDragOver={(e) => { e.preventDefault(); setDragOverCard(`prod_${prod.id}`); }}
                  onDragLeave={() => setDragOverCard(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverCard(null);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleUploadProduct(prod.id, prod.name, file);
                  }}
                >
                  <div>
                    <div className="h-40 w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden mb-2.5 relative flex items-center justify-center">
                      <img
                        src={currentImg}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {isCustom ? (
                        <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          Modifiée
                        </span>
                      ) : (
                        <span className="absolute top-2 right-2 bg-slate-900/60 text-white text-[9px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Originale
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
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Téléverser une image"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Fichier</span>
                    </button>

                    <button
                      onClick={() => setUrlModal({
                        isOpen: true,
                        targetType: 'product',
                        targetId: prod.id,
                        title: prod.name,
                        url: isCustom ? currentImg : '',
                      })}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-2 px-2 rounded-xl transition cursor-pointer"
                      title="Coller un lien URL d'image"
                    >
                      <LinkIcon className="w-3 h-3 text-blue-600" />
                      <span>URL</span>
                    </button>

                    {isCustom && (
                      <button
                        onClick={() => handleResetProduct(prod.id, prod.name)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold p-2 rounded-xl transition cursor-pointer"
                        title="Rétablir l'image originale du catalogue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onPreviewSection && (
                      <button
                        onClick={() => onPreviewSection('nos-produits')}
                        className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl"
                        title="Voir dans le catalogue"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 4: VIDEO THUMBNAIL COVER                          */}
      {/* ======================================================== */}
      {mediaSubTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-2.5">
            <Video className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <p>
              Personnalisez la photo de couverture de la section <strong>Présentation Vidéo Officielle</strong>. Cette image s'affiche en fond avant que l'utilisateur ne clique pour lancer la vidéo.
            </p>
          </div>

          <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-base">Miniature de la Vidéo</h4>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                videoThumbnail ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {videoThumbnail ? 'Image Personnalisée Active' : 'Image Originale'}
              </span>
            </div>

            <div className="w-full h-64 bg-slate-900 rounded-2xl overflow-hidden relative group flex items-center justify-center">
              <img
                src={videoThumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'}
                alt="Miniature Vidéo"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 ml-0.5" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={videoThumbnailRef}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    try {
                      setLoadingAction('video_thumb');
                      const compressed = await compressImageFile(f, 1400, 0.85);
                      await saveVideoThumbnail(compressed);
                    } catch (err) {
                      console.error(err);
                      showToast("Erreur de compression.");
                    } finally {
                      setLoadingAction(null);
                    }
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              <button
                disabled={loadingAction === 'video_thumb'}
                onClick={() => videoThumbnailRef.current?.click()}
                className="flex-1 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{loadingAction === 'video_thumb' ? 'Envoi...' : 'Téléverser Fichier'}</span>
              </button>

              <button
                onClick={() => setUrlModal({
                  isOpen: true,
                  targetType: 'video',
                  title: 'Miniature de la Vidéo Démo',
                  url: videoThumbnail || '',
                })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                title="Saisir un lien URL"
              >
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Coller URL</span>
              </button>

              {videoThumbnail && (
                <button
                  disabled={loadingAction === 'video_thumb'}
                  onClick={() => saveVideoThumbnail(null)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1 transition cursor-pointer"
                  title="Rétablir la miniature par défaut"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rétablir</span>
                </button>
              )}

              {onPreviewSection && (
                <button
                  onClick={() => onPreviewSection('guide-video')}
                  className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="Voir la section vidéo sur le site"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ASSIGN IMAGE VIA URL                             */}
      {/* ======================================================== */}
      {urlModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Remplacer par une URL</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{urlModal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setUrlModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUrlModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lien direct de l'image (https://...)
                </label>
                <input
                  type="url"
                  required
                  value={urlModal.url}
                  onChange={(e) => setUrlModal(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://exemple.com/mon-image.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Assurez-vous que le lien se termine par une extension image (.jpg, .png, .webp) ou provient d'un hébergeur d'images accessible.
                </p>
              </div>

              {/* URL Preview if valid looking */}
              {urlModal.url && urlModal.url.startsWith('http') && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Aperçu du lien :</span>
                  <div className="w-full h-36 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={urlModal.url}
                      alt="Aperçu du lien"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUrlModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-[#002f6c] hover:bg-[#002352] rounded-xl transition cursor-pointer shadow-sm"
                >
                  Appliquer l'image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
