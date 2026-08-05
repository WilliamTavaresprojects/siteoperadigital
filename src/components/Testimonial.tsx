import React, { useState, useEffect } from 'react';
import { Star, Quote, TrendingUp, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStoredTestimonials } from '../utils/siteSettings';
import { TestimonialData } from '../types';
import { fetchSiteDataFromSupabase } from '../lib/supabaseData';

export const Testimonial: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(getStoredTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchSiteDataFromSupabase();
        if (data && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
          localStorage.setItem('opera_testimonials', JSON.stringify(data.testimonials));
          return;
        }
      } catch (e) {
        console.error(e);
      }
      const list = getStoredTestimonials();
      setTestimonials(list);
    };

    loadTestimonials();

    const interval = setInterval(loadTestimonials, 5000);

    window.addEventListener('opera_config_changed', loadTestimonials);
    window.addEventListener('storage', loadTestimonials);
    return () => {
      clearInterval(interval);
      window.removeEventListener('opera_config_changed', loadTestimonials);
      window.removeEventListener('storage', loadTestimonials);
    };
  }, []);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex] || testimonials[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[#030712] text-white relative overflow-hidden border-t border-slate-800/80">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0A4EE4]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-[#0B0F19] rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative">
          
          <Quote className="absolute top-6 right-8 w-16 h-16 text-slate-800/60 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Author Photo & Highlight Badge */}
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:border-r lg:border-slate-800 lg:pr-8">
              <div className="relative mb-4">
                <img 
                  src={current.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250"} 
                  alt={current.author}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#0A4EE4] shadow-lg shadow-blue-600/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-lg shadow-md">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <h4 className="font-extrabold text-xl text-white">
                {current.author}
              </h4>

              <p className="text-xs text-blue-400 font-semibold mt-0.5">
                {current.role}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {current.company}
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 mt-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {(current.tags || []).map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Quote Content & Results */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{current.metrics}</span>
                </div>

                {testimonials.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Depoimento Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentIndex + 1} / {testimonials.length}
                    </span>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Próximo Depoimento"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-lg sm:text-2xl font-semibold text-slate-100 leading-relaxed italic">
                "{current.quote}"
              </p>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <span>
                  Sistemas web, e-commerces, aplicativos mobile e robôs de atendimento no WhatsApp Web
                </span>
                <span className="text-blue-400 font-bold">
                  Soluções Sob Medida Opera Digital
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

