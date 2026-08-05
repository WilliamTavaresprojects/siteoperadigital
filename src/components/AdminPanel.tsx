import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, ExternalLink, Trash2, Edit3, Search, 
  Users, TrendingUp, Sparkles, LogOut, CheckCircle2, ArrowLeft,
  MessageSquare, Globe, Tag, RefreshCw, BarChart3, ShieldCheck, Mail, Phone,
  Video, Calendar, Clock, CheckSquare, Layers, Play, DollarSign, ChevronRight,
  Filter, FileText, Check, AlertCircle, ArrowUpRight, Copy, Eye, UserPlus, FolderKanban,
  Menu, X, Star, Quote, PhoneCall, Settings
} from 'lucide-react';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/mockData';
import { 
  INITIAL_AGENCY_PROJECTS, 
  INITIAL_AGENCY_CLIENTS 
} from '../data/agencyMockData';
import { 
  PortfolioProject, AgencyProject, AgencyClient, ProjectStatus, TestimonialData 
} from '../types';
import { 
  getCleanWhatsAppNumber, 
  setWhatsAppNumber, 
  getStoredTestimonials, 
  saveStoredTestimonials,
  getWhatsAppLink 
} from '../utils/siteSettings';
import { forceClearCacheAndReload } from '../utils/cacheUtils';
import { fetchSiteDataFromSupabase, saveSiteDataToSupabase } from '../lib/supabaseData';

