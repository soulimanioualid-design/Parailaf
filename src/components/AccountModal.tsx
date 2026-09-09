import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Save,
  MessageCircle,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MOROCCAN_CITIES, BRAND_CONFIG } from '../data/config';

export const AccountModal: React.FC = () => {
  const { 
    currentUser, 
    isAdmin,
    isAdminSessionActive,
    isAccountModalOpen, 
    setIsAccountModalOpen, 
    logout, 
    updateProfile 
  } = useAuth();
  
  const { allOrders, setIsCartOpen, setIsAdminOpen, openAdmin } = useCart();
  const hasAdminAccess = isAdmin || isAdminSessionActive;

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  
  // Profile edit states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || MOROCCAN_CITIES[0].name);
  const [address, setAddress] = useState(currentUser?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setPhone(currentUser.phone);
      setCity(currentUser.city || MOROCCAN_CITIES[0].name);
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  if (!isAccountModalOpen || !currentUser) return null;

  // Filter orders related to this user
  const cleanPhone = currentUser.phone.replace(/\s+/g, '');
  const userOrders = allOrders.filter(o => 
    o.userId === currentUser.id ||
    (o.customer.email && currentUser.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (o.customer.phone && o.customer.phone.replace(/\s+/g, '') === cleanPhone)
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    await updateProfile({
      fullName,
      phone,
      city,
      address
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Confirmée
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Truck className="w-3 h-3 text-amber-600" />
            En cours de livraison
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Livrée
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Annulée
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-slate-500" />
            En attente de confirmation
          </span>
        );
    }
  };

  const initials = currentUser.fullName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CL';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAccountModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002f6c] to-slate-900 text-white p-5 sm:p-6 relative">
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
                {initials}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {currentUser.fullName}
                  </h2>
                  <span className={`${
                    currentUser.role === 'admin' 
                      ? 'bg-red-500/30 border-red-400/50 text-red-200' 
                      : 'bg-amber-400/20 border-amber-300/40 text-amber-300'
                  } border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                    {currentUser.role === 'admin' ? 'Administrateur' : 'Client Privilège'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {currentUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {currentUser.phone}
                  </span>
                </div>
                {hasAdminAccess && (
                  <button
                    onClick={() => {
                      setIsAccountModalOpen(false);
                      openAdmin('media');
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panneau d'Administration & Images</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-5 border-t border-white/10 pt-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-white text-[#002f6c] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Mes Commandes ({userOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-white text-[#002f6c] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Mes Informations</span>
              </button>

              <button
                onClick={logout}
                className="ml-auto px-3 py-2 rounded-xl text-xs font-bold text-red-200 hover:text-white hover:bg-red-600/30 transition flex items-center gap-1.5 cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-800 text-base">Aucune commande enregistrée</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Vos commandes passées avec votre compte apparaîtront ici avec leur suivi en direct.
                    </p>
                    <button
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#002f6c] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Parcourir les produits</span>
                    </button>
                  </div>
                ) : (
                  userOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-slate-50 hover:bg-slate-100/80 transition p-4 rounded-2xl border border-slate-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
                        <div>
                          <span className="text-xs font-extrabold text-slate-900">
                            Commande #{order.id}
                          </span>
                          <p className="text-[11px] text-slate-500">{order.createdAt}</p>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <span className="font-medium">
                              {item.quantity}x {item.product.name}
                            </span>
                            <span className="font-bold text-slate-900">
                              {item.product.price * item.quantity} DH
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total and destination */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.customer.city} — {order.customer.address}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 mr-2 text-[11px]">Total TTC:</span>
                          <span className="font-black text-slate-950 text-sm">{order.total} DH</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Paiement à la livraison
                        </span>
                        <a
                          href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(`Bonjour, je souhaite suivre l'état de ma commande #${order.id} au nom de ${order.customer.fullName}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Assistance WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Vos informations ont été mises à jour avec succès !</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email (identifiant)
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">L'email ne peut pas être modifié.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro de Téléphone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ville de livraison habituelle
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white"
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse complète de livraison
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Quartier, Rue, N° d'immeuble..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#002f6c] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
