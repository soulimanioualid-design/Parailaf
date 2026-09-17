import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { PRODUCT_ARABIC_TRANSLATIONS, CATEGORIES_ARABIC } from '../i18n/productTranslations';
import { Product } from '../types';

export interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  arabicEnabled: boolean;
  setArabicEnabled: (enabled: boolean) => Promise<void>;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  previewLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  translateProduct: (product: Product) => Product;
  translateCategory: (catId: string, defaultName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'parailaf_app_language';
const ARABIC_ENABLED_STORAGE_KEY = 'parailaf_arabic_enabled';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Arabic is disabled by default per administrator preference, until explicitly enabled in the dashboard
  const [arabicEnabled, setArabicEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(ARABIC_ENABLED_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      return false; // Default: Arabic disabled initially
    } catch {
      return false;
    }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const isArEnabled = localStorage.getItem(ARABIC_ENABLED_STORAGE_KEY) === 'true';
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ar' && isArEnabled) return 'ar';
      return 'fr';
    } catch {
      return 'fr';
    }
  });

  // Listen to Firestore settings/languages for real-time synchronization across devices
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const settingsRef = doc(db, 'settings', 'languages');
      unsubscribe = onSnapshot(settingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data.arabicEnabled === 'boolean') {
            setArabicEnabledState(data.arabicEnabled);
            try {
              localStorage.setItem(ARABIC_ENABLED_STORAGE_KEY, data.arabicEnabled ? 'true' : 'false');
            } catch {}

            // If disabled and current language is Arabic, fallback to French immediately
            if (!data.arabicEnabled && language === 'ar') {
              setLanguageState('fr');
              try {
                localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
              } catch {}
            }
          }
        }
      }, (error) => {
        console.warn('Firestore language settings listener error:', error);
      });
    } catch (err) {
      console.warn('Could not attach Firestore language listener:', err);
    }

    return () => unsubscribe();
  }, [language]);

  // If arabicEnabled changes to false, ensure we fall back to French
  useEffect(() => {
    if (!arabicEnabled && language === 'ar') {
      setLanguageState('fr');
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
      } catch {}
    }
  }, [arabicEnabled, language]);

  const isRTL = language === 'ar';

  const setArabicEnabled = async (enabled: boolean) => {
    setArabicEnabledState(enabled);
    try {
      localStorage.setItem(ARABIC_ENABLED_STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {}

    if (!enabled && language === 'ar') {
      setLanguageState('fr');
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
      } catch {}
    }

    try {
      await setDoc(doc(db, 'settings', 'languages'), {
        arabicEnabled: enabled,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not save language settings to Firestore:', err);
    }
  };

  const setLanguage = (lang: Language) => {
    // If attempting to switch to Arabic but it is disabled, keep French
    if (lang === 'ar' && !arabicEnabled) {
      setLanguageState('fr');
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
      } catch {}
      return;
    }

    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  };

  // Preview language (allows Admin to test without forcing public toggle)
  const previewLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    if (!arabicEnabled) {
      setLanguage('fr');
      return;
    }
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  // Synchronize document dir, lang attribute, and page title
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    if (isRTL) {
      document.body.classList.add('rtl-arabic');
      document.title = 'بارا إيلاف المغرب | مجسات فري ستايل ليبري 2 و 3 - مراقبة السكر بالمغرب';
    } else {
      document.body.classList.remove('rtl-arabic');
      document.title = 'Parailaf Maroc | FreeStyle Libre 2 & 3 - Suivi du Glucose au Maroc';
    }
  }, [language, isRTL]);

  const t = (key: string, fallback?: string): string => {
    const item = TRANSLATIONS[key];
    if (item && item[language]) {
      return item[language];
    }
    return fallback || item?.fr || key;
  };

  const translateProduct = (product: Product): Product => {
    if (!product) return product;
    if (language !== 'ar') return product;

    const arData = PRODUCT_ARABIC_TRANSLATIONS[product.id];
    if (!arData) {
      return product;
    }

    return {
      ...product,
      name: arData.nameAr || product.name,
      shortDescription: arData.shortDescriptionAr || product.shortDescription,
      badge: arData.badgeAr || product.badge,
      categoryLabel: arData.categoryLabelAr || product.categoryLabel,
      features: (arData.featuresAr && arData.featuresAr.length > 0) ? arData.featuresAr : product.features,
      boxContents: (arData.boxContentsAr && arData.boxContentsAr.length > 0) ? arData.boxContentsAr : product.boxContents,
    };
  };

  const translateCategory = (catId: string, defaultName: string): string => {
    if (language !== 'ar') return defaultName;
    const cat = CATEGORIES_ARABIC[catId];
    return cat?.nameAr || defaultName;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        arabicEnabled,
        setArabicEnabled,
        setLanguage,
        toggleLanguage,
        previewLanguage,
        t,
        translateProduct,
        translateCategory,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
