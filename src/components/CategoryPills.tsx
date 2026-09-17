import React from 'react';
import { 
  Flame,
  Radio, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Shield, 
  Package, 
  Activity,
  ChevronRight 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CategoryPills: React.FC = () => {
  const { activeCategory, setActiveCategory, scrollToSection } = useCart();
  const { language, isRTL } = useLanguage();

  const categoryItems = [
    {
      id: 'offres-speciales',
      title: language === 'ar' ? 'عروض خاصة' : 'Offres Spéciales',
      subtitle: language === 'ar' ? 'باقات وتخفيضات' : 'Packs & Promos',
      description: language === 'ar' ? 'أسعار تفضيلية وخصومات فورية' : 'Tarifs préférentiels & remises immédiates',
      icon: Flame,
      badge: language === 'ar' ? 'تخفيضات' : 'Promos',
      badgeColor: 'bg-red-600 text-white',
      borderHover: 'hover:border-red-500',
      activeBg: 'border-red-600 bg-red-50/80',
    },
    {
      id: 'libre-2',
      title: language === 'ar' ? 'ليبري 2 بلس' : 'Libre 2 PLUS',
      subtitle: language === 'ar' ? '15 يوماً من المتابعة' : '15 jours de suivi',
      description: language === 'ar' ? 'مجسات وتنبيهات بلوتوث مباشرة' : 'Capteurs & alertes Bluetooth en direct',
      icon: Radio,
      badge: language === 'ar' ? 'الأكثر مبيعاً' : 'Best-Seller',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      borderHover: 'hover:border-red-500',
      activeBg: 'border-red-600 bg-red-50/80',
    },
    {
      id: 'libre-3',
      title: language === 'ar' ? 'ليبري 3 بلس' : 'Libre 3 PLUS',
      subtitle: language === 'ar' ? 'دقيقة بدقيقة' : 'Minute par minute',
      description: language === 'ar' ? 'حجم صغير جداً وقراءة مباشرة' : 'Ultra-discret, lecture en direct',
      icon: Sparkles,
      badge: language === 'ar' ? 'جديد !' : 'Nouveau !',
      badgeColor: 'bg-blue-100 text-blue-900',
      borderHover: 'hover:border-blue-500',
      activeBg: 'border-[#002f6c] bg-blue-50/80',
    },
    {
      id: 'dexcom',
      title: language === 'ar' ? 'ديكسكوم G7 و G6' : 'Dexcom G7 & G6',
      subtitle: language === 'ar' ? 'أنظمة CGM' : 'Systèmes CGM',
      description: language === 'ar' ? 'مجس فائق الدقة وتنبيهات استباقية' : 'Capteur ultra-fin & alertes prédictives',
      icon: Activity,
      badge: 'G7 & G6',
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      borderHover: 'hover:border-emerald-500',
      activeBg: 'border-emerald-600 bg-emerald-50/80',
    },
    {
      id: 'lecteurs',
      title: language === 'ar' ? 'أجهزة قياس السكر' : 'Lecteurs de Glycémie',
      subtitle: language === 'ar' ? 'ون تاتش وفري ستايل' : 'OneTouch & FreeStyle',
      description: language === 'ar' ? 'ون تاتش فيريو وفري ستايل ابتداءً من 250 درهم' : 'OneTouch Verio Reflect® & FSL dès 250 DH',
      icon: Smartphone,
      badge: language === 'ar' ? 'من 250 درهم' : 'Dès 250 DH',
      badgeColor: 'bg-amber-100 text-amber-900',
      borderHover: 'hover:border-amber-500',
      activeBg: 'border-amber-500 bg-amber-50/70',
    },
    {
      id: 'omnipod',
      title: language === 'ar' ? 'أومنيبود DASH / 5' : 'Omnipod DASH / 5',
      subtitle: language === 'ar' ? 'ضخ مستمر للأنسولين' : 'Délivrance continue',
      description: language === 'ar' ? 'بدون أنابيب - باقة 10 بودات' : 'Sans tubulure (Tubeless) - Pack de 10',
      icon: Layers,
      badge: language === 'ar' ? 'تكنولوجيا' : 'Technologie',
      badgeColor: 'bg-slate-200 text-slate-800',
      borderHover: 'hover:border-slate-500',
      activeBg: 'border-slate-800 bg-slate-100',
    },
    {
      id: 'accessoires',
      title: language === 'ar' ? 'إبر ومستلزمات' : 'Aiguilles & Soins',
      subtitle: language === 'ar' ? 'بي دي ميكروفاين ولواصق' : 'BD Micro-Fine & Patchs',
      description: language === 'ar' ? 'إبر 32G/4mm، وحافظات ولواصق' : 'Aiguilles 32G/4mm, trousses & patchs',
      icon: Shield,
      badge: language === 'ar' ? 'من 25 درهم' : 'Dès 25 DH',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      borderHover: 'hover:border-emerald-500',
      activeBg: 'border-emerald-600 bg-emerald-50/70',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveCategory(id);
    scrollToSection('nos-produits');
  };

  return (
    <section className="py-10 bg-white border-b border-slate-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-red-600 text-xs font-black uppercase tracking-wider mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              {language === 'ar' ? 'تشكيلة معتمدة من أبوت والرعاية الصحية' : 'Gamme Certifiée Abbott & Soins'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              {language === 'ar' ? 'اختر منتجاتك وعروضك' : 'Sélectionnez vos Produits & Offres'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              {language === 'ar' 
                ? 'فري ستايل ليبري 2 و 3 بلس، باقات اقتصادية حصرية، مضخات أومنيبود 5 ومستلزمات الحماية.'
                : 'FreeStyle Libre 2 & 3 PLUS, packs économiques exclusifs, pompes Omnipod 5 et accessoires de protection cutanée.'}
            </p>
          </div>

          <button
            onClick={() => handleSelect('all')}
            className="mt-3 sm:mt-0 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 transition gap-1 group cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض الكتالوج كاملاً' : 'Voir tout le catalogue complet'}</span>
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden cursor-pointer ${
                  isSelected 
                    ? item.activeBg + ' shadow-md scale-[1.02]' 
                    : 'border-slate-200 hover:border-red-300 hover:shadow-md bg-slate-50/60 hover:bg-white'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3 w-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-white text-slate-700 shadow-xs group-hover:bg-red-600 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {item?.badge && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-red-600 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="font-black text-slate-900 text-sm font-heading group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-red-600 mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 hidden sm:block">
                    {item.description}
                  </p>
                </div>

                {/* Bottom link indicator */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-red-600">
                  <span>{language === 'ar' ? 'اختيار' : 'Sélectionner'}</span>
                  <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'} transition-transform`} />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
