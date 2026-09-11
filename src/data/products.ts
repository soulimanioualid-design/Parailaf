import { Product } from '../types';

import imgPack4 from '../assets/images/freestyle_libre2_pack4_1788260812490.jpg';
import imgPack10 from '../assets/images/freestyle_libre2_pack10_1788260826767.jpg';
import imgLibre3 from '../assets/images/freestyle_libre3_plus_1788260841456.jpg';
import imgOmnipod from '../assets/images/omnipod_5_pack10_1788260856591.jpg';
import imgReader from '../assets/images/freestyle_reader_device_1788260869630.jpg';
import imgPatches from '../assets/images/glucose_sensor_patches_1788260886831.jpg';
import imgWipes from '../assets/images/alcohol_wipes_box_1788260900680.jpg';
import imgCase from '../assets/images/travel_case_eva_1788260915608.jpg';
import imgSingle2 from '../assets/images/freestyle_libre2_single_1788260930453.jpg';
import imgPromoOujda from '../assets/images/freestyle_promo_oujda_1788441986495.jpg';
import imgPromoLibre3 from '../assets/images/freestyle_libre3_promo_flyer_1788452962096.jpg';
import imgPromoOmnipod from '../assets/images/omnipod_5_promo_flyer_1788454250818.jpg';

export const CATEGORIES = [
  { id: 'all', name: 'Tous les produits', count: 9 },
  { id: 'offres-speciales', name: 'Offres Spéciales', count: 3 },
  { id: 'libre-2', name: 'FreeStyle Libre 2 PLUS', count: 3 },
  { id: 'libre-3', name: 'FreeStyle Libre 3 PLUS', count: 2 },
  { id: 'capteurs', name: 'Capteurs de Glycémie', count: 2 },
  { id: 'packs', name: 'Packs Économiques', count: 2 },
  { id: 'omnipod', name: 'Omnipod 5', count: 1 },
  { id: 'lecteurs', name: 'Lecteurs & Kits', count: 1 },
  { id: 'accessoires', name: 'Accessoires & Soins', count: 3 },
];

export const STANDALONE_PROMO_550: Product = {
  id: 'fsl2-plus-promo-550',
  name: 'FreeStyle Libre 2 PLUS - Offre Spéciale Promo 550 DH',
  category: 'offres-speciales',
  categoryLabel: 'Offres Spéciales',
  brand: 'Abbott',
  shortDescription: 'Offre Spéciale Affiche Promo à 550 DH. Mesure en continu 24h/24 sans piqûres au bout des doigts, alertes personnalisées.',
  fullDescription: 'Système officiel de mesure du glucose en continu FreeStyle Libre 2 PLUS d’Abbott. Mesure 24h/24 sans piqûres au bout des doigts, alertes personnalisées en cas d’hypo ou d’hyperglycémie, durée jusqu’à 14-15 jours, application mobile connectée. Offre promotionnelle exclusive avec livraison express et paiement à la livraison partout au Maroc.',
  price: 550,
  originalPrice: 750,
  discountPercentage: 27,
  badge: 'Promo 550 DH',
  inStock: true,
  stockCount: 50,
  rating: 5.0,
  reviewsCount: 312,
  image: imgPromoOujda,
  gallery: [
    imgPromoOujda,
    imgPack4,
    imgSingle2,
  ],
  features: [
    'Prix Promotionnel Exclusif : 550 DH',
    'Mesure en continu 24h/24, sans piqûres au bout de doigts',
    'Alertes personnalisées en direct : soyez averti en cas d’hypo ou d’hyperglycémie',
    'Durée jusqu’à 14-15 jours : une liberté et un confort au quotidien',
    'Application mobile : suivi facile de vos données et transferts',
    'Précis & fiable : technologie avancée pour un meilleur contrôle',
    'Paiement en espèces à la livraison partout au Maroc'
  ],
  specs: {
    duration: 'Jusqu’à 14-15 jours',
    waterproof: 'IP27 (résistant douche & baignade)',
    bloodSample: 'Sans piqûres au bout des doigts',
    alarms: 'Alertes automatiques Bluetooth en temps réel',
    dimensions: 'Capteur FreeStyle Libre 2 PLUS',
    memory: 'Stockage continu smartphone LibreLink',
    appCompatibility: 'iOS et Android',
    calibration: 'Calibré en usine (aucun étalonnage requis)'
  },
  boxContents: [
    '1 Capteur FreeStyle Libre 2 PLUS scellé d’origine',
    '1 Applicateur stérile individuel',
    'Lingettes désinfectantes à l’alcool',
    'Guide d’utilisation en Français'
  ],
  isPopular: true,
};

