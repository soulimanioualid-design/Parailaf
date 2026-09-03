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
  Flame
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
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
    allOrders,
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    scrollToSection 
  } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-white transition-shadow duration-300">
      {/* 1. Top Announcement Bar */}
      {!topBannerDismissed && (
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white text-xs py-2 px-4 border-b border-red-700 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap py-0.5 mx-auto md:mx-0">
              <span className="flex items-center text-amber-200 font-extrabold gap-1">
                <Truck className="w-3.5 h-3.5 inline animate-pulse" />
                Livraison express dans tout le Maroc (24h - 48h)
              </span>
              <span className="text-red-200 hidden sm:inline">•</span>
              <span className="hidden sm:inline text-white font-medium">
                Paiement en espèces à la livraison (COD)
              </span>
              <span className="text-red-200 hidden md:inline">•</span>
              <span className="hidden md:inline bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                100% PRODUITS ORIGINAUX ABBOTT
              </span>
            </div>
            
            <button 
              onClick={() => setTopBannerDismissed(true)} 
              className="text-red-100 hover:text-white text-xs ml-3 hidden md:inline-flex items-center"
              aria-label="Fermer la bannière"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Desktop Sub-bar (Contact, Phone, Email, Support) */}
      <div className="hidden lg:block bg-slate-50/90 backdrop-blur border-b border-slate-200/80 text-xs text-slate-600 py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1 text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-red-200">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Dispositifs Médicaux Certifiés CE</span>
            </div>
            
            <button 
              onClick={onOpenContact} 
              className="hover:text-red-600 font-semibold text-slate-700 transition cursor-pointer"
            >
              Assistance & Conseil
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 text-slate-700 hover:text-red-600 font-bold text-xs bg-slate-200/80 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
              title="Accès Administrateur & Commandes"
            >
              <Lock className="w-3 h-3 text-slate-600" />
              <span>Admin</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              )}
            </button>
          </div>
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
            <button 
              onClick={() => handleCategoryClick('all')} 
              className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              Nos produits
            </button>
            <button 
              onClick={() => handleCategoryClick('offres-speciales')} 
              className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'offres-speciales' ? 'bg-[#002f6c] text-white' : 'text-[#002f6c] hover:bg-blue-50 font-bold'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>Offres Spéciales</span>
            </button>
            <button 
              onClick={() => handleNavClick('offre-exclusive-affiche')} 
              className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-black transition cursor-pointer flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 fill-red-600 text-red-600" />
              <span>Affiches Promos</span>
            </button>
            <button 
              onClick={() => handleCategoryClick('libre-2')} 
              className={`px-3 py-2 rounded-lg transition cursor-pointer ${
                activeCategory === 'libre-2' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Libre 2 PLUS
            </button>
            <button 
              onClick={() => handleCategoryClick('libre-3')} 
              className={`px-3 py-2 rounded-lg transition cursor-pointer ${
                activeCategory === 'libre-3' ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Libre 3 PLUS
            </button>
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

            {/* WhatsApp Quick Order button */}
            <a
              href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all hover:shadow"
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
                  <button
                    onClick={() => handleNavClick('offre-exclusive-affiche')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-black text-red-600 bg-red-50 hover:bg-red-100 mb-2 border border-red-200"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 fill-red-600 text-red-600" />
                      <span>Affiches Promos (550 / 850 / 3000 DH)</span>
                    </span>
                    <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
                      Offres
                    </span>
                  </button>

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

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Tableau de Bord Admin</span>
                    </span>
                    {pendingOrdersCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>
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
