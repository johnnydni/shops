/**
 * Event catalog — currently hardcoded mock data.
 * Move to a CMS / Markdown loader / API endpoint later.
 *
 * Sort order is decided at the page layer (chronological asc by `date`).
 * Past events are filtered out by EventsPage using the system date.
 */
import type { EventItem } from '../lib/types';

export const EVENTS: EventItem[] = [
  {
    id: 'ritmo-open-berlin-2026',
    type: 'turnier',
    title: 'RITMO Open · Berlin',
    date: '2026-07-12',
    endDate: '2026-07-13',
    venue: 'Padel-Halle Wedding',
    location: 'Berlin',
    shortDesc:
      'Zwei Tage, vier Kategorien (A/B/C/Mix), Doppel-Format. Open Draw, Online-Anmeldung über Eventbrite.',
    price: 49,
    capacity: 64,
    status: 'open',
    ctaLabel: 'Ticket sichern',
    ctaUrl: 'https://eventbrite.com/ritmo-open-berlin',
  },
  {
    id: 'demo-day-hamburg',
    type: 'demo',
    title: 'Demo Day · Schläger Test',
    date: '2026-06-22',
    venue: 'PadelBox Hamburg',
    location: 'Hamburg',
    shortDesc:
      'Test alle RITMO-Schläger (Pro, Edge, kommende Editionen) auf dem Platz. Keine Anmeldung, walk-in.',
    price: 0,
    status: 'open',
    ctaLabel: 'Kalender-Eintrag',
  },
  {
    id: 'pro-training-muenchen',
    type: 'training',
    title: 'Bandeja & Vibora · Pro Clinic',
    date: '2026-06-28',
    venue: 'Padel Center Süd',
    location: 'München',
    shortDesc:
      '2h Clinic mit Daniel Vega (Top-200 ATP-Padel). Fokus: Bandeja-Technik, Court-Positioning, Punkt-Konstruktion.',
    price: 89,
    capacity: 12,
    status: 'waitlist',
    ctaLabel: 'Auf Warteliste',
    ctaUrl: 'https://forms.gle/ritmo-clinic-muenchen',
  },
  {
    id: 'popup-koeln-rheinauhafen',
    type: 'popup',
    title: 'Pop-up Store · Rheinauhafen',
    date: '2026-08-15',
    endDate: '2026-08-17',
    venue: 'Speicher 7',
    location: 'Köln',
    shortDesc:
      'Drei Tage RITMO zum Anfassen — komplettes Sortiment, Print-Editionen, signierte Pro-Schläger. Eintritt frei.',
    price: 0,
    status: 'open',
    ctaLabel: 'Save the Date',
  },
  {
    id: 'after-work-padel-wien',
    type: 'training',
    title: 'After-Work Padel · Mixed',
    date: '2026-09-05',
    venue: 'Padel Hub Wien',
    location: 'Wien',
    shortDesc:
      'Lockere Mixed-Session für Mittelstufe. 90 Min Spiel, danach Drink in der RITMO-Bar.',
    price: 24,
    capacity: 16,
    status: 'open',
    ctaLabel: 'Spot buchen',
    ctaUrl: 'https://forms.gle/ritmo-after-work-wien',
  },
  {
    id: 'ritmo-open-zuerich-2026',
    type: 'turnier',
    title: 'RITMO Cup · Zürich',
    date: '2026-10-04',
    venue: 'Padel Arena Oerlikon',
    location: 'Zürich',
    shortDesc:
      'Tages-Turnier, Doppel A/B. Preisgeld 2.500 CHF, sponsored by RITMO Pro Drop II.',
    price: 65,
    capacity: 32,
    status: 'open',
    ctaLabel: 'Anmelden',
    ctaUrl: 'https://eventbrite.com/ritmo-cup-zuerich',
  },
  {
    id: 'launch-pro-drop-2',
    type: 'demo',
    title: 'Pro Drop II · Launch Demo',
    date: '2026-11-08',
    venue: 'RITMO Studio',
    location: 'Berlin',
    shortDesc:
      'Erste öffentliche Demo des Carbon-3K Drop II. Limitierte Plätze, Voranmeldung erforderlich.',
    price: 0,
    capacity: 24,
    status: 'open',
    ctaLabel: 'RSVP',
    ctaUrl: 'https://forms.gle/ritmo-pro-drop-ii',
  },
];