export const STANDALONE_PROMO_850: Product = {
  id: 'fsl3-plus-promo-850',
  name: 'FreeStyle Libre 3 PLUS - Offre Spéciale Promo 850 DH',
  category: 'offres-speciales',
  categoryLabel: 'Offres Spéciales',
  brand: 'Abbott',
  shortDescription: 'Offre Spéciale Affiche Promo à 850 DH. Mesure en continu 24h/24 sans piqûres au bout des doigts, alertes personnalisées, durée jusqu’à 15 jours.',
  fullDescription: 'Système officiel de mesure du glucose en continu FreeStyle Libre 3 PLUS d’Abbott. Capteur nouvelle génération ultra-discret, mesure 24h/24 sans piqûres au bout des doigts, alertes personnalisées d’hypo ou d’hyperglycémie, durée jusqu’à 15 jours, application mobile connectée. Offre promotionnelle exclusive avec livraison express et paiement à la livraison partout au Maroc.',
  price: 850,
  originalPrice: 1100,
  discountPercentage: 23,
  badge: 'Promo 850 DH',
  inStock: true,
  stockCount: 40,
  rating: 5.0,
  reviewsCount: 248,
  image: imgPromoLibre3,
  gallery: [
    imgPromoLibre3,
    imgLibre3,
  ],
  features: [
    'Prix Promotionnel Exclusif : 850 DH',
    'Mesure en continu 24h/24, sans piqûres au bout de doigts',
    'Alertes personnalisées en direct : soyez averti en cas d’hypo ou d’hyperglycémie',
    'Durée jusqu’à 15 jours : une liberté et un confort au quotidien',
    'Application mobile : suivi facile de vos données et transferts',
    'Précis & fiable : technologie avancée pour un meilleur contrôle',
    'Paiement en espèces à la livraison partout au Maroc'
  ],
  specs: {
    duration: 'Jusqu’à 15 jours',
    waterproof: 'IP28 (résistant douche & baignade)',
    bloodSample: 'Sans piqûres au bout des doigts',
    alarms: 'Alertes automatiques Bluetooth en temps réel',
    dimensions: 'Capteur FreeStyle Libre 3 PLUS ultra-compact',
    memory: 'Stockage continu smartphone LibreLink',
    appCompatibility: 'iOS et Android',
    calibration: 'Calibré en usine (aucun étalonnage requis)'
  },
  boxContents: [
    '1 Capteur FreeStyle Libre 3 PLUS scellé d’origine',
    '1 Applicateur stérile individuel',
    'Lingettes désinfectantes à l’alcool',
    'Guide d’utilisation en Français'
  ],
  isPopular: true,
};

