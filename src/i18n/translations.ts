export type Language = 'fr' | 'ar';

export interface TranslationDictionary {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Top Announcement Bar
  'announcement.text': {
    fr: '🚚 Livraison express 24h à 48h partout au Maroc | Paiement sécurisé en espèces à la livraison (Cash on Delivery)',
    ar: '🚚 توصيل سريع خلال 24 إلى 48 ساعة لجميع مدن المغرب | الدفع نقداً عند الاستلام بكل أمان'
  },
  'announcement.help': {
    fr: 'Besoin d’aide ?',
    ar: 'تحتاج مساعدة؟'
  },
  'announcement.track_order': {
    fr: 'Suivre ma commande',
    ar: 'تتبع طلبي'
  },

  // Header Nav
  'nav.home': {
    fr: 'Accueil',
    ar: 'الرئيسية'
  },
  'nav.promos': {
    fr: 'Offres Spéciales',
    ar: 'عروض خاصة'
  },
  'nav.products': {
    fr: 'Nos produits',
    ar: 'منتجاتنا'
  },
  'nav.guide': {
    fr: 'Guide FreeStyle',
    ar: 'دليل الاستخدام'
  },
  'nav.reviews': {
    fr: 'Avis Clients',
    ar: 'آراء الزبائن'
  },
  'nav.about': {
    fr: 'À propos',
    ar: 'من نحن'
  },
  'nav.contact': {
    fr: 'Contact',
    ar: 'اتصل بنا'
  },
  'nav.search_placeholder': {
    fr: 'Rechercher un capteur, lecteur, aiguille...',
    ar: 'ابحث عن مجس، جهاز قياس، إبر، شرائط...'
  },
  'nav.cart': {
    fr: 'Panier',
    ar: 'السلة'
  },
  'nav.account': {
    fr: 'Mon Compte',
    ar: 'حسابي'
  },
  'nav.admin': {
    fr: 'Admin',
    ar: 'لوحة التحكم'
  },
  'nav.language': {
    fr: 'العربية',
    ar: 'Français'
  },
  'nav.lang_code': {
    fr: 'AR',
    ar: 'FR'
  },

  // Hero Section
  'hero.badge': {
    fr: 'Parapharmacie Diabète & Capteurs CGM au Maroc',
    ar: 'متجر رعاية السكري ومجسات مراقبة الجلوكوز في المغرب'
  },
  'hero.title_part1': {
    fr: 'Mesurez votre glycémie',
    ar: 'راقب مستوى السكر في الدم'
  },
  'hero.title_highlight': {
    fr: 'sans piqûre au doigt',
    ar: 'بدون وخز في الأصابع'
  },
  'hero.title_part2': {
    fr: 'en temps réel 24h/24',
    ar: 'بشكل مستمر على مدار 24 ساعة'
  },
  'hero.description': {
    fr: 'Spécialiste des capteurs FreeStyle Libre 2 & 3 PLUS, lecteurs officiels, pompes Omnipod DASH, lecteurs OneTouch Verio® et aiguilles BD. Produits 100% originaux sous scellé avec livraison rapide partout au Maroc et paiement à la réception.',
    ar: 'المتخصص في مجسات فري ستايل ليبري 2 و 3 بلس، أجهزة القراءة المعتمدة، مضخات أومنيبود، أجهزة وان تاتش وإبر بي دي. منتجات أصلية 100% مغلفة ومختومة مع توصيل سريع لكافة مدن المغرب والدفع عند الاستلام.'
  },
  'hero.cta_order': {
    fr: 'Commander maintenant',
    ar: 'اطلب الآن'
  },
  'hero.cta_guide': {
    fr: 'Découvrir le guide',
    ar: 'دليل الاستخدام'
  },
  'hero.perk_original': {
    fr: 'Dispositifs 100% originaux certifiés',
    ar: 'منتجات طبية أصلية 100% ومعتمدة'
  },
  'hero.perk_delivery': {
    fr: 'Livraison 24h-48h dans tout le Maroc',
    ar: 'توصيل سريع 24-48 ساعة لجميع مدن المغرب'
  },
  'hero.perk_payment': {
    fr: 'Paiement en espèces à la livraison',
    ar: 'الدفع نقداً بعد استلام الطلب والتأكد منه'
  },
  'hero.active_users': {
    fr: '+2 800 diabétiques satisfaits au Maroc',
    ar: '+2,800 مريض سكري راضٍ في المغرب'
  },

