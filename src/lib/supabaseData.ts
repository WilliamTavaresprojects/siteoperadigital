import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PORTFOLIO_PROJECTS, TESTIMONIAL_DATA } from '../data/mockData';
import { INITIAL_AGENCY_PROJECTS, INITIAL_AGENCY_CLIENTS } from '../data/agencyMockData';

export interface SiteData {
  portfolioProjects: any[];
  testimonials: any[];
  whatsappNumber: string;
  agencyProjects: any[];
  agencyClients: any[];
  registeredLeads: any[];
}

const defaultData: SiteData = {
  portfolioProjects: INITIAL_PORTFOLIO_PROJECTS,
  testimonials: [TESTIMONIAL_DATA],
  whatsappNumber: '5551992379969',
  agencyProjects: INITIAL_AGENCY_PROJECTS,
  agencyClients: INITIAL_AGENCY_CLIENTS,
  registeredLeads: []
};

let cachedData: SiteData = { ...defaultData };
let initialized = false;

function mergeWithDefaults(d: any): SiteData {
  return {
    portfolioProjects: (Array.isArray(d.portfolioProjects) && d.portfolioProjects.length > 0)
      ? d.portfolioProjects : defaultData.portfolioProjects,
    testimonials: (Array.isArray(d.testimonials) && d.testimonials.length > 0)
      ? d.testimonials : defaultData.testimonials,
    whatsappNumber: d.whatsappNumber || defaultData.whatsappNumber,
    agencyProjects: (Array.isArray(d.agencyProjects) && d.agencyProjects.length > 0)
      ? d.agencyProjects : defaultData.agencyProjects,
    agencyClients: (Array.isArray(d.agencyClients) && d.agencyClients.length > 0)
      ? d.agencyClients : defaultData.agencyClients,
    registeredLeads: Array.isArray(d.registeredLeads) ? d.registeredLeads : []
  };
}

function loadFromLocalStorage(): SiteData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const portfolio = localStorage.getItem('opera_portfolio_projects');
    const testimonials = localStorage.getItem('opera_testimonials');
    const whatsapp = localStorage.getItem('opera_whatsapp_number');
    const agencyProjects = localStorage.getItem('opera_agency_projects');
    const agencyClients = localStorage.getItem('opera_agency_clients');
    const leads = localStorage.getItem('opera_registered_leads');

    return {
      portfolioProjects: portfolio ? JSON.parse(portfolio) : defaultData.portfolioProjects,
      testimonials: testimonials ? JSON.parse(testimonials) : defaultData.testimonials,
      whatsappNumber: whatsapp || defaultData.whatsappNumber,
      agencyProjects: agencyProjects ? JSON.parse(agencyProjects) : defaultData.agencyProjects,
      agencyClients: agencyClients ? JSON.parse(agencyClients) : defaultData.agencyClients,
      registeredLeads: leads ? JSON.parse(leads) : []
    };
  } catch {
    return defaultData;
  }
}

function saveToLocalStorage(data: SiteData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('opera_portfolio_projects', JSON.stringify(data.portfolioProjects));
    localStorage.setItem('opera_testimonials', JSON.stringify(data.testimonials));
    localStorage.setItem('opera_whatsapp_number', data.whatsappNumber);
    localStorage.setItem('opera_agency_projects', JSON.stringify(data.agencyProjects));
    localStorage.setItem('opera_agency_clients', JSON.stringify(data.agencyClients));
    localStorage.setItem('opera_registered_leads', JSON.stringify(data.registeredLeads));
  } catch {}
}

export async function fetchSiteDataFromSupabase(): Promise<SiteData> {
  if (!isSupabaseConfigured || !supabase) {
    if (!initialized) {
      cachedData = loadFromLocalStorage();
      initialized = true;
    }
    return cachedData;
  }

  try {
    const { data, error } = await supabase
      .from('site_store')
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data?.data) {
      if (!initialized) {
        cachedData = loadFromLocalStorage();
        initialized = true;
      }
      return cachedData;
    }

    cachedData = mergeWithDefaults(data.data);
    initialized = true;
    saveToLocalStorage(cachedData);
    return cachedData;
  } catch (e) {
    console.error('Error fetching from Supabase:', e);
    if (!initialized) {
      cachedData = loadFromLocalStorage();
      initialized = true;
    }
    return cachedData;
  }
}

export async function saveSiteDataToSupabase(updates: Partial<SiteData>): Promise<boolean> {
  cachedData = { ...cachedData, ...updates };
  saveToLocalStorage(cachedData);
  window.dispatchEvent(new Event('opera_config_changed'));

  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('site_store')
      .upsert({
        id: 1,
        data: cachedData,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase upsert error:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error saving to Supabase:', e);
    return false;
  }
}
