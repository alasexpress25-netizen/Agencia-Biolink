export type IconName =
  | 'whatsapp'
  | 'youtube'
  | 'instagram'
  | 'music'
  | 'heart'
  | 'globe'
  | 'calendar'
  | 'dollar'
  | 'book'
  | 'message'
  | 'video'
  | 'mail'
  | 'phone'
  | 'sparkles'
  | 'star'
  | 'mapPin'
  | 'share';

export type ButtonAnimation = 'none' | 'pulse' | 'glow' | 'bounce';

export type ForegroundMotion = 'float' | 'pulse' | 'wobble' | 'bounce' | 'gif' | 'none';
export type PopIntensity = 'subtle' | 'medium' | 'dramatic';
export type BackgroundPlaneStyle = 'darkened' | 'silhouette' | 'glow-dark' | 'shadow';
export type PopOffsetDirection = 'top-left' | 'top-center' | 'top-right';

export type AvatarShape = 'circle' | 'rounded-square' | 'squircle';

export interface Pop3DConfig {
  enabled: boolean;
  foregroundMotion?: ForegroundMotion;
  popIntensity?: PopIntensity;
  backgroundStyle?: BackgroundPlaneStyle;
  offsetDirection?: PopOffsetDirection; // 'top-left' (Instagram offset double-icon style)
  backgroundVisibility?: number; // 0.8 for 80% visibility of bottom icon
  interactiveTilt?: boolean;
  isAvatarPhoto?: boolean; // When true, renders with consistent portrait photo formatting
  avatarShape?: AvatarShape; // 'circle' | 'rounded-square' | 'squircle'
}

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: IconName;
  iconType?: 'standard' | 'custom';
  customImageUrl?: string;
  pop3d?: Pop3DConfig;
  badge?: {
    text: string;
    color: 'amber' | 'rose' | 'emerald' | 'blue' | 'purple' | 'red';
  };
  animation: ButtonAnimation;
  active: boolean;
  clicks: number;
  isPinned?: boolean;
  category?: 'general' | 'social' | 'community' | 'donations' | 'multimedia';
}

export interface SocialLink {
  id: string;
  platform: 'whatsapp' | 'instagram' | 'youtube' | 'tiktok' | 'spotify' | 'facebook' | 'email' | 'phone' | 'globe';
  label: string;
  url: string;
  active: boolean;
}

export interface CustomTextsConfig {
  topBarButtonText?: string;
  topBarLiveBadge?: string;
  shareModalButtonText?: string;
  categoryAll?: string;
  categoryCommunity?: string;
  categoryMultimedia?: string;
  categoryDonations?: string;
  categoryCourses?: string;
  emptyStateText?: string;
  verifiedBadgeText?: string;
}

export interface CompanyBrandingConfig {
  enabled: boolean;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  label: string;
}

export interface CategoryFiltersConfig {
  enabled: boolean; // Master toggle: whether to show the filter tabs bar
  activeCategories: string[]; // List of category IDs that should be shown (e.g. ['all', 'community', 'multimedia', 'donations', 'courses'])
}

export interface ServiceItem {
  id: string;
  name: string;
  duration?: string;
  price: string;
  description?: string;
  icon?: string;
  badge?: string;
  active: boolean;
}

export interface ProfileConfig {
  name: string;
  appName?: string;
  browserTabTitle?: string;
  metaDescription?: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  verified: boolean;
  location: string;
  footerText: string;
  featuredMedia?: {
    enabled: boolean;
    title: string;
    subtitle: string;
    tag: string;
    videoUrl: string;
    thumbnailUrl: string;
    embedMode?: 'popup' | 'newTab';
    /** Vista previa automática en bucle y sin sonido en la tarjeta (por defecto activa) */
    autoplayLoop?: boolean;
  };
  socialLinks: SocialLink[];
  customTexts?: CustomTextsConfig;
  pwaIconUrl?: string;
  companyBranding?: CompanyBrandingConfig;
  categoryFilters?: CategoryFiltersConfig;
  services?: ServiceItem[];
  defaultLang?: 'pt' | 'es';
  // WhatsApp del negocio (solo dígitos con código de país). Lo carga el cliente en su primer ingreso.
  whatsappNumber?: string;
  // Mensaje de saludo que se precarga al tocar cualquier botón de WhatsApp (opcional).
  whatsappGreeting?: string;
}

export type ThemePresetId = 'elamor' | 'celestial' | 'oasis' | 'midnight' | 'minimal' | 'sunset' | 'custom';

export interface ThemeConfig {
  presetId: ThemePresetId;
  bgType: 'gradient' | 'mesh' | 'solid' | 'stars';
  bgGradient: string;
  bgSolidColor: string;
  cardStyle: 'glass' | 'solid' | 'neon' | 'soft-shadow' | 'border-only';
  cardBgColor: string;
  cardTextColor: string;
  cardBorderColor: string;
  accentColor: string;
  borderRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-full' | 'rounded-lg';
  fontStyle: 'sans' | 'serif';
  buttonHoverEffect: 'scale' | 'glow' | 'slide';
  showBackgroundBubbles: boolean;
  buttonSpacing?: 'compact' | 'normal' | 'relaxed' | 'spacious';
  buttonGapPx?: number; // Distance in pixels between link buttons (e.g. 8 to 48px)
}

export interface AnalyticsEvent {
  id: string;
  linkId: string;
  linkTitle: string;
  timestamp: number;
  device: 'mobile' | 'desktop' | 'tablet';
  referrer: string;
}

export interface AnalyticsData {
  totalVisits: number;
  totalClicks: number;
  recentEvents: AnalyticsEvent[];
  referrerCounts: Record<string, number>;
  deviceCounts: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}
