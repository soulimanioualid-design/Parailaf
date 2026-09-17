import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { BRAND_CONFIG } from '../data/config';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    savingsTotal, 
    shippingFee, 
    totalAmount,
    setIsCheckoutOpen,
    generateWhatsAppOrderUrl,
    scrollToSection,
    getProductImage
  } = useCart();
  const { language, isRTL, t, translateProduct } = useLanguage();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl();
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0 pr-0 sm:pr-10' : 'right-0 pl-0 sm:pl-10'} max-w-full flex`}>
        <div className={`w-full max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in ${isRTL ? 'slide-in-from-left' : 'slide-in-from-right'} duration-300`}>
          
          {/* Top Cart Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#001f3f] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base font-heading">
                  {language === 'ar' ? 'سلتي في بارا إيلاف' : 'Mon Panier Parailaf'}
                </h3>
                <p className="text-xs text-amber-300">
                  {cart.length} {language === 'ar' ? 'منتج تم اختياره' : 'article(s) sélectionné(s)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Notice: 40 DH Flat Rate Everywhere in Morocco */}
          <div className="p-3 bg-red-50/80 border-b border-red-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Truck className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                {language === 'ar' ? 'توصيل لكافة مدن المغرب (24/48 ساعة) :' : 'Livraison partout au Maroc (24h/48h) :'}
              </span>
            </div>
            <span className="font-black text-red-600 bg-white px-2 py-0.5 rounded border border-red-200 shadow-2xs">
              40 {language === 'ar' ? 'درهم' : 'DH'}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-black text-slate-900 text-base">
                  {language === 'ar' ? 'سلتكم فارغة' : 'Votre panier est vide'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                  {language === 'ar'
                    ? 'اكتشفوا عروضنا الخاصة FreeStyle Libre 2 & 3 PLUS، أجهزة القراءة والملحقات المتوفرة بالمغرب.'
                    : 'Découvrez nos offres spéciales FreeStyle Libre 2 & 3 PLUS, lecteurs et accessoires disponibles au Maroc.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    scrollToSection('nos-produits');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer"
                >
                  {language === 'ar' ? 'استعراض العروض والمنتجات' : 'Explorer les offres'}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const translated = translateProduct(item.product);
                return (
                  <div key={item.product.id} className="py-4 flex gap-3 sm:gap-4 items-start">
                    
                    {/* Image */}
                    <div className="w-18 h-18 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img 
                        src={getProductImage ? getProductImage(item.product) : item.product.image} 
                        alt={translated.name}
                        className="max-h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                          {translated.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                          title={language === 'ar' ? 'حذف' : 'Supprimer'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-red-600 font-bold mt-0.5">
                        {item.product.price} {language === 'ar' ? 'درهم / للوحدة' : 'DH / unité'}
                      </p>

                      {/* Quantity Stepper & Line Total */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-lg transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right font-mono">
                          <span className="font-black text-sm text-red-600 font-heading">
                            {item.product.price * item.quantity} {language === 'ar' ? 'درهم' : 'DH'}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              
              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{language === 'ar' ? 'المجموع الجزئي للسلع :' : 'Sous-total articles :'}</span>
                  <span className="font-bold text-slate-900 font-mono">{subtotal} {language === 'ar' ? 'درهم' : 'DH'}</span>
                </div>

                {savingsTotal > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>{language === 'ar' ? 'التوفير المحقق :' : 'Économies réalisées :'}</span>
                    <span className="font-mono">-{savingsTotal} {language === 'ar' ? 'درهم' : 'DH'}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{language === 'ar' ? 'مصاريف التوصيل (المغرب) :' : 'Frais de livraison (Maroc) :'}</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {shippingFee} {language === 'ar' ? 'درهم' : 'DH'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">{language === 'ar' ? 'المجموع الكلي للأداء :' : 'Total à payer :'}</span>
                  <span className="font-black text-2xl text-red-600 font-heading font-mono">
                    {totalAmount} <span className="text-sm font-bold text-[#002f6c]">{language === 'ar' ? 'درهم' : 'DH'}</span>
                  </span>
                </div>
              </div>

              {/* Trust Tag */}
              <div className="bg-red-50 text-red-900 p-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border border-red-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{language === 'ar' ? 'الدفع نقداً عند الاستلام في كافة مدن المغرب' : 'Paiement en espèces à la livraison partout au Maroc'}</span>
              </div>

              {/* Checkout CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-red-400/30"
                >
                  <span>{language === 'ar' ? 'إتمام الطلب الآن' : 'Commander maintenant'}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>{language === 'ar' ? 'الطلب عبر واتساب' : 'Commander via WhatsApp'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
