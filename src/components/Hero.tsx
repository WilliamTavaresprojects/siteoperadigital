import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, Globe, Smartphone, MessageSquare, 
  CheckCircle2, Zap, Shield, ShieldCheck, Bot, Send
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/siteSettings';

interface HeroProps {
  onNavigateToRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister }) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'apps' | 'whatsapp'>('sites');
  const [waLink, setWaLink] = useState(() => getWhatsAppLink("Olá! Gostaria de falar com o time da Opera Digital."));

  useEffect(() => {
    const updateWa = () => {
      setWaLink(getWhatsAppLink("Olá! Gostaria de falar com o time da Opera Digital."));
    };
    window.addEventListener('opera_config_changed', updateWa);
    window.addEventListener('storage', updateWa);
    return () => {
      window.removeEventListener('opera_config_changed', updateWa);
      window.removeEventListener('storage', updateWa);
    };
  }, []);

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden bg-[#030712] text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#0A4EE4]/20 via-blue-900/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-5 text-left">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Estratégia & Crescimento</span>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Parceiro Oficial <strong className="text-white font-black tracking-normal text-xs bg-[#0A4EE4]/80 px-2 py-0.5 rounded-md ml-1">Olist</strong></span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-5xl font-black text-white leading-[1.15] tracking-tight">
                Sua empresa pronta para o <span className="bg-gradient-to-r from-blue-400 via-[#0A4EE4] to-cyan-400 bg-clip-text text-transparent">próximo passo.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-lg leading-relaxed pt-1">
              Ajudamos empresas e profissionais a crescer com estratégia clara, execução próxima e conhecimento prático.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0A4EE4] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Conheça a Opera</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sites & Lojas Virtuais
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Aplicativos Web
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Automação WhatsApp Web
              </span>
            </div>
          </div>

          {/* Right Visual / Interactive Mockup Column */}
          <div className="relative mt-2 lg:mt-0">
            <div className="bg-[#0B0F19] rounded-2xl shadow-2xl shadow-blue-950/40 border border-slate-800 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-300 text-white">
              {/* Top Browser Bar */}
              <div className="bg-[#080C14] px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>

                {/* Mockup Tabs */}
                <div className="flex bg-slate-900 p-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none border border-slate-800">
                  <button
                    onClick={() => setActiveTab('sites')}
                    className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                      activeTab === 'sites' ? 'bg-[#0A4EE4] text-white shadow-xs' : 'hover:text-white'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Websites & Apps</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('apps')}
                    className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                      activeTab === 'apps' ? 'bg-[#0A4EE4] text-white shadow-xs' : 'hover:text-white'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Aplicativo Web</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                      activeTab === 'whatsapp' ? 'bg-[#0A4EE4] text-white shadow-xs' : 'hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp Web</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Content Preview per Tab */}
              <div className="p-4 sm:p-6 min-h-[260px] flex flex-col justify-between space-y-4">
                {activeTab === 'sites' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span>Desenvolvimento Web Sob Medida</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Design moderno, responsivo e otimizado para SEO</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Alta Performance
                      </span>
                    </div>

                    <div className="bg-[#111827] rounded-xl p-3 border border-slate-800 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
                      <div className="pt-2 flex gap-2">
                        <div className="h-8 bg-[#0A4EE4] rounded-lg flex-1 flex items-center justify-center text-[10px] font-bold">
                          Ver E-commerce Demo
                        </div>
                        <div className="h-8 bg-slate-800 rounded-lg flex-1 flex items-center justify-center text-[10px] font-bold text-slate-300">
                          Site Institucional
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="bg-[#111827] p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Carregamento em &lt;1s</span>
                      </div>
                      <div className="bg-[#111827] p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                        <span>SSL & HTTPS Grátis</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'apps' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span>Aplicativo Web & Sistemas</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Desenvolvimento de plataformas e sistemas web sob medida</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        Aplicativos Web
                      </span>
                    </div>

                    <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0A4EE4]/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white">Plataforma Web Exclusiva</div>
                        <div className="text-[11px] text-slate-400">Acesso instantâneo pelo navegador, painel de gestão e banco de dados em nuvem.</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <span>Automação WhatsApp Web</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Atendimento automático 24/7 e múltiplos atendentes</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        WhatsApp Web Active
                      </span>
                    </div>

                    <div className="bg-[#111827] p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-bold">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-slate-800 text-slate-200 text-xs p-2.5 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed">
                          Olá! Sou o assistente virtual. Como posso te ajudar hoje?
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <div className="bg-[#0A4EE4] text-white text-xs p-2.5 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed">
                          Gostaria de solicitar um orçamento para desenvolvimento de site!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

