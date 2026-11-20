import React from 'react';
import { 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Banknote, 
  Clock, 
  ChevronRight,
  Heart,
  Flame,
  Lock,
  Building2,
  FileText
} from 'lucide-react';
import { BRAND_CONFIG, MOROCCAN_CITIES } from '../data/config';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenLegal: (title: string, content: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenContact, onOpenLegal }) => {
  const { scrollToSection, setActiveCategory, setIsAdminOpen } = useCart();
  const { language, isRTL, t } = useLanguage();

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    scrollToSection('nos-produits');
  };

  const openLegalNotice = () => {
    if (language === 'ar') {
      onOpenLegal(
        "الإشعارات القانونية والسجل التجاري",
        `بارا إيلاف المغرب - شركة متخصصة في توزيع الأجهزة الطبية المعتمدة في المغرب (FreeStyle Libre, Omnipod, وملحقات قياس السكر).\n\n• الاسم التجاري: بارا إيلاف المغرب (Parailaf Maroc)\n• العنوان الإداري: ${BRAND_CONFIG.address}\n• المعرّف الموحد للمقاولة (ICE): ${BRAND_CONFIG.ice}\n• التعريف الضريبي (IF): ${BRAND_CONFIG.ifNumber}\n• الرسم المهني (TP): ${BRAND_CONFIG.taxePro}\n• الهاتف: ${BRAND_CONFIG.displayPhone}\n• البريد الإلكتروني: ${BRAND_CONFIG.email}\n• أوقات خدمة الزبناء: ${BRAND_CONFIG.operatingHours}\n\nجميع أجهزتنا جديدة، في علبها الأصلية المغلقة ومعقمة ومطابقة للمعايير الصحية الأوروبية CE.`
      );
    } else {
      onOpenLegal(
        "Mentions Légales & Registre Professionnel",
        `Parailaf Maroc - Société spécialisée dans la distribution de dispositifs médicaux certifiés au Maroc (FreeStyle Libre, Omnipod, accessoires de glycémie).\n\n• Raison Sociale : Parailaf Maroc\n• Adresse de Direction : ${BRAND_CONFIG.address}\n• ICE (Identifiant Commun de l'Entreprise) : ${BRAND_CONFIG.ice}\n• IF (Identifiant Fiscal) : ${BRAND_CONFIG.ifNumber}\n• Taxe Professionnelle (TP) : ${BRAND_CONFIG.taxePro}\n• Téléphone : ${BRAND_CONFIG.displayPhone}\n• Email : ${BRAND_CONFIG.email}\n• Disponibilité Service Client : ${BRAND_CONFIG.operatingHours}\n\nTous nos dispositifs sont neufs, sous emballage scellé d'origine et conformes aux normes sanitaires CE.`
      );
    }
  };

  const openCGV = () => {
    if (language === 'ar') {
      onOpenLegal(
        "الشروط العامة للبيع",
        `تحكم هذه الشروط عمليات البيع التي تتم عبر موقع بارا إيلاف المغرب (ICE: ${BRAND_CONFIG.ice} | IF: ${BRAND_CONFIG.ifNumber} | TP: ${BRAND_CONFIG.taxePro}). جميع المنتجات المعروضة جديدة ومغلقة بأختام المصنعين ومطابقة للمعايير الأوروبية CE. الدفع يتم حصرياً نقداً عند الاستلام بعد تفقد طردكم. في حالة وجود أي عيب في علبة مغلقة عند الاستلام، نضمن الاستبدال خلال 48 ساعة.`
      );
    } else {
      onOpenLegal(
        "Conditions Générales de Vente (CGV)",
        `Les présentes conditions régissent les ventes effectuées sur le site Parailaf Maroc (ICE : ${BRAND_CONFIG.ice} | IF : ${BRAND_CONFIG.ifNumber} | Taxe Pro : ${BRAND_CONFIG.taxePro}). Tous les produits proposés sont neufs, scellés d'origine par les fabricants et conformes aux normes CE. Le paiement s'effectue exclusivement en espèces à la livraison (Cash on Delivery) après réception de votre colis. En cas de non-conformité d'un article scellé à réception, le remplacement est garanti sous 48h.`
      );
    }
  };

  const openPrivacy = () => {
    if (language === 'ar') {
      onOpenLegal(
        "سياسة الخصوصية وحماية المعطيات",
        "يتم جمع معطياتكم الشخصية (الاسم، رقم الهاتف، المدينة وعنوان التسليم) حصرياً لمعالجة وإيصال طلبياتكم داخل المغرب. لا يتم بيعها أو مشاركتها مع أي جهة خارجية. يحق لكم طلب تعديلها أو حذفها في أي وقت عبر التواصل معنا."
      );
    } else {
      onOpenLegal(
        "Politique de Confidentialité",
        "Vos données personnelles (nom, numéro de téléphone, ville et adresse de livraison) sont collectées exclusivement dans le cadre du traitement et de l'acheminement de votre commande au Maroc. Elles ne sont en aucun cas vendues ou cédées à des tiers. Conformément aux dispositions légales relatives à la protection des données, vous disposez d'un droit d'accès et de rectification sur simple demande."
      );
    }
  };

  const openDeliveryPolicy = () => {
    if (language === 'ar') {
      onOpenLegal(
        "سياسة التوصيل بالمغرب",
        "توفر بارا إيلاف التوصيل لكافة مدن المملكة خلال 24 إلى 48 ساعة عمل. في الدار البيضاء والرباط، قد يتم التوصيل في نفس اليوم للطلبات المسجلة قبل 12h00 ظهراً. مصاريف التوصيل ثابتة وهي 40 درهم لكافة مدن المغرب. الدفع يكون نقداً عند الاستلام بعد المعاينة، ويتصل بكم الموزع هاتفياً قبل الحضور لعنوانكم."
      );
    } else {
      onOpenLegal(
        "Politique de Livraison au Maroc",
        "Parailaf Maroc assure la livraison dans toutes les villes du Royaume sous 24h à 48h ouvrées. À Casablanca et Rabat, la livraison peut être effectuée le jour même pour toute commande passée avant 12h00. Les frais de livraison sont de 40 DH partout au Maroc quel que soit le montant de la commande. Le règlement s'effectue en espèces à la remise du colis en main propre. Le livreur prend contact par téléphone avant de se présenter à votre adresse."
      );
    }
  };

  return (
    <footer className="bg-[#00172e] text-slate-400 text-xs border-t border-slate-800" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Top Value Banner inside Footer */}
      <div className="bg-[#001f3f] border-b border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-start">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">
                {language === 'ar' ? 'توصيل لكافة مدن المغرب' : 'Livraison partout au Maroc'}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === 'ar' ? 'الدار البيضاء، الرباط وكافة الجهات' : 'Casablanca, Rabat & toutes régions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Banknote className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">
                {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === 'ar' ? 'ادفعوا نقداً بعد تفقد الطرد' : 'Réglez après réception en espèces'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">
                {language === 'ar' ? '100% منتجات أصلية Abbott' : '100% Originaux Abbott'}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === 'ar' ? 'علب معقمة ومختومة' : 'Boîtes stériles scellées'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Clock className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">
                {language === 'ar' ? 'خدمة الزبناء 7/7 أيام' : 'Assistance 7j/7'}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === 'ar' ? 'نصائح ومتابعة عبر واتساب وهاتفياً' : 'Conseils par WhatsApp & Tél'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />

            <p className="text-slate-300 leading-relaxed text-xs max-w-sm">
              {language === 'ar'
                ? 'بارا إيلاف المغرب، موزّعكم الموثوق لحلول المراقبة المستمرة لنسبة السكر بالدم فري ستايل ليبري 2 و 3 بلس، باقات ترويجية حصرية، مضخات أومنيبود 5 وملحقات معتمدة.'
                : 'Votre parapharmacie et distributeur de référence au Maroc dédiée aux solutions modernes de contrôle continu du glucose FreeStyle Libre 2 & 3 PLUS, packs exclusifs, Omnipod 5 et accessoires certifiés.'}
            </p>

            <div className="pt-2 space-y-1.5 text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{BRAND_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{BRAND_CONFIG.operatingHours}</span>
              </div>
            </div>

            {/* Identifiants Juridiques & Fiscaux Officiels Maroc */}
            <div className="pt-2">
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-medium">ICE :</span>
                  <span className="font-mono font-bold text-amber-300 tracking-wider select-all">{BRAND_CONFIG.ice}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-medium">{language === 'ar' ? 'التعريف الضريبي (IF):' : 'Identifiant Fiscal (IF) :'}</span>
                  <span className="font-mono font-bold text-slate-200 select-all">{BRAND_CONFIG.ifNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-medium">{language === 'ar' ? 'الرسم المهني (TP):' : 'Taxe Professionnelle :'}</span>
                  <span className="font-mono font-bold text-slate-200 select-all">{BRAND_CONFIG.taxePro}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Produits */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm font-heading tracking-wide">
              {language === 'ar' ? 'المنتجات والعروض' : 'Produits & Offres'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleCategoryNav('offres-speciales')} 
                  className="hover:text-red-400 text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{language === 'ar' ? 'العروض الخاصة (الملصق)' : 'Offres Spéciales (Flyer)'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('libre-2')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>FreeStyle Libre 2 PLUS</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('libre-3')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>FreeStyle Libre 3 PLUS</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('omnipod')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>Omnipod 5 PODS (Pack 10)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('lecteurs')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'أجهزة القراءة الذكية FreeStyle 2' : 'Lecteurs tactiles FreeStyle 2'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('accessoires')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'لاصقات حماية وملحقات' : 'Patchs Adhésifs & Accessoires'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations & Guide */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm font-heading tracking-wide">
              {language === 'ar' ? 'معلومات وإرشادات' : 'Informations Pratiques'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('guide-freestyle')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'دليل استخدام فري ستايل' : "Guide d'utilisation FreeStyle"}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('blog-conseils')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'نصائح ومقالات السكري' : 'Blog & Conseils Diabète'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'الأسئلة الشائعة (FAQ)' : 'Foire Aux Questions (FAQ)'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAbout} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'عن بارا إيلاف المغرب' : 'À propos de Parailaf Maroc'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openDeliveryPolicy} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'سياسة التوصيل بالمغرب' : 'Politique de Livraison Maroc'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openCGV} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'الشروط العامة للبيع' : 'Conditions Générales (CGV)'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openPrivacy} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 text-slate-600 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{language === 'ar' ? 'سياسة الخصوصية' : 'Politique de Confidentialité'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Direct au Maroc */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm font-heading tracking-wide">
              {language === 'ar' ? 'الاتصال والطلبات' : 'Contact & Commandes'}
            </h4>
            
            <div className="space-y-2.5">
              <a
                href={`tel:${BRAND_CONFIG.phone}`}
                className="p-3 bg-[#001f3f] hover:bg-[#002855] rounded-xl border border-slate-700/80 flex items-center gap-2.5 transition text-white"
              >
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-300">{language === 'ar' ? 'الهاتف المباشر:' : 'Téléphone Direct :'}</p>
                  <p className="font-black text-xs text-amber-300">{BRAND_CONFIG.displayPhone}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(
                  language === 'ar' ? 'السلام عليكم بارا إيلاف، أريد الاستفسار أو طلب أجهزة فري ستايل ليبري.' : BRAND_CONFIG.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-950/70 hover:bg-emerald-900/90 rounded-xl border border-emerald-700/60 flex items-center gap-2.5 transition text-white"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-emerald-300">{language === 'ar' ? 'واتساب 7/7 أيام:' : 'WhatsApp 7j/7 :'}</p>
                  <p className="font-black text-xs text-emerald-200">{BRAND_CONFIG.displayWhatsapp}</p>
                </div>
              </a>

              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition text-[11px] pt-1"
              >
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{BRAND_CONFIG.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Medical disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center sm:text-start">
          <p>
            <strong>{language === 'ar' ? 'تنبيه وإخلاء مسؤولية طبي:' : 'Avertissement médical :'}</strong>{' '}
            {language === 'ar'
              ? 'بارا إيلاف المغرب توفر أجهزة طبية مرخصة ومطابقة للمعايير الصحية الأوروبية من مصنعيها المعتمدين Abbott و Insulet. المعلومات والمحتويات المقدمة في هذا الموقع تثقيفية ولا تعوّض المتابعة والتوجيهات الطبية الصادرة عن طبيبكم المعالج.'
              : 'Parailaf Maroc distribue des dispositifs médicaux certifiés conformes CE de la marque Abbott (FreeStyle Libre) et Insulet (Omnipod). Les informations fournies sur ce site ne remplacent pas les recommandations personnalisées de votre médecin diabétologue ou professionnel de santé.'}
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            {language === 'ar'
              ? `© ${new Date().getFullYear()} ${BRAND_CONFIG.name} - جميع الحقوق محفوظة. توصيل سريع لكافة مدن المغرب.`
              : `© ${new Date().getFullYear()} ${BRAND_CONFIG.name} - Tous droits réservés. Livraison partout au Maroc.`}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button onClick={openLegalNotice} className="hover:text-white cursor-pointer font-medium text-slate-300">
              {language === 'ar' ? 'الإشعارات القانونية' : 'Mentions Légales'}
            </button>
            <button onClick={openCGV} className="hover:text-white cursor-pointer">
              {language === 'ar' ? 'الشروط العامة' : 'CGV'}
            </button>
            <button onClick={openPrivacy} className="hover:text-white cursor-pointer">
              {language === 'ar' ? 'الخصوصية' : 'Confidentialité'}
            </button>
            <button onClick={openDeliveryPolicy} className="hover:text-white cursor-pointer">
              {language === 'ar' ? 'التوصيل بالمغرب' : 'Livraison Maroc'}
            </button>
            <button 
              onClick={() => setIsAdminOpen(true)} 
              className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title={language === 'ar' ? 'منطقة المشرفين' : 'Accès réservé administration'}
            >
              <Lock className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{language === 'ar' ? 'لوحة الإدارة' : 'Espace Pro'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
