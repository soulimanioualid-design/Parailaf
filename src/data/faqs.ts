import { FAQItem } from '../types';

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'usage',
    question: "Comment fonctionne le système FreeStyle Libre ?",
    questionAr: "كيف يعمل نظام فري ستايل ليبري FreeStyle Libre؟",
    answer: "Le capteur FreeStyle Libre se pose à l’arrière de la partie supérieure du bras à l’aide d’un applicateur stérile jetable sans douleur. Il mesure en continu le taux de glucose dans le liquide interstitiel à travers un minuscule filament flexible inséré sous la peau. Vous obtenez votre taux instantanément en scannant le capteur avec votre smartphone ou un lecteur dédié (ou automatiquement à la minute pour le FreeStyle Libre 3).",
    answerAr: "يوضع مستشعر فري ستايل ليبري في الجزء الخلفي من أعلى الذراع بسهولة وبدون ألم باستخدام أداة تطبيق معقمة ذات استخدام واحد. يقيس المستشعر باستمرار مستوى السكر في السائل الخلالي تحت الجلد بواسطة خيط مرن دقيق جداً. تحصلون على قراءتكم فورياً بمجرد تمرير هاتفكم الذكي أو القارئ الخاص فوق المستشعر (أو تلقائياً كل دقيقة عبر البلوتوث في فري ستايل ليبري 3)."
  },
  {
    id: 'faq-2',
    category: 'usage',
    question: "Quelle est la durée d'utilisation d'un capteur ?",
    questionAr: "كم هي مدة استخدام كل مستشعر؟",
    answer: "Chaque capteur FreeStyle Libre 2 ou FreeStyle Libre 3 a une durée de vie active de 14 jours consécutifs. Une fois les 14 jours écoulés, l'application vous avertit et le capteur doit être remplacé par un nouveau.",
    answerAr: "يتمتع كل مستشعر فري ستايل ليبري 2 أو فري ستايل ليبري 3 PLUS بمدة صلاحية تشغيلية تصل إلى 14 إلى 15 يوماً متواصلة ومستمرة على مدار 24 ساعة. بعد انقضاء هذه المدة، يُشعركم التطبيق بضرورة استبدال المستشعر بمستشعر جديد."
  },
  {
    id: 'faq-3',
    category: 'livraison',
    question: "Livrez-vous partout au Maroc et quels sont les frais et délais ?",
    questionAr: "هل تقومون بالتوصيل لجميع مدن المغرب؟ وما هي الآجال والأسعار؟",
    answer: "Oui, nous assurons la livraison dans toutes les villes du Maroc (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Meknès, Oujda, Tétouan, Laâyoune, etc.). Les délais sont de 24h à Casablanca et Rabat, et de 24h à 48h ouvrées pour les autres villes du Royaume. Les frais de livraison sont de 40 DH partout au Maroc quel que soit le montant de la commande.",
    answerAr: "نعم، نضمن التوصيل السريع إلى جميع مدن ومناطق المغرب (الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير، مكناس، وجدة، تطوان، العيون، وغيرها). مدة التوصيل هي 24 ساعة بالدار البيضاء والرباط، و24 إلى 48 ساعة عمل لباقي مدن المملكة. مصاريف التوصيل محددة في 40 درهم لكافة مدن المغرب."
  },
  {
    id: 'faq-4',
    category: 'paiement',
    question: "Puis-je payer en espèces à la livraison (Cash on Delivery) ?",
    questionAr: "هل يمكنني الأداء نقداً عند الاستلام (Paiement à la livraison)؟",
    answer: "Absolument ! Le paiement en espèces à la livraison (Cash on Delivery) est le mode de règlement exclusif pour toutes nos commandes au Maroc. Vous ne payez votre commande qu'en espèces au moment où le livreur vous remet votre colis en main propre à votre domicile ou lieu de travail.",
    answerAr: "بكل تأكيد! الدفع نقداً عند الاستلام هو طريقة الأداء المعتمدة لجميع طلبياتنا داخل المغرب. لا تدفعون ثمن طلبيتكم إلا نقداً للموزع بعد استلام طردكم ومعاينته في منزلكم أو مقر عملكم بكل أمان."
  },
  {
    id: 'faq-5',
    category: 'general',
    question: "Comment passer une commande sur le site ?",
    questionAr: "كيف يمكنني تقديم طلب عبر الموقع؟",
    answer: "Vous pouvez commander en quelques clics : sélectionnez vos produits, cliquez sur 'Ajouter au panier' ou 'Commander maintenant', puis renseignez votre nom, numéro de téléphone et ville de livraison. Vous pouvez aussi commander directement par WhatsApp en un seul clic grâce à notre bouton dédié.",
    answerAr: "يمكنكم الطلب بكل سهولة بنقرات قليلة: اختاروا منتجاتكم، اضغطوا على 'إضافة إلى السلة' أو 'اطلب الآن'، ثم أدخلوا اسمكم ورقم هاتفكم ومدينتكم. كما يمكنكم الطلب مباشرة عبر واتساب بضغطة واحدة من خلال زر الطلب السريع."
  },
  {
    id: 'faq-6',
    category: 'usage',
    question: "Puis-je me doucher ou nager avec le capteur ?",
    questionAr: "هل يمكنني الاستحمام أو السباحة مع ارتداء المستشعر؟",
    answer: "Oui ! Le capteur est conçu pour résister à l'eau (norme IP27/IP28). Vous pouvez prendre votre douche, faire du sport ou nager jusqu'à 1 mètre de profondeur pendant 30 minutes sans problème. Pour les activités intenses ou prolongées, nous recommandons nos patchs de protection imperméables.",
    answerAr: "نعم! المستشعر مقاوم للماء تماماً (معيار IP27/IP28). يمكنكم الاستحمام وممارسة الرياضة والسباحة حتى عمق متر واحد لمدة تصل إلى 30 دقيقة دون أي قلق. وللأنشطة الرياضية المكثفة نوفر لاصقات حماية شفافة ومقاومة للماء."
  },
  {
    id: 'faq-7',
    category: 'general',
    question: "Vos produits sont-ils authentiques et scellés ?",
    questionAr: "هل منتجاتكم أصلية 100% ومحكمة الإغلاق؟",
    answer: "Tous nos capteurs et lecteurs FreeStyle Libre sont 100% originaux, certifiés conformes CE, scellés dans leur emballage stérile d'origine par le fabricant Abbott avec une longue date de péremption garantie. Nous respectons scrupuleusement la chaîne de stockage.",
    answerAr: "جميع أجهزة ومستشعرات FreeStyle Libre أصلية 100%، مستوردة من المصنع Abbott ومعتمدة بمعايير الجودة الأوروبية CE ومحكمة الإغلاق في عبواتها المعقمة الأصلية مع تواريخ صلاحية طويلة ومضمونة ونظام تخزين خاضع لأدق المعايير الطبية."
  }
];