  // Solo Promo Flyers
  'flyer.badge_promo': {
    fr: 'PROMOTION IMMÉDIATE',
    ar: 'تخفيض فوري خاص'
  },
  'flyer.in_stock': {
    fr: 'En stock au Maroc',
    ar: 'متوفر في المخزون بالمغرب'
  },
  'flyer.fast_delivery': {
    fr: 'Livraison express 24h/48h',
    ar: 'توصيل سريع 24-48 ساعة'
  },
  'flyer.pay_cod': {
    fr: 'Paiement à la livraison',
    ar: 'الدفع عند الاستلام'
  },
  'flyer.order_now': {
    fr: 'Commander à',
    ar: 'اطلب الآن بسعر'
  },
  'flyer.order_whatsapp': {
    fr: 'Commander via WhatsApp',
    ar: 'طلب فوري عبر واتساب'
  },
  'flyer.add_to_cart': {
    fr: 'Ajouter au panier',
    ar: 'أضف إلى السلة'
  },

  // Category Pills
  'categories.title': {
    fr: 'Explorer par Catégorie',
    ar: 'تصفح حسب الفئة'
  },
  'categories.subtitle': {
    fr: 'Trouvez rapidement le capteur, lecteur ou accessoire adapté à vos besoins de contrôle du diabète.',
    ar: 'اعثر بسهولة على المجس، جهاز القياس أو الملحقات المناسبة لمتابعة السكري.'
  },

  // Product Grid
  'grid.tag': {
    fr: 'Catalogue Officiel & Tarifs Maroc',
    ar: 'الكتالوج المعتمد والأسعار في المغرب'
  },
  'grid.title': {
    fr: 'Nos Produits & Offres Spéciales Parailaf',
    ar: 'منتجاتنا وعروضنا الحصرية - بارا إيلاف'
  },
  'grid.subtitle': {
    fr: 'FreeStyle Libre 2 & 3 PLUS, lecteurs OneTouch Verio®, capteurs Dexcom CGM, aiguilles BD et accessoires certifiés.',
    ar: 'مجسات فري ستايل ليبري 2 و 3 بلس، أجهزة وان تاتش، ديكسكوم CGM، إبر بي دي وملحقات طبية معتمدة.'
  },
  'grid.sort_by': {
    fr: 'Trier :',
    ar: 'ترتيب :'
  },
  'grid.sort_popular': {
    fr: 'Les plus populaires',
    ar: 'الأكثر طلباً'
  },
  'grid.sort_price_asc': {
    fr: 'Prix croissant (DH)',
    ar: 'السعر: من الأقل للأعلى'
  },
  'grid.sort_price_desc': {
    fr: 'Prix décroissant (DH)',
    ar: 'السعر: من الأعلى للأقل'
  },
  'grid.sort_rating': {
    fr: 'Mieux notés ⭐',
    ar: 'الأعلى تقييماً ⭐'
  },
  'grid.view_grid': {
    fr: '2 Colonnes',
    ar: 'عمودين'
  },
  'grid.view_list': {
    fr: 'Grand format',
    ar: 'قائمة كبيرة'
  },
  'grid.showing_count': {
    fr: 'Affichage de',
    ar: 'عرض'
  },
  'grid.products_count': {
    fr: 'référence(s)',
    ar: 'منتج(ات)'
  },
  'grid.search_for': {
    fr: 'pour la recherche',
    ar: 'للبحث'
  },
  'grid.reset_filters': {
    fr: 'Réinitialiser les filtres',
    ar: 'إعادة ضبط الفلاتر'
  },
  'grid.empty_title': {
    fr: 'Aucun produit trouvé',
    ar: 'لم يتم العثور على أي منتج'
  },
  'grid.empty_desc': {
    fr: 'Désolé, aucun dispositif ne correspond à vos critères de recherche.',
    ar: 'عذراً، لم نتمكن من إيجاد منتج يطابق معايير البحث الحالية.'
  },

