export interface Product {
  id: string;
  name: string;
  category: 'libre-2' | 'libre-3' | 'capteurs' | 'lecteurs' | 'accessoires' | 'packs' | 'offres-speciales' | 'omnipod';
  categoryLabel: string;
  brand: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // in MAD (Moroccan Dirham)
  originalPrice?: number;
  discountPercentage?: number;
  badge?: 'Best Seller' | 'Promo' | 'Nouveau' | 'Recommandé' | 'Stock Limité' | 'Offre Spéciale' | 'Meilleur Prix' | 'Nouveau !' | 'Essentiel' | 'Indispensable' | 'Pratique' | string;
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  features: string[];
  specs: {
    duration?: string; // e.g. "14 jours" ou "15 jours"
    waterproof?: string; // e.g. "IP27 (jusqu'à 1 mètre, 30 min)"
    bloodSample?: string; // e.g. "Sans piqûre au doigt"
    alarms?: string; // e.g. "Alertes optionnelles en temps réel"
    dimensions?: string; // e.g. "Taille d'une pièce de 2 DH"
    memory?: string; // e.g. "Stockage 90 jours"
    appCompatibility?: string; // e.g. "iOS & Android (FreeStyle LibreLink)"
    calibration?: string; // e.g. "Aucune calibration requise"
  };
  boxContents: string[];
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface MoroccanCity {
  name: string;
  region: string;
  deliveryTime: string;
  deliveryFee: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'cod';
  email?: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  source?: 'Panier' | 'Achat Express 1-Clic' | 'Offre Promo' | 'Manuel (Téléphone)';
  emailNotified?: boolean;
  adminNotes?: string;
  userId?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  createdAt: string;
  role?: 'customer' | 'admin';
}

export interface StoredUserAccount extends User {
  passwordHash: string; // stored hashed or base-64 encoded locally
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'usage' | 'livraison' | 'paiement';
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  productName: string;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  country: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  displayWhatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  operatingHours: string;
  deliveryNotice: string;
  freeShippingThreshold: number; // in MAD
  defaultShippingFee: number; // in MAD
}
