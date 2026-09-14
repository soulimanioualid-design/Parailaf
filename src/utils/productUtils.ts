import { Product } from '../types';

/**
 * Sanitizes a product object to ensure it is 100% compliant with Firebase Firestore.
 * Critical: Firestore throws fatal exceptions when receiving objects with `undefined` values.
 * This function cleanses all undefined values, guarantees fallbacks for texts, and ensures safe persistence.
 */
export function sanitizeProductForFirestore(prod: Partial<Product>): Product {
  const name = String(prod.name || '').trim() || 'Nouveau Produit';
  const price = typeof prod.price === 'number' && !isNaN(prod.price) && prod.price >= 0 ? prod.price : Number(prod.price) || 0;
  
  const shortDescription = (prod.shortDescription && String(prod.shortDescription).trim())
    ? String(prod.shortDescription).trim()
    : `${name} - Dispositif médical certifié disponible en stock au Maroc.`;

  const fullDescription = (prod.fullDescription && String(prod.fullDescription).trim())
    ? String(prod.fullDescription).trim()
    : `${name} - Matériel médical original certifié sous scellé d'origine. Livraison express 24h à 48h partout au Maroc et paiement sécurisé à la livraison.`;

  const mainImage = prod.image && String(prod.image).trim()
    ? String(prod.image).trim()
    : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';

  let gallery: string[] = [];
  if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
    gallery = prod.gallery.filter(img => typeof img === 'string' && img.trim().length > 0);
  }
  // Ensure mainImage is at index 0 and remove exact duplicates preserving order
  const seen = new Set<string>();
  const distinctGallery: string[] = [];
  if (mainImage) {
    seen.add(mainImage);
    distinctGallery.push(mainImage);
  }
  for (const img of gallery) {
    if (!seen.has(img)) {
      seen.add(img);
      distinctGallery.push(img);
    }
  }
  // Allow up to 8 images per product gallery
  const safeGallery = distinctGallery.length > 0 ? distinctGallery.slice(0, 8) : [mainImage];

  const features = (Array.isArray(prod.features) && prod.features.length > 0)
    ? prod.features.filter(f => typeof f === 'string' && f.trim().length > 0)
    : [
        "Dispositif 100% original certifié sous scellé d'origine",
        "Livraison express 24h à 48h partout au Maroc",
        "Paiement sécurisé en espèces à la livraison (Cash on delivery)"
      ];

  const boxContents = (Array.isArray(prod.boxContents) && prod.boxContents.length > 0)
    ? prod.boxContents.filter(b => typeof b === 'string' && b.trim().length > 0)
    : [
        "1 Dispositif médical scellé d'origine",
        "Notice et guide d'utilisation en Français"
      ];

  const cleanProduct: Record<string, any> = {
    id: String(prod.id || `prod_${Date.now()}`),
    name,
    brand: String(prod.brand || 'Abbott').trim() || 'Abbott',
    category: (prod.category || 'libre-2') as Product['category'],
    categoryLabel: String(prod.categoryLabel || 'FreeStyle Libre 2').trim() || 'FreeStyle Libre 2',
    shortDescription,
    fullDescription,
    price,
    rating: typeof prod.rating === 'number' && !isNaN(prod.rating) ? prod.rating : 5.0,
    reviewsCount: typeof prod.reviewsCount === 'number' && !isNaN(prod.reviewsCount) ? prod.reviewsCount : 1,
    image: mainImage,
    gallery: safeGallery,
    features,
    boxContents,
    inStock: prod.inStock !== false,
    isPopular: !!prod.isPopular,
    sortOrder: typeof prod.sortOrder === 'number' && !isNaN(prod.sortOrder) ? prod.sortOrder : 999,
    specs: {
      duration: prod.specs?.duration || "Jusqu’à 14-15 jours",
      waterproof: prod.specs?.waterproof || "IP27 (résistant à l'eau)",
      bloodSample: prod.specs?.bloodSample || "Sans piqûres au bout des doigts",
      alarms: prod.specs?.alarms || "Alertes personnalisables en direct",
      dimensions: prod.specs?.dimensions || "Format compact et discret",
      memory: prod.specs?.memory || "Historique des données",
      appCompatibility: prod.specs?.appCompatibility || "iOS et Android",
      calibration: prod.specs?.calibration || "Calibration d'usine automatique"
    }
  };

  // Only assign optional fields if they have genuine truthy values (NEVER undefined)
  if (typeof prod.originalPrice === 'number' && !isNaN(prod.originalPrice) && prod.originalPrice > 0) {
    cleanProduct.originalPrice = prod.originalPrice;
  }
  if (prod.badge && String(prod.badge).trim()) {
    cleanProduct.badge = String(prod.badge).trim();
  }
  if (typeof prod.stockCount === 'number' && !isNaN(prod.stockCount)) {
    cleanProduct.stockCount = prod.stockCount;
  }

  // Pure JSON round-trip strips any lingering undefined or symbol values
  return JSON.parse(JSON.stringify(cleanProduct)) as Product;
}

/**
 * Prepares the aggregated catalog list for saving into parailaf_catalog_v1.
 * Cloud Firestore has a strict 1,048,576 bytes limit per document.
 * We safely preserve all gallery photos. Only if the aggregate JSON size approaches
 * the hard 1MB ceiling (> 920KB), we gently cap gallery length to 4 photos per product.
 */
export function prepareCatalogForFirestore(products: Product[]): Product[] {
  const list = products.map(p => sanitizeProductForFirestore(p));
  const jsonString = JSON.stringify(list);

  // If comfortably under 920KB, return the complete catalog with all gallery photos intact
  if (jsonString.length < 920000) {
    return list;
  }

  // Otherwise, gently cap gallery to 4 photos per product to stay strictly under 1MB
  return list.map(p => {
    const rawGallery = Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : [p.image];
    const cappedGallery = rawGallery.slice(0, 4);
    return {
      ...p,
      gallery: cappedGallery
    };
  });
}

/**
 * Safely saves the product catalog into browser localStorage.
 * Handles DOMException / QuotaExceededError robustly:
 * 1. Automatically purges legacy/stale cache keys from earlier applet versions.
 * 2. Never throws unhandled exceptions or crashes the browser session.
 */
export function safeSaveCatalogToLocalStorage(storageKey: string, products: Product[]): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  // 1. Purge known stale keys across versions to free space immediately
  const stalePrefixes = ['parailaf_catalog_v', 'parailaf_all_orders_v'];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && stalePrefixes.some(prefix => k.startsWith(prefix)) && k !== storageKey) {
        localStorage.removeItem(k);
      }
    }
  } catch {}

  // Attempt 1: Standard save with full products and all gallery photos
  try {
    localStorage.setItem(storageKey, JSON.stringify(products));
    return true;
  } catch (err: any) {
    console.warn("Notice: Quota localStorage atteinte lors de la sauvegarde du catalogue. Nettoyage...", err?.message || err);
  }

  // Attempt 2: Clear any other non-essential localStorage items to free space
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k !== storageKey && k !== 'parailaf_cart_v1' && k !== 'parailaf_all_orders_v2') {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
    localStorage.setItem(storageKey, JSON.stringify(products));
    return true;
  } catch {}

  // Notice: If browser quota is full, we do NOT corrupt or strip galleries down in storage.
  // The catalog remains 100% complete and authoritative in memory and Firestore.
  console.warn("Avertissement: Sauvegarde locale du catalogue ignorée (quota navigateur). Le catalogue complet reste actif en mémoire et Firestore.");
  return false;
}