  // Monthly Supply Banner
  'monthly.title': {
    fr: 'Approvisionnement Mensuel & Suivi Personnalisé',
    ar: 'الاشتراك الشهري والمتابعة المستمرة'
  },
  'monthly.desc': {
    fr: 'Ne tombez jamais en rupture de capteurs. Planifiez vos livraisons mensuelles avec un tarif préférentiel et une priorité d’expédition.',
    ar: 'لا تنفد مجساتك أبداً. برمج شحناتك الشهرية مع تخفيض في السعر وأولوية في الإرسال لجميع المدن.'
  },
  'monthly.cta': {
    fr: 'Programmer mon abonnement WhatsApp',
    ar: 'تفعيل الاشتراك الشهري عبر واتساب'
  },

  // Product Card
  'card.in_stock': {
    fr: 'En stock',
    ar: 'متوفر'
  },
  'card.reviews': {
    fr: 'avis',
    ar: 'تقييم'
  },
  'card.quick_order': {
    fr: 'Commander',
    ar: 'طلب سريع'
  },
  'card.add_to_cart': {
    fr: 'Panier',
    ar: 'السلة'
  },
  'card.added': {
    fr: 'Ajouté !',
    ar: 'تمت الإضافة !'
  },
  'card.free_delivery': {
    fr: 'Livraison Gratuite',
    ar: 'توصيل مجاني'
  },
  'card.dh': {
    fr: 'DH',
    ar: 'درهم'
  },
  'card.certified': {
    fr: 'Dispositif Médical Certifié',
    ar: 'جهاز طبي أصلي معتمد'
  },

  // Product Detail Modal
  'modal.in_stock': {
    fr: 'En stock disponible',
    ar: 'متوفر وجاهز للشحن'
  },
  'modal.quantity': {
    fr: 'Quantité :',
    ar: 'الكمية :'
  },
  'modal.total_price': {
    fr: 'Prix total :',
    ar: 'المجموع الإجمالي :'
  },
  'modal.add_to_cart': {
    fr: 'Ajouter au panier',
    ar: 'إضافة إلى السلة'
  },
  'modal.buy_now': {
    fr: 'Acheter maintenant (1 Clic)',
    ar: 'شراء فوري بضغطة واحدة'
  },
  'modal.order_whatsapp': {
    fr: 'Commander par WhatsApp',
    ar: 'طلب فوري عبر واتساب'
  },
  'modal.tab_features': {
    fr: 'Points forts & Avantages',
    ar: 'المميزات الرئيسية'
  },
  'modal.tab_specs': {
    fr: 'Fiche technique',
    ar: 'المواصفات التقنية'
  },
  'modal.tab_box': {
    fr: 'Contenu de la boîte',
    ar: 'محتويات العلبة'
  },
  'modal.specs_duration': {
    fr: 'Durée d’utilisation',
    ar: 'مدة الاستخدام'
  },
  'modal.specs_waterproof': {
    fr: 'Résistance à l’eau',
    ar: 'مقاومة الماء'
  },
  'modal.specs_alarms': {
    fr: 'Alertes & Alarmes',
    ar: 'التنبيهات والإنذارات'
  },
  'modal.specs_app': {
    fr: 'Compatibilité Mobile',
    ar: 'التوافق مع الهواتف'
  },
  'modal.specs_calibration': {
    fr: 'Calibration',
    ar: 'المعايرة'
  },
  'modal.delivery_perk': {
    fr: 'Livraison express 24h-48h partout au Maroc',
    ar: 'توصيل سريع 24-48 ساعة لكافة مدن المغرب'
  },
  'modal.cod_perk': {
    fr: 'Paiement en espèces à la livraison (Cash on Delivery)',
    ar: 'الدفع نقداً بعد استلام الطلب'
  },
  'modal.authenticity_perk': {
    fr: 'Produit 100% original sous blister scellé du fabricant',
    ar: 'منتج أصلي 100% مغلف بختم المصنع'
  },
  'modal.close': {
    fr: 'Fermer',
    ar: 'إغلاق'
  },

