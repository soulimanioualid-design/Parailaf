import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  MessageCircle, 
  Phone, 
  Search,
  CheckCircle2 
} from 'lucide-react';
import { FAQS } from '../data/faqs';
import { BRAND_CONFIG } from '../data/config';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'usage' | 'livraison' | 'paiement'>('all');
  const { language, isRTL, t } = useLanguage();

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = activeTab === 'all' || faq.category === activeTab;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const question = (language === 'ar' && faq.questionAr ? faq.questionAr : faq.question).toLowerCase();
    const answer = (language === 'ar' && faq.answerAr ? faq.answerAr : faq.answer).toLowerCase();
    const originalQuestion = faq.question.toLowerCase();
    const originalAnswer = faq.answer.toLowerCase();

    const matchesSearch = question.includes(query) || answer.includes(query) || originalQuestion.includes(query) || originalAnswer.includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 bg-white border-b border-slate-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider mb-2 border border-red-200">
            <HelpCircle className="w-3.5 h-3.5" />
            {language === 'ar' ? 'إجابات واضحة وموثوقة' : 'Réponses Claires'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            {language === 'ar' ? 'الأسئلة الشائعة والأكثر طرحاً' : 'Questions Fréquemment Posées'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {language === 'ar' 
              ? 'كل ما يجب معرفته عن طريقة عمل فري ستايل ليبري، التوصيل السريع بالمغرب، والدفع نقداً عند الاستلام.' 
              : 'Tout ce que vous devez savoir sur le fonctionnement de FreeStyle Libre, la livraison au Maroc et le paiement à la livraison.'}
          </p>
        </div>

        {/* Search & Tabs */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث في الأسئلة (مثال: الاستحمام، مدة التوصيل، الدفع...)' : 'Rechercher une question (ex: douche, délai, paiement...)'}
              className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition`}
            />
            <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3.5 pointer-events-none`} />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'all' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'جميع الأسئلة' : 'Toutes les questions'}
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'usage' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'الاستخدام والمستشعرات' : 'Fonctionnement & Capteurs'}
            </button>
            <button
              onClick={() => setActiveTab('livraison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'livraison' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'التوصيل بالمغرب' : 'Livraison au Maroc'}
            </button>
            <button
              onClick={() => setActiveTab('paiement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'paiement' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'الأداء والطلبيات' : 'Paiement & Commandes'}
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const questionText = language === 'ar' && faq.questionAr ? faq.questionAr : faq.question;
            const answerText = language === 'ar' && faq.answerAr ? faq.answerAr : faq.answer;

            return (
              <div 
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'border-red-500 bg-red-50/20 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-start p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-slate-900">{questionText}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-red-600 text-white rotate-180' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-red-100 animate-in fade-in duration-200">
                    <p>{answerText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more help CTA box */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#00172e] to-[#002f6c] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-start">
            <h4 className="font-black text-base sm:text-lg">
              {language === 'ar' ? 'هل لديكم سؤال خاص أو استفسار محدد؟' : 'Vous avez une autre question spécifique ?'}
            </h4>
            <p className="text-xs text-slate-200">
              {language === 'ar'
                ? 'فريق بارا إيلاف المغربي يرافقكم ويجيبكم فوراً عبر واتساب أو عبر الهاتف.'
                : 'Notre équipe marocaine Parailaf vous répond immédiatement sur WhatsApp ou par téléphone.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>{language === 'ar' ? 'واتساب مباشر' : 'WhatsApp Direct'}</span>
            </a>
            <a
              href={`tel:${BRAND_CONFIG.phone}`}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition font-mono"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{BRAND_CONFIG.displayPhone}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
