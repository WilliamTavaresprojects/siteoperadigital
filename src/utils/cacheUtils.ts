import { fetchSiteDataFromSupabase } from '../lib/supabaseData';

export function clearBrowserCacheOnLoad() {
  if (typeof window === 'undefined') return;

  try {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      }).catch((err) => {
        console.warn('Erro ao limpar CacheStorage:', err);
      });
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch((err) => {
        console.warn('Erro ao desregistrar ServiceWorker:', err);
      });
    }

    sessionStorage.clear();

    fetchSiteDataFromSupabase().then(data => {
      if (data) {
        if (Array.isArray(data.portfolioProjects) && data.portfolioProjects.length > 0) {
          localStorage.setItem('opera_portfolio_projects', JSON.stringify(data.portfolioProjects));
        }
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          localStorage.setItem('opera_testimonials', JSON.stringify(data.testimonials));
        }
        if (data.whatsappNumber) {
          localStorage.setItem('opera_whatsapp_number', data.whatsappNumber);
        }
        if (Array.isArray(data.agencyProjects) && data.agencyProjects.length > 0) {
          localStorage.setItem('opera_agency_projects', JSON.stringify(data.agencyProjects));
        }
        if (Array.isArray(data.agencyClients) && data.agencyClients.length > 0) {
          localStorage.setItem('opera_agency_clients', JSON.stringify(data.agencyClients));
        }
        if (Array.isArray(data.registeredLeads)) {
          localStorage.setItem('opera_registered_leads', JSON.stringify(data.registeredLeads));
        }
        window.dispatchEvent(new Event('opera_config_changed'));
      }
    }).catch(e => console.error('Erro ao sincronizar dados via Supabase:', e));

  } catch (error) {
    console.error('Erro ao executar limpeza de cache:', error);
  }
}

// Função para forçar recarregamento sem cache
export function forceClearCacheAndReload() {
  if (typeof window === 'undefined') return;

  clearBrowserCacheOnLoad();

  // Recarregar a página forçando bypass de cache com parâmetro timestamp
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('_nocache', Date.now().toString());
  window.location.href = currentUrl.toString();
}

