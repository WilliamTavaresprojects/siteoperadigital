import React from 'react';
import { ShieldCheck, Heart, Users, Target, Building2, Award, Code2, Smartphone, MessageSquare } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-[#030712] text-white border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Sobre a Opera Digital
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Especialistas em Criação de <span className="text-blue-400">Websites, Aplicativos Web e WhatsApp Web</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Somos uma agência de tecnologia e desenvolvimento focada em construir soluções digitais completas. 
              Desenvolvemos websites de alta velocidade, aplicativos e sistemas web personalizados e automações para WhatsApp Web com robôs de atendimento 24/7.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Combinamos design exclusivo, engenharia de software de ponta e inteligência de negócios para garantir que cada projeto entregue resultados reais e mensuráveis para a sua empresa.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Código Limpo & Escalável</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Tecnologias modernas com alta segurança e performance.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Suporte & Acompanhamento</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Suporte contínuo pós-lançamento e atualizações.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B0F19] rounded-3xl p-8 text-white shadow-2xl relative border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0A4EE4] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/30">
                  O
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Opera Digital</h3>
                  <p className="text-xs text-slate-400">Desenvolvimento de Software & Automações</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800/80 rounded-xl text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    Websites & E-commerces
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">100% Sob Medida</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800/80 rounded-xl text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    Aplicativos & Sistemas Web
                  </span>
                  <span className="font-bold text-blue-400 font-mono">100% Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800/80 rounded-xl text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Automação WhatsApp Web
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">Robôs 24/7</span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-200">
                "Nosso compromisso é transformar sua visão tecnológica em um produto digital moderno, intuitivo e lucrativo."
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

