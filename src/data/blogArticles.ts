import { BlogArticle, BlogCategory, Product } from '../types';

import imgLibre2Single from '../assets/images/freestyle_libre2_single_1788260930453.jpg';
import imgLibre3Plus from '../assets/images/freestyle_libre3_plus_1788260841456.jpg';
import imgLibre2Reader from '../assets/images/freestyle_libre2_reader_1789237795597.jpg';
import imgLibre3Reader from '../assets/images/freestyle_libre3_reader_1789324581254.jpg';
import imgSensorPatches from '../assets/images/glucose_sensor_patches_1788260886831.jpg';
import imgTrousseIsotherme from '../assets/images/trousse_isotherme_bleue_1789135961656.jpg';
import imgLibre2Pack4 from '../assets/images/freestyle_libre2_pack4_1788260812490.jpg';
import imgOneTouchReflect from '../assets/images/onetouch_verio_reflect_1789383799712.jpg';

export interface BlogCategoryMeta {
  id: 'all' | BlogCategory;
  label: string;
  labelAr: string;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  { id: 'all', label: 'Tous les conseils', labelAr: 'جميع المقالات' },
  { id: 'capteurs-freestyle', label: 'Capteurs FreeStyle', labelAr: 'مجسات فري ستايل' },
  { id: 'gestion-diabete', label: 'Gestion du Diabète', labelAr: 'إدارة السكري' },
  { id: 'astuces-quotidien', label: 'Sport & Quotidien', labelAr: 'الرياضة والحياة اليومية' },
  { id: 'nutrition-maroc', label: 'Nutrition & Équilibre', labelAr: 'التغذية المتوازنة' },
];

export const BLOG_IMAGE_MAP: Record<string, string> = {
  'capteur-fsl2-plus-unite': imgLibre2Single,
  'fsl3-plus-nouveau': imgLibre3Plus,
  'fsl2-lecteur-officiel': imgLibre2Reader,
  'fsl3-lecteur-officiel': imgLibre3Reader,
  'patch-fixation-pack-10': imgSensorPatches,
  'trousse-transport-rigide': imgTrousseIsotherme,
  'freestyle_libre2_pack4': imgLibre2Pack4,
  'onetouch-verio-reflect': imgOneTouchReflect,
};

export function resolveBlogArticleImage(
  article: Pick<BlogArticle, 'image' | 'imageKey' | 'relatedProductId'>,
  relatedProduct?: Product,
  getProductImage?: (product: Product) => string
): string {
  // 1. Always prioritize the live image of the linked real catalog product (includes Firestore custom images)
  if (relatedProduct) {
    const productImg = getProductImage ? getProductImage(relatedProduct) : relatedProduct.image;
    if (productImg && productImg.trim().length > 0) {
      return productImg;
    }
  }

  // 2. Fallback to mapped real catalog asset by relatedProductId or imageKey
  if (article.relatedProductId && BLOG_IMAGE_MAP[article.relatedProductId]) {
    return BLOG_IMAGE_MAP[article.relatedProductId];
  }
  if (article.imageKey && BLOG_IMAGE_MAP[article.imageKey]) {
    return BLOG_IMAGE_MAP[article.imageKey];
  }

  // 3. Explicit image field if present and non-empty
  if (article.image && article.image.trim().length > 0) {
    return article.image;
  }

  return imgLibre2Single;
}

