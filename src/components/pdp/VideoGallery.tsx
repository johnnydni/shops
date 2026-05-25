import type { VideoItem } from '../../lib/types';
import { VideoPlaceholder } from './VideoPlaceholder';
import { useReveal } from '../../hooks/useReveal';

interface Props {
  videos: VideoItem[];
  heading?: string;
  headingAccent?: string;
  intro?: string;
}

/**
 * "Vorschau" section — a row of explainer / test / unboxing videos.
 * Lives between the editorial bleed and the spec table on a PDP.
 *
 * Layout adapts: 1 video → big single, 2 → side-by-side, 3+ → 3-up grid.
 */
export function VideoGallery({
  videos,
  heading = 'Vorschau',
  headingAccent = '& Tests',
  intro = 'Erklärvideos, Test-Aufnahmen und Unboxings — damit du das Produkt vorm Kauf in Bewegung siehst.',
}: Props) {
  const ref = useReveal<HTMLDivElement>();
  if (!videos.length) return null;

  const layoutClass = videos.length === 1 ? 'one' : videos.length === 2 ? 'two' : 'many';

  return (
    <section className="video-gallery">
      <div className="wrap">
        <div className="video-head reveal" ref={ref}>
          <h2>
            {heading}
            {headingAccent && (
              <>
                {' '}
                <span className="accent">{headingAccent}</span>
              </>
            )}
            .
          </h2>
          {intro && <p>{intro}</p>}
        </div>
        <div className={`video-grid ${layoutClass}`}>
          {videos.map((v, i) => (
            <VideoPlaceholder key={i} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
