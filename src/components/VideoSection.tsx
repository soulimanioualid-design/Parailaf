import React, { useState } from 'react';
import { 
  Play, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Smartphone,
  Layers,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
}

export const VideoSection: React.FC = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorials: VideoTutorial[] = [
    {
      id: 'pose-complete',
      title: 'Guide Officiel : Comment Poser Votre Capteur FreeStyle Libre',
      duration: '2:15 min',
      category: 'Application & Pose',
      description: 'Découvrez en vidéo les 4 étapes simples pour préparer la peau, assembler l’applicateur et poser votre capteur sans douleur.',
      youtubeId: '0cXwO9YBJxE',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'app-librelink',
      title: 'Connexion & Scan avec l’Application FreeStyle LibreLink',
      duration: '1:45 min',
      category: 'Smartphone & Scan',
      description: 'Tutoriel pour scanner votre capteur avec votre iPhone ou smartphone Android et consulter votre taux instantanément.',
      youtubeId: 'acJu0M9a2bY',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'retrait-conseils',
      title: 'Retrait en douceur après 14/15 jours & Bonnes Pratiques',
      duration: '1:30 min',
      category: 'Conseils & Retrait',
      description: 'Conseils pratiques pour décoller facilement l’adhésif sans laisser de traces et préparer le bras suivant.',
      youtubeId: 'cQ6J48IcT28',
      thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const currentVideo = tutorials[selectedVideoIndex];

  const videoChapters = [
    {
      time: '0:15',
      title: '1. Préparation cutanée',
      description: 'Désinfecter et bien sécher l’arrière du haut du bras avec une lingette alcoolisée.'
    },
    {
      time: '0:45',
      title: '2. Alignement & Pose',
      description: 'Appuyer fermement l’applicateur stérile d’un seul geste sans aucune douleur.'
    },
    {
      time: '1:10',
      title: '3. Scan Smartphone',
      description: 'Approcher votre téléphone ou lecteur pour initialiser le compte à rebours de 60 min.'
    },
    {
      time: '1:45',
      title: '4. Suivi Continu 24/7',
      description: 'Mesures du glucose en temps réel, flèches de tendance et alertes automatiques.'
    }
  ];

  const handleSelectTutorial = (index: number) => {
    setSelectedVideoIndex(index);
    setIsPlaying(true);
  };

  return (
    <section id="video" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider mb-2 border border-red-200">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Tutoriels Vidéos & Pose
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Découvrez la simplicité de FreeStyle Libre
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Regardez le tutoriel vidéo pas-à-pas pour poser et activer votre capteur en toute sérénité.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
          
          {/* Main Visual / Video Embed Container */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            
            {isPlaying ? (
              /* Real Functional YouTube Video Embed */
              <div className="relative w-full h-full">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                
                {/* Close / Reset Playback Button */}
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-3 right-3 z-30 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition shadow-lg cursor-pointer"
                  title="Fermer la vidéo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Custom High-Definition Cover & Play Trigger */
              <div className="relative w-full h-full flex items-center justify-center group cursor-pointer" onClick={() => setIsPlaying(true)}>
                
                {/* Background Thumbnail Image */}
                <img 
                  src={currentVideo.thumbnail} 
                  alt={currentVideo.title}
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />

                {/* Interactive Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/20 group-hover:ring-8 group-hover:ring-red-500/30">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                  </div>
                  
                  <h3 className="text-white font-black text-base sm:text-xl mt-4 drop-shadow max-w-lg">
                    {currentVideo.title}
                  </h3>
                  
                  <p className="text-amber-300 text-xs sm:text-sm drop-shadow font-semibold mt-1">
                    Cliquez pour lancer la vidéo officielle ({currentVideo.duration})
                  </p>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {currentVideo.duration}
                  </span>
                  <span className="bg-red-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-lg">
                    HD 1080p
                  </span>
                </div>

              </div>
            )}

          </div>

          {/* Quick External Fallback and Reassurance bar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tutoriel vidéo validé conforme aux recommandations médicales</span>
            </div>

            <a
              href={`https://www.youtube.com/results?search_query=freestyle+libre+pose+tutoriel`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 hover:underline"
            >
              <span>Voir d'autres vidéos sur YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Multi-Tutorial Selection Tabs */}
          <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Sélectionnez un tutoriel vidéo :
              </span>
              <span className="text-[11px] text-red-400 font-bold">
                {tutorials.length} vidéos disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tutorials.map((tut, idx) => (
                <button
                  key={tut.id}
                  onClick={() => handleSelectTutorial(idx)}
                  className={`text-left p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    selectedVideoIndex === idx
                      ? 'bg-slate-900 border-red-500 text-white shadow-lg ring-1 ring-red-500/50'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-red-400 uppercase">{tut.category}</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tut.duration}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-100 line-clamp-1">{tut.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{tut.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                    <Play className="w-3 h-3 fill-amber-400" />
                    <span>{selectedVideoIndex === idx && isPlaying ? 'En cours de lecture' : 'Lancer cette vidéo'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Step Breakdown */}
          <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3">
              Les 4 Étapes Clés Résumées :
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {videoChapters.map((chap, idx) => (
                <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-red-400 font-black text-[10px] mb-1">
                    <span>{chap.time}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">{chap.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{chap.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

