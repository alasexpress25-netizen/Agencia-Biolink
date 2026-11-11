import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageSwitchProps {
  className?: string;
}

// Selector central de idioma: PT | ES. Se usa en la página del visitante,
// en el modal de reservas y en el panel de configuración.
export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-black/25 border border-white/15 backdrop-blur-md p-0.5 text-[11px] font-bold ${className}`}
      role="group"
      aria-label="Idioma / Língua"
    >
      <button
        type="button"
        onClick={() => setLang('pt')}
        className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
          lang === 'pt' ? 'bg-white/90 text-slate-900' : 'text-white/60 hover:text-white'
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
          lang === 'es' ? 'bg-white/90 text-slate-900' : 'text-white/60 hover:text-white'
        }`}
      >
        ES
      </button>
    </div>
  );
};
