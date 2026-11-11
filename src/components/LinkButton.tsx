import React, { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { LinkItem, ThemeConfig } from '../types';
import { IconRenderer } from './IconRenderer';
import { useLanguage } from '../i18n/LanguageContext';

interface LinkButtonProps {
  link: LinkItem;
  theme: ThemeConfig;
  onClick: (link: LinkItem) => void;
  showClickCount?: boolean;
}

const BADGE_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  rose: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  purple: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  red: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/40' },
};

export const LinkButton: React.FC<LinkButtonProps> = ({
  link,
  theme,
  onClick,
  showClickCount = false,
}) => {
  const { t } = useLanguage();
  const [isClicked, setIsClicked] = useState(false);
  const [tilt, setTilt] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [imgError, setImgError] = useState(false);

  const isCustomImage = (link.iconType === 'custom' || Boolean(link.customImageUrl)) && !imgError;
  const is3DEnabled = link.pop3d?.enabled ?? isCustomImage;
  const popIntensity = link.pop3d?.popIntensity || 'medium';
  const foregroundMotion = link.pop3d?.foregroundMotion || 'float';
  const backgroundStyle = link.pop3d?.backgroundStyle || 'darkened';
  const offsetDirection = link.pop3d?.offsetDirection || 'top-left'; // Instagram diagonal default
  const isAvatarPhoto = link.pop3d?.isAvatarPhoto ?? false;
  const avatarShape = link.pop3d?.avatarShape || 'circle';

  const avatarShapeClass =
    avatarShape === 'circle'
      ? 'rounded-full'
      : avatarShape === 'rounded-square'
      ? 'rounded-2xl'
      : 'rounded-xl';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick(link);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!is3DEnabled || link.pop3d?.interactiveTilt === false) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({
      x: Math.round(x * 12),
      y: Math.round(-y * 12),
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  // Determine container styling based on theme
  let cardClass = '';
  const inlineStyle: React.CSSProperties = {
    color: theme.cardTextColor || '#ffffff',
  };

  switch (theme.cardStyle) {
    case 'glass':
      cardClass = 'bg-white/10 backdrop-blur-md hover:bg-white/15 border';
      inlineStyle.borderColor = theme.cardBorderColor || 'rgba(255, 255, 255, 0.2)';
      break;
    case 'solid':
      cardClass = 'border hover:brightness-110';
      inlineStyle.backgroundColor = theme.cardBgColor || '#1e293b';
      inlineStyle.borderColor = theme.cardBorderColor || '#334155';
      break;
    case 'neon':
      cardClass = 'bg-slate-900/90 border hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]';
      inlineStyle.borderColor = theme.cardBorderColor || '#a855f7';
      break;
    case 'soft-shadow':
      cardClass = 'bg-white text-slate-900 shadow-md hover:shadow-xl border border-slate-200';
      break;
    case 'border-only':
      cardClass = 'bg-transparent border-2 hover:bg-white/5';
      inlineStyle.borderColor = theme.accentColor || '#f59e0b';
      break;
    default:
      cardClass = 'bg-white/10 backdrop-blur-md hover:bg-white/15 border';
      inlineStyle.borderColor = theme.cardBorderColor || 'rgba(255, 255, 255, 0.2)';
  }

  // Animation classes
  let animClass = '';
  if (link.animation === 'pulse') animClass = 'animate-pulse';
  if (link.animation === 'bounce') animClass = 'animate-bounce';

  const badgeStyle = link.badge
    ? BADGE_COLOR_MAP[link.badge.color] || BADGE_COLOR_MAP.amber
    : null;

  // Instagram-Style Top-Left Diagonal Pop-Out configuration
  const isTopLeft = offsetDirection === 'top-left';
  const isTopRight = offsetDirection === 'top-right';

  let popOffsetClass = isTopLeft
    ? '-translate-x-3.5 -translate-y-3.5 scale-120'
    : isTopRight
    ? 'translate-x-3.5 -translate-y-3.5 scale-120'
    : '-translate-y-3 scale-120';

  if (popIntensity === 'subtle') {
    popOffsetClass = isTopLeft
      ? '-translate-x-2.5 -translate-y-2.5 scale-112'
      : isTopRight
      ? 'translate-x-2.5 -translate-y-2.5 scale-112'
      : '-translate-y-1.5 scale-112';
  } else if (popIntensity === 'dramatic') {
    popOffsetClass = isTopLeft
      ? '-translate-x-5 -translate-y-5 scale-130'
      : isTopRight
      ? 'translate-x-5 -translate-y-5 scale-130'
      : '-translate-y-4.5 scale-130';
  }

  // Motion class for the foreground layer
  let motionClass = isTopLeft ? 'animate-pop3d-top-left-float' : 'animate-pop3d-float';
  if (foregroundMotion === 'pulse') {
    motionClass = isTopLeft ? 'animate-pop3d-top-left-pulse' : 'animate-pop3d-pulse';
  } else if (foregroundMotion === 'wobble') {
    motionClass = isTopLeft ? 'animate-pop3d-top-left-wobble' : 'animate-pop3d-wobble';
  } else if (foregroundMotion === 'bounce') {
    motionClass = 'animate-pop3d-bounce';
  } else if (foregroundMotion === 'none' || foregroundMotion === 'gif') {
    motionClass = '';
  }

  return (
    <a
      href={link.url}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer select-none overflow-visible perspective-1000 transform-3d ${
        theme.borderRadius
      } ${cardClass} ${animClass} ${
        isClicked ? 'scale-95' : 'hover:scale-[1.015]'
      } active:scale-95`}
      style={{
        ...inlineStyle,
        transform: tilt.active
          ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(10px)`
          : undefined,
        transition: tilt.active
          ? 'transform 0.1s ease-out'
          : 'transform 0.35s ease-out, box-shadow 0.3s ease',
      }}
    >
      {/* Glow highlight effect if enabled */}
      {link.animation === 'glow' && (
        <div
          className="absolute -inset-0.5 rounded-[inherit] blur-sm opacity-50 group-hover:opacity-100 transition duration-300 -z-10"
          style={{ backgroundColor: theme.accentColor }}
        />
      )}

      {/* Atmospheric Darkened Watermark on the card background */}
      {is3DEnabled && isCustomImage && link.customImageUrl && !isAvatarPhoto && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none overflow-hidden opacity-15 group-hover:opacity-25 transition-opacity duration-500 -z-10 select-none">
          <img
            src={link.customImageUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain filter grayscale contrast-200 brightness-[0.25] blur-[1px]"
          />
        </div>
      )}

      {/* Main Left Section: Double-Plane Pop-Out Icon + Texts */}
      <div className="flex items-center gap-4 min-w-0 pr-2">
        {/* ================= DOUBLE-PLANE ICON ARCHITECTURE (INSTAGRAM STYLE) ================= */}
        {is3DEnabled ? (
          <div className="relative w-12 h-12 shrink-0 overflow-visible flex items-center justify-center">
            {/* ---------------- 1. ICONO / FOTO DE ABAJO (SEGUNDO PLANO - 80% VISIBLE) ---------------- */}
            {/* Sits firmly inside the button, slightly offset to the bottom-right so it peeks out clearly */}
            <div
              className={`absolute inset-0 transition-all duration-300 flex items-center justify-center overflow-hidden ${
                isTopLeft ? 'translate-x-1.5 translate-y-1.5' : ''
              } ${isAvatarPhoto ? avatarShapeClass : 'rounded-2xl'} ${
                backgroundStyle === 'glow-dark'
                  ? 'bg-black/75 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)] border border-white/10'
                  : 'bg-black/60 border border-black/70 shadow-inner'
              }`}
              style={{
                opacity: link.pop3d?.backgroundVisibility ?? 0.8,
              }}
              title="Capa en segundo plano"
            >
              {isCustomImage && link.customImageUrl ? (
                <img
                  src={link.customImageUrl}
                  alt=""
                  aria-hidden="true"
                  className={`w-full h-full ${
                    isAvatarPhoto ? 'object-cover' : 'object-contain'
                  } filter brightness-[0.4] contrast-150 saturate-[0.7] blur-[0.4px] transition-transform group-hover:scale-105`}
                />
              ) : (
                <div className="opacity-80 filter brightness-[0.35]">
                  <IconRenderer name={link.icon} className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>

            {/* Ambient drop shadow connecting the two planes */}
            <div
              className={`absolute w-9 h-3 bg-black/75 rounded-full blur-[3px] pointer-events-none animate-pop3d-shadow ${
                isTopLeft ? 'top-6 left-0' : '-bottom-1 left-1/2 -translate-x-1/2'
              }`}
            />

            {/* ---------------- 2. ICONO / FOTO DE ADELANTE (PRIMER PLANO - 100% POP-OUT) ---------------- */}
            {/* Shifted UP and LEFT so BOTH photos/icons are visible: bottom is 80% visible, top is 100% full and pops out! */}
            <div
              className={`relative z-20 transition-all duration-300 pointer-events-none ${popOffsetClass} ${motionClass} ${
                isTopLeft ? 'group-hover:-translate-x-5 group-hover:-translate-y-5 group-hover:scale-125' : 'group-hover:-translate-y-4'
              }`}
              style={{
                transform: tilt.active
                  ? isTopLeft
                    ? `translate3d(${-16 + tilt.x * 0.8}px, ${-18 + tilt.y * -0.8}px, 35px) scale(1.24)`
                    : `translate3d(${tilt.x * 0.8}px, ${-12 + tilt.y * -0.8}px, 35px) scale(1.2)`
                  : undefined,
              }}
            >
              {isCustomImage && link.customImageUrl ? (
                isAvatarPhoto ? (
                  /* Portrait Avatar format: circular, square or squircle with clean luxury rim */
                  <div
                    className={`w-12 h-12 overflow-hidden ${avatarShapeClass} ring-2 ring-white/70 border border-white/40 shadow-xl filter drop-shadow-[6px_10px_14px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[8px_16px_20px_rgba(0,0,0,0.95)] transition-all bg-slate-900`}
                  >
                    <img
                      src={link.customImageUrl}
                      alt={link.title}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  /* Standard Sticker / 3D Icon format */
                  <img
                    src={link.customImageUrl}
                    alt={link.title}
                    onError={() => setImgError(true)}
                    className="w-12 h-12 object-contain filter drop-shadow-[6px_10px_14px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[8px_16px_20px_rgba(0,0,0,0.95)] transition-all"
                  />
                )
              ) : (
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center filter drop-shadow-[5px_10px_14px_rgba(0,0,0,0.7)]"
                  style={{
                    backgroundColor: theme.accentColor || '#f59e0b',
                    color: '#0f172a',
                  }}
                >
                  <IconRenderer name={link.icon} className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Standard icon without 3D pop */
          <div
            className={`flex items-center justify-center w-11 h-11 shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm overflow-hidden ${
              isAvatarPhoto ? avatarShapeClass : 'rounded-xl'
            }`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              border: `1px solid ${theme.cardBorderColor || 'rgba(255, 255, 255, 0.15)'}`,
              color: theme.accentColor || '#f59e0b',
            }}
          >
            {isCustomImage && link.customImageUrl ? (
              <img
                src={link.customImageUrl}
                alt={link.title}
                onError={() => setImgError(true)}
                className={`w-full h-full ${isAvatarPhoto ? 'object-cover' : 'object-contain p-1.5'}`}
              />
            ) : (
              <IconRenderer name={link.icon} className="w-5 h-5" />
            )}
          </div>
        )}

        {/* Texts */}
        <div className="flex flex-col text-left min-w-0 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-semibold text-sm sm:text-base leading-tight tracking-tight truncate ${
                theme.fontStyle === 'serif' ? 'font-serif' : 'font-sans'
              }`}
            >
              {link.title}
            </span>

            {/* Badge */}
            {link.badge && badgeStyle && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {link.badge.text}
              </span>
            )}
          </div>

          {link.subtitle && (
            <span className="text-xs opacity-75 mt-0.5 line-clamp-1 font-normal">
              {link.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right meta: external icon and/or live click counter */}
      <div className="flex items-center gap-2 shrink-0 ml-2 z-10">
        {showClickCount && (
          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono rounded-full bg-black/30 border border-white/10 opacity-70">
            {link.clicks || 0} {t.links.clicksSuffix}
          </span>
        )}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/20 group-hover:bg-white/20 transition-colors opacity-70 group-hover:opacity-100">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </a>
  );
};
