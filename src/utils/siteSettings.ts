import { TestimonialData } from '../types';
import { TESTIMONIAL_DATA } from '../data/mockData';
import { fetchSiteDataFromSupabase, saveSiteDataToSupabase } from '../lib/supabaseData';

export const DEFAULT_WHATSAPP_NUMBER = '5551992379969';

export const INITIAL_TESTIMONIALS: TestimonialData[] = [];

export function getCleanWhatsAppNumber(): string {
  if (typeof window === 'undefined') return DEFAULT_WHATSAPP_NUMBER;
  try {
    const saved = localStorage.getItem('opera_whatsapp_number');
    if (saved && saved.trim().length >= 8) {
      return saved.replace(/\D/g, '');
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function setWhatsAppNumber(num: string): void {
  const clean = num.replace(/\D/g, '');
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('opera_whatsapp_number', clean);
      saveSiteDataToSupabase({ whatsappNumber: clean }).catch(e => console.error(e));
      window.dispatchEvent(new Event('opera_config_changed'));
    } catch (e) {
      console.error(e);
    }
  }
}

export function getWhatsAppLink(text: string = ''): string {
  const cleanNum = getCleanWhatsAppNumber();
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNum}${text ? `?text=${encodedText}` : ''}`;
}

export function getStoredTestimonials(): TestimonialData[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('opera_testimonials');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveStoredTestimonials(list: TestimonialData[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('opera_testimonials', JSON.stringify(list));
      saveSiteDataToSupabase({ testimonials: list }).catch(e => console.error(e));
      window.dispatchEvent(new Event('opera_config_changed'));
    } catch (e) {
      console.error(e);
    }
  }
}

export function syncSiteSettingsWithServer(): void {
  if (typeof window === 'undefined') return;

  fetchSiteDataFromSupabase().then(data => {
    if (data) {
      if (data.whatsappNumber) {
        localStorage.setItem('opera_whatsapp_number', data.whatsappNumber);
      }
      if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
        localStorage.setItem('opera_testimonials', JSON.stringify(data.testimonials));
      }
      if (Array.isArray(data.portfolioProjects) && data.portfolioProjects.length > 0) {
        localStorage.setItem('opera_portfolio_projects', JSON.stringify(data.portfolioProjects));
      }
      if (Array.isArray(data.agencyProjects) && data.agencyProjects.length > 0) {
        localStorage.setItem('opera_agency_projects', JSON.stringify(data.agencyProjects));
      }
      if (Array.isArray(data.agencyClients) && data.agencyClients.length > 0) {
        localStorage.setItem('opera_agency_clients', JSON.stringify(data.agencyClients));
      }
      window.dispatchEvent(new Event('opera_config_changed'));
    }
  }).catch(e => console.error('Error syncing site settings via Supabase:', e));
}

if (typeof window !== 'undefined') {
  syncSiteSettingsWithServer();
  setInterval(syncSiteSettingsWithServer, 5000);
}
