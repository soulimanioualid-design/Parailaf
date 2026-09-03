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
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { useCart } from '../context/CartContext';
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
    isFreeShipping, 
    amountNeededForFreeShipping, 
    totalAmount,
    setIsCheckoutOpen,
    generateWhatsAppOrderUrl,
    scrollToSection
  } = useCart();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl();
    window.open(url, '_blank');
  };

  const freeShippingProgress = Math.min(100, (subtotal / BRAND_CONFIG.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Top Cart Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#001f3f] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base font-heading">
                  Mon Panier Parailaf
                </h3>
                <p className="text-xs text-amber-300">
                  {cart.length} article(s) sélectionné(s)
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

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-amber-50/70 border-b border-amber-200">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-900">
                <Truck className="w-4 h-4 text-red-600" />
                {isFreeShipping ? (
                  <span className="text-red-700 font-black">🎉 Félicitations ! Livraison Gratuite offerte</span>
                ) : (
                  <span>Plus que <strong className="text-red-600 font-black">{amountNeededForFreeShipping} DH</strong> pour la livraison gratuite</span>
                )}
              </div>
              <span className="text-[11px] font-black text-amber-900">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            
            <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-red-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-black text-slate-900 text-base">Votre panier est vide</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                  Découvrez nos offres spéciales FreeStyle Libre 2 & 3 PLUS, lecteurs et accessoires disponibles au Maroc.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    scrollToSection('nos-produits');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer"
                >
                  Explorer les offres
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3 sm:gap-4 items-start">
                  
                  {/* Image */}
                  <div className="w-18 h-18 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="max-h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-red-600 font-bold mt-0.5">
                      {item.product.price} DH / unité
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
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-red-600 font-heading">
                          {item.product.price * item.quantity} DH
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              
              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Sous-total articles :</span>
                  <span className="font-bold text-slate-900">{subtotal} DH</span>
                </div>

                {savingsTotal > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Économies réalisées :</span>
                    <span>-{savingsTotal} DH</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Frais de livraison :</span>
                  <span className="font-bold">
                    {isFreeShipping ? (
                      <span className="text-red-600 font-black">GRATUITE</span>
                    ) : (
                      <span>{shippingFee} DH</span>
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Total à payer :</span>
                  <span className="font-black text-2xl text-red-600 font-heading">
                    {totalAmount} <span className="text-sm font-bold text-[#002f6c]">DH</span>
                  </span>
                </div>
              </div>

              {/* Trust Tag */}
              <div className="bg-red-50 text-red-900 p-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border border-red-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Paiement en espèces à la livraison partout au Maroc</span>
              </div>

              {/* Checkout CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-red-400/30"
                >
                  <span>Commander maintenant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Commander via WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
