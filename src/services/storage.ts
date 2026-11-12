import { LinkItem, ProfileConfig, ThemeConfig, AnalyticsData, AnalyticsEvent } from '../types';
import { DEFAULT_LINKS, DEFAULT_PROFILE, THEME_PRESETS } from '../data/defaultData';
import { supabase, SITE_ID } from './supabase';
import { AVATAR_URL } from '../utils/avatar';

const STORAGE_KEYS = {
  LINKS: 'elamor_biolink_links_v1',
  PROFILE: 'elamor_biolink_profile_v1',
  THEME: 'elamor_biolink_theme_v1',
  ANALYTICS: 'elamor_biolink_analytics_v1',
};

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
let applyingRemote = false; // evita re-guardar lo que acabamos de bajar del servidor

// Estado de la última lectura de la config publicada:
//  'ready' = el cliente ya guardó su config · 'empty' = fila sin config (cliente nuevo) · 'error' = falló la lectura
export type RemoteStatus = 'unknown' | 'ready' | 'empty' | 'error';
let remoteStatus: RemoteStatus = 'unknown';

export type SyncStatus = 'saving' | 'saved' | 'error';
function emitSync(status: SyncStatus, message?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('biolink-sync', { detail: { status, message } }));
}

// Guarda automáticamente en Supabase (solo si hay un administrador con sesión iniciada)
function triggerAutoSync(service: typeof storageService) {
  if (typeof window === 'undefined' || applyingRemote || !supabase) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    service.saveRemoteConfig().catch(() => {});
  }, 800);
}

function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  const width = typeof window !== 'undefined' ? window.innerWidth : 768;
  return width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
}

// Origen REAL del visitante (?utm_source=... / ?ref=... / document.referrer)
function detectReferrer(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get('utm_source') || params.get('ref') || params.get('src') || '').toLowerCase()
      || (document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '');
    if (!raw || raw.includes(window.location.hostname)) return 'Directo';
    if (raw.includes('whatsapp') || raw.includes('wa.me')) return 'WhatsApp';
    if (raw.includes('instagram')) return 'Instagram';
    if (raw.includes('tiktok')) return 'TikTok';
    if (raw.includes('youtube') || raw.includes('youtu.be')) return 'YouTube';
    if (raw.includes('facebook') || raw.includes('fb.')) return 'Facebook';
    if (raw.includes('google')) return 'Google';
    return 'Otro';
  } catch {
    return 'Directo';
  }
}

function sendTrack(kind: 'visit' | 'click', linkId?: string, linkTitle?: string, device = detectDevice(), referrer = detectReferrer()) {
  if (!supabase) return;
  supabase
    .rpc('track_event', {
      p_site_id: SITE_ID,
      p_kind: kind,
      p_link_id: linkId ?? null,
      p_link_title: linkTitle ?? null,
      p_device: device,
      p_referrer: referrer,
    })
    .then(() => {}, () => {});
}

