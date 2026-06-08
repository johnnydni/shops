import { useReducedMotion, motion } from 'framer-motion';
import type { BuyStep } from '../../../lib/buyState';

/**
 * Bauhaus dots progress indicator for the buy flow.
 * 4 dots (or 3 if quiz is skipped for zuschauer); the active one
 * scales + colours up, past ones fill orange, future ones stay outlined.
 *
 * Pure presentational — the parent decides what to show.
 */
const ALL_LABELS: Array<{ key: BuyStep; label: string }> = [
  { key: 'type',   label: 'Auswahl'   },
  { key: 'names',  label: 'Personen'  },
  { key: 'quiz',   label: 'Spielstil' },
  { key: 'review', label: 'Bestätigen' },
];

export function StepProgress({
  current,
  visibleSteps,
}: {
  current: BuyStep;
  visibleSteps: BuyStep[];
}) {
  const reduce = useReducedMotion();
  const items = ALL_LABELS.filter((s) => visibleSteps.includes(s.key));
  const currentIdx = items.findIndex((s) => s.key === current);

  return (
    <ol className="bf-progress" aria-label="Fortschritt">
      {items.map((item, i) => {
        const state =
          i < currentIdx ? 'done' :
          i === currentIdx ? 'active' :
          'todo';
        return (
          <li key={item.key} className={`bf-dot bf-${state}`}>
            <motion.span
              className="bf-mark"
              animate={state === 'active' ? { scale: reduce ? 1 : [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 1.2, repeat: state === 'active' ? Infinity : 0 }}
              aria-hidden="true"
            />
            <span className="bf-label">{item.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
