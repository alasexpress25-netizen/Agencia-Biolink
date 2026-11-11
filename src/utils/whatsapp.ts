import { LinkItem, ProfileConfig, SocialLink } from '../types';

const WA_URL_RE = /^(https?:\/\/wa\.me\/)(\d{8,15})(.*)$/i;

// Deja solo dígitos y saca el prefijo internacional "00".
export function normalizeWhatsApp(input: string): string {
  let d = (input || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  return d;
}

// 10 a 15 dígitos incluyendo código de país (ej. 5548999053493).
export function isValidWhatsApp(digits: string): boolean {
  return /^\d{10,15}$/.test(digits);
}

export function formatWhatsAppPreview(digits: string): string {
  return digits ? `+${digits}` : '';
}

// Número de WhatsApp efectivo del perfil: el del enlace social activo (lo último que editó el
// cliente en su panel) y, si no hay, el campo propio `whatsappNumber`.
export function getWhatsAppNumber(profile: ProfileConfig): string {
  const wa = profile.socialLinks?.find((s) => s.platform === 'whatsapp' && s.active && s.url);
  const m = wa?.url.match(/wa\.me\/(\d{8,15})/i);
  if (m) return m[1];
  return profile.whatsappNumber || '';
}

// Saludo efectivo: el guardado en el perfil o, en sitios anteriores, el ?text= del enlace social de WhatsApp.
export function getWhatsAppGreeting(profile: ProfileConfig): string {
  if (typeof profile.whatsappGreeting === 'string') return profile.whatsappGreeting;
  const wa = profile.socialLinks?.find((s) => s.platform === 'whatsapp' && s.active && s.url);
  const m = wa?.url.match(/[?&]text=([^&]*)/i);
  if (!m) return '';
  try {
    return decodeURIComponent(m[1].replace(/\+/g, ' '));
  } catch {
    return '';
  }
}

function rewriteUrl(url: string, num: string, greeting?: string): string {
  const m = url.match(WA_URL_RE);
  if (!m) return url;
  // Saludo administrado por el cliente: todos los enlaces wa.me usan el mismo.
  if (greeting !== undefined) {
    return `${m[1]}${num}${greeting ? `?text=${encodeURIComponent(greeting)}` : ''}`;
  }
  // Sin saludo definido: mismo número se respeta tal cual; número distinto descarta el ?text= de otro contacto.
  return m[2] === num ? url : `${m[1]}${num}`;
}

// Aplica el número a todo: campo propio, enlace social de WhatsApp y cualquier enlace wa.me.
export function applyWhatsAppNumber(
  profile: ProfileConfig,
  links: LinkItem[],
  num: string,
  greeting?: string // undefined = no tocar el saludo; '' = sin saludo
): { profile: ProfileConfig; links: LinkItem[] } {
  let socialLinks: SocialLink[] = (profile.socialLinks || []).map((s) => {
    if (s.platform !== 'whatsapp') return s;
    if (!s.url || WA_URL_RE.test(s.url)) {
      const base = `https://wa.me/${num}${greeting ? `?text=${encodeURIComponent(greeting)}` : ''}`;
      return { ...s, url: s.url ? rewriteUrl(s.url, num, greeting) : base, active: true };
    }
    return s;
  });
  if (!socialLinks.some((s) => s.platform === 'whatsapp')) {
    socialLinks = [
      { id: 'soc-whatsapp', platform: 'whatsapp', label: 'WhatsApp', url: `https://wa.me/${num}${greeting ? `?text=${encodeURIComponent(greeting)}` : ''}`, active: true },
      ...socialLinks,
    ];
  }
  return {
    profile: {
      ...profile,
      whatsappNumber: num,
      ...(greeting !== undefined ? { whatsappGreeting: greeting } : {}),
      socialLinks,
    },
    links: links.map((l) => (l.url && WA_URL_RE.test(l.url) ? { ...l, url: rewriteUrl(l.url, num, greeting) } : l)),
  };
}
