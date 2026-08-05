import React, { useState, useEffect } from 'react';
import { 
  FileText, Layers, Store, Wallet, Truck, Check, ArrowRight, 
  Sparkles, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { PRODUCTS_LIST } from '../data/mockData';
import { getWhatsAppLink } from '../utils/siteSettings';

interface ProductsSectionProps {
  onNavigateToRegister: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onNavigateToRegister }) => {
  const [activePreview, setActivePreview] = useState<Record<string, string>>({});
  const [, setTick] = useState(0);

  useEffect(() => {
    const update = () => setTick(t => t + 1);
    window.addEventListener('opera_config_changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('opera_config_changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-6 h-6 text-blue-400" />;
      case 'Layers': return <Layers className="w-6 h-6 text-blue-400" />;
      case 'Store': return <Store className="w-6 h-6 text-blue-400" />;
      case 'Wallet': return <Wallet className="w-6 h-6 text-blue-400" />;
      case 'Truck': return <Truck className="w-6 h-6 text-blue-400" />;
      default: return <Sparkles className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section id="produtos" className="py-20 bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
              Serviços & Soluções em Tecnologia
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
            Desenvolvimento de Sites, Apps & <br className="hidden sm:inline" />
            <span className="text-blue-400">Automação para WhatsApp Web</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Soluções sob medida para elevar a presença digital e a produtividade do seu negócio. 
            Criamos projetos com alta performance, código limpo e foco total em conversão.
          </p>
        </div>

        {/* Alternating Products Blocks */}
        <div className="space-y-12 sm:space-y-20">
          {PRODUCTS_LIST.map((prod, index) => {
            const isEven = index % 2 === 0;

            return (
              <div 
                key={prod.id}
                id={`produto-${prod.id}`}
                className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center"
              >
                {/* Content Column */}
                <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                    {getProductIcon(prod.iconName)}
                    <span>{prod.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    {prod.title}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-lg leading-relaxed">
                    {prod.fullDesc}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-2.5 pt-1">
                    {prod.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-200">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action for Product */}
                  <div className="pt-2">
                    <a
                      href={getWhatsAppLink(`Olá! Gostaria de solicitar um orçamento sobre ${prod.title}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200"
                    >
                      <span>Solicitar Orçamento</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Mockup / Visual Column */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="bg-[#0B0F19] rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
                    
                    {/* Header of Mockup Card */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-mono text-slate-500 ml-2">
                          operadigital.com.br/módulo/{prod.id}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                        {prod.badge}
                      </span>
                    </div>

                    {/* Specific Mockup Previews Based on Service */}
                    {prod.id === 'websites' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[#111827] rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400 block">Performance & Velocidade</span>
                            <span className="text-xl font-bold text-white">100 / 100</span>
                            <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">Google PageSpeed</span>
                          </div>
                          <div className="p-3 bg-[#111827] rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400 block">Design & Interface</span>
                            <span className="text-xl font-bold text-blue-400">100% Responsivo</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Desktop & Celulares</span>
                          </div>
                        </div>

                        <div className="p-4 bg-[#080C14] text-white rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-300">
                            <span>Sistemas & Plataformas Utilizadas</span>
                            <span className="text-emerald-400">Tecnologia de Ponta</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {['React', 'Next.js', 'Tailwind CSS', 'WordPress', 'WooCommerce', 'Shopify', 'Node.js'].map((tech, tIdx) => (
                              <span key={tIdx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {prod.id === 'mobile-apps' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-400" />
                            <div>
                              <span className="text-xs font-bold text-white block">Tecnologia Web de Ponta</span>
                              <span className="text-[11px] text-slate-400">Acesso via Navegador em Qualquer Dispositivo</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                            Multiplataforma
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            { channel: 'Celulares & Tablets', label: 'Navegação fluida sem necessidade de download', status: 'Web App' },
                            { channel: 'Computadores & Notebooks', label: 'Acesso instantâneo de qualquer sistema', status: 'Sistemas Web' },
                            { channel: 'Segurança & Nuvem', label: 'Banco de dados e autenticação criptografada', status: '100% Seguro' }
                          ].map((item, i) => (
                            <div key={i} className="p-2.5 bg-[#111827] rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200">{item.channel}</span>
                              <span className="text-slate-400">{item.label}</span>
                              <span className="text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">{item.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {prod.id === 'whatsapp-services' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-[#080C14] text-white rounded-xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Serviço WhatsApp Web</span>
                            <span className="text-xl font-bold font-mono text-white">Central Multi-Atendentes</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-emerald-400 font-bold block">Status</span>
                            <span className="text-xs font-bold text-white font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              Online 24/7
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-[#111827] rounded-xl border border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between font-semibold text-slate-200">
                            <span>Robô de Resposta Automática + Transf. de Setores</span>
                            <span className="text-emerald-400 font-bold">Automação Ativa</span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            "Múltiplos colaboradores atendendo no mesmo número de WhatsApp da sua empresa com controle total de histórico e métricas de resposta."
                          </p>
                        </div>
                      </div>
                    )}

                    {prod.id === 'custom-systems' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-[#0A4EE4] text-white rounded-xl shadow-lg shadow-blue-600/20">
                          <span className="text-xs opacity-80 block">Software Sob Medida & Painel Admin</span>
                          <span className="text-xl font-extrabold font-mono mt-0.5 block">Arquitetura de Alta Segurança</span>
                          <div className="flex items-center gap-2 mt-3 text-xs opacity-90">
                            <span className="bg-white/20 px-2 py-0.5 rounded">Dashboards</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded">Integração de APIs</span>
                          </div>
                        </div>

                        <div className="p-3 bg-[#111827] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-200 block">Automação de Processos Empresariais</span>
                            <span className="text-slate-400">Desenvolvimento sob medida para suas regras de negócio</span>
                          </div>
                          <span className="text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                            Customizado
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
