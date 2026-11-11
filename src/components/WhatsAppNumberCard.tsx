import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { LinkItem, ProfileConfig } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storage';
import {
  normalizeWhatsApp,
  isValidWhatsApp,
  formatWhatsAppPreview,
  getWhatsAppNumber,
  getWhatsAppGreeting,
  applyWhatsAppNumber,
} from '../utils/whatsapp';

interface WhatsAppNumberCardProps {
  profile: ProfileConfig;
  links: LinkItem[];
  onUpdateProfile: (p: ProfileConfig) => void;
  onUpdateLinks: (l: LinkItem[]) => void;
  notify: (msg: string) => void;
}

// Campo dedicado en Configurar para corregir el WhatsApp del negocio.
// Usa la misma lógica que el asistente de primer ingreso.
export const WhatsAppNumberCard: React.FC<WhatsAppNumberCardProps> = ({
  profile,
  links,
  onUpdateProfile,
  onUpdateLinks,
  notify,
}) => {
  const { t } = useLanguage();
  const s = t.setup;
  const current = getWhatsAppNumber(profile);
  const currentGreeting = getWhatsAppGreeting(profile);
  const [raw, setRaw] = useState(current);
  const [greeting, setGreeting] = useState(currentGreeting);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => setRaw(current), [current]);
  useEffect(() => setGreeting(currentGreeting), [currentGreeting]);

  const digits = normalizeWhatsApp(raw);
  const unchanged = digits === current && greeting.trim() === currentGreeting;

  const handleSave = async () => {
    setError('');
    if (!isValidWhatsApp(digits)) {
      setError(s.invalidNumber);
      return;
    }
    setSaving(true);
    const next = applyWhatsAppNumber(profile, links, digits, greeting.trim());
    storageService.saveProfile(next.profile);
    storageService.saveLinks(next.links);
    onUpdateProfile(next.profile);
    onUpdateLinks(next.links);
    const res = await storageService.saveRemoteConfig();
    setSaving(false);
    if (!res.ok) {
      setError(`${s.saveError}: ${res.message}`);
      return;
    }
    notify(s.updated);
  };

  return (
    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2.5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{s.settingsTitle}</h3>
          <p className="text-xs text-slate-400">{s.settingsHelp}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="tel"
          inputMode="tel"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={s.whatsappPlaceholder}
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || unchanged}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? s.saving : s.updateButton}
        </button>
      </div>
      <p className="text-[11px] text-slate-500">
        {s.whatsappHint}
        {digits && <span className="text-emerald-400 font-mono"> {s.previewPrefix} {formatWhatsAppPreview(digits)}</span>}
      </p>
      <div>
        <label className="block text-[11px] font-semibold text-slate-300 mb-1">{s.greetingLabel}</label>
        <textarea
          rows={2}
          maxLength={300}
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          placeholder={s.greetingPlaceholder}
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none"
        />
        <p className="mt-1 text-[11px] text-slate-500">{s.greetingHint}</p>
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};
