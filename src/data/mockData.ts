import { ProductItem, AiAgentFeature, TestimonialData, PortfolioProject } from '../types';

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: 'websites',
    title: 'Desenvolvimento de Websites & E-commerce',
    category: 'Sites & Lojas Virtuais',
    shortDesc: 'Websites institucionais, e-commerces de alta conversão, landing pages ultra-rápidas e portais web responsivos.',
    fullDesc: 'Criamos websites modernos, rápidos e otimizados para mecanismos de busca (SEO). Seja um site institucional, portal de notícias ou loja virtual completa com gateway de pagamento e frete integrados.',
    badge: 'Design & Alta Performance',
    iconName: 'FileText',
    mockupType: 'erp',
    highlights: [
      'Design responsivo sob medida adaptado a celulares e computadores',
      'Otimização avançada de velocidade e SEO para o Google',
      'E-commerce completo com Pix, Cartão e Cálculo de Frete',
      'Painel de controle intuitivo para gerenciar conteúdos e produtos'
    ]
  },
  {
    id: 'mobile-apps',
    title: 'Desenvolvimento de Aplicativos Web & Sistemas',
    category: 'Aplicativos Web',
    shortDesc: 'Sistemas e aplicativos web modernos acessíveis pelo navegador em qualquer computador, tablet ou celular.',
    fullDesc: 'Transforme sua ideia em um aplicativo web completo e acessível de qualquer dispositivo através do navegador, com alta performance, banco de dados integrado e navegação fluida.',
    badge: 'Aplicativos Web',
    iconName: 'Globe',
    mockupType: 'pdv',
    highlights: [
      'Acessível via navegador em qualquer celular, tablet e computador',
      'Interface fluida e focada em excelente experiência do usuário (UX/UI)',
      'Painel de gestão, banco de dados em nuvem e segurança de dados',
      'Rápido carregamento e sem dependência de instalação em lojas'
    ]
  },
  {
    id: 'whatsapp-services',
    title: 'Serviço & Automação de WhatsApp Web',
    category: 'Atendimento & Robôs',
    shortDesc: 'Plataforma completa para WhatsApp Web com robôs de atendimento 24/7, múltiplos atendentes e disparo de mensagens.',
    fullDesc: 'Eleve seu atendimento com a nossa solução para WhatsApp Web. Permita que múltiplos colaboradores atendam no mesmo número, configure robôs de resposta automática com IA e envie notificações de status aos clientes.',
    badge: 'Automação 24/7',
    iconName: 'Layers',
    mockupType: 'hub',
    highlights: [
      'Atendimento centralizado com múltiplos atendentes em 1 único número',
      'Chatbots e robôs inteligentes para respostas automáticas 24 horas',
      'Disparo programado de mensagens, lembretes e status de pedidos',
      'Relatórios de desempenho da equipe e histórico de conversas'
    ]
  },
  {
    id: 'custom-systems',
    title: 'Sistemas Web Sob Medida & Dashboards',
    category: 'Sistemas Corporativos',
    shortDesc: 'Desenvolvimento de softwares web customizados, painéis administrativos e integração de APIs.',
    fullDesc: 'Softwares sob medida para automatizar processos internos da sua empresa. Desenvolvemos dashboards interativos, portais de clientes, gerenciadores de projetos e integrações entre plataformas.',
    badge: '100% Personalizado',
    iconName: 'Wallet',
    mockupType: 'bank',
    highlights: [
      'Arquitetura de software escalável e segura',
      'Dashboards interativos em tempo real com gráficos e métricas',
      'Integração com APIs externas, gateways e bancos de dados',
      'Controle de acesso por permissões de usuários e cargos'
    ]
  }
];

