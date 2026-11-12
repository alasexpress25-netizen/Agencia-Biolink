/**
 * Soporte multi-plataforma para el video destacado:
 * YouTube, Vimeo, Instagram, TikTok, Facebook, Google Drive y archivos directos (.mp4, .webm...).
 */
import { extractYouTubeId, getYouTubeEmbedUrl } from './youtube';

export type VideoKind =
  | 'youtube'
  | 'vimeo'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'drive'
  | 'file'
  | 'unknown';

export interface VideoInfo {
  kind: VideoKind;
  /** URL para un <iframe> (todo menos archivos directos) */
  embedSrc?: string;
  /** URL de un archivo de video directo para <video> */
  fileUrl?: string;
  /** Video vertical (reels, TikTok, shorts) */
  vertical?: boolean;
}

/** Imagen por defecto antigua (el micrófono): se trata como "sin miniatura propia" */
export const DEFAULT_THUMB =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80';

const FILE_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#].*)?$/i;

export function getVideoInfo(raw: string): VideoInfo {
  const url = (raw || '').trim();
  if (!url) return { kind: 'unknown' };

  if (/youtu\.?be/i.test(url)) {
    const id = extractYouTubeId(url);
    if (id) return { kind: 'youtube', embedSrc: getYouTubeEmbedUrl(url), vertical: /\/shorts\//i.test(url) };
  }

  let m = url.match(/vimeo\.com\/(?:[^/?#]+\/)*?(\d{6,})(?:\/([0-9a-f]{6,}))?/i);
  if (m) {
    const hash = m[2] ? `&h=${m[2]}` : '';
    return { kind: 'vimeo', embedSrc: `https://player.vimeo.com/video/${m[1]}?autoplay=1${hash}` };
  }

  m = url.match(/instagram\.com\/(?:[^/?#]+\/)?(p|reels?|tv)\/([\w-]+)/i);
  if (m) {
    const type = m[1].toLowerCase().startsWith('reel') ? 'reel' : m[1].toLowerCase();
    return { kind: 'instagram', embedSrc: `https://www.instagram.com/${type}/${m[2]}/embed`, vertical: true };
  }

  m = url.match(/tiktok\.com\/.*\/video\/(\d+)/i);
  if (m) return { kind: 'tiktok', embedSrc: `https://www.tiktok.com/embed/v2/${m[1]}`, vertical: true };

  if (/(facebook\.com|fb\.watch)/i.test(url) && /(\/videos?\/|\/watch|\/reel|fb\.watch)/i.test(url)) {
    return {
      kind: 'facebook',
      embedSrc: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`,
      vertical: /\/reel/i.test(url),
    };
  }

  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/i);
  if (m) return { kind: 'drive', embedSrc: `https://drive.google.com/file/d/${m[1]}/preview` };

  if (FILE_RE.test(url)) return { kind: 'file', fileUrl: url };

  return { kind: 'unknown' };
}

/** Miniatura que se puede obtener sin red extra (solo YouTube) */
export function getAutoThumbnail(videoUrl: string): string | null {
  const info = getVideoInfo(videoUrl);
  if (info.kind === 'youtube') {
    const id = extractYouTubeId(videoUrl);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return null;
}

/** Miniatura de Vimeo vía oEmbed (asíncrona) */
export async function fetchVimeoThumbnail(videoUrl: string): Promise<string | null> {
  try {
    if (getVideoInfo(videoUrl).kind !== 'vimeo') return null;
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail_url || null;
  } catch {
    return null;
  }
}

/** Miniatura a usar: la propia si existe, si no la del video */
export function resolveThumbnail(media: { videoUrl: string; thumbnailUrl?: string }): string {
  const custom = (media.thumbnailUrl || '').trim();
  if (custom && custom !== DEFAULT_THUMB) return custom;
  return getAutoThumbnail(media.videoUrl) || '';
}

export function isAutoThumbnail(thumb: string | undefined): boolean {
  const t = (thumb || '').trim();
  return !t || t === DEFAULT_THUMB || t.startsWith('https://img.youtube.com/vi/') || t.startsWith('https://i.vimeocdn.com/');
}

export interface VideoPreviewSource {
  type: 'iframe' | 'video';
  src: string;
}

/**
 * Fuente para la vista previa automática (silenciada y en bucle) dentro de la tarjeta.
 * Solo YouTube, Vimeo y archivos directos lo permiten; Instagram, TikTok, Facebook y Drive
 * no admiten autoplay/loop en sus reproductores incrustados.
 */
export function getPreviewSource(videoUrl: string): VideoPreviewSource | null {
  const info = getVideoInfo(videoUrl);
  if (info.kind === 'file' && info.fileUrl) return { type: 'video', src: info.fileUrl };
  if (info.kind === 'youtube') {
    const id = extractYouTubeId(videoUrl);
    if (!id) return null;
    return {
      type: 'iframe',
      src:
        `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
        `&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0`,
    };
  }
  if (info.kind === 'vimeo' && info.embedSrc) {
    return { type: 'iframe', src: info.embedSrc.replace('autoplay=1', 'autoplay=1&muted=1&loop=1&background=1') };
  }
  return null;
}

/** Comprueba que el video exista y sea público (YouTube/Vimeo vía oEmbed). Archivos: se valida al cargar. */
export async function checkVideoAvailable(videoUrl: string): Promise<boolean> {
  const info = getVideoInfo(videoUrl);
  if (info.kind === 'file') return true;
  const endpoint =
    info.kind === 'youtube'
      ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(videoUrl)}`
      : info.kind === 'vimeo'
        ? `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`
        : null;
  if (!endpoint) return false;
  try {
    const res = await fetch(endpoint);
    return res.ok;
  } catch {
    return false;
  }
}
