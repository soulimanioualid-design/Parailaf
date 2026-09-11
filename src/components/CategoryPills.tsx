import React from 'react';
import { 
  Flame,
  Radio, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Shield, 
  Package, 
  Activity,
  ChevronRight 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CategoryPills: React.FC = () => {
  const { activeCategory, setActiveCategory, scrollToSection } = useCart();

  const categoryItems = [
    {
      id: 'offres-speciales',
      title: 'Offres Spéciales',
      subtitle: 'Packs 4 & 10 Pièces',
      description: 'Tarifs exclusifs dès 53 DH / pièce',
      icon: Flame,
      badge: 'Flyer Exclusif',
      badgeColor: 'bg-red-600 text-white',
      borderHover: 'hover:border-red-500',
      activeBg: 'border-red-600 bg-red-50/80',
    },
    {
      id: 'libre-2',
      title: 'Libre 2 PLUS',
      subtitle: '15 jours de suivi',
      description: 'Capteurs & alertes Bluetooth en direct',
      icon: Radio,
      badge: 'Best-Seller',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      borderHover: 'hover:border-red-500',
      activeBg: 'border-red-600 bg-red-50/80',
    },
    {
      id: 'libre-3',
      title: 'Libre 3 PLUS',
      subtitle: 'Minute par minute',
      description: 'Ultra-discret, lecture en 1 seconde',
      icon: Sparkles,
      badge: 'Nouveau !',
      badgeColor: 'bg-blue-100 text-blue-900',
      borderHover: 'hover:border-blue-500',
      activeBg: 'border-[#002f6c] bg-blue-50/80',
    },
    {
      id: 'dexcom',
      title: 'Dexcom G6',
      subtitle: 'Kit CGM Complet',
      description: 'Capteurs + Transmetteur + 20 Patchs Shield',
      icon: Activity,
      badge: 'Nouveau',
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      borderHover: 'hover:border-emerald-500',
      activeBg: 'border-emerald-600 bg-emerald-50/80',
    },
    {
      id: 'omnipod',
      title: 'Omnipod 5 PODS',
      subtitle: 'Délivrance continue',
      description: 'Sans tubulure (Tubeless) - Pack de 10',
      icon: Layers,
      badge: 'Technologie',
      badgeColor: 'bg-slate-200 text-slate-800',
      borderHover: 'hover:border-slate-500',
      activeBg: 'border-slate-800 bg-slate-100',
    },
    {
      id: 'lecteurs',
      title: 'Lecteurs FSL2',
      subtitle: 'Appareils dédiés',
      description: 'Écran tactile couleur en Français (450 DH)',
      icon: Smartphone,
      badge: 'Autonome',
      badgeColor: 'bg-amber-100 text-amber-900',
      borderHover: 'hover:border-amber-500',
      activeBg: 'border-amber-500 bg-amber-50/70',
    },
    {
      id: 'accessoires',
      title: 'Accessoires & Soins',
      subtitle: 'Patchs & Lingettes',
      description: 'Patchs étanches, lingettes d’alcool & trousses',
      icon: Shield,
      badge: 'Dès 25 DH',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      borderHover: 'hover:border-emerald-500',
      activeBg: 'border-emerald-600 bg-emerald-50/70',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveCategory(id);
    scrollToSection('nos-produits');
  };

  return (
    <section className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-red-600 text-xs font-black uppercase tracking-wider mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              Gamme Certifiée Abbott & Soins
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Sélectionnez vos Produits & Offres
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              FreeStyle Libre 2 & 3 PLUS, packs économiques exclusifs, pompes Omnipod 5 et accessoires de protection cutanée.
            </p>
          </div>

          <button
            onClick={() => handleSelect('all')}
            className="mt-3 sm:mt-0 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 transition gap-1 group cursor-pointer"
          >
            <span>Voir tout le catalogue complet</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden cursor-pointer ${
                  isSelected 
                    ? item.activeBg + ' shadow-md scale-[1.02]' 
                    : 'border-slate-200 hover:border-red-300 hover:shadow-md bg-slate-50/60 hover:bg-white'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3 w-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-white text-slate-700 shadow-xs group-hover:bg-red-600 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="font-black text-slate-900 text-sm font-heading group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-red-600 mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 hidden sm:block">
                    {item.description}
                  </p>
                </div>

                {/* Bottom link indicator */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-red-600">
                  <span>Sélectionner</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
