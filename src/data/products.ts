import { Product } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  shortName?: string;
  count?: number;
  badge?: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'Tous les produits', shortName: 'Tous' },
  { id: 'offres-speciales', name: 'Offres Spéciales & Promos', shortName: 'Promos', badge: 'Promo' },
  { id: 'capteurs', name: 'Capteurs de Glycémie (CGM)', shortName: 'Capteurs' },
  { id: 'lecteurs', name: 'Lecteurs de Glycémie', shortName: 'Lecteurs' },
  { id: 'onetouch', name: 'OneTouch Verio®', shortName: 'OneTouch' },
  { id: 'dexcom', name: 'Dexcom CGM', shortName: 'Dexcom' },
  { id: 'libre-2', name: 'FreeStyle Libre 2 PLUS', shortName: 'Libre 2' },
  { id: 'libre-3', name: 'FreeStyle Libre 3 PLUS', shortName: 'Libre 3' },
  { id: 'omnipod', name: 'Omnipod DASH / 5', shortName: 'Omnipod' },
  { id: 'accessoires', name: 'Aiguilles & Accessoires', shortName: 'Aiguilles & Soins' },
  { id: 'packs', name: 'Packs & Kits Complets', shortName: 'Packs' },
];

/**
 * Checks whether a product belongs to a given category ID with smart keyword, brand, and badge fallbacks.
 */