  // Cart Drawer
  'cart.title': {
    fr: 'Votre Panier',
    ar: 'سلة المشتريات'
  },
  'cart.items': {
    fr: 'article(s)',
    ar: 'منتج(ات)'
  },
  'cart.empty_title': {
    fr: 'Votre panier est vide',
    ar: 'سلة مشترياتك فارغة'
  },
  'cart.empty_desc': {
    fr: 'Découvrez notre sélection de capteurs et matériel pour la glycémie.',
    ar: 'اكتشف مجموعتنا من مجسات وأجهزة قياس السكر وابدأ التسوق.'
  },
  'cart.discover_btn': {
    fr: 'Découvrir nos produits',
    ar: 'تصفح المنتجات'
  },
  'cart.subtotal': {
    fr: 'Sous-total',
    ar: 'المجموع الفرعي'
  },
  'cart.shipping': {
    fr: 'Livraison express',
    ar: 'التوصيل السريع'
  },
  'cart.shipping_free': {
    fr: 'GRATUITE (Offre spéciale)',
    ar: 'مجاني (عرض خاص)'
  },
  'cart.total': {
    fr: 'Total à payer',
    ar: 'المجموع للدفع'
  },
  'cart.cod_notice': {
    fr: 'Paiement en espèces à la livraison partout au Maroc',
    ar: 'الدفع نقداً عند الاستلام في جميع مدن المغرب'
  },
  'cart.checkout_btn': {
    fr: 'Valider ma commande',
    ar: 'تأكيد وإتمام الطلب'
  },
  'cart.clear': {
    fr: 'Vider le panier',
    ar: 'تفريغ السلة'
  },

