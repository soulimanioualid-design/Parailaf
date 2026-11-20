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
  ShieldCheck,
  Key,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MOROCCAN_CITIES, BRAND_CONFIG } from '../data/config';
import { useLanguage } from '../context/LanguageContext';

export const AccountModal: React.FC = () => {
  const { 
    currentUser, 
    isAdmin,
    isStaff,
    userRole,
    roleConfig,
    isAdminSessionActive, 
    isAccountModalOpen, 
    setIsAccountModalOpen, 
    logout, 
    updateProfile,
    getDefaultTabForUser,
    canAccessTab,
    promoteCurrentAccount,
    isPrimaryAdmin
  } = useAuth();
  
  const { allOrders, setIsCartOpen, openAdmin } = useCart();
  const { language, isRTL, translateProduct } = useLanguage();
  const hasStaffOrAdminAccess = isStaff || isAdminSessionActive;

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  
  // Profile edit states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || MOROCCAN_CITIES[0].name);
  const [address, setAddress] = useState(currentUser?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Staff promotion state for normal customer accounts
  const [showPromoteBox, setShowPromoteBox] = useState(!hasStaffOrAdminAccess && isPrimaryAdmin(currentUser));
  const [promotePin, setPromotePin] = useState('');
  const [promoteRole, setPromoteRole] = useState<'admin' | 'manager' | 'employee' | 'delivery'>('admin');
  const [promoteError, setPromoteError] = useState<string | null>(null);
  const [promoteSuccessMsg, setPromoteSuccessMsg] = useState<string | null>(null);

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoteError(null);
    setPromoteSuccessMsg(null);

    const res = promoteCurrentAccount(promotePin, promoteRole);
    if (res.success) {
      setPromoteSuccessMsg(
        language === 'ar' 
          ? 'تم تفعيل الصلاحيات بنجاح! يمكنك الآن الدخول للوحة التحكم.' 
          : 'Privilèges activés avec succès ! Vous avez maintenant accès au tableau de bord.'
      );
    } else {
      setPromoteError(res.error || 'Code PIN invalide.');
    }
  };

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
            {language === 'ar' ? 'مؤكدة' : 'Confirmée'}
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Truck className="w-3 h-3 text-amber-600" />
            {language === 'ar' ? 'قيد التوصيل' : 'En cours de livraison'}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {language === 'ar' ? 'تم التوصيل' : 'Livrée'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-red-600" />
            {language === 'ar' ? 'ملغاة' : 'Annulée'}
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-slate-500" />
            {language === 'ar' ? 'في انتظار التأكيد' : 'En attente de confirmation'}
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
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
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
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer`}
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
                  {(() => {
                    const role = currentUser.role || 'customer';
                    if (role === 'admin') {
                      return (
                        <span className="bg-red-500/30 border-red-400/50 text-red-200 border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          👑 {language === 'ar' ? 'مدير المتجر' : 'Administrateur'}
                        </span>
                      );
                    }
                    if (role === 'manager') {
                      return (
                        <span className="bg-indigo-500/30 border-indigo-400/50 text-indigo-200 border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          🏢 {language === 'ar' ? 'مسير المتجر' : 'Gérant Magasin'}
                        </span>
                      );
                    }
                    if (role === 'delivery') {
                      return (
                        <span className="bg-amber-500/30 border-amber-400/50 text-amber-200 border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          🚚 {language === 'ar' ? 'مسؤول التوصيل' : 'Livreur Express'}
                        </span>
                      );
                    }
                    if (role === 'employee') {
                      return (
                        <span className="bg-emerald-500/30 border-emerald-400/50 text-emerald-200 border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          📦 {language === 'ar' ? 'موظف المنتجات' : 'Employé Catalogue'}
                        </span>
                      );
                    }
                    return (
                      <span className="bg-amber-400/20 border-amber-300/40 text-amber-300 border text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {language === 'ar' ? 'زبون مميز' : 'Client Privilège'}
                      </span>
                    );
                  })()}
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
                {hasStaffOrAdminAccess ? (
                  <button
                    onClick={() => {
                      setIsAccountModalOpen(false);
                      openAdmin(getDefaultTabForUser());
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {currentUser.role === 'delivery' 
                        ? (language === 'ar' ? 'فضاء التوصيل والطلبيات' : 'Espace Livraisons & Colis')
                        : currentUser.role === 'employee'
                        ? (language === 'ar' ? 'فضاء المنتجات والمخزون' : 'Espace Produits & Catalogue')
                        : (language === 'ar' ? 'لوحة الإدارة والتحكم' : "Tableau de Bord & Gestion")}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPromoteBox(!showPromoteBox)}
                    className="mt-2.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>
                      {isPrimaryAdmin(currentUser) 
                        ? (language === 'ar' ? '👑 تفعيل صلاحيات المدير العام' : '👑 Activer mon accès Administrateur') 
                        : (language === 'ar' ? 'فضاء الموظفين والإدارة' : 'Activer accès Staff / Admin')}
                    </span>
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
                <span>
                  {language === 'ar' ? `طلبياتي (${userOrders.length})` : `Mes Commandes (${userOrders.length})`}
                </span>
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
                <span>{language === 'ar' ? 'معلوماتي الشخصية' : 'Mes Informations'}</span>
              </button>

              <button
                onClick={logout}
                className={`${isRTL ? 'mr-auto' : 'ml-auto'} px-3 py-2 rounded-xl text-xs font-bold text-red-200 hover:text-white hover:bg-red-600/30 transition flex items-center gap-1.5 cursor-pointer`}
                title={language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Déconnexion'}</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">

            {/* Staff Promotion Card */}
            {(!hasStaffOrAdminAccess || showPromoteBox) && (
              <div className="mb-5 bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-300 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-amber-950 text-sm">
                        {language === 'ar' ? 'فضاء الموظفين والإدارة' : "Activation de l'Espace Staff & Administration"}
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        {language === 'ar'
                          ? 'إذا كان هذا الحساب يخص موظفاً، موزّعاً، مسيّراً أو المدير العام، فعّل صلاحياتك هنا :'
                          : 'Votre compte est enregistré en mode Client. Activez vos droits Administrateur ou Employé ici :'}
                      </p>
                    </div>
                  </div>
                  {hasStaffOrAdminAccess && (
                    <button
                      onClick={() => setShowPromoteBox(false)}
                      className="text-amber-700 hover:text-amber-900 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {promoteSuccessMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{promoteSuccessMsg}</span>
                  </div>
                )}

                {promoteError && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-900 rounded-xl font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    <span>{promoteError}</span>
                  </div>
                )}

                {/* 1-Click for Primary Admin */}
                {isPrimaryAdmin(currentUser) && (
                  <div className="bg-amber-200/80 border border-amber-400 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-amber-950">👑 Compte Administrateur Principal Reconnu</p>
                      <p className="text-[11px] text-amber-900">Email : {currentUser?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const res = promoteCurrentAccount('1234', 'admin');
                        if (res.success) {
                          setPromoteSuccessMsg('👑 Accès Administrateur Principal activé avec succès !');
                          setPromoteError(null);
                        } else {
                          setPromoteError(res.error || 'Erreur');
                        }
                      }}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Activer mes droits Administrateur (1 Clic)</span>
                    </button>
                  </div>
                )}

                {/* Role and PIN Form for Staff Members */}
                <form onSubmit={handlePromoteSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      {language === 'ar' ? 'اختر الدور :' : 'Rôle à activer :'}
                    </label>
                    <select
                      value={promoteRole}
                      onChange={(e) => setPromoteRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="admin">👑 Administrateur (Accès total)</option>
                      <option value="manager">🏢 Gérant Magasin</option>
                      <option value="employee">📦 Employé Produits & Catalogue</option>
                      <option value="delivery">🚚 Livreur Express (Commandes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      {language === 'ar' ? 'رمز أمان الإدارة (PIN) :' : 'Code PIN de Sécurité :'}
                    </label>
                    <input
                      type="password"
                      value={promotePin}
                      onChange={(e) => setPromotePin(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#002f6c] hover:bg-[#002244] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تفعيل الدور الآن' : 'Activer ce rôle'}</span>
                    </button>
                  </div>
                </form>

                {hasStaffOrAdminAccess && (
                  <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Rôle actif : <strong className="uppercase">{userRole}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        openAdmin(getDefaultTabForUser());
                      }}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>Ouvrir le Tableau de Bord</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-800 text-base">
                      {language === 'ar' ? 'لا توجد أي طلبية مسجلة' : 'Aucune commande enregistrée'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      {language === 'ar'
                        ? 'الطلبيات التي تقوم بطلبها عبر حسابك ستظهر هنا مع تتبع حالتها مباشرة.'
                        : 'Vos commandes passées avec votre compte apparaîtront ici avec leur suivi en direct.'}
                    </p>
                    <button
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#002f6c] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تصفح المنتجات والطلب' : 'Parcourir les produits'}</span>
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
                            {language === 'ar' ? `طلب رقم #${order.id}` : `Commande #${order.id}`}
                          </span>
                          <p className="text-[11px] text-slate-500">{order.createdAt}</p>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, idx) => {
                          const translated = translateProduct(item.product);
                          return (
                            <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                              <span className="font-medium">
                                {item.quantity}x {translated.name}
                              </span>
                              <span className="font-bold text-slate-900">
                                {item.product.price * item.quantity} {language === 'ar' ? 'درهم' : 'DH'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total and destination */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.customer.city} — {order.customer.address}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 mx-2 text-[11px]">
                            {language === 'ar' ? 'المجموع شامل التوصيل:' : 'Total TTC:'}
                          </span>
                          <span className="font-black text-slate-950 text-sm">{order.total} {language === 'ar' ? 'درهم' : 'DH'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
                        </span>
                        <a
                          href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(
                            language === 'ar'
                              ? `مرحباً، أود الاستفسار عن حالة طلبي رقم #${order.id} باسم ${order.customer.fullName}.`
                              : `Bonjour, je souhaite suivre l'état de ma commande #${order.id} au nom de ${order.customer.fullName}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'خدمة الزبناء عبر واتساب' : 'Assistance WhatsApp'}</span>
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
                    <span>
                      {language === 'ar' ? 'تم تحديث معلوماتكم بنجاح!' : 'Vos informations ont été mises à jour avec succès !'}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'الاسم والنسب' : 'Nom & Prénom'}
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
                      {language === 'ar' ? 'البريد الإلكتروني (المعرّف)' : 'Email (identifiant)'}
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {language === 'ar' ? 'لا يمكن تعديل البريد الإلكتروني.' : "L'email ne peut pas être modifié."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'رقم الهاتف (واتساب)' : 'Numéro de Téléphone (WhatsApp)'}
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
                      {language === 'ar' ? 'مدينة التوصيل المعتادة' : 'Ville de livraison habituelle'}
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white"
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {language === 'ar' && c.nameAr ? c.nameAr : c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'العنوان الكامل للتوصيل' : 'Adresse complète de livraison'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={language === 'ar' ? 'الحي، الشارع، رقم العمارة أو الشقة...' : "Quartier, Rue, N° d'immeuble..."}
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
                    <span>
                      {isSaving 
                        ? (language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...') 
                        : (language === 'ar' ? 'حفظ التغييرات' : 'Enregistrer les modifications')}
                    </span>
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
