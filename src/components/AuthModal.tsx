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
import { useLanguage } from '../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    register 
  } = useAuth();

  const { language, isRTL } = useLanguage();

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
  const [isStaffReg, setIsStaffReg] = useState(false);
  const [regRole, setRegRole] = useState<'admin' | 'manager' | 'employee' | 'delivery'>('employee');
  const [regPasscode, setRegPasscode] = useState('');

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
      setLoginError(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف.' : 'Veuillez saisir votre email ou numéro de téléphone.');
      return;
    }
    if (!loginPassword) {
      setLoginError(language === 'ar' ? 'يرجى إدخال كلمة المرور الخاصة بكم.' : 'Veuillez renseigner votre mot de passe.');
      return;
    }

    setIsLoggingIn(true);
    const res = await login(loginIdentifier, loginPassword);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || (language === 'ar' ? 'خطأ أثناء تسجيل الدخول.' : 'Erreur lors de la connexion.'));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError(language === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (isStaffReg && (!regPasscode || !['1234', 'admin2026', 'parailaf2026', 'admin123'].includes(regPasscode.trim()))) {
      setRegError(language === 'ar' ? 'رمز الأمان الخاص بالفريق غير صحيح (استخدم 1234)' : "Code de sécurité d'équipe incorrect (utilisez le code PIN Master 1234).");
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
      role: isStaffReg ? regRole : undefined,
      adminPasscode: isStaffReg ? regPasscode : undefined,
    });
    setIsRegistering(false);

    if (!res.success) {
      setRegError(res.error || (language === 'ar' ? 'خطأ أثناء إنشاء الحساب.' : "Erreur lors de l'inscription."));
    }
  };

  const fillQuickDemo = (identifier: string, pass: string) => {
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
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
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer`}
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'فضاء الزبون الآمن' : 'Espace Client Sécurisé'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
              {authModalTab === 'login' 
                ? (language === 'ar' ? 'تسجيل الدخول' : 'Connexion') 
                : (language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un Compte')}
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              {authModalTab === 'login' 
                ? (language === 'ar' ? 'الولوج إلى حسابك، طلبياتك ومعلومات التوصيل الخاصة بك.' : 'Accédez à votre compte, vos commandes et vos coordonnées.') 
                : (language === 'ar' ? 'سجلوا حسابكم للطلب بضغطة زر وتتبع شحناتكم بسهولة.' : 'Inscrivez-vous pour commander rapidement et suivre vos livraisons.')}
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
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Se Connecter'}</span>
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
                <span>{language === 'ar' ? 'إنشاء حساب' : "S'inscrire"}</span>
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
                    {language === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email ou Numéro de Téléphone'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={language === 'ar' ? 'client@parailaf.ma أو 06XXXXXXXX' : 'client@parailaf.ma ou 06XXXXXXXX'}
                      className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                      required
                    />
                    <Mail className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                      required
                    />
                    <Lock className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-2.5 text-slate-400 hover:text-slate-600 p-1`}
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
                      <span>{language === 'ar' ? 'دخول لحسابي' : 'Se Connecter'}</span>
                    </>
                  )}
                </button>

                {/* Switch to Register */}
                <div className="text-center pt-2 text-xs text-slate-600">
                  <span>{language === 'ar' ? 'ليس لديك حساب بعد؟ ' : 'Pas encore de compte ? '}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('register');
                      setLoginError(null);
                    }}
                    className="font-bold text-[#002f6c] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'إنشاء حساب في 30 ثانية' : 'Créer un compte en 30 secondes'}
                  </button>
                </div>

                {/* Quick Demo Accounts Helper */}
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-3.5 rounded-b-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {language === 'ar' ? 'حسابات تجريبية سريعة بنقرة واحدة :' : 'Comptes pré-configurés (clic direct) :'}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold">Test instantané</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('soulimani.oualid@gmail.com', 'admin2026')}
                      className="p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left cursor-pointer group shadow-xs"
                    >
                      <p className="font-extrabold text-[#002f6c] text-[11px] flex items-center gap-1">
                        👑 Admin Principal
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">soulimani.oualid...</p>
                      <span className="text-[9px] font-mono text-emerald-700 font-bold">admin2026</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fillQuickDemo('livreur@parailaf.ma', 'livreur2026')}
                      className="p-2 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 transition text-left cursor-pointer group shadow-xs"
                    >
                      <p className="font-extrabold text-amber-900 text-[11px] flex items-center gap-1">
                        🚚 Livreur Express
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">livreur@parailaf.ma</p>
                      <span className="text-[9px] font-mono text-amber-700 font-bold">livreur2026</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fillQuickDemo('employe@parailaf.ma', 'employe2026')}
                      className="p-2 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition text-left cursor-pointer group shadow-xs"
                    >
                      <p className="font-extrabold text-emerald-900 text-[11px] flex items-center gap-1">
                        📦 Employé Catalogue
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">employe@parailaf.ma</p>
                      <span className="text-[9px] font-mono text-emerald-700 font-bold">employe2026</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fillQuickDemo('fatima.bennani@gmail.com', 'maroc2026')}
                      className="p-2 bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition text-left cursor-pointer group shadow-xs"
                    >
                      <p className="font-extrabold text-slate-900 text-[11px] flex items-center gap-1">
                        👤 Compte Client
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">fatima.bennani...</p>
                      <span className="text-[9px] font-mono text-slate-600 font-bold">maroc2026</span>
                    </button>
                  </div>
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
                    {language === 'ar' ? 'الاسم والنسب الكامل *' : 'Nom & Prénom complets *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: محمد العلمي' : 'ex: Mohamed Alami'}
                      className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                      required
                    />
                    <UserIcon className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-2.5`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className={`w-full ${isRTL ? 'pr-9 pl-2.5' : 'pl-9 pr-2.5'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                        required
                      />
                      <Mail className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'الهاتف (واتساب) *' : 'Téléphone (WhatsApp) *'}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="06XXXXXXXX"
                        className={`w-full ${isRTL ? 'pr-9 pl-2.5' : 'pl-9 pr-2.5'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                        required
                      />
                      <Phone className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'المدينة في المغرب *' : 'Ville au Maroc *'}
                    </label>
                    <div className="relative">
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {language === 'ar' && c.nameAr ? c.nameAr : c.name}
                          </option>
                        ))}
                      </select>
                      <MapPin className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5 pointer-events-none`} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'العنوان المعتاد (اختياري)' : 'Adresse habituelle (optionnelle)'}
                    </label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder={language === 'ar' ? 'الحي، الشارع، رقم المنزل' : 'Quartier, Rue, N°'}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'كلمة المرور *' : 'Mot de passe *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder={language === 'ar' ? 'على الأقل 6 خانات' : 'Au moins 6 car.'}
                        className={`w-full ${isRTL ? 'pr-9 pl-7' : 'pl-9 pr-7'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                        required
                        minLength={6}
                      />
                      <Lock className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirmer mot de passe *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder={language === 'ar' ? 'أعد إدخال الكلمة' : 'Répétez'}
                        className={`w-full ${isRTL ? 'pr-9 pl-7' : 'pl-9 pr-7'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002f6c] focus:bg-white transition`}
                        required
                        minLength={6}
                      />
                      <Lock className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-2 text-slate-400 hover:text-slate-600`}
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Staff / Employee Account Option */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isStaffReg}
                      onChange={(e) => setIsStaffReg(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-amber-950">
                      {language === 'ar' ? 'أنا موظف أو إداري أو موزع (فريق العمل)' : "Je fais partie de l'équipe (Livreur, Employé, Gérant, Admin)"}
                    </span>
                  </label>

                  {isStaffReg && (
                    <div className="space-y-2 pt-2 border-t border-amber-200/70 animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 mb-1">
                          {language === 'ar' ? 'نوع الحساب / الدور المهني :' : 'Rôle professionnel souhaité :'}
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="admin">👑 Administrateur (Accès total)</option>
                          <option value="manager">🏢 Gérant (Commandes & gestion)</option>
                          <option value="employee">📦 Employé (Catalogue & produits)</option>
                          <option value="delivery">🚚 Livreur (Commandes confirmées)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 mb-1">
                          {language === 'ar' ? 'رمز أمان الإدارة (PIN Master) :' : 'Code PIN Master (ex: 1234) :'}
                        </label>
                        <input
                          type="password"
                          value={regPasscode}
                          onChange={(e) => setRegPasscode(e.target.value)}
                          placeholder="Entrez 1234 ou admin2026"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none"
                        />
                        <p className="text-[10px] text-amber-800 mt-1">
                          Code Master requis : <strong>1234</strong> ou <strong>admin2026</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {language === 'ar'
                      ? 'سيتم حفظ عنوانك وبياناتك للطلب بضغطة زر واحدة في المرات القادمة بدون إعادة إدخالها.'
                      : 'Vos coordonnées seront mémorisées pour commander en 1 clic sans avoir à retaper votre adresse.'}
                  </span>
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
                      <span>{language === 'ar' ? 'إنشاء حسابي الآن' : 'Créer mon Compte'}</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1 text-xs text-slate-600">
                  <span>{language === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Déjà inscrit ? '}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('login');
                      setRegError(null);
                    }}
                    className="font-bold text-[#002f6c] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'تسجيل الدخول مباشرة' : 'Se connecter directement'}
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