export const STANDALONE_PROMO_3000: Product = {
  id: 'omnipod-5-promo-3000',
  name: 'Omnipod 5 (Boîte de 5 Pods) - Offre Spéciale Promo 3000 DH',
  category: 'offres-speciales',
  categoryLabel: 'Offres Spéciales',
  brand: 'Insulet',
  shortDescription: 'Offre Spéciale Affiche Promo à 3000 DH. Système automatisé d’administration d’insuline sans tubulure (5 Pods). Régulation toutes les 5 minutes.',
  fullDescription: 'Système officiel d’administration automatisée d’insuline Omnipod 5 par Insulet (boîte de 5 Pods). Pompe à insuline tubeless sans tubes de nouvelle génération. Ajuste automatiquement l’insuline toutes les 5 minutes en fonction de vos besoins pour vous aider à rester dans votre zone cible plus longtemps. Étanche IP28 (jusqu’à 7,6 m), sans tubulure, compatible capteurs Dexcom et FreeStyle Libre 2 PLUS. Offre promotionnelle exclusive avec livraison express et paiement à la livraison partout au Maroc.',
  price: 3000,
  originalPrice: 3800,
  discountPercentage: 21,
  badge: 'Promo 3000 DH',
  inStock: true,
  stockCount: 25,
  rating: 5.0,
  reviewsCount: 184,
  image: imgPromoOmnipod,
  gallery: [
    imgPromoOmnipod,
    imgOmnipod,
  ],
  features: [
    'Prix Promotionnel Exclusif : 3000 DH (Boîte de 5 Pods)',
    'Sans tubulure (Tubeless) : design discret, facile et confortable à porter',
    'Régulation automatisée : ajuste automatiquement l’insuline toutes les 5 minutes',
    'Compatible avec les capteurs Dexcom G6/G7 et FreeStyle Libre 2 PLUS',
    'Boîte de 5 Pods : jusqu’à 15 jours de gestion continue (jusqu’à 3 jours par Pod)',
    'Étanche IP28 : résiste à l’eau jusqu’à 7,6 mètres pendant 60 minutes',
    'Gestion simple via l’application smartphone ou le PDM',
    'Produit 100% original certifié Insulet',
    'Paiement en espèces à la livraison partout au Maroc'
  ],
  specs: {
    duration: 'Jusqu’à 3 jours par pod (5 pods = 15 jours)',
    waterproof: 'IP28 (étanche jusqu’à 7,6 mètres)',
    bloodSample: 'Sans tubulure (Tubeless sans fil)',
    alarms: 'Alertes automatiques et gestion des doses',
    dimensions: 'Pod miniature et ergonomique',
    memory: 'Historique complet sur PDM ou smartphone',
    appCompatibility: 'iOS et Android',
    calibration: 'Algorithme intelligent intégré'
  },
  boxContents: [
    '5 Pods Omnipod 5 scellés individuellement sous emballage stérile',
    '5 Seringues de remplissage avec aiguille stérile',
    'Guide d’utilisation complet en Français'
  ],
  isPopular: true,
};

