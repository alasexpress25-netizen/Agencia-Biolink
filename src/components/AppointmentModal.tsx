import React, { useEffect, useMemo, useState } from 'react';
import { X, ExternalLink, AlertTriangle } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string; // vacío = el cliente todavía no configuró su WhatsApp
  brandName: string;
  services?: ServiceItem[];
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:30', '17:30', '18:30'];

const toISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
  brandName,
  services,
}) => {
  const { t, lang } = useLanguage();
  const b = t.booking;

  // Si el cliente cargó sus servicios se usan esos (tal cual); si no, los de ejemplo en el idioma activo.
  const activeServices = useMemo(() => {
    const own = (services || []).filter((s) => s.active !== false);
    return own.length > 0 ? own : t.fallbackServices.filter((s) => s.active);
  }, [services, t]);

  const todayStr = toISODate(new Date());
  const tomorrowStr = toISODate(new Date(Date.now() + 86400000));

  const [serviceId, setServiceId] = useState<string>('');
  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState('10:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeServices.some((s) => s.id === serviceId)) {
      setServiceId(activeServices[0]?.id || '');
    }
  }, [activeServices, serviceId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const configured = whatsappNumber.trim().length > 0;
  const service = activeServices.find((s) => s.id === serviceId) || activeServices[0];

  const formattedDate = (() => {
    if (!date) return '';
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(b.dateLocale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  })();

  const buildMessage = () => {
    const m = b.message;
    const lines: string[] = [m.greeting(brandName), ''];
    if (service) {
      lines.push(`${m.service} ${service.name}`);
      if (service.price) lines.push(`${m.price} ${service.price}`);
      if (service.duration) lines.push(`${m.duration} ${service.duration}`);
    }
    lines.push(`${m.date} ${formattedDate}`);
    lines.push(`${m.time} ${time}${b.hoursSuffix}`);
    lines.push(`${m.requester} ${name.trim()}`);
    if (phone.trim()) lines.push(`${m.phone} ${phone.trim()}`);
    if (notes.trim()) lines.push(`${m.notes} ${notes.trim()}`);
    lines.push('', m.footer);
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) return;
    if (!name.trim()) {
      setError(b.nameRequiredError);
      return;
    }
    setError('');
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const optionClass = (selected: boolean) =>
    `flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-colors ${
      selected
        ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/30'
        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
    }`;

  const dateBtnClass = (selected: boolean) =>
    `flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
      selected
        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
        : 'bg-slate-950 border-slate-800 text-slate-300'
    }`;

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl text-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 px-5 pt-5 pb-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-white">{b.title}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {b.liveTag}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{b.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitch />
            <button
              type="button"
              onClick={onClose}
              aria-label={b.closeAria}
              className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!configured ? (
          <div className="p-6">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white mb-1">{b.notConfiguredTitle}</div>
                <div className="text-slate-300 leading-relaxed">{b.notConfiguredBody}</div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* 1. Servicio */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {b.step1Title}
                </label>
                <a
                  href="servicios.html"
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline"
                >
                  {b.viewCatalog}
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeServices.map((s) => (
                  <label key={s.id} className={optionClass(s.id === serviceId)}>
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-xl shrink-0">{s.icon || '💼'}</span>
                      <div className="min-w-0">
                        <div className="truncate">{s.name}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          {s.duration && <span>⏱️ {s.duration}</span>}
                          {s.price && <span className="font-bold text-emerald-400 font-mono">{s.price}</span>}
                        </div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={s.id === serviceId}
                      onChange={() => setServiceId(s.id)}
                      className="accent-amber-500 shrink-0"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Fecha */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {b.step2Title}
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDate(todayStr)} className={dateBtnClass(date === todayStr)}>
                  {b.today}
                </button>
                <button
                  type="button"
                  onClick={() => setDate(tomorrowStr)}
                  className={dateBtnClass(date === tomorrowStr)}
                >
                  {b.tomorrow}
                </button>
              </div>
              <input
                type="date"
                value={date}
                min={todayStr}
                lang={b.dateLocale}
                onChange={(e) => setDate(e.target.value)}
                required
                className={`${inputClass} font-medium [color-scheme:dark]`}
              />
            </div>

            {/* 3. Horario */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span>{b.step3Title}</span>
                <span className="text-[11px] text-emerald-400 font-mono normal-case">
                  {time} {b.hoursSuffix}
                </span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 text-center rounded-xl text-xs font-mono font-bold border cursor-pointer transition-all ${
                      slot === time
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950 scale-105 shadow-md shadow-emerald-500/20'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Datos */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {b.step4Title}
              </label>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">{b.nameLabel}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={b.namePlaceholder}
                  className={inputClass}
                />
                {error && <p className="mt-1 text-[11px] text-rose-400">{error}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">{b.phoneLabel}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={b.phonePlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">{b.notesLabel}</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={b.notesPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
              <div className="font-bold text-slate-400 mb-1">{b.previewLabel}</div>
              <div>
                <span className="text-slate-500">{b.previewService}:</span> {service?.name}
              </div>
              <div>
                <span className="text-slate-500">{b.previewDate}:</span> <span className="capitalize">{formattedDate}</span>
              </div>
              <div>
                <span className="text-slate-500">{b.previewTime}:</span> {time}
                {b.hoursSuffix}
              </div>
              <div>
                <span className="text-slate-500">{b.previewRequester}:</span> {name.trim() || b.previewNoName}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 active:scale-[0.99] transition-all cursor-pointer"
              >
                {b.submitButton}
              </button>
              <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500">
                <span>
                  {b.numberLabel}: +{whatsappNumber}
                </span>
                <a
                  href={`turnos.html?lang=${lang}`}
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  <span>{b.viewFullPage}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
