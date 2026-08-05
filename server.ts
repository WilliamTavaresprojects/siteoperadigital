import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_PORTFOLIO_PROJECTS, TESTIMONIAL_DATA } from './src/data/mockData';
import { INITIAL_AGENCY_PROJECTS, INITIAL_AGENCY_CLIENTS } from './src/data/agencyMockData';

dotenv.config();

const DEFAULT_SUPABASE_URL = "https://nhsgelifaykqifcxryim.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oc2dlbGlmYXlrcWlmY3hyeWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MTk4MDksImV4cCI6MjEwMTI5NTgwOX0.vYFsodNI_qShaeW5fby3FPP-6Ro0rkKJZzbRkz4-Tvo";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

const STORE_FILE = path.resolve(process.cwd(), 'site_store.json');

const defaultStoreData = {
  portfolioProjects: INITIAL_PORTFOLIO_PROJECTS,
  testimonials: [TESTIMONIAL_DATA],
  whatsappNumber: '5551992379969',
  agencyProjects: INITIAL_AGENCY_PROJECTS,
  agencyClients: INITIAL_AGENCY_CLIENTS,
  registeredLeads: []
};

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        portfolioProjects: (Array.isArray(parsed.portfolioProjects) && parsed.portfolioProjects.length > 0)
          ? parsed.portfolioProjects
          : defaultStoreData.portfolioProjects,
        testimonials: (Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0)
          ? parsed.testimonials
          : defaultStoreData.testimonials,
        whatsappNumber: parsed.whatsappNumber || defaultStoreData.whatsappNumber,
        agencyProjects: (Array.isArray(parsed.agencyProjects) && parsed.agencyProjects.length > 0)
          ? parsed.agencyProjects
          : defaultStoreData.agencyProjects,
        agencyClients: (Array.isArray(parsed.agencyClients) && parsed.agencyClients.length > 0)
          ? parsed.agencyClients
          : defaultStoreData.agencyClients,
        registeredLeads: Array.isArray(parsed.registeredLeads) ? parsed.registeredLeads : []
      };
    }
  } catch (e) {
    console.error('Error reading site_store.json:', e);
  }
  return defaultStoreData;
}

function saveStore(data: any) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing site_store.json:', e);
  }
}

function getDistPath(): string {
  if (typeof __dirname !== 'undefined') {
    const indexPathInDir = path.resolve(__dirname, 'index.html');
    if (fs.existsSync(indexPathInDir)) {
      return __dirname;
    }
    const indexPathInSubDir = path.resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPathInSubDir)) {
      return path.resolve(__dirname, 'dist');
    }
  }
  return path.resolve(process.cwd(), 'dist');
}

