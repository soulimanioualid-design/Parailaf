import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Truck, 
  ShieldCheck, 
  Banknote, 
  MessageCircle, 
  ShoppingBag, 
  Clock, 
  Phone, 
  Mail,
  ArrowLeft,
  Sparkles,
  PackageCheck,
  BellRing
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MOROCCAN_CITIES, BRAND_CONFIG } from '../data/config';
import { OrderCustomerInfo } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    quickBuyProduct, 
    setQuickBuyProduct,
    subtotal, 
    shippingFee, 
    isFreeShipping, 
    totalAmount,
    createOrder,
    lastOrder
  } = useCart();

  const { currentUser, openAuthModal } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0].name);
  const [address, setAddress] = useState('');
  const [paymentMethod] = useState<'cod'>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Auto-fill from authenticated profile
  React.useEffect(() => {
    if (isCheckoutOpen && currentUser) {
      if (currentUser.fullName) setFullName(currentUser.fullName);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [isCheckoutOpen, currentUser]);

  if (!isCheckoutOpen) return null;

  const itemsToCheckout = quickBuyProduct 
    ? [{ product: quickBuyProduct, quantity: 1 }] 
    : cart;

  const checkoutSubtotal = quickBuyProduct 
    ? quickBuyProduct.price 
    : subtotal;

  const checkoutShipping = itemsToCheckout.length === 0 ? 0 : 40; // Frais fixe 40 DH partout au Maroc
  const checkoutTotal = checkoutSubtotal + checkoutShipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Veuillez renseigner votre nom, numéro de téléphone et adresse de livraison au Maroc.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const customerInfo: OrderCustomerInfo = {
        fullName,
        phone,
        city,
        address,
        paymentMethod
      };
      
      if (email.trim()) {
        customerInfo.email = email.trim();
      }
      if (notes.trim()) {
        customerInfo.notes = notes.trim();
      }

      const source = quickBuyProduct ? 'Achat Express 1-Clic' : 'Panier';
      const newOrder = createOrder(customerInfo, source, currentUser?.id || null);
      setConfirmedOrder(newOrder);
      setOrderCompleted(true);
      setIsSubmitting(false);
    }, 600);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderCompleted(false);
    setQuickBuyProduct(null);
  };

  const handleWhatsAppShareOrder = () => {
    if (!confirmedOrder) return;
    const itemsList = confirmedOrder.items.map((i: any) => `- ${i.quantity}x ${i.product.name} (${i.product.price * i.quantity} DH)`).join('\n');
    const msg = `*CONFIRMATION DE COMMANDE #${confirmedOrder.id}*\n\n` +
      `👤 *Client :* ${confirmedOrder.customer.fullName}\n` +
      `📞 *Tél :* ${confirmedOrder.customer.phone}\n` +
      `📍 *Ville :* ${confirmedOrder.customer.city}\n` +
      `🏠 *Adresse :* ${confirmedOrder.customer.address}\n\n` +
      `*Articles :*\n${itemsList}\n\n` +
      `*Total à régler :* ${confirmedOrder.total} DH (Paiement à la livraison)\n\n` +
      `Merci de confirmer la prise en charge de ma livraison Parailaf.`;

    const url = `https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative z-10">
        <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#001f3f] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base sm:text-lg font-heading">
                  {orderCompleted ? 'Commande Enregistrée avec Succès !' : (quickBuyProduct ? 'Commande Express en 1-Clic' : 'Finalisation de votre Commande')}
                </h3>
                <p className="text-xs text-amber-300">
                  {orderCompleted ? 'Notification email transmise à l\'équipe de préparation' : 'Livraison express partout au Maroc sous 24h - 48h'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen when order is placed */}
          {orderCompleted && confirmedOrder ? (
            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  Numéro de Commande : #{confirmedOrder.id}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 font-heading">
                  Merci pour votre commande, {confirmedOrder.customer.fullName} !
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
                  Votre commande est enregistrée dans notre système. Un email de notification a été envoyé à l'équipe commerciale et notre livreur vous contactera au <strong className="text-slate-900">{confirmedOrder.customer.phone}</strong>.
                </p>
              </div>

              {/* Notification Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                <BellRing className="w-4 h-4 text-blue-600 animate-bounce" />
                <span>Alerte email envoyée automatiquement à l'administrateur</span>
              </div>

              {/* Order Recap Box */}
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Ville de livraison :</span>
                  <span className="font-bold text-slate-900">{confirmedOrder.customer.city}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Sous-total articles :</span>
                  <span className="font-bold text-slate-900">{confirmedOrder.subtotal} DH</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Frais de livraison :</span>
                  <span className="font-bold text-slate-900">{confirmedOrder.shippingFee} DH</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Mode de paiement :</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" />
                    Paiement en espèces à la livraison
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Total à régler au livreur :</span>
                  <span className="font-black text-lg text-red-600 font-heading">{confirmedOrder.total} DH</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleWhatsAppShareOrder}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Transmettre sur WhatsApp (Optionnel)</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5">
              
              {/* Order Summary Bar */}
              <div className="p-3.5 bg-red-50/80 rounded-xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-600">Articles ({itemsToCheckout.length}) : </span>
                  <strong className="text-slate-900 font-bold">{checkoutSubtotal} DH</strong>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-600">Livraison : </span>
                  <strong className="text-red-700 font-bold">40 DH</strong>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <span className="text-slate-600 font-medium">Total à régler : </span>
                  <strong className="text-red-600 font-black text-base font-heading">{checkoutTotal} DH</strong>
                </div>
              </div>

              {/* User Account / Pre-fill Status Banner */}
              {currentUser ? (
                <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Connecté : {currentUser.fullName}
                  </span>
                  <span className="text-[10px] font-extrabold bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-md">
                    Coordonnées pré-remplies
                  </span>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
                  <span className="text-slate-600">Déjà client Parailaf ?</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-bold text-[#002f6c] hover:underline cursor-pointer"
                  >
                    Se connecter pour pré-remplir
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-xs font-black text-[#002f6c] uppercase tracking-wider">
                  Informations de Livraison au Maroc
                </p>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom et Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Mohamed Alami"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro de Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold">
                      🇲🇦 +212
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 XX XX XX XX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Le livreur vous appellera sur ce numéro avant d'arriver.</p>
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Adresse Email (Optionnel - pour recevoir votre reçu)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: client@gmail.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                </div>

                {/* City dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville de Livraison <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.deliveryTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse Complète de Livraison <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, Rue, N° Immeuble / Villa, Étage ou Point de repère..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                </div>

                {/* Payment Selection - Paiement à la livraison exclusif */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mode de Règlement
                  </label>
                  
                  <div className="p-3 rounded-xl border border-red-500 bg-red-50/50 shadow-xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <span>Paiement en espèces à la livraison</span>
                        <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">Sans risque</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Vous réglez directement au livreur après réception de votre colis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Instructions pour le livreur (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Livrer après 14h / Sonner à l'interphone..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-red-400/30"
                >
                  {isSubmitting ? (
                    <span>Traitement et enregistrement de votre commande...</span>
                  ) : (
                    <>
                      <span>Confirmer ma commande ({checkoutTotal} DH)</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enregistrement sécurisé avec notification instantanée</span>
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
