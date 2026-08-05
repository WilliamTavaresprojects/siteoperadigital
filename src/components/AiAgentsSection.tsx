import React, { useState, useEffect } from 'react';
import { 
  Bot, MessageSquare, Zap, CheckCircle2, Sparkles, ArrowRight, Cpu
} from 'lucide-react';
import { AI_AGENTS_FEATURES } from '../data/mockData';
import { getWhatsAppLink } from '../utils/siteSettings';

export const AiAgentsSection: React.FC = () => {
  const [waLink, setWaLink] = useState(() => getWhatsAppLink("Olá! Gostaria de saber mais sobre os Agentes de IA para minha empresa."));

  useEffect(() => {
    const update = () => setWaLink(getWhatsAppLink("Olá! Gostaria de saber mais sobre os Agentes de IA para minha empresa."));
    window.addEventListener('opera_config_changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('opera_config_changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);
  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />;
      case 'Zap': return <Zap className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />;
      default: return <Sparkles className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />;
    }
  };

  return (
    <section id="agentes-ia" className="py-20 bg-[#030712] text-white relative overflow-hidden border-t border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
            <Cpu className="w-3.5 h-3.5" />
            <span>Inteligência Artificial & Automação</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Agentes de IA para <span className="text-blue-400">WhatsApp & Sistemas</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed pt-1">
            Transforme seu atendimento com robôs inteligentes, automações de mensagens e integração total com o seu negócio.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_AGENTS_FEATURES.map((feat) => {
            return (
              <div
                key={feat.id}
                className="p-6 bg-[#0B0F19] rounded-2xl border border-slate-800/90 hover:border-blue-500/50 hover:bg-[#0E1526] shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-[#0A4EE4] group-hover:border-[#0A4EE4] transition-colors duration-300 shadow-xs">
                      {getAgentIcon(feat.iconName)}
                    </div>

                    {feat.badge && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Sample Highlight */}
                {feat.sampleResponse && (
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono leading-tight flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span className="truncate">{feat.sampleResponse}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 text-center">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200"
          >
            <span>Solicitar Orçamento de Agente de IA</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

