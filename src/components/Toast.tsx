import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage, setIsCartOpen } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#001f3f]/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-red-500/40 flex items-center gap-3 max-w-sm backdrop-blur-md">
        <div className="w-7 h-7 rounded-lg bg-red-600/30 text-amber-300 flex items-center justify-center shrink-0 border border-red-500/40">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-xs font-bold text-slate-100 flex-1 line-clamp-1">
          {toastMessage}
        </p>
        <button
          onClick={() => setIsCartOpen(true)}
          className="text-xs font-black text-amber-300 hover:text-amber-200 underline whitespace-nowrap cursor-pointer"
        >
          Voir panier
        </button>
      </div>
    </div>
  );
};
