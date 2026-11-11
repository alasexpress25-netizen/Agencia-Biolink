import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lang, Dictionary, DICTIONARIES } from './translations';
import { SITE_ID } from '../services/supabase';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const storageKey = () => `biolink-lang-${SITE_ID}`;

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(storageKey());
    return v === 'pt' || v === 'es' ? v : null;
  } catch {
    return null;
  }
}

interface LanguageProviderProps {
  // Idioma de arranque configurado por el cliente en su panel (Configurar → Idioma).
  // Si el visitante ya eligió un idioma antes, eso tiene prioridad.
  defaultLang?: Lang;
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ defaultLang = 'pt', children }) => {
  const [lang, setLangState] = useState<Lang>(() => readStoredLang() || defaultLang);

  // Si todavía no eligió nada guardado y cambia el idioma por defecto del cliente, lo sigue.
  useEffect(() => {
    if (!readStoredLang()) {
      setLangState(defaultLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(storageKey(), next);
    } catch {
      // ignore (modo privado / almacenamiento lleno)
    }
  };

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: DICTIONARIES[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  }
  return ctx;
}