  // Checkout Modal
  'checkout.title': {
    fr: 'Validation de Commande Express',
    ar: 'إتمام الطلب السريع'
  },
  'checkout.subtitle': {
    fr: 'Paiement en espèces à la livraison partout au Maroc (Cash on Delivery)',
    ar: 'الدفع نقداً عند استلام الطلب في أي مدينة مغربية'
  },
  'checkout.full_name': {
    fr: 'Nom complet *',
    ar: 'الاسم الكامل *'
  },
  'checkout.full_name_placeholder': {
    fr: 'Ex: Mohammed El Alami',
    ar: 'مثال: محمد العلمي'
  },
  'checkout.phone': {
    fr: 'Numéro de téléphone (WhatsApp) *',
    ar: 'رقم الهاتف (واتساب) *'
  },
  'checkout.phone_placeholder': {
    fr: '06 XX XX XX XX ou 07 XX XX XX XX',
    ar: '06XX XX XX XX أو 07XX XX XX XX'
  },
  'checkout.city': {
    fr: 'Ville de livraison *',
    ar: 'مدينة التوصيل *'
  },
  'checkout.city_select': {
    fr: '-- Sélectionnez votre ville --',
    ar: '-- اختر مدينتك --'
  },
  'checkout.address': {
    fr: 'Adresse de livraison exacte *',
    ar: 'عنوان التوصيل بالتفصيل *'
  },
  'checkout.address_placeholder': {
    fr: 'Quartier, Rue, N° d’immeuble ou de maison...',
    ar: 'الحي، الشارع، رقم العمارة أو المنزل...'
  },
  'checkout.notes': {
    fr: 'Remarques ou instructions pour le livreur (Optionnel)',
    ar: 'ملاحظات أو توجيهات للموزع (اختياري)'
  },
  'checkout.notes_placeholder': {
    fr: 'Ex: Appeler avant de passer, livrer l’après-midi...',
    ar: 'مثال: الاتصال قبل القدوم، التسليم بعد الزوال...'
  },
  'checkout.order_summary': {
    fr: 'Récapitulatif de votre commande',
    ar: 'ملخص طلبك'
  },
  'checkout.payment_method': {
    fr: 'Mode de règlement :',
    ar: 'طريقة الأداء :'
  },
  'checkout.payment_method_desc': {
    fr: 'Paiement en espèces à la livraison. Vous ne payez qu’une fois le colis reçu et vérifié.',
    ar: 'الدفع نقداً عند الاستلام. لن تدفع إلا بعد استلام الطرد والتأكد منه.'
  },
  'checkout.confirm_btn': {
    fr: 'Confirmer ma commande maintenant',
    ar: 'تأكيد طلبي الآن'
  },
  'checkout.submitting': {
    fr: 'Validation en cours...',
    ar: 'جاري تسجيل الطلب...'
  },
  'checkout.success_title': {
    fr: 'Commande confirmée avec succès !',
    ar: 'تم تسجيل طلبك بنجاح !'
  },
  'checkout.success_desc': {
    fr: 'Merci pour votre confiance. Notre équipe vous appellera ou vous enverra un message WhatsApp pour confirmer l’expédition de votre colis.',
    ar: 'شكراً لثقتكم. سيتصل بكم فريقنا أو يراسلكم عبر واتساب لتأكيد شحن طلبكم فوراً.'
  },
  'checkout.order_id': {
    fr: 'Numéro de commande :',
    ar: 'رقم الطلب :'
  },
  'checkout.whatsapp_confirm_btn': {
    fr: 'Ouvrir la confirmation sur WhatsApp',
    ar: 'فتح رسالة التأكيد عبر واتساب'
  },

  // FreeStyle Guide Section
  'guide.tag': {
    fr: 'Mode d’Emploi Pratique',
    ar: 'دليل الاستخدام العملي'
  },
  'guide.title': {
    fr: 'Comment fonctionne le système FreeStyle Libre ?',
    ar: 'كيف يعمل نظام فري ستايل ليبري لمراقبة السكر؟'
  },
  'guide.subtitle': {
    fr: 'Fini les piqûres répétées au bout des doigts. Contrôlez votre diabète en 3 étapes simples et indolores.',
    ar: 'وداعاً للوخز المتكرر في الأصابع. تحكم في مستويات السكر في 3 خطوات بسيطة وغير مؤلمة.'
  },
  'guide.step1_title': {
    fr: '1. Posez le capteur',
    ar: '1. تطبيق المجس بسهولة'
  },
  'guide.step1_desc': {
    fr: 'Appliquez le capteur à l’arrière du haut du bras avec l’applicateur à usage unique fourni. La pose est simple, rapide et pratiquement indolore.',
    ar: 'ضع المجس خلف الجزء العلوي من الذراع باستخدام جهاز التطبيق المرفق. العملية سريعة، سهلة وبدون ألم.'
  },
  'guide.step2_title': {
    fr: '2. Scannez ou suivez en direct',
    ar: '2. مسح القراءة أو متابعة مباشرة'
  },
  'guide.step2_desc': {
    fr: 'Avec le FreeStyle Libre 2 & 3, la mesure est transmise chaque minute via Bluetooth directement sur votre smartphone ou lecteur dédié.',
    ar: 'مع فري ستايل ليبري 2 و 3، تنتقل القياسات تلقائياً كل دقيقة عبر البلوتوث مباشرة إلى هاتفك الذكي أو القارئ.'
  },
  'guide.step3_title': {
    fr: '3. Prenez les bonnes décisions',
    ar: '3. اتخاذ القرار الصحي المناسب'
  },
  'guide.step3_desc': {
    fr: 'Consultez la flèche de tendance (en hausse, stable, en baisse) et recevez des alertes sonores immédiates en cas d’hypoglycémie ou d’hyperglycémie.',
    ar: 'اطلع على سهم الاتجاه (صاعد، مستقر، هابط) وتلقَ تنبيهات صوتية فورية في حال انخفاض السكر أو ارتفاعه.'
  },

