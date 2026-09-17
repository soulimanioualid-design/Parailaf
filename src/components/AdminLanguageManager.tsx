import React, { useState } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldCheck, 
  Languages, 
  Sparkles, 
  ArrowRight,
  Info,
  Clock,
  Layers,
  ShoppingBag,
  MessageSquare,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export const AdminLanguageManager: React.FC = () => {
  const { 
    arabicEnabled, 
    setArabicEnabled, 
    language, 
    previewLanguage 
  } = useLanguage();
  
  const { showToast } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleArabic = async () => {
    setIsUpdating(true);
    const newStatus = !arabicEnabled;
    await setArabicEnabled(newStatus);
    setIsUpdating(false);

    if (newStatus) {
      showToast('Version Arabe activée avec succès ! Le sélecteur de langue est maintenant visible sur le site.');
    } else {
      showToast('Version Arabe désactivée. Le site s\'affiche uniquement en Français. Vos traductions sont conservées en sécurité.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002f6c] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/10">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>Gestion Multi-Langues du Site</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Activation & Désactivation des Langues
            </h1>
            <p className="text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              Activez ou désactivez la version arabe en un clic. Lorsque l'arabe est désactivé, le site public fonctionne exclusivement en français tout en préservant 100% de votre travail de traduction.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${
              arabicEnabled 
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' 
                : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${arabicEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{arabicEnabled ? 'Mode Bilingue (FR + AR)' : 'Mode Français Uniquement'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Preservation Guarantee Box */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs">
          <h3 className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
            <span>Sécurité & Préservation Garantie de vos Traductions</span>
            <span className="bg-emerald-200/60 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-black">
              100% Sauvegardé
            </span>
          </h3>
          <p className="text-emerald-800 leading-relaxed">
            Toutes les traductions réalisées (titres de produits, descriptions médicales, caractéristiques, offres promotionnelles en DH, avis clients marocains, FAQ et formulaires) sont conservées intactes dans le système. La désactivation ne supprime rien : elle masque simplement les sélecteurs aux visiteurs pour vous laisser tout le temps de finaliser à votre rythme.
          </p>
        </div>
      </div>

      {/* Language Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* FRENCH (Main / Locked) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="France">🇫🇷</span>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Français</h3>
                <p className="text-xs text-slate-500">Langue principale du site</p>
              </div>
            </div>
            <span className="bg-blue-50 text-[#002f6c] border border-blue-200 text-xs font-black px-3 py-1 rounded-full">
              Toujours Actif
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            La version française constitue la base par défaut du site e-commerce Parailaf Maroc. Tous les flux (navigation, catalogue, panier, commande rapide COD) sont disponibles en français.
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Visible par tous les visiteurs</span>
            </span>
            <button
              onClick={() => previewLanguage('fr')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                language === 'fr' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {language === 'fr' ? '✓ Actuellement sélectionné' : 'Voir en Français'}
            </button>
          </div>
        </div>

        {/* ARABIC (Toggleable ON / OFF) */}
        <div className={`rounded-3xl p-6 border-2 transition-all shadow-sm relative overflow-hidden ${
          arabicEnabled 
            ? 'bg-white border-emerald-400 ring-4 ring-emerald-50' 
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Maroc">🇲🇦</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-lg">العربية (Maroc)</h3>
                  <span className="text-xs font-semibold text-slate-500 font-sans">Arabe</span>
                </div>
                <p className="text-xs text-slate-500">Mise en page RTL & police Cairo</p>
              </div>
            </div>
            
            <span className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              arabicEnabled 
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${arabicEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>{arabicEnabled ? 'Activée' : 'Désactivée'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            {arabicEnabled 
              ? 'La langue arabe est active. Le sélecteur 🇲🇦 العربية / 🇫🇷 Français est visible dans l\'en-tête et le menu mobile.' 
              : 'La langue arabe est désactivée pour les clients. Le site s\'affiche à 100% en Français sans bouton de bascule vers l\'arabe.'}
          </p>

          {/* Big Interactive Toggle Switch */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  {arabicEnabled ? 'Désactiver la langue arabe' : 'Activer la langue arabe'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {arabicEnabled 
                    ? 'Cliquez pour masquer l\'arabe aux visiteurs' 
                    : 'Cliquez pour publier l\'arabe sur le site'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleArabic}
                disabled={isUpdating}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:ring-offset-2 ${
                  arabicEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={arabicEnabled}
              >
                <span className="sr-only">Activer ou désactiver l'arabe</span>
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    arabicEnabled ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Test / Preview Button */}
          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Test administrateur</span>
            </span>

            <button
              onClick={() => previewLanguage('ar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                language === 'ar' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? '✓ Aperçu Arabe actif' : 'Tester l\'affichage Arabe'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Overview of Stored Translations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Modules et Contenus Arabes Enregistrés en Mémoire</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ces éléments restent disponibles dans le code et se réactiveront instantanément dès votre validation.
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
            Prêt pour reprise
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Catalogue & Produits</span>
              <span className="text-slate-500 text-[11px]">FreeStyle Libre 2 & 3, Omnipod, packs et bandelettes traduits avec prix en DH.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Affiches Promotionnelles</span>
              <span className="text-slate-500 text-[11px]">Pack 4 à 550 DH, Pack 10 à 850 DH et offres spéciales avec bannières adaptées.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Commande Cash on Delivery</span>
              <span className="text-slate-500 text-[11px]">Formulaire de commande express avec liste des villes marocaines (الدار البيضاء، الرباط...).</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Guide & Foire aux Questions</span>
              <span className="text-slate-500 text-[11px]">Guide en 3 étapes (pose, scan, résultats) et réponses aux questions fréquentes.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Avis Clients & Témoignages</span>
              <span className="text-slate-500 text-[11px]">Retours de patients diabétiques au Maroc traduits avec noms de villes marocaines.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Assistance WhatsApp & Suivi</span>
              <span className="text-slate-500 text-[11px]">Messages pré-rédigés pour commande rapide et suivi des colis par WhatsApp.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
