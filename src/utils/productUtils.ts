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
  if (!gallery.includes(mainImage)) {
    gallery = [mainImage, ...gallery];
  }

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
