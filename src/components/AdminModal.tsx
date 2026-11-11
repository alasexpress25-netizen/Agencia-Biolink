import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  LayoutGrid,
  Palette,
  BarChart3,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Download,
  Upload,
  Copy,
  FileCode,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users,
  MousePointerClick,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Type,
  FileText,
  RotateCcw,
  Video,
  Play,
  Wand2,
  MessageCircle,
  Phone,
  Mail,
  Layers,
  Box,
  Image as ImageIcon,
  Sliders,
  User,
  MoveVertical,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  Briefcase,
} from 'lucide-react';
import {
  LinkItem,
  ProfileConfig,
  ThemeConfig,
  AnalyticsData,
  IconName,
  ButtonAnimation,
  ThemePresetId,
  CustomTextsConfig,
  SocialLink,
  ForegroundMotion,
  PopIntensity,
  BackgroundPlaneStyle,
  AvatarShape,
  ServiceItem,
} from '../types';
import { storageService } from '../services/storage';
import { WhatsAppNumberCard } from './WhatsAppNumberCard';
import { supabase, SITE_ID, isSupabaseConfigured } from '../services/supabase';
import { AVAILABLE_ICONS, IconRenderer } from './IconRenderer';
import { THEME_PRESETS, DEFAULT_SERVICES } from '../data/defaultData';
import { ICON_3D_PRESETS } from '../data/icon3dPresets';
import { AVATAR_PHOTO_PRESETS } from '../data/avatarPhotoPresets';
import { extractYouTubeId, getYouTubeThumbnail, formatSocialUrl } from '../utils/youtube';
import { downloadPwaIconSet } from '../utils/pwaIcons';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  profile: ProfileConfig;
  theme: ThemeConfig;
  analytics: AnalyticsData;
  onUpdateLinks: (links: LinkItem[]) => void;
  onUpdateProfile: (profile: ProfileConfig) => void;
  onUpdateTheme: (theme: ThemeConfig) => void;
  onUpdateAnalytics: (analytics: AnalyticsData) => void;
  onSimulateClick: (linkId: string) => void;
}

type TabType = 'analytics' | 'links' | 'services' | 'video' | 'social' | 'texts' | 'appearance' | 'security' | 'backup';

