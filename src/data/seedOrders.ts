import { Order } from '../types';
import { PRODUCTS } from './products';

export const INITIAL_SEED_ORDERS: Order[] = [
  {
    id: "DC-948215",
    createdAt: "Aujourd'hui à 11:24",
    customer: {
      fullName: "Karim Benjelloun",
      phone: "0661234567",
      city: "Casablanca",
      address: "24 Rue Jean Jaurès, Gauthier, Étage 3, Apt 12",
      paymentMethod: "cod",
      email: "k.benjelloun@gmail.com",
      notes: "Appeler avant d'arriver, interphone Benjelloun"
    },
    items: [
      {
        product: PRODUCTS.find(p => p.id === 'pack-4-fsl2-plus') || PRODUCTS[0],
        quantity: 1
      }
    ],
    subtotal: 540,
    shippingFee: 35,
    discountTotal: 260,
    total: 575,
    status: "pending",
    source: "Achat Express 1-Clic",
    emailNotified: true,
    adminNotes: "Client à contacter vers 14h"
  },
  {
    id: "DC-837190",
    createdAt: "Hier à 16:45",
    customer: {
      fullName: "Fatima Zahra El Amrani",
      phone: "0672981045",
      city: "Rabat",
      address: "Avenue Annakhil, Hay Riad, Villa 45",
      paymentMethod: "cod",
      email: "fz.elamrani@yahoo.fr",
      notes: "Livraison le matin de préférence"
    },
    items: [
      {
        product: PRODUCTS.find(p => p.id === 'pack-10-fsl2-plus') || PRODUCTS[1],
        quantity: 1
      },
      {
        product: PRODUCTS.find(p => p.id === 'patch-protection-x10') || PRODUCTS[4],
        quantity: 2
      }
    ],
    subtotal: 710,
    shippingFee: 0,
    discountTotal: 340,
    total: 710,
    status: "confirmed",
    source: "Panier",
    emailNotified: true
  },
  {
    id: "DC-726419",
    createdAt: "Il y a 2 jours",
    customer: {
      fullName: "Driss Tazi",
      phone: "0663889922",
      city: "Marrakech",
      address: "Résidence Al Mansour, Bd Mohammed VI, Guéliz",
      paymentMethod: "cod",
      email: "d.tazi@outlook.com",
      notes: "Livrer à la réception de l'immeuble"
    },
    items: [
      {
        product: PRODUCTS.find(p => p.id === 'fsl3-plus-nouveau') || PRODUCTS[2],
        quantity: 2
      }
    ],
    subtotal: 1600,
    shippingFee: 0,
    discountTotal: 300,
    total: 1600,
    status: "shipping",
    source: "Panier",
    emailNotified: true,
    adminNotes: "Expédié via CTM Express"
  },
  {
    id: "DC-615028",
    createdAt: "Il y a 3 jours",
    customer: {
      fullName: "Khadija Berrada",
      phone: "0650114477",
      city: "Fès",
      address: "Route d'Immouzer, Résidence Les Jardins",
      paymentMethod: "cod",
      email: "k.berrada@gmail.com"
    },
    items: [
      {
        product: PRODUCTS.find(p => p.id === 'pack-4-fsl2-plus') || PRODUCTS[0],
        quantity: 1
      }
    ],
    subtotal: 540,
    shippingFee: 35,
    discountTotal: 260,
    total: 575,
    status: "delivered",
    source: "Offre Promo",
    emailNotified: true,
    adminNotes: "Livré et encaissé (575 DH)"
  }
];
