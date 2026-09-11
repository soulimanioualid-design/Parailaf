import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles,
  Clock,
  ArrowRight,
  Flame,
  Edit3
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../data/config';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'list' }) => {
  const { 
    addToCart, 
    setSelectedProductForModal,
    setQuickBuyProduct,
    setIsCheckoutOpen,
    getProductImage,
    openAdmin
  } = useCart();

  const { isAdmin, isAdminSessionActive } = useAuth();
  const hasAdminAccess = isAdmin || isAdminSessionActive;

  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayImage = getProductImage ? getProductImage(product) : product.image;

  const isGrid = viewMode === 'grid';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickBuyProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Bonjour Parailaf, je souhaite commander : *${product.name}* au prix de *${product.price} DH*. Pourriez-vous me confirmer la disponibilité et la livraison ?`;
    const url = `https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Badge stylings
  const renderBadge = () => {
    if (product.badge === 'Offre Spéciale' || product.badge === 'Meilleur Prix') {
      return (
        <span className={`bg-red-600 text-white font-black rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wider ${isGrid ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
          <Flame className={`${isGrid ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-amber-300 text-amber-300`} />
          {product.badge}
        </span>
      );
    }
    if (product.badge === 'Best Seller') {
      return (
        <span className={`bg-amber-400 text-slate-950 font-black rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wide ${isGrid ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
          <Sparkles className={`${isGrid ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-slate-950`} />
          Best Seller
        </span>
      );
    }
    if (product.badge === 'Promo') {
      return (
        <span className={`bg-red-600 text-white font-black rounded-lg shadow-sm uppercase tracking-wide ${isGrid ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
          Promo
        </span>
      );
    }
    if (product.badge === 'Nouveau !' || product.badge === 'Nouveau') {
      return (
        <span className={`bg-[#002f6c] text-white font-black rounded-lg shadow-sm uppercase tracking-wide border border-blue-400/40 ${isGrid ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
          Nouveau !
        </span>
      );
    }
    if (product.badge === 'Indispensable' || product.badge === 'Essentiel') {
      return (
        <span className={`bg-amber-100 text-amber-900 font-extrabold rounded-lg shadow-sm uppercase tracking-wide border border-amber-300 ${isGrid ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
          {product.badge}
        </span>
      );
    }
    return null;
  };

  return (
    <div 
      onClick={() => setSelectedProductForModal(product)}
      className={`group bg-white rounded-2xl border border-slate-200/90 hover:border-red-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
        isGrid ? 'p-0' : ''
      }`}
    >
      {/* Top Header Section inside card */}
      <div className={`relative bg-white border-b border-slate-100 flex items-center justify-center overflow-hidden ${
        isGrid ? 'h-44 sm:h-64 md:h-72' : 'h-72 sm:h-80 md:h-84'
      }`}>
        
        {/* Floating Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start">
          {renderBadge()}
          {product.discountPercentage && (
            <span className="bg-slate-900 text-amber-300 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Admin Quick Edit Button - Always visible on mobile & desktop for authenticated admins */}
        {hasAdminAccess ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAdmin('products');
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 px-2.5 py-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-[10px] font-black shadow-md flex items-center gap-1 transition cursor-pointer"
            title="Modifier ce produit dans l'espace Admin"
          >
            <Edit3 className="w-3 h-3" />
            <span>Modifier</span>
          </button>
        ) : (
          /* Quick View Floating Action */
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 text-slate-700 hover:text-red-600 hover:bg-slate-50 shadow-md border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Aperçu rapide"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className={`flex-1 flex flex-col justify-between ${
        isGrid ? 'p-2.5 sm:p-4' : 'p-4 sm:p-5'
      }`}>
        <div>
          {/* Brand & Category pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`font-extrabold text-[#002f6c] uppercase tracking-wider ${
              isGrid ? 'text-[9px] sm:text-[11px]' : 'text-[11px]'
            }`}>
              {product.brand}
            </span>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 text-amber-500 text-[10px] sm:text-xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-black text-slate-800">{product.rating}</span>
              {!isGrid && <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>}
            </div>
          </div>

          {/* Product Title */}
          <h3 className={`font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors font-heading ${
            isGrid ? 'text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]' : 'text-sm sm:text-base line-clamp-2'
          }`}>
            {product.name}
          </h3>

          {/* Short description (only in list mode, never in compact grid) */}
          {!isGrid && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
              {product.shortDescription}
            </p>
          )}

          {/* Key bullets (in list mode) */}
          {!isGrid && (
            <div className="mt-2.5 space-y-1">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA Buttons */}
        <div className={`border-t border-slate-100 ${
          isGrid ? 'mt-2 pt-2' : 'mt-4 pt-3.5'
        }`}>
          
          {/* Price container */}
          <div className="flex items-baseline justify-between gap-1 mb-2 sm:mb-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`font-black text-red-600 font-heading ${
                  isGrid ? 'text-lg sm:text-2xl' : 'text-2xl sm:text-3xl'
                }`}>
                  {product.price} <span className="text-xs sm:text-sm font-bold text-[#002f6c]">DH</span>
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    {product.originalPrice} DH
                  </span>
                )}
              </div>
              {!isGrid && product.originalPrice && (
                <p className="text-[10px] font-extrabold text-amber-600">
                  Économie : {product.originalPrice - product.price} DH
                </p>
              )}
            </div>

            {!isGrid && (
              <span className="text-[10px] text-slate-500 font-bold text-right bg-slate-100 px-2 py-0.5 rounded">
                Paiement Espèce
              </span>
            )}
          </div>

          {/* Action buttons in Grid vs List */}
          {isGrid ? (
            <div className="space-y-1.5">
              <button
                onClick={handleAddToCart}
                className={`w-full py-2 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-xs ${
                  isAddedRecently
                    ? 'bg-[#002f6c] text-white'
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ajouté !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-red-100" />
                    <span>Ajouter au panier</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={handleQuickBuy}
                  className="py-1 text-[10px] font-bold text-slate-800 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition text-center truncate"
                >
                  ⚡ 1-Clic
                </button>
                <button
                  onClick={handleWhatsAppBuy}
                  className="py-1 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition flex items-center justify-center gap-1 text-[10px] font-bold"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 fill-emerald-600 text-emerald-600 shrink-0" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
                    isAddedRecently
                      ? 'bg-[#002f6c] text-white'
                      : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
                  }`}
                >
                  {isAddedRecently ? (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Ajouté !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-red-100" />
                      <span>Ajouter</span>
                    </>
                  )}
                </button>

                {/* Quick View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProductForModal(product);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs border border-slate-300 hover:border-red-400 bg-white hover:bg-red-50 text-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Détails</span>
                </button>
              </div>

              {/* Secondary 1-click Express Purchase */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleQuickBuy}
                  className="w-full text-center py-1.5 text-[11px] font-bold text-slate-800 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition"
                >
                  ⚡ Commander en 1-Clic
                </button>
                <button
                  onClick={handleWhatsAppBuy}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition"
                  title="Commander sur WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