interface AdminPanelProps {
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onGoToSite }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'clients' | 'portfolio' | 'leads' | 'financials' | 'whatsapp' | 'testimonials'>('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const [isServerDataLoaded, setIsServerDataLoaded] = useState(false);

  // --- 1. Agency Projects State ---
  const [projects, setAgencyProjects] = useState<AgencyProject[]>(() => {
    try {
      const saved = localStorage.getItem('opera_agency_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AGENCY_PROJECTS;
  });

  const [projectFilterStatus, setProjectFilterStatus] = useState<string>('Todos');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('Todas');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingAgencyProject, setEditingAgencyProject] = useState<AgencyProject | null>(null);
  const [projectsViewMode, setProjectsViewMode] = useState<'kanban' | 'list'>('kanban');

  // New/Edit Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projCategory, setProjCategory] = useState<AgencyProject['category']>('Desenvolvimento Web');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('Em andamento');
  const [projValue, setProjValue] = useState<number>(10000);
  const [projProgress, setProjProgress] = useState<number>(20);
  const [projDeadline, setProjDeadline] = useState('2026-09-30');
  const [projDesc, setProjDesc] = useState('');
  const [projDeliverablesText, setProjDeliverablesText] = useState('');

  // --- 3. Agency Clients State ---
  const [clients, setAgencyClients] = useState<AgencyClient[]>(() => {
    try {
      const saved = localStorage.getItem('opera_agency_clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AGENCY_CLIENTS;
  });

  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientCompany, setClientCompany] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCnpj, setClientCnpj] = useState('');
  const [clientPlan, setClientPlan] = useState('Retainer Pro Agency');
  const [clientFee, setClientFee] = useState<number>(3500);

  // --- 4. Showcase Portfolio State (Landing page) ---
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem('opera_portfolio_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PORTFOLIO_PROJECTS;
  });

  // Showcase form
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseClient, setShowcaseClient] = useState('');
  const [showcaseCategory, setShowcaseCategory] = useState<PortfolioProject['category']>('E-commerce');
  const [showcaseDesc, setShowcaseDesc] = useState('');
  const [showcaseMetric, setShowcaseMetric] = useState('');
  const [showcaseLink, setShowcaseLink] = useState('');
  const [showcaseImage, setShowcaseImage] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // --- 5. Registered Leads State ---
  const [leads, setLeads] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('opera_registered_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // --- 6. WhatsApp Number State ---
  const [whatsappInput, setWhatsappInput] = useState(() => getCleanWhatsAppNumber());
  const [whatsappSavedMessage, setWhatsappSavedMessage] = useState(false);

  const handleSaveWhatsAppNumber = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsAppNumber(whatsappInput);
    setWhatsappSavedMessage(true);
    setTimeout(() => setWhatsappSavedMessage(false), 3000);
  };

  // --- 7. Testimonials Management State ---
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(() => getStoredTestimonials());
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [testimonialSavedMessage, setTestimonialSavedMessage] = useState(false);

  const handleSaveAllTestimonials = () => {
    saveStoredTestimonials(testimonials);
    setTestimonialSavedMessage(true);
    setTimeout(() => setTestimonialSavedMessage(false), 3000);
  };

  const [tAuthor, setTAuthor] = useState('');
  const [tRole, setTRole] = useState('');
  const [tCompany, setTCompany] = useState('');
  const [tMetrics, setTMetrics] = useState('');
  const [tQuote, setTQuote] = useState('');
  const [tAvatarUrl, setTAvatarUrl] = useState('');
  const [tTagsText, setTTagsText] = useState('');

  const handleOpenNewTestimonialModal = () => {
    setEditingTestimonial(null);
    setTAuthor('');
    setTRole('');
    setTCompany('');
    setTMetrics('+40% em Conversão');
    setTQuote('');
    setTAvatarUrl('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250');
    setTTagsText('WhatsApp, E-commerce, Sites');
    setTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonialModal = (item: TestimonialData) => {
    setEditingTestimonial(item);
    setTAuthor(item.author);
    setTRole(item.role);
    setTCompany(item.company);
    setTMetrics(item.metrics);
    setTQuote(item.quote);
    setTAvatarUrl(item.avatarUrl);
    setTTagsText((item.tags || []).join(', '));
    setTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tTagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    let updatedList: TestimonialData[];
    if (editingTestimonial) {
      updatedList = testimonials.map(t => 
        t.id === editingTestimonial.id
          ? {
              ...t,
              author: tAuthor,
              role: tRole,
              company: tCompany,
              metrics: tMetrics,
              quote: tQuote,
              avatarUrl: tAvatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
              tags: tagsArray
            }
          : t
      );
    } else {
      const newTestimonial: TestimonialData = {
        id: 'test-' + Date.now(),
        author: tAuthor,
        role: tRole,
        company: tCompany,
        metrics: tMetrics,
        quote: tQuote,
        avatarUrl: tAvatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
        tags: tagsArray
      };
      updatedList = [newTestimonial, ...testimonials];
    }

    setTestimonials(updatedList);
    saveStoredTestimonials(updatedList);
    setTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (id?: string, name?: string) => {
    if (!id) return;
    setDeleteConfirm({
      title: 'Excluir Depoimento',
      message: `Tem certeza que deseja excluir o depoimento de "${name || 'Cliente'}"?`,
      action: () => {
        setTestimonials(prev => {
          const updatedList = prev.filter(t => t.id !== id);
          saveStoredTestimonials(updatedList);
          return updatedList;
        });
      }
    });
  };

  // Save changes to localStorage and Supabase
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const data = await fetchSiteDataFromSupabase();
        if (data) {
          if (Array.isArray(data.portfolioProjects) && data.portfolioProjects.length > 0) {
            setPortfolioProjects(data.portfolioProjects);
            localStorage.setItem('opera_portfolio_projects', JSON.stringify(data.portfolioProjects));
          }
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
            localStorage.setItem('opera_testimonials', JSON.stringify(data.testimonials));
          }
          if (Array.isArray(data.agencyProjects) && data.agencyProjects.length > 0) {
            setAgencyProjects(data.agencyProjects);
            localStorage.setItem('opera_agency_projects', JSON.stringify(data.agencyProjects));
          }
          if (Array.isArray(data.agencyClients) && data.agencyClients.length > 0) {
            setAgencyClients(data.agencyClients);
            localStorage.setItem('opera_agency_clients', JSON.stringify(data.agencyClients));
          }
          if (Array.isArray(data.registeredLeads)) {
            setLeads(data.registeredLeads);
          }
          if (data.whatsappNumber) {
            setWhatsappInput(data.whatsappNumber);
          }
        }
      } catch (e) {
        console.error('Error fetching site-data in AdminPanel:', e);
      } finally {
        setIsServerDataLoaded(true);
      }
    };
    fetchSiteData();

    // Auto sync across devices every 6 seconds
    const interval = setInterval(fetchSiteData, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isServerDataLoaded) return;
    localStorage.setItem('opera_agency_projects', JSON.stringify(projects));
    saveSiteDataToSupabase({ agencyProjects: projects }).catch(e => console.error(e));
  }, [projects, isServerDataLoaded]);

  useEffect(() => {
    if (!isServerDataLoaded) return;
    localStorage.setItem('opera_agency_clients', JSON.stringify(clients));
    saveSiteDataToSupabase({ agencyClients: clients }).catch(e => console.error(e));
  }, [clients, isServerDataLoaded]);

  useEffect(() => {
    if (!isServerDataLoaded) return;
    localStorage.setItem('opera_portfolio_projects', JSON.stringify(portfolioProjects));
    saveSiteDataToSupabase({ portfolioProjects }).catch(e => console.error(e));
    window.dispatchEvent(new Event('opera_config_changed'));
  }, [portfolioProjects, isServerDataLoaded]);

  useEffect(() => {
    if (!isServerDataLoaded) return;
    localStorage.setItem('opera_registered_leads', JSON.stringify(leads));
    saveSiteDataToSupabase({ registeredLeads: leads }).catch(e => console.error(e));
  }, [leads, isServerDataLoaded]);

  // Handler: Change Project Status (Drag or Dropdown)
  const handleUpdateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    setAgencyProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const isCompleted = newStatus === 'Concluído';
        return { 
          ...p, 
          status: newStatus,
          progressPercentage: isCompleted ? 100 : p.progressPercentage === 100 ? 80 : p.progressPercentage
        };
      }
      return p;
    }));
  };

  // Handler: Save Project (Create / Edit)
  const handleSaveAgencyProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projClient.trim()) return;

    const deliverablesList = projDeliverablesText.split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: 'd-' + idx, text, done: false }));

    if (editingAgencyProject) {
      setAgencyProjects(prev => prev.map(p => {
        if (p.id === editingAgencyProject.id) {
          return {
            ...p,
            title: projTitle,
            clientName: projClient,
            category: projCategory,
            status: projStatus,
            value: projValue,
            progressPercentage: projProgress,
            deadlineDate: projDeadline,
            description: projDesc,
            deliverables: deliverablesList.length > 0 ? deliverablesList : p.deliverables
          };
        }
        return p;
      }));
    } else {
      const newP: AgencyProject = {
        id: 'proj-' + Date.now(),
        title: projTitle,
        clientName: projClient,
        category: projCategory,
        status: projStatus,
        startDate: new Date().toISOString().substring(0, 10),
        deadlineDate: projDeadline,
        value: projValue,
        progressPercentage: projProgress,
        description: projDesc || 'Projeto gerenciado pelo Opera Digital.',
        deliverables: deliverablesList.length > 0 ? deliverablesList : [
          { id: 'd1', text: 'Reunião de Briefing & Arquitetura', done: true },
          { id: 'd2', text: 'Desenvolvimento e Homologação', done: false }
        ],
        assignedTeam: ['William Tavares (Gestor)']
      };
      setAgencyProjects([newP, ...projects]);
    }

    setProjectModalOpen(false);
    setEditingAgencyProject(null);
  };

  // Handler: Open Edit Agency Project
  const handleOpenEditAgencyProject = (p: AgencyProject) => {
    setEditingAgencyProject(p);
    setProjTitle(p.title);
    setProjClient(p.clientName);
    setProjCategory(p.category);
    setProjStatus(p.status);
    setProjValue(p.value);
    setProjProgress(p.progressPercentage);
    setProjDeadline(p.deadlineDate);
    setProjDesc(p.description);
    setProjDeliverablesText(p.deliverables.map(d => d.text).join('\n'));
    setProjectModalOpen(true);
  };

  // Handler: Delete Agency Project
  const handleDeleteAgencyProject = (id: string, title?: string) => {
    setDeleteConfirm({
      title: 'Excluir Projeto',
      message: `Deseja realmente excluir o projeto "${title || 'selecionado'}"? Esta ação não poderá ser desfeita.`,
      action: () => {
        setAgencyProjects(prev => prev.filter(p => p.id !== id));
      }
    });
  };

  // Handler: Delete Client
  const handleDeleteClient = (id: string, companyName?: string) => {
    setDeleteConfirm({
      title: 'Excluir Cliente',
      message: `Deseja realmente excluir o cliente "${companyName || 'selecionado'}" da base?`,
      action: () => {
        setAgencyClients(prev => prev.filter(c => c.id !== id));
      }
    });
  };

  // Handler: Delete Portfolio Showcase Item
  const handleDeletePortfolioProject = (id: string, title?: string) => {
    setDeleteConfirm({
      title: 'Remover do Portfólio',
      message: `Deseja realmente remover o trabalho "${title || 'selecionado'}" do portfólio?`,
      action: () => {
        setPortfolioProjects(prev => prev.filter(p => p.id !== id));
      }
    });
  };

  // Handler: Delete Lead
  const handleDeleteLead = (index: number, name?: string) => {
    setDeleteConfirm({
      title: 'Excluir Lead',
      message: `Deseja realmente excluir o lead "${name || 'recebido'}"?`,
      action: () => {
        setLeads(prev => prev.filter((_, idx) => idx !== index));
      }
    });
  };

  // Handler: Toggle Deliverable Task Done
  const handleToggleDeliverable = (projectId: string, deliverableId: string) => {
    setAgencyProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedDeliverables = p.deliverables.map(d => 
          d.id === deliverableId ? { ...d, done: !d.done } : d
        );
        const doneCount = updatedDeliverables.filter(d => d.done).length;
        const total = updatedDeliverables.length;
        const newProgress = total > 0 ? Math.round((doneCount / total) * 100) : p.progressPercentage;
        
        return {
          ...p,
          deliverables: updatedDeliverables,
          progressPercentage: newProgress,
          status: newProgress === 100 ? 'Concluído' : p.status
        };
      }
      return p;
    }));
  };

  // Handler: Save Portfolio Showcase Item for Main Site
  const handleSavePortfolioProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseTitle.trim()) return;

    const newP: PortfolioProject = {
      id: 'port-' + Date.now(),
      title: showcaseTitle,
      clientName: showcaseClient || 'Cliente Opera Digital',
      category: showcaseCategory as any,
      description: showcaseDesc || 'Projeto de alta tecnologia desenvolvido sob medida pela Opera Digital.',
      resultMetric: showcaseMetric || '100% de Satisfação',
      resultLink: showcaseLink || 'https://www.operadigital.site',
      imageUrl: showcaseImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      tags: [showcaseCategory, 'Opera Digital'],
      completedDate: new Date().toISOString().split('T')[0]
    };

    setPortfolioProjects(prev => [newP, ...prev]);
    setShowcaseModalOpen(false);
    setShowcaseTitle('');
    setShowcaseClient('');
    setShowcaseCategory('E-commerce');
    setShowcaseDesc('');
    setShowcaseMetric('');
    setShowcaseLink('');
    setShowcaseImage('');
  };

  // Handler: Add Client
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany.trim()) return;

    const newClient: AgencyClient = {
      id: 'cli-' + Date.now(),
      companyName: clientCompany,
      contactPerson: clientContact || 'Representante',
      email: clientEmail || 'contato@empresa.com.br',
      phone: clientPhone || '(11) 98888-7777',
      cnpj: clientCnpj || '00.000.000/0001-00',
      contractPlan: clientPlan,
      monthlyFee: clientFee,
      status: 'Ativo',
      activeProjectsCount: 0,
      joinedDate: new Date().toISOString().substring(0, 10)
    };

    setAgencyClients([newClient, ...clients]);
    setClientModalOpen(false);
    setClientCompany('');
  };

  // Convert Lead to Client or Project
  const handleConvertLeadToClient = (lead: any) => {
    const newClient: AgencyClient = {
      id: 'cli-' + Date.now(),
      companyName: lead.company || lead.fullName || 'Empresa Lead',
      contactPerson: lead.fullName || 'Contato Lead',
      email: lead.email || '',
      phone: lead.phone || '',
      cnpj: lead.cnpj || '',
      contractPlan: 'Retainer Pro Agency',
      monthlyFee: 3500,
      status: 'Ativo',
      activeProjectsCount: 1,
      joinedDate: new Date().toISOString().substring(0, 10)
    };

    setAgencyClients([newClient, ...clients]);

    // Also create project
    const newProject: AgencyProject = {
      id: 'proj-' + Date.now(),
      title: `Projeto de Implantação - ${newClient.companyName}`,
      clientName: newClient.companyName,
      clientEmail: newClient.email,
      clientPhone: newClient.phone,
      category: 'Desenvolvimento Web',
      status: 'Aguardando',
      startDate: new Date().toISOString().substring(0, 10),
      deadlineDate: '2026-09-30',
      value: 15000,
      progressPercentage: 10,
      description: 'Projeto gerado automaticamente a partir de conversão de Lead do site.',
      deliverables: [
        { id: 'd1', text: 'Reunião de Briefing & Alinhamento', done: false },
        { id: 'd2', text: 'Elaboração de Escopo Técnico', done: false }
      ],
      assignedTeam: ['William Tavares (CEO)']
    };

    setAgencyProjects([newProject, ...projects]);
    alert(`Lead ${lead.fullName || lead.email} convertido em Cliente e Projeto iniciado!`);
  };

  // Filtered Projects
  const filteredProjects = projects.filter(p => {
    const matchesStatus = projectFilterStatus === 'Todos' || p.status === projectFilterStatus;
    const matchesCategory = projectCategoryFilter === 'Todas' || p.category === projectCategoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          p.clientName.toLowerCase().includes(projectSearch.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Status color helper
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Aguardando':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Em andamento':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Em aprovação':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Concluído':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pausado':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Cancelado':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Metrics Calculations
  const totalProjectsValue = projects.reduce((acc, p) => acc + p.value, 0);
  const activeClientsCount = clients.filter(c => c.status === 'Ativo').length;
  const ongoingProjectsCount = projects.filter(p => p.status === 'Em andamento' || p.status === 'Em aprovação').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Concluído').length;
  const monthlyRecurringRevenue = clients.reduce((acc, c) => acc + (c.status === 'Ativo' ? c.monthlyFee : 0), 0);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#0B0F19] border-b border-slate-800/80 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img 
            src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
            alt="Opera Digital Logo" 
            className="h-7 w-auto object-contain rounded bg-white p-0.5"
            referrerPolicy="no-referrer"
          />
          <span className="font-extrabold text-sm text-white tracking-tight">
            Opera<span className="text-blue-500">Digital</span>
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Abrir menu lateral"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for Mobile menu */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Left Sidebar Menu */}
      <aside className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 md:w-72 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between h-screen transition-transform duration-200 ease-in-out md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
              alt="Opera Digital Logo" 
              className="h-9 w-auto object-contain rounded-lg bg-white p-0.5 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Opera<span className="text-blue-500">Digital</span>
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                Admin OS
              </span>
            </div>
          </div>

          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links Container */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Section: Operações */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Operações & Projetos
            </p>

            <div className="mt-2 space-y-1">
              <button
                onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'projects'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className={`w-4 h-4 ${activeTab === 'projects' ? 'text-white' : 'text-blue-400'}`} />
                  <span>Projetos & Kanban</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('clients'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'clients'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${activeTab === 'clients' ? 'text-white' : 'text-sky-400'}`} />
                  <span>Clientes & CRM</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'clients' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {clients.length}
                </span>
              </button>
            </div>
          </div>

          {/* Section: Performance & Vendas */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Desempenho & Vendas
            </p>

            <div className="mt-2 space-y-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-indigo-400'}`} />
                <span>Visão Geral & Métricas</span>
              </button>

              <button
                onClick={() => { setActiveTab('leads'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'leads'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className={`w-4 h-4 ${activeTab === 'leads' ? 'text-white' : 'text-amber-400'}`} />
                  <span>Leads do Site</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'leads' ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {leads.length}
                </span>
              </button>
            </div>
          </div>

          {/* Section: Website */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Gestão de Conteúdo & WhatsApp
            </p>

            <div className="mt-2 space-y-1">
              <button
                onClick={() => { setActiveTab('whatsapp'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'whatsapp'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className={`w-4 h-4 ${activeTab === 'whatsapp' ? 'text-white' : 'text-emerald-400'}`} />
                  <span>Número do WhatsApp</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400">
                  Ativo
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('testimonials'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Quote className={`w-4 h-4 ${activeTab === 'testimonials' ? 'text-white' : 'text-cyan-400'}`} />
                  <span>Depoimentos de Clientes</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'testimonials' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {testimonials.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('portfolio'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'portfolio'
                    ? 'bg-[#0A4EE4] text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-4 h-4 ${activeTab === 'portfolio' ? 'text-white' : 'text-purple-400'}`} />
                  <span>Portfólio do Site</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'portfolio' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {portfolioProjects.length}
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070B14] space-y-3">
          
          {/* Active Admin Profile Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
              WT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">William Tavares</p>
              <p className="text-[10px] text-slate-400 truncate">Gestor & Administrator</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={forceClearCacheAndReload}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs text-amber-400 font-semibold transition-colors"
              title="Limpar Cache do Navegador e Recarregar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Limpar Cache do Navegador</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onGoToSite}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition-colors"
                title="Ver Site Principal"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Ver Site</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs text-rose-400 font-semibold transition-colors"
                title="Sair do Painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROJETOS (PROJECT MANAGEMENT SYSTEM) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header & Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B0F19] p-5 rounded-2xl border border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Gestão de Projetos da Agência</span>
                  <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-mono">
                    {filteredProjects.length} exibidos
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Acompanhe o andamento de entregas, altere status e gerencie a lista de tarefas dos clientes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle */}
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    onClick={() => setProjectsViewMode('kanban')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      projectsViewMode === 'kanban' ? 'bg-[#0A4EE4] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setProjectsViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      projectsViewMode === 'list' ? 'bg-[#0A4EE4] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lista
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEditingAgencyProject(null);
                    setProjTitle('');
                    setProjClient('');
                    setProjCategory('Desenvolvimento Web');
                    setProjStatus('Em andamento');
                    setProjValue(15000);
                    setProjProgress(25);
                    setProjDeadline('2026-09-30');
                    setProjDesc('');
                    setProjDeliverablesText('Reunião de Briefing\nValidação de Wireframe\nDesenvolvimento Front-end\nLançamento Oficial');
                    setProjectModalOpen(true);
                  }}
                  className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Projeto</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0B0F19] p-4 rounded-2xl border border-slate-800 text-xs">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar projeto por título ou cliente..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                {(['Todos', 'Aguardando', 'Em andamento', 'Em aprovação', 'Concluído', 'Pausado'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setProjectFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                      projectFilterStatus === st
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* KANBAN BOARD VIEW */}
            {projectsViewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                
                {(['Aguardando', 'Em andamento', 'Em aprovação', 'Concluído'] as ProjectStatus[]).map((colStatus) => {
                  const colProjects = filteredProjects.filter(p => p.status === colStatus);
                  return (
                    <div key={colStatus} className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[450px]">
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            colStatus === 'Aguardando' ? 'bg-amber-400' :
                            colStatus === 'Em andamento' ? 'bg-blue-500 animate-pulse' :
                            colStatus === 'Em aprovação' ? 'bg-purple-400' : 'bg-emerald-400'
                          }`} />
                          <h3 className="font-bold text-xs text-white uppercase tracking-wider">{colStatus}</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                          {colProjects.length}
                        </span>
                      </div>

                      {/* Project Cards inside column */}
                      <div className="space-y-3">
                        {colProjects.length === 0 ? (
                          <div className="p-6 text-center border border-dashed border-slate-800/80 rounded-xl text-xs text-slate-500">
                            Nenhum projeto {colStatus.toLowerCase()}
                          </div>
                        ) : (
                          colProjects.map((proj) => (
                            <div 
                              key={proj.id}
                              className="bg-[#030712] border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-blue-500/50 transition-all shadow-md group relative"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                                  {proj.category}
                                </span>
                                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                                  <button
                                    onClick={() => handleOpenEditAgencyProject(proj)}
                                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                                    title="Editar Projeto"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAgencyProject(proj.id, proj.title)}
                                    className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-colors"
                                    title="Excluir Projeto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold text-xs text-white line-clamp-2">{proj.title}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-slate-500" />
                                  <span>{proj.clientName}</span>
                                </p>
                              </div>

                              {/* Progress bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                  <span>Progresso</span>
                                  <span className="font-bold text-blue-400">{proj.progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-blue-500 h-full transition-all duration-300" 
                                    style={{ width: `${proj.progressPercentage}%` }} 
                                  />
                                </div>
                              </div>

                              {/* Tasks Checklist preview */}
                              {proj.deliverables.length > 0 && (
                                <div className="space-y-1 pt-1 border-t border-slate-900 text-[11px]">
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Entregáveis:</p>
                                  {proj.deliverables.slice(0, 3).map((task) => (
                                    <label 
                                      key={task.id} 
                                      className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white text-[11px]"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => handleToggleDeliverable(proj.id, task.id)}
                                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                                      />
                                      <span className={task.done ? 'line-through text-slate-500' : ''}>
                                        {task.text}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              )}

                              {/* Quick Move Dropdown */}
                              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-900">
                                <span className="font-mono text-emerald-400 font-bold">
                                  R$ {proj.value.toLocaleString('pt-BR')}
                                </span>
                                <select
                                  value={proj.status}
                                  onChange={(e) => handleUpdateProjectStatus(proj.id, e.target.value as ProjectStatus)}
                                  className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none"
                                >
                                  <option value="Aguardando">Aguardando</option>
                                  <option value="Em andamento">Em andamento</option>
                                  <option value="Em aprovação">Em aprovação</option>
                                  <option value="Concluído">Concluído</option>
                                  <option value="Pausado">Pausado</option>
                                </select>
                              </div>

                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

            {/* LIST TABLE VIEW */}
            {projectsViewMode === 'list' && (
              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#030712] text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-4">Projeto / Categoria</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Progresso</th>
                        <th className="p-4">Prazo</th>
                        <th className="p-4">Valor</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{p.title}</div>
                            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 inline-block mt-0.5">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-200">
                            {p.clientName}
                          </td>
                          <td className="p-4">
                            <select
                              value={p.status}
                              onChange={(e) => handleUpdateProjectStatus(p.id, e.target.value as ProjectStatus)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none bg-[#030712] ${getStatusBadge(p.status)}`}
                            >
                              <option value="Aguardando">Aguardando</option>
                              <option value="Em andamento">Em andamento</option>
                              <option value="Em aprovação">Em aprovação</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Pausado">Pausado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="p-4 min-w-[140px]">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                                <div className="bg-blue-500 h-full" style={{ width: `${p.progressPercentage}%` }} />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-300">{p.progressPercentage}%</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-slate-400">
                            {p.deadlineDate}
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-400">
                            R$ {p.value.toLocaleString('pt-BR')}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditAgencyProject(p)}
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAgencyProject(p.id, p.title)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                                title="Excluir Projeto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: CLIENTES & CRM */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B0F19] p-5 rounded-2xl border border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Carteira de Clientes & CRM</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gerencie contratos recorrentes (retainers), planos mensais e histórico de contatos.
                </p>
              </div>

              <button
                onClick={() => setClientModalOpen(true)}
                className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Novo Cliente</span>
              </button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((cli) => (
                <div key={cli.id} className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white">{cli.companyName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>Contato: <strong className="text-slate-200">{cli.contactPerson}</strong></span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {cli.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cli.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cli.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>CNPJ: {cli.cnpj}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-[#030712] rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Plano Contratado:</span>
                      <strong className="text-slate-200 font-semibold">{cli.contractPlan}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Mensalidade:</span>
                      <strong className="text-emerald-400 font-mono font-bold">R$ {cli.monthlyFee}/mês</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteClient(cli.id, cli.companyName)}
                      className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 rounded-xl transition-all"
                      title="Excluir Cliente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: VISÃO GERAL & METRICAS (DASHBOARD) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Faturamento de Projetos</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    R$ {totalProjectsValue.toLocaleString('pt-BR')}
                  </span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Receita Recorrente (MRR)</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-400 font-mono">
                    R$ {monthlyRecurringRevenue.toLocaleString('pt-BR')}/mês
                  </span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Projetos em Andamento</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono">{ongoingProjectsCount}</span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Clientes Ativos</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono">{activeClientsCount}</span>
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: PORTFÓLIO DO SITE (SHOWCASE LANDING PAGE) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between bg-[#0B0F19] p-5 rounded-2xl border border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white">Trabalhos Exibidos no Portfólio do Site</h1>
                <p className="text-xs text-slate-400 mt-1">Gerencie os casos de sucesso visíveis na página inicial.</p>
              </div>
              <button
                onClick={() => setShowcaseModalOpen(true)}
                className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Site</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioProjects.map((p) => (
                <div key={p.id} className="bg-[#0B0F19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4 relative group">
                  <div className="relative">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-36 object-cover rounded-xl" />
                    <button
                      onClick={() => handleDeletePortfolioProject(p.id, p.title)}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                      title="Remover do Portfólio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-sm text-white">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: CONFIGURAÇÃO DO WHATSAPP */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#0B0F19] p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Número Central do WhatsApp</h1>
                  <p className="text-xs text-slate-400">
                    Controle o número para onde os botões de orçamento e atendimento de todo o site redirecionam.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 space-y-5">
                <form onSubmit={handleSaveWhatsAppNumber} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-200 text-sm">
                      Número do WhatsApp com DDD *
                    </label>
                    <p className="text-slate-400 mb-2">
                      Digite o número com código do país e DDD (ex: <code className="text-emerald-400 font-mono">5551992379969</code> ou <code className="text-emerald-400 font-mono">+55 51 99237-9969</code>).
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        placeholder="5551992379969"
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3.5 text-white text-base font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Preview do Link Gerado
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono text-emerald-400">
                      <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="truncate">{getWhatsAppLink('Olá! Gostaria de um orçamento.')}</span>
                    </div>
                  </div>

                  {whatsappSavedMessage && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Número do WhatsApp atualizado com sucesso em todo o site!</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Novo Número</span>
                    </button>

                    <a
                      href={getWhatsAppLink('Teste de redirecionamento via Painel Admin Opera Digital.')}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Testar Link no WhatsApp</span>
                    </a>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5 bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Locais Afetados Automaticamente</span>
                </h3>
                <ul className="space-y-2.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>Header / Menu Topo:</strong> Botão "Solicitar Orçamento"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>Banner Hero:</strong> Botão "Conheça a Opera"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>Seção de Produtos:</strong> Botão de orçamento de cada serviço</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>Seção Agentes de IA:</strong> Botão de solicitação de robôs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>CTA Final:</strong> Chamada principal do rodapé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>Rodapé:</strong> Link de Suporte direto via WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: GERENCIADOR DE DEPOIMENTOS DE CLIENTES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0B0F19] p-5 rounded-2xl border border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white">Gerenciador de Depoimentos & Avaliações</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gerencie as citações, avaliações e cases de clientes exibidos na landing page.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAllTestimonials}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Depoimentos</span>
                </button>
                <button
                  onClick={handleOpenNewTestimonialModal}
                  className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Depoimento</span>
                </button>
              </div>
            </div>

            {testimonialSavedMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Depoimentos salvos com sucesso e atualizados no site!</span>
              </div>
            )}

            {testimonials.length === 0 ? (
              <div className="p-12 text-center bg-[#0B0F19] border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-3">
                <Quote className="w-8 h-8 mx-auto text-slate-600" />
                <p>Nenhum depoimento cadastrado no momento.</p>
                <button
                  onClick={handleOpenNewTestimonialModal}
                  className="px-4 py-2 bg-[#0A4EE4] text-white rounded-xl font-bold text-xs"
                >
                  Cadastrar Primeiro Depoimento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 space-y-4 relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250"}
                            alt={item.author}
                            className="w-12 h-12 rounded-xl object-cover border border-blue-500/50"
                          />
                          <div>
                            <h3 className="font-bold text-sm text-white">{item.author}</h3>
                            <p className="text-xs text-blue-400 font-semibold">{item.role}</p>
                            <p className="text-[11px] text-slate-400">{item.company}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditTestimonialModal(item)}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
                            title="Editar Depoimento"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(item.id, item.author)}
                            className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-colors"
                            title="Excluir Depoimento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {item.metrics && (
                        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          {item.metrics}
                        </div>
                      )}

                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {(item.tags || []).map((tg, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: NOVO / EDITAR PROJETO */}
      {/* ------------------------------------------------------------- */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold">
              {editingAgencyProject ? 'Editar Projeto' : 'Novo Projeto de Cliente'}
            </h2>

            <form onSubmit={handleSaveAgencyProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Título do Projeto *</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="Ex: E-commerce Moda Premium"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Cliente *</label>
                  <input
                    type="text"
                    required
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    placeholder="Nome da empresa"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Categoria</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value as any)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Automação & IA">Automação & IA</option>
                    <option value="ERP / PDV Custom">ERP / PDV Custom</option>
                    <option value="Tráfego Pago">Tráfego Pago</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Status</label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Aguardando">Aguardando</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Em aprovação">Em aprovação</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Valor (R$)</label>
                  <input
                    type="number"
                    value={projValue}
                    onChange={(e) => setProjValue(Number(e.target.value))}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Prazo de Entrega</label>
                  <input
                    type="date"
                    value={projDeadline}
                    onChange={(e) => setProjDeadline(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Entregáveis / Checklist de Tarefas (1 por linha)</label>
                <textarea
                  rows={4}
                  value={projDeliverablesText}
                  onChange={(e) => setProjDeliverablesText(e.target.value)}
                  placeholder="Reunião de Alinhamento&#10;Desenvolvimento do Protótipo&#10;Homologação e Testes"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold"
                >
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: NOVO CLIENTE */}
      {/* ------------------------------------------------------------- */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              <span>Cadastrar Novo Cliente</span>
            </h2>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Razão Social / Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Ex: EuroLux Importações Ltda"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Pessoa de Contato</label>
                <input
                  type="text"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  placeholder="Ex: Carlos Andrade (Diretor Comercial)"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">E-mail</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">WhatsApp / Fone</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-0000"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Plano Contratado</label>
                  <input
                    type="text"
                    value={clientPlan}
                    onChange={(e) => setClientPlan(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={clientFee}
                    onChange={(e) => setClientFee(Number(e.target.value))}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: ADICIONAR ITEM AO PORTFÓLIO DO SITE */}
      {/* ------------------------------------------------------------- */}
      {showcaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Adicionar ao Portfólio do Site</span>
              </h2>
              <button 
                type="button"
                onClick={() => setShowcaseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolioProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Título do Trabalho *</label>
                <input
                  type="text"
                  required
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="Ex: Plataforma E-commerce de Vinhos e Gastronomia"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Nome do Cliente / Marca</label>
                  <input
                    type="text"
                    value={showcaseClient}
                    onChange={(e) => setShowcaseClient(e.target.value)}
                    placeholder="Ex: Reserva Ouro Preto"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Categoria</label>
                  <select
                    value={showcaseCategory}
                    onChange={(e) => setShowcaseCategory(e.target.value as any)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="E-commerce">E-commerce</option>
                    <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                    <option value="Automação & IA">Automação & IA</option>
                    <option value="ERP / PDV Custom">ERP / PDV Custom</option>
                    <option value="Aplicativos Web">Aplicativos Web</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Métrica / Resultado Obtido</label>
                  <input
                    type="text"
                    value={showcaseMetric}
                    onChange={(e) => setShowcaseMetric(e.target.value)}
                    placeholder="Ex: +240% em Faturamento"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">URL / Link do Projeto</label>
                  <input
                    type="url"
                    value={showcaseLink}
                    onChange={(e) => setShowcaseLink(e.target.value)}
                    placeholder="https://exemplo.com.br"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Descrição Curta</label>
                <textarea
                  rows={3}
                  value={showcaseDesc}
                  onChange={(e) => setShowcaseDesc(e.target.value)}
                  placeholder="Descreva brevemente o que foi desenvolvido e os diferenciais da solução..."
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">URL da Imagem Capa</label>
                <input
                  type="text"
                  value={showcaseImage}
                  onChange={(e) => setShowcaseImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 mb-2"
                />
                
                {/* Presets buttons */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sugestões de Imagens HD:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowcaseImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800')}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-300 transition-colors"
                    >
                      E-commerce
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowcaseImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800')}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-300 transition-colors"
                    >
                      Dashboard / Analytics
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowcaseImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800')}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-300 transition-colors"
                    >
                      Automação & IA
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowcaseImage('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800')}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-300 transition-colors"
                    >
                      App Mobile
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowcaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar no Site</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: DEPOIMENTO DO CLIENTE */}
      {/* ------------------------------------------------------------- */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Quote className="w-5 h-5 text-cyan-400" />
              <span>{editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento de Cliente'}</span>
            </h2>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Nome do Autor / Cliente *</label>
                <input
                  type="text"
                  required
                  value={tAuthor}
                  onChange={(e) => setTAuthor(e.target.value)}
                  placeholder="Ex: Roberto Almeida"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Cargo / Título *</label>
                  <input
                    type="text"
                    required
                    value={tRole}
                    onChange={(e) => setTRole(e.target.value)}
                    placeholder="Ex: Diretor de Operações"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Empresa / Marca *</label>
                  <input
                    type="text"
                    required
                    value={tCompany}
                    onChange={(e) => setTCompany(e.target.value)}
                    placeholder="Ex: Ateliê Saint Germain"
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Métrica de Destaque / Conquista</label>
                <input
                  type="text"
                  value={tMetrics}
                  onChange={(e) => setTMetrics(e.target.value)}
                  placeholder="Ex: +40% em Conversão de Vendas no WhatsApp"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Depoimento / Citação do Cliente *</label>
                <textarea
                  required
                  rows={4}
                  value={tQuote}
                  onChange={(e) => setTQuote(e.target.value)}
                  placeholder="Relate a experiência do cliente com o desenvolvimento da Opera Digital..."
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">URL da Foto de Perfil (Avatar)</label>
                <input
                  type="url"
                  value={tAvatarUrl}
                  onChange={(e) => setTAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Tags / Serviços Relacionados (separados por vírgula)</label>
                <input
                  type="text"
                  value={tTagsText}
                  onChange={(e) => setTTagsText(e.target.value)}
                  placeholder="WhatsApp, E-commerce, Desenvolvimento Web"
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold"
                >
                  Salvar Depoimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{deleteConfirm.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{deleteConfirm.message}</p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirm.action();
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
