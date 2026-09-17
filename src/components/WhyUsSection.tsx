import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Sparkles, 
  CreditCard,
  Package,
  HeartHandshake,
  Flame
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { useLanguage } from '../context/LanguageContext';

export const WhyUsSection: React.FC = () => {
  const { language, isRTL } = useLanguage();

  const trustPoints = [
    {
      title: language === 'ar' ? "أجهزة معتمدة وأصلية 100%" : "Dispositifs certifiés & 100% originaux",
      description: language === 'ar'
        ? "نضمن لكم مستشعرات وأجهزة أصلية 100% من المصنع Abbott، محكمة الإغلاق في عبواتها المعقمة الأصلية مع تواريخ صلاحية طويلة ومضمونة."
        : "Nous ne proposons que des dispositifs médicaux 100% originaux du fabricant Abbott, scellés d’usine avec des dates de péremption longues garanties.",
      icon: ShieldCheck,
    },
    {
      title: language === 'ar' ? "توصيل سريع وآمن لجميع مدن المغرب" : "Livraison express et sécurisée au Maroc",
      description: language === 'ar'
        ? "تغليف طبي واقٍ مضاد للصدمات مع شحن وتسليم سريع في غضون 24 إلى 48 ساعة لكافة مدن وأقاليم المملكة."
        : "Vos colis sont préparés avec un emballage antichoc protecteur et expédiés sous 24h à 48h dans toutes les villes et régions du Royaume.",
      icon: Truck,
    },
    {
      title: language === 'ar' ? "مرافقة وإرشاد مخصص قبل وبعد الطلب" : "Assistance personnalisée avant et après commande",
      description: language === 'ar'
        ? "فريق متخصص يرافقكم خطوة بخطوة عبر واتساب والهاتف لاختيار المستشعر الأنسب، وتثبيت التطبيق وتشغيل أول مستشعر بكل سهولة."
        : "Une équipe dédiée vous accompagne par téléphone et WhatsApp pour vous conseiller sur le choix du capteur, l’installation de l’application LibreLink et la première pose.",
      icon: Headphones,
    },
    {
      title: language === 'ar' ? "طلب سهل وسريع في دقيقة واحدة" : "Commande simple et rapide en 1 minute",
      description: language === 'ar'
        ? "بدون تسجيل إلزامي ولا استمارات مطولة: اطلبوا بنقرات قليلة عبر الموقع أو عبر رسالة واتساب واحدة."
        : "Pas de compte obligatoire ni de formulaire complexe : passez commande en 2 clics sur le site ou directement par un simple message WhatsApp.",
      icon: Sparkles,
    },
    {
      title: language === 'ar' ? "الدفع عند الاستلام بدون تسبيق" : "Paiement à la livraison sans avance",
      description: language === 'ar'
        ? "الدفع نقداً للموزع بعد استلام طردكم ومعاينته في منزلكم أو مقر عملكم بكل أمان واطمئنان."
        : "Payez en espèces directement auprès du livreur après avoir réceptionné et vérifié l’intégrité de votre colis à votre domicile ou lieu de travail.",
      icon: CreditCard,
    },
    {
      title: language === 'ar' ? "عروض توفير حصرية وأسعار مناسبة" : "Offres Spéciales multi-pièces économiques",
      description: language === 'ar'
        ? "استفيدوا من أسعار تفضيلية خاصة على باقات المستشعرات المتعددة لتغطية متابعة السكر المستمرة بأفضل تكلفة."
        : "Bénéficiez de tarifs préférentiels exceptionnels sur les packs 4 pièces (135 DH/pièce) et 10 pièces (53 DH/pièce) pour votre suivi continu.",
      icon: Package,
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading and summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider border border-red-200">
              <HeartHandshake className="w-3.5 h-3.5 text-red-600 shrink-0" />
              {language === 'ar' ? 'ثقة وأمان وراحة بال' : 'Confiance & Sérénité'}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              {language === 'ar' ? 'لماذا تختارون الطلب من بارا إيلاف المغرب؟' : 'Pourquoi commander chez Parailaf Maroc ?'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {language === 'ar'
                ? 'ندرك تماماً مدى أهمية ودقة متابعة السكر اليومية وسرعة التزود بالمستلزمات الطبية الموثوقة. لذلك حرصنا على توفير تجربة شراء مطمئنة وسلسة من البداية إلى التوصيل.'
                : 'Nous comprenons à quel point le suivi glycémique exige rigueur, rapidité d\'approvisionnement et fiabilité irréprochable. C\'est pourquoi nous avons pensé chaque étape de votre commande pour vous offrir une expérience fluide et rassurante.'}
            </p>

            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                  99%
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">
                    {language === 'ar' ? 'نسبة رضا الزبناء في المغرب' : 'Taux de satisfaction client au Maroc'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'بناءً على أكثر من 1,200 طلبية مسلمة بنجاح' : 'Basé sur plus de 1 200 commandes livrées'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-red-800 font-bold pt-2 border-t border-red-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  {language === 'ar'
                    ? `خدمة الزبناء متوفرة 7/7 أيام عبر الهاتف ${BRAND_CONFIG.displayPhone}`
                    : `Service client disponible 7j/7 au ${BRAND_CONFIG.displayPhone}`}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Trust Points Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center mb-3 shadow-2xs group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
