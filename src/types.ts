export interface ProductItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  badge?: string;
  iconName: string;
  highlights: string[];
  mockupType: 'erp' | 'hub' | 'pdv' | 'bank' | 'shipping';
}

export interface AiAgentFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
  examplePrompt: string;
  sampleResponse: string;
}

export interface TestimonialData {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  metrics: string;
  avatarUrl: string;
  tags: string[];
}

export interface RegistrationFormData {
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  cnpj: string;
  password: string;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
  termsAccepted: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  clientName: string;
  category: 'E-commerce' | 'ERP & PDV' | 'Automações & IA' | 'Portais & Web Apps';
  description: string;
  resultMetric: string;
  resultLink: string;
  imageUrl: string;
  tags: string[];
  completedDate: string;
}

// Agency Project Statuses
export type ProjectStatus = 'Aguardando' | 'Em andamento' | 'Em aprovação' | 'Concluído' | 'Pausado' | 'Cancelado';

export interface ProjectTask {
  id: string;
  text: string;
  done: boolean;
}

export interface AgencyProject {
  id: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  category: 'Desenvolvimento Web' | 'E-commerce' | 'Automação & IA' | 'ERP / PDV Custom' | 'Tráfego Pago' | 'Branding';
  status: ProjectStatus;
  startDate: string;
  deadlineDate: string;
  value: number; // in BRL R$
  progressPercentage: number; // 0-100
  description: string;
  deliverables: ProjectTask[];
  assignedTeam: string[];
}

export interface AgencyClient {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  cnpj: string;
  contractPlan: string;
  monthlyFee: number;
  status: 'Ativo' | 'Prospecção' | 'Inativo';
  activeProjectsCount: number;
  joinedDate: string;
}

