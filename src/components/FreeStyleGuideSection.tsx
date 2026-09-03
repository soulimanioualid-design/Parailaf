import React from 'react';
import { 
  Smartphone, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Droplet,
  BellRing,
  Award,
  Flame
} from 'lucide-react';

export const FreeStyleGuideSection: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Appliquer le capteur facilement',
      subtitle: 'Pose indolore en 1 minute',
      description: 'Le capteur s’applique à l’arrière de la partie supérieure du bras à l’aide d’un applicateur jetable stérile. Il adhère fermement à la peau pour une durée continue jusqu’à 15 jours.',
      highlights: [
        'Résistant à l’eau pour la douche & le sport',
        'Fin, discret sous les vêtements',
        'Sans piqûre au doigt au quotidien'
      ],
      icon: Droplet,
      accent: 'border-red-500 text-red-600 bg-red-50',
    },
    {
      stepNumber: '02',
      title: 'Scanner ou consulter en temps réel',
      subtitle: 'Lectures instantanées sur smartphone',
      description: 'Sur FreeStyle Libre 2 & 3 PLUS, les données et alertes sont transmises automatiquement vers votre téléphone ou lecteur sans piqûre.',
      highlights: [
        'Application gratuite FreeStyle LibreLink',
        'Flèche de tendance indiquant la direction du glucose',
        'Alertes sonores programmables jour & nuit'
      ],
      icon: Smartphone,
      accent: 'border-amber-500 text-amber-600 bg-amber-50',
    },
    {
      stepNumber: '03',
      title: 'Suivre l’évolution et les tendances',
      subtitle: 'Comprenez l’impact de vos repas & activités',
      description: 'Visualisez vos courbes de glucose en continu. Partagez facilement vos rapports avec votre médecin diabétologue ou vos proches grâce à LibreLinkUp.',
      highlights: [
        'Rapports d’objectifs glycémiques clairs',
        'Partage en direct avec la famille & soignants',
        'Prise de décision éclairée et sereine'
      ],
      icon: TrendingUp,
      accent: 'border-[#002f6c] text-[#002f6c] bg-blue-50',
    },
  ];

  return (
    <section id="guide-freestyle" className="py-16 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider mb-2.5">
            <Activity className="w-3.5 h-3.5 text-red-600" />
            Fonctionnement & Utilisation
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Comment fonctionne le système FreeStyle Libre ?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Une technologie de mesure continue du glucose conçue pour simplifier votre quotidien sans contrainte.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Step indicator top */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent} shadow-xs border`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 font-heading">
                    {item.stepNumber}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                    {item.subtitle}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-2 pt-3 border-t border-slate-200/80">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom decorative bar */}
                <div className="w-full h-1 bg-slate-200 rounded-full mt-6 overflow-hidden">
                  <div className="w-1/3 h-full bg-red-600 rounded-full group-hover:w-full transition-all duration-500" />
                </div>

              </div>
            );
          })}

        </div>

        {/* Informative Medical Disclaimer Card */}
        <div className="mt-10 p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              <strong>Note d’information santé :</strong> Le système FreeStyle Libre est un dispositif médical certifié CE. Consultez toujours votre médecin traitant ou diabétologue pour l’interprétation clinique de vos résultats et l’ajustement de votre traitement.
            </span>
          </div>
          <a 
            href="#faq" 
            className="whitespace-nowrap font-bold text-red-600 hover:text-red-800 hover:underline"
          >
            Consulter les FAQ & Guide d'usage →
          </a>
        </div>

      </div>
    </section>
  );
};