export const AI_AGENTS_FEATURES: AiAgentFeature[] = [
  {
    id: 'whatsapp-bot',
    title: 'Robôs para WhatsApp Web',
    description: 'Robôs inteligentes para responder dúvidas frequentes, enviar catálogos e realizar agendamentos automaticamente no WhatsApp.',
    iconName: 'Bot',
    badge: 'Atendimento 24/7',
    examplePrompt: 'Configure um assistente virtual no WhatsApp para tirar dúvidas e enviar tabela de preços.',
    sampleResponse: '🤖 Robô de WhatsApp ativado! Ele já atende seus clientes, tira dúvidas e envia orçamentos instantaneamente.'
  },
  {
    id: 'multi-agent',
    title: 'Múltiplos Atendentes no WhatsApp',
    description: 'Sua equipe inteira atendendo no mesmo número de WhatsApp Web com transferência de chat e controle de setores.',
    iconName: 'MessageSquare',
    badge: 'Gestão de Equipe',
    examplePrompt: 'Distribua os atendimentos do WhatsApp entre o setor Comercial e o Suporte Técnico.',
    sampleResponse: '💬 Painel multi-atendente pronto! Atendimentos direcionados automaticamente por fila ou departamento.'
  },
  {
    id: 'web-app-sync',
    title: 'Integração Site & App com WhatsApp',
    description: 'Conecte o formulário do seu site ou as ações do seu aplicativo direto para o WhatsApp dos seus consultores.',
    iconName: 'Zap',
    badge: 'Conversão Direta',
    examplePrompt: 'Quando um visitante preencher o formulário no site, envie o contato direto pro WhatsApp.',
    sampleResponse: '⚡ Integração concluída! Cada novo lead gerado no site cai direto no WhatsApp da sua equipe.'
  },
  {
    id: 'smart-triggers',
    title: 'Disparo de Notificações Automáticas',
    description: 'Envie confirmações de agendamento, atualizações de pedidos e avisos aos seus clientes diretamente pelo WhatsApp.',
    iconName: 'CheckCircle2',
    badge: 'Disparos Inteligentes',
    examplePrompt: 'Envie um lembrete no WhatsApp 2 horas antes de cada reunião agendada.',
    sampleResponse: '✨ Notificações ativas! Os lembretes serão enviados pontualmente via WhatsApp.'
  }
];

export const TESTIMONIAL_DATA: TestimonialData = {
  quote: "Desenvolver nosso site e aplicativo com a Opera Digital transformou a presença da nossa empresa. O atendimento via WhatsApp Web automatizado reduziu o tempo de resposta aos clientes de horas para segundos.",
  author: "Engenharia & Tecnologia",
  role: "Soluções Digitais sob Medida",
  company: "Foco em Alta Performance",
  metrics: "Sites, Apps e WhatsApp Web",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250",
  tags: ["Sites Responsivos", "Aplicativos Web", "WhatsApp Web Service"]
};

export const STATS_DATA = [
  { value: '100%', label: 'Código Sob Medida', detail: 'Design exclusivo para sua marca' },
  { value: 'Web Apps', label: 'Aplicativos Web', detail: 'Sistemas e plataformas web modernas' },
  { value: 'WhatsApp Web', label: 'Automação & Atendimento', detail: 'Múltiplos atendentes em 1 número' },
  { value: '24/7', label: 'Disponibilidade & Suporte', detail: 'Sistemas rápidos e seguros' }
];

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Aura Commerce - Loja Virtual de Alta Performance',
    clientName: 'Aura Moda & Acessórios',
    category: 'E-commerce',
    description: 'Plataforma e-commerce completa integrada com gateway de pagamento Pix e Cartão, cálculo automático de frete e painel administrativo de alta velocidade.',
    resultMetric: '+340% em Faturamento Online',
    resultLink: 'https://auracommerce.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['E-commerce', 'Pix', 'Checkout Transparente', 'SEO'],
    completedDate: '2025-01'
  },
  {
    id: 'proj-2',
    title: 'Plataforma Web & Robô para WhatsApp Web',
    clientName: 'Nexum Vendas & Distribuição',
    category: 'Automações & IA',
    description: 'Sistema web com múltiplos atendentes no mesmo número de WhatsApp Web, robô de autoatendimento 24/7 e disparo automático de notificações.',
    resultMetric: '-80% de Tempo de Resposta no WhatsApp',
    resultLink: 'https://nexumvendas.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=800',
    tags: ['WhatsApp Web', 'Robô 24/7', 'Multi-atendentes', 'Automação'],
    completedDate: '2025-02'
  }
];