export const INITIAL_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'guide-pose-freestyle-libre-sans-erreur',
    slug: 'guide-pose-freestyle-libre-sans-erreur',
    title: 'Comment poser et activer votre capteur FreeStyle Libre 2 ou 3 PLUS sans erreur',
    titleAr: 'كيفية تركيب وتفعيل مجس فري ستايل ليبري 2 أو 3 بلس بدون أخطاء',
    excerpt:
      'Préparation de la peau, choix de la zone à l’arrière du bras, temps de séchage et premier scan : toutes les étapes clés pour garantir 14 à 15 jours de mesures fiables.',
    excerptAr:
      'تحضير البشرة، اختيار المنطقة المناسبة خلف الذراع، التجفيف والمسح الأول: كل الخطوات لضمان قياس دقيق لمدة 14 إلى 15 يوماً.',
    content: `La réussite de vos 14 à 15 jours de suivi glycémique dépend en grande partie des 3 minutes consacrées à la préparation et à la pose du capteur FreeStyle Libre. Une peau bien préparée assure à la fois la précision des mesures dans le liquide interstitiel et une excellente tenue de l'adhésif.

## 1. Choisir le bon emplacement à l'arrière du bras
L'arrière de la partie supérieure du bras reste la zone cliniquement validée par Abbott. Évitez les zones présentant des grains de beauté, des cicatrices, des vergetures ou des plis cutanés marqués. Pensez également à alterner entre le bras gauche et le bras droit à chaque nouveau capteur pour laisser la peau respirer.

## 2. Nettoyer, dégraisser et sécher parfaitement
Lavez la zone avec un savon neutre (sans crème hydratante ni huile), rincez abondamment puis désinfectez avec la lingette alcoolisée fournie dans la boîte. Attendez impérativement 60 secondes que l'alcool soit totalement évaporé avant d'appliquer l'applicateur. Appliquer un capteur sur une peau encore humide réduit fortement l'adhérence.

## 3. Poser d'un geste ferme et vertical
Placez l'applicateur préparé bien à plat contre votre bras et appuyez fermement vers le bas jusqu'à entendre un clic net. Maintenez 3 à 5 secondes, puis retirez l'applicateur verticalement sans torsion. Passez ensuite doucement le doigt sur le pourtour adhésif blanc pour sceller les bords.

## 4. Activer et patienter 60 minutes
Approchez le haut de votre smartphone (application FreeStyle LibreLink ou Libre 3) ou votre lecteur officiel à moins de 4 cm du capteur. Un délai d'initialisation de 60 minutes démarre automatiquement : profitez-en pour laisser l'adhésif se fixer tranquillement avant toute douche ou activité physique.`,
    contentAr: `يعتمد نجاح فترة المتابعة التي تمتد من 14 إلى 15 يوماً بشكل كبير على الدقائق الثلاث المخصصة لتحضير الجلد وتركيب المجس بشكل سليم.

## 1. اختيار المكان المناسب خلف الذراع
الجزء الخلفي من أعلى الذراع هو المنطقة المعتمدة طبياً من شركة Abbott. تجنب وضع المجس فوق الشامات أو الندوب، واحرص على التبديل بين الذراع الأيمن والأيسر عند كل تركيب جديد.

## 2. التنظيف والتجفيف التام
اغسل المنطقة بصابون عادي خالٍ من الزيوت والمرطبات، ثم عقمها بالمنديل الكحولي المرفق في العلبة. انتظر لمدة 60 ثانية حتى يتبخر الكحول تماماً ويجف الجلد قبل وضع أداة التطبيق.

## 3. التثبيت بحركة عمودية ثابتة
ضع أداة التطبيق بشكل مستقيم وثابت على الذراع واضغط للأسفل حتى تسمع صوت التثبيت، ثم ارفع الأداة عمودياً بهدوء ومرّر إصبعك على الحواف اللاصقة لضمان تثبيتها جيداً.

## 4. التفعيل والانتظار لمدة 60 دقيقة
قرّب هاتفك الذكي (تطبيق LibreLink) أو القارئ الرسمي لمسافة تقل عن 4 سم لبدء فترة التهيئة التي تستغرق 60 دقيقة قبل ظهور القراءات المستمرة.`,
    category: 'capteurs-freestyle',
    categoryLabel: 'Capteurs FreeStyle',
    categoryLabelAr: 'مجسات فري ستايل',
    readTimeMinutes: 4,
    author: 'Équipe Conseil Parailaf',
    authorRole: 'Spécialiste Dispositifs CGM Maroc',
    publishedAt: '2026-11-12',
    image: imgLibre2Single,
    imageKey: 'capteur-fsl2-plus-unite',
    imageAlt: 'Capteur FreeStyle Libre 2 PLUS original scellé',
    relatedProductId: 'capteur-fsl2-plus-unite',
    tags: ['Pose capteur', 'FreeStyle Libre 2 PLUS', 'LibreLink', 'Préparation peau'],
    keyTakeaways: [
      'Laisser sécher la peau 60 secondes après la lingette alcoolisée',
      'Alterner de bras tous les 14-15 jours pour préserver l’épiderme',
      'Attendre la fin des 60 min d’initialisation avant la première douche',
    ],
    keyTakeawaysAr: [
      'ترك الجلد يجف تماماً لمدة 60 ثانية بعد التعقيم بالكحول',
      'التبديل بين الذراعين كل 14-15 يوماً للحفاظ على سلامة البشرة',
      'الانتظار حتى انتهاء الـ 60 دقيقة الأولى قبل الاستحمام',
    ],
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: 'comprendre-fleches-tendance-temps-dans-cible',
    slug: 'comprendre-fleches-tendance-temps-dans-cible',
    title: 'Comprendre les flèches de tendance et le Temps dans la Cible (TIR) sur votre lecteur',
    titleAr: 'فهم أسهم الاتجاه والوقت داخل النطاق المستهدف (TIR) على جهاز القراءة',
    excerpt:
      'Un chiffre glycémique isolé ne dit pas tout : apprenez à lire la vitesse de variation de votre glucose et à interpréter votre objectif de Temps dans la Cible.',
    excerptAr:
      'قراءة السكر وحدها لا تكفي: تعلم كيف تفسّر أسهم صعود أو نزول السكر ومعدل بقائك في النطاق الآمن.',
    content: `L'un des plus grands atouts des capteurs FreeStyle Libre 2 PLUS et FreeStyle Libre 3 PLUS (sur smartphone ou sur lecteur officiel Abbott) est l'affichage des flèches de tendance. Elles indiquent non seulement où se situe votre glycémie maintenant, mais surtout vers où elle se dirige dans les 15 à 30 prochaines minutes.

## Décoder les 5 flèches de tendance
- **Flèche horizontale (→)** : votre glucose est stable (variation inférieure à 1 mg/dL par minute).
- **Flèche oblique montante (↗)** : hausse modérée (1 à 2 mg/dL par minute).
- **Flèche verticale montante (↑)** : hausse rapide (plus de 2 mg/dL par minute, soit +30 mg/dL en 15 min).
- **Flèche oblique descendante (↘)** : baisse modérée (-1 à -2 mg/dL par minute).
- **Flèche verticale descendante (↓)** : baisse rapide : surveillez de près pour anticiper une éventuelle hypoglycémie.

## Qu'est-ce que le Temps dans la Cible (TIR) ?
Le Time In Range (TIR) mesure le pourcentage du temps que vous passez entre 70 et 180 mg/dL (0,70 à 1,80 g/L) sur 24 heures. Pour la majorité des adultes diabétiques, les recommandations internationales visent plus de **70% dans la cible**, soit environ 17 heures par jour, avec moins de 4% en dessous de 70 mg/dL.

## Suivi autonome avec le Lecteur Officiel FreeStyle Libre
Pour les enfants, les seniors ou les personnes qui préfèrent ne pas dépendre d'un smartphone, le lecteur officiel affiche directement la courbe sur 8 heures, les flèches de tendance et l'historique sur 90 jours pour votre diabétologue.`,
    contentAr: `تتميّز مجسات وأجهزة قراءة فري ستايل ليبري بقدرتها على إظهار اتجاه تغيّر السكر وليس فقط الرقم اللحظي، مما يساعدك على الاستباق وتفادي الهبوط أو الارتفاع المفاجئ.

## دلالات أسهم الاتجاه الخمسة
- **سهم أفقي (→)**: مستوى السكر مستقر.
- **سهم مائل للأعلى (↗)**: ارتفاع تدريجي معتدل.
- **سهم عمودي للأعلى (↑)**: ارتفاع سريع يتطلب الانتباه.
- **سهم مائل للأسفل (↘)**: انخفاض تدريجي.
- **سهم عمودي للأسفل (↓)**: انخفاض سريع، يجب المراقبة لتجنب هبوط السكر.

## ما هو الوقت داخل النطاق المستهدف (TIR)؟
يمثل النسبة المئوية للوقت الذي يبقى فيه السكر بين 70 و 180 ملغ/ديسيلتر خلال اليوم. يوصي أطباء السكري عموماً بتحقيق أكثر من 70% داخل النطاق الآمن ومشاركة التقارير الدورية مع طبيبك المعالج.`,
    category: 'gestion-diabete',
    categoryLabel: 'Gestion du Diabète',
    categoryLabelAr: 'إدارة السكري',
    readTimeMinutes: 5,
    author: 'Dr. Salma Benali',
    authorRole: 'Conseillère Éducation Thérapeutique',
    publishedAt: '2026-11-08',
    image: imgLibre3Reader,
    imageKey: 'fsl3-lecteur-officiel',
    imageAlt: 'Lecteur officiel Abbott FreeStyle Libre 3 avec écran couleur',
    relatedProductId: 'fsl3-lecteur-officiel',
    tags: ['Flèches de tendance', 'TIR', 'Lecteur FreeStyle', 'HbA1c'],
    keyTakeaways: [
      'Une flèche verticale signale une variation de plus de 30 mg/dL en 15 minutes',
      'Viser un Temps dans la Cible (70–180 mg/dL) supérieur à 70% selon avis médical',
      'L’historique 90 jours du lecteur facilite le bilan avec votre diabétologue',
    ],
    keyTakeawaysAr: [
      'السهم العمودي يعني تغيراً بأكثر من 30 ملغ/ديسيلتر خلال 15 دقيقة',
      'استهداف البقاء داخل النطاق (70–180) لأكثر من 70% من اليوم حسب توجيه الطبيب',
      'سجل الـ 90 يوماً في جهاز القراءة يسهل المتابعة الدقيقة مع طبيبك',
    ],
    featured: false,
    published: true,
    sortOrder: 2,
  },
  {
    id: 'sport-douche-chaleur-proteger-capteur-maroc',
    slug: 'sport-douche-chaleur-proteger-capteur-maroc',
    title: 'Sport, douche et chaleur au Maroc : garder votre capteur fixé 14 jours sans décollement',
    titleAr: 'الرياضة والاستحمام وحرارة الصيف بالمغرب: كيف تحافظ على ثبات المجس 14 يوماً',
    excerpt:
      'Transpiration, baignade en mer, hammam ou frottements des vêtements : nos astuces concrètes pour éviter qu’un capteur ne se décolle prématurément.',
    excerptAr:
      'التعرق، السباحة، أو احتكاك الملابس: نصائح عملية لحماية المجس من السقوط المبكر خلال 14 يوماً.',
    content: `Avec le climat chaud dans de nombreuses villes marocaines (Marrakech, Agadir, Fès, Oujda ou Casablanca en été), la transpiration et les douches fréquentes mettent l'adhésif du capteur à l'épreuve. Voici comment sécuriser votre capteur du premier au dernier jour.

## 1. Étanchéité réelle du FreeStyle Libre
Les capteurs FreeStyle Libre 2 PLUS et 3 PLUS sont certifiés étanches (IP27/IP28) jusqu'à **1 mètre de profondeur pendant 30 minutes maximum**. Vous pouvez donc prendre votre douche, nager à la piscine ou à la plage en respectant cette limite de temps et de profondeur. En revanche, évitez le hammam très chaud prolongé ou le sauna qui fragilisent la colle médicale.

## 2. Ajouter un patch de fixation étanche
Si vous faites du sport régulièrement, nagez ou transpirez facilement, la pose d'un **patch adhésif de fixation étanche** par-dessus le capteur change tout. Choisissez nos patchs pré-découpés avec zone centrale non collante : ainsi, si vous devez remplacer le patch extérieur au bout de 7 jours, le capteur reste intact en dessous.

## 3. Attention aux encadrements de portes et aux vêtements
La majorité des arrachements accidentels surviennent en enfilant une chemise ajustée ou en frôlant un chambranle de porte. Enfilez toujours la manche côté capteur en premier et séchez le capteur en tamponnant avec la serviette, jamais en frottant.`,
    contentAr: `مع ارتفاع درجات الحرارة في عدة مدن مغربية أو ممارسة الرياضة والسباحة، قد يتأثر لاصق المجس بالرطوبة والتعرق.

## 1. مقاومة الماء والحدود المسموح بها
مجسات فري ستايل ليبري مقاومة للماء حتى عمق متر واحد لمدة أقصاها 30 دقيقة. يمكنك الاستحمام والسباحة بشكل طبيعي مع تجنب البقاء لفترات طويلة في الحمام الساخن (الحمام المغربي) أو الساونا لأن الحرارة المفرطة تضعف اللاصق.

## 2. استخدام لاصق حماية إضافي مقاوم للماء
ينصح الرياضيون والأشخاص كثيرو الحركة باستعمال لاصق حماية خارجي (Patch) فوق المجس، بشرط أن يكون وسطه غير لاصق حتى لا ينزع المجس عند استبداله.

## 3. الحذر عند ارتداء الملابس والتجفيف
ارتدِ الكم من جهة المجس أولاً، وبعد الاستحمام جفف المنطقة بالتربيت اللطيف بالمنشفة دون فرك.`,
    category: 'astuces-quotidien',
    categoryLabel: 'Sport & Quotidien',
    categoryLabelAr: 'الرياضة والحياة اليومية',
    readTimeMinutes: 3,
    author: 'Yassine El Amrani',
    authorRole: 'Expert Accessoires & Maintien CGM',
    publishedAt: '2026-11-03',
    image: imgSensorPatches,
    imageKey: 'patch-fixation-pack-10',
    imageAlt: 'Patchs de fixation étanches pour capteurs FreeStyle Libre',
    relatedProductId: 'patch-fixation-pack-10',
    tags: ['Patch fixation', 'Sport', 'Étanche', 'Chaleur Maroc'],
    keyTakeaways: [
      'Étanchéité garantie jusqu’à 1 mètre pendant 30 minutes maximum',
      'Utilisez un patch à centre non-adhésif pour le sport et la mer',
      'Tamponnez la peau avec la serviette sans frotter après la douche',
    ],
    keyTakeawaysAr: [
      'مقاومة الماء مضمونة حتى عمق 1 متر لمدة أقصاها 30 دقيقة',
      'استعمل لاصق حماية بوسط غير لاصق للرياضة والسباحة',
      'تجفيف المجس بالتربيت اللطيف دون فرك بعد الاستحمام',
    ],
    featured: false,
    published: true,
    sortOrder: 3,
  },
  {
    id: 'alimentation-marocaine-pics-glycemiques',
    slug: 'alimentation-marocaine-pics-glycemiques',
    title: 'Cuisine marocaine & glycémie : observer l’impact de vos repas sans vous priver',
    titleAr: 'التغذية المغربية وتوازن السكر: كيف تراقب تأثير وجباتك دون حرمان',
    excerpt:
      'Pain complet, tajine, légumineuses ou thé à la menthe : comment utiliser les mesures après-repas pour mieux séquencer votre assiette et limiter les pics glycémiques.',
    excerptAr:
      'الخبز الكامل، الطاجين، القطاني والشاي: كيف تستفيد من القياس بعد الأكل لتقليل ارتفاع السكر.',
    content: `L'un des apprentissages les plus précieux offerts par le suivi régulier de la glycémie est la découverte de votre **réponse glycémique personnelle**. Deux personnes peuvent manger le même plat et observer des courbes très différentes 1 à 2 heures après le repas.

## L'ordre des aliments compte autant que les quantités
Avant de consommer des glucides (pain, semoule, pommes de terre, riz), commencez votre repas par une salade marocaine riche en fibres (tomates, concombres, poivrons, herbes) assaisonnée à l'huile d'olive, suivie des protéines (poisson, poulet, viande, œufs ou lentilles). Les fibres ralentissent l'absorption du glucose et lissent le pic post-prandial.

## Privilégier les pains complets à fermentation lente
Le pain blanc raffiné provoque souvent une montée rapide visible dès 30 minutes. Remplacez-le progressivement par du pain d'orge (*khobz d'chaïr*) ou du blé complet au levain naturel en portion modérée, et observez la différence 2 heures après le repas grâce à votre lecteur OneTouch Verio Reflect ou votre capteur FreeStyle Libre.

## Une marche de 15 minutes après le déjeuner ou le dîner
Même une marche douce de 10 à 15 minutes après le repas aide vos muscles à capter naturellement le glucose circulant. Vérifiez votre mesure 2 heures après : vous constaterez souvent une réduction nette de l'amplitude du pic.`,
    contentAr: `من أهم فوائد المتابعة المنتظمة للسكر معرفة استجابة جسمك الشخصية لكل وجبة مغربية، مما يمنحك حرية ووعياً أكبر دون تعقيد.

## ترتيب تناول الطعام يحدث فرقاً كبيراً
ابدأ وجبتك بالسلطة والخضروات الغنية بالألياف مع زيت الزيتون، ثم البروتينات (السمك، الدجاج أو القطاني)، واترك النشويات والخبز في آخر الوجبة. هذه الطريقة تبطئ امتصاص السكر وتخفف حدة الارتفاع بعد الأكل.

## اختيار الخبز الكامل والشعير باعتدال
الخبز الأبيض يسبب غالباً ارتفاعاً سريعاً خلال 30 دقيقة. استبدله تدريجياً بخبز الشعير أو القمح الكامل بالخميرة البلدية وراقب الفرق بعد ساعتين من الأكل.

## المشي 15 دقيقة بعد الوجبة
المشي الخفيف لمدة 10 إلى 15 دقيقة بعد الغداء أو العشاء يساعد العضلات على استهلاك الجلوكوز بشكل طبيعي ويحسن استقرار قياساتك.`,
    category: 'nutrition-maroc',
    categoryLabel: 'Nutrition & Équilibre',
    categoryLabelAr: 'التغذية المتوازنة',
    readTimeMinutes: 4,
    author: 'Dr. Salma Benali',
    authorRole: 'Conseillère Éducation Thérapeutique',
    publishedAt: '2026-10-28',
    image: imgOneTouchReflect,
    imageKey: 'onetouch-verio-reflect',
    imageAlt: 'Lecteur de glycémie OneTouch Verio Reflect pour le contrôle des repas',
    relatedProductId: 'onetouch-verio-reflect',
    tags: ['Nutrition', 'Pic glycémique', 'Cuisine marocaine', 'Contrôle repas'],
    keyTakeaways: [
      'Manger les fibres et légumes avant les féculents lisse les pics glycémiques',
      'Comparer l’effet du pain blanc vs pain d’orge grâce au contrôle à +2h',
      '15 minutes de marche post-repas améliorent sensiblement l’équilibre glycémique',
    ],
    keyTakeawaysAr: [
      'البدء بالألياف والسلطة قبل النشويات يقلل من قفزات السكر',
      'مقارنة تأثير خبز الشعير والقمح الكامل عبر القياس بعد ساعتين',
      'المشي 15 دقيقة بعد الوجبة يحسّن استقرار السكر بشكل ملحوظ',
    ],
    featured: false,
    published: true,
    sortOrder: 4,
  },
  {
    id: 'comparatif-freestyle-libre-2-plus-vs-libre-3-plus',
    slug: 'comparatif-freestyle-libre-2-plus-vs-libre-3-plus',
    title: 'FreeStyle Libre 2 PLUS vs FreeStyle Libre 3 PLUS : lequel choisir selon votre profil ?',
    titleAr: 'مقارنة بين FreeStyle Libre 2 PLUS و Libre 3 PLUS: أيهما يناسبك أكثر؟',
    excerpt:
      'Taille du capteur, transmission automatique sans scan, autonomie de 15 jours, compatibilité téléphone ou lecteur : le comparatif clair pour bien choisir.',
    excerptAr:
      'حجم المجس، القراءة التلقائية بدون مسح، مدة 15 يوماً والتوافق مع الهاتف أو القارئ: مقارنة واضحة لاختيار الأنسب لك.',
    content: `Beaucoup de patients au Maroc hésitent entre le **FreeStyle Libre 2 PLUS** et le nouveau **FreeStyle Libre 3 PLUS**. Les deux offrent une excellente précision clinique et une durée allant jusqu'à **15 jours**, mais répondent à des préférences légèrement différentes.

## FreeStyle Libre 2 PLUS : polyvalent et économique
- **Budget maîtrisé** : tarif très accessible (offre promo à 550 DH sur Parailaf).
- **Double compatibilité** : fonctionne aussi bien avec votre smartphone (app FreeStyle LibreLink) qu'avec le lecteur officiel FreeStyle Libre 2 (pratique pour les enfants à l'école ou les seniors sans smartphone).
- **Alertes en temps réel** : alarmes d'hypoglycémie et d'hyperglycémie transmises via Bluetooth.

## FreeStyle Libre 3 PLUS : le plus petit capteur au monde
- **Discrétion maximale** : format ultra-fin équivalent à deux petites pièces empilées, presque invisible sous les vêtements.
- **Lecture continue minute par minute** : aucune manipulation requise après le premier scan d'activation ; vos courbes se mettent à jour toutes les 60 secondes automatiquement sur l'app FreeStyle Libre 3.
- **Applicateur tout-en-un monobloc** : mise en place simplifiée en un seul geste sans assemblage préalable.

## Notre recommandation pratique
Choisissez **Libre 2 PLUS** si vous privilégiez le meilleur rapport qualité/prix ou l'usage d'un lecteur autonome. Optez pour **Libre 3 PLUS** si vous recherchez la discrétion absolue et la mise à jour automatique continue sans jamais sortir votre téléphone pour scanner.`,
    contentAr: `يحتار العديد من المرضى في المغرب بين اختيار مجس FreeStyle Libre 2 PLUS أو الجيل الجديد FreeStyle Libre 3 PLUS. كلاهما يوفر دقة عالية ومدة استخدام تصل إلى 15 يوماً.

## FreeStyle Libre 2 PLUS: العملي والاقتصادي
- سعر مناسب وموفر للمتابعة الشهرية المستمرة.
- متوافق مع الهاتف الذكي (LibreLink) ومع القارئ الرسمي المستقل، وهو مثالي للأطفال وكبار السن.
- تنبيهات فورية عند الهبوط أو الارتفاع عبر البلوتوث.

## FreeStyle Libre 3 PLUS: الأصغر والأكثر تلقائية
- أصغر وأنحف مجس في العالم، خفي تماماً تحت الملابس.
- إرسال تلقائي للقراءات كل دقيقة مباشرة إلى الهاتف دون الحاجة لإجراء مسح يدوي متكرر.
- أداة تثبيت مدمجة في قطعة واحدة سهلة الاستخدام.

## خلاصة الاختيار
اختر Libre 2 PLUS لأفضل توازن بين السعر والأداء أو مع القارئ المستقل، واختر Libre 3 PLUS إذا كنت تبحث عن أصغر حجم وتحديث تلقائي مستمر كل دقيقة.`,
    category: 'capteurs-freestyle',
    categoryLabel: 'Capteurs FreeStyle',
    categoryLabelAr: 'مجسات فري ستايل',
    readTimeMinutes: 4,
    author: 'Équipe Conseil Parailaf',
    authorRole: 'Spécialiste Dispositifs CGM Maroc',
    publishedAt: '2026-10-20',
    image: imgLibre3Plus,
    imageKey: 'fsl3-plus-nouveau',
    imageAlt: 'Boîte et capteur FreeStyle Libre 3 PLUS nouvelle génération',
    relatedProductId: 'fsl3-plus-nouveau',
    tags: ['Comparatif', 'Libre 2 PLUS', 'Libre 3 PLUS', 'Guide achat'],
    keyTakeaways: [
      'Les deux modèles durent jusqu’à 15 jours et sont étanches IP27/IP28',
      'Libre 3 PLUS envoie les mesures automatiquement chaque minute sans scan',
      'Libre 2 PLUS reste compatible avec le lecteur autonome dédié et smartphone',
    ],
    keyTakeawaysAr: [
      'كلا الطرازين يدومان حتى 15 يوماً ومقاومان للماء',
      'Libre 3 PLUS يرسل القياس تلقائياً كل دقيقة دون مسح متكرر',
      'Libre 2 PLUS متوافق مع الهاتف والقارئ المستقل بسعر اقتصادي',
    ],
    featured: false,
    published: true,
    sortOrder: 5,
  },
  {
    id: 'hypoglycemie-nocturne-alertes-et-conservation-materiel',
    slug: 'hypoglycemie-nocturne-alertes-et-conservation-materiel',
    title: 'Alertes nocturnes & protection en voyage : préserver vos capteurs et votre matériel',
    titleAr: 'التنبيهات الليلية وحماية المجسات أثناء السفر والتنقل',
    excerpt:
      'Bien régler les alarmes Bluetooth pour dormir sereinement, éviter les faux bas par compression et protéger vos capteurs de réserve contre la chaleur dans une trousse adaptée.',
    excerptAr:
      'ضبط تنبيهات البلوتوث الليلية، تجنب القراءات الوهمية، وحماية مجساتك الإضافية من الحرارة في حقيبة مخصصة.',
    content: `La peur des hypoglycémies pendant le sommeil et la bonne conservation des capteurs de réserve lors des déplacements sont deux préoccupations majeures pour les patients diabétiques et les parents au Maroc.

## 1. Configurer vos alarmes Bluetooth pour la nuit
Pour que l'alerte sonne même la nuit, laissez le **Bluetooth activé** en permanence et gardez le téléphone ou le lecteur FreeStyle Libre 2 à moins de 6 mètres du lit. Autorisez les **alertes critiques / prioritaires** dans l'application LibreLink afin que l'alarme sonne même si le téléphone est en mode silencieux.

## 2. Éviter les "faux bas" liés à la pression sur le bras
Si vous dormez allongé directement sur le bras portant le capteur, la compression temporaire des tissus peut provoquer une baisse artificielle de la lecture interstitielle (*compression low*). En cas d'alerte nocturne inattendue sans symptôme, changez de position pendant 5 minutes ou confirmez par une glycémie capillaire avant de vous resucrer excessivement.

## 3. Protéger vos capteurs et lecteurs de la chaleur en déplacement
Les capteurs FreeStyle Libre non posés doivent être conservés entre **4°C et 25°C** (jamais dans la boîte à gants d'une voiture en plein soleil). Utilisez une **trousse de transport rigide et isotherme** pour transporter lecteur, capteur de rechange, lingettes et câbles à l'abri des chocs et des variations thermiques.`,
    contentAr: `يُعد القلق من هبوط السكر ليلاً وحماية المجسات الاحتياطية من الحرارة أثناء السفر من أهم أولويات مرضى السكري.

## 1. ضبط تنبيهات البلوتوث الليلية
اترك البلوتوث مفعلاً وضع الهاتف أو القارئ على مسافة أقل من 6 أمتار من السرير، مع تفعيل صلاحيات الإشعارات الحرجة لتنبيهك حتى في الوضع الصامت.

## 2. تجنب انخفاضات الضغط الوهمية أثناء النوم
النوم والضغط مباشرة على الذراع التي تحمل المجس قد يعطي قراءة منخفضة مؤقتة. غيّر وضعية نومك لبضع دقائق أو تأكد بقياس عادي من الإصبع عند الشك.

## 3. حماية المجسات وأجهزة القراءة أثناء السفر
يجب حفظ المجسات غير المستخدمة في درجة حرارة بين 4 و 25 درجة مئوية بعيداً عن حرارة السيارة. استعمل حقيبة نقل صلبة وعازلة للحرارة لحماية القارئ والمجسات الاحتياطية من الصدمات والشمس.`,
    category: 'gestion-diabete',
    categoryLabel: 'Gestion du Diabète',
    categoryLabelAr: 'إدارة السكري',
    readTimeMinutes: 4,
    author: 'Équipe Conseil Parailaf',
    authorRole: 'Spécialiste Dispositifs CGM Maroc',
    publishedAt: '2026-10-14',
    image: imgTrousseIsotherme,
    imageKey: 'trousse-transport-rigide',
    imageAlt: 'Trousse de transport rigide et isotherme pour lecteur et capteurs FreeStyle Libre',
    relatedProductId: 'trousse-transport-rigide',
    tags: ['Alertes nuit', 'Voyage Maroc', 'Trousse isotherme', 'Conservation'],
    keyTakeaways: [
      'Autoriser les notifications critiques pour entendre l’alarme la nuit',
      'Conserver les capteurs neufs entre 4°C et 25°C à l’abri de la chaleur',
      'Transporter lecteur et capteur de secours dans une trousse isotherme antichoc',
    ],
    keyTakeawaysAr: [
      'السماح بالإشعارات الحرجة لضمان سماع التنبيه ليلاً',
      'حفظ المجسات الجديدة بين 4 و 25 درجة مئوية بعيداً عن الحرارة',
      'نقل القارئ والمجسات الاحتياطية في حقيبة عازلة ومقاومة للصدمات',
    ],
    featured: false,
    published: true,
    sortOrder: 6,
  },
];
