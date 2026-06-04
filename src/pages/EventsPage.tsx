import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EVENTS } from '../data/events';
import { EVENT_TYPE_LABEL, type EventType } from '../lib/types';
import { EventCard } from '../components/events/EventCard';
import { parseISODate } from '../lib/dates';

type Chip = EventType | 'all';
const ORDER: Chip[] = ['all', 'turnier', 'demo', 'training', 'popup'];

/**
 * /events — chronological list of upcoming RITMO events.
 *
 * Past events are filtered out using the system clock (UTC compare).
 * Type-chips filter further. Cards stagger in via Framer Motion.
 */
export function EventsPage() {
  const [active, setActive] = useState<Chip>('all');
  const reduce = useReducedMotion();

  const upcoming = useMemo(() => {
    const today = new Date();
    // Compare by UTC midnight so we don't drop today's event mid-afternoon.
    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    );
    return EVENTS.filter((e) => {
      const ref = e.endDate ?? e.date;
      return parseISODate(ref).getTime() >= todayUTC;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const visible = useMemo(
    () => (active === 'all' ? upcoming : upcoming.filter((e) => e.type === active)),
    [upcoming, active]
  );

  // Tally how many events per type for the chip badges.
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: upcoming.length };
    for (const e of upcoming) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [upcoming]);

  // Container variant for the grid — staggers children when revealed.
  const grid = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.1 },
    },
  };

  return (
    <>
      <motion.section
        className="page-intro"
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="wrap">
          <p className="rule">Events</p>
          <h1 className="page-title">
            Live. <span className="accent">On Court</span>.
          </h1>
          <p className="page-lead">
            Turniere, Demo Days, Pro-Clinics und Pop-up-Stores. Wo RITMO
            in den nächsten Monaten anzutreffen ist.
          </p>
        </div>
      </motion.section>

      <section className="events-filters" aria-label="Event-Typ Filter">
        <div className="wrap">
          <div className="filters" role="tablist">
            {ORDER.map((c) => {
              const label = c === 'all' ? 'Alle' : EVENT_TYPE_LABEL[c as EventType];
              const n = counts[c] ?? 0;
              return (
                <button
                  key={c}
                  type="button"
                  className={`chip-btn${active === c ? ' active' : ''}`}
                  onClick={() => setActive(c)}
                  role="tab"
                  aria-selected={active === c}
                  disabled={n === 0 && c !== 'all'}
                >
                  {label}
                  <span className="chip-count" aria-hidden>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="events">
        <div className="wrap">
          {visible.length === 0 ? (
            <div className="events-empty">
              Keine Events in dieser Kategorie. Bald mehr — schau auch in den{' '}
              <a href="/news" className="link-inline">News</a>.
            </div>
          ) : (
            <motion.div
              className="events-grid"
              variants={grid}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              // Re-trigger stagger when filter changes
              key={active}
            >
              {visible.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
