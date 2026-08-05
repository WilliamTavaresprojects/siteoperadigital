import { AgencyProject, AgencyClient } from '../types';

export const INITIAL_AGENCY_PROJECTS: AgencyProject[] = [
  {
    id: 'aproj-1',
    title: 'Plataforma E-commerce Aura Commerce',
    clientName: 'Aura Moda & Acessórios',
    category: 'Desenvolvimento Web',
    status: 'Concluído',
    value: 18500,
    progressPercentage: 100,
    startDate: '2025-01-05',
    deadlineDate: '2025-01-28',
    description: 'E-commerce responsivo com Pix dinâmico, checkout transparente e integração com ERP.',
    deliverables: [
      { id: 't-1', text: 'Design Figma UI/UX', done: true },
      { id: 't-2', text: 'Desenvolvimento Web React/Vite', done: true },
      { id: 't-3', text: 'Integração Gateway Pix', done: true },
      { id: 't-4', text: 'Otimização SEO', done: true }
    ],
    assignedTeam: ['Dev Lead', 'UI Designer']
  },
  {
    id: 'aproj-2',
    title: 'Robô de Atendimento & Disparo WhatsApp Web',
    clientName: 'Nexum Vendas & Distribuição',
    category: 'Automação & IA',
    status: 'Em andamento',
    value: 12000,
    progressPercentage: 75,
    startDate: '2025-01-15',
    deadlineDate: '2025-02-28',
    description: 'Multi-atendimento centralizado no WhatsApp Web com chatbot 24/7.',
    deliverables: [
      { id: 't-5', text: 'Dashboard Multi-atendente', done: true },
      { id: 't-6', text: 'Chatbot IA respostas rápidas', done: true },
      { id: 't-7', text: 'Sistema de Disparos', done: false }
    ],
    assignedTeam: ['Dev Fullstack', 'Especialista IA']
  }
];

export const INITIAL_AGENCY_CLIENTS: AgencyClient[] = [
  {
    id: 'acli-1',
    companyName: 'Aura Moda & Acessórios',
    contactPerson: 'Juliana Silva',
    email: 'contato@auracommerce.com.br',
    phone: '5511988776655',
    cnpj: '45.890.123/0001-99',
    contractPlan: 'Desenvolvimento E-commerce',
    monthlyFee: 0,
    status: 'Ativo',
    activeProjectsCount: 1,
    joinedDate: '2025-01-05'
  },
  {
    id: 'acli-2',
    companyName: 'Nexum Vendas & Distribuição',
    contactPerson: 'Carlos Eduardo',
    email: 'carlos@nexumvendas.com.br',
    phone: '5511977665544',
    cnpj: '12.345.678/0001-00',
    contractPlan: 'Retainer Pro Automação',
    monthlyFee: 3500,
    status: 'Ativo',
    activeProjectsCount: 1,
    joinedDate: '2025-01-15'
  }
];

