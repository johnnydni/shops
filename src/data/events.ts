/**
 * Event catalog — currently hardcoded.
 * Move to a CMS / Markdown loader / API endpoint later.
 *
 * Sort order is decided at the page layer (chronological asc by `date`).
 * Past events are filtered out by EventsPage using the system date.
 */
import type { EventItem } from '../lib/types';

export const EVENTS: EventItem[] = [
  {
    id: 'ritmo-x-padel-haus-summer-sunset-2026',
    type: 'turnier',
    title: 'RITMO X Padel Haus · Summer Sunset',
    subtitle: 'RITMO DNA Cup · Founders Edition',
    date: '2026-07-18',
    venue: 'Padel Haus',
    location: 'Padel Haus',
    shortDesc:
      'Turnier mit Gruppen- und KO-Phase sowie RITMO DNA. Gute Musik, Drinks und Verpflegung — und House-Music-Vibes von RITMO und Padel Haus.',
    tags: ['Founders Edition', 'RITMO DNA Cup', 'House Music', 'Sunset'],
    tickets: [
      { name: 'Spieler',   price: 39, capacity: 20 },
      { name: 'Zuschauer', price: 15 },
    ],
    salesStart: '2026-06-18',
    salesEnd:   '2026-07-17',
    ctaLabel: 'Ticket sichern',
    // ctaUrl: '<set when ticketing is live>',
  },
];
