import React, { useState } from 'react';
import { 
  FileText, Download, X, CheckCircle2, Shield, PhoneCall, Quote, 
  Layers, Users, FolderKanban, DollarSign, Bot, Globe, ExternalLink, Printer 
} from 'lucide-react';
import jsPDF from 'jspdf';
import { getCleanWhatsAppNumber } from '../utils/siteSettings';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const currentWhatsApp = getCleanWhatsAppNumber();

  if (!isOpen) return null;

  const handleGeneratePDF = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;

      // Helper to add new page if needed
      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
          // Add header line on new pages
          doc.setDrawColor(220, 225, 235);
          doc.line(15, 12, pageWidth - 15, 12);
          doc.setFontSize(8);
          doc.setTextColor(120, 130, 150);
          doc.text("OPERA DIGITAL — Manual e Documentação do Sistema", 15, 10);
        }
      };

      // Header Banner
      doc.setFillColor(10, 78, 228); // #0A4EE4
      doc.rect(15, y, pageWidth - 30, 24, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text("OPERA DIGITAL", 20, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("Manual do Usuário & Documentação Técnica do Sistema", 20, y + 18);

      y += 32;

      // Metadata Block
      doc.setFillColor(245, 247, 250);
      doc.rect(15, y, pageWidth - 30, 18, 'F');
      doc.setDrawColor(220, 225, 235);
      doc.rect(15, y, pageWidth - 30, 18, 'S');

      doc.setFontSize(8.5);
      doc.setTextColor(80, 90, 110);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 20, y + 7);
      doc.text(`Versão do Sistema: 2.5.0`, 20, y + 13);
      doc.text(`WhatsApp Central Ativo: +${currentWhatsApp}`, pageWidth - 90, y + 7);
      doc.text(`Painel Administrativo: Habilitado (Acesso Seguro)`, pageWidth - 90, y + 13);

      y += 26;

      // Helper for Section Titles
      const addSectionTitle = (title: string) => {
        checkPageBreak(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(10, 78, 228);
        doc.text(title, 15, y);
        
        doc.setDrawColor(10, 78, 228);
        doc.setLineWidth(0.5);
        doc.line(15, y + 2, pageWidth - 15, y + 2);
        y += 8;
      };

      // Helper for Paragraphs
      const addParagraph = (text: string, isBold = false) => {
        const splitLines = doc.splitTextToSize(text, pageWidth - 30);
        const textHeight = splitLines.length * 5;
        checkPageBreak(textHeight + 2);
        
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(50, 60, 75);
        doc.text(splitLines, 15, y);
        y += textHeight + 3;
      };

      // Helper for Bullet points
      const addBullet = (title: string, desc: string) => {
        const fullText = `${title}: ${desc}`;
        const splitLines = doc.splitTextToSize(fullText, pageWidth - 38);
        const textHeight = splitLines.length * 4.5;
        checkPageBreak(textHeight + 2);

        doc.setFillColor(10, 78, 228);
        doc.circle(18, y - 1, 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 40, 60);
        doc.text(title + ": ", 22, y);

        const titleWidth = doc.getTextWidth(title + ": ");
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 70, 85);
        
        // Print remaining text wrapped
        const restLines = doc.splitTextToSize(desc, pageWidth - 38 - titleWidth);
        if (restLines.length > 0) {
          doc.text(restLines[0], 22 + titleWidth, y);
          if (restLines.length > 1) {
            y += 4.5;
            doc.text(restLines.slice(1), 22, y);
          }
        }
        y += 6;
      };

      // 1. Visão Geral
      addSectionTitle("1. VISÃO GERAL DA PLATAFORMA");
      addParagraph("A Opera Digital é uma plataforma web completa para agências de tecnologia, desenvolvimento de websites, aplicativos web, e-commerces e automações para WhatsApp Web com Agentes de Inteligência Artificial.");
      addParagraph("O sistema é composto por uma landing page pública orientada à alta conversão de leads e um Painel Administrativo completo para gestão interna.");

      y += 4;

      // 2. Funcionalidades Públicas
      addSectionTitle("2. ESTRUTURA DA PÁGINA PÚBLICA (LANDING PAGE)");
      addBullet("Simulador de Serviços", "Permite aos visitantes alternar entre Websites, Apps e Automação de WhatsApp Web.");
      addBullet("Seção de Agentes de IA", "Demonstra robôs virtuais 24/7 capazes de responder dúvidas, enviar catálogos e realizar agendamentos.");
      addBullet("Vitrine de Produtos & Serviços", "Cards explicativos com orçamentos em 1 clique direcionados diretamente para o WhatsApp central.");
      addBullet("Depoimentos de Clientes", "Carrossel interativo com avaliações reais de clientes, métricas de resultados e tags de projetos.");
      addBullet("Formulário de Cadastro & Onboarding", "Página dedicada para solicitação de propostas com coleta completa de CNPJ e contatos.");

      y += 4;

      // 3. Painel Administrativo
      addSectionTitle("3. PAINEL DE CONTROLE ADMINISTRATIVO");
      addParagraph("O Painel Admin é acessível através do botão 'Painel Admin' no menu superior da aplicação. Ele possui as seguintes áreas estratégicas:");
      addBullet("Controle do WhatsApp Central", "Permite alterar o número de destino de TODOS os botões de orçamento e suporte do site com atualização em tempo real.");
      addBullet("Gerenciador de Depoimentos", "Permite cadastrar, editar e excluir depoimentos de clientes que aparecem na página principal.");
      addBullet("Gestão de Projetos (Kanban)", "Acompanhamento visual das etapas: Briefing, Em Desenvolvimento, Em Testes e Concluídos.");
      addBullet("Gestão de Clientes", "Cadastro e acompanhamento de empresas atendidas pela agência.");
      addBullet("Leads & Propostas", "Recebimento de contatos cadastrados no formulário com funcionalidade de conversão direta em cliente.");
      addBullet("Gestão Financeira", "Relatórios de faturamento, faturas emitidas e pendentes.");

      y += 4;

      // 4. Instruções de Operação
      addSectionTitle("4. INSTRUÇÕES DE OPERAÇÃO E CONFIGURAÇÃO");
      addParagraph("Para alterar o número do WhatsApp comercial:");
      addBullet("Passo 1", "Acesse o Painel Admin pelo menu superior do site.");
      addBullet("Passo 2", "No menu lateral esquerdo, clique em 'Número do WhatsApp'.");
      addBullet("Passo 3", "Digite o número com DDD e clique em 'Salvar Novo Número'. O redirecionamento será atualizado em todo o site instantaneamente.");

      y += 4;
      addParagraph("Para gerenciar os depoimentos exibidos no site:");
      addBullet("Passo 1", "No menu lateral do Painel Admin, selecione 'Depoimentos de Clientes'.");
      addBullet("Passo 2", "Clique em 'Novo Depoimento' para adicionar ou no ícone de lápis para editar um existente.");

      // Footer / Page Numbers
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 160, 175);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
        doc.text(`Opera Digital — Todos os direitos reservados.`, 15, pageHeight - 10);
      }

      // Save file
      doc.save("Documentacao_Opera_Digital.pdf");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0A4EE4]/20 border border-blue-500/30 rounded-xl text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Documentação do Sistema & Manual em PDF</h2>
              <p className="text-xs text-slate-400">Opera Digital — Guia completo de funcionalidades e operação</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Download Action Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Exportar Manual Completo em PDF</span>
              </h3>
              <p className="text-slate-300 text-xs">
                Faça o download do PDF formatado contendo o guia passo a passo, módulos e configurações.
              </p>
            </div>

            <button
              onClick={handleGeneratePDF}
              disabled={downloading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Gerando PDF...' : 'Baixar PDF Agora'}</span>
            </button>
          </div>

          {/* Section 1 */}
          <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>1. Visão Geral da Plataforma</span>
            </h3>
            <p>
              A <strong>Opera Digital</strong> é uma solução completa para agências de tecnologia especializada em websites de alta performance, aplicativos web, e-commerces e sistemas de atendimento automatizado via WhatsApp Web integrados com Agentes de IA.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>2. Controle Dinâmico do WhatsApp Central</span>
            </h3>
            <p>
              O sistema conta com redirecionamento inteligente para o WhatsApp. O número atende atualmente a: <strong className="text-emerald-400 font-mono">+{currentWhatsApp}</strong>.
            </p>
            <p className="text-slate-400">
              Através do <strong>Painel Admin &gt; Número do WhatsApp</strong>, o administrador pode alterar esse número a qualquer momento, e todos os botões do site (Header, Hero, Produtos, Agentes de IA, CTA e Rodapé) são atualizados imediatamente.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
              <Quote className="w-4 h-4" />
              <span>3. Gerenciamento de Depoimentos de Clientes</span>
            </h3>
            <p>
              Na seção <strong>Painel Admin &gt; Depoimentos de Clientes</strong>, é possível:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li>Cadastrar novas avaliações com foto, nome, cargo, empresa e métrica de resultado.</li>
              <li>Editar depoimentos existentes em tempo real.</li>
              <li>Excluir avaliações antigas.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <h3 className="font-bold text-sm text-purple-400 flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              <span>4. Módulos do Painel Administrativo</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-1">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-white block mb-0.5">Gestão de Projetos (Kanban)</strong>
                Acompanhe o andamento das demandas em quadros visuais.
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-white block mb-0.5">Gestão de Clientes</strong>
                Base de contatos e informações estratégicas das empresas atendidas.
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-white block mb-0.5">Recepção de Leads</strong>
                Converter contatos recebidos nos formulários em novos clientes.
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-white block mb-0.5">Financeiro & Faturamento</strong>
                Acompanhe orçamentos e faturas ativas.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Documentação Técnica v2.5.0 • Opera Digital
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGeneratePDF}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
