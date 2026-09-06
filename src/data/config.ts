import { BrandConfig, MoroccanCity } from '../types';

export const BRAND_CONFIG: BrandConfig = {
  name: "Parailaf Maroc",
  tagline: "Votre spécialiste officiel FreeStyle Libre & suivi du glucose au Maroc",
  country: "Maroc",
  phone: "+212600009386",
  displayPhone: "+212 600-009386",
  whatsapp: "212600009386",
  displayWhatsapp: "+212 600-009386",
  whatsappMessage: "Bonjour, je souhaite avoir plus d'informations sur vos produits FreeStyle Libre et passer une commande sur Parailaf.",
  email: "contact@parailaf.ma",
  address: "Direction Lazaret, Oujda, Maroc",
  operatingHours: "Lun - Sam : 08h30 - 20h00 | Dim : 10h00 - 18h00",
  deliveryNotice: "Livraison express partout au Maroc sous 24h à 48h (Frais fixes : 40 DH)",
  freeShippingThreshold: 0, // Pas de livraison gratuite, payante quel que soit le prix
  defaultShippingFee: 40, // 40 DH fixe partout au Maroc quel que soit le montant
};

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { name: "Casablanca", region: "Casablanca-Settat", deliveryTime: "24h (Livraison express le jour même)", deliveryFee: 40 },
  { name: "Rabat", region: "Rabat-Salé-Kénitra", deliveryTime: "24h express", deliveryFee: 40 },
  { name: "Marrakech", region: "Marrakech-Safi", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Tanger", region: "Tanger-Tétouan-Al Hoceïma", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Fès", region: "Fès-Meknès", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Agadir", region: "Souss-Massa", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Meknès", region: "Fès-Meknès", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Oujda", region: "Oriental", deliveryTime: "48h", deliveryFee: 40 },
  { name: "Kénitra", region: "Rabat-Salé-Kénitra", deliveryTime: "24h", deliveryFee: 40 },
  { name: "Tétouan", region: "Tanger-Tétouan-Al Hoceïma", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Salé", region: "Rabat-Salé-Kénitra", deliveryTime: "24h", deliveryFee: 40 },
  { name: "Mohammédia", region: "Casablanca-Settat", deliveryTime: "24h", deliveryFee: 40 },
  { name: "El Jadida", region: "Casablanca-Settat", deliveryTime: "24h - 48h", deliveryFee: 40 },
  { name: "Nador", region: "Oriental", deliveryTime: "48h", deliveryFee: 40 },
  { name: "Béni Mellal", region: "Béni Mellal-Khénifra", deliveryTime: "48h", deliveryFee: 40 },
  { name: "Safi", region: "Marrakech-Safi", deliveryTime: "48h", deliveryFee: 40 },
  { name: "Témara", region: "Rabat-Salé-Kénitra", deliveryTime: "24h", deliveryFee: 40 },
  { name: "Autre ville au Maroc", region: "Toutes régions", deliveryTime: "48h max", deliveryFee: 40 },
];
