import { Review } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Youssef B.',
    city: 'Casablanca (Maârif)',
    rating: 5,
    date: 'Il y a 3 jours',
    comment: 'Commande reçue le lendemain à Casablanca. Emballage parfait et produit 100% original scellé Abbott. Ça change la vie de ne plus avoir à se piquer les doigts 6 fois par jour. Merci pour le professionnalisme !',
    verified: true,
    productName: 'Pack Duo - 2 Capteurs FreeStyle Libre 2'
  },
  {
    id: 'rev-2',
    author: 'Dr. Amina E.',
    city: 'Rabat (Agdal)',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment: 'Je commande régulièrement pour mon père diabétique de type 1. Service client très réactif sur WhatsApp, livraison rapide et prix corrects avec paiement à la livraison sécurisé.',
    verified: true,
    productName: 'Capteur FreeStyle Libre 3'
  },
  {
    id: 'rev-3',
    author: 'Mehdi K.',
    city: 'Marrakech (Guéliz)',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Livré en 48h à Marrakech. L’alarme du FreeStyle Libre 2 m’a déjà évité deux hypoglycémies nocturnes. Les patchs étanches tiennent super bien même sous la douche et à la piscine.',
    verified: true,
    productName: 'Pack Starter Kit (Lecteur + Capteur)'
  },
  {
    id: 'rev-4',
    author: 'Fatima-Zahra M.',
    city: 'Tanger (Malabata)',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Très satisfaite de la rapidité et du suivi de commande. Le livreur était très courtois. Produit authentique avec date de péremption lointaine.',
    verified: true,
    productName: 'Lot de 20 Patchs Adhésifs de Protection'
  }
];
