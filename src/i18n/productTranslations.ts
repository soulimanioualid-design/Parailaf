export interface ProductTranslation {
  nameAr: string;
  shortDescriptionAr: string;
  badgeAr?: string;
  categoryLabelAr?: string;
  featuresAr?: string[];
  boxContentsAr?: string[];
  specsAr?: {
    duration?: string;
    waterproof?: string;
    bloodSample?: string;
    alarms?: string;
    dimensions?: string;
    memory?: string;
    appCompatibility?: string;
    calibration?: string;
  };
}

export const PRODUCT_ARABIC_TRANSLATIONS: Record<string, ProductTranslation> = {
  'dexcom-g7-capteur': {
    nameAr: 'مجس ديكسكوم G7 - نظام CGM المتكامل الذكي',
    shortDescriptionAr: 'الجيل الأحدث Dexcom G7 لمراقبة الجلوكوز المستمرة على مدار 24 ساعة بدون وخز الأصابع مع إنذارات تنبؤية فورية ودقة فائقة.',
    badgeAr: 'جديد !',
    categoryLabelAr: 'ديكسكوم CGM',
    featuresAr: [
      'جهاز متكامل فائق الصغر بدون حاجة لأي جهاز إرسال منفصل',
      'إحماء فائق السرعة خلال 30 دقيقة فقط',
      'تنبيهات استباقية قبل 20 دقيقة من حدوث هبوط السكر',
      'تطبيق متوافق مع هواتف أندرويد وآيفون وساعات أبل'
    ],
    boxContentsAr: [
      '1 مجس Dexcom G7 معقم ومغلف بختم المصنع',
      'جهاز التطبيق التلقائي بضغطة واحدة',
      'لاصق حماية إضافي Overpatch معتمد',
      'دليل الإرشادات والاستخدام'
    ]
  },
  'dexcom-g6-kit-complet': {
    nameAr: 'طقم كامل ديكسكوم G6 - نظام CGM مع 20 لاصق حماية',
    shortDescriptionAr: 'حزمة كاملة تتضمن مجس Dexcom G6، جهاز الإرسال Transmitter و20 لاصق حماية طبي مضاد للماء للمحافظة على ثبات المجس.',
    badgeAr: 'عرض خاص',
    categoryLabelAr: 'ديكسكوم CGM',
    featuresAr: [
      'مراقبة مستمرة ودقيقة لمستوى الجلوكوز لمدة 10 أيام متواصلة',
      'معايرة مسبقة في المصنع دون حاجة لوخز الأصابع الروتيني',
      'مقاومة كاملة للماء حتى عمق 2.4 متر للاستحمام والسباحة',
      'مشاركة القراءات مع ما يصل إلى 10 أفراد من العائلة'
    ]
  },
  'trousse-transport-rigide': {
    nameAr: 'حقيبة حفظ ونقل صلبة وعازلة للحرارة لمستلزمات السكري',
    shortDescriptionAr: 'حقيبة طبية مدمجة وعالية المقاومة مخصصة لحمل وحماية أجهزة فري ستايل، إبر الأنسولين، الشرائط والمجسات بكل أمان.',
    badgeAr: 'عملي',
    categoryLabelAr: 'إبر وملحقات',
    featuresAr: [
      'هيكل صلب مقاوم للصدمات والضغط والسقوط',
      'بطانة عازلة لحماية الأنسولين من درجات الحرارة المرتفعة',
      'جيوب شبكية مرنة ومنظمة لجميع الملحقات والأقلام',
      'حجم مثالي ومناسب للحقائب اليومية والسفر'
    ]
  },
  'omnipod-dash-pods': {
    nameAr: 'أومنيبود DASH® - نظام إدارة الأنسولين بدون أنابيب',
    shortDescriptionAr: 'تقنية خالية تماماً من الأنابيب لحرية حركة مطلقة وراحة تامة. توصيل مستمر للأنسولين مع جهاز تحكم ذكي يعمل باللمس.',
    badgeAr: 'جديد !',
    categoryLabelAr: 'أومنيبود',
    featuresAr: [
      'مضخة مدمجة بدون أي أنابيب بلاستيكية مزعجة',
      'مقاومة كاملة للماء IP28 للسباحة وممارسة الرياضة',
      'جهاز تحكم بشاشة ملونة تعمل باللمس PDM',
      'توصيل دقيق لجرعات الأنسولين القاعدية والوجبات'
    ]
  },
  'capteur-fsl2-plus-unite': {
    nameAr: 'مجس فري ستايل ليبري 2 بلس (FreeStyle Libre 2 PLUS)',
    shortDescriptionAr: 'المجس الجديد والأكثر مبيعاً حتى 15 يوماً من المراقبة المتواصلة مع تنبيهات بلوتوث فورية عند هبوط أو ارتفاع السكر دون وخز.',
    badgeAr: 'عرض خاص',
    categoryLabelAr: 'فري ستايل ليبري 2',
    featuresAr: [
      'مدة استخدام ممتدة حتى 15 يوماً كاملاً بأعلى دقة',
      'نقل تلقائي للقياسات كل دقيقة مباشرة إلى هاتفك الذكي',
      'إنذارات صوتية فورية قابلة للتخصيص في حالات الطوارئ',
      'مقاوم للماء حتى عمق 1 متر لمدة 30 دقيقة'
    ],
    boxContentsAr: [
      '1 مجس معقم FreeStyle Libre 2 PLUS تحت الختم الأصلي',
      '1 جهاز تطبيق بضغطة واحدة سهل الاستعمال',
      'مسحة طبية بالكحول لتعقيم الجلد',
      'دليل المستخدم الرسمي'
    ]
  },
  'fsl3-plus-nouveau': {
    nameAr: 'فري ستايل ليبري 3 بلس الجديد (FreeStyle Libre 3 PLUS)',
    shortDescriptionAr: 'المجس الأصغر والأنحف في العالم (بحجم عملة معدنية). إرسال القراءات في الوقت الفعلي إلى الهاتف الذكي بدون أي مسح يدوي.',
    badgeAr: 'جديد !',
    categoryLabelAr: 'فري ستايل ليبري 3',
    featuresAr: [
      'حجم فائق الصغر بسماكة مليمترات قليلة وغير مرئي تحت الملابس',
      'نقل مباشر وفوري للبيانات عبر البلوتوث دون حاجة لمسح المجس',
      'دقة سريرية لا تضاهى MARD 7.8%',
      'تطبيق LibreLink المعتمد مع مشاركة القراءات مع الطبيب'
    ]
  },
  'fsl3-lecteur-officiel': {
    nameAr: 'قارئ رسمي فري ستايل ليبري 3 - جهاز قياس السكر بشاشة ملونة',
    shortDescriptionAr: 'القارئ المعتمد المستقل لمجسات FreeStyle Libre 3 للأشخاص الذين يفضلون جهازاً طبياً مخصصاً دون الاعتماد على الهاتف الذكي.',
    badgeAr: 'جديد',
    categoryLabelAr: 'أجهزة قياس السكر',
    featuresAr: [
      'شاشة ملونة تعمل باللمس وواضحة تحت أشعة الشمس',
      'استقبال القراءات والإنذارات تلقائياً عبر البلوتوث',
      'تخزين لسجلات وتقارير السكر لمدة تصل إلى 90 يوماً',
      'بطارية قابلة للشحن عبر منفذ USB مع كابل شحن متضمن'
    ]
  },
  'fsl2-lecteur-officiel': {
    nameAr: 'قارئ فري ستايل ليبري 2 الرسمي (Lecteur FSL2)',
    shortDescriptionAr: 'جهاز القراءة الأصلي المعتمد لمجسات FreeStyle Libre 2. شاشة ملونة سهلة القراءة مع إنذارات صوتية عند انخفاض أو ارتفاع السكر.',
    badgeAr: 'أصلي معتمد',
    categoryLabelAr: 'أجهزة قياس السكر',
    featuresAr: [
      'قراءة فورية لنتائج السكر بمجرد تقريب الجهاز من المجس',
      'إنذارات صوتية واهتزازية في حالات الخطر',
      'تخزين كامل للبيانات حتى 90 يوماً مع منحنيات بيانية',
      'منفذ مدمج لقياس السكر والأسيتون عبر شرائط الدم عند الحاجة'
    ]
  },
  'onetouch-verio-reflect': {
    nameAr: 'جهاز قياس السكر وان تاتش فيريو ريفليكت® (OneTouch Verio Reflect)',
    shortDescriptionAr: 'جهاز القياس الدقيق المزود بنظام Blood Sugar Mentor لتقديم نصائح وتوجيهات مخصصة لمساعدتك على تجنب انخفاض السكر.',
    badgeAr: 'جودة عالية',
    categoryLabelAr: 'أجهزة قياس السكر',
    featuresAr: [
      'مؤشر نطاق القياس الديناميكي ColourSure ثلاثي الألوان',
      'مستشار رقمي يقدم نصائح فورية على الشاشة حسب نتيجتك',
      'يتطلب عينة دم مجهرية للغاية 0.4 ميكرولتر فقط',
      'ربط بلوتوث تلقائي مع تطبيق OneTouch Reveal®'
    ]
  },
  'bd-micro-fine-32g-4mm': {
    nameAr: 'إبر أنسولين بي دي ميكروفاين بلس 32G / 4mm (علبة 100 إبرة)',
    shortDescriptionAr: 'الإبر الأصلية الأكثر استخداماً لنعومة الحقن بفضل تقنية EasyFlow وPentaPoint الخماسية لتقليل الألم إلى أقصى حد.',
    badgeAr: 'الأكثر مبيعاً',
    categoryLabelAr: 'إبر وملحقات',
    featuresAr: [
      'رأس خماسي الشحذ PentaPoint لحقن لطيف جداً وبدون ألم',
      'تقنية الجدار الرقيق EasyFlow لتدفق سريع للأنسولين بأقل ضغط',
      'طول مريح 4 مم مناسب لجميع الأعمار دون الحاجة لطي الجلد',
      'متوافقة مع جميع أقلام الأنسولين المعتمدة عالمياً'
    ]
  },
  'fsl2-pack-promo-affiche': {
    nameAr: 'حزمة فري ستايل ليبري 2 بلس - العرض الترويجي',
    shortDescriptionAr: 'مجس FreeStyle Libre 2 PLUS الأصلي مع شحن سريع ودفع عند الاستلام.',
    badgeAr: 'عرض 550 درهم',
    categoryLabelAr: 'عروض خاصة'
  },
  'fsl3-pack-promo-affiche': {
    nameAr: 'حزمة فري ستايل ليبري 3 بلس - أحدث جيل',
    shortDescriptionAr: 'مجس FreeStyle Libre 3 PLUS المدمج مع قراءات فورية بدون مسح.',
    badgeAr: 'عرض 850 درهم',
    categoryLabelAr: 'عروض خاصة'
  },
  'omnipod-pack-promo-affiche': {
    nameAr: 'أومنيبود DASH - كيت مضخات بدون أنابيب',
    shortDescriptionAr: 'علبة مضخات Omnipod DASH الأصلية لحرية حركة كاملة بدون أنابيب.',
    badgeAr: 'عرض 3000 درهم',
    categoryLabelAr: 'عروض خاصة'
  }
};

