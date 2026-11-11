import React, { useState } from 'react';
import { MessageCircle, Lock } from 'lucide-react';
import { LinkItem, ProfileConfig } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { storageService } from '../services/storage';
import { supabase } from '../services/supabase';
import {
  normalizeWhatsApp,
  isValidWhatsApp,
  formatWhatsAppPreview,
  applyWhatsAppNumber,
} from '../utils/whatsapp';

interface FirstLoginSetupProps {
  profile: ProfileConfig;
  links: LinkItem[];
  initialNumber?: string; // sitios anteriores: número ya cargado, solo hay que confirmarlo
  onDone: (profile: ProfileConfig, links: LinkItem[]) => void;
  onLater?: () => void; // solo si ya había un número (confirmación); en cliente nuevo es obligatorio
}

// Asistente del primer ingreso del cliente: pide el WhatsApp (obligatorio), permite cambiar la clave,
// lo guarda en la nube y lo aplica a enlaces, reservas, turnos.html y servicios.html.
export const FirstLoginSetup: React.FC<FirstLoginSetupProps> = ({
  profile,
  links,
  initialNumber = '',
  onDone,
  onLater,
}) => {
  const { t } = useLanguage();
  const s = t.setup;
  const [raw, setRaw] = useState(initialNumber);
  const [greeting, setGreeting] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const digits = normalizeWhatsApp(raw);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidWhatsApp(digits)) {
      setError(s.invalidNumber);
      return;
    }
    if (password && password.length < 8) {
      setError(s.passwordTooShort);
      return;
    }
    setSaving(true);
    try {
      if (password && supabase) {
        const { error: pwErr } = await supabase.auth.updateUser({ password });
        if (pwErr) {
          setError(`${s.saveError}: ${pwErr.message}`);
          return;
        }
      }
      const next = applyWhatsAppNumber(profile, links, digits, greeting.trim() || undefined);
      storageService.saveProfile(next.profile);
      storageService.saveLinks(next.links);
      const res = await storageService.saveRemoteConfig();
      if (!res.ok) {
        setError(`${s.saveError}: ${res.message}`);
        return;
      }
      onDone(next.profile, next.links);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <form
        onSubmit={handleSave}
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto p-6 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-200"
      >
        <div className="absolute top-4 right-4">
          <LanguageSwitch />
        </div>

        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">{s.subtitle}</p>

        <label className="block text-[11px] font-semibold text-slate-300 mb-1">{s.whatsappLabel}</label>
        <input
          type="tel"
          inputMode="tel"
          autoFocus
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={s.whatsappPlaceholder}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
        />
        <p className="mt-1 text-[11px] text-slate-500">{s.whatsappHint}</p>
        {digits && (
          <p className="mt-1 text-[11px] text-emerald-400 font-mono">
            {s.previewPrefix} {formatWhatsAppPreview(digits)}
          </p>
        )}

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">{s.greetingLabel}</label>
          <textarea
            rows={2}
            maxLength={300}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder={s.greetingPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
          />
          <p className="mt-1 text-[11px] text-slate-500">{s.greetingHint}</p>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-800">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-1">
            <Lock className="w-3 h-3 text-amber-400" />
            {s.passwordTitle}
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={s.passwordPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
          />
          <p className="mt-1 text-[11px] text-slate-500">{s.passwordHint}</p>
        </div>

        {error && <p className="mt-4 text-xs text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? s.saving : s.saveButton}
        </button>
        {onLater && (
          <button
            type="button"
            onClick={onLater}
            className="mt-2 w-full py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            {s.later}
          </button>
        )}
      </form>
    </div>
  );
};
