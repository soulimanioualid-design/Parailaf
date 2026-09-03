import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { CategoryPills } from './components/CategoryPills';
import { ProductGrid } from './components/ProductGrid';
import { FreeStyleGuideSection } from './components/FreeStyleGuideSection';
import { AdvantagesSection } from './components/AdvantagesSection';
import { VideoSection } from './components/VideoSection';
import { WhyUsSection } from './components/WhyUsSection';
import { SoloPromoFlyerSection } from './components/SoloPromoFlyerSection';
import { PromoOffersBottomSection } from './components/PromoOffersBottomSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { AboutModal, ContactModal, LegalModal } from './components/InfoModals';

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [legalModalInfo, setLegalModalInfo] = useState<{ title: string; content: string } | null>(null);

  const handleOpenLegal = (title: string, content: string) => {
    setLegalModalInfo({ title, content });
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Header (Desktop + Mobile) */}
        <Header 
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection />

          {/* Category Navigation Pills */}
          <CategoryPills />

          {/* Featured & Filterable Products Grid */}
          <ProductGrid />

          {/* 3-Step FreeStyle Libre Visual Explanation */}
          <FreeStyleGuideSection />

          {/* 4 Advantages Trust Cards */}
          <AdvantagesSection />

          {/* Video Demonstration Section */}
          <VideoSection />

          {/* Why Order From Us (Reassurance) */}
          <WhyUsSection />

          {/* Produit Offre Spéciale Affiche (Seul avec Bouton WhatsApp & Commande) */}
          <SoloPromoFlyerSection />

          {/* Offres & Tarifs Complémentaires */}
          <PromoOffersBottomSection />

          {/* Moroccan Verified Reviews */}
          <TestimonialsSection />

          {/* FAQ Accordion Section */}
          <FaqSection />
        </main>

        {/* Footer */}
        <Footer 
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenLegal={handleOpenLegal}
        />

        {/* Mobile Fixed Bottom Navigation */}
        <MobileBottomNav 
          onOpenCategoriesDrawer={() => {}}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {/* Floating WhatsApp Bubble */}
        <FloatingWhatsApp />

        {/* Slide-in Cart Drawer */}
        <CartDrawer />

        {/* 1-Step Moroccan Express Checkout Modal */}
        <CheckoutModal />

        {/* Product Details & Specs Modal */}
        <ProductDetailModal />

        {/* Back-office Admin Orders Dashboard */}
        <AdminDashboard />

        {/* Interactive Toast Notifications */}
        <Toast />

        {/* Info & Legal Modals */}
        <AboutModal 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
        />
        
        <ContactModal 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
        />

        {legalModalInfo && (
          <LegalModal
            isOpen={!!legalModalInfo}
            onClose={() => setLegalModalInfo(null)}
            title={legalModalInfo.title}
            content={legalModalInfo.content}
          />
        )}

      </div>
    </CartProvider>
  );
}