const AVATAR_PRESETS = [
  {
    name: 'El Amor Traspasa',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Comunidad & Luz',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Retiro & Alabanza',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cruz Dorada Minimal',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&auto=format&fit=crop&q=80',
  },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  links,
  profile,
  theme,
  analytics,
  onUpdateLinks,
  onUpdateProfile,
  onUpdateTheme,
  onUpdateAnalytics,
  onSimulateClick,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('video');

  // Confirmation Modals State (In-app, no window.confirm!)
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [showFactoryResetConfirm, setShowFactoryResetConfirm] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Link Editor State (Add or Edit)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Service Editor State (Add or Edit)
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Add new social network state
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialLink['platform']>('whatsapp');
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Success toast helper
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // PWA Icon generator state
  const [isGeneratingIcons, setIsGeneratingIcons] = useState(false);
  const [pwaProgressStep, setPwaProgressStep] = useState<string | null>(null);
  const [pwaUploadFile, setPwaUploadFile] = useState<File | null>(null);
  const [pwaUploadPreview, setPwaUploadPreview] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleDownloadPwaIcons = async () => {
    try {
      setIsGeneratingIcons(true);
      const source = pwaUploadFile || profile.pwaIconUrl || profile.avatarUrl;
      await downloadPwaIconSet(source, (filename) => {
        setPwaProgressStep(`Generando y descargando ${filename}...`);
      });
      showNotification('¡Los 3 iconos PWA se han descargado con éxito!');
      setPwaProgressStep(null);
    } catch (err) {
      console.error(err);
      showNotification('Error al procesar la imagen para los iconos.');
      setPwaProgressStep(null);
    } finally {
      setIsGeneratingIcons(false);
    }
  };

  // Trae las métricas REALES del servidor y las refleja en el panel
  const loadRemoteAnalytics = async () => {
    const remote = await storageService.fetchRemoteAnalytics();
    if (!remote) return;
    onUpdateAnalytics(remote.analytics);
    onUpdateLinks(
      storageService.getLinks().map((l) => ({ ...l, clicks: remote.clicksByLink[l.id] || 0 }))
    );
  };

  // Al abrir el panel: si ya hay sesión guardada, entra directo
  useEffect(() => {
    if (!isOpen || !supabase) return;
    let active = true;
    storageService.getSession().then((session) => {
      if (active && session) {
        setIsAuthenticated(true);
        loadRemoteAnalytics();
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Estado del guardado automático en la nube
  useEffect(() => {
    const onSync = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      setSyncState(d.status);
      setSyncMessage(d.message || '');
    };
    window.addEventListener('biolink-sync', onSync);
    return () => window.removeEventListener('biolink-sync', onSync);
  }, []);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  if (!isOpen) return null;

  // Handle Login (Supabase Auth: correo + contraseña)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setAuthError('Falta configurar Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).');
      return;
    }
    setIsLoggingIn(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.trim(),
      password: passwordInput,
    });
    setIsLoggingIn(false);
    if (error) {
      setAuthError('Correo o contraseña incorrectos.');
      return;
    }
    setIsAuthenticated(true);
    setPasswordInput('');
    loadRemoteAnalytics();
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    if (!supabase) {
      setPasswordError('Supabase no está configurado.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setPasswordSuccess('¡Contraseña actualizada con éxito! Se utilizará en tus próximos accesos.');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Link Actions
  const handleSaveLink = (linkToSave: LinkItem) => {
    let updated: LinkItem[];
    if (isAddingLink) {
      updated = [linkToSave, ...links];
    } else {
      updated = links.map((l) => (l.id === linkToSave.id ? linkToSave : l));
    }
    onUpdateLinks(updated);
    storageService.saveLinks(updated);
    setIsAddingLink(false);
    setEditingLink(null);
    showNotification(isAddingLink ? 'Enlace añadido con éxito' : 'Enlace actualizado');
  };

  const handleConfirmDeleteLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    onUpdateLinks(updated);
    storageService.saveLinks(updated);
    setDeletingLinkId(null);
    showNotification('Enlace eliminado con éxito');
  };

  const handleToggleLinkActive = (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, active: !l.active } : l));
    onUpdateLinks(updated);
    storageService.saveLinks(updated);
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    onUpdateLinks(newLinks);
    storageService.saveLinks(newLinks);
  };

  // Service Actions
  const currentServices: ServiceItem[] = profile.services || DEFAULT_SERVICES;

  const handleSaveService = (serviceToSave: ServiceItem) => {
    let updatedServices: ServiceItem[];
    if (isAddingService) {
      updatedServices = [...currentServices, serviceToSave];
    } else {
      updatedServices = currentServices.map((s) => (s.id === serviceToSave.id ? serviceToSave : s));
    }
    const updatedProfile = { ...profile, services: updatedServices };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setIsAddingService(false);
    setEditingService(null);
    showNotification(isAddingService ? 'Servicio agregado con éxito' : 'Servicio actualizado');
  };

  const handleConfirmDeleteService = (id: string) => {
    const updatedServices = currentServices.filter((s) => s.id !== id);
    const updatedProfile = { ...profile, services: updatedServices };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setDeletingServiceId(null);
    showNotification('Servicio eliminado con éxito');
  };

  const handleToggleServiceActive = (id: string) => {
    const updatedServices = currentServices.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    const updatedProfile = { ...profile, services: updatedServices };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentServices.length) return;

    const newServices = [...currentServices];
    const temp = newServices[index];
    newServices[index] = newServices[targetIndex];
    newServices[targetIndex] = temp;

    const updatedProfile = { ...profile, services: newServices };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
  };

  const handleResetServices = () => {
    const updatedProfile = { ...profile, services: DEFAULT_SERVICES };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    showNotification('Servicios restablecidos a valores por defecto');
  };

  // Theme Preset Change
  const handleSelectThemePreset = (presetId: ThemePresetId) => {
    const preset = THEME_PRESETS[presetId];
    if (preset) {
      onUpdateTheme(preset);
      storageService.saveTheme(preset);
      showNotification(`Tema "${presetId}" aplicado`);
    }
  };

  // Reset Analytics EXECUTION (Instant and 100% reliable)
  const executeResetAnalytics = () => {
    const { freshAnalytics, resetLinks } = storageService.resetAnalytics();
    onUpdateAnalytics(freshAnalytics);
    onUpdateLinks(resetLinks);
    setShowResetConfirm(false);
    showNotification('¡Todas las métricas y clics se han reiniciado a 0!');
  };

  // Export & Import full backup
  const handleExportBackup = () => {
    const json = storageService.exportClientConfigFile();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biolink-copia-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Copia de seguridad descargada');
  };

  // Update Custom Text helper
  const handleUpdateCustomText = (key: keyof CustomTextsConfig, value: string) => {
    const currentTexts = profile.customTexts || {};
    const updatedTexts = { ...currentTexts, [key]: value };
    const updatedProfile = { ...profile, customTexts: updatedTexts };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
  };

  // Toggle Category Filters master switch
  const handleToggleCategoryFilters = (enabled: boolean) => {
    const current = profile.categoryFilters || {
      enabled: true,
      activeCategories: ['all', 'community', 'multimedia', 'donations'],
    };
    const updatedProfile = {
      ...profile,
      categoryFilters: {
        ...current,
        enabled,
      },
    };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    showNotification(
      enabled
        ? 'Barra de filtros activada'
        : 'Barra de filtros desactivada (todos los botones se mostrarán juntos)'
    );
  };

  // Toggle individual category item
  const handleToggleCategoryItem = (catId: string) => {
    const current = profile.categoryFilters || {
      enabled: true,
      activeCategories: ['all', 'community', 'multimedia', 'donations'],
    };
    const active = current.activeCategories || ['all', 'community', 'multimedia', 'donations'];
    const exists = active.includes(catId);
    const newActive = exists ? active.filter((id) => id !== catId) : [...active, catId];
    const updatedProfile = {
      ...profile,
      categoryFilters: {
        ...current,
        activeCategories: newActive,
      },
    };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
  };

  // Auto-detect YouTube thumbnail
  const handleAutoThumbnailFromYouTube = () => {
    const currentVideoUrl = profile.featuredMedia?.videoUrl || '';
    const youtubeId = extractYouTubeId(currentVideoUrl);
    if (!youtubeId) {
      showNotification('No se detectó un enlace válido de YouTube. Introduce un enlace de YouTube primero.');
      return;
    }
    const thumb = getYouTubeThumbnail(currentVideoUrl);
    const updatedMedia = {
      ...(profile.featuredMedia || {
        enabled: true,
        title: 'Video Destacado',
        subtitle: 'Míralo ahora',
        tag: 'DESTACADO',
        videoUrl: currentVideoUrl,
        thumbnailUrl: thumb,
      }),
      thumbnailUrl: thumb,
    };
    const updatedProfile = { ...profile, featuredMedia: updatedMedia };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    showNotification('¡Miniatura de YouTube obtenida automáticamente!');
  };

  // Add new social link
  const handleAddSocial = () => {
    if (!newSocialUrl.trim()) {
      showNotification('Por favor introduce el enlace o dato de la red social');
      return;
    }
    const formattedUrl = formatSocialUrl(newSocialPlatform, newSocialUrl);
    const newSocial: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      label: newSocialLabel.trim() || newSocialPlatform.toUpperCase(),
      url: formattedUrl,
      active: true,
    };
    const updatedSocials = [...profile.socialLinks, newSocial];
    const updatedProfile = { ...profile, socialLinks: updatedSocials };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setIsAddingSocial(false);
    setNewSocialLabel('');
    setNewSocialUrl('');
    showNotification('Nueva red social añadida con éxito');
  };

  // Delete social link
  const handleDeleteSocial = (id: string) => {
    const updatedSocials = profile.socialLinks.filter((s) => s.id !== id);
    const updatedProfile = { ...profile, socialLinks: updatedSocials };
    onUpdateProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    showNotification('Red social eliminada');
  };

  // Render Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Panel de Administración</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            Ingresa con tu correo y contraseña para editar tu BioLink. Los cambios se guardan automáticamente.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Correo</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="username"
                required
                className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                autoFocus
              />
            </div>
            <div className="relative text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Introduce tu clave..."
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoggingIn ? 'Entrando…' : 'Entrar al Panel'}</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Calculate CTR
  const ctr =
    analytics.totalVisits > 0
      ? ((analytics.totalClicks / analytics.totalVisits) * 100).toFixed(1)
      : '0.0';

  const mostClickedLink = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
        {/* Toast notification */}
        {statusNotification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-amber-500 text-slate-950 shadow-xl animate-bounce">
            <Check className="w-4 h-4" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{profile.name ? `Administrador • ${profile.name}` : 'Panel de Administración'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  En Vivo
                </span>
                {syncState !== 'idle' && (
                  <span
                    title={syncMessage}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      syncState === 'saved'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : syncState === 'saving'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {syncState === 'saved' ? '✓ Guardado' : syncState === 'saving' ? 'Guardando…' : 'Error al guardar'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Personaliza enlaces, video destacado, redes reales y analíticas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors border border-slate-700 cursor-pointer"
              title="Cerrar Sesión del Administrador"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Destacado</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Redes Sociales ({profile.socialLinks.filter((s) => s.active).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'links'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Enlaces ({links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Servicios & Turnos ({(profile.services || DEFAULT_SERVICES).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analíticas en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Personalizar Textos</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Temas y Colores</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Seguridad & Clave</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Respaldo</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ================= TAB: VIDEO DESTACADO ================= */}
          {activeTab === 'video' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tarjeta de Video / Mensaje Destacado</h3>
                    <p className="text-xs text-slate-400">
                      Configura el enlace del video (YouTube, Live o enlace externo), su miniatura y modo de reproducción.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...profile,
                      featuredMedia: {
                        ...(profile.featuredMedia || {
                          enabled: false,
                          title: 'Último Mensaje: El Amor Nunca Se Rinde',
                          subtitle: 'Míralo ahora en YouTube • Domingos en Vivo',
                          tag: 'DESTACADO',
                          videoUrl: 'https://www.youtube.com',
                          thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
                          embedMode: 'popup',
                        }),
                        enabled: !profile.featuredMedia?.enabled,
                      },
                    };
                    onUpdateProfile(updated);
                    storageService.saveProfile(updated);
                    showNotification(
                      updated.featuredMedia.enabled
                        ? 'Tarjeta de video activada'
                        : 'Tarjeta de video ocultada'
                    );
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    profile.featuredMedia?.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {profile.featuredMedia?.enabled ? '✓ Visible en la web' : 'Oculto'}
                </button>
              </div>

              {profile.featuredMedia?.enabled && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
                  {/* Video URL Input with YouTube Auto-detection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-amber-400" />
                        <span>Enlace del Video (YouTube o URL) *</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoThumbnailFromYouTube}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/20 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Obtener Miniatura de YouTube</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={profile.featuredMedia.videoUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              videoUrl: val,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />

                      <a
                        href={profile.featuredMedia.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 flex items-center gap-1.5 shrink-0"
                        title="Probar enlace en pestaña nueva"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Probar Video</span>
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pega cualquier enlace de video de YouTube (ej: https://www.youtube.com/watch?v=...) o video en vivo.
                    </p>
                  </div>

                  {/* Mode of reproduction */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Modo de Reproducción al Hacer Clic
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              embedMode: 'popup' as const,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          profile.featuredMedia.embedMode !== 'newTab'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Reproductor Emergente (Dentro de la web)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Abre un reproductor de YouTube interactivo sin que el usuario salga de tu página.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              embedMode: 'newTab' as const,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          profile.featuredMedia.embedMode === 'newTab'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Abrir en YouTube Directamente</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Redirige o abre la app oficial de YouTube en una pestaña nueva.
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Título de la Tarjeta *
                      </label>
                      <input
                        type="text"
                        value={profile.featuredMedia.title}
                        onChange={(e) => {
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              title: e.target.value,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        placeholder="Ej: Transmisión en Vivo Domingos"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subtítulo descriptivo
                      </label>
                      <input
                        type="text"
                        value={profile.featuredMedia.subtitle}
                        onChange={(e) => {
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              subtitle: e.target.value,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        placeholder="Ej: 11:00 AM • Mensaje dominical"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Etiqueta / Badge (ej: EN VIVO, NUEVO, DESTACADO)
                      </label>
                      <input
                        type="text"
                        value={profile.featuredMedia.tag}
                        onChange={(e) => {
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              tag: e.target.value,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        URL de la Imagen de Fondo / Miniatura
                      </label>
                      <input
                        type="url"
                        value={profile.featuredMedia.thumbnailUrl}
                        onChange={(e) => {
                          const updated = {
                            ...profile,
                            featuredMedia: {
                              ...profile.featuredMedia!,
                              thumbnailUrl: e.target.value,
                            },
                          };
                          onUpdateProfile(updated);
                          storageService.saveProfile(updated);
                        }}
                        placeholder="https://images.unsplash.com/... o https://img.youtube.com/..."
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Live Preview Box */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">
                      Vista previa de cómo se ve la tarjeta actualmente:
                    </label>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 max-w-md bg-slate-900">
                      <div className="relative h-40 w-full overflow-hidden">
                        <img
                          src={profile.featuredMedia.thumbnailUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        {profile.featuredMedia.tag && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                            {profile.featuredMedia.tag}
                          </span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950">
                        <div className="font-bold text-sm text-white truncate">
                          {profile.featuredMedia.title || 'Título del Video'}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {profile.featuredMedia.subtitle || 'Subtítulo del Video'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: REDES SOCIALES REALES ================= */}
          {activeTab === 'social' && (
            <div className="space-y-6 animate-fade-in">
              <WhatsAppNumberCard
                profile={profile}
                links={links}
                onUpdateProfile={onUpdateProfile}
                onUpdateLinks={onUpdateLinks}
                notify={showNotification}
              />

              <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Botones de Redes Sociales Oficiales</h3>
                    <p className="text-xs text-slate-400">
                      Personaliza con tus datos reales (número de WhatsApp, @instagram, canal de YouTube, correo pastoral, etc.).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingSocial(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Otra Red</span>
                </button>
              </div>

              {/* Add New Social Form */}
              {isAddingSocial && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-amber-400">Añadir Nueva Red Social</h4>
                    <button
                      onClick={() => setIsAddingSocial(false)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Plataforma
                      </label>
                      <select
                        value={newSocialPlatform}
                        onChange={(e) =>
                          setNewSocialPlatform(e.target.value as SocialLink['platform'])
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="facebook">Facebook</option>
                        <option value="spotify">Spotify</option>
                        <option value="tiktok">TikTok</option>
                        <option value="email">Correo Electrónico</option>
                        <option value="phone">Teléfono / Llamada</option>
                        <option value="globe">Sitio Web / Enlace</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nombre / Etiqueta
                      </label>
                      <input
                        type="text"
                        value={newSocialLabel}
                        onChange={(e) => setNewSocialLabel(e.target.value)}
                        placeholder="Ej: WhatsApp Pastoral"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Enlace o Dato Real
                      </label>
                      <input
                        type="text"
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        placeholder="Ej: +34 600 000 000 o @usuario"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingSocial(false)}
                      className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddSocial}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
                    >
                      Guardar Red
                    </button>
                  </div>
                </div>
              )}

              {/* Social Links List */}
              <div className="space-y-3">
                {profile.socialLinks.map((soc, idx) => (
                  <div
                    key={soc.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                          <IconRenderer name={soc.platform} className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm text-white uppercase">{soc.platform}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Open real link to test */}
                        {soc.url && (
                          <a
                            href={soc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 flex items-center gap-1"
                            title="Probar en pestaña nueva"
                          >
                            <ExternalLink className="w-3 h-3 text-amber-400" />
                            <span className="hidden sm:inline">Probar Enlace</span>
                          </a>
                        )}

                        {/* Active toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...profile.socialLinks];
                            updated[idx] = { ...updated[idx], active: !updated[idx].active };
                            const updatedProfile = { ...profile, socialLinks: updated };
                            onUpdateProfile(updatedProfile);
                            storageService.saveProfile(updatedProfile);
                          }}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                            soc.active
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {soc.active ? 'Visible en cabecera' : 'Oculto'}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSocial(soc.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                          title="Eliminar red social"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Etiqueta / Nombre
                        </label>
                        <input
                          type="text"
                          value={soc.label}
                          onChange={(e) => {
                            const updated = [...profile.socialLinks];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            const updatedProfile = { ...profile, socialLinks: updated };
                            onUpdateProfile(updatedProfile);
                            storageService.saveProfile(updatedProfile);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-400">
                            Enlace Real (URL)
                          </label>
                          {/* Intelligent Assistant helper buttons */}
                          {soc.platform === 'whatsapp' && (
                            <button
                              type="button"
                              onClick={() => {
                                const formatted = formatSocialUrl('whatsapp', soc.url);
                                const updated = [...profile.socialLinks];
                                updated[idx] = { ...updated[idx], url: formatted };
                                const updatedProfile = { ...profile, socialLinks: updated };
                                onUpdateProfile(updatedProfile);
                                storageService.saveProfile(updatedProfile);
                                showNotification('Enlace de WhatsApp generado correctamente');
                              }}
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                            >
                              ⚡ Asistente WhatsApp (Número a wa.me)
                            </button>
                          )}
                          {soc.platform === 'instagram' && (
                            <button
                              type="button"
                              onClick={() => {
                                const formatted = formatSocialUrl('instagram', soc.url);
                                const updated = [...profile.socialLinks];
                                updated[idx] = { ...updated[idx], url: formatted };
                                const updatedProfile = { ...profile, socialLinks: updated };
                                onUpdateProfile(updatedProfile);
                                storageService.saveProfile(updatedProfile);
                                showNotification('Enlace de Instagram generado');
                              }}
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                            >
                              ⚡ Asistente Instagram (@usuario a link)
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={soc.url}
                          onChange={(e) => {
                            const updated = [...profile.socialLinks];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            const updatedProfile = { ...profile, socialLinks: updated };
                            onUpdateProfile(updatedProfile);
                            storageService.saveProfile(updatedProfile);
                          }}
                          placeholder={
                            soc.platform === 'whatsapp'
                              ? 'https://wa.me/34600000000 o +34 600 000 000'
                              : soc.platform === 'instagram'
                              ? 'https://instagram.com/tu_cuenta o @tu_cuenta'
                              : 'https://...'
                          }
                          className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: ANALYTICS ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              {/* In-app Reset Confirmation Banner */}
              {showResetConfirm && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">¿Confirmar reinicio de analíticas?</h4>
                      <p className="text-xs text-rose-200/80">
                        Esta acción pondrá en 0 el contador total de visitas, clics y los clics de cada uno de tus enlaces.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={executeResetAnalytics}
                      className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Sí, reiniciar todo a 0</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Total Visitas</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {analytics.totalVisits.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">visitas</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Total Clics</span>
                    <MousePointerClick className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {analytics.totalClicks.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-400 font-semibold">en vivo</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Tasa de Clics (CTR)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">{ctr}%</span>
                    <span className="text-[10px] text-slate-400">conversión</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Enlace Más Popular</span>
                    <Sparkles className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {mostClickedLink?.title || 'Ninguno'}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400">
                      {mostClickedLink?.clicks || 0} clics
                    </span>
                  </div>
                </div>
              </div>

              {/* Action bar for testing / simulation & functional RESET */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-white">
                    Monitor en Vivo de Clics
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (links.length > 0) {
                        const randomLink = links[Math.floor(Math.random() * links.length)];
                        onSimulateClick(randomLink.id);
                        showNotification(`¡Clic simulado en "${randomLink.title}"!`);
                      }
                    }}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>Probar Clic en Vivo</span>
                  </button>

                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3.5 py-2 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-600 rounded-xl transition-all border border-rose-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Reiniciar todas las métricas de clics"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Métricas a 0</span>
                  </button>
                </div>
              </div>

              {/* Performance by Link Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                  <span>Rendimiento por Enlace (Clics y Porcentaje)</span>
                  <span className="text-xs font-normal text-slate-400">Total: {analytics.totalClicks} clics</span>
                </h4>

                <div className="space-y-3">
                  {[...links]
                    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                    .map((item) => {
                      const sharePercent =
                        analytics.totalClicks > 0
                          ? Math.round(((item.clicks || 0) / analytics.totalClicks) * 100)
                          : 0;

                      return (
                        <div key={item.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <IconRenderer name={item.icon} className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="font-semibold text-slate-200 truncate">{item.title}</span>
                              {!item.active && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                  Pausado
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 font-mono">
                              <span className="text-slate-400">{sharePercent}%</span>
                              <span className="font-bold text-amber-400">{item.clicks || 0} clics</span>
                            </div>
                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                              style={{ width: `${Math.max(sharePercent, analytics.totalClicks > 0 ? 2 : 0)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Sources & Devices Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Referrers */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3">Fuentes de Tráfico (Referidos)</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.referrerCounts || {}).map(([ref, count]) => (
                      <div key={ref} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                        <span className="text-slate-300">{ref}</span>
                        <span className="font-mono font-semibold text-slate-100">{count} visitas</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Devices */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3">Dispositivos</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300">
                        <Smartphone className="w-4 h-4 text-amber-400" /> Móvil
                      </span>
                      <span className="font-mono font-semibold text-white">
                        {analytics.deviceCounts?.mobile || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300">
                        <Monitor className="w-4 h-4 text-blue-400" /> Computadora de Escritorio
                      </span>
                      <span className="font-mono font-semibold text-white">
                        {analytics.deviceCounts?.desktop || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300">
                        <Tablet className="w-4 h-4 text-purple-400" /> Tablet
                      </span>
                      <span className="font-mono font-semibold text-white">
                        {analytics.deviceCounts?.tablet || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Events Live Feed */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Registro de Clics Recientes</span>
                  <span className="text-[11px] text-slate-400 font-mono">Últimos eventos</span>
                </h4>
                {analytics.recentEvents.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No hay clics registrados aún (o han sido reiniciados a 0).</p>
                ) : (
                  <div className="divide-y divide-slate-900 max-h-56 overflow-y-auto">
                    {analytics.recentEvents.map((ev) => (
                      <div key={ev.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <span className="font-semibold text-slate-200 truncate">{ev.linkTitle}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-slate-400 font-mono text-[11px]">
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {ev.referrer}
                          </span>
                          <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: LINKS MANAGEMENT ================= */}
          {activeTab === 'links' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Lista de Enlaces</h3>
                  <p className="text-xs text-slate-400">
                    Ordena, edita o elimina enlaces. Todo se refleja al instante.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingLink({
                      id: `link-${Date.now()}`,
                      title: '',
                      subtitle: '',
                      url: 'https://',
                      icon: 'whatsapp',
                      animation: 'none',
                      active: true,
                      clicks: 0,
                    });
                    setIsAddingLink(true);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Nuevo Enlace</span>
                </button>
              </div>

              {/* Button Spacing & Separation Control */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <MoveVertical className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Separación entre Botones (Mover Distancia)</h4>
                      <p className="text-[10px] text-slate-400">
                        Separa los botones para darles más aire y evitar que los íconos 3D o fotos se toquen entre sí.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {theme.buttonGapPx ?? 18} px de separación
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  {/* Slider */}
                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">8px</span>
                    <input
                      type="range"
                      min={8}
                      max={48}
                      step={2}
                      value={theme.buttonGapPx ?? 18}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...theme, buttonGapPx: val };
                        onUpdateTheme(updated);
                        storageService.saveTheme(updated);
                      }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">48px</span>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[
                      { label: 'Compacto', px: 12 },
                      { label: 'Normal', px: 18 },
                      { label: 'Amplio 3D', px: 26 },
                      { label: 'Extra', px: 36 },
                    ].map((p) => (
                      <button
                        key={p.px}
                        type="button"
                        onClick={() => {
                          const updated = { ...theme, buttonGapPx: p.px };
                          onUpdateTheme(updated);
                          storageService.saveTheme(updated);
                        }}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all cursor-pointer ${
                          (theme.buttonGapPx ?? 18) === p.px
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links List */}
              <div className="space-y-2.5">
                {links.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      item.active
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-900 opacity-60'
                    }`}
                  >
                    {/* Left Icon & Info */}
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0 overflow-hidden">
                        {item.customImageUrl ? (
                          <img
                            src={item.customImageUrl}
                            alt=""
                            className="w-7 h-7 object-contain drop-shadow-sm"
                          />
                        ) : (
                          <IconRenderer name={item.icon} className="w-5 h-5" />
                        )}
                        {item.pop3d?.enabled && (
                          <span className="absolute top-0 right-0 px-1 py-0.2 text-[8px] font-black rounded-bl bg-amber-500 text-slate-950 tracking-tighter">
                            3D
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{item.url}</p>
                      </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      {/* Clicks badge */}
                      <span className="hidden md:inline-block px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                        {item.clicks || 0} clics
                      </span>

                      {/* Reorder Up/Down */}
                      <button
                        onClick={() => handleMoveLink(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-800 cursor-pointer"
                        title="Mover arriba"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveLink(index, 'down')}
                        disabled={index === links.length - 1}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-800 cursor-pointer"
                        title="Mover abajo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleLinkActive(item.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border cursor-pointer ${
                          item.active
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title={item.active ? 'Desactivar' : 'Activar'}
                      >
                        {item.active ? 'Visible' : 'Oculto'}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingLink({ ...item });
                          setIsAddingLink(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-amber-300 transition-colors border border-slate-800 cursor-pointer"
                        title="Editar enlace"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button with In-app inline confirmation */}
                      {deletingLinkId === item.id ? (
                        <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-700 animate-fade-in">
                          <span className="text-[10px] text-rose-200 px-1">¿Eliminar?</span>
                          <button
                            onClick={() => handleConfirmDeleteLink(item.id)}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setDeletingLinkId(null)}
                            className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingLinkId(item.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800 cursor-pointer"
                          title="Eliminar enlace"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Link Edit / Add Form */}
              {editingLink && (
                <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      <span>{isAddingLink ? 'Añadir Nuevo Enlace' : 'Editar Enlace'}</span>
                    </h4>
                    <button
                      onClick={() => setEditingLink(null)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Título del Botón *
                      </label>
                      <input
                        type="text"
                        value={editingLink.title}
                        onChange={(e) =>
                          setEditingLink({ ...editingLink, title: e.target.value })
                        }
                        placeholder="Ej: Grupo Oficial en WhatsApp"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subtítulo o Descripción corta
                      </label>
                      <input
                        type="text"
                        value={editingLink.subtitle || ''}
                        onChange={(e) =>
                          setEditingLink({ ...editingLink, subtitle: e.target.value })
                        }
                        placeholder="Ej: Reflexiones diarias y oración"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        URL de Destino *
                      </label>
                      <input
                        type="url"
                        value={editingLink.url}
                        onChange={(e) =>
                          setEditingLink({ ...editingLink, url: e.target.value })
                        }
                        placeholder="https://chat.whatsapp.com/... o https://youtube.com/..."
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Icon Selection & 3D Pop-out configuration */}
                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-amber-400" />
                          <label className="text-xs font-bold text-white">
                            Icono del Botón & Efecto 3D Interactivo
                          </label>
                        </div>

                        {/* Mode Switcher: 3 Visual Styles */}
                        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLink({
                                ...editingLink,
                                iconType: 'standard',
                                pop3d: editingLink.pop3d ? { ...editingLink.pop3d, isAvatarPhoto: false } : undefined,
                              });
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              editingLink.iconType !== 'custom'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Ícono Estándar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const defaultPreset = ICON_3D_PRESETS[0];
                              setEditingLink({
                                ...editingLink,
                                iconType: 'custom',
                                customImageUrl: (!editingLink.pop3d?.isAvatarPhoto && editingLink.customImageUrl) ? editingLink.customImageUrl : defaultPreset.svgDataUri,
                                pop3d: {
                                  ...(editingLink.pop3d || {
                                    foregroundMotion: 'float',
                                    popIntensity: 'medium',
                                    backgroundStyle: 'darkened',
                                    backgroundVisibility: 0.8,
                                    offsetDirection: 'top-left',
                                    interactiveTilt: true,
                                  }),
                                  enabled: true,
                                  isAvatarPhoto: false,
                                },
                              });
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                              editingLink.iconType === 'custom' && !editingLink.pop3d?.isAvatarPhoto
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Sticker 3D / GIF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const defaultAvatar = AVATAR_PHOTO_PRESETS[0];
                              setEditingLink({
                                ...editingLink,
                                iconType: 'custom',
                                customImageUrl: (editingLink.pop3d?.isAvatarPhoto && editingLink.customImageUrl) ? editingLink.customImageUrl : defaultAvatar.photoUrl,
                                pop3d: {
                                  ...(editingLink.pop3d || {
                                    foregroundMotion: 'float',
                                    popIntensity: 'medium',
                                    backgroundStyle: 'darkened',
                                    backgroundVisibility: 0.8,
                                    offsetDirection: 'top-left',
                                    interactiveTilt: true,
                                  }),
                                  enabled: true,
                                  isAvatarPhoto: true,
                                  avatarShape: editingLink.pop3d?.avatarShape || 'circle',
                                },
                              });
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                              editingLink.iconType === 'custom' && editingLink.pop3d?.isAvatarPhoto
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <User className="w-3 h-3" />
                            <span>Foto Avatar / Retrato 3D</span>
                          </button>
                        </div>
                      </div>

                      {/* Mode A: Standard Icon */}
                      {editingLink.iconType !== 'custom' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Selecciona el ícono vectorial:
                            </label>
                            <select
                              value={editingLink.icon}
                              onChange={(e) =>
                                setEditingLink({ ...editingLink, icon: e.target.value as IconName })
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                            >
                              {AVAILABLE_ICONS.map((ic) => (
                                <option key={ic.name} value={ic.name}>
                                  {ic.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div>
                              <span className="text-xs font-bold text-white block">Efecto 3D en ícono</span>
                              <span className="text-[10px] text-slate-400">Levitación y relieve</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const current = editingLink.pop3d?.enabled ?? false;
                                setEditingLink({
                                  ...editingLink,
                                  pop3d: {
                                    enabled: !current,
                                    foregroundMotion: 'float',
                                    popIntensity: 'subtle',
                                    backgroundStyle: 'darkened',
                                    interactiveTilt: true,
                                  },
                                });
                              }}
                              className={`px-3 py-1 text-xs font-semibold rounded-lg border cursor-pointer ${
                                editingLink.pop3d?.enabled
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              {editingLink.pop3d?.enabled ? '3D Activado' : 'Estándar'}
                            </button>
                          </div>
                        </div>
                      ) : editingLink.pop3d?.isAvatarPhoto ? (
                        /* Mode C: Avatar Portrait Photo (Persona con herramientas, gestos, formato uniforme) */
                        <div className="space-y-4 pt-1">
                          {/* Educational Note on Avatar Photos */}
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                            <User className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                              <strong className="text-white">Fotos Interactivas Tipo Avatar:</strong> Sube una foto de ti o de la persona sosteniendo su herramienta de trabajo (<strong>tijeras de peluquería, cuaderno de cursos, cámara, laptop, etc.</strong>). Todas mantienen el mismo tamaño uniforme (48x48px) y recorte centrado, con el efecto 3D Instagram (abajo la foto oscura al 80% y arriba la foto completa flotando hacia arriba-izquierda).
                            </div>
                          </div>

                          {/* Avatar Shape Geometry Selector */}
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <label className="block text-[11px] font-semibold text-slate-300 mb-2">
                              Formato Geométrico del Avatar (Mismo formato para todos):
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {(
                                [
                                  { id: 'circle', label: 'Círculo', desc: 'Redondo clásico', iconClass: 'rounded-full' },
                                  { id: 'rounded-square', label: 'Cuadrado', desc: 'Esquinas redondeadas', iconClass: 'rounded-2xl' },
                                  { id: 'squircle', label: 'Squircle', desc: 'Diseño suave moderno', iconClass: 'rounded-xl' },
                                ] as const
                              ).map((shapeItem) => {
                                const isSelected = (editingLink.pop3d?.avatarShape || 'circle') === shapeItem.id;
                                return (
                                  <button
                                    key={shapeItem.id}
                                    type="button"
                                    onClick={() => {
                                      setEditingLink({
                                        ...editingLink,
                                        pop3d: {
                                          ...(editingLink.pop3d || {
                                            enabled: true,
                                            foregroundMotion: 'float',
                                            popIntensity: 'medium',
                                            backgroundStyle: 'darkened',
                                            offsetDirection: 'top-left',
                                            backgroundVisibility: 0.8,
                                            interactiveTilt: true,
                                          }),
                                          avatarShape: shapeItem.id as AvatarShape,
                                        },
                                      });
                                    }}
                                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                    }`}
                                  >
                                    <div className={`w-8 h-8 ${shapeItem.iconClass} border-2 ${isSelected ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600 bg-slate-800'}`} />
                                    <span className="text-xs font-bold">{shapeItem.label}</span>
                                    <span className="text-[10px] text-slate-400 text-center">{shapeItem.desc}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Image source: Upload personal photo or URL */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                O introduce URL de la foto personal:
                              </label>
                              <input
                                type="url"
                                value={editingLink.customImageUrl || ''}
                                onChange={(e) =>
                                  setEditingLink({
                                    ...editingLink,
                                    customImageUrl: e.target.value,
                                  })
                                }
                                placeholder="https://... enlace a la foto"
                                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                Sube tu foto desde tu dispositivo:
                              </label>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/jpg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setEditingLink({
                                        ...editingLink,
                                        customImageUrl: ev.target?.result as string,
                                      });
                                      showNotification('¡Foto de avatar cargada con éxito!');
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Avatar Presets Gallery (Gesto con tijeras, cuaderno, cámara, etc.) */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                              <span>Modelos y Ejemplos de Fotos (Personas con Objetos):</span>
                              <span className="text-amber-400 text-[10px] font-bold">{AVATAR_PHOTO_PRESETS.length} fotos listas</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-900">
                              {AVATAR_PHOTO_PRESETS.map((avatar) => {
                                const isSelected = editingLink.customImageUrl === avatar.photoUrl;
                                const shapeClass =
                                  editingLink.pop3d?.avatarShape === 'rounded-square'
                                    ? 'rounded-2xl'
                                    : editingLink.pop3d?.avatarShape === 'squircle'
                                    ? 'rounded-xl'
                                    : 'rounded-full';
                                return (
                                  <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => {
                                      setEditingLink({
                                        ...editingLink,
                                        customImageUrl: avatar.photoUrl,
                                      });
                                    }}
                                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer text-left ${
                                      isSelected
                                        ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/20'
                                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className={`w-12 h-12 overflow-hidden ${shapeClass} ring-2 ${isSelected ? 'ring-amber-400' : 'ring-white/30'} shrink-0`}>
                                      <img
                                        src={avatar.photoUrl}
                                        alt={avatar.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-200 truncate w-full text-center">
                                      {avatar.name}
                                    </span>
                                    <span className="text-[9px] text-amber-300 truncate w-full text-center">
                                      {avatar.profession}
                                    </span>
                                    <span className="text-[8px] text-slate-400 text-center leading-tight line-clamp-1">
                                      {avatar.gesture}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3D Pop-Out Parameters */}
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold text-white">
                                  Efecto Instagram: Foto Doble con Desplazamiento 3D
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = editingLink.pop3d?.enabled ?? true;
                                  setEditingLink({
                                    ...editingLink,
                                    pop3d: {
                                      ...(editingLink.pop3d || {
                                        foregroundMotion: 'float',
                                        popIntensity: 'medium',
                                        backgroundStyle: 'darkened',
                                        offsetDirection: 'top-left',
                                        backgroundVisibility: 0.8,
                                        interactiveTilt: true,
                                        isAvatarPhoto: true,
                                      }),
                                      enabled: !current,
                                    },
                                  });
                                }}
                                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border cursor-pointer ${
                                  editingLink.pop3d?.enabled !== false
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }`}
                              >
                                {editingLink.pop3d?.enabled !== false ? 'Efecto 3D Activo' : 'Desactivado'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Posición Pop-Out
                                </label>
                                <select
                                  value={editingLink.pop3d?.offsetDirection || 'top-left'}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          foregroundMotion: 'float',
                                          popIntensity: 'medium',
                                          backgroundStyle: 'darkened',
                                          backgroundVisibility: 0.8,
                                          interactiveTilt: true,
                                          isAvatarPhoto: true,
                                        }),
                                        offsetDirection: e.target.value as any,
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="top-left">Arriba-Izquierda (Estilo Instagram)</option>
                                  <option value="top-center">Arriba Centrado</option>
                                  <option value="top-right">Arriba-Derecha</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Movimiento Primer Plano
                                </label>
                                <select
                                  value={editingLink.pop3d?.foregroundMotion || 'float'}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          popIntensity: 'medium',
                                          backgroundStyle: 'darkened',
                                          offsetDirection: 'top-left',
                                          interactiveTilt: true,
                                          isAvatarPhoto: true,
                                        }),
                                        foregroundMotion: e.target.value as ForegroundMotion,
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="float">Levitación 3D (Flotar)</option>
                                  <option value="pulse">Pulso 3D / Respiración</option>
                                  <option value="wobble">Bamboleo Dinámico</option>
                                  <option value="bounce">Rebote Elástico</option>
                                  <option value="none">Estático con Relieve</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Intensidad de Salida 3D
                                </label>
                                <select
                                  value={editingLink.pop3d?.popIntensity || 'medium'}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          foregroundMotion: 'float',
                                          backgroundStyle: 'darkened',
                                          offsetDirection: 'top-left',
                                          interactiveTilt: true,
                                          isAvatarPhoto: true,
                                        }),
                                        popIntensity: e.target.value as PopIntensity,
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="subtle">Sutil (Sobresale un poco)</option>
                                  <option value="medium">Medio (Sobresale nítido)</option>
                                  <option value="dramatic">Dramático (Sale del botón)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Visibilidad Foto Inferior
                                </label>
                                <select
                                  value={editingLink.pop3d?.backgroundVisibility ?? 0.8}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          foregroundMotion: 'float',
                                          popIntensity: 'medium',
                                          backgroundStyle: 'darkened',
                                          offsetDirection: 'top-left',
                                          interactiveTilt: true,
                                          isAvatarPhoto: true,
                                        }),
                                        backgroundVisibility: parseFloat(e.target.value),
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="0.8">80% Visible (Estilo Instagram)</option>
                                  <option value="0.6">60% Visible</option>
                                  <option value="0.4">40% Muy Oscuro</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Live Interactive Preview Card for Avatar Photo */}
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                            <span className="text-[10px] font-bold text-amber-400 block mb-2 uppercase tracking-wider flex items-center justify-between">
                              <span>Previsualización en tiempo real del botón avatar:</span>
                              <span className="text-slate-400 font-mono text-[9px]">Doble plano foto 3D</span>
                            </span>
                            {(() => {
                              const shapeClass =
                                editingLink.pop3d?.avatarShape === 'rounded-square'
                                  ? 'rounded-2xl'
                                  : editingLink.pop3d?.avatarShape === 'squircle'
                                  ? 'rounded-xl'
                                  : 'rounded-full';
                              return (
                                <div className="relative p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between overflow-visible">
                                  <div className="flex items-center gap-3.5">
                                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                      {/* Background photo darkened 80% */}
                                      <div
                                        className={`absolute inset-0 translate-x-1.5 translate-y-1.5 ${shapeClass} bg-black/75 border border-black/70 overflow-hidden flex items-center justify-center`}
                                        style={{ opacity: editingLink.pop3d?.backgroundVisibility ?? 0.8 }}
                                      >
                                        {editingLink.customImageUrl ? (
                                          <img
                                            src={editingLink.customImageUrl}
                                            alt=""
                                            className="w-full h-full object-cover filter brightness-[0.4] blur-[0.4px]"
                                          />
                                        ) : (
                                          <User className="w-6 h-6 text-slate-500" />
                                        )}
                                      </div>
                                      {/* Shadow */}
                                      <div className="absolute top-5 left-0 w-8 h-2.5 bg-black/75 rounded-full blur-[2px]" />
                                      {/* Foreground popping out towards top-left */}
                                      <div className="relative z-20 -translate-x-3.5 -translate-y-3.5 scale-120 animate-pop3d-top-left-float">
                                        <div className={`w-12 h-12 overflow-hidden ${shapeClass} ring-2 ring-white/70 border border-white/40 shadow-xl filter drop-shadow-[6px_10px_14px_rgba(0,0,0,0.85)] bg-slate-900`}>
                                          {editingLink.customImageUrl ? (
                                            <img
                                              src={editingLink.customImageUrl}
                                              alt=""
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <User className="w-6 h-6 text-amber-400 m-auto mt-2.5" />
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-bold text-xs text-white">
                                        {editingLink.title || 'Título del Botón'}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        {editingLink.subtitle || 'Subtítulo del botón'}
                                      </div>
                                    </div>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        /* Mode B: Custom Image / GIF with 3D Double-Plane Pop-Out */
                        <div className="space-y-4 pt-1">
                          {/* Image source: URL input or Device File Upload */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                URL de Imagen o GIF (transparente recomendado):
                              </label>
                              <input
                                type="url"
                                value={editingLink.customImageUrl || ''}
                                onChange={(e) =>
                                  setEditingLink({
                                    ...editingLink,
                                    customImageUrl: e.target.value,
                                  })
                                }
                                placeholder="https://... o enlace a GIF animado"
                                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                O sube un archivo desde tu dispositivo:
                              </label>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setEditingLink({
                                        ...editingLink,
                                        customImageUrl: ev.target?.result as string,
                                      });
                                      showNotification('Imagen o GIF cargado');
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Informational Creator Note */}
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                              <strong>¡Crea y sube cualquier actividad!</strong> No estás limitado a redes sociales. Si das cursos, talleres o vendes servicios, puedes crear tu icono (por ejemplo un cuaderno, diploma, maletín o tu logo) en Canva, Photoshop o IA en formato <strong>PNG transparente o GIF animado</strong> y subirlo con el botón de arriba.
                            </div>
                          </div>

                          {/* 3D Presets Gallery with Education, Courses & Business */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                              <span>Galería de Stickers 3D (Cursos, Negocios y Redes):</span>
                              <span className="text-amber-400 text-[10px] font-bold">{ICON_3D_PRESETS.length} modelos 3D listos</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-900">
                              {ICON_3D_PRESETS.map((preset) => {
                                const isSelected = editingLink.customImageUrl === preset.svgDataUri;
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => {
                                      setEditingLink({
                                        ...editingLink,
                                        customImageUrl: preset.svgDataUri,
                                      });
                                    }}
                                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/20'
                                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                      <img
                                        src={preset.svgDataUri}
                                        alt={preset.name}
                                        className="w-8 h-8 object-contain filter drop-shadow-md"
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-200 truncate w-full text-center">
                                      {preset.name}
                                    </span>
                                    <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                                      {preset.badge}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3D Pop-Out Parameters */}
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold text-white">
                                  Efecto Instagram: Doble Plano con Desplazamiento
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = editingLink.pop3d?.enabled ?? true;
                                  setEditingLink({
                                    ...editingLink,
                                    pop3d: {
                                      ...(editingLink.pop3d || {
                                        foregroundMotion: 'float',
                                        popIntensity: 'medium',
                                        backgroundStyle: 'darkened',
                                        offsetDirection: 'top-left',
                                        backgroundVisibility: 0.8,
                                        interactiveTilt: true,
                                      }),
                                      enabled: !current,
                                    },
                                  });
                                }}
                                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border cursor-pointer ${
                                  editingLink.pop3d?.enabled !== false
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }`}
                              >
                                {editingLink.pop3d?.enabled !== false ? 'Efecto 3D Activo' : 'Desactivado'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              {/* Offset Direction: Instagram Style Top-Left */}
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Posición Pop-Out (Estilo Instagram)
                                </label>
                                <select
                                  value={editingLink.pop3d?.offsetDirection || 'top-left'}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          foregroundMotion: 'float',
                                          popIntensity: 'medium',
                                          backgroundStyle: 'darkened',
                                          backgroundVisibility: 0.8,
                                          interactiveTilt: true,
                                        }),
                                        offsetDirection: e.target.value as any,
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="top-left">Arriba-Izquierda (Instagram: 80% abajo y 100% arriba)</option>
                                  <option value="top-center">Arriba Centrado</option>
                                  <option value="top-right">Arriba-Derecha</option>
                                </select>
                              </div>

                              {/* Foreground Movement */}
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Movimiento Primer Plano
                                </label>
                                <select
                                  value={editingLink.pop3d?.foregroundMotion || 'float'}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          popIntensity: 'medium',
                                          backgroundStyle: 'darkened',
                                          offsetDirection: 'top-left',
                                          interactiveTilt: true,
                                        }),
                                        foregroundMotion: e.target.value as ForegroundMotion,
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="float">Levitación 3D (Flotar)</option>
                                  <option value="pulse">Pulso 3D / Respiración</option>
                                  <option value="wobble">Bamboleo Dinámico</option>
                                  <option value="bounce">Rebote Elástico</option>
                                  <option value="gif">Modo GIF Nativo / Suave</option>
                                  <option value="none">Estático con Relieve</option>
                                </select>
                              </div>

                              {/* Pop Intensity */}
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Intensidad de Salida 3D
                                </label>
                                <select
                                  value={editingLink.pop3d?.popIntensity || 'medium'}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          foregroundMotion: 'float',
                                          backgroundStyle: 'darkened',
                                          offsetDirection: 'top-left',
                                          interactiveTilt: true,
                                        }),
                                        popIntensity: e.target.value as PopIntensity,
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="subtle">Sutil (Sobresale un poco)</option>
                                  <option value="medium">Medio (Sobresale nítido)</option>
                                  <option value="dramatic">Dramático (Sale del botón)</option>
                                </select>
                              </div>

                              {/* Background Visibility */}
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                  Visibilidad Ícono Inferior
                                </label>
                                <select
                                  value={editingLink.pop3d?.backgroundVisibility ?? 0.8}
                                  onChange={(e) =>
                                    setEditingLink({
                                      ...editingLink,
                                      pop3d: {
                                        ...(editingLink.pop3d || {
                                          enabled: true,
                                          foregroundMotion: 'float',
                                          popIntensity: 'medium',
                                          backgroundStyle: 'darkened',
                                          offsetDirection: 'top-left',
                                          interactiveTilt: true,
                                        }),
                                        backgroundVisibility: parseFloat(e.target.value),
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="0.8">80% Visible (Estilo Instagram)</option>
                                  <option value="0.6">60% Visible</option>
                                  <option value="0.4">40% Muy Oscuro</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Live Interactive Preview Card for Sticker / GIF */}
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                            <span className="text-[10px] font-bold text-amber-400 block mb-2 uppercase tracking-wider flex items-center justify-between">
                              <span>Previsualización en tiempo real del botón:</span>
                              <span className="text-slate-400 font-mono text-[9px]">Ambos íconos visibles en doble plano</span>
                            </span>
                            <div className="relative p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between overflow-visible">
                              <div className="flex items-center gap-3.5">
                                {/* 3D preview double-plane box */}
                                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                  {/* Background darkened 80% visible, shifted slightly lower right */}
                                  <div
                                    className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl bg-black/60 border border-black/50 overflow-hidden flex items-center justify-center"
                                    style={{ opacity: editingLink.pop3d?.backgroundVisibility ?? 0.8 }}
                                  >
                                    {editingLink.customImageUrl ? (
                                      <img
                                        src={editingLink.customImageUrl}
                                        alt=""
                                        className="w-full h-full object-contain filter brightness-[0.4] blur-[0.4px] scale-90"
                                      />
                                    ) : (
                                      <IconRenderer name={editingLink.icon} className="w-6 h-6 text-slate-400" />
                                    )}
                                  </div>
                                  {/* Shadow */}
                                  <div className="absolute top-5 left-0 w-8 h-2.5 bg-black/75 rounded-full blur-[2px]" />
                                  {/* Foreground popping out towards top-left! */}
                                  <div className="relative z-20 -translate-x-3.5 -translate-y-3.5 scale-120 animate-pop3d-top-left-float">
                                    {editingLink.customImageUrl ? (
                                      <img
                                        src={editingLink.customImageUrl}
                                        alt=""
                                        className="w-11 h-11 object-contain drop-shadow-[6px_10px_14px_rgba(0,0,0,0.9)]"
                                      />
                                    ) : (
                                      <Sparkles className="w-8 h-8 text-amber-400" />
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <div className="font-bold text-xs text-white">
                                    {editingLink.title || 'Título del Botón'}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {editingLink.subtitle || 'Subtítulo del botón'}
                                  </div>
                                </div>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Categoría
                      </label>
                      <select
                        value={editingLink.category || 'general'}
                        onChange={(e) =>
                          setEditingLink({ ...editingLink, category: e.target.value as any })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="general">General</option>
                        <option value="community">Comunidad</option>
                        <option value="multimedia">Transmisiones / Video</option>
                        <option value="donations">Donaciones / Siembra</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Efecto de Animación
                      </label>
                      <select
                        value={editingLink.animation}
                        onChange={(e) =>
                          setEditingLink({
                            ...editingLink,
                            animation: e.target.value as ButtonAnimation,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="none">Sin animación</option>
                        <option value="pulse">Pulso suave</option>
                        <option value="glow">Resplandor luminoso</option>
                        <option value="bounce">Rebote llamativo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Texto de Etiqueta (Badge opcional)
                      </label>
                      <input
                        type="text"
                        value={editingLink.badge?.text || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingLink({
                            ...editingLink,
                            badge: val
                              ? {
                                  text: val,
                                  color: editingLink.badge?.color || 'amber',
                                }
                              : undefined,
                          });
                        }}
                        placeholder="Ej: EN VIVO, NUEVO, DESTACADO"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Color de Etiqueta
                      </label>
                      <select
                        value={editingLink.badge?.color || 'amber'}
                        onChange={(e) => {
                          if (editingLink.badge) {
                            setEditingLink({
                              ...editingLink,
                              badge: {
                                ...editingLink.badge,
                                color: e.target.value as any,
                              },
                            });
                          }
                        }}
                        disabled={!editingLink.badge}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white disabled:opacity-40 focus:outline-none focus:border-amber-500"
                      >
                        <option value="amber">Ámbar / Oro</option>
                        <option value="emerald">Verde Esmeralda</option>
                        <option value="red">Rojo Vivo</option>
                        <option value="rose">Rosa Cálido</option>
                        <option value="blue">Azul Océano</option>
                        <option value="purple">Púrpura</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingLink(null)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingLink.title.trim()) {
                          showNotification('Por favor ingresa un título para el enlace');
                          return;
                        }
                        handleSaveLink(editingLink);
                      }}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                    >
                      Guardar Enlace
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: SERVICES & APPOINTMENTS ================= */}
          {activeTab === 'services' && (
            <div className="space-y-4 animate-fade-in">
              {/* Quick links & Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>Catálogo de Servicios, Tarifas y Turnos</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      WhatsApp
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Edita precios, duraciones y nombres. Se actualizan automáticamente en el agendador del BioLink, en <code className="text-amber-400">/turnos.html</code> y en <code className="text-emerald-400">/servicios.html</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <a
                    href="/servicios.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
                  >
                    <span>Ver /servicios.html</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="/turnos.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
                  >
                    <span>Ver /turnos.html</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="text-xs text-slate-400">
                  Total de servicios: <strong className="text-white">{currentServices.length}</strong> ({currentServices.filter((s) => s.active).length} activos)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetServices}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors border border-slate-750 cursor-pointer"
                    title="Restablece la lista a los 5 servicios originales"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Defectos</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingService({
                        id: `srv-${Date.now()}`,
                        name: '',
                        price: '$40 USD',
                        duration: '45 min',
                        description: '',
                        icon: '💼',
                        badge: 'NUEVO',
                        active: true,
                      });
                      setIsAddingService(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Servicio</span>
                  </button>
                </div>
              </div>

              {/* Delete Service Confirmation Modal */}
              {deletingServiceId && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 animate-fade-in">
                  <div className="flex items-center gap-3 text-rose-300 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>¿Confirmas que deseas eliminar este servicio permanentemente?</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setDeletingServiceId(null)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleConfirmDeleteService(deletingServiceId)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                    >
                      Sí, Eliminar
                    </button>
                  </div>
                </div>
              )}

              {/* Services List Cards */}
              <div className="space-y-2.5">
                {currentServices.map((srv, idx) => (
                  <div
                    key={srv.id}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      srv.active
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-850 opacity-60'
                    }`}
                  >
                    {/* Left: Icon, Name, Price, Duration */}
                    <div className="flex items-center gap-3.5 min-w-0 pr-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {srv.icon || '💼'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{srv.name}</h4>
                          {srv.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              {srv.badge}
                            </span>
                          )}
                          {!srv.active && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                              Inactivo
                            </span>
                          )}
                        </div>
                        {srv.description && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{srv.description}</p>
                        )}
                        <div className="flex items-center gap-2.5 text-xs mt-1">
                          <span className="font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {srv.price || 'A convenir'}
                          </span>
                          {srv.duration && (
                            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{srv.duration}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleServiceActive(srv.id)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          srv.active
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
                        }`}
                        title={srv.active ? 'Desactivar servicio' : 'Activar servicio'}
                      >
                        {srv.active ? <Check className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveService(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors border border-slate-800 cursor-pointer"
                        title="Subir posición"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveService(idx, 'down')}
                        disabled={idx === currentServices.length - 1}
                        className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors border border-slate-800 cursor-pointer"
                        title="Bajar posición"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingService({ ...srv });
                          setIsAddingService(false);
                        }}
                        className="p-2 text-slate-300 hover:text-amber-400 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 cursor-pointer"
                        title="Editar servicio"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeletingServiceId(srv.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 cursor-pointer"
                        title="Eliminar servicio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Editor Modal/Card */}
              {editingService && (
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-4 shadow-2xl mt-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-xl">{editingService.icon || '💼'}</span>
                      <span>{isAddingService ? 'Agregar Nuevo Servicio' : `Editar: ${editingService.name || 'Servicio'}`}</span>
                    </h4>
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nombre del Servicio *
                      </label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        placeholder="Ej: Asesoría Personalizada 1 a 1"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Precio / Tarifa *</span>
                      </label>
                      <input
                        type="text"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                        placeholder="Ej: $50 USD, €40, Gratis, A consultar"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Duración Estimada</span>
                      </label>
                      <input
                        type="text"
                        value={editingService.duration || ''}
                        onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                        placeholder="Ej: 45 min, 1 hora, 30 min"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        <span>Etiqueta / Badge (Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={editingService.badge || ''}
                        onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                        placeholder="Ej: MÁS SOLICITADO, OFERTA, NUEVO"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 uppercase"
                      />
                    </div>

                    {/* Emoji Icon */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Emoji / Icono
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingService.icon || '💼'}
                          onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                          className="w-16 px-3 py-2 text-center text-lg rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex items-center gap-1 flex-wrap">
                          {['💼', '🗓️', '📊', '💻', '📍', '⭐', '🚀', '💡', '🎯', '🛠️'].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setEditingService({ ...editingService, icon: em })}
                              className="p-1.5 text-sm rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Descripción o Detalles del Servicio
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        placeholder="Describe qué incluye el servicio, beneficios o metodología..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-750 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    {/* Active toggle */}
                    <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-white">Servicio Activo</div>
                        <div className="text-[11px] text-slate-400">Si está inactivo, no se mostrará para reservar turnos.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingService.active}
                        onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(false);
                      }}
                      className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-750 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingService.name.trim()) {
                          showNotification('Por favor ingresa un nombre para el servicio');
                          return;
                        }
                        handleSaveService(editingService);
                      }}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                    >
                      Guardar Servicio
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: PERSONALIZAR TODOS LOS TEXTOS ================= */}
          {activeTab === 'texts' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                ✏️ <strong>Personalización total de textos:</strong> Aquí puedes modificar cualquier texto de la web en tiempo real: títulos, eslogan, nombres de botones, pestañas de categorías y pie de página.
              </div>

              {/* 1. Identity & App Names */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>Identidad del BioLink, App y Pestaña del Navegador</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Cambio en Vivo
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Personaliza cómo se llama tu BioLink en la pantalla, el nombre para instalarlo como App en teléfonos y el título de la pestaña del explorador web.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre Principal del BioLink */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                      <span>🏷️ Nombre Principal del BioLink</span>
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      placeholder="Ej: El Amor Traspasa, Mi Negocio..."
                      onChange={(e) => {
                        const updated = { ...profile, name: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Aparece en grande en la cabecera sobre tu avatar.
                    </span>
                  </div>

                  {/* Título en la Barra del Explorador */}
                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                      <span>🌐 Título en la Barra del Explorador (Pestaña)</span>
                    </label>
                    <input
                      type="text"
                      value={profile.browserTabTitle || ''}
                      placeholder="Ej: Mi Proyecto - BioLink Oficial"
                      onChange={(e) => {
                        const updated = { ...profile, browserTabTitle: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Texto que figura arriba en la pestaña de Chrome/Safari (&lt;title&gt;).
                    </span>
                  </div>

                  {/* Nombre de la App / PWA */}
                  <div>
                    <label className="block text-xs font-semibold text-sky-300 mb-1 flex items-center gap-1.5">
                      <span>📱 Nombre de la Aplicación (PWA / Acceso Móvil)</span>
                    </label>
                    <input
                      type="text"
                      value={profile.appName || ''}
                      placeholder="Ej: MiMarca App"
                      onChange={(e) => {
                        const updated = { ...profile, appName: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Nombre al instalar como App en la pantalla de inicio del celular.
                    </span>
                  </div>

                  {/* Descripción SEO / Compartir */}
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1 flex items-center gap-1.5">
                      <span>📝 Descripción de Vista Previa (Meta / Redes)</span>
                    </label>
                    <input
                      type="text"
                      value={profile.metaDescription || ''}
                      placeholder="Ej: Conoce todos nuestros enlaces oficiales y redes..."
                      onChange={(e) => {
                        const updated = { ...profile, metaDescription: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Texto de vista previa al enviar el link por WhatsApp o Telegram.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subtítulo o Usuario (@handle)
                    </label>
                    <input
                      type="text"
                      value={profile.handle}
                      onChange={(e) => {
                        const updated = { ...profile, handle: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Biografía / Eslogan Principal
                    </label>
                    <textarea
                      rows={2}
                      value={profile.bio}
                      onChange={(e) => {
                        const updated = { ...profile, bio: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Texto de Ubicación / Etiqueta
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => {
                        const updated = { ...profile, location: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tooltip de Verificación
                    </label>
                    <input
                      type="text"
                      value={profile.customTexts?.verifiedBadgeText || 'Cuenta Oficial Verificada'}
                      onChange={(e) => handleUpdateCustomText('verifiedBadgeText', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Category Filter Tabs Management & Customization */}
              {(() => {
                const isFiltersEnabled = profile.categoryFilters?.enabled ?? true;
                const activeList = profile.categoryFilters?.activeCategories ?? [
                  'all',
                  'community',
                  'multimedia',
                  'donations',
                ];
                const categoriesConfig = [
                  { id: 'all', defaultLabel: 'Todos (Ver Todo)', textKey: 'categoryAll' },
                  { id: 'community', defaultLabel: 'Comunidad', textKey: 'categoryCommunity' },
                  { id: 'multimedia', defaultLabel: 'Transmisiones', textKey: 'categoryMultimedia' },
                  { id: 'donations', defaultLabel: 'Donaciones', textKey: 'categoryDonations' },
                  { id: 'courses', defaultLabel: 'Cursos / Talleres', textKey: 'categoryCourses' },
                ];

                return (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Pestañas y Filtros de Categorías</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              isFiltersEnabled && activeList.length > 1
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {isFiltersEnabled && activeList.length > 1 ? `${activeList.length} activas` : 'Barra Oculta'}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">
                            Activa o desactiva qué filtros aparecen en la pantalla principal. Si no deseas filtros, la barra quedará completamente oculta.
                          </p>
                        </div>
                      </div>

                      {/* Master Toggle */}
                      <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-300 pl-2">Mostrar barra:</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCategoryFilters(!isFiltersEnabled)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isFiltersEnabled
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isFiltersEnabled ? '✓ Activada' : '✕ Desactivada'}
                        </button>
                      </div>
                    </div>

                    {/* Explanatory banner */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>¿Cómo funciona?</strong> Si desactivas la barra o desmarcas las pestañas, <strong>no aparecerá nada</strong> en el BioLink y todos los enlaces se mostrarán directamente en una lista continua y limpia. Si activas 1 o más filtros, la barra se mostrará automáticamente arriba de los botones.
                      </div>
                    </div>

                    {/* Category Selection Checklist */}
                    {isFiltersEnabled && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Selecciona qué pestañas deben aparecer:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...profile,
                                  categoryFilters: {
                                    enabled: true,
                                    activeCategories: ['all', 'community', 'multimedia', 'donations', 'courses'],
                                  },
                                };
                                onUpdateProfile(updated);
                                storageService.saveProfile(updated);
                                showNotification('Todos los filtros activados');
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer font-semibold underline"
                            >
                              Activar todas
                            </button>
                            <span className="text-slate-600">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...profile,
                                  categoryFilters: {
                                    enabled: true,
                                    activeCategories: [],
                                  },
                                };
                                onUpdateProfile(updated);
                                storageService.saveProfile(updated);
                                showNotification('Filtros desactivados (barra oculta)');
                              }}
                              className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer font-semibold underline"
                            >
                              Ocultar todas
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {categoriesConfig.map((cat) => {
                            const isCatActive = activeList.includes(cat.id);
                            const count = links.filter((l) => (l.category || 'general') === cat.id).length;
                            return (
                              <div
                                key={cat.id}
                                className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                                  isCatActive
                                    ? 'bg-slate-900 border-amber-500/40 shadow-sm'
                                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <label
                                    className="flex items-center gap-2 cursor-pointer select-none"
                                    onClick={() => handleToggleCategoryItem(cat.id)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isCatActive}
                                      onChange={() => handleToggleCategoryItem(cat.id)}
                                      className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-white">{cat.defaultLabel}</span>
                                  </label>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                    {count} {count === 1 ? 'botón' : 'botones'}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-400 block">Texto de la pestaña:</span>
                                  <input
                                    type="text"
                                    value={profile.customTexts?.[cat.textKey as keyof CustomTextsConfig] ?? ''}
                                    onChange={(e) => handleUpdateCustomText(cat.textKey as any, e.target.value)}
                                    disabled={!isCatActive}
                                    placeholder={cat.defaultLabel}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 disabled:opacity-40"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Live Preview of the Category Pills */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                        Vista previa en vivo en el BioLink:
                      </span>
                      {isFiltersEnabled && activeList.length > 1 ? (
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {categoriesConfig
                            .filter((c) => activeList.includes(c.id))
                            .map((c) => (
                              <span
                                key={c.id}
                                className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 text-white border border-white/20 whitespace-nowrap shadow-sm"
                              >
                                {profile.customTexts?.[c.textKey as keyof CustomTextsConfig] || c.defaultLabel}
                              </span>
                            ))}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-black/40 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                          ⚡ <strong>Barra oculta:</strong> Los botones se mostrarán de forma continua sin pestañas de filtrado.
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mensaje cuando una categoría seleccionada esté vacía
                      </label>
                      <input
                        type="text"
                        value={profile.customTexts?.emptyStateText ?? 'No hay enlaces en esta categoría.'}
                        onChange={(e) => handleUpdateCustomText('emptyStateText', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* 3. Action Buttons & Footer Texts */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Botones de Acción y Pie de Página</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Botón de Configurar (Barra Superior)
                    </label>
                    <input
                      type="text"
                      value={profile.customTexts?.topBarButtonText ?? 'Configurar'}
                      onChange={(e) => handleUpdateCustomText('topBarButtonText', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Etiqueta Clics en Vivo
                    </label>
                    <input
                      type="text"
                      value={profile.customTexts?.topBarLiveBadge ?? 'clics en vivo'}
                      onChange={(e) => handleUpdateCustomText('topBarLiveBadge', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Botón de Código QR & Compartir
                    </label>
                    <input
                      type="text"
                      value={profile.customTexts?.shareModalButtonText ?? 'Ver Código QR & Compartir'}
                      onChange={(e) => handleUpdateCustomText('shareModalButtonText', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Texto del Pie de Página (Copyright / Créditos)
                  </label>
                  <input
                    type="text"
                    value={profile.footerText}
                    onChange={(e) => {
                      const updated = { ...profile, footerText: e.target.value };
                      onUpdateProfile(updated);
                      storageService.saveProfile(updated);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Company Branding Settings */}
                <div className="pt-4 border-t border-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Logotipo y Enlace de Empresa en el Pie (Branding)</span>
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Muestra el logo clickeable de tu agencia o empresa desarrolladora.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = profile.companyBranding || {
                          enabled: true,
                          name: 'LA VISUAL MARKETING',
                          logoUrl: 'la-visual-marketing.png',
                          websiteUrl: 'https://lavisualmk.alastecno.com',
                          label: 'Desarrollado & Diseñado por',
                        };
                        const updated = {
                          ...profile,
                          companyBranding: {
                            ...current,
                            enabled: !current.enabled,
                          },
                        };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                        profile.companyBranding?.enabled !== false
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {profile.companyBranding?.enabled !== false ? 'Visible' : 'Oculto'}
                    </button>
                  </div>

                  {profile.companyBranding?.enabled !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Nombre de la Empresa
                        </label>
                        <input
                          type="text"
                          value={profile.companyBranding?.name ?? 'LA VISUAL MARKETING'}
                          onChange={(e) => {
                            const updated = {
                              ...profile,
                              companyBranding: {
                                ...(profile.companyBranding || {
                                  enabled: true,
                                  logoUrl: 'la-visual-marketing.png',
                                  websiteUrl: 'https://lavisualmk.alastecno.com',
                                  label: 'Desarrollado & Diseñado por',
                                }),
                                name: e.target.value,
                              },
                            };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Enlace Web de la Empresa
                        </label>
                        <input
                          type="url"
                          value={profile.companyBranding?.websiteUrl ?? 'https://lavisualmk.alastecno.com'}
                          onChange={(e) => {
                            const updated = {
                              ...profile,
                              companyBranding: {
                                ...(profile.companyBranding || {
                                  enabled: true,
                                  name: 'LA VISUAL MARKETING',
                                  logoUrl: 'la-visual-marketing.png',
                                  label: 'Desarrollado & Diseñado por',
                                }),
                                websiteUrl: e.target.value,
                              },
                            };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Etiqueta Superior
                        </label>
                        <input
                          type="text"
                          value={profile.companyBranding?.label ?? 'Desarrollado & Diseñado por'}
                          onChange={(e) => {
                            const updated = {
                              ...profile,
                              companyBranding: {
                                ...(profile.companyBranding || {
                                  enabled: true,
                                  name: 'LA VISUAL MARKETING',
                                  logoUrl: 'la-visual-marketing.png',
                                  websiteUrl: 'https://lavisualmk.alastecno.com',
                                }),
                                label: e.target.value,
                              },
                            };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Ruta o URL del Logo
                        </label>
                        <input
                          type="text"
                          value={profile.companyBranding?.logoUrl ?? 'la-visual-marketing.png'}
                          onChange={(e) => {
                            const updated = {
                              ...profile,
                              companyBranding: {
                                ...(profile.companyBranding || {
                                  enabled: true,
                                  name: 'LA VISUAL MARKETING',
                                  websiteUrl: 'https://lavisualmk.alastecno.com',
                                  label: 'Desarrollado & Diseñado por',
                                }),
                                logoUrl: e.target.value,
                              },
                            };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: APARIENCIA ================= */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-fade-in">
              {/* Theme Presets */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2">Temas Visuales Predefinidos</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Elige un estilo para transformar instantáneamente colores, degradados y tarjetas.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'elamor',
                      name: 'El Amor Traspasa',
                      desc: 'Ámbar, Rosa y Atardecer',
                      gradient: 'from-amber-600 via-rose-700 to-slate-900',
                    },
                    {
                      id: 'celestial',
                      name: 'Aurora Celestial',
                      desc: 'Índigo y Violeta Neón',
                      gradient: 'from-indigo-600 via-purple-700 to-slate-950',
                    },
                    {
                      id: 'oasis',
                      name: 'Oasis Esmeralda',
                      desc: 'Verde Esmeralda y Menta',
                      gradient: 'from-emerald-600 via-teal-800 to-slate-950',
                    },
                    {
                      id: 'midnight',
                      name: 'Midnight Lujo',
                      desc: 'Obsidiana y Oro Champán',
                      gradient: 'from-neutral-800 via-neutral-900 to-black',
                    },
                    {
                      id: 'sunset',
                      name: 'Atardecer Radiante',
                      desc: 'Naranja Cálido y Fuego',
                      gradient: 'from-orange-600 via-rose-600 to-purple-900',
                    },
                    {
                      id: 'minimal',
                      name: 'Minimalista Claro',
                      desc: 'Fondo Claro y Sombra Suave',
                      gradient: 'from-slate-100 to-slate-300',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectThemePreset(preset.id as ThemePresetId)}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        theme.presetId === preset.id
                          ? 'border-amber-400 ring-2 ring-amber-400/30 bg-slate-900'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-full h-12 rounded-xl mb-2.5 bg-gradient-to-r ${preset.gradient} border border-white/10`}
                      />
                      <div className="font-bold text-xs text-white">{preset.name}</div>
                      <div className="text-[10px] text-slate-400">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Spacing & Separation Control */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <MoveVertical className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Separación y Espaciado entre Botones</h4>
                      <p className="text-xs text-slate-400">
                        Ajusta la separación vertical entre cada botón para darles más aire visual o que queden más compactos.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25">
                    {theme.buttonGapPx ?? 18} px de separación
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="flex-1 w-full flex items-center gap-2.5">
                    <span className="text-xs text-slate-500 font-mono">8px</span>
                    <input
                      type="range"
                      min={8}
                      max={48}
                      step={2}
                      value={theme.buttonGapPx ?? 18}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...theme, buttonGapPx: val };
                        onUpdateTheme(updated);
                        storageService.saveTheme(updated);
                      }}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                    />
                    <span className="text-xs text-slate-500 font-mono">48px</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {[
                      { label: 'Compacto', px: 12 },
                      { label: 'Normal', px: 18 },
                      { label: 'Amplio 3D', px: 26 },
                      { label: 'Extra', px: 36 },
                    ].map((p) => (
                      <button
                        key={p.px}
                        type="button"
                        onClick={() => {
                          const updated = { ...theme, buttonGapPx: p.px };
                          onUpdateTheme(updated);
                          storageService.saveTheme(updated);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          (theme.buttonGapPx ?? 18) === p.px
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar & Photo Settings */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white mb-2">Foto de Perfil & Avatar</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL del Avatar / Foto de Perfil
                    </label>
                    <input
                      type="url"
                      value={profile.avatarUrl}
                      onChange={(e) => {
                        const updated = { ...profile, avatarUrl: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono mb-2"
                    />

                    {/* Presets Avatars */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[11px] text-slate-400">Presets rápidos:</span>
                      {AVATAR_PRESETS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            const updated = { ...profile, avatarUrl: p.url };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                          }}
                          className="text-[10px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Insignia de Cuenta Verificada
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...profile, verified: !profile.verified };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      className={`w-full px-3 py-2 text-xs font-semibold rounded-xl border flex items-center justify-between cursor-pointer ${
                        profile.verified
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>Insignia Verificada</span>
                      <span>{profile.verified ? 'Activada' : 'Desactivada'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PWA App Icon Customization & GitHub Asset Generator */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Icono de la Aplicación Instalable (PWA)</h4>
                      <p className="text-xs text-slate-400">
                        Cómo personalizar el icono que aparece en el celular al instalar la app
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                    PWA Activa & Compatible
                  </span>
                </div>

                {/* Important Explanation Callout */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                  <div className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>¿Por qué debes reemplazar los archivos en GitHub y la web no lo hace sola?</span>
                  </div>
                  <p className="text-amber-100/90 leading-relaxed">
                    <strong>1. Seguridad de internet:</strong> Tu página web se ejecuta en el navegador de los usuarios y <em>no tiene contraseñas ni permisos para escribir archivos dentro de tu repositorio privado o público de GitHub</em>.
                  </p>
                  <p className="text-amber-100/90 leading-relaxed">
                    <strong>2. Cómo funciona el celular:</strong> Al tocar <em>"Instalar App"</em> o <em>"Agregar a pantalla de inicio"</em>, Android e iPhone descargan directamente los archivos físicos desde la carpeta <code className="bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded font-mono">public/</code> de GitHub, no de la memoria temporal del panel.
                  </p>
                  <p className="text-emerald-300 font-semibold pt-1">
                    ✨ ¡Para facilitártelo al 100%, creamos esta herramienta para que descargues los 3 iconos ya recortados y con las medidas exactas con 1 solo clic!
                  </p>
                </div>

                {/* Step 1: Choose Source Image */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-center font-bold flex items-center justify-center text-[11px]">1</span>
                    <span>Elige la imagen para el Icono de la App</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Option A: Select local file */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-slate-300 block">Subir imagen desde tu PC o Celular:</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPwaUploadFile(file);
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setPwaUploadPreview(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                      />
                      {pwaUploadFile && (
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>Archivo seleccionado: {pwaUploadFile.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Option B: Quick Presets */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                      <span className="text-xs font-semibold text-slate-300 block">O usa una imagen del proyecto:</span>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPwaUploadFile(null);
                            setPwaUploadPreview(profile.avatarUrl);
                            const updated = { ...profile, pwaIconUrl: profile.avatarUrl };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                            showNotification('Usando tu foto de perfil como icono PWA');
                          }}
                          className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Usar Foto / Avatar Actual</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPwaUploadFile(null);
                            setPwaUploadPreview('la-visual-marketing.png');
                            const updated = { ...profile, pwaIconUrl: 'la-visual-marketing.png' };
                            onUpdateProfile(updated);
                            storageService.saveProfile(updated);
                            showNotification('Usando logo LA VISUAL MARKETING como icono PWA');
                          }}
                          className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Usar Logo LA VISUAL MARKETING</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* URL override */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      O pega una URL directa de la imagen:
                    </label>
                    <input
                      type="url"
                      value={profile.pwaIconUrl || 'pwa-512x512.png'}
                      onChange={(e) => {
                        const updated = { ...profile, pwaIconUrl: e.target.value };
                        onUpdateProfile(updated);
                        storageService.saveProfile(updated);
                      }}
                      placeholder="https://... o pwa-512x512.png"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Step 2: Download Ready Icons */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-center font-bold flex items-center justify-center text-[11px]">2</span>
                      <span>Descarga los 3 archivos PNG listos para GitHub</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Genera automáticamente: 192×192, 512×512 y 180×180 (iPhone)
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    {/* Icon Preview */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                      <span className="text-[10px] text-slate-400 mb-1.5 font-medium">Previsualización</span>
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400/50 p-0.5 bg-slate-950">
                        <img
                          src={pwaUploadPreview || profile.pwaIconUrl || profile.avatarUrl || 'pwa-512x512.png'}
                          alt="PWA Icon Preview"
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'pwa-512x512.png';
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300 mt-1 truncate max-w-[80px]">
                        {profile.appName || profile.name || 'BioLink'}
                      </span>
                    </div>

                    {/* Download CTA Button */}
                    <div className="flex-1 w-full space-y-2">
                      <button
                        type="button"
                        onClick={handleDownloadPwaIcons}
                        disabled={isGeneratingIcons}
                        className="w-full py-3 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingIcons ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                            <span>{pwaProgressStep || 'Generando iconos PNG...'}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-slate-950" />
                            <span>📥 Descargar los 3 Iconos PNG para GitHub (1 Clic)</span>
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-slate-400 text-center sm:text-left">
                        Se descargarán automáticamente: <code className="text-amber-300">pwa-192x192.png</code>, <code className="text-amber-300">pwa-512x512.png</code> y <code className="text-amber-300">apple-touch-icon.png</code>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Upload to GitHub Instructions */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-center font-bold flex items-center justify-center text-[11px]">3</span>
                    <span>Reemplaza los 3 archivos en tu repositorio de GitHub</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-amber-400 font-bold">1.</span>
                      <span>
                        Abre tu repositorio en GitHub: <strong className="text-white">alasexpress25-netizen/LinkTree</strong> y haz clic en la carpeta <strong className="text-amber-300">public/</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-mono text-amber-400 font-bold">2.</span>
                      <span>
                        Arriba a la derecha presiona el botón <strong className="text-white">Add file</strong> ➔ <strong className="text-white">Upload files</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-mono text-amber-400 font-bold">3.</span>
                      <span>
                        Arrastra los 3 archivos que acabas de descargar (<code className="text-amber-300">pwa-192x192.png</code>, <code className="text-amber-300">pwa-512x512.png</code>, <code className="text-amber-300">apple-touch-icon.png</code>) para que reemplacen a los anteriores.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-mono text-amber-400 font-bold">4.</span>
                      <span>
                        Haz clic en el botón verde <strong className="text-emerald-400">Commit changes</strong>.
                      </span>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>¡Listo!</strong> Tu GitHub Action compilará automáticamente en ~30 segundos y a partir de ese momento todos los teléfonos mostrarán tu logo personalizado al instalar.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Styling tweaks */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white mb-2">Personalización de Botones & Tarjetas</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estilo de Tarjeta
                    </label>
                    <select
                      value={theme.cardStyle}
                      onChange={(e) => {
                        const updated = { ...theme, cardStyle: e.target.value as any };
                        onUpdateTheme(updated);
                        storageService.saveTheme(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="glass">Vidrio Esmerilado (Glassmorphism)</option>
                      <option value="solid">Sólido Elegante</option>
                      <option value="neon">Neón Brillante</option>
                      <option value="soft-shadow">Sombra Suave</option>
                      <option value="border-only">Solo Borde</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Redondez de Botones
                    </label>
                    <select
                      value={theme.borderRadius}
                      onChange={(e) => {
                        const updated = { ...theme, borderRadius: e.target.value as any };
                        onUpdateTheme(updated);
                        storageService.saveTheme(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="rounded-2xl">Redondeado Grande (2xl)</option>
                      <option value="rounded-full">Píldora Total (Full)</option>
                      <option value="rounded-xl">Medio (xl)</option>
                      <option value="rounded-lg">Sutil (lg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Color de Acento
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => {
                          const updated = { ...theme, accentColor: e.target.value };
                          onUpdateTheme(updated);
                          storageService.saveTheme(updated);
                        }}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-slate-900 border border-slate-800 p-0.5"
                      />
                      <span className="text-xs font-mono text-slate-300">{theme.accentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-900">
                  <span className="text-xs text-slate-300">
                    Burbujas luminosas animadas en el fondo
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...theme,
                        showBackgroundBubbles: !theme.showBackgroundBubbles,
                      };
                      onUpdateTheme(updated);
                      storageService.saveTheme(updated);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                      theme.showBackgroundBubbles
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {theme.showBackgroundBubbles ? 'Activado' : 'Desactivado'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SEGURIDAD Y CAMBIO DE CONTRASEÑA ================= */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Cambiar Contraseña de Administrador</h3>
                    <p className="text-xs text-slate-400">
                      Protege este panel actualizando tu clave de seguridad en cualquier momento.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirmar Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la nueva contraseña..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/15 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Actualizar Contraseña Ahora</span>
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Seguridad Activa
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Tu contraseña la gestiona Supabase Auth (cifrada en el servidor, no en el navegador ni en el repositorio).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: RESPALDO (simple) ================= */}
          {activeTab === 'backup' && (
            <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Guardado automático en la nube</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Todo lo que cambies (enlaces, colores, textos, servicios, redes) se guarda solo y lo ven al instante
                  todos los visitantes. No necesitas descargar ni subir ningún archivo.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span>{isSupabaseConfigured ? `Conectado • sitio: ${SITE_ID}` : 'Supabase sin configurar'}</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const r = await storageService.saveRemoteConfig();
                    showNotification(r.ok ? '✅ Guardado en la nube' : `Error: ${r.message}`);
                  }}
                  className="w-full py-3 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar ahora</span>
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-400">Opcional: descarga una copia de tu configuración en un archivo JSON.</p>
                <button
                  onClick={handleExportBackup}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Descargar copia (JSON)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
