import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { AiAgentsSection } from './components/AiAgentsSection';
import { ProductsSection } from './components/ProductsSection';
import { PortfolioSection } from './components/PortfolioSection';
import { Testimonial } from './components/Testimonial';
import { AboutSection } from './components/AboutSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginModal } from './components/LoginModal';
import { TermsModal } from './components/TermsModal';
import { AdminPanel } from './components/AdminPanel';
import { DocumentationModal } from './components/DocumentationModal';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'register' | 'admin'>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms'
  });

  // Handle URL pathname, hash or search routes (e.g. /admin, /inscricao.html)
  useEffect(() => {
    const handleUrlRoute = () => {
      const rawPath = window.location.pathname;
      const rawHash = window.location.hash;
      const rawSearch = window.location.search;

      const path = rawPath.toLowerCase();
      const hash = rawHash.toLowerCase();
      const search = rawSearch.toLowerCase();

      // Check if user is accessing admin route (/admin or #admin or ?admin)
      const isAdminRoute = path.includes('admin') || hash.includes('admin') || search.includes('admin');
      
      if (isAdminRoute) {
        const isAlreadyAuthed = localStorage.getItem('opera_admin_auth') === 'true';
        if (isAlreadyAuthed) {
          setCurrentRoute('admin');
        } else {
          setLoginModalOpen(true);
        }
      } else if (path.includes('inscricao') || hash === '#inscricao') {
        setCurrentRoute('register');
      } else if (path === '/' || path === '/index.html' || hash === '#home') {
        setCurrentRoute('home');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  const navigateToRegister = () => {
    setCurrentRoute('register');
    window.history.pushState({}, '', '/inscricao.html');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentRoute('home');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTermsModal = (type: 'terms' | 'privacy') => {
    setTermsModal({ isOpen: true, type });
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('opera_admin_auth', 'true');
    setCurrentRoute('admin');
    setLoginModalOpen(false);
    window.history.pushState({}, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    const isAlreadyAuthed = localStorage.getItem('opera_admin_auth') === 'true';
    if (isAlreadyAuthed) {
      setCurrentRoute('admin');
    } else {
      setLoginModalOpen(true);
    }
    window.history.pushState({}, '', '/admin');
  };

  // If user is in Admin View
  if (currentRoute === 'admin') {
    return (
      <>
        <AdminPanel
          onLogout={() => {
            localStorage.removeItem('opera_admin_auth');
            setCurrentRoute('home');
            window.history.pushState({}, '', '/');
          }}
          onGoToSite={() => {
            setCurrentRoute('home');
            window.history.pushState({}, '', '/');
          }}
          onOpenDocs={() => setDocModalOpen(true)}
        />
        <DocumentationModal
          isOpen={docModalOpen}
          onClose={() => setDocModalOpen(false)}
        />
      </>
    );
  }

  // If user is on Registration Page (inscricao.html)
  if (currentRoute === 'register') {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100">
        <RegistrationPage
          onNavigateHome={navigateToHome}
          onOpenLogin={handleOpenLogin}
          onOpenTerms={() => openTermsModal('terms')}
          onOpenPrivacy={() => openTermsModal('privacy')}
        />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onNavigateToRegister={navigateToRegister}
          onLoginSuccess={handleLoginSuccess}
        />

        <TermsModal
          isOpen={termsModal.isOpen}
          type={termsModal.type}
          onClose={() => setTermsModal({ ...termsModal, isOpen: false })}
        />

        <DocumentationModal
          isOpen={docModalOpen}
          onClose={() => setDocModalOpen(false)}
        />
      </div>
    );
  }

  // Main Institutional Page (index.html)
  return (
    <div className="min-h-screen bg-[#030712] font-sans text-slate-100 selection:bg-[#0A4EE4]/40 selection:text-blue-200">
      
      {/* Sticky Header */}
      <Header
        onNavigateToRegister={navigateToRegister}
        onOpenLogin={handleOpenLogin}
        currentRoute={currentRoute}
        onNavigateHome={navigateToHome}
      />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero Section with Interactive Platform Dashboard Mockup */}
        <Hero onNavigateToRegister={navigateToRegister} />

        {/* 2. Stats Bar */}
        <StatsBar />

        {/* 3. Agentes de IA Section with Interactive Simulator */}
        <AiAgentsSection />

        {/* 4. Products Section with Alternating Blocks */}
        <ProductsSection onNavigateToRegister={navigateToRegister} />

        {/* 5. Trabalhos Realizados & Portfólio Dashboard */}
        <PortfolioSection />

        {/* 6. Customer Testimonial (Diego Costa - Tudo para Moto) */}
        <Testimonial />

        {/* 7. Sobre Section */}
        <AboutSection />

        {/* 8. Final Blue CTA Banner */}
        <CtaBanner onNavigateToRegister={navigateToRegister} />
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => openTermsModal('terms')}
        onOpenPrivacy={() => openTermsModal('privacy')}
        onNavigateToRegister={navigateToRegister}
        onOpenLogin={handleOpenLogin}
        onOpenDocs={() => setDocModalOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onNavigateToRegister={navigateToRegister}
        onLoginSuccess={handleLoginSuccess}
      />

      <TermsModal
        isOpen={termsModal.isOpen}
        type={termsModal.type}
        onClose={() => setTermsModal({ ...termsModal, isOpen: false })}
      />

      <DocumentationModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />

    </div>
  );
}
