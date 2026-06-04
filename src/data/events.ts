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

    partner: { name: 'Padel Haus', web: 'https://padelhaus.de' },
    heroImageSrc: '/assets/events/sunset-hero.jpg',

    longDesc: [
      'Der erste RITMO DNA Cup ist eine Founders-Edition — die Premiere ' +
      'unseres Tournament-Formats und gleichzeitig eine Premiere für die ' +
      'Zusammenarbeit mit Padel Haus. Tagsüber wird gespielt, nach Sonnenuntergang ' +
      'wird gefeiert.',
      'Das Turnier startet mit einer Gruppenphase, in der jeder gegen jeden ' +
      'spielt — die zwei besten pro Gruppe ziehen ins KO ein. Ab dem Halbfinale ' +
      'kippt die Stimmung: House-Music-DJ läuft, Sunset-Drinks fließen, der Court ' +
      'wird zur Bühne. Spieler und Zuschauer teilen den gleichen Raum.',
      'Ob du selbst spielst oder mit deinen Leuten vorbeikommst — RITMO DNA ' +
      'ist als Stadt-Event gedacht. Padel, Musik, Sommerabend.',
    ],

    schedule: [
      { time: '14:00', title: 'Doors & Check-in',  note: 'Spielerregistrierung, Bändchen-Pickup' },
      { time: '14:30', title: 'Warm-up auf Court 1–4' },
      { time: '15:00', title: 'Gruppenphase · Runde 1' },
      { time: '16:30', title: 'Gruppenphase · Runde 2' },
      { time: '18:00', title: 'KO-Phase · Viertelfinale', note: 'DJ-Set startet' },
      { time: '19:00', title: 'Halbfinale · Sunset', note: 'Drinks & Catering open' },
      { time: '20:00', title: 'Finale unter Flutlicht' },
      { time: '20:45', title: 'Siegerehrung & Drop-Reveal' },
      { time: '21:00', title: 'After-Party — House Music', note: 'bis 00:00' },
    ],

    program: [
      {
        phase: '01 · Gruppenphase',
        details:
          '5 Gruppen à 4 Doppel. Jeder gegen jeden, ein Satz auf 6 Spiele (Tiebreak bei 5:5). ' +
          'Die zwei Erstplatzierten jeder Gruppe ziehen in die KO-Runde.',
      },
      {
        phase: '02 · KO-Phase',
        details:
          'Achtel → Viertel → Halbfinale → Finale. Knockout-Format, 2 Gewinn-Sätze ab Viertelfinale. ' +
          'Schiedsrichter ab dem Halbfinale.',
      },
      {
        phase: '03 · Sunset Session',
        details:
          'Parallel zum Turnier startet ab 18:00 die Sunset Session. House-Music-DJ, Drinks, ' +
          'Verpflegung — Zuschauer-Tickets gelten ab Doors.',
      },
      {
        phase: '04 · Drop-Reveal',
        details:
          'Bei der Siegerehrung enthüllen wir den nächsten RITMO-Drop. Limited Edition, ' +
          'nur vor Ort und für Ticket-Holder verfügbar.',
      },
    ],

    venueInfo: {
      name: 'Padel Haus',
      address: 'Berlin · Standort wird mit Ticket bestätigt',
      web:     'https://padelhaus.de',
      blurb:
        'Padel Haus ist eine der Top-Adressen in Deutschland für Indoor-Padel. ' +
        'Vier Premium-Courts, eigene Bar, Sound-System auf Club-Niveau. ' +
        'Genau der Ort, an dem ein Sunset-Cup hingehört.',
    },

    faq: [
      {
        q: 'Brauche ich ein Doppel-Team?',
        a: 'Ja, das Turnier wird im Doppel gespielt. Wenn du noch keinen Partner hast, ' +
           'schreib uns eine kurze Mail — wir matchen Spieler:innen auf ähnlichem Niveau.',
      },
      {
        q: 'Welches Niveau wird erwartet?',
        a: 'Wir spielen offen. Mittelstufe bis Fortgeschritten ist die Zielgruppe — ' +
           'die Gruppenphase sorgt dafür, dass jedes Match auf Augenhöhe stattfindet.',
      },
      {
        q: 'Was ist im Spieler-Ticket enthalten?',
        a: 'Turnier-Teilnahme, Court-Zeit, Welcome-Drink, Catering ab 18:00, Eintritt ' +
           'zur After-Party und Zugang zum Drop-Reveal.',
      },
      {
        q: 'Was ist im Zuschauer-Ticket enthalten?',
        a: 'Eintritt ab 14:00, Welcome-Drink, Zugang zur Sunset Session und After-Party. ' +
           'Drinks und Catering separat.',
      },
      {
        q: 'Stornierung möglich?',
        a: 'Bis 7 Tage vor Event: volle Rückerstattung. Danach übertragbar an eine ' +
           'andere Person, aber nicht erstattbar.',
      },
      {
        q: 'Wie komme ich hin?',
        a: 'Padel Haus ist mit ÖPNV gut erreichbar. Mit Ticket-Bestätigung bekommst du ' +
           'Adresse, Anfahrtsweg und eine Liste von Parkplätzen in der Nähe.',
      },
    ],
  },
];
