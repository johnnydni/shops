import { useReveal } from '../../hooks/useReveal';
import { AnimatedBg } from '../layout/AnimatedBg';
import type { EditorialBleed as EB } from '../../lib/types';

/** Full-bleed centered editorial line ("Für die, die Padel ernst meinen.") */
export function EditorialBleed({ data }: { data: EB }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="pdp-bleed">
      <div className="bleed-bg">
        <AnimatedBg />
      </div>
      <div className="bleed-inner reveal" ref={ref}>
        <h2>
          {data.title}
          {data.titleAccent && (
            <>
              <br />
              <span className="accent">{data.titleAccent}</span>
            </>
          )}
        </h2>
        <p>{data.body}</p>
      </div>
    </section>
  );
}
