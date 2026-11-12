import React, { useEffect, useState } from 'react';
import { VideoThumb } from './VideoThumb';
import { checkVideoAvailable, getPreviewSource } from '../utils/video';

interface VideoPreviewProps {
  media: { videoUrl: string; thumbnailUrl?: string; title?: string; autoplayLoop?: boolean };
  className?: string;
  /** Avisa si el video se está reproduciendo (para ocultar el botón play) */
  onPlayingChange?: (playing: boolean) => void;
}

/**
 * Vista previa de la tarjeta: la miniatura siempre queda debajo; encima se reproduce el video
 * en bucle y sin sonido. Si el enlace está roto/privado/no carga, solo se ve la miniatura.
 */
export const VideoPreview: React.FC<VideoPreviewProps> = ({ media, className = '', onPlayingChange }) => {
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const wanted = media.autoplayLoop !== false && !reducedMotion;
  const source = wanted ? getPreviewSource(media.videoUrl) : null;
  const key = source ? `${source.type}:${source.src}` : '';

  const [valid, setValid] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValid(false);
    setReady(false);
    if (!source) return;
    let cancelled = false;
    checkVideoAvailable(media.videoUrl).then((ok) => {
      if (!cancelled) setValid(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    onPlayingChange?.(ready);
  }, [ready]);

  return (
    <div className="absolute inset-0">
      <VideoThumb media={media} className={`w-full h-full object-cover ${className}`} />

      {source && valid && (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          {source.type === 'video' ? (
            <video
              src={source.src}
              autoPlay
              muted
              loop
              playsInline
              onPlaying={() => setReady(true)}
              onError={() => setValid(false)}
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={source.src}
              title={media.title || 'video'}
              tabIndex={-1}
              allow="autoplay; encrypted-media; picture-in-picture"
              onLoad={() => setTimeout(() => setReady(true), 1200)}
              // 16:9 centrado: cubre la tarjeta recortando los bordes (como object-cover)
              className="absolute left-1/2 top-1/2 w-full aspect-video -translate-x-1/2 -translate-y-1/2 border-0 scale-[1.02]"
            />
          )}
        </div>
      )}
    </div>
  );
};
