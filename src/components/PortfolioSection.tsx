import { useState, useEffect, MouseEvent } from 'react';
import { 
  ExternalLink, Search, Sparkles, Globe, 
  CheckCircle2, Copy, Check, Eye, Trash2, 
  Building2, TrendingUp
} from 'lucide-react';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/mockData';
import { PortfolioProject } from '../types';

export const PortfolioSection = () => {
  const [projects] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Todos', 'E-commerce', 'ERP & PDV', 'Automações & IA', 'Portais & Web Apps'];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q || 
      p.title.toLowerCase().includes(q) || 
      p.clientName.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const handleCopyLink = (e: MouseEvent, link: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenLiveLink = (link: string) => {
    let url = link;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="trabalhos" className="py-20 bg-[#030712] text-white border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3 shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Trabalhos Realizados & Portfólio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              VEJA NOSSOS DESENVOLVIMENTOS REALIZADOS
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Confira os sistemas, e-commerces e automações implantados. Clique em qualquer trabalho para ver o resultado final ao vivo.
            </p>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 p-12 text-center max-w-md mx-auto my-8">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-200 text-base">Nenhum trabalho encontrado</h3>
            <p className="text-xs text-slate-400 mt-1">Tente buscar por outra categoria ou termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-[#0B0F19] rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-slate-900/40 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-[#030712]/90 backdrop-blur-md text-blue-400 border border-blue-500/20 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[11px] font-medium opacity-90 uppercase tracking-wider text-slate-300">
                      Cliente: {project.clientName}
                    </div>
                    <h3 className="text-lg font-extrabold leading-snug line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span>Métrica do Projeto:</span>
                    </div>
                    <span className="text-xs font-black text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shadow-2xs">
                      {project.resultMetric}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCopyLink(e, project.resultLink, project.id)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                        title="Copiar link direto"
                      >
                        {copiedId === project.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLiveLink(project.resultLink);
                        }}
                        className="bg-[#0A4EE4] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Ver Resultado</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-[#0B0F19] rounded-3xl max-w-3xl w-full border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#080C14] px-4 py-3 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg ml-3 max-w-xs font-mono truncate">
                  <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{selectedProject.resultLink}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenLiveLink(selectedProject.resultLink)}
                  className="bg-[#0A4EE4] hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Abrir em Nova Aba</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <span className="text-lg">&times;</span>
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  <span>{selectedProject.category}</span>
                  <span>&bull;</span>
                  <span>Cliente: {selectedProject.clientName}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedProject.title}</h3>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-64 sm:h-80 bg-slate-900">
                <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button
                    onClick={() => handleOpenLiveLink(selectedProject.resultLink)}
                    className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-2xl transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5 text-white" />
                    <span>Acessar Resultado Final On-line</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Impacto Alcançado</span>
                  <div className="text-2xl font-black text-blue-400 mt-0.5">{selectedProject.resultMetric}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyLink(e, selectedProject.resultLink, selectedProject.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 shadow-2xs flex items-center gap-2"
                  >
                    {copiedId === selectedProject.id ? (
                      <><Check className="w-4 h-4 text-emerald-400" /><span>Link Copiado!</span></>
                    ) : (
                      <><Copy className="w-4 h-4" /><span>Copiar URL do Projeto</span></>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-2">Sobre este trabalho:</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-2 uppercase tracking-wider text-slate-400">Tecnologias & Soluções Aplicadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-900 text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-800">#{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#080C14] p-4 px-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Link: <strong className="font-mono text-slate-200">{selectedProject.resultLink}</strong>
              </span>
              <button onClick={() => setSelectedProject(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