  // Advantages Section
  'advantages.title': {
    fr: 'Pourquoi commander chez Parailaf Maroc ?',
    ar: 'لماذا يفضل مرضى السكري الشراء من بارا إيلاف؟'
  },
  'advantages.subtitle': {
    fr: 'Nous nous engageons chaque jour à fournir aux personnes diabétiques au Maroc un matériel fiable, sécurisé et disponible immédiatement.',
    ar: 'نلتزم يومياً بتوفير أجهزة ومستلزمات طبية موثوقة ومضمونة مع سرعة التوصيل وخدمة دعم متميزة.'
  },
  'advantages.card1_title': {
    fr: 'Produits 100% Certifiés d’Origine',
    ar: 'منتجات طبية أصلية 100% ومعتمدة'
  },
  'advantages.card1_desc': {
    fr: 'Tous nos capteurs, lecteurs et aiguilles proviennent des circuits officiels des fabricants (Abbott, Dexcom, OneTouch, BD). Aucun reconditionné.',
    ar: 'جميع المجسات، الأجهزة والإبر مستوردة من الشركات المصنعة الرسمية ومعبأة بختم المصنع الأصلي.'
  },
  'advantages.card2_title': {
    fr: 'Livraison Express 24h/48h',
    ar: 'توصيل سريع خلال 24-48 ساعة'
  },
  'advantages.card2_desc': {
    fr: 'Expédition soignée à Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir et dans toutes les villes et provinces du Royaume.',
    ar: 'شحن مضمون للدار البيضاء، الرباط، مراكش، فاس، طنجة، أكادير وكافة مدن ومحافظات المملكة.'
  },
  'advantages.card3_title': {
    fr: 'Paiement à la Livraison en Espèces',
    ar: 'الدفع نقداً بعد استلام الطلب'
  },
  'advantages.card3_desc': {
    fr: 'Commandez en toute sérénité sans carte bancaire. Vous vérifiez votre colis avant de régler le livreur en espèces.',
    ar: 'اطلب بكل راحة وأمان بدون الحاجة لبطاقة بنكية. يمكنك تفقد طردك قبل أداء المبلغ للموزع.'
  },
  'advantages.card4_title': {
    fr: 'Assistance & Conseils Dédiés 7j/7',
    ar: 'مساعدة وإرشاد مخصص 7/7 أيام'
  },
  'advantages.card4_desc': {
    fr: 'Notre équipe vous guide pas-à-pas pour la pose du capteur, l’installation de l’application et le choix des accessoires adaptés.',
    ar: 'فريقنا المتخصص يجيب على استفساراتكم عبر واتساب ويساعدكم في تفعيل المجسات وتطبيقات الهواتف.'
  },

  // Testimonials
  'testimonials.tag': {
    fr: 'Retours d’Expérience',
    ar: 'تجارب زبائننا'
  },
  'testimonials.title': {
    fr: 'Ce que disent nos clients partout au Maroc',
    ar: 'آراء وتقييمات زبائننا في مختلف مدن المغرب'
  },
  'testimonials.subtitle': {
    fr: 'Découvrez les témoignages authentiques de patients diabétiques et de parents qui nous font confiance pour leur matériel de santé.',
    ar: 'اطلع على تقييمات مرضى السكري وأولياء الأمور الذين يثقون بنا شهرياً للحصول على مستلزماتهم.'
  },

