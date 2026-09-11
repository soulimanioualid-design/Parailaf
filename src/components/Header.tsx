import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  MessageCircle, 
  Activity, 
  ChevronRight,
  Headphones,
  CheckCircle2,
  Lock,
  Package,
  Flame,
  User as UserIcon,
  LogIn,
  UserPlus,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/products';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAbout, onOpenContact }) => {
  const { 
    totalItemsCount, 
    setIsCartOpen, 
    setIsAdminOpen,
    openAdmin,
    allOrders,
    allProducts,
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    scrollToSection 
  } = useCart();

  const { currentUser, isAdmin, isAdminSessionActive, openAuthModal, setIsAccountModalOpen } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);

  const hasAdminAccess = isAdmin || isAdminSessionActive;
  const pendingOrdersCount = allOrders.filter(o => o.status === 'pending').length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setIsMobileMenuOpen(false);
    scrollToSection('nos-produits');
  };

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white transition-shadow duration-300">
      {/* 1. Top Announcement Bar */}
      {!topBannerDismissed && (
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white text-xs py-2 px-4 border-b border-red-700 shadow-sm overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-center relative">
            <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap py-0.5 max-w-full scrollbar-none">
              <span className="flex items-center text-amber-200 font-extrabold gap-1">
                <Truck className="w-3.5 h-3.5 inline animate-pulse" />
                Livraison express partout au Maroc (40 DH)
              </span>
              <span className="text-red-200 hidden sm:inline">•</span>
              <span className="hidden sm:inline text-white font-medium">
                Paiement en espèces à la livraison (COD)
              </span>
            </div>
            
            <button 
              onClick={() => setTopBannerDismissed(true)} 
              className="text-red-100 hover:text-white text-xs hidden md:inline-flex items-center absolute right-0"
              aria-label="Fermer la bannière"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Desktop Sub-bar (Contact, Phone, Email, Support) */}
      <div className="hidden lg:block bg-slate-50/90 backdrop-blur border-b border-slate-200/80 text-xs text-slate-600 py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <div className="flex items-center space-x-6">
            <a 
              href={`tel:${BRAND_CONFIG.phone}`}
              className="flex items-center gap-1.5 hover:text-red-600 transition font-bold text-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>{BRAND_CONFIG.displayPhone}</span>
            </a>
            
            <a 
              href={`mailto:${BRAND_CONFIG.email}`}
              className="flex items-center gap-1.5 hover:text-red-600 transition text-slate-600"
            >
              <Mail className="w-3.5 h-3.5 text-red-600" />
              <span>{BRAND_CONFIG.email}</span>
            </a>

            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Service client 7j/7 (8h30 - 20h00)</span>
            </div>
          </div>

          {hasAdminAccess && (
            <div className="flex items-center gap-2 absolute right-0">
              <button
                onClick={() => openAdmin('media')}
                className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition shadow-xs cursor-pointer"
                title="Modifier les affiches promo et images du site"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-950" />
                <span>Changer Images</span>
              </button>

              <button
                onClick={() => openAdmin('orders')}
                className="flex items-center gap-1.5 text-white font-bold text-xs bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-lg transition shadow-sm cursor-pointer"
                title="Accès Administrateur & Commandes"
              >
                <Lock className="w-3 h-3 text-white" />
                <span>Espace Admin</span>
                {pendingOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Header */}
      <div className={`px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <button 
              onClick={() => handleNavClick('hero')} 
              className="text-left group cursor-pointer"
            >
              <Logo size="md" variant="dark" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-semibold text-sm text-slate-700">
            <button 
              onClick={() => handleNavClick('hero')} 
              className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              Accueil
            </button>
            
            {/* Nos Produits Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => handleCategoryClick('all')} 
                className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer flex items-center gap-1"
              >
                Nos produits
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1">
                  {CATEGORIES.map((cat) => {
                    const dynamicCount = cat.id === 'all' 
                      ? allProducts.length 
                      : allProducts.filter(p => p.category === cat.id).length;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                          activeCategory === cat.id 
                            ? 'bg-red-50 text-red-600 font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">
                          {dynamicCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              onClick={onOpenAbout} 
              className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              À propos
            </button>
            <button 
              onClick={() => handleNavClick('faq')} 
              className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              FAQ
            </button>
            <button 
              onClick={onOpenContact} 
              className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right: Search, WhatsApp button, Cart Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Input (Desktop) */}
            <div className="hidden xl:flex items-center relative w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  scrollToSection('nos-produits');
                }}
                placeholder="Rechercher capteur, pack..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile search toggle */}
            <button 
              onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Admin / Images button - ONLY visible for authenticated Administrator */}
            {hasAdminAccess && (
              <button
                onClick={() => openAdmin('media')}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-2 rounded-lg text-xs font-black transition shadow-xs cursor-pointer"
                title="Modifier les images, affiches et photos du site"
              >
                <ImageIcon className="w-4 h-4 text-slate-950" />
                <span className="text-[11px] font-black">Images</span>
              </button>
            )}

            {/* User Account / Login Button */}
            {currentUser ? (
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-900 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition group cursor-pointer border border-slate-200"
                title="Mon Compte Client"
              >
                <div className="w-5 h-5 rounded-full bg-[#002f6c] text-amber-300 flex items-center justify-center text-[10px] font-black shrink-0">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline truncate max-w-[90px]">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-[#002f6c] px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border border-slate-200"
                title="Se connecter ou créer un compte"
              >
                <UserIcon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}

            {/* WhatsApp Quick Order button */}
            <a
              href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex lg:hidden items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all hover:shadow"
              title="Commander ou demander conseil sur WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#002f6c] hover:bg-[#002244] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition group cursor-pointer"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">Panier</span>
              {totalItemsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Dropdown */}
        {isSearchOpenMobile && (
          <div className="mt-3 pt-3 border-t border-slate-100 xl:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  scrollToSection('nos-produits');
                }}
                placeholder="Rechercher (ex: Libre 2 PLUS, pack 4, patch...)"
                className="w-full pl-9 pr-8 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Mobile Left Slide-in Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Top */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <Logo size="sm" variant="dark" showSubtitle={false} />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Account Section in Mobile Menu */}
              {currentUser ? (
                <div className="p-4 bg-gradient-to-r from-[#002f6c] to-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-blue-200 truncate">{currentUser.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAccountModalOpen(true);
                    }}
                    className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    Mon Compte
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#002f6c] text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Connexion</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>S'inscrire</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery badge in menu */}
              <div className="p-3 bg-red-50 border-b border-red-100 flex items-center gap-2 text-xs text-red-900 font-bold">
                <Truck className="w-4 h-4 text-red-600 shrink-0" />
                <span>Livraison partout au Maroc (24h/48h)</span>
              </div>

              {/* Navigation Items */}
              <div className="p-3 space-y-1">
                <p className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Catégories & Offres
                </p>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition ${
                      activeCategory === cat.id 
                        ? 'bg-red-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeCategory === cat.id ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}

                <div className="pt-3 pb-1 border-t border-slate-100 mt-2">
                  <p className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Informations
                  </p>

                  <button
                    onClick={() => handleNavClick('guide-freestyle')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>Guide FreeStyle Libre</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('faq')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>Questions fréquentes (FAQ)</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAbout();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>À propos de Parailaf</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenContact();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>Contact & Service client</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Espace Admin & Modification des Produits (Mobile Drawer) */}
                  {hasAdminAccess ? (
                    <div className="mt-3 p-3.5 bg-gradient-to-br from-slate-900 via-slate-800 to-[#002f6c] rounded-2xl text-white shadow-md border border-slate-700">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black flex items-center gap-1.5">
                              <span>Espace Administrateur</span>
                              <span className="text-[9px] font-black px-1.5 py-0.2 bg-red-600 text-white rounded uppercase">ACTIF</span>
                            </div>
                            <div className="text-[11px] text-slate-300">Catalogue, textes IA & photos</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-2">
                        {/* Primary button: Edit Products */}
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAdmin('products');
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white text-xs font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Modifier les Produits (Textes & Photos)</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              openAdmin('media');
                            }}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-slate-950" />
                            <span>Bannières</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              openAdmin('orders');
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition border border-white/20 cursor-pointer"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Commandes</span>
                            {pendingOrdersCount > 0 && (
                              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Admin Login shortcut on mobile */
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAdmin('products');
                      }}
                      className="w-full mt-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Accès Admin / Modifier les Produits</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Bottom - Contact Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Assistance WhatsApp 7j/7</span>
              </a>

              <a
                href={`tel:${BRAND_CONFIG.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5 px-4 rounded-xl text-sm font-bold transition"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Appeler : {BRAND_CONFIG.displayPhone}</span>
              </a>

              <div className="flex items-center justify-center gap-1 text-[11px] text-red-700 pt-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                <span>Paiement à la livraison partout au Maroc</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
