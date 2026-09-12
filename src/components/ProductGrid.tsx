import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  Check, 
  ArrowUpDown,
  Layers,
  PackageCheck,
  Flame,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { BRAND_CONFIG } from '../data/config';

export const ProductGrid: React.FC = () => {
  const { allProducts, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useCart();
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      const matchesCategory = 
        activeCategory === 'all' || 
        product.category === activeCategory ||
        (activeCategory === 'dexcom' && (product.category === 'dexcom' || product.brand.toLowerCase().includes('dexcom'))) ||
        (activeCategory === 'capteurs' && (product.category === 'capteurs' || product.category === 'libre-2' || product.category === 'libre-3' || product.category === 'dexcom' || product.id.includes('capteur'))) ||
        (activeCategory === 'packs' && (product.category === 'packs' || product.id.includes('pack') || product.id.includes('kit')));

      // Search filter
      const matchesSearch = 
        !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
    });
  }, [allProducts, activeCategory, searchQuery, sortBy]);

  return (
    <section id="nos-produits" className="py-12 md:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider mb-2 border border-red-200">
            <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            Produits & Offres Exclusives au Maroc
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Nos Produits & Offres Spéciales Parailaf
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Dispositifs FreeStyle Libre 2 & 3 PLUS, packs multi-pièces à tarif préférentiel, pods Omnipod 5 et accessoires certifiés.
          </p>
        </div>

        {/* Filter Tabs & Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const isSpecial = cat.id === 'offres-speciales';

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? isSpecial 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                        : 'bg-[#002f6c] text-white shadow-md'
                      : isSpecial
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {isSpecial && <Flame className="w-3.5 h-3.5" />}
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {cat.id === 'all' ? allProducts.length : allProducts.filter(p => p.category === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: View Switcher + Sort selector */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            
            {/* View Mode Toggle (Grid 2 cols mobile vs List 1-by-1) */}
            <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-red-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Affichage Grille (2 colonnes mobile)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">2 Colonnes</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-red-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Affichage 1 par 1 (Grand format)"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">1 par 1</span>
              </button>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap hidden sm:flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                Trier :
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="popular">Les plus populaires</option>
                <option value="price-asc">Prix croissant (DH)</option>
                <option value="price-desc">Prix décroissant (DH)</option>
                <option value="rating">Mieux notés ⭐</option>
              </select>
            </div>

          </div>

        </div>

        {/* Active Filters / Result count info & View indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
          <p>
            Affichage de <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> référence(s)
            {searchQuery && <span> pour la recherche « <strong>{searchQuery}</strong> »</span>}
            <span className="ml-2 text-slate-400 hidden sm:inline md:hidden">
              • Mode {viewMode === 'grid' ? 'Grille' : 'Grand format'}
            </span>
          </p>
          
          {(activeCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun produit trouvé</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Essayez un autre mot-clé ou réinitialisez les filtres pour voir l'ensemble de notre catalogue.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition cursor-pointer"
            >
              Voir tous les produits
            </button>
          </div>
        )}

        {/* Stock guarantee banner below grid */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#001f3f] to-[#002f6c] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-white/10">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base">Besoin d'un approvisionnement mensuel ou d'un conseil personnalisé ?</p>
              <p className="text-xs text-slate-300">Notre équipe Parailaf vous répond instantanément par téléphone ou WhatsApp.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour Parailaf, je souhaite commander ou poser une question sur vos packs FreeStyle.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow border border-red-400/30 flex items-center gap-1.5"
          >
            <span>Assistance WhatsApp Express</span>
          </a>
        </div>

      </div>
    </section>
  );
};