async function fetchWebsiteMetaData(targetUrl: string) {
  let title = '';
  let metaDescription = '';
  let ogImage = '';
  let bodySnippet = '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();

      // Extract <title>
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      // Extract meta description or og:description
      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i) ||
                          html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
      if (ogDescMatch && ogDescMatch[1]) {
        metaDescription = ogDescMatch[1].trim();
      }

      // Extract og:image
      const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                         html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
      if (ogImgMatch && ogImgMatch[1]) {
        let img = ogImgMatch[1].trim();
        if (img.startsWith('//')) {
          img = 'https:' + img;
        } else if (img.startsWith('/')) {
          try {
            const origin = new URL(targetUrl).origin;
            img = origin + img;
          } catch (e) {
            // ignore URL parse error
          }
        }
        ogImage = img;
      }

      // Clean snippet of body text or headings
      const bodyClean = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      bodySnippet = bodyClean.substring(0, 1500);
    }
  } catch (e) {
    console.warn('Scraping warning for URL:', targetUrl, e);
  }

  return { title, metaDescription, ogImage, bodySnippet };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Prevent browser & CDN caching for all API endpoints
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // Shared persistent site data API
  app.get('/api/site-data', async (req, res) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_store')
          .select('data')
          .eq('id', 1)
          .single();

        if (!error && data?.data) {
          const merged = {
            portfolioProjects: (Array.isArray(data.data.portfolioProjects) && data.data.portfolioProjects.length > 0)
              ? data.data.portfolioProjects
              : defaultStoreData.portfolioProjects,
            testimonials: (Array.isArray(data.data.testimonials) && data.data.testimonials.length > 0)
              ? data.data.testimonials
              : defaultStoreData.testimonials,
            whatsappNumber: data.data.whatsappNumber || defaultStoreData.whatsappNumber,
            agencyProjects: (Array.isArray(data.data.agencyProjects) && data.data.agencyProjects.length > 0)
              ? data.data.agencyProjects
              : defaultStoreData.agencyProjects,
            agencyClients: (Array.isArray(data.data.agencyClients) && data.data.agencyClients.length > 0)
              ? data.data.agencyClients
              : defaultStoreData.agencyClients,
            registeredLeads: Array.isArray(data.data.registeredLeads) ? data.data.registeredLeads : []
          };
          saveStore(merged);
          return res.json(merged);
        }
      } catch (e) {
        console.error('Supabase query error, falling back to local store:', e);
      }
    }

    const store = loadStore();
    res.json(store);
  });

  app.post('/api/site-data', async (req, res) => {
    try {
      let current = loadStore();

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('site_store')
            .select('data')
            .eq('id', 1)
            .single();

          if (!error && data?.data) {
            current = { ...defaultStoreData, ...data.data };
          }
        } catch (e) {
          console.error('Supabase fetch error before update:', e);
        }
      }

      const updated = { ...current, ...req.body };
      saveStore(updated);

      if (supabase) {
        try {
          const { error } = await supabase
            .from('site_store')
            .upsert({ id: 1, data: updated, updated_at: new Date().toISOString() });
          
          if (error) {
            console.error('Supabase upsert error details:', error);
          }
        } catch (e) {
          console.error('Supabase upsert error:', e);
        }
      }

      res.json({ success: true, data: updated });
    } catch (e) {
      res.status(500).json({ error: 'Erro ao salvar dados do site' });
    }
  });

  app.get('/api/supabase-config', (req, res) => {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    res.json({
      configured: Boolean(url && key),
      supabaseUrl: url ? url.substring(0, 15) + '...' : null
    });
  });

  // API Route: AI Generation for Portfolio Projects
  app.post('/api/generate-project-info', async (req, res) => {
    try {
      const { url, clientName, category } = req.body || {};

      if (!url || typeof url !== 'string' || !url.trim()) {
        res.status(400).json({ error: 'URL do projeto é obrigatória.' });
        return;
      }

      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      // 1. Scrape real metadata from the target website
      const scraped = await fetchWebsiteMetaData(cleanUrl);

      // Default screenshot URL if ogImage is missing
      const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&embed=screenshot.url`;
      const fallbackImage = scraped.ogImage || screenshotUrl;

      const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
      const domainClean = domain.replace(/^www\./, '').split('.')[0];
      const defaultClientName = clientName || (scraped.title ? scraped.title.split('-')[0].split('|')[0].trim() : domainClean.toUpperCase());

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Smart fallback when API key is not configured
        res.json({
          title: scraped.title ? `Plataforma ${scraped.title}` : `Plataforma Digital ${defaultClientName}`,
          clientName: defaultClientName,
          category: category || 'E-commerce',
          description: scraped.metaDescription || `Solução web completa e personalizada desenvolvida para ${defaultClientName} com alta performance e integração.`,
          resultMetric: '+240% em Produtividade e Vendas',
          imageUrl: fallbackImage,
          tags: ['Opera Digital', 'Inovação', 'Web App']
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Analise o conteúdo real extraído do site a seguir para criar uma publicação altamente precisa e alinhada para o portfólio da Opera Digital:

URL do site: ${cleanUrl}
${clientName ? `Nome pré-fornecido do cliente: ${clientName}` : ''}
${category ? `Categoria solicitada: ${category}` : ''}

DADOS REAIS EXTRAÍDOS DO SITE:
- Título real da página (<title>): ${scraped.title || 'Não identificado'}
- Descrição real da página (meta description): ${scraped.metaDescription || 'Não identificada'}
- Imagem OG encontrada no site: ${scraped.ogImage || 'Nenhuma'}
- Trecho do conteúdo real do site: ${scraped.bodySnippet || 'Nenhum'}

INSTRUÇÕES DE PREENCHIMENTO:
1. O Título (title) e o Nome do Cliente (clientName) devem refletir com precisão a marca/empresa real do site consultado.
2. A Descrição (description) deve descrever em detalhes o que a empresa do site faz e a solução desenvolvida.
3. A Categoria (category) deve corresponder exatamente ao ramo real do site (E-commerce, ERP & PDV, Automações & IA, ou Portais & Web Apps).
4. A Imagem (imageUrl) deve ser:
   - A imagem OG oficial do site (${scraped.ogImage}) se estiver presente e for válida; OU
   - A imagem de captura de tela direta do site: "${screenshotUrl}"; OU
   - Uma foto de altíssima qualidade do Unsplash estritamente temática e contextual para o ramo exato do site.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: `Você é o Diretor de Tecnologia e Marketing da Opera Digital. 
Sua função é gerar publicações do portfólio com total fidelidade ao site do cliente analisado.
Sua resposta DEVE ser estritamente em formato JSON estruturado seguindo o schema fornecido.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Título atrativo do projeto alinhado ao site real' },
              clientName: { type: Type.STRING, description: 'Nome exato da marca ou cliente do site' },
              category: { 
                type: Type.STRING, 
                description: 'Categoria exata: E-commerce | ERP & PDV | Automações & IA | Portais & Web Apps' 
              },
              description: { type: Type.STRING, description: 'Descrição rica e profissional baseada no site real' },
              resultMetric: { type: Type.STRING, description: 'Métrica de impacto real ou estimada (ex: +320% de vendas, Economia de 40h/mês)' },
              imageUrl: { type: Type.STRING, description: 'URL direta da imagem oficial, captura de tela do site ou Unsplash contextual' },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de 3 a 5 tags relacionadas ao site'
              }
            },
            required: ['title', 'clientName', 'category', 'description', 'resultMetric', 'imageUrl', 'tags']
          }
        }
      });

      const jsonText = response.text ? response.text.trim() : '';
      if (!jsonText) {
        throw new Error('Sem resposta do modelo Gemini.');
      }

      const generatedData = JSON.parse(jsonText);

      // Sanitize fallback for imageUrl if empty
      if (!generatedData.imageUrl) {
        generatedData.imageUrl = fallbackImage;
      }

      res.json(generatedData);

    } catch (err: any) {
      console.error('Erro na geração IA de projeto:', err);
      const urlStr = req.body?.url || 'https://projeto.com.br';
      let cleanUrl = urlStr.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
      const inferredName = req.body?.clientName || domain.replace(/^www\./, '').split('.')[0].toUpperCase();

      res.json({
        title: `Plataforma Digital ${inferredName}`,
        clientName: inferredName,
        category: req.body?.category || 'E-commerce',
        description: `Ambiente digital personalizado desenvolvido para ${inferredName} com foco em inovação, resultados e escalabilidade.`,
        resultMetric: '+210% de Eficiência Operacional',
        imageUrl: `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&embed=screenshot.url`,
        tags: ['Opera Digital', 'Sistemas', 'Web']
      });
    }
  });

  // --------------------------------------------------------------------------
  // CALL ROOM PRESENCE & CHAT APIs (For multi-device video call synchronization)
  // --------------------------------------------------------------------------
  interface RoomParticipant {
    id: string;
    role: 'host' | 'guest';
    name: string;
    lastPing: number;
    isMicOn?: boolean;
    isVideoOn?: boolean;
  }

  interface RoomChatMessage {
    id: string;
    sender: string;
    text: string;
    time: string;
  }

  const roomPresenceMap = new Map<string, RoomParticipant[]>();
  const roomMessagesMap = new Map<string, RoomChatMessage[]>();

  function getActiveParticipants(callId: string): RoomParticipant[] {
    const now = Date.now();
    const list = roomPresenceMap.get(callId) || [];
    // Keep active if pinged within last 12 seconds
    const active = list.filter(p => now - p.lastPing < 12000);
    roomPresenceMap.set(callId, active);
    return active;
  }

  app.post('/api/calls/:callId/join', (req, res) => {
    const { callId } = req.params;
    const { participantId, role, name, isMicOn, isVideoOn } = req.body || {};
    if (!participantId) {
      res.status(400).json({ error: 'participantId required' });
      return;
    }

    const active = getActiveParticipants(callId);
    const existingIdx = active.findIndex(p => p.id === participantId);
    const pData: RoomParticipant = {
      id: participantId,
      role: role === 'host' ? 'host' : 'guest',
      name: name || (role === 'host' ? 'William Tavares (CEO Opera Digital)' : 'Cliente Convidado'),
      lastPing: Date.now(),
      isMicOn: isMicOn ?? true,
      isVideoOn: isVideoOn ?? true
    };

    if (existingIdx >= 0) {
      active[existingIdx] = pData;
    } else {
      active.push(pData);
    }

    roomPresenceMap.set(callId, active);
    const messages = roomMessagesMap.get(callId) || [];
    res.json({ success: true, activeParticipants: active, messages });
  });

  app.post('/api/calls/:callId/ping', (req, res) => {
    const { callId } = req.params;
    const { participantId, role, name, isMicOn, isVideoOn } = req.body || {};
    if (!participantId) {
      res.status(400).json({ error: 'participantId required' });
      return;
    }

    const active = getActiveParticipants(callId);
    const existingIdx = active.findIndex(p => p.id === participantId);
    if (existingIdx >= 0) {
      active[existingIdx].lastPing = Date.now();
      if (name) active[existingIdx].name = name;
      if (typeof isMicOn === 'boolean') active[existingIdx].isMicOn = isMicOn;
      if (typeof isVideoOn === 'boolean') active[existingIdx].isVideoOn = isVideoOn;
    } else {
      active.push({
        id: participantId,
        role: role === 'host' ? 'host' : 'guest',
        name: name || 'Participante',
        lastPing: Date.now(),
        isMicOn: isMicOn ?? true,
        isVideoOn: isVideoOn ?? true
      });
    }

    roomPresenceMap.set(callId, active);
    const messages = roomMessagesMap.get(callId) || [];
    res.json({ success: true, activeParticipants: active, messages });
  });

  app.get('/api/calls/:callId/presence', (req, res) => {
    const { callId } = req.params;
    const active = getActiveParticipants(callId);
    const messages = roomMessagesMap.get(callId) || [];
    res.json({ activeParticipants: active, messages });
  });

  app.post('/api/calls/:callId/messages', (req, res) => {
    const { callId } = req.params;
    const { sender, text } = req.body || {};
    if (!text) {
      res.status(400).json({ error: 'Message text required' });
      return;
    }

    const messages = roomMessagesMap.get(callId) || [
      { id: 'm-1', sender: 'Sistema Opera', text: 'Sala de reunião criptografada iniciada.', time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
    ];

    const newMsg: RoomChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sender: sender || 'Participante',
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    messages.push(newMsg);
    roomMessagesMap.set(callId, messages);

    const active = getActiveParticipants(callId);
    res.json({ success: true, messages, activeParticipants: active });
  });

  // WebRTC Signaling Endpoints for Real-Time Video/Audio Stream Exchange
  interface RoomSignal {
    id: string;
    senderId: string;
    targetId?: string;
    type: 'offer' | 'answer' | 'candidate';
    payload: any;
    timestamp: number;
  }

  const roomSignalsMap = new Map<string, RoomSignal[]>();

  app.post('/api/calls/:callId/signal', (req, res) => {
    const { callId } = req.params;
    const { senderId, targetId, type, payload } = req.body || {};
    if (!senderId || !type || !payload) {
      res.status(400).json({ error: 'Signal details required' });
      return;
    }

    const signals = roomSignalsMap.get(callId) || [];
    const newSignal: RoomSignal = {
      id: 'sig-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      senderId,
      targetId,
      type,
      payload,
      timestamp: Date.now()
    };

    signals.push(newSignal);
    if (signals.length > 100) signals.shift();
    roomSignalsMap.set(callId, signals);

    res.json({ success: true, signalId: newSignal.id });
  });

  app.get('/api/calls/:callId/signals', (req, res) => {
    const { callId } = req.params;
    const participantId = req.query.participantId as string;
    const since = parseInt((req.query.since as string) || '0', 10);

    const signals = roomSignalsMap.get(callId) || [];
    const pending = signals.filter(s => 
      s.timestamp > since && 
      s.senderId !== participantId && 
      (!s.targetId || s.targetId === participantId)
    );

    res.json({ signals: pending });
  });

  app.post('/api/calls/:callId/leave', (req, res) => {
    const { callId } = req.params;
    const { participantId } = req.body || {};
    const active = getActiveParticipants(callId);
    const filtered = active.filter(p => p.id !== participantId);
    roomPresenceMap.set(callId, filtered);
    res.json({ success: true });
  });

  // Vite Middleware in Development / Static Serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = getDistPath();
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('Surrogate-Control', 'no-store');
        }
      }
    }));
    app.get('*', (req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      res.sendFile(indexPath, (err) => {
        if (err && !res.headersSent) {
          res.status(500).send('Server Error');
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
