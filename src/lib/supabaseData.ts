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

export async function fetchSiteDataFromSupabase(): Promise<SiteData> {
  if (!isSupabaseConfigured || !supabase) {
    return defaultData;
  }

  try {
    const { data, error } = await supabase
      .from('site_store')
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data?.data) {
      return defaultData;
    }

    const d = data.data;
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
  } catch (e) {
    console.error('Error fetching from Supabase:', e);
    return defaultData;
  }
}

export async function saveSiteDataToSupabase(updates: Partial<SiteData>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const current = await fetchSiteDataFromSupabase();
    const merged = { ...current, ...updates };

    const { error } = await supabase
      .from('site_store')
      .upsert({
        id: 1,
        data: merged,
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