export const storageService = {
  getLinks(): LinkItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LINKS);
      if (stored) {
        const parsed: LinkItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading links from localStorage', e);
    }
    return DEFAULT_LINKS;
  },

  saveLinks(links: LinkItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
      triggerAutoSync(this);
    } catch (e) {
      console.error('Error saving links', e);
    }
  },

  getProfile(): ProfileConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          avatarUrl: AVATAR_URL,
          customTexts: {
            ...DEFAULT_PROFILE.customTexts,
            ...(parsed.customTexts || {}),
          },
          companyBranding: {
            ...DEFAULT_PROFILE.companyBranding,
            ...(parsed.companyBranding || {}),
          },
          categoryFilters: {
            ...DEFAULT_PROFILE.categoryFilters!,
            ...(parsed.categoryFilters || {}),
          },
          services: parsed.services && Array.isArray(parsed.services) ? parsed.services : DEFAULT_PROFILE.services,
        };
      }
    } catch (e) {
      console.error('Error loading profile', e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: ProfileConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      triggerAutoSync(this);
    } catch (e) {
      console.error('Error saving profile', e);
    }
  },

  getTheme(): ThemeConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...THEME_PRESETS.elamor,
          ...parsed,
          buttonSpacing: parsed.buttonSpacing || 'normal',
          buttonGapPx: parsed.buttonGapPx ?? 20,
        };
      }
    } catch (e) {
      console.error('Error loading theme', e);
    }
    return THEME_PRESETS.elamor;
  },

  saveTheme(theme: ThemeConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
      triggerAutoSync(this);
    } catch (e) {
      console.error('Error saving theme', e);
    }
  },

  getAnalytics(): AnalyticsData {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading analytics', e);
    }
    return {
      totalVisits: 0,
      totalClicks: 0,
      recentEvents: [],
      referrerCounts: {},
      deviceCounts: { mobile: 0, desktop: 0, tablet: 0 },
    };
  },

  saveAnalytics(data: AnalyticsData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving analytics', e);
    }
  },

  // Visita REAL: se registra en Supabase (el contador local solo es un reflejo para el panel)
  recordVisit(): AnalyticsData {
    // Una visita por sesión de pestaña (recargar no infla el contador)
    try {
      if (!sessionStorage.getItem('biolink_visit_sent')) {
        sessionStorage.setItem('biolink_visit_sent', '1');
        sendTrack('visit');
      }
    } catch {
      sendTrack('visit');
    }
    const current = this.getAnalytics();
    return current;
  },

  // Clic REAL: se registra en Supabase con dispositivo y origen reales
  recordClick(linkId: string, linkTitle: string): { updatedAnalytics: AnalyticsData; updatedLinks: LinkItem[] } {
    const device = detectDevice();
    const referrer = detectReferrer();
    sendTrack('click', linkId, linkTitle, device, referrer);

    // Reflejo local inmediato (se reemplaza por los datos del servidor al abrir el panel)
    const currentAnalytics = this.getAnalytics();
    const updatedLinks = this.getLinks().map(l => (l.id === linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l));
    const updatedAnalytics: AnalyticsData = {
      ...currentAnalytics,
      totalClicks: (currentAnalytics.totalClicks || 0) + 1,
    };
    return { updatedAnalytics, updatedLinks };
  },

  resetAnalytics(): { freshAnalytics: AnalyticsData; resetLinks: LinkItem[] } {
    const freshAnalytics: AnalyticsData = {
      totalVisits: 0,
      totalClicks: 0,
      recentEvents: [],
      referrerCounts: {
        WhatsApp: 0,
        Instagram: 0,
        Directo: 0,
        TikTok: 0,
        YouTube: 0,
        Google: 0,
      },
      deviceCounts: {
        mobile: 0,
        desktop: 0,
        tablet: 0,
      },
    };
    this.saveAnalytics(freshAnalytics);
    if (supabase) supabase.rpc('reset_analytics', { p_site_id: SITE_ID }).then(() => {}, () => {});

    const currentLinks = this.getLinks();
    const resetLinks = currentLinks.map((l) => ({ ...l, clicks: 0 }));
    this.saveLinks(resetLinks);

    return { freshAnalytics, resetLinks };
  },

  // Configuración que se guarda en Supabase (sin contraseñas ni métricas; los clics viven en el servidor)
  buildConfigPayload() {
    const prof = this.getProfile();
    return {
      profile: prof,
      services: prof.services || DEFAULT_PROFILE.services,
      links: this.getLinks().map(l => ({ ...l, clicks: 0 })),
      theme: this.getTheme(),
    };
  },

  // Copia de seguridad descargable (JSON)
  exportClientConfigFile(): string {
    return JSON.stringify(this.buildConfigPayload(), null, 2);
  },

  // ¿Hay un administrador con sesión iniciada?
  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // Baja la configuración publicada (la ven todos los visitantes) y la deja en caché local.
  // Devuelve null si no hay Supabase, no hay fila o la config todavía está vacía.
  async fetchRemoteConfig(): Promise<{ profile?: ProfileConfig; links?: LinkItem[]; theme?: ThemeConfig } | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('sites').select('config').eq('site_id', SITE_ID).maybeSingle();
      if (error) {
        remoteStatus = 'error';
        return null;
      }
      if (!data?.config || Object.keys(data.config).length === 0) {
        remoteStatus = 'empty';
        return null;
      }
      remoteStatus = 'ready';
      const cfg = data.config as any;
      applyingRemote = true;
      try {
        if (cfg.profile) {
          const prof = { ...cfg.profile };
          if (cfg.services && !prof.services) prof.services = cfg.services;
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(prof));
        }
        if (Array.isArray(cfg.links)) localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(cfg.links));
        if (cfg.theme) localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(cfg.theme));
      } finally {
        applyingRemote = false;
      }
      return { profile: cfg.profile ? this.getProfile() : undefined, links: Array.isArray(cfg.links) ? this.getLinks() : undefined, theme: cfg.theme ? this.getTheme() : undefined };
    } catch {
      remoteStatus = 'error';
      return null;
    }
  },

  getRemoteStatus(): RemoteStatus {
    return remoteStatus;
  },

  // Guarda la configuración en Supabase (requiere sesión del dueño; RLS lo comprueba en el servidor)
  async saveRemoteConfig(): Promise<{ ok: boolean; message: string }> {
    if (!supabase) return { ok: false, message: 'Supabase no está configurado.' };
    const session = await this.getSession();
    if (!session) return { ok: false, message: 'Inicia sesión para guardar.' };
    emitSync('saving');
    const { data, error } = await supabase
      .from('sites')
      .update({ config: this.buildConfigPayload() })
      .eq('site_id', SITE_ID)
      .select('site_id');
    if (error) {
      emitSync('error', error.message);
      return { ok: false, message: error.message };
    }
    if (!data || data.length === 0) {
      const msg = 'Este usuario no es el dueño del sitio "' + SITE_ID + '".';
      emitSync('error', msg);
      return { ok: false, message: msg };
    }
    emitSync('saved');
    return { ok: true, message: 'Guardado en la nube.' };
  },

  // Métricas reales desde el servidor (solo dueño)
  async fetchRemoteAnalytics(): Promise<{ analytics: AnalyticsData; clicksByLink: Record<string, number> } | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('get_analytics', { p_site_id: SITE_ID });
    if (error || !data) return null;
    const analytics: AnalyticsData = {
      totalVisits: data.totalVisits || 0,
      totalClicks: data.totalClicks || 0,
      recentEvents: data.recentEvents || [],
      referrerCounts: data.referrerCounts || {},
      deviceCounts: { mobile: 0, desktop: 0, tablet: 0, ...(data.deviceCounts || {}) },
    };
    this.saveAnalytics(analytics);
    return { analytics, clicksByLink: data.clicksByLink || {} };
  },
};
