import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Phone, 
  User as UserIcon, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOROCCAN_CITIES } from '../data/config';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    register 
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState(MOROCCAN_CITIES[0].name);
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setLoginError(null);
    setRegError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Veuillez saisir votre email ou numéro de téléphone.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Veuillez renseigner votre mot de passe.');
      return;
    }

    setIsLoggingIn(true);
    const res = await login(loginIdentifier, loginPassword);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || 'Erreur lors de la connexion.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsRegistering(true);
    const res = await register({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      city: regCity,
      address: regAddress,
      password: regPassword,
    });
    setIsRegistering(false);

    if (!res.success) {
      setRegError(res.error || "Erreur lors de l'inscription.");
    }
  };

  const fillQuickDemo = (identifier: string, pass: string) => {
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-[#002f6c] text-white p-5 sm:p-6 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espace Client Sécurisé</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
              {authModalTab === 'login' ? 'Connexion' : 'Créer un Compte'}
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              {authModalTab === 'login' 
                ? 'Accédez à votre compte, vos commandes et vos coordonnées.' 
                : 'Inscrivez-vous pour commander rapidement et suivre vos livraisons.'}
            </p>

            {/* Tab switchers */}
            <div className="flex bg-slate-900/40 p-1 rounded-xl mt-4">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setLoginError(null);
                  setRegError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  authModalTab === 'login'
                    ? 'bg-white text-[#002f6c] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Se Connecter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('register');
                  setLoginError(null);
                  setRegError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  authModalTab === 'register'
                    ? 'bg-white text-[#002f6c] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>S'inscrire</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 sm:p-6">
            
            {/* LOGIN TAB */}
            {authModalTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email ou Numéro de Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="client@parailaf.ma ou 06XXXXXXXX"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Mot de passe
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-[#002f6c] hover:bg-[#002244] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Se Connecter</span>
                    </>
                  )}
                </button>

                {/* Switch to Register */}
                <div className="text-center pt-2 text-xs text-slate-600">
                  <span>Pas encore de compte ? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('register');
                      setLoginError(null);
                    }}
                    className="font-bold text-[#002f6c] hover:underline cursor-pointer"
                  >
                    Créer un compte en 30 secondes
                  </button>
                </div>

                {/* Quick Demo Accounts Helper */}
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-3xl">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Compte démo pré-configuré :
                  </p>
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('client@parailaf.ma', 'parailaf123')}
                    className="w-full text-left p-2.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-[#002f6c]">
                        Oualid Soulimani
                      </p>
                      <p className="text-[11px] text-slate-500">client@parailaf.ma (Mdp: parailaf123)</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#002f6c] bg-blue-50 px-2 py-1 rounded-md">
                      Remplir
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER TAB */}
            {authModalTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom complets *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="ex: Mohamed Alami"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                      required
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className="w-full pl-9 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                        required
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone (WhatsApp) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="06XXXXXXXX"
                        className="w-full pl-9 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                        required
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ville au Maroc *
                    </label>
                    <div className="relative">
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse habituelle (optionnelle)
                    </label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Quartier, Rue, N°"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Au moins 6 car."
                        className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                        required
                        minLength={6}
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmer mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Répétez"
                        className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                        required
                        minLength={6}
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Vos coordonnées seront mémorisées pour commander en 1 clic sans avoir à retaper votre adresse.</span>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRegistering ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Créer mon Compte</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1 text-xs text-slate-600">
                  <span>Déjà inscrit ? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('login');
                      setRegError(null);
                    }}
                    className="font-bold text-[#002f6c] hover:underline cursor-pointer"
                  >
                    Se connecter directement
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
