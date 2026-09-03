import React from 'react';
import { 
  Truck, 
  Banknote, 
  ShieldCheck, 
  Headphones, 
  MapPin, 
  Clock, 
  CheckCircle,
  Phone,
  Flame,
  Award
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      icon: Truck,
      title: 'Livraison Partout au Maroc',
      tag: 'Express 24h - 48h',
      description: 'Livraison à domicile dans toutes les villes : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda, Tétouan, Meknès et provinces.',
      subText: 'Expédition sous emballage protecteur discret et sécurisé.',
      iconBg: 'bg-red-500/20 text-red-400 border-red-500/40',
      tagBg: 'bg-red-950/80 text-red-300 border-red-800/80',
    },
    {
      icon: Banknote,
      title: 'Paiement à la Livraison (Espèces)',
      tag: '100% Sans Risque',
      description: 'Commandez en toute tranquillité : vous réglez le montant exact en espèces auprès du livreur uniquement lors de la remise de votre colis.',
      subText: 'Paiement en mains propres à la réception.',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      tagBg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    },
    {
      icon: ShieldCheck,
      title: 'Dispositifs 100% Authentiques',
      tag: 'Certifiés Abbott CE',
      description: 'Tous nos capteurs et lecteurs proviennent directement des circuits officiels scellés, avec date de validité longue garantie.',
      subText: 'Stockage conforme aux normes strictes de température.',
      iconBg: 'bg-red-500/20 text-red-400 border-red-500/40',
      tagBg: 'bg-red-950/80 text-red-300 border-red-800/80',
    },
    {
      icon: Headphones,
      title: 'Assistance & Conseil 7j/7',
      tag: 'Accompagnement Dédié',
      description: 'Une question sur la pose, l’activation ou l’application LibreLink ? Notre équipe marocaine est joignable directement par WhatsApp & téléphone.',
      subText: `Appel direct au ${BRAND_CONFIG.displayPhone}`,
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      tagBg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    },
  ];

  return (
    <section className="py-16 bg-[#001f3f] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full">
            Nos Engagements de Confiance
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-3 font-heading">
            Pourquoi choisir Parailaf pour votre santé ?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            La sérénité d’un service de proximité fiable, rapide et sécurisé pour vos dispositifs de suivi glycémique.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#002855]/90 rounded-2xl p-6 border border-slate-700/80 hover:border-red-500/80 hover:bg-[#002f6c] transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${item.tagBg}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 font-heading group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-200 leading-relaxed mb-3 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/80 text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{item.subText}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* City Coverage ticker */}
        <div className="mt-12 p-4 rounded-xl bg-[#00172e] border border-slate-700/80 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-300 text-center">
          <span className="font-extrabold text-amber-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            Villes couvertes :
          </span>
          <span className="text-slate-200">Casablanca</span> •
          <span className="text-slate-200">Rabat</span> •
          <span className="text-slate-200">Marrakech</span> •
          <span className="text-slate-200">Tanger</span> •
          <span className="text-slate-200">Fès</span> •
          <span className="text-slate-200">Agadir</span> •
          <span className="text-slate-200">Meknès</span> •
          <span className="text-slate-200">Oujda</span> •
          <span className="text-slate-200">Kénitra</span> •
          <span className="text-slate-200">Tétouan</span> •
          <span className="text-amber-300 font-extrabold">+ Toutes les régions du Maroc</span>
        </div>

      </div>
    </section>
  );
};