export function matchesProductCategory(product: Product, categoryId: string): boolean {
  if (!categoryId || categoryId === 'all') return true;

  const cat = (product.category || '').toLowerCase();
  const label = (product.categoryLabel || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const id = (product.id || '').toLowerCase();
  const badge = (product.badge || '').toLowerCase();
  const discount = product.discountPercentage || 0;

  switch (categoryId) {
    case 'offres-speciales':
      return (
        cat === 'offres-speciales' ||
        badge.includes('offre') ||
        badge.includes('promo') ||
        badge.includes('remise') ||
        badge.includes('spéciale') ||
        badge.includes('special') ||
        badge.includes('exclusif') ||
        discount >= 20 ||
        (typeof product.originalPrice === 'number' && product.originalPrice > product.price && (product.originalPrice - product.price >= 80))
      );

    case 'capteurs':
      return (
        cat === 'capteurs' ||
        cat === 'libre-2' ||
        cat === 'libre-3' ||
        cat === 'dexcom' ||
        name.includes('capteur') ||
        name.includes('sensor') ||
        id.includes('capteur')
      );

    case 'lecteurs':
      return (
        cat === 'lecteurs' ||
        label.includes('lecteur') ||
        name.includes('lecteur') ||
        name.includes('onetouch') ||
        name.includes('verio') ||
        id.includes('lecteur') ||
        id.includes('onetouch')
      );

    case 'onetouch':
      return (
        cat === 'onetouch' ||
        brand.includes('onetouch') ||
        name.includes('onetouch') ||
        name.includes('verio') ||
        id.includes('onetouch')
      );

    case 'dexcom':
      return (
        cat === 'dexcom' ||
        brand.includes('dexcom') ||
        name.includes('dexcom') ||
        id.includes('dexcom')
      );

    case 'libre-2':
      return (
        cat === 'libre-2' ||
        name.includes('libre 2') ||
        id.includes('fsl2') ||
        name.includes('fsl 2')
      );

    case 'libre-3':
      return (
        cat === 'libre-3' ||
        name.includes('libre 3') ||
        id.includes('fsl3') ||
        name.includes('fsl 3')
      );

    case 'omnipod':
      return (
        cat === 'omnipod' ||
        brand.includes('insulet') ||
        name.includes('omnipod') ||
        id.includes('omnipod')
      );

    case 'accessoires':
      return (
        cat === 'accessoires' ||
        label.includes('accessoire') ||
        name.includes('trousse') ||
        name.includes('patch') ||
        name.includes('aiguille') ||
        name.includes('lancette') ||
        brand.includes('bd') ||
        id.includes('bd-') ||
        id.includes('patch') ||
        id.includes('trousse')
      );

    case 'packs':
      return (
        cat === 'packs' ||
        name.includes('pack') ||
        name.includes('kit') ||
        name.includes('boîte') ||
        name.includes('boite') ||
        id.includes('pack') ||
        id.includes('kit')
      );

    default:
      return cat === categoryId || label.includes(categoryId) || id.includes(categoryId);
  }
}

/**
 * Calculates dynamic product count for a given category based on active catalog
 */
export function getCategoryCount(categoryId: string, products: Product[]): number {
  if (categoryId === 'all') return products.length;
  return products.filter(p => matchesProductCategory(p, categoryId)).length;
}

export const PRODUCTS: Product[] = [
  {
    "rating": 5,
    "name": "Capteur Dexcom G7 - Système CGM Tout-en-un",
    "shortDescription": "La nouvelle génération Dexcom G7. Capteur ultra-fin tout-en-un. Suivi du glucose en continu 24h/24 sans piqûre, avec alertes prédictives en temps réel.",
    "specs": {
      "calibration": "Calibration d'usine automatique",
      "alarms": "Alertes d'urgence sonores, vibratoires & prédictives",
      "duration": "Jusqu'à 10 jours de port",
      "memory": "Historique des données",
      "bloodSample": "Sans piqûre au doigt (Zero fingersticks)",
      "appCompatibility": "iOS et Android (Dexcom G7 App)",
      "waterproof": "IP68 (résistant à l'eau jusqu'à 2,4m pendant 24h)",
      "dimensions": "60% plus petit que le Dexcom G6"
    },
    "boxContents": [
      "1 Capteur Dexcom G7 Tout-en-un",
      "Applicateur automatique intégré",
      "Guide d'utilisation et notice",
      "Patch de sur-fixation"
    ],
    "brand": "Dexcom",
    "features": [
      "Suivi en continu 24h/24 et 7j/7",
      "Alertes en temps réel sur votre téléphone",
      "Haute précision à chaque instant",
      "Capteur ultra-fin et confortable au quotidien",
      "Aucun prélèvement (sans douleur, zéro piqûre au doigt)",
      "Temps de préchauffage ultra-rapide de 30 minutes",
      "Dispositif tout-en-un (capteur et transmetteur intégrés)"
    ],
    "image": "/src/assets/images/dexcom_g7_box_sensor_1789135976489.jpg",
    "badge": "Nouveau !",
    "isPopular": true,
    "gallery": [
      "/src/assets/images/dexcom_g7_box_sensor_1789135976489.jpg",
      "/src/assets/images/dexcom_g7_user_photo.jpg"
    ],
    "fullDescription": "Le Dexcom G7 est la toute dernière innovation en matière de surveillance continue du glucose (CGM). Ce dispositif tout-en-un (capteur et transmetteur intégrés) est 60% plus petit que le G6, offrant un confort absolu au quotidien. Le temps de préchauffage est ultra-rapide (seulement 30 minutes). Bénéficiez d'une précision exceptionnelle et recevez vos taux de glucose directement sur votre smartphone compatible (iOS/Android) sans aucune piqûre au doigt. Ses alertes prédictives intelligentes vous préviennent jusqu'à 20 minutes avant une hypoglycémie pour une tranquillité d'esprit totale.",
    "categoryLabel": "Dexcom",
    "reviewsCount": 24,
    "stockCount": 50,
    "id": "dexcom-g7-capteur",
    "sortOrder": 0,
    "price": 450,
    "originalPrice": 650,
    "inStock": true,
    "category": "dexcom"
  },
  {
    "badge": "Offre Spéciale",
    "reviewsCount": 47,
    "originalPrice": 650,
    "features": [
      "Mesure continue du glucose en temps réel toutes les 5 minutes",
      "Zéro piqûre au bout du doigt & aucune calibration requise",
      "Transmetteur officiel Dexcom G6 Bluetooth inclus",
      "Applicateur automatique en un seul clic, rapide et indolore",
      "Alertes personnalisables et alerte d’urgence hypoglycémie prédictive",
      "Pochette de 20 patchs adhésifs étanches Sensor Shield White incluse",
      "Partage des données en direct avec vos proches et médecin (Dexcom Follow)",
      "Dispositif médical original scellé d’origine en stock au Maroc"
    ],
    "image": "/src/assets/images/dexcom_g6_clean_1789129052228.jpg",
    "isPopular": true,
    "gallery": [
      "/src/assets/images/dexcom_g6_clean_1789129052228.jpg",
      "/src/assets/images/dexcom_g6_pack_1789124834465.jpg"
    ],
    "fullDescription": "Le système Dexcom G6 révolutionne la gestion du diabète grâce à sa technologie de surveillance continue du glucose (CGM) en temps réel. Sans aucune piqûre au bout du doigt ni étalonnage requis, vos mesures de glycémie sont transmises toutes les 5 minutes directement sur votre smartphone compatible (iOS / Android) ou votre récepteur. Ce kit complet exclusif comprend les capteurs Dexcom G6 avec applicateur automatique indolore en un clic, le transmetteur officiel Dexcom G6 à connexion Bluetooth sécurisée, ainsi qu'une pochette de 20 patchs étanches Sensor Shield White pour une protection optimale lors de vos activités sportives, sous la douche et au quotidien. Produit 100% original, certifié et scellé d'origine avec livraison express partout au Maroc et paiement sécurisé à la livraison.",
    "brand": "Dexcom",
    "specs": {
      "bloodSample": "Sans piqûre au doigt (Zero fingersticks)",
      "alarms": "Alertes d’urgence sonores & prédictives",
      "appCompatibility": "iOS et Android (Dexcom G6 & Dexcom Follow)",
      "dimensions": "Capteur ultra-plat et discret",
      "duration": "10 jours par capteur / 90 jours transmetteur",
      "calibration": "Calibré en usine (aucun étalonnage requis)",
      "waterproof": "IP28 (résistant à l’eau)",
      "memory": "Historique continu automatique dans l’app Dexcom G6"
    },
    "categoryLabel": "Dexcom G6",
    "category": "dexcom",
    "inStock": true,
    "boxContents": [
      "Boîte de capteurs Dexcom G6 avec applicateur automatique",
      "1 Transmetteur officiel Dexcom G6 Bluetooth scellé",
      "1 Pochette de 20 patchs adhésifs étanches Sensor Shield White",
      "Guide d’utilisation complet et notice en français"
    ],
    "id": "dexcom-g6-kit-complet",
    "price": 500,
    "rating": 5,
    "name": "Kit Complet Dexcom G6 - Système CGM & 20 Patchs Sensor Shield",
    "shortDescription": "Pack tout-en-un Dexcom G6 avec capteurs, applicateur automatique en 1 clic, transmetteur officiel Bluetooth et 20 patchs étanches Sensor Shield. Suivi continu sans piqûre au doigt.",
    "sortOrder": 1,
    "stockCount": 30
  },
  {
    "sortOrder": 2,
    "categoryLabel": "Accessoires & Soins",
    "brand": "Parailaf Active",
    "id": "trousse-transport-rigide",
    "specs": {
      "dimensions": "18 cm x 9 cm x 4.5 cm",
      "calibration": "N/A",
      "waterproof": "Extérieur déperlant",
      "memory": "N/A",
      "bloodSample": "N/A",
      "duration": "Durable et lavable",
      "alarms": "N/A",
      "appCompatibility": "Tous matériels"
    },
    "inStock": true,
    "name": "Trousse de Transport Résistante & Isotherme",
    "badge": "Pratique",
    "reviewsCount": 61,
    "shortDescription": "Étui antichoc renforcé pour ranger et protéger lecteur, capteur, lingettes et accessoires en déplacement.",
    "originalPrice": 390,
    "features": [
      "Coque rigide en EVA antichoc et déperlante",
      "Compartiments organisés avec filets élastiques",
      "Format compact qui glisse facilement dans un sac",
      "Fermeture éclair haute résistance"
    ],
    "image": "/src/assets/images/trousse_isotherme_bleue_1789135961656.jpg",
    "fullDescription": "Emportez tout votre matériel de suivi glycémique en toute sécurité. Coque rigide antichoc avec poches filet intérieures et zip renforcé. Protège votre lecteur et vos capteurs contre les chocs, la chaleur et l’humidité.",
    "rating": 4.8,
    "gallery": [
      "/src/assets/images/trousse_isotherme_bleue_1789135961656.jpg",
      "/src/assets/images/travel_case_eva_1788260915608.jpg"
    ],
    "stockCount": 65,
    "category": "accessoires",
    "isPopular": false,
    "boxContents": [
      "1 Trousse de transport rigide Bleu"
    ],
    "price": 300
  },
  {
    "inStock": true,
    "originalPrice": 2500,
    "features": [
      "Pompe à insuline sans tubulure (Patch)",
      "Jusqu'à 3 jours (72 heures) d'insuline non-stop",
      "Totalement étanche (IP28)",
      "Insertion automatique et quasi indolore de la canule",
      "Compatible avec le Gestionnaire Personnel de Diabète (PDM) DASH"
    ],
    "price": 2300,
    "rating": 5,
    "fullDescription": "L’Omnipod DASH est conçu pour simplifier l’administration quotidienne de l’insuline. Contrairement à une pompe à insuline traditionnelle, le Pod ne possède pas de tuyau externe : il est directement fixé sur la peau.\n\nLe système comprend principalement :\n\n1. Le Pod\n\nLe Pod est le petit dispositif que l'utilisateur porte sur son corps.\n\nSans tubulure\nSe porte directement sur la peau\nContient un réservoir d'insuline intégré pouvant contenir jusqu'à 200 unités\nAdministration automatique de l'insuline\nPetite canule souple insérée automatiquement\nPeut être porté à différents endroits habituellement utilisés pour les injections\nFonctionnement jusqu'à 72 heures (3 jours) selon les conditions d'utilisation et l'insuline utilisée.\n2. Le PDM\n\nLe Personal Diabetes Manager (PDM) est l'appareil utilisé pour contrôler le Pod.\n\nIl permet notamment de programmer :\n\nl'insuline basale\nles bolus\nles doses au moment des repas\ndifférents profils et réglages\ndes doses prédéfinies pour faciliter les repas\n\nLa communication entre le PDM et le Pod se fait sans fil. Lors du démarrage, ils doivent être placés à proximité l'un de l'autre ; en fonctionnement normal, le PDM doit rester dans la portée prévue par le fabricant.",
    "categoryLabel": "Omnipod",
    "isPopular": true,
    "category": "omnipod",
    "boxContents": [
      "5 Pods Omnipod DASH",
      "Seringues de remplissage",
      "Manuel d'utilisation"
    ],
    "specs": {
      "memory": "Mémoire interne au PDM",
      "waterproof": "IP28 (jusqu'à 7.6 mètres pendant 60 minutes)",
      "bloodSample": "N/A",
      "dimensions": "3.9 cm x 5.2 cm x 1.45 cm",
      "duration": "Jusqu'à 72 heures par Pod",
      "calibration": "N/A",
      "alarms": "Alertes de fin de pod, occlusion, etc.",
      "appCompatibility": "Application Omnipod Display"
    },
    "id": "omnipod-dash-pods",
    "gallery": [
      "/src/assets/images/omnipod_dash.jpg",
      "/src/assets/images/omnipod_5_pack10_1788260856591.jpg"
    ],
    "stockCount": 15,
    "reviewsCount": 12,
    "brand": "Insulet",
    "sortOrder": 3,
    "name": "Omnipod DASH® – Système de gestion de l’insuline sans tubulure",
    "shortDescription": "L’Omnipod DASH est une pompe à insuline tubeless destinée aux personnes ayant besoin d’un traitement par insuline. Le système utilise un petit Pod porté directement sur le corps et piloté sans fil par un PDM (Personal Diabetes Manager). Il permet une administration continue d’insuline basale ainsi que des bolus au moment des repas",
    "image": "/src/assets/images/omnipod_dash.jpg",
    "badge": "Nouveau !"
  },
  {
    "isPopular": true,
    "id": "capteur-fsl2-plus-unite",
    "reviewsCount": 135,
    "inStock": true,
    "features": [
      "Mesure continue jusqu’à 15 jours",
      "Sans piqûres au bout des doigts",
      "Alertes d’hypo/hyperglycémie en temps réel",
      "Suivi facile via l’application LibreLink",
      "Résistant à l’eau (jusqu’à 1 mètre pendant 30 min)"
    ],
    "name": "Capteur FreeStyle Libre 2 PLUS",
    "price": 550,
    "brand": "Abbott",
    "boxContents": [
      "1x Capteur FreeStyle Libre 2 PLUS",
      "1x Applicateur de capteur",
      "1x Lingette imprégnée d’alcool",
      "Guide d’utilisation rapide"
    ],
    "specs": {
      "duration": "Jusqu’à 15 jours",
      "alarms": "Alertes personnalisables en direct",
      "calibration": "Calibration d'usine automatique",
      "appCompatibility": "iOS et Android",
      "waterproof": "IP27 (résistant à l'eau)",
      "dimensions": "Format compact et discret",
      "bloodSample": "Sans piqûres au bout des doigts",
      "memory": "Historique des données"
    },
    "stockCount": 100,
    "originalPrice": 750,
    "gallery": [
      "/src/assets/images/freestyle_libre2_single_1788260930453.jpg",
      "/src/assets/images/freestyle_libre2_pack4_1788260812490.jpg"
    ],
    "sortOrder": 4,
    "badge": "Offre Spéciale",
    "categoryLabel": "FreeStyle Libre 2 PLUS",
    "rating": 5,
    "shortDescription": "Capteur FreeStyle Libre 2 PLUS (Unité). Mesure en continu 24h/24 sans piqûres au bout des doigts, avec alertes personnalisées.",
    "category": "libre-2",
    "fullDescription": "Le capteur FreeStyle Libre 2 PLUS mesure en continu le taux de glucose jour et nuit pendant jusqu’à 15 jours. Grâce à la technologie Bluetooth BLE, il vous avertit immédiatement sur votre smartphone en cas d’hypoglycémie ou d’hyperglycémie. Vendu à l’unité avec livraison express.",
    "image": "/src/assets/images/freestyle_libre2_single_1788260930453.jpg"
  },
  {
    "isPopular": true,
    "badge": "Nouveau !",
    "image": "/src/assets/images/freestyle_libre3_plus_1788260841456.jpg",
    "originalPrice": 950,
    "inStock": true,
    "features": [
      "Jusqu’à 15 jours de suivi continu",
      "Plus petit et plus discret au monde",
      "Lecture automatique en 1 seconde",
      "Compatible avec l’application LibreLink",
      "Précision clinique de nouvelle génération MARD 7.9%",
      "Applicateur tout-en-un monobloc ultra simple"
    ],
    "categoryLabel": "FreeStyle Libre 3 PLUS",
    "brand": "Abbott",
    "reviewsCount": 95,
    "shortDescription": "Nouvelle génération Libre 3 PLUS : jusqu’à 15 jours de suivi continu, ultra petit, discret et lecture en 1 seconde.",
    "fullDescription": "Le tout nouveau FreeStyle Libre 3 PLUS représente le summum de la technologie de suivi de glycémie. Plus petit et plus discret que jamais, il assure jusqu’à 15 jours de mesure en continu avec lecture instantanée en 1 seconde et compatibilité totale LibreLink.",
    "rating": 5,
    "specs": {
      "bloodSample": "Sans aucune piqûre",
      "memory": "Historique continu cloud",
      "dimensions": "Taille ultra-réduite (2 pièces de monnaie)",
      "waterproof": "IP28 (étanche jusqu’à 1m pendant 30 min)",
      "calibration": "Calibré d’usine",
      "duration": "Jusqu’à 15 jours",
      "appCompatibility": "Application officielle FreeStyle Libre 3",
      "alarms": "Alertes directes à la minute"
    },
    "boxContents": [
      "1 Applicateur tout-en-un FreeStyle Libre 3 PLUS scellé",
      "Lingette de nettoyage cutané",
      "Guide rapide de mise en service"
    ],
    "price": 800,
    "name": "FreeStyle Libre 3 PLUS (Nouveau)",
    "gallery": [
      "/src/assets/images/freestyle_libre3_plus_1788260841456.jpg",
      "/src/assets/images/freestyle_libre2_pack4_1788260812490.jpg"
    ],
    "sortOrder": 5,
    "id": "fsl3-plus-nouveau",
    "category": "libre-3",
    "stockCount": 22
  },
  {
    "originalPrice": 1000,
    "badge": "Officiel",
    "features": [
      "Écran tactile couleur haute lisibilité",
      "Alarmes sonores et vibrations personnalisables",
      "Scan sans contact NFC rapide en moins d'une seconde",
      "Conservation des données de glycémie pendant 90 jours",
      "Rechargeable via câble USB standard",
      "Port intégré pour bandelettes de secours FreeStyle Optium"
    ],
    "image": "/src/assets/images/freestyle_libre2_reader_1789237795597.jpg",
    "gallery": [
      "/src/assets/images/freestyle_libre2_reader_1789237795597.jpg"
    ],
    "stockCount": 20,
    "reviewsCount": 52,
    "boxContents": [
      "1 Lecteur FreeStyle Libre 2 (version française)",
      "1 Câble USB de charge et transfert",
      "1 Adaptateur secteur officiel",
      "Manuel d’utilisation détaillé"
    ],
    "brand": "Abbott",
    "sortOrder": 6,
    "categoryLabel": "Lecteurs & Kits",
    "fullDescription": "Le lecteur FreeStyle Libre 2 est un appareil compact, léger et facile à prendre en main, idéal si vous préférez un dispositif dédié plutôt que votre smartphone, ou pour les personnes âgées et enfants. Écran couleur rétroéclairé tactile, menus clairs en français.",
    "specs": {
      "calibration": "Aucune",
      "memory": "90 jours d’historique complet",
      "dimensions": "95 mm x 60 mm x 16 mm (65 grammes)",
      "appCompatibility": "Autonome (liaison PC via câble)",
      "waterproof": "Non étanche (conserver au sec)",
      "duration": "Batterie rechargeable longue durée",
      "bloodSample": "Lecture sans contact NFC + port bandelettes",
      "alarms": "Alarmes sonores / vibreur intégrées"
    },
    "category": "lecteurs",
    "id": "fsl2-lecteur-officiel",
    "inStock": true,
    "rating": 4.8,
    "isPopular": false,
    "price": 800,
    "name": "Lecteur Officiel FreeStyle Libre 2",
    "shortDescription": "Lecteur officiel Abbott FreeStyle Libre 2 avec écran tactile couleur, alarmes sonores et scan sans contact."
  },
  {
    "id": "fsl3-lecteur-officiel",
    "name": "FreeStyle Libre 3 – Lecteur Officiel & Appareil de Glucose",
    "brand": "Abbott",
    "category": "lecteurs",
    "categoryLabel": "Lecteurs & Kits",
    "price": 1000,
    "originalPrice": 1250,
    "discountPercentage": 20,
    "badge": "Nouveau",
    "rating": 4.9,
    "reviewsCount": 38,
    "isPopular": true,
    "inStock": true,
    "stockCount": 15,
    "sortOrder": 5,
    "shortDescription": "Lecteur officiel Abbott FreeStyle Libre 3 (Lesegerät). Appareil récepteur autonome avec écran couleur tactile et alarmes en temps réel chaque minute.",
    "fullDescription": "L'appareil lecteur officiel Abbott FreeStyle Libre 3 (Lesegerät) est conçu spécifiquement pour la surveillance continue du glucose avec les capteurs FreeStyle Libre 3 au Maroc. Dispositif dédié autonome, il reçoit automatiquement les mesures de glucose transmises chaque minute sans nécessiter aucun scan manuel. Doté d'un écran tactile lumineux et d'alarmes sonores/vibrantes personnalisables pour l'hypo et l'hyperglycémie, il constitue l'alternative parfaite et fiable au smartphone.",
    "features": [
      "Appareil officiel d'origine Abbott pour capteurs FreeStyle Libre 3",
      "Lecture continue automatique du glucose minute par minute sans scan",
      "Écran couleur tactile haute définition, clair et intuitif",
      "Alarmes sonores et vibrations personnalisables (hypo / hyperglycémie)",
      "Historique complet et graphiques de tendances sur 90 jours",
      "Batterie rechargeable longue durée via câble USB fourni",
      "Appareil médical dédié, idéal pour les patients et enfants sans smartphone"
    ],
    "specs": {
      "calibration": "Calibration d'usine d'origine (aucun étalonnage requis)",
      "memory": "90 jours d’historique de glycémie et tendances",
      "dimensions": "Format ultra-compact, léger et discret",
      "appCompatibility": "Autonome (dédié aux capteurs FreeStyle Libre 3)",
      "waterproof": "Non étanche (conserver au sec)",
      "duration": "Batterie lithium-ion rechargeable longue autonomie",
      "bloodSample": "Mesure continue automatique sans piqûre",
      "alarms": "Alertes sonores et vibreur immédiates en temps réel"
    },
    "boxContents": [
      "1 Lecteur officiel FreeStyle Libre 3 (Lesegerät Abbott)",
      "1 Câble USB de recharge et transfert",
      "1 Adaptateur secteur officiel",
      "Guide d'utilisation et notice officielle"
    ],
    "image": "/src/assets/images/freestyle_libre3_reader_1789324581254.jpg",
    "gallery": [
      "/src/assets/images/freestyle_libre3_reader_1789324581254.jpg"
    ]
  },
  {
    "categoryLabel": "Accessoires & Soins",
    "fullDescription": "Protégez efficacement votre capteur FreeStyle Libre 2 ou 3 contre les décollements accidentels, les frottements d’habits et l’eau. Fabriqués en tissu médical extensible sans latex, ces patchs assurent une adhérence sans faille pendant plus de 14 jours.",
    "isPopular": false,
    "features": [
      "Pack de 10 patchs pré-découpés avec zone centrale non collante",
      "Résistant à l’eau, à la sueur et aux frottements sportifs",
      "Matière respirante en coton médical hypoallergénique",
      "Décollage indolore sans résidu",
      "Compatible FreeStyle Libre 2, 3 et Omnipod"
    ],
    "reviewsCount": 145,
    "id": "patch-fixation-pack-10",
    "originalPrice": 160,
    "price": 120,
    "name": "Patch de Fixation Étanche (Pack de 10)",
    "inStock": true,
    "brand": "Parailaf Protect",
    "sortOrder": 7,
    "rating": 4.8,
    "shortDescription": "Maintien optimal du capteur sous la douche, pendant le sport ou la baignade. Respirant et hypoallergénique.",
    "specs": {
      "calibration": "N/A",
      "alarms": "N/A",
      "appCompatibility": "N/A",
      "dimensions": "Diamètre adapté aux capteurs",
      "duration": "15 jours par patch",
      "memory": "N/A",
      "bloodSample": "N/A",
      "waterproof": "100% étanche pour douche et natation"
    },
    "boxContents": [
      "10 Patchs adhésifs de fixation étanches",
      "Pochette protectrice refermable"
    ],
    "stockCount": 110,
    "badge": "Promo",
    "gallery": [
      "/src/assets/images/glucose_sensor_patches_1788260886831.jpg"
    ],
    "category": "accessoires",
    "image": "/src/assets/images/glucose_sensor_patches_1788260886831.jpg"
  },
  {
    "id": "bd-micro-fine-32g-4mm",
    "name": "BD Micro-Fine Plus Aiguille Insuline 32G / 4mm",
    "category": "accessoires",
    "categoryLabel": "Accessoires & Soins",
    "brand": "BD",
    "price": 100,
    "originalPrice": 140,
    "discountPercentage": 28,
    "inStock": true,
    "stockCount": 100,
    "rating": 5.0,
    "reviewsCount": 48,
    "badge": "Top Vente",
    "sortOrder": 8,
    "image": "/src/assets/images/bd_microfine_needle_1789332833527.jpg",
    "gallery": [
      "/src/assets/images/bd_microfine_needle_1789332833527.jpg"
    ],
    "shortDescription": "Aiguilles à stylos pour injection d'insuline BD Micro-Fine Ultra PRO 32G (0,23 mm) x 4 mm. Boîte officielle de 100 aiguilles stériles à usage unique.",
    "fullDescription": "Les aiguilles pour stylos à insuline BD Micro-Fine Plus / Ultra PRO 32G (0,23 mm) x 4 mm garantissent une injection sous-cutanée de haute précision avec un confort maximal. Grâce à leur diamètre fin 32G et leur longueur réduite de 4 mm, elles permettent une injection directe et quasi indolore sans pli de peau chez la majorité des patients. Compatibles avec l'ensemble des stylos injecteurs du marché (Lantus, Toujeo, Novorapid, Humalog, Ozempic, Victoza, etc.). Boîte officielle scellée de 100 aiguilles stériles.",
    "features": [
      "Calibre ultra-fin 32G (0,23 mm) pour une injection quasi indolore",
      "Longueur 4 mm adaptée à tous les profils sans pli cutané",
      "Technologie à 5 biseaux PentaPoint pour une pénétration en douceur",
      "Compatibilité universelle avec 100% des stylos à insuline",
      "Boîte officielle scellée de 100 aiguilles stériles"
    ],
    "boxContents": [
      "1 Boîte de 100 Aiguilles BD Micro-Fine Ultra PRO 32G / 4mm",
      "Capuchons de protection stériles individuels",
      "Notice d'utilisation BD"
    ],
    "specs": {
      "dimensions": "0,23 mm (32G) x 4 mm",
      "appCompatibility": "Tous stylos injecteurs standards",
      "duration": "Usage unique stérile",
      "calibration": "N/A",
      "alarms": "N/A",
      "memory": "N/A",
      "bloodSample": "N/A",
      "waterproof": "N/A"
    }
  },
  {
    "id": "onetouch-verio-reflect",
    "name": "Lecteur de glycémie OneTouch Verio Reflect®",
    "category": "lecteurs",
    "categoryLabel": "Lecteurs & Kits",
    "brand": "OneTouch",
    "price": 250,
    "originalPrice": 350,
    "discountPercentage": 29,
    "inStock": true,
    "stockCount": 45,
    "rating": 5.0,
    "reviewsCount": 36,
    "badge": "Top Qualité",
    "sortOrder": 9,
    "image": "/src/assets/images/onetouch_verio_reflect_1789383799712.jpg",
    "gallery": [
      "/src/assets/images/onetouch_verio_reflect_1789383799712.jpg",
      "/src/assets/images/onetouch_verio_strips_1789383815558.jpg"
    ],
    "shortDescription": "Lecteur de glycémie intelligent OneTouch Verio Reflect® avec fonction Blood Sugar Mentor et indicateur d'objectif ColourSure® Plus. Kit complet avec autopiqueur, lancettes et étui.",
    "fullDescription": "Le lecteur de glycémie OneTouch Verio Reflect® est doté de la technologie innovante Blood Sugar Mentor qui analyse vos résultats et vous délivre des conseils personnalisés, des alertes de tendances et des messages d'encouragement directement sur son écran couleur haute définition. Grâce à l'indicateur d'objectif dynamique ColourSure® Plus, vous savez immédiatement si votre taux de sucre se situe dans la cible, proche de la limite basse ou haute, ou en zone critique. Connectivité Bluetooth® intégrée avec l'application gratuite OneTouch Reveal® (compatible iOS et Android) pour un suivi complet et un partage facile avec votre médecin. Fonctionne avec les bandelettes OneTouch Verio® d'une précision clinique prouvée. Fourni en kit complet prêt à l'emploi.",
    "features": [
      "Blood Sugar Mentor : conseils personnalisés, alertes de tendances et encouragements en temps réel",
      "Indicateur dynamique d'objectif ColourSure® Plus à code couleur instantané",
      "Connexion Bluetooth® vers l'application gratuite OneTouch Reveal®",
      "Écran couleur haute définition rétroéclairé pour un confort de lecture optimal",
      "Résultats rapides en 5 secondes avec seulement 0,4 µl de sang",
      "Compatible avec les bandelettes réactives OneTouch Verio®",
      "Mémoire interne de 750 mesures de glycémie horodatées",
      "Kit complet prêt à l'emploi avec autopiqueur Delica® Plus et trousse de transport"
    ],
    "boxContents": [
      "1 Lecteur de glycémie OneTouch Verio Reflect® (piles incluses)",
      "1 Stylo autopiqueur OneTouch Delica® Plus",
      "10 Lancettes stériles OneTouch Delica® Plus",
      "1 Trousse de transport rigide",
      "1 Manuel d'utilisation et guide de démarrage rapide"
    ],
    "specs": {
      "bloodSample": "0,4 µL de sang capillaire",
      "duration": "Mesure rapide en 5 secondes",
      "memory": "750 résultats de glycémie horodatés",
      "appCompatibility": "Application OneTouch Reveal® (iOS et Android)",
      "calibration": "Automatique (technologie sans codage)",
      "alarms": "Alertes d'hypo/hyperglycémie et tendances glycémiques",
      "dimensions": "Design compact ergonomique avec écran couleur",
      "waterproof": "Dispositif médical certifié CE"
    }
  }
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
  image: '',
  gallery: [],
  features: [
    'Mesure du glucose en continu 24h/24',
    'Sans piqûres au bout des doigts',
    'Alertes d’hypo/hyperglycémie en temps réel',
    'Suivi facile via l’application LibreLink',
    'Résistant à l’eau (jusqu’à 1 mètre pendant 30 min)'
  ],
  boxContents: [
    '1x Capteur FreeStyle Libre 2 PLUS',
    '1x Applicateur de capteur',
    '1x Lingette imprégnée d’alcool',
    'Guide d’utilisation en Français'
  ],
  isPopular: true,
  specs: {}
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
  image: '',
  gallery: [],
  features: [
    'Capteur ultra-discret',
    'Mesure en continu sans scan',
    'Alertes Bluetooth automatiques',
    'Application Libre 3',
    'Durée de 15 jours'
  ],
  boxContents: [
    '1x Capteur FreeStyle Libre 3 PLUS',
    '1x Applicateur de capteur intégré',
    'Guide d’utilisation en Français'
  ],
  isPopular: true,
  specs: {}
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
  image: '',
  gallery: [],
  features: [
    'Système automatisé',
    'Sans tubulure',
    'Ajustement toutes les 5 min',
    'Compatible Dexcom / FSL',
    'Étanche IP28'
  ],
  boxContents: [
    '5x Pods Omnipod 5',
    'Seringues de remplissage',
    'Guide de démarrage rapide'
  ],
  isPopular: true,
  specs: {}
};
