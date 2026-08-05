import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronDown, Layers, FileText, Store, Wallet, Truck, 
  ArrowRight, Sparkles, Shield, User, LogIn, Check
} from 'lucide-react';
import { PRODUCTS_LIST } from '../data/mockData';
import { getWhatsAppLink } from '../utils/siteSettings';

interface HeaderProps {
  onNavigateToRegister: () => void;
  onOpenLogin: () => void;
  currentRoute: 'home' | 'register';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToRegister,
  onOpenLogin,
  currentRoute,
  onNavigateHome
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [waLink, setWaLink] = useState(() => getWhatsAppLink("Olá! Gostaria de solicitar um orçamento com a Opera Digital."));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const updateWa = () => {
      setWaLink(getWhatsAppLink("Olá! Gostaria de solicitar um orçamento com a Opera Digital."));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('opera_config_changed', updateWa);
    window.addEventListener('storage', updateWa);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('opera_config_changed', updateWa);
      window.removeEventListener('storage', updateWa);
    };
  }, []);

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Store': return <Store className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Truck': return <Truck className="w-5 h-5 text-[#0A4EE4]" />;
      default: return <Sparkles className="w-5 h-5 text-[#0A4EE4]" />;
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#030712]/95 backdrop-blur-md shadow-2xl shadow-black/80 border-b border-slate-800/80 py-3' 
          : 'bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Parceiro Oficial */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <img 
                src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
                alt="Opera Digital Logo" 
                className="h-8 w-auto object-contain rounded-lg shadow-xs bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Opera <span className="text-[#0A4EE4]">Digital</span>
                </span>
              </div>
            </button>

            {/* Parceiro Oficial Badge */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-800">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Parceiro Oficial
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {/* Products Mega Menu Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setProductsMenuOpen(true)}
              onMouseLeave={() => setProductsMenuOpen(false)}
            >
              <button 
                className="flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors py-2"
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
              >
                <span>Produtos</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsMenuOpen ? 'rotate-180 text-blue-400' : 'text-blue-400'}`} />
              </button>

              {/* Mega Menu Container */}
              {productsMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#0B0F19] rounded-2xl shadow-2xl shadow-black/90 border border-slate-800 p-6 grid grid-cols-2 gap-4 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                      Serviços de Desenvolvimento Opera Digital
                    </span>
                    <span className="text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                      Sites, Apps & WhatsApp
                    </span>
                  </div>

                  {PRODUCTS_LIST.map((prod) => (
                    <a
                      key={prod.id}
                      href={`#produto-${prod.id}`}
                      onClick={() => setProductsMenuOpen(false)}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-800"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-[#0A4EE4] group-hover:text-white transition-colors shrink-0">
                        {getProductIcon(prod.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                            {prod.title}
                          </h4>
                          {prod.badge && (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                              {prod.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {prod.shortDesc}
                        </p>
                      </div>
                    </a>
                  ))}

                  <div className="col-span-2 mt-2 pt-3 border-t border-slate-800 bg-[#080C14] -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span>Todos os módulos integrados em uma só plataforma</span>
                    </div>
                    <a 
                      href="#agentes-ia"
                      onClick={() => setProductsMenuOpen(false)}
                      className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Conhecer Agentes de IA <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a 
              href="#trabalhos" 
              className="hover:text-white transition-colors font-semibold"
            >
              Trabalhos Realizados
            </a>

            <a 
              href="#agentes-ia" 
              className="hover:text-white transition-colors"
            >
              Agentes de IA
            </a>

            <a 
              href="#sobre" 
              className="hover:text-white transition-colors"
            >
              Sobre
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0A4EE4] hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center gap-1.5"
            >
              <span>Solicitar Orçamento</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-300 hover:bg-slate-800 active:bg-slate-700 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative z-50 md:hidden bg-[#0B0F19] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto text-slate-200">
            <div className="space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-wider text-slate-500 px-3 py-1">
                Navegação Principal
              </div>
              
              {/* Products Accordion for Mobile */}
              <div className="space-y-1 bg-[#111827] p-3 rounded-2xl border border-slate-800 my-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Produtos
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    Módulos ERP
                  </span>
                </div>
                {PRODUCTS_LIST.map((prod) => (
                  <a
                    key={prod.id}
                    href={`#produto-${prod.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 text-sm font-semibold text-slate-300 hover:text-white active:bg-slate-800 rounded-xl transition-colors min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                        {getProductIcon(prod.iconName)}
                      </div>
                      <span>{prod.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {prod.category}
                    </span>
                  </a>
                ))}
              </div>

              <a
                href="#trabalhos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-200 hover:bg-slate-800 active:bg-slate-800/80 rounded-xl transition-colors min-h-[44px]"
              >
                Trabalhos Realizados
              </a>
              <a
                href="#agentes-ia"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-200 hover:bg-slate-800 active:bg-slate-800/80 rounded-xl transition-colors min-h-[44px]"
              >
                Agentes de IA
              </a>
              <a
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-200 hover:bg-slate-800 active:bg-slate-800/80 rounded-xl transition-colors min-h-[44px]"
              >
                Sobre a Opera Digital
              </a>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-12 text-center font-bold text-white bg-[#0A4EE4] hover:bg-blue-600 active:bg-blue-700 rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
