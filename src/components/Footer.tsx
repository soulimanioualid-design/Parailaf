import React from 'react';
import { 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Banknote, 
  Clock, 
  ChevronRight,
  Heart,
  Flame,
  Lock
} from 'lucide-react';
import { BRAND_CONFIG, MOROCCAN_CITIES } from '../data/config';
import { useCart } from '../context/CartContext';
import { Logo } from './Logo';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenLegal: (title: string, content: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenContact, onOpenLegal }) => {
  const { scrollToSection, setActiveCategory, setIsAdminOpen } = useCart();

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    scrollToSection('nos-produits');
  };

  const openCGV = () => {
    onOpenLegal(
      "Conditions Générales de Vente (CGV)",
      "Les présentes conditions régissent les ventes de dispositifs médicaux et accessoires effectuées sur le site Parailaf Maroc. Tous les produits proposés sont neufs, scellés d'origine par les fabricants et conformes aux normes CE. Le paiement s'effectue exclusivement en espèces à la livraison (Cash on Delivery) après réception de votre colis. En cas de non-conformité d'un article scellé à réception, le remplacement est garanti sous 48h."
    );
  };

  const openPrivacy = () => {
    onOpenLegal(
      "Politique de Confidentialité",
      "Vos données personnelles (nom, numéro de téléphone, ville et adresse de livraison) sont collectées exclusivement dans le cadre du traitement et de l'acheminement de votre commande au Maroc. Elles ne sont en aucun cas vendues ou cédées à des tiers. Conformément aux dispositions légales relatives à la protection des données, vous disposez d'un droit d'accès et de rectification sur simple demande."
    );
  };

  const openDeliveryPolicy = () => {
    onOpenLegal(
      "Politique de Livraison au Maroc",
      "Parailaf Maroc assure la livraison dans toutes les villes du Royaume sous 24h à 48h ouvrées. À Casablanca et Rabat, la livraison peut être effectuée le jour même pour toute commande passée avant 12h00. La livraison est offerte pour toute commande à partir de 700 DH. Le livreur prend contact par téléphone avant de se présenter à votre adresse."
    );
  };

  return (
    <footer className="bg-[#00172e] text-slate-400 text-xs border-t border-slate-800">
      
      {/* Top Value Banner inside Footer */}
      <div className="bg-[#001f3f] border-b border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">Livraison partout au Maroc</p>
              <p className="text-[11px] text-slate-300">Casablanca, Rabat & toutes régions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Banknote className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">Paiement à la livraison</p>
              <p className="text-[11px] text-slate-300">Réglez après réception en espèces</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">100% Originaux Abbott</p>
              <p className="text-[11px] text-slate-300">Boîtes stériles scellées</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Clock className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-black text-white text-xs sm:text-sm">Assistance 7j/7</p>
              <p className="text-[11px] text-slate-300">Conseils par WhatsApp & Tél</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />

            <p className="text-slate-300 leading-relaxed text-xs max-w-sm">
              Votre parapharmacie et distributeur de référence au Maroc dédiée aux solutions modernes de contrôle continu du glucose FreeStyle Libre 2 & 3 PLUS, packs exclusifs, Omnipod 5 et accessoires certifiés.
            </p>

            <div className="pt-2 space-y-1.5 text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{BRAND_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{BRAND_CONFIG.operatingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Produits */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm font-heading tracking-wide">
              Produits & Offres
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleCategoryNav('offres-speciales')} 
                  className="hover:text-red-400 text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3 h-3 text-red-500" />
                  <span>Offres Spéciales (Flyer)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('libre-2')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>FreeStyle Libre 2 PLUS</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('libre-3')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>FreeStyle Libre 3 PLUS</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('omnipod')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Omnipod 5 PODS (Pack 10)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('lecteurs')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Lecteurs tactiles FreeStyle 2</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('accessoires')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Patchs Adhésifs & Accessoires</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations & Guide */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm font-heading tracking-wide">
              Informations Pratiques
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('guide-freestyle')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Guide d'utilisation FreeStyle</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Foire Aux Questions (FAQ)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAbout} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>À propos de Parailaf Maroc</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openDeliveryPolicy} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Politique de Livraison Maroc</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openCGV} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Conditions Générales (CGV)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openPrivacy} 
                  className="hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Politique de Confidentialité</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Direct au Maroc */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm font-heading tracking-wide">
              Contact & Commandes
            </h4>
            
            <div className="space-y-2.5">
              <a
                href={`tel:${BRAND_CONFIG.phone}`}
                className="p-3 bg-[#001f3f] hover:bg-[#002855] rounded-xl border border-slate-700/80 flex items-center gap-2.5 transition text-white"
              >
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-300">Téléphone Direct :</p>
                  <p className="font-black text-xs text-amber-300">{BRAND_CONFIG.displayPhone}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-950/70 hover:bg-emerald-900/90 rounded-xl border border-emerald-700/60 flex items-center gap-2.5 transition text-white"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-emerald-300">WhatsApp 7j/7 :</p>
                  <p className="font-black text-xs text-emerald-200">{BRAND_CONFIG.displayWhatsapp}</p>
                </div>
              </a>

              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition text-[11px] pt-1"
              >
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{BRAND_CONFIG.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Medical disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
          <p>
            <strong>Avertissement médical :</strong> Parailaf Maroc distribue des dispositifs médicaux certifiés conformes CE de la marque Abbott (FreeStyle Libre) et Insulet (Omnipod). Les informations fournies sur ce site ne remplacent pas les recommandations personnalisées de votre médecin diabétologue ou professionnel de santé.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name} - Tous droits réservés. Livraison partout au Maroc.</p>
          <div className="flex items-center gap-4">
            <button onClick={openCGV} className="hover:text-white cursor-pointer">CGV</button>
            <button onClick={openPrivacy} className="hover:text-white cursor-pointer">Confidentialité</button>
            <button onClick={openDeliveryPolicy} className="hover:text-white cursor-pointer">Livraison Maroc</button>
            <button 
              onClick={() => setIsAdminOpen(true)} 
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Espace Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
