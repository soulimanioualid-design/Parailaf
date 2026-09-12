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
  // Remove exact duplicates
  gallery = Array.from(new Set(gallery));
  if (!gallery.includes(mainImage)) {
    gallery = [mainImage, ...gallery];
  }
  // Cap gallery to max 4 images to keep document sizes well within Firestore limits
  gallery = gallery.slice(0, 4);

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
    gallery,
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
 * If the aggregate JSON size approaches the limit (> 650KB), this helper ensures
 * huge base64 strings in secondary gallery arrays are trimmed down so parailaf_catalog_v1
 * never exceeds Firestore limits. Full high-res images are always safely preserved in
 * individual product documents (/products/{productId}).
 */
export function prepareCatalogForFirestore(products: Product[]): Product[] {
  const list = products.map(p => sanitizeProductForFirestore(p));
  const jsonString = JSON.stringify(list);

  // If comfortably under 650KB, return as is
  if (jsonString.length < 650000) {
    return list;
  }

  // Otherwise, slim down secondary gallery images in the aggregated catalog doc
  return list.map(p => {
    // If gallery has large base64 items, keep only mainImage in parailaf_catalog_v1
    const slimGallery = (p.gallery || []).filter(img => {
      // keep URLs or static paths, or if base64 keep only if short (< 45KB)
      return !img.startsWith('data:image/') || img.length < 45000;
    });

    return {
      ...p,
      gallery: slimGallery.length > 0 ? slimGallery : [p.image]
    };
  });
}

