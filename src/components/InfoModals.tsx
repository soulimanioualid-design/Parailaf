import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  ShieldCheck, 
  Truck, 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { BRAND_CONFIG, MOROCCAN_CITIES } from '../data/config';
import { Logo } from './Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 relative z-10">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <Logo size="lg" variant="dark" />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Fondée par des passionnés de santé et de technologies médicales au Maroc, <strong className="text-slate-900">{BRAND_CONFIG.name}</strong> a pour mission de faciliter la vie quotidienne des patients à travers le Royaume en leur donnant un accès direct, rapide et au meilleur prix aux dispositifs <strong className="text-red-600">FreeStyle Libre 2 & 3 PLUS</strong>, <strong className="text-[#002f6c]">Omnipod 5</strong> et accessoires certifiés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <ShieldCheck className="w-6 h-6 text-red-600 mx-auto mb-1.5" />
                <h4 className="font-black text-slate-900 text-xs">100% Originaux</h4>
                <p className="text-[11px] text-slate-500">Boîtes scellées avec date longue</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <Truck className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                <h4 className="font-black text-slate-900 text-xs">Livraison Express</h4>
                <p className="text-[11px] text-slate-500">Partout au Maroc en 24h-48h</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <HeartHandshake className="w-6 h-6 text-[#002f6c] mx-auto mb-1.5" />
                <h4 className="font-black text-slate-900 text-xs">Paiement à la livraison</h4>
                <p className="text-[11px] text-slate-500">Réglez après réception</p>
              </div>
            </div>

            <p>
              Nous mettons un point d'honneur à offrir un service après-vente chaleureux et disponible 7 jours sur 7 par téléphone et WhatsApp pour guider chaque patient lors de la pose et de la configuration de son application.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Fermer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 relative z-10">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Contact & Service Client
              </h3>
              <p className="text-xs text-slate-500">
                Notre équipe marocaine est à votre écoute 7j/7
              </p>
            </div>
          </div>

          {/* Quick Direct Links */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <a
              href={`https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 transition"
            >
              <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] text-emerald-600 font-bold">WhatsApp Direct</p>
                <p className="text-xs font-black">{BRAND_CONFIG.displayWhatsapp}</p>
              </div>
            </a>

            <a
              href={`tel:${BRAND_CONFIG.phone}`}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-2.5 text-slate-800 transition"
            >
              <Phone className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold">Appel Téléphonique</p>
                <p className="text-xs font-black">{BRAND_CONFIG.displayPhone}</p>
              </div>
            </a>
          </div>

          {sent ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-red-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Message Envoyé avec Succès !</h4>
              <p className="text-xs text-slate-600">Notre équipe va vous recontacter par téléphone ou WhatsApp dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Votre Nom & Prénom</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Yassine Benjelloun"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Votre Question ou Demande</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Renseignez votre question concernant un capteur ou votre commande..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer le message</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 relative z-10">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-black text-slate-900 font-heading mb-4">
            {title}
          </h3>

          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p>{content}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Compris
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
