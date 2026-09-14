import React from 'react';
import { CheckCircle2, ShoppingBag, Trash2, Info, AlertCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastData, toastMessage, setIsCartOpen, showToast } = useCart();

  const message = toastData?.message || toastMessage;
  if (!message) return null;

  const type = toastData?.type || (message.toLowerCase().includes('panier') ? 'cart' : 'info');
  const isCart = type === 'cart' || message.toLowerCase().includes('au panier');
  const isDelete = message.toLowerCase().includes('supprimé') || message.toLowerCase().includes('retiré');

  // Dismiss toast
  const handleDismiss = () => {
    // Setting an empty toast immediately closes it
    showToast('', 'info');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-auto">
      <div className="bg-[#001f3f]/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 max-w-md w-max min-w-[280px] backdrop-blur-md">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
          isCart
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : isDelete
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            : type === 'error'
            ? 'bg-red-500/20 text-red-300 border-red-500/30'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {isCart ? (
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          ) : isDelete ? (
            <Trash2 className="w-4 h-4 text-rose-400" />
          ) : type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : type === 'info' ? (
            <Info className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          )}
        </div>

        <p className="text-xs font-semibold text-slate-100 flex-1 leading-snug">
          {message}
        </p>

        {/* ONLY show "Voir panier" button if a product was actually added to cart */}
        {isCart && (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-black text-amber-300 hover:text-amber-200 underline whitespace-nowrap cursor-pointer transition px-1 py-0.5"
          >
            Voir panier
          </button>
        )}

        {/* Quick dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition shrink-0 cursor-pointer"
          title="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

