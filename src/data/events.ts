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
      'Turnier mit Gruppenphase, KO-Runden (12 → 8 → 4) und Ehren-Bracket — dazu Sunset, House Music, Drinks und Verpflegung. 18 Uhr bis Mitternacht.',
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
      'Der erste RITMO DNA Cup ist eine Founders-Edition — Premiere unseres ' +
      'Tournament-Formats und gleichzeitig Premiere für die Zusammenarbeit mit ' +
      'Padel Haus. Sechs Stunden Padel und Party, vom Sunset um 18 Uhr bis ' +
      'Mitternacht.',

      'Das Turnier startet mit einer Gruppenphase: jeder gegen jeden, Punkte ' +
      'sammeln. Die Top 12 ziehen in die KO-Phase — drei Runden bis zum Finale ' +
      '(12 → 8 → 4). Parallel spielen die acht aus der Gruppenphase Ausgeschiedenen ' +
      'ein eigenes Bracket: 4 gegen 4, die Sieger treten im Ehren-Finale gegeneinander an.',

      'Während gespielt wird, läuft die Sunset Session: House-Music-DJ, Drinks, ' +
      'Verpflegung. Spieler und Zuschauer teilen den gleichen Raum, der Court ' +
      'wird zur Bühne. Bis Mitternacht.',
    ],

    schedule: [
      { time: '17:30', title: 'Doors & Check-in',          note: 'Spielerregistrierung, Bändchen-Pickup' },
      { time: '18:00', title: 'Welcome Drink · Sunset Session Start' },
      { time: '18:15', title: 'Gruppenphase · Jeder gegen jeden', note: 'Court 1–4 parallel' },
      { time: '20:00', title: 'Top 12 stehen fest',        note: 'Ehren-Bracket startet für die 8 Ausgeschiedenen' },
      { time: '20:15', title: 'KO-Phase 1 · 12 → 8' },
      { time: '21:00', title: 'KO-Phase 2 · 8 → 4',        note: 'Ehren-Bracket Halbfinale' },
      { time: '21:45', title: 'Finale · Top 4',            note: 'Center Court · Flutlicht' },
      { time: '22:30', title: 'Ehren-Finale',              note: 'Sieger der beiden Ehren-Brackets' },
      { time: '22:45', title: 'Siegerehrung & Drop-Reveal' },
      { time: '23:00', title: 'After-Party · House Music' },
      { time: '00:00', title: 'Closing' },
    ],

    program: [
      {
        phase: '01 · Gruppenphase',
        details:
          'Jeder gegen jeden, ein Satz auf 6 Spiele (Tiebreak bei 5:5). ' +
          'Punkte werden gesammelt — die Top 12 ziehen in die KO-Phase, ' +
          'die übrigen 8 ins Ehren-Bracket.',
      },
      {
        phase: '02 · KO-Phase',
        details:
          'Drei Runden bis zum Finale: 12 → 8 → 4. KO-Format, 2 Gewinn-Sätze ' +
          'ab Halbfinale. Das Finale läuft auf dem Center Court unter Flutlicht.',
      },
      {
        phase: '03 · Ehren-Bracket',
        details:
          'Die acht aus der Gruppenphase Ausgeschiedenen bilden zwei Bracket-Gruppen ' +
          'à 4 (4 gegen 4). Die Sieger jeder Gruppe spielen das Ehren-Finale.',
      },
      {
        phase: '04 · Sunset, Drop & Party',
        details:
          'Parallel zu allen Turnier-Phasen läuft die Sunset Session — DJ, Drinks, ' +
          'Catering. Bei der Siegerehrung enthüllen wir den nächsten RITMO-Drop. ' +
          'Danach: After-Party bis Mitternacht.',
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
        q: 'Wie läuft das Turnier ab?',
        a: 'Gruppenphase (jeder gegen jeden) → Top 12 in die KO-Phase (12 → 8 → 4 → Finale). ' +
           'Die 8 aus der Gruppenphase Ausgeschiedenen spielen parallel ein Ehren-Bracket: ' +
           'zwei Gruppen à 4, die Sieger spielen das Ehren-Finale. Damit hat jeder mehrere Matches.',
      },
      {
        q: 'Was ist im Spieler-Ticket enthalten?',
        a: 'Turnier-Teilnahme (inkl. Ehren-Bracket, falls in der Gruppe ausgeschieden), ' +
           'Court-Zeit, Welcome-Drink, Catering, After-Party und Drop-Reveal.',
      },
      {
        q: 'Was ist im Zuschauer-Ticket enthalten?',
        a: 'Eintritt ab 17:30, Welcome-Drink, Zugang zur Sunset Session und After-Party. ' +
           'Weitere Drinks und Catering separat.',
      },
      {
        q: 'Stornierung möglich?',
        a: 'Bis 7 Tage vor Event: volle Rückerstattung. Danach übertragbar an eine ' +
           'andere Person, aber nicht erstattbar.',
      },
      {
        q: 'Wie komme ich hin?',
        a: 'Padel Haus ist mit ÖPNV gut erreichbar. Mit der Ticket-Bestätigung bekommst du ' +
           'Adresse, Anfahrtsweg und eine Liste von Parkplätzen in der Nähe.',
      },
    ],
  },
];
