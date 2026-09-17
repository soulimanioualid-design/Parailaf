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
  ice: "002691734000044",
  ifNumber: "47320490",
  taxePro: "10501450",
};

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { name: "Casablanca", nameAr: "الدار البيضاء", region: "Casablanca-Settat", deliveryTime: "24h (Livraison express)", deliveryTimeAr: "24 ساعة (توصيل سريع)", deliveryFee: 40 },
  { name: "Rabat", nameAr: "الرباط", region: "Rabat-Salé-Kénitra", deliveryTime: "24h express", deliveryTimeAr: "24 ساعة سريعة", deliveryFee: 40 },
  { name: "Marrakech", nameAr: "مراكش", region: "Marrakech-Safi", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Tanger", nameAr: "طنجة", region: "Tanger-Tétouan-Al Hoceïma", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Fès", nameAr: "فاس", region: "Fès-Meknès", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Agadir", nameAr: "أكادير", region: "Souss-Massa", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Meknès", nameAr: "مكناس", region: "Fès-Meknès", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Oujda", nameAr: "وجدة", region: "Oriental", deliveryTime: "48h", deliveryTimeAr: "48 ساعة", deliveryFee: 40 },
  { name: "Kénitra", nameAr: "القنيطرة", region: "Rabat-Salé-Kénitra", deliveryTime: "24h", deliveryTimeAr: "24 ساعة", deliveryFee: 40 },
  { name: "Tétouan", nameAr: "تطوان", region: "Tanger-Tétouan-Al Hoceïma", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Salé", nameAr: "سلا", region: "Rabat-Salé-Kénitra", deliveryTime: "24h", deliveryTimeAr: "24 ساعة", deliveryFee: 40 },
  { name: "Mohammédia", nameAr: "المحمدية", region: "Casablanca-Settat", deliveryTime: "24h", deliveryTimeAr: "24 ساعة", deliveryFee: 40 },
  { name: "El Jadida", nameAr: "الجديدة", region: "Casablanca-Settat", deliveryTime: "24h - 48h", deliveryTimeAr: "24 إلى 48 ساعة", deliveryFee: 40 },
  { name: "Nador", nameAr: "الناظور", region: "Oriental", deliveryTime: "48h", deliveryTimeAr: "48 ساعة", deliveryFee: 40 },
  { name: "Béni Mellal", nameAr: "بني ملال", region: "Béni Mellal-Khénifra", deliveryTime: "48h", deliveryTimeAr: "48 ساعة", deliveryFee: 40 },
  { name: "Safi", nameAr: "آسفي", region: "Marrakech-Safi", deliveryTime: "48h", deliveryTimeAr: "48 ساعة", deliveryFee: 40 },
  { name: "Témara", nameAr: "تمارة", region: "Rabat-Salé-Kénitra", deliveryTime: "24h", deliveryTimeAr: "24 ساعة", deliveryFee: 40 },
  { name: "Autre ville au Maroc", nameAr: "مدينة أخرى بالمغرب", region: "Toutes régions", deliveryTime: "48h max", deliveryTimeAr: "48 ساعة كحد أقصى", deliveryFee: 40 },
];
