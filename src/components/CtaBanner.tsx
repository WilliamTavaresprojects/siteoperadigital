import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '../utils/siteSettings';

interface CtaBannerProps {
  onNavigateToRegister: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onNavigateToRegister }) => {
  const [waLink, setWaLink] = useState(() => getWhatsAppLink("Olá! Gostaria de solicitar um orçamento com a Opera Digital."));

  useEffect(() => {
    const update = () => setWaLink(getWhatsAppLink("Olá! Gostaria de solicitar um orçamento com a Opera Digital."));
    window.addEventListener('opera_config_changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('opera_config_changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);
  return (
    <section className="py-20 bg-[#030712] text-white relative overflow-hidden border-t border-slate-800/80">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0B0F19] rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Transforme sua presença digital hoje</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Tire o seu projeto do papel <br className="hidden sm:inline" />
            com a Opera Digital
          </h2>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Desenvolvimento de websites modernos, aplicativos web e automação de atendimento no WhatsApp Web.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#0A4EE4] hover:bg-blue-600 text-white font-extrabold text-base px-9 py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2.5 group"
            >
              <span>Solicitar Orçamento</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
              Desenvolvimento sob medida
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
              Sistemas e Aplicações Web
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Suporte e garantia de código
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
