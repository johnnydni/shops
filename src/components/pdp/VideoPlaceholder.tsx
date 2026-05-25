import { useState } from 'react';
import type { VideoItem } from '../../lib/types';

interface Props {
  video: VideoItem;
  className?: string;
}

/**
 * Single video tile — renders depending on `video.kind`:
 *
 *   placeholder  →  animated Bauhaus tile with a Play button (no source yet)
 *   mp4          →  <video controls preload="none"> with poster
 *   youtube      →  lite embed: poster click → iframe swap
 *   vimeo        →  lite embed: poster click → iframe swap
 *
 * The placeholder mode is intentional during the build phase. When the
 * real video is ready, change `kind` to mp4/youtube/vimeo and add `src`
 * in data/products.ts — nothing else changes.
 */
export function VideoPlaceholder({ video, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);

  // ── 1. Real MP4 ───────────────────────────────────────────────
  if (video.kind === 'mp4' && video.src) {
    return (
      <div className={`video-tile ${className}`}>
        <video
          src={video.src}
          poster={video.posterSrc}
          controls
          preload="none"
          playsInline
        />
        <VideoMeta video={video} />
      </div>
    );
  }

  // ── 2. YouTube / Vimeo lite-embed ─────────────────────────────
  if ((video.kind === 'youtube' || video.kind === 'vimeo') && video.src) {
    const embedUrl = embedSrc(video.kind, video.src);
    return (
      <div className={`video-tile ${className}`}>
        {loaded ? (
          <iframe
            src={embedUrl + '?autoplay=1'}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="video-poster"
            onClick={() => setLoaded(true)}
            aria-label={`Video starten: ${video.title}`}
            style={video.posterSrc ? { backgroundImage: `url(${video.posterSrc})` } : undefined}
          >
            <BauhausPosterArt />
            <PlayIcon />
            <VideoBadge video={video} />
          </button>
        )}
        <VideoMeta video={video} />
      </div>
    );
  }

  // ── 3. Placeholder (default) ──────────────────────────────────
  return (
    <div className={`video-tile ${className}`}>
      <div className="video-poster placeholder" role="img" aria-label={`Video-Platzhalter: ${video.title}`}>
        <BauhausPosterArt />
        <PlayIcon dim />
        <VideoBadge video={video} placeholder />
      </div>
      <VideoMeta video={video} />
    </div>
  );
}

/* ───────── Bits ──────────────────────────────────────────────── */

function VideoMeta({ video }: { video: VideoItem }) {
  return (
    <div className="video-meta">
      <div className="video-title">{video.title}</div>
      {video.subtitle && <div className="video-sub">{video.subtitle}</div>}
    </div>
  );
}

function VideoBadge({ video, placeholder = false }: { video: VideoItem; placeholder?: boolean }) {
  return (
    <div className="video-tag-row">
      {video.tag && <span className="video-tag">{video.tag}</span>}
      {video.duration && <span className="video-duration">{video.duration}</span>}
      {placeholder && <span className="video-placeholder-tag">Bald</span>}
    </div>
  );
}

function PlayIcon({ dim = false }: { dim?: boolean }) {
  return (
    <span className={`play-glyph${dim ? ' dim' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r="30" fill="rgba(0,0,0,.55)" />
        <polygon points="26,20 26,44 46,32" fill="#fff" />
      </svg>
    </span>
  );
}

/** Decorative Bauhaus shapes shown behind any video tile. */
function BauhausPosterArt() {
  return (
    <svg className="video-art" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="225" fill="#141414" />
      <circle cx="80" cy="100" r="60" fill="#FF7A1A" opacity=".85" />
      <rect x="150" y="50" width="100" height="100" fill="#0A84FF" opacity=".75" />
      <polygon points="260,160 380,160 320,80" fill="#FFD60A" opacity=".70" />
      <rect x="0" y="200" width="400" height="3" fill="#E84545" />
    </svg>
  );
}

function embedSrc(kind: 'youtube' | 'vimeo', id: string) {
  if (kind === 'youtube') return `https://www.youtube-nocookie.com/embed/${id}`;
  return `https://player.vimeo.com/video/${id}`;
}