export const PRODUCTS: Product[] = [
  {
    id: 'pack-4-fsl2-plus',
    name: 'Pack 4 Pièces - FreeStyle Libre 2 PLUS',
    category: 'offres-speciales',
    categoryLabel: 'Offres Spéciales',
    brand: 'Abbott',
    shortDescription: 'Offre Spéciale 4 capteurs FreeStyle Libre 2 PLUS (135 DH / pièce). Suivi continu jusqu’à 15 jours par capteur.',
    fullDescription: 'Profitez de l’offre exclusive Pack 4 pièces FreeStyle Libre 2 PLUS à 540 DH (soit 135 DH par capteur). Bénéficiez jusqu’à 60 jours de suivi continu en toute simplicité, alertes en temps réel, lecture facile avec l’application LibreLink.',
    price: 540,
    originalPrice: 720,
    discountPercentage: 25,
    badge: 'Offre Spéciale',
    inStock: true,
    stockCount: 45,
    rating: 5.0,
    reviewsCount: 184,
    image: imgPack4,
    gallery: [
      imgPack4,
      imgSingle2,
    ],
    features: [
      'Prix imbattable : 540 DH le pack de 4 (135 DH / pièce)',
      'Jusqu’à 15 jours de suivi continu par capteur (60 jours au total)',
      'Lecture facile avec l’application LibreLink (iOS / Android)',
      'Alertes sonores et vibratoires en temps réel (Hypo / Hyper)',
      'Des décisions éclairées pour mieux agir au quotidien',
      'Produit 100% original certifié Abbott scellé d’origine'
    ],
    specs: {
      duration: '60 jours au total (4 x 15 jours)',
      waterproof: 'IP27 (résistant à la douche & baignade)',
      bloodSample: 'Sans piqûre au doigt',
      alarms: 'Alertes automatiques en temps réel (Bluetooth)',
      dimensions: '4 capteurs FreeStyle Libre 2 PLUS',
      memory: 'Stockage continu sur smartphone',
      appCompatibility: 'Application officielle FreeStyle LibreLink',
      calibration: 'Calibré en usine (aucun étalonnage requis)'
    },
    boxContents: [
      '4 Capteurs FreeStyle Libre 2 PLUS complets scellés',
      '4 Applicateurs stériles individuels',
      'Lingettes imprégnées d’alcool pour désinfection',
      'Guide d’utilisation en Français'
    ],
    isPopular: true,
  },
  {
    id: 'pack-10-fsl2-plus',
    name: 'Pack Éco 10 Pièces - FreeStyle Libre 2 PLUS',
    category: 'offres-speciales',
    categoryLabel: 'Offres Spéciales',
    brand: 'Abbott',
    shortDescription: 'Mega Pack 10 capteurs FreeStyle Libre 2 PLUS (53 DH / pièce). La meilleure offre au Maroc pour 150 jours de sérénité.',
    fullDescription: 'Le pack le plus économique au Maroc : 10 capteurs FreeStyle Libre 2 PLUS pour seulement 530 DH (soit 53 DH l’unité). Assure 5 mois complets de surveillance continue de la glycémie sans interruption avec alertes en direct.',
    price: 530,
    originalPrice: 1350,
    discountPercentage: 60,
    badge: 'Meilleur Prix',
    inStock: true,
    stockCount: 30,
    rating: 5.0,
    reviewsCount: 240,
    image: imgPack10,
    gallery: [
      imgPack10,
      imgPack4,
    ],
    features: [
      'Prix record : 530 DH les 10 pièces (53 DH / pièce)',
      'Jusqu’à 150 jours (5 mois) de surveillance continue',
      'Alertes directes sans scanner le capteur',
      'Livraison express disponible partout au Maroc',
      'Paiement en espèces à la livraison (100% sécurisé)',
      'Dates d’expiration longues garanties'
    ],
    specs: {
      duration: '150 jours au total (10 x 15 jours)',
      waterproof: 'IP27 résistant à l’eau',
      bloodSample: 'Sans piqûre quotidienne',
      alarms: 'Oui, notifications sonores / vibrations',
      dimensions: '10 boîtes individuelles scellées',
      memory: 'Historique continu LibreLink',
      appCompatibility: 'iOS et Android',
      calibration: 'Usine'
    },
    boxContents: [
      '10 Capteurs FreeStyle Libre 2 PLUS scellés d’origine',
      '10 Applicateurs d’application stérile',
      'Kit lingettes désinfectantes',
      'Conseils d’utilisation et assistance téléphonique'
    ],
    isPopular: true,
  },
  {
    id: 'fsl3-plus-nouveau',
    name: 'FreeStyle Libre 3 PLUS (Nouveau)',
    category: 'libre-3',
    categoryLabel: 'FreeStyle Libre 3 PLUS',
    brand: 'Abbott',
    shortDescription: 'Nouvelle génération Libre 3 PLUS : jusqu’à 15 jours de suivi continu, ultra petit, discret et lecture en 1 seconde.',
    fullDescription: 'Le tout nouveau FreeStyle Libre 3 PLUS représente le summum de la technologie de suivi de glycémie. Plus petit et plus discret que jamais, il assure jusqu’à 15 jours de mesure en continu avec lecture instantanée en 1 seconde et compatibilité totale LibreLink.',
    price: 800,
    originalPrice: 950,
    discountPercentage: 16,
    badge: 'Nouveau !',
    inStock: true,
    stockCount: 22,
    rating: 5.0,
    reviewsCount: 95,
    image: imgLibre3,
    gallery: [
      imgLibre3,
      imgPack4,
    ],
    features: [
      'Jusqu’à 15 jours de suivi continu',
      'Plus petit et plus discret au monde',
      'Lecture automatique en 1 seconde',
      'Compatible avec l’application LibreLink',
      'Précision clinique de nouvelle génération MARD 7.9%',
      'Applicateur tout-en-un monobloc ultra simple'
    ],
    specs: {
      duration: 'Jusqu’à 15 jours',
      waterproof: 'IP28 (étanche jusqu’à 1m pendant 30 min)',
      bloodSample: 'Sans aucune piqûre',
      alarms: 'Alertes directes à la minute',
      dimensions: 'Taille ultra-réduite (2 pièces de monnaie)',
      memory: 'Historique continu cloud',
      appCompatibility: 'Application officielle FreeStyle Libre 3',
      calibration: 'Calibré d’usine'
    },
    boxContents: [
      '1 Applicateur tout-en-un FreeStyle Libre 3 PLUS scellé',
      'Lingette de nettoyage cutané',
      'Guide rapide de mise en service'
    ],
    isPopular: true,
  },
  {
    id: 'omnipod-5-pods-10pack',
    name: 'Omnipod 5 PODS (Pack de 10)',
    category: 'omnipod',
    categoryLabel: 'Omnipod 5',
    brand: 'Insulet',
    shortDescription: 'Boîte de 10 Pods automatisés sans tubulure pour système de délivrance continue d’insuline Omnipod 5.',
    fullDescription: 'Le système Omnipod 5 simplifie la vie sans aucune tubulure encombrante. Ce pack de 10 Pods étanches et discrets s’intègre parfaitement avec les capteurs pour une gestion automatisée et sereine du traitement au quotidien.',
    price: 3000,
    originalPrice: 3400,
    discountPercentage: 12,
    badge: 'Nouveau !',
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewsCount: 42,
    image: imgOmnipod,
    gallery: [
      imgOmnipod,
    ],
    features: [
      'Pack officiel de 10 Pods Omnipod 5 scellés',
      'Technologie sans tubulure (Tubeless) pour une liberté totale',
      'Étanche IP28 pour se doucher et nager sans contrainte',
      'Insertion automatique de la canule sans douleur en un clic',
      'Compatible avec les algorithmes d’automatisation'
    ],
    specs: {
      duration: 'Jusqu’à 72 heures par Pod (30 jours pour le pack)',
      waterproof: 'IP28 étanche',
      bloodSample: 'N/A',
      alarms: 'Alertes système automatisées',
      dimensions: 'Boîte de 10 Pods individuels',
      memory: 'Intégration contrôleur Omnipod',
      appCompatibility: 'Application Omnipod 5',
      calibration: 'Automatisée'
    },
    boxContents: [
      '10 Pods Omnipod 5 stériles scellés',
      '10 Seringues de remplissage avec aiguille',
      'Manuel d’utilisation'
    ],
    isPopular: true,
  },
  {
    id: 'fsl2-lecteur-officiel',
    name: 'Lecteur Officiel FreeStyle Libre 2',
    category: 'lecteurs',
    categoryLabel: 'Lecteurs & Kits',
    brand: 'Abbott',
    shortDescription: 'Appareil de lecture tactile dédié avec alarmes sonores et écran couleur haute lisibilité.',
    fullDescription: 'Le lecteur FreeStyle Libre 2 est un appareil compact, léger et facile à prendre en main, idéal si vous préférez un dispositif dédié plutôt que votre smartphone, ou pour les personnes âgées et enfants. Écran couleur rétroéclairé tactile, menus clairs en français.',
    price: 450,
    originalPrice: 550,
    discountPercentage: 18,
    badge: 'Essentiel',
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviewsCount: 52,
    image: imgReader,
    gallery: [
      imgReader,
    ],
    features: [
      'Écran tactile couleur haute lisibilité',
      'Alarmes sonores et vibrations personnalisables',
      'Conservation des données de glycémie pendant 90 jours',
      'Rechargeable via câble USB standard',
      'Port intégré pour bandelettes de secours FreeStyle Optium'
    ],
    specs: {
      duration: 'Batterie rechargeable longue durée',
      waterproof: 'Non étanche (conserver au sec)',
      bloodSample: 'Lecture sans contact NFC + port bandelettes',
      alarms: 'Alarmes sonores / vibreur intégrées',
      dimensions: '95 mm x 60 mm x 16 mm (65 grammes)',
      memory: '90 jours d’historique complet',
      appCompatibility: 'Autonome (liaison PC via câble)',
      calibration: 'Aucune'
    },
    boxContents: [
      '1 Lecteur FreeStyle Libre 2 (version française)',
      '1 Câble USB de charge et transfert',
      '1 Adaptateur secteur officiel',
      'Manuel d’utilisation détaillé'
    ],
    isPopular: false,
  },
  {
    id: 'patch-fixation-pack-10',
    name: 'Patch de Fixation Étanche (Pack de 10)',
    category: 'accessoires',
    categoryLabel: 'Accessoires & Soins',
    brand: 'Parailaf Protect',
    shortDescription: 'Maintien optimal du capteur sous la douche, pendant le sport ou la baignade. Respirant et hypoallergénique.',
    fullDescription: 'Protégez efficacement votre capteur FreeStyle Libre 2 ou 3 contre les décollements accidentels, les frottements d’habits et l’eau. Fabriqués en tissu médical extensible sans latex, ces patchs assurent une adhérence sans faille pendant plus de 14 jours.',
    price: 120,
    originalPrice: 160,
    discountPercentage: 25,
    badge: 'Promo',
    inStock: true,
    stockCount: 110,
    rating: 4.8,
    reviewsCount: 145,
    image: imgPatches,
    gallery: [
      imgPatches,
    ],
    features: [
      'Pack de 10 patchs pré-découpés avec zone centrale non collante',
      'Résistant à l’eau, à la sueur et aux frottements sportifs',
      'Matière respirante en coton médical hypoallergénique',
      'Décollage indolore sans résidu',
      'Compatible FreeStyle Libre 2, 3 et Omnipod'
    ],
    specs: {
      duration: '15 jours par patch',
      waterproof: '100% étanche pour douche et natation',
      bloodSample: 'N/A',
      alarms: 'N/A',
      dimensions: 'Diamètre adapté aux capteurs',
      memory: 'N/A',
      appCompatibility: 'N/A',
      calibration: 'N/A'
    },
    boxContents: [
      '10 Patchs adhésifs de fixation étanches',
      'Pochette protectrice refermable'
    ],
    isPopular: false,
  },
  {
    id: 'lingettes-alcoolisees-100',
    name: 'Lingettes Alcoolisées (Boîte de 100 pièces)',
    category: 'accessoires',
    categoryLabel: 'Accessoires & Soins',
    brand: 'Parailaf Hygiene',
    shortDescription: 'Nettoyage et dégraissage parfait de la peau avant l’application du capteur pour une adhérence maximale.',
    fullDescription: 'La préparation de la peau est l’élément clé pour garantir que votre capteur FreeStyle Libre adhère parfaitement pendant toute sa durée de 15 jours. Ces lingettes individuelles stériles éliminent les huiles cutanées et désinfectent la zone en 30 secondes.',
    price: 25,
    originalPrice: 40,
    discountPercentage: 37,
    badge: 'Indispensable',
    inStock: true,
    stockCount: 150,
    rating: 4.9,
    reviewsCount: 89,
    image: imgWipes,
    gallery: [
      imgWipes,
    ],
    features: [
      '100 sachets individuels étanches scellés',
      'Alcool Isopropylique 70% de qualité médicale',
      'Séchage rapide sans laisser de résidu',
      'Garantit une tenue sans décollement du capteur'
    ],
    specs: {
      duration: 'Usage unique',
      waterproof: 'N/A',
      bloodSample: 'N/A',
      alarms: 'N/A',
      dimensions: 'Boîte de 100 unités',
      memory: 'N/A',
      appCompatibility: 'N/A',
      calibration: 'N/A'
    },
    boxContents: [
      '1 Boîte distributrice de 100 lingettes individuelles stériles'
    ],
    isPopular: false,
  },
  {
    id: 'trousse-transport-rigide',
    name: 'Trousse de Transport Résistante & Isotherme',
    category: 'accessoires',
    categoryLabel: 'Accessoires & Soins',
    brand: 'Parailaf Active',
    shortDescription: 'Étui antichoc renforcé pour ranger et protéger lecteur, capteur, lingettes et accessoires en déplacement.',
    fullDescription: 'Emportez tout votre matériel de suivi glycémique en toute sécurité. Coque rigide antichoc avec poches filet intérieures et zip renforcé. Protège votre lecteur et vos capteurs contre les chocs, la chaleur et l’humidité.',
    price: 70,
    originalPrice: 99,
    discountPercentage: 29,
    badge: 'Pratique',
    inStock: true,
    stockCount: 65,
    rating: 4.8,
    reviewsCount: 61,
    image: imgCase,
    gallery: [
      imgCase,
    ],
    features: [
      'Coque rigide en EVA antichoc et déperlante',
      'Compartiments organisés avec filets élastiques',
      'Format compact qui glisse facilement dans un sac',
      'Fermeture éclair haute résistance'
    ],
    specs: {
      duration: 'Durable et lavable',
      waterproof: 'Extérieur déperlant',
      bloodSample: 'N/A',
      alarms: 'N/A',
      dimensions: '18 cm x 9 cm x 4.5 cm',
      memory: 'N/A',
      appCompatibility: 'Tous matériels',
      calibration: 'N/A'
    },
    boxContents: [
      '1 Trousse de transport rigide noire'
    ],
    isPopular: false,
  },
  {
    id: 'fsl2-capteur-solo-plus',
    name: 'Capteur FreeStyle Libre 2 PLUS (Unité)',
    category: 'libre-2',
    categoryLabel: 'FreeStyle Libre 2 PLUS',
    brand: 'Abbott',
    shortDescription: 'Mesure continue du glucose jusqu’à 15 jours avec alertes en temps réel sans piqûre quotidienne.',
    fullDescription: 'Le capteur FreeStyle Libre 2 PLUS mesure en continu le taux de glucose jour et nuit pendant jusqu’à 15 jours. Grâce à la technologie Bluetooth BLE, il vous avertit immédiatement sur votre smartphone en cas d’hypoglycémie ou d’hyperglycémie.',
    price: 180,
    originalPrice: 220,
    discountPercentage: 18,
    badge: 'Best Seller',
    inStock: true,
    stockCount: 50,
    rating: 4.9,
    reviewsCount: 135,
    image: imgSingle2,
    gallery: [
      imgSingle2,
      imgPack4,
    ],
    features: [
      'Jusqu’à 15 jours de suivi continu sans piqûre',
      'Lecture facile avec l’application LibreLink',
      'Alertes en temps réel pour plus de sérénité',
      'Résistant à l’eau (douche et baignade)'
    ],
    specs: {
      duration: 'Jusqu’à 15 jours',
      waterproof: 'IP27',
      bloodSample: 'Sans piqûre',
      alarms: 'Alertes en direct',
      dimensions: '35 mm diamètre',
      memory: 'Stockage continu',
      appCompatibility: 'iOS et Android',
      calibration: 'Usine'
    },
    boxContents: [
      '1 Capteur FreeStyle Libre 2 PLUS scellé',
      '1 Applicateur stérile',
      'Lingettes d’alcool',
      'Notice en Français'
    ],
    isPopular: false,
  }
];
