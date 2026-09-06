import React from 'react';
import { Home, Grid, ShoppingBag, MessageSquare, PhoneCall, Flame, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../data/config';

interface MobileBottomNavProps {
  onOpenCategoriesDrawer: () => void;
  onOpenContact: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  onOpenCategoriesDrawer,
  onOpenContact
}) => {
  const { totalItemsCount, setIsCartOpen, scrollToSection } = useCart();
  const { currentUser, openAuthModal, setIsAccountModalOpen } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1.5 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4 items-center max-w-md mx-auto text-center">
        
        {/* 1. Accueil */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 active:text-red-600 focus:outline-none transition group cursor-pointer"
        >
          <Home className="w-5 h-5 mb-0.5 text-slate-500 group-hover:text-red-600 transition-colors" />
          <span className="text-[10px] font-bold text-slate-700 group-hover:text-red-600">Accueil</span>
        </button>

        {/* 2. Offres & Produits */}
        <button
          onClick={() => {
            scrollToSection('nos-produits');
          }}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 active:text-red-600 focus:outline-none transition group cursor-pointer"
        >
          <Grid className="w-5 h-5 mb-0.5 text-slate-500 group-hover:text-red-600 transition-colors" />
          <span className="text-[10px] font-bold text-slate-700 group-hover:text-red-600">Produits</span>
        </button>

        {/* 3. Panier with live count */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-1 text-slate-600 active:text-red-600 focus:outline-none transition group cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-slate-500 group-hover:text-red-600 transition-colors" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-700 group-hover:text-red-600">Panier</span>
        </button>

        {/* 4. Compte Client / Connexion */}
        <button
          onClick={() => {
            if (currentUser) {
              setIsAccountModalOpen(true);
            } else {
              openAuthModal('login');
            }
          }}
          className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 active:text-[#002f6c] focus:outline-none transition group cursor-pointer"
        >
          {currentUser ? (
            <div className="w-5 h-5 mb-0.5 rounded-full bg-[#002f6c] text-amber-300 flex items-center justify-center text-[10px] font-black">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
          ) : (
            <UserIcon className="w-5 h-5 mb-0.5 text-slate-500 group-hover:text-[#002f6c] transition-colors" />
          )}
          <span className="text-[10px] font-bold text-slate-700 group-hover:text-[#002f6c] truncate max-w-[55px]">
            {currentUser ? 'Compte' : 'Connexion'}
          </span>
        </button>

      </div>
    </div>
  );
};
