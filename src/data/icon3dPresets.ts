export interface Icon3DPreset {
  id: string;
  name: string;
  category: 'social' | 'community' | 'multimedia' | 'spiritual' | 'elements';
  badge: string;
  svgDataUri: string;
}

// Ultra-crisp, self-contained SVG 3D glossy illustrations with layered depth, highlights and specular reflections
export const ICON_3D_PRESETS: Icon3DPreset[] = [
  {
    id: 'whatsapp-3d',
    name: 'WhatsApp 3D Glossy',
    category: 'social',
    badge: 'Popular',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="waGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="%234ade80"/>
          <stop offset="50%" stop-color="%2322c55e"/>
          <stop offset="90%" stop-color="%2315803d"/>
          <stop offset="100%" stop-color="%2314532d"/>
        </radialGradient>
        <radialGradient id="waHighlight" cx="30%" cy="20%" r="50%">
          <stop offset="0%" stop-color="%23ffffff" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="%23ffffff" stop-opacity="0"/>
        </radialGradient>
        <filter id="waShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%2314532d" flood-opacity="0.5"/>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="46" fill="url(%23waGrad)" filter="url(%23waShadow)"/>
      <ellipse cx="48" cy="36" rx="28" ry="16" fill="url(%23waHighlight)"/>
      <path d="M42 40 C42 40 46 48 50 52 C54 56 62 60 62 60 L68 54 C69 53 71 53 73 54 L81 58 C83 59 84 62 83 64 C81 72 72 78 64 78 C52 78 38 64 38 52 C38 44 44 35 52 33 C54 32 57 33 58 35 L62 43 C63 45 63 47 62 48 Z" fill="%23ffffff" filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.3))"/>
    </svg>`,
  },
  {
    id: 'youtube-3d',
    name: 'YouTube 3D Button',
    category: 'multimedia',
    badge: 'En Vivo',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="ytGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="%23ff4d4d"/>
          <stop offset="55%" stop-color="%23dc2626"/>
          <stop offset="95%" stop-color="%23991b1b"/>
          <stop offset="100%" stop-color="%237f1d1d"/>
        </radialGradient>
        <linearGradient id="ytGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%23ffffff" stop-opacity="0.6"/>
          <stop offset="45%" stop-color="%23ffffff" stop-opacity="0.1"/>
          <stop offset="50%" stop-color="%23ffffff" stop-opacity="0"/>
        </linearGradient>
        <filter id="ytShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%237f1d1d" flood-opacity="0.6"/>
        </filter>
      </defs>
      <rect x="15" y="24" width="90" height="72" rx="24" fill="url(%23ytGrad)" filter="url(%23ytShadow)"/>
      <rect x="15" y="24" width="90" height="36" rx="24" fill="url(%23ytGlass)"/>
      <polygon points="50,42 78,60 50,78" fill="%23ffffff" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.4))"/>
    </svg>`,
  },
  {
    id: 'heart-3d',
    name: 'Corazón 3D Rubí',
    category: 'spiritual',
    badge: 'Amor',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="heartGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="%23fb7185"/>
          <stop offset="40%" stop-color="%23e11d48"/>
          <stop offset="85%" stop-color="%239f1239"/>
          <stop offset="100%" stop-color="%234c0519"/>
        </radialGradient>
        <filter id="heartShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="7" flood-color="%23881337" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M60 96 C60 96 20 72 20 44 C20 28 32 18 46 18 C54 18 60 24 60 24 C60 24 66 18 74 18 C88 18 100 28 100 44 C100 72 60 96 60 96 Z" fill="url(%23heartGrad)" filter="url(%23heartShadow)"/>
      <ellipse cx="42" cy="32" rx="12" ry="6" transform="rotate(-25 42 32)" fill="%23ffffff" opacity="0.6"/>
      <circle cx="80" cy="30" r="4" fill="%23ffffff" opacity="0.4"/>
    </svg>`,
  },
  {
    id: 'flame-3d',
    name: 'Fuego / Avivamiento 3D',
    category: 'elements',
    badge: 'Fuego',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="fireGradOuter" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="%23c2410c"/>
          <stop offset="50%" stop-color="%23ea580c"/>
          <stop offset="100%" stop-color="%23f97316"/>
        </linearGradient>
        <linearGradient id="fireGradInner" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="%23eab308"/>
          <stop offset="80%" stop-color="%23fef08a"/>
          <stop offset="100%" stop-color="%23ffffff"/>
        </linearGradient>
        <filter id="flameGlow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="%23ea580c" flood-opacity="0.7"/>
        </filter>
      </defs>
      <path d="M60 16 C60 16 76 38 76 56 C76 68 68 76 60 76 C52 76 44 68 44 56 C44 48 48 38 48 38 C48 38 32 48 32 68 C32 86 44 102 60 102 C76 102 92 86 92 68 C92 42 60 16 60 16 Z" fill="url(%23fireGradOuter)" filter="url(%23flameGlow)"/>
      <path d="M60 48 C60 48 68 62 68 74 C68 82 64 88 60 88 C56 88 52 82 52 74 C52 68 56 60 56 60 C56 60 48 66 48 78 C48 88 54 96 60 96 C66 96 74 88 74 78 C74 62 60 48 60 48 Z" fill="url(%23fireGradInner)"/>
    </svg>`,
  },
  {
    id: 'crown-3d',
    name: 'Corona Real Dorada 3D',
    category: 'spiritual',
    badge: 'VIP',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23fde047"/>
          <stop offset="40%" stop-color="%23eab308"/>
          <stop offset="80%" stop-color="%23ca8a04"/>
          <stop offset="100%" stop-color="%23854d0e"/>
        </linearGradient>
        <filter id="crownShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23854d0e" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M22 84 L98 84 L92 46 L74 64 L60 30 L46 64 L28 46 Z" fill="url(%23goldGrad)" filter="url(%23crownShadow)"/>
      <rect x="22" y="82" width="76" height="12" rx="4" fill="%23ca8a04"/>
      <circle cx="28" cy="46" r="5" fill="%23ffffff"/>
      <circle cx="60" cy="30" r="6" fill="%23ffffff"/>
      <circle cx="92" cy="46" r="5" fill="%23ffffff"/>
      <circle cx="60" cy="88" r="4" fill="%23ef4444"/>
      <circle cx="42" cy="88" r="3" fill="%233b82f6"/>
      <circle cx="78" cy="88" r="3" fill="%2310b981"/>
    </svg>`,
  },
  {
    id: 'star-3d',
    name: 'Estrella Dorada 3D',
    category: 'elements',
    badge: 'Destacado',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="starGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23fef08a"/>
          <stop offset="50%" stop-color="%23eab308"/>
          <stop offset="100%" stop-color="%23ca8a04"/>
        </linearGradient>
        <filter id="starShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23ca8a04" flood-opacity="0.5"/>
        </filter>
      </defs>
      <polygon points="60,16 73,46 104,49 80,70 87,101 60,85 33,101 40,70 16,49 47,46" fill="url(%23starGrad1)" filter="url(%23starShadow)"/>
      <polygon points="60,16 73,46 60,85 47,46" fill="%23ffffff" opacity="0.3"/>
    </svg>`,
  },
  {
    id: 'sparkles-3d',
    name: 'Destello Celestial 3D',
    category: 'spiritual',
    badge: 'Nuevo',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="sparkGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="%23ffffff"/>
          <stop offset="35%" stop-color="%23fde68a"/>
          <stop offset="70%" stop-color="%23f59e0b"/>
          <stop offset="100%" stop-color="%23b45309"/>
        </radialGradient>
        <filter id="sparkGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="%23f59e0b" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M60 12 C60 40 76 56 104 60 C76 64 60 80 60 108 C60 80 44 64 16 60 C44 56 60 40 60 12 Z" fill="url(%23sparkGrad)" filter="url(%23sparkGlow)"/>
      <circle cx="88" cy="28" r="8" fill="%23ffffff" opacity="0.8"/>
      <circle cx="32" cy="88" r="6" fill="%23ffffff" opacity="0.7"/>
    </svg>`,
  },
  {
    id: 'rocket-3d',
    name: 'Cohete 3D Éxito',
    category: 'community',
    badge: 'Lanzamiento',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23f8fafc"/>
          <stop offset="60%" stop-color="%23cbd5e1"/>
          <stop offset="100%" stop-color="%2364748b"/>
        </linearGradient>
        <linearGradient id="rocketFin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23f43f5e"/>
          <stop offset="100%" stop-color="%23be123c"/>
        </linearGradient>
        <filter id="rocketShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.5"/>
        </filter>
      </defs>
      <path d="M72 16 C54 22 42 40 38 62 L58 82 C80 78 98 66 104 48 C98 34 86 22 72 16 Z" fill="url(%23rocketBody)" filter="url(%23rocketShadow)"/>
      <path d="M38 62 L22 68 L32 82 L46 76 Z" fill="url(%23rocketFin)"/>
      <path d="M58 82 L52 98 L66 108 L72 92 Z" fill="url(%23rocketFin)"/>
      <circle cx="70" cy="50" r="10" fill="%2338bdf8" stroke="%230f172a" stroke-width="2"/>
      <circle cx="68" cy="48" r="4" fill="%23ffffff" opacity="0.8"/>
      <polygon points="40,84 26,108 48,96" fill="%23ea580c"/>
      <polygon points="40,84 32,102 44,92" fill="%23fde047"/>
    </svg>`,
  },
  {
    id: 'gift-3d',
    name: 'Caja de Regalo 3D',
    category: 'community',
    badge: 'Siembra',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23a855f7"/>
          <stop offset="60%" stop-color="%237e22ce"/>
          <stop offset="100%" stop-color="%23581c87"/>
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23fde047"/>
          <stop offset="100%" stop-color="%23ca8a04"/>
        </linearGradient>
        <filter id="boxShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23581c87" flood-opacity="0.5"/>
        </filter>
      </defs>
      <rect x="25" y="48" width="70" height="52" rx="10" fill="url(%23boxGrad)" filter="url(%23boxShadow)"/>
      <rect x="20" y="38" width="80" height="16" rx="6" fill="%239333ea"/>
      <rect x="54" y="38" width="12" height="62" fill="url(%23ribbonGrad)"/>
      <ellipse cx="48" cy="30" rx="12" ry="7" transform="rotate(-30 48 30)" fill="none" stroke="url(%23ribbonGrad)" stroke-width="5"/>
      <ellipse cx="72" cy="30" rx="12" ry="7" transform="rotate(30 72 30)" fill="none" stroke="url(%23ribbonGrad)" stroke-width="5"/>
    </svg>`,
  },
  {
    id: 'music-3d',
    name: 'Disco / Música 3D',
    category: 'multimedia',
    badge: 'Audio',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="discGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%233b82f6"/>
          <stop offset="40%" stop-color="%231d4ed8"/>
          <stop offset="85%" stop-color="%230f172a"/>
          <stop offset="100%" stop-color="%23020617"/>
        </radialGradient>
        <filter id="discShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%231d4ed8" flood-opacity="0.5"/>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="46" fill="url(%23discGrad)" filter="url(%23discShadow)"/>
      <circle cx="60" cy="60" r="32" fill="none" stroke="%2338bdf8" stroke-width="2" opacity="0.4"/>
      <circle cx="60" cy="60" r="22" fill="none" stroke="%2338bdf8" stroke-width="1.5" opacity="0.5"/>
      <circle cx="60" cy="60" r="14" fill="%23f59e0b"/>
      <circle cx="60" cy="60" r="5" fill="%23020617"/>
      <path d="M35 35 A40 40 0 0 1 85 35" fill="none" stroke="%23ffffff" stroke-width="5" stroke-linecap="round" opacity="0.3"/>
    </svg>`,
  },
  {
    id: 'notebook-courses-3d',
    name: 'Cuaderno de Cursos 3D',
    category: 'community',
    badge: 'Cursos',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="nbCover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%2338bdf8"/>
          <stop offset="50%" stop-color="%230284c7"/>
          <stop offset="100%" stop-color="%230369a1"/>
        </linearGradient>
        <linearGradient id="nbPages" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="%23f8fafc"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </linearGradient>
        <filter id="nbShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%230c4a6e" flood-opacity="0.55"/>
        </filter>
      </defs>
      <rect x="26" y="22" width="68" height="82" rx="8" fill="url(%23nbCover)" filter="url(%23nbShadow)"/>
      <rect x="36" y="24" width="56" height="78" rx="5" fill="url(%23nbPages)"/>
      <line x1="42" y1="38" x2="84" y2="38" stroke="%2394a3b8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="42" y1="50" x2="84" y2="50" stroke="%2394a3b8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="42" y1="62" x2="84" y2="62" stroke="%2394a3b8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="42" y1="74" x2="70" y2="74" stroke="%2394a3b8" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Bookmark ribbon -->
      <path d="M72 22 L72 46 L78 40 L84 46 L84 22 Z" fill="%23f59e0b"/>
      <!-- Ring spirals -->
      <circle cx="28" cy="34" r="3.5" fill="%23ffffff" stroke="%230369a1" stroke-width="1.5"/>
      <circle cx="28" cy="48" r="3.5" fill="%23ffffff" stroke="%230369a1" stroke-width="1.5"/>
      <circle cx="28" cy="62" r="3.5" fill="%23ffffff" stroke="%230369a1" stroke-width="1.5"/>
      <circle cx="28" cy="76" r="3.5" fill="%23ffffff" stroke="%230369a1" stroke-width="1.5"/>
      <circle cx="28" cy="90" r="3.5" fill="%23ffffff" stroke="%230369a1" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'graduation-cap-3d',
    name: 'Birrete / Academia 3D',
    category: 'community',
    badge: 'Formación',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23334155"/>
          <stop offset="60%" stop-color="%231e293b"/>
          <stop offset="100%" stop-color="%230f172a"/>
        </linearGradient>
        <filter id="capShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Cap Base -->
      <path d="M35 55 L35 76 C35 88 85 88 85 76 L85 55 Z" fill="%231e293b"/>
      <!-- Diamond Top -->
      <polygon points="60,24 104,46 60,68 16,46" fill="url(%23capGrad)" filter="url(%23capShadow)"/>
      <polygon points="60,24 104,46 60,48 16,46" fill="%23ffffff" opacity="0.2"/>
      <!-- Tassel Button & Rope -->
      <circle cx="60" cy="46" r="4" fill="%23eab308"/>
      <path d="M60 46 Q78 52 82 70" fill="none" stroke="%23eab308" stroke-width="3"/>
      <rect x="78" y="70" width="8" height="14" rx="2" fill="%23ca8a04"/>
    </svg>`,
  },
  {
    id: 'briefcase-3d',
    name: 'Maletín / Asesorías 3D',
    category: 'community',
    badge: 'Negocios',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23d97706"/>
          <stop offset="60%" stop-color="%23b45309"/>
          <stop offset="100%" stop-color="%2378350f"/>
        </linearGradient>
        <filter id="caseShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23451a03" flood-opacity="0.5"/>
        </filter>
      </defs>
      <!-- Handle -->
      <path d="M46 36 L46 26 C46 22 74 22 74 26 L74 36" fill="none" stroke="%23ca8a04" stroke-width="5" stroke-linecap="round"/>
      <!-- Body -->
      <rect x="18" y="34" width="84" height="64" rx="10" fill="url(%23caseGrad)" filter="url(%23caseShadow)"/>
      <!-- Center Strap & Gold Lock -->
      <rect x="18" y="52" width="84" height="8" fill="%2378350f"/>
      <rect x="52" y="48" width="16" height="16" rx="4" fill="%23fde047" stroke="%23ca8a04" stroke-width="2"/>
      <circle cx="60" cy="56" r="2.5" fill="%2378350f"/>
    </svg>`,
  },
  {
    id: 'store-cart-3d',
    name: 'Carrito / Tienda 3D',
    category: 'community',
    badge: 'Tienda',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="cartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%2310b981"/>
          <stop offset="70%" stop-color="%23059669"/>
          <stop offset="100%" stop-color="%23047857"/>
        </linearGradient>
        <filter id="cartShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23064e3b" flood-opacity="0.5"/>
        </filter>
      </defs>
      <!-- Cart Basket -->
      <path d="M22 26 L34 26 L48 72 L86 72 L96 40 L38 40" fill="none" stroke="url(%23cartGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(%23cartShadow)"/>
      <line x1="50" y1="56" x2="88" y2="56" stroke="%2334d399" stroke-width="3"/>
      <!-- Wheels -->
      <circle cx="50" cy="88" r="8" fill="%230f172a" stroke="%2334d399" stroke-width="3"/>
      <circle cx="82" cy="88" r="8" fill="%230f172a" stroke="%2334d399" stroke-width="3"/>
      <!-- Star item inside -->
      <circle cx="68" cy="34" r="9" fill="%23f59e0b"/>
    </svg>`,
  },
  {
    id: 'podcast-mic-3d',
    name: 'Micrófono / Podcast 3D',
    category: 'multimedia',
    badge: 'Audio',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="micGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23ec4899"/>
          <stop offset="60%" stop-color="%23db2777"/>
          <stop offset="100%" stop-color="%239d174d"/>
        </linearGradient>
        <filter id="micShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23831843" flood-opacity="0.5"/>
        </filter>
      </defs>
      <!-- Capsule -->
      <rect x="44" y="20" width="32" height="52" rx="16" fill="url(%23micGrad)" filter="url(%23micShadow)"/>
      <line x1="44" y1="46" x2="76" y2="46" stroke="%23ffffff" stroke-width="2.5" opacity="0.6"/>
      <!-- U Stand -->
      <path d="M36 46 C36 76 84 76 84 46" fill="none" stroke="%23cbd5e1" stroke-width="5" stroke-linecap="round"/>
      <line x1="60" y1="74" x2="60" y2="92" stroke="%23cbd5e1" stroke-width="6"/>
      <rect x="42" y="92" width="36" height="8" rx="4" fill="%2394a3b8"/>
    </svg>`,
  },
  {
    id: 'calendar-agenda-3d',
    name: 'Agenda / Citas 3D',
    category: 'community',
    badge: 'Turnos',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="calTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="%23ef4444"/>
          <stop offset="100%" stop-color="%23b91c1c"/>
        </linearGradient>
        <filter id="calShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%237f1d1d" flood-opacity="0.5"/>
        </filter>
      </defs>
      <rect x="22" y="28" width="76" height="74" rx="10" fill="%23f8fafc" filter="url(%23calShadow)"/>
      <rect x="22" y="28" width="76" height="24" rx="10" fill="url(%23calTop)"/>
      <circle cx="40" cy="22" r="4" fill="%23e2e8f0" stroke="%2364748b" stroke-width="2"/>
      <circle cx="80" cy="22" r="4" fill="%23e2e8f0" stroke="%2364748b" stroke-width="2"/>
      <text x="60" y="80" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="%230f172a" text-anchor="middle">24</text>
    </svg>`,
  },
  {
    id: 'laptop-classes-3d',
    name: 'Laptop / Clases Online 3D',
    category: 'community',
    badge: 'Online',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%236366f1"/>
          <stop offset="100%" stop-color="%234338ca"/>
        </linearGradient>
        <filter id="lapShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="%23312e81" flood-opacity="0.5"/>
        </filter>
      </defs>
      <!-- Screen Lid -->
      <rect x="26" y="26" width="68" height="48" rx="6" fill="%231e293b" filter="url(%23lapShadow)"/>
      <rect x="30" y="30" width="60" height="40" rx="3" fill="url(%23screenGrad)"/>
      <circle cx="60" cy="50" r="7" fill="%23ffffff" opacity="0.8"/>
      <!-- Keyboard Base -->
      <path d="M16 78 L104 78 L98 88 L22 88 Z" fill="%23cbd5e1"/>
    </svg>`,
  },
];