  // FAQ
  'faq.tag': {
    fr: 'Foire Aux Questions',
    ar: 'الأسئلة الشائعة'
  },
  'faq.title': {
    fr: 'Questions Fréquemment Posées',
    ar: 'إجابات على الأسئلة الأكثر تكراراً'
  },
  'faq.subtitle': {
    fr: 'Tout ce que vous devez savoir sur nos capteurs, la livraison au Maroc et le paiement.',
    ar: 'كل ما ترغب بمعرفته حول المجسات، طرق التوصيل بالمغرب وخيارات الدفع.'
  },

  // Footer
  'footer.about_title': {
    fr: 'À propos de Parailaf Maroc',
    ar: 'حول بارا إيلاف المغرب'
  },
  'footer.about_text': {
    fr: 'Parailaf Maroc est votre plateforme de référence spécialisée dans la distribution de matériel médical de contrôle de la glycémie, capteurs CGM FreeStyle Libre 2 & 3 PLUS, lecteurs et accessoires de santé au Maroc.',
    ar: 'بارا إيلاف المغرب هي منصتك الموثوقة المتخصصة في توفير أجهزة ومجسات قياس السكر فري ستايل ليبري، أجهزة القراءة والمستلزمات الطبية المعتمدة في كافة أنحاء المغرب.'
  },
  'footer.quick_links': {
    fr: 'Liens rapides',
    ar: 'روابط سريعة'
  },
  'footer.customer_service': {
    fr: 'Service Client & Contact',
    ar: 'خدمة الزبائن والتواصل'
  },
  'footer.contact_phone': {
    fr: 'Téléphone & WhatsApp :',
    ar: 'الهاتف والواتساب :'
  },
  'footer.hours': {
    fr: 'Horaires : 7j/7 de 9h00 à 21h00',
    ar: 'أوقات العمل: 7/7 أيام من 9:00 صباحاً إلى 9:00 مساءً'
  },
  'footer.city_location': {
    fr: 'Casablanca & expédition dans tout le Maroc',
    ar: 'الدار البيضاء مع شحن يومي لكافة مدن المغرب'
  },
  'footer.medical_disclaimer': {
    fr: 'Avertissement médical : Les dispositifs présentés (FreeStyle Libre, Dexcom, OneTouch) sont des dispositifs médicaux certifiés. Ils ne remplacent pas la consultation d’un médecin diabétologue ou endocrinologue.',
    ar: 'تنبيه طبي: الأجهزة المعروضة (فري ستايل، ديكسكوم، وان تاتش) هي أجهزة طبية معتمدة، ولا تغني عن استشارة طبيب السكري والغدد الصماء المختص.'
  },
  'footer.rights': {
    fr: 'Tous droits réservés. Spécialiste du matériel de santé au Maroc.',
    ar: 'جميع الحقوق محفوظة. المتخصص في مستلزمات رعاية السكري بالمغرب.'
  },
  'footer.terms': {
    fr: 'Conditions Générales de Vente',
    ar: 'شروط البيع والتوصيل'
  },
  'footer.privacy': {
    fr: 'Politique de Confidentialité',
    ar: 'سياسة الخصوصية'
  },
  'footer.legal': {
    fr: 'Mentions Légales',
    ar: 'معلومات قانونية'
  },

  // Mobile Bottom Nav
  'mobile_nav.home': {
    fr: 'Accueil',
    ar: 'الرئيسية'
  },
  'mobile_nav.products': {
    fr: 'Produits',
    ar: 'المنتجات'
  },
  'mobile_nav.cart': {
    fr: 'Panier',
    ar: 'السلة'
  },
  'mobile_nav.whatsapp': {
    fr: 'WhatsApp',
    ar: 'واتساب'
  },
  'mobile_nav.lang': {
    fr: 'العربية',
    ar: 'Français'
  }
};
