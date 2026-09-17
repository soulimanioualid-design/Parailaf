import React from 'react';
import { Star, CheckCircle, Quote, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../data/reviews';
import { useLanguage } from '../context/LanguageContext';

export const TestimonialsSection: React.FC = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
            {language === 'ar' ? 'آراء وتجارب الزبناء الموثقة' : 'Avis Clients Vérifiés'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            {language === 'ar' ? 'ماذا يقول زبناؤنا الكرام في المغرب' : 'Ce que disent nos clients au Maroc'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {language === 'ar'
              ? 'اكتشفوا تجارب حقيقية لمرضى السكري وعائلاتهم في مختلف مدن وأقاليم المملكة.'
              : 'Découvrez les retours d\'expérience de patients et de leurs proches partout dans le Royaume.'}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => {
            const author = language === 'ar' && review.authorAr ? review.authorAr : review.author;
            const city = language === 'ar' && review.cityAr ? review.cityAr : review.city;
            const comment = language === 'ar' && review.commentAr ? review.commentAr : review.comment;
            const date = language === 'ar' && review.dateAr ? review.dateAr : review.date;
            const product = language === 'ar' && review.productNameAr ? review.productNameAr : review.productName;

            return (
              <div 
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg hover:border-red-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating stars */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {date}
                    </span>
                  </div>

                  {/* Comment text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                    « {comment} »
                  </p>
                </div>

                {/* Author and product details */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-black text-slate-900 text-xs">{author}</p>
                      {review.verified && (
                        <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 border border-red-200">
                          <CheckCircle className="w-2.5 h-2.5 text-red-600" />
                          {language === 'ar' ? 'شراء مؤكد' : 'Achat vérifié'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{city}</p>
                    <p className="text-[10px] text-[#002f6c] font-bold line-clamp-1 mt-0.5">
                      {product}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
