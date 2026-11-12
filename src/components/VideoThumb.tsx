import React, { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { fetchVimeoThumbnail, getAutoThumbnail, getVideoInfo, resolveThumbnail } from '../utils/video';

interface VideoThumbProps {
  media: { videoUrl: string; thumbnailUrl?: string; title?: string };
  className?: string;
}

/** Miniatura del video: imagen propia -> miniatura del video -> primer cuadro (.mp4) -> placeholder */
export const VideoThumb: React.FC<VideoThumbProps> = ({ media, className = '' }) => {
  const info = getVideoInfo(media.videoUrl);
  const base = resolveThumbnail(media);
  const [src, setSrc] = useState(base);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setSrc(base);
    if (!base && info.kind === 'vimeo') {
      let cancelled = false;
      fetchVimeoThumbnail(media.videoUrl).then((u) => {
        if (!cancelled && u) setSrc(u);
      });
      return () => {
        cancelled = true;
      };
    }
  }, [base, media.videoUrl]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={media.title || ''}
        className={className}
        onError={() => {
          const auto = getAutoThumbnail(media.videoUrl);
          if (auto && auto !== src) setSrc(auto);
          else setFailed(true);
        }}
      />
    );
  }

  if (info.kind === 'file' && info.fileUrl) {
    return <video src={`${info.fileUrl}#t=0.5`} muted playsInline preload="metadata" className={className} />;
  }

  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950`}>
      <Film className="w-10 h-10 text-slate-600" />
    </div>
  );
};
