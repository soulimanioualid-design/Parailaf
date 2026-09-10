import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  Mail, 
  Lock, 
  Unlock, 
  Settings, 
  BarChart3, 
  Package, 
  RefreshCw, 
  Eye, 
  BellRing,
  Send,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  Key,
  LogIn,
  Image as ImageIcon,
  Users
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Order, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { MOROCCAN_CITIES, BRAND_CONFIG } from '../data/config';
import { 
  getAdminEmailSettings, 
  saveAdminEmailSettings, 
  AdminEmailSettings, 
  sendOrderEmailNotification,
  formatOrderEmailContent
} from '../utils/notificationService';
import { AdminMediaManager } from './AdminMediaManager';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    adminActiveTab: activeTab,
    setAdminActiveTab: setActiveTab,
    allOrders, 
    updateOrderStatus, 
    deleteOrder, 
    addManualOrder,
    showToast,
    scrollToSection
  } = useCart();

  const { 
    currentUser, 
    isAdmin, 
    isAdminSessionActive, 
    verifyAdminAccess, 
    lockAdminSession 
  } = useAuth();

  const isAuthorized = isAdmin || isAdminSessionActive;

  // Gatekeeper Authentication State
  const [authMethod, setAuthMethod] = useState<'passcode' | 'credentials'>('passcode');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState(
    currentUser?.email && currentUser.role === 'admin'
      ? currentUser.email
      : ''
  );
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Orders Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Email Notification Settings State
  const [emailSettings, setEmailSettings] = useState<AdminEmailSettings>(getAdminEmailSettings);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [emailLogs, setEmailLogs] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('parailaf_email_logs') || '[]');
    } catch {
      return [];
    }
  });

  // Manual Order Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCity, setManualCity] = useState(MOROCCAN_CITIES[0].name);
  const [manualAddress, setManualAddress] = useState('');
  const [manualProductId, setManualProductId] = useState(PRODUCTS[0].id);
  const { allUsers, createEmployee, updateUserRole, deleteUser } = useAuth();
  
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('employee');
  const [newEmpPassword, setNewEmpPassword] = useState('');

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim() || !newEmpPassword.trim()) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const res = await createEmployee({
      fullName: newEmpName,
      email: newEmpEmail,
      phone: newEmpPhone,
      role: newEmpRole,
      password: newEmpPassword
    });
    if (res.success) {
      showToast('Employé ajouté avec succès.');
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpPhone('');
      setNewEmpPassword('');
    } else {
      showToast(res.error || 'Erreur lors de la création.');
    }
  };

  if (!isAdminOpen) return null;

  // Handle Passcode verification
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) {
      setAuthError('Veuillez saisir le code de sécurité administrateur.');
      return;
    }
    setIsVerifying(true);
    setAuthError(null);
    const res = await verifyAdminAccess(passcodeInput.trim());
    setIsVerifying(false);
    if (!res.success) {
      setAuthError(res.error || "Accès refusé : Seul l'administrateur est autorisé.");
    } else {
      showToast("✓ Authentification administrateur réussie");
    }
  };

  // Handle Credentials verification
  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmailInput.trim() || !adminPasswordInput.trim()) {
      setAuthError('Veuillez renseigner votre email et mot de passe administrateur.');
      return;
    }
    setIsVerifying(true);
    setAuthError(null);
    const res = await verifyAdminAccess(adminPasswordInput.trim(), adminEmailInput.trim());
    setIsVerifying(false);
    if (!res.success) {
      setAuthError(res.error || "Identifiants administrateur incorrects.");
    } else {
      showToast("✓ Bienvenue dans le Tableau de Bord Administrateur");
    }
  };

  // Render Gatekeeper if not authenticated
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#002f6c] to-[#001f4d] text-white p-5 flex items-center justify-between border-b border-blue-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black font-heading tracking-tight">
                  Accès Restreint Administrateur
                </h3>
                <p className="text-xs text-blue-200">
                  Parailaf Maroc • Espace de Gestion
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Gate Content */}
          <div className="p-6 space-y-5">
            {/* Warning Shield Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-extrabold text-amber-950">
                  Espace Réservé Exclusivement à l'Administrateur
                </p>
                <p className="text-amber-800 leading-relaxed">
                  L'accès à la gestion des commandes, aux données clients et aux bannières est strictement protégé et réservé à l'administrateur autorisé.
                </p>
              </div>
            </div>

            {/* If logged in as customer */}
            {currentUser && currentUser.role !== 'admin' && (
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Session actuelle</span>
                  <span className="font-bold text-slate-800">{currentUser.fullName}</span> (Client)
                </div>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                  Non Admin
                </span>
              </div>
            )}

            {/* Method selection tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthMethod('passcode'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  authMethod === 'passcode'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Code PIN Secret</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('credentials'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  authMethod === 'credentials'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Identifiants Admin</span>
              </button>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="font-semibold">{authError}</p>
              </div>
            )}

            {/* Passcode Form */}
            {authMethod === 'passcode' && (
              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Code de Sécurité Administrateur
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      placeholder="Saisissez le code PIN administrateur..."
                      autoFocus
                      className="w-full px-4 py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Accès strictement réservé à la direction Parailaf Maroc.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Vérification...' : 'Déverrouiller le Tableau de Bord'}</span>
                </button>
              </form>
            )}

            {/* Credentials Form */}
            {authMethod === 'credentials' && (
              <form onSubmit={handleVerifyCredentials} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Administrateur
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="admin@exemple.com"
                      className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mot de passe Administrateur
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#002f6c] hover:bg-[#001f4d] text-white font-extrabold text-sm rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isVerifying ? 'Connexion en cours...' : "Se Connecter à l'Espace Admin"}</span>
                </button>
              </form>
            )}

            {/* Back Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                ← Retourner à la boutique
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      order.customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(i => i.product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrdersCount = allOrders.filter(o => o.status === 'pending').length;
  const confirmedOrdersCount = allOrders.filter(o => o.status === 'confirmed').length;
  const deliveredOrdersCount = allOrders.filter(o => o.status === 'delivered').length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID Commande", "Date", "Statut", "Origine", "Nom Client", "Téléphone", "Ville", "Adresse", "Articles", "Total (DH)"];
    const rows = allOrders.map(o => [
      `"${o.id}"`,
      `"${o.createdAt}"`,
      `"${o.status}"`,
      `"${o.source || 'Site'}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.city}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.items.map(i => `${i.quantity}x ${i.product.name}`).join(' | ').replace(/"/g, '""')}"`,
      o.total
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `commandes_parailaf_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Fichier CSV des commandes exporté avec succès !");
  };

  // Save Email settings
  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminEmailSettings(emailSettings);
    showToast("✓ Paramètres de notification email sauvegardés !");
  };

  // Test Email Notification
  const handleSendTestEmail = async () => {
    setTestEmailStatus("Envoi en cours...");
    if (allOrders.length > 0) {
      const sampleOrder = allOrders[0];
      const result = await sendOrderEmailNotification(sampleOrder);
      setTestEmailStatus(result.message);
      try {
        setEmailLogs(JSON.parse(localStorage.getItem('parailaf_email_logs') || '[]'));
      } catch {
        // ignore
      }
    } else {
      setTestEmailStatus(`Notification simulée envoyée à ${emailSettings.adminEmail}`);
    }
  };

  // Create Manual Order
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const product = PRODUCTS.find(p => p.id === manualProductId) || PRODUCTS[0];
    const subtotal = product.price * manualQuantity;
    const shipping = 40; // Frais fixe 40 DH partout au Maroc quel que soit le montant
    
    const newOrder: Order = {
      id: `DC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: `Aujourd'hui à ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      customer: {
        fullName: manualName,
        phone: manualPhone,
        city: manualCity,
        address: manualAddress,
        paymentMethod: 'cod',
        notes: manualNotes
      },
      items: [{ product, quantity: manualQuantity }],
      subtotal,
      shippingFee: shipping,
      discountTotal: 0,
      total: subtotal + shipping,
      status: 'confirmed',
      source: 'Manuel (Téléphone)',
      emailNotified: true
    };

    addManualOrder(newOrder);
    sendOrderEmailNotification(newOrder);

    // Reset form
    setManualName('');
    setManualPhone('');
    setManualAddress('');
    setManualNotes('');
    setActiveTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex overflow-hidden font-sans animate-in fade-in duration-200">
      
      {/* SIDEBAR (Desktop) */}
      <div className="w-64 bg-[#002f6c] text-white flex-shrink-0 hidden md:flex flex-col shadow-xl z-20 h-screen relative">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-[#002f6c]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-white">Parailaf Admin</h1>
              <p className="text-[10px] text-blue-300 font-medium uppercase tracking-wider mt-1">Espace de gestion</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-[10px] font-bold text-blue-300/70 uppercase tracking-widest mb-3 px-3">Menu Principal</div>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span>Commandes</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'orders' ? 'bg-white text-red-600' : 'bg-red-500 text-white animate-pulse'}`}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Statistiques & Villes</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'media'
                ? 'bg-amber-400 text-[#002f6c] shadow-md'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5" />
              <span>Gestion des Images</span>
            </div>
          </button>

          <div className="text-[10px] font-bold text-blue-300/70 uppercase tracking-widest mt-8 mb-3 px-3">Outils & Paramètres</div>

          <button
            onClick={() => setActiveTab('new-order')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'new-order'
                ? 'bg-white/20 text-white shadow-md'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Créer une commande</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-white/20 text-white shadow-md'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span>Notifications Email</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-white/20 text-white shadow-md'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Gestion des Employés</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              {currentUser?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser?.fullName || 'Administrateur'}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Session sécurisée</p>
            </div>
          </div>
          <button
            onClick={() => {
              lockAdminSession();
              showToast("✓ Session administrateur verrouillée.");
            }}
            className="w-full py-2.5 px-4 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Verrouiller</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex md:hidden items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#002f6c] to-[#004080] rounded-lg flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">Admin</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight capitalize">
              {activeTab === 'orders' && 'Gestion des Commandes'}
              {activeTab === 'analytics' && 'Statistiques & Villes'}
              {activeTab === 'media' && 'Gestionnaire de Médias'}
              {activeTab === 'new-order' && 'Nouvelle Commande Manuelle'}
              {activeTab === 'email' && 'Configuration Notifications'}
              {activeTab === 'employees' && 'Gestion des Employés'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'orders' && (
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer border border-slate-200"
                title="Exporter les commandes en Excel/CSV"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Exporter CSV</span>
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Quitter Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden bg-white border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 font-bold text-xs whitespace-nowrap border-b-2 transition-colors ${activeTab === 'orders' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}
          >
            Commandes
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 font-bold text-xs whitespace-nowrap border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3 px-4 font-bold text-xs whitespace-nowrap border-b-2 transition-colors ${activeTab === 'media' ? 'border-amber-400 text-amber-600' : 'border-transparent text-slate-500'}`}
          >
            Médias
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 px-4 font-bold text-xs whitespace-nowrap border-b-2 transition-colors ${activeTab === 'email' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}
          >
            Email
          </button>
        </div>

        {/* Dashboard Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: ALL ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Commandes</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">{allOrders.length}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">Reçues</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
                  <span className="text-xs text-amber-900 font-bold uppercase tracking-wider">En Attente (À Traiter)</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 font-heading">{pendingOrdersCount}</span>
                    <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded animate-pulse">Action</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
                  <span className="text-xs text-emerald-900 font-bold uppercase tracking-wider">Confirmées & Livrées</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">{confirmedOrdersCount + deliveredOrdersCount}</span>
                    <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">En cours</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/30 shadow-xs">
                  <span className="text-xs text-red-900 font-bold uppercase tracking-wider">Chiffre d'Affaires</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-red-600 font-heading">{totalRevenue} DH</span>
                    <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">COD Maroc</span>
                  </div>
                </div>

              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher nom, téléphone, ville, #ID..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {[
                    { id: 'all', label: 'Toutes' },
                    { id: 'pending', label: 'En attente' },
                    { id: 'confirmed', label: 'Confirmées' },
                    { id: 'shipping', label: 'Expédiées' },
                    { id: 'delivered', label: 'Livrées' },
                    { id: 'cancelled', label: 'Annulées' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        statusFilter === tab.id
                          ? 'bg-[#002f6c] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Orders Table / Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Aucune commande trouvée</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchTerm ? "Aucun résultat ne correspond à votre recherche." : "Les prochaines commandes passées sur le site ou en 1-clic apparaîtront automatiquement ici."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map(order => {
                    const statusColors = {
                      pending: 'bg-amber-100 text-amber-800 border-amber-300',
                      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                      shipping: 'bg-purple-100 text-purple-800 border-purple-300',
                      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      cancelled: 'bg-red-100 text-red-800 border-red-300'
                    }[order.status] || 'bg-slate-100 text-slate-800 border-slate-300';

                    const statusLabels = {
                      pending: 'En attente',
                      confirmed: 'Confirmée',
                      shipping: 'En livraison',
                      delivered: 'Livrée',
                      cancelled: 'Annulée'
                    }[order.status] || order.status;

                    return (
                      <div 
                        key={order.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition space-y-4"
                      >
                        {/* Card Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-black text-sm text-[#002f6c] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                              #{order.id}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {order.createdAt}
                            </span>
                            {order.source && (
                              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                                {order.source}
                              </span>
                            )}
                            {order.emailNotified && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                Email Notifié
                              </span>
                            )}
                          </div>

                          {/* Status Dropdown */}
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className={`text-xs font-black px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${statusColors}`}
                            >
                              <option value="pending">⏳ En attente</option>
                              <option value="confirmed">✓ Confirmée</option>
                              <option value="shipping">🚚 En livraison</option>
                              <option value="delivered">🎉 Livrée</option>
                              <option value="cancelled">✕ Annulée</option>
                            </select>
                          </div>

                        </div>

                        {/* Customer & Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          
                          {/* Client Information */}
                          <div className="md:col-span-5 space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{order.customer.fullName}</span>
                              <span className="text-[11px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                                📍 {order.customer.city}
                              </span>
                            </div>

                            <p className="text-slate-600 flex items-start gap-1.5">
                              <span className="font-semibold text-slate-400 shrink-0">Adresse :</span>
                              <span>{order.customer.address}</span>
                            </p>

                            {order.customer.notes && (
                              <p className="text-amber-800 bg-amber-50 p-2 rounded-lg text-[11px] border border-amber-200">
                                <strong>Note client :</strong> {order.customer.notes}
                              </p>
                            )}

                            {/* Direct Communication Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <a
                                href={`tel:${order.customer.phone}`}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <Phone className="w-3.5 h-3.5 text-blue-600" />
                                <span>{order.customer.phone}</span>
                              </a>

                              <a
                                href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${order.customer.fullName}, nous vous contactons depuis Parailaf concernant votre commande #${order.id}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="md:col-span-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Articles ({order.items.length})</span>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                  <span className="text-slate-800 font-medium line-clamp-1">
                                    <strong className="text-red-600 font-bold">{item.quantity}x</strong> {item.product.name}
                                  </span>
                                  <span className="font-bold text-slate-900 shrink-0 ml-2">
                                    {item.product.price * item.quantity} DH
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Financial Total & Actions */}
                          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                            <div className="text-left md:text-right">
                              <span className="text-xs text-slate-400 font-medium">Total à encaisser :</span>
                              <div className="text-xl font-black text-red-600 font-heading">
                                {order.total} DH
                              </div>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                Paiement à la livraison
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-3 w-full md:w-auto justify-end">
                              <button
                                onClick={() => setSelectedOrderForPrint(order)}
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                                title="Imprimer le bon de livraison"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Voulez-vous vraiment supprimer la commande #${order.id} ?`)) {
                                    deleteOrder(order.id);
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
                                title="Supprimer la commande"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: EMAIL NOTIFICATIONS SETTINGS */}
          {activeTab === 'email' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-heading">
                      Configuration des Alertes par Email
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Chaque fois qu'un client valide une commande sur le site ou en 1-clic, une notification complète contenant ses coordonnées et son panier est générée et envoyée.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveEmailSettings} className="space-y-4 pt-2">
                  
                  {/* Email recipient input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse Email Destinataire des Commandes <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailSettings.adminEmail}
                        onChange={(e) => setEmailSettings({ ...emailSettings, adminEmail: e.target.value })}
                        placeholder="soulimani.oualid@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      C'est l'adresse sur laquelle vous recevrez le récapitulatif complet de chaque commande.
                    </p>
                  </div>

                  {/* Formspree ID / Free Email Service Endpoint */}
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-blue-900">
                        Intégration d'Envoi Direct Formspree / Webhook (Optionnel)
                      </label>
                      <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">
                        Envoi Automatique
                      </span>
                    </div>
                    <input
                      type="text"
                      value={emailSettings.formspreeId || ''}
                      onChange={(e) => setEmailSettings({ ...emailSettings, formspreeId: e.target.value })}
                      placeholder="Ex: xpznkqqe ou https://formspree.io/f/monform"
                      className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      💡 Pour que les emails arrivent automatiquement dans votre boîte Gmail sans action manuelle, vous pouvez créer un compte gratuit sur <strong>formspree.io</strong> ou configurer un webhook et coller votre ID de formulaire ici.
                    </p>
                  </div>

                  {/* Toggle activation */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Activer les notifications automatiques par email
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Enregistre chaque commande et prépare le rapport instantané.
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={emailSettings.enableEmailAlerts}
                      onChange={(e) => setEmailSettings({ ...emailSettings, enableEmailAlerts: e.target.checked })}
                      className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                    >
                      Enregistrer les Paramètres
                    </button>

                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Tester l'Envoi d'un Email</span>
                    </button>
                  </div>

                  {testEmailStatus && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{testEmailStatus}</span>
                    </div>
                  )}

                </form>

              </div>

              {/* Email History Logs */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Journal d'Envoi des Notifications Email
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {emailLogs.length} notifications enregistrées
                  </span>
                </div>

                {emailLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Aucun historique d'email pour l'instant.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {emailLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{log.subject}</p>
                          <span className="text-[11px] text-slate-400">{log.recipient} • {new Date(log.timestamp).toLocaleTimeString('fr-FR')}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                          ENVOYÉ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: ANALYTICS & CITIES */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cities breakdown */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <span>📍 Répartition des Commandes par Ville</span>
                  </h3>

                  <div className="space-y-3">
                    {MOROCCAN_CITIES.slice(0, 7).map((city) => {
                      const count = allOrders.filter(o => o.customer.city === city.name).length;
                      const percentage = allOrders.length > 0 ? Math.round((count / allOrders.length) * 100) : 0;

                      return (
                        <div key={city.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-800">{city.name}</span>
                            <span className="text-red-600">{count} commande(s) ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-600 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percentage, 4)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Best Selling Products */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <span>🔥 Produits & Packs les Plus Demandés</span>
                  </h3>

                  <div className="space-y-3">
                    {PRODUCTS.slice(0, 5).map((prod) => (
                      <div key={prod.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-slate-200" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                            <span className="text-[11px] text-red-600 font-black">{prod.price} DH</span>
                          </div>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                          En Stock
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: MANUAL ORDER */}
          {activeTab === 'new-order' && (
            <div className="max-w-2xl mx-auto">
              
              <form onSubmit={handleCreateManualOrder} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-heading">
                    Ajouter une Commande Manuelle (Téléphone / Direct)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enregistrez une commande prise par téléphone pour l'intégrer au suivi et générer son bon de livraison.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénom du Client *</label>
                    <input
                      type="text"
                      required
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Ex: Youssef El Fassi"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone Client *</label>
                    <input
                      type="tel"
                      required
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      placeholder="06 XX XX XX XX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ville de Livraison *</label>
                  <select
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800"
                  >
                    {MOROCCAN_CITIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Complète *</label>
                  <textarea
                    required
                    rows={2}
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Quartier, Rue, N° Immeuble..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Product Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Article</label>
                    <select
                      value={manualProductId}
                      onChange={(e) => setManualProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.price} DH)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantité</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-center"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Notes / Instructions</label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    placeholder="Ex: Appel reçu à 10h, confirmation WhatsApp"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  Enregistrer & Générer la Commande
                </button>

              </form>

            </div>
          )}

          {/* TAB 5: MEDIA & BANNERS MANAGER */}
          {activeTab === 'media' && (
            <AdminMediaManager onPreviewSection={(sectionId) => {
              setIsAdminOpen(false);
              scrollToSection(sectionId);
            }} />
          )}

          {/* TAB 6: EMPLOYEES */}
          {activeTab === 'employees' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 font-heading mb-4">
                  Ajouter un Employé
                </h3>
                
                <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénom</label>
                    <input
                      type="text"
                      required
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newEmpEmail}
                      onChange={(e) => setNewEmpEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
                    <input
                      type="password"
                      required
                      value={newEmpPassword}
                      onChange={(e) => setNewEmpPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={newEmpPhone}
                      onChange={(e) => setNewEmpPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rôle</label>
                    <div className="flex flex-wrap gap-3">
                      {['admin', 'manager', 'delivery', 'employee'].map(r => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                          <input type="radio" name="role" value={r} checked={newEmpRole === r} onChange={() => setNewEmpRole(r)} className="text-red-600 focus:ring-red-500" />
                          <span className="text-sm font-bold text-slate-700 capitalize">{r === 'delivery' ? 'Livreur' : r === 'manager' ? 'Gérant' : r}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    <button type="submit" className="w-full py-3 bg-[#002f6c] hover:bg-[#001f4d] text-white font-black text-sm rounded-xl shadow-md transition cursor-pointer">
                      Ajouter l'Employé
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 font-heading mb-4">
                  Liste des Employés et Utilisateurs
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-xs">
                        <th className="font-bold py-3 pr-4">Employé</th>
                        <th className="font-bold py-3 px-4">Email</th>
                        <th className="font-bold py-3 px-4">Rôle</th>
                        <th className="font-bold py-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="py-3 pr-4">
                            <div className="font-bold text-slate-800">{user.fullName}</div>
                            {user.phone && <div className="text-xs text-slate-500">{user.phone}</div>}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <select
                              value={user.role || 'customer'}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                              className="text-xs font-bold px-2 py-1 rounded bg-slate-100 border border-slate-300 focus:outline-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Gérant</option>
                              <option value="delivery">Livreur</option>
                              <option value="employee">Employé</option>
                              <option value="customer">Client</option>
                            </select>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <button
                              onClick={() => {
                                if(confirm(`Voulez-vous supprimer l'utilisateur ${user.fullName} ?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL PRINT DELIVERY SLIP (BORDEREAU DE LIVRAISON) */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300">
            
            {/* Header with Print Slip */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">BON DE LIVRAISON</span>
                <h3 className="text-xl font-black text-[#002f6c] font-heading mt-0.5">Parailaf Maroc</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ICE : <span className="font-mono font-bold text-slate-800">{BRAND_CONFIG.ice}</span> • IF : <span className="font-mono font-bold text-slate-800">{BRAND_CONFIG.ifNumber}</span> • TP : <span className="font-mono font-bold text-slate-800">{BRAND_CONFIG.taxePro}</span>
                </p>
                <p className="text-[10px] text-slate-400">{BRAND_CONFIG.address} • Tél : {BRAND_CONFIG.displayPhone}</p>
              </div>

              <div className="text-right">
                <span className="font-mono font-black text-sm bg-slate-100 px-2.5 py-1 rounded-lg">
                  #{selectedOrderForPrint.id}
                </span>
                <p className="text-xs text-slate-400 mt-1">{selectedOrderForPrint.createdAt}</p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">{selectedOrderForPrint.customer.fullName}</p>
              <p className="text-slate-700"><strong>Tél :</strong> {selectedOrderForPrint.customer.phone}</p>
              <p className="text-slate-700"><strong>Ville :</strong> {selectedOrderForPrint.customer.city}</p>
              <p className="text-slate-700"><strong>Adresse :</strong> {selectedOrderForPrint.customer.address}</p>
              {selectedOrderForPrint.customer.notes && (
                <p className="text-amber-800 bg-amber-50 p-1.5 rounded mt-1">
                  <strong>Instructions livreur :</strong> {selectedOrderForPrint.customer.notes}
                </p>
              )}
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Désignation Produit</th>
                    <th className="p-2.5 text-center">Qté</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderForPrint.items.map((it, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="p-2.5 font-medium">{it.product.name}</td>
                      <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                      <td className="p-2.5 text-right font-bold">{it.product.price * it.quantity} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Amount to collect */}
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-900 uppercase">Montant Total à Encaisser (COD) :</span>
                <p className="text-[11px] text-slate-500">Paiement en espèces à la livraison</p>
              </div>
              <span className="text-2xl font-black text-red-600 font-heading">
                {selectedOrderForPrint.total} DH
              </span>
            </div>

            {/* Legal footer for printed slip */}
            <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-3 space-y-0.5">
              <p className="font-semibold text-slate-600">Parailaf Maroc — Dispositifs médicaux certifiés conformes CE</p>
              <p>ICE : {BRAND_CONFIG.ice} | Identifiant Fiscal (IF) : {BRAND_CONFIG.ifNumber} | Taxe Professionnelle : {BRAND_CONFIG.taxePro}</p>
            </div>

            {/* Print & Close CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderForPrint(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le Bordereau</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