export const CATEGORIES_ARABIC: Record<string, { nameAr: string; shortNameAr: string }> = {
  'all': { nameAr: 'جميع المنتجات', shortNameAr: 'الكل' },
  'offres-speciales': { nameAr: 'العروض الخاصة والتخفيضات', shortNameAr: 'تخفيضات' },
  'capteurs': { nameAr: 'مجسات قياس السكر (CGM)', shortNameAr: 'مجسات' },
  'lecteurs': { nameAr: 'أجهزة قياس السكر', shortNameAr: 'أجهزة قياس' },
  'onetouch': { nameAr: 'وان تاتش فيريو OneTouch®', shortNameAr: 'وان تاتش' },
  'dexcom': { nameAr: 'ديكسكوم Dexcom CGM', shortNameAr: 'ديكسكوم' },
  'libre-2': { nameAr: 'فري ستايل ليبري 2 بلس', shortNameAr: 'ليبري 2' },
  'libre-3': { nameAr: 'فري ستايل ليبري 3 بلس', shortNameAr: 'ليبري 3' },
  'omnipod': { nameAr: 'أومنيبود Omnipod DASH / 5', shortNameAr: 'أومنيبود' },
  'accessoires': { nameAr: 'إبر أنسولين ومستلزمات', shortNameAr: 'إبر ومستلزمات' },
  'packs': { nameAr: 'حزم وأطقم كاملة', shortNameAr: 'حزم كاملة' },
};
