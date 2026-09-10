import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Clock, 
  Droplet, 
  Smartphone, 
  Package, 
  Share2,
  Sparkles,
  Flame,
  Edit3
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../data/config';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    setSelectedProductForModal, 
    addToCart,
    setQuickBuyProduct,
    setIsCheckoutOpen,
    getProductImage,
    allProducts,
    openAdmin
  } = useCart();

  const { isAdmin, isAdminSessionActive } = useAuth();
  const hasAdminAccess = isAdmin || isAdminSessionActive;

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!selectedProductForModal) return null;

  // Always use the latest product state from allProducts
  const product = allProducts.find(p => p.id === selectedProductForModal.id) || selectedProductForModal;
  const mainImage = getProductImage ? getProductImage(product) : product.image;
  
  // Build distinct gallery
  const rawGallery = Array.isArray(product.gallery) ? product.gallery : [];
  const distinctSecondary = rawGallery.filter(img => img && img !== mainImage && img !== product.image);
  const images = [mainImage, ...distinctSecondary];
  const activeImage = images[activeImageIndex] || images[0] || mainImage;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuickBuy = () => {
    setQuickBuyProduct(product);
    setSelectedProductForModal(null);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const msg = `Bonjour Parailaf Maroc, je souhaite commander *${quantity}x ${product.name}* (Total: ${product.price * quantity} DH). Merci de me confirmer la livraison.`;
    const url = `https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedProductForModal(null)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative z-10">
        <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={() => setSelectedProductForModal(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left: Gallery Column */}
            <div className="md:col-span-6 bg-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
              <div>
                {/* Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {product.badge && (
                    <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wide flex items-center gap-1 shadow-sm">
                      <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      {product.badge}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> En stock
                  </span>

                  {hasAdminAccess && (
                    <button
                      onClick={() => {
                        setSelectedProductForModal(null);
                        openAdmin('products');
                      }}
                      className="ml-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      title="Modifier les photos, le titre ou la description"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Modifier (Admin)</span>
                    </button>
                  )}
                </div>

                {/* Main Large Image */}
                <div className="bg-white rounded-2xl p-2 sm:p-4 border border-slate-100 aspect-square flex items-center justify-center shadow-xs overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full max-h-96 object-contain transition-all duration-300 hover:scale-105"
                  />
                </div>

                {/* Thumbnail gallery */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 mt-4 justify-center">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl border-2 overflow-hidden p-1 bg-white transition cursor-pointer ${
                          activeImageIndex === idx ? 'border-red-600 shadow-sm' : 'border-slate-200 hover:border-slate-300 opacity-70'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick assurance in gallery column */}
              <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Livraison 24h-48h Maroc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#002f6c] shrink-0" />
                  <span>Produit 100% Original Scellé</span>
                </div>
              </div>
            </div>

            {/* Right: Details & Purchase Actions */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Brand & Rating */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#002f6c] uppercase tracking-wider">
                    {product.brand} • {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400 text-[11px]">({product.reviewsCount} avis)</span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-heading">
                  {product.name}
                </h2>

                {/* Price block */}
                <div className="mt-3 p-3.5 bg-red-50/60 rounded-xl border border-red-200/80 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-red-600 font-heading">
                        {product.price * quantity} <span className="text-base font-bold text-[#002f6c]">DH</span>
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {product.originalPrice * quantity} DH
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <p className="text-xs font-bold text-amber-700">
                        Économie : {(product.originalPrice - product.price) * quantity} DH
                      </p>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                    Paiement Espèce
                  </span>
                </div>

                {/* Full Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                  {product.fullDescription}
                </p>

                {/* Technical Specs List */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wide mb-2">
                    Caractéristiques clés :
                  </p>
                  {product.specs.duration && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Durée d'utilisation :</span>
                      <span className="font-bold text-slate-900">{product.specs.duration}</span>
                    </div>
                  )}
                  {product.specs.waterproof && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Étanchéité :</span>
                      <span className="font-bold text-slate-900">{product.specs.waterproof}</span>
                    </div>
                  )}
                  {product.specs.bloodSample && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Prélèvement :</span>
                      <span className="font-bold text-slate-900">{product.specs.bloodSample}</span>
                    </div>
                  )}
                  {product.specs.appCompatibility && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Compatibilité :</span>
                      <span className="font-bold text-red-600">{product.specs.appCompatibility}</span>
                    </div>
                  )}
                </div>

                {/* Box contents */}
                {product.boxContents && product.boxContents.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-xs">
                    <p className="font-bold text-[#002f6c] mb-1.5 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-red-600" />
                      Contenu du pack :
                    </p>
                    <ul className="space-y-1 text-slate-700 font-medium">
                      {product.boxContents.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Quantity + Add to cart + 1-click WhatsApp */}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-[#002f6c] text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>Ajouté au panier !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-red-100" />
                        <span>Ajouter au panier</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 1-Click Express Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleQuickBuy}
                    className="py-2.5 px-3 bg-[#002f6c] hover:bg-[#001f4d] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    ⚡ Commander en 1-Clic
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp Express</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
