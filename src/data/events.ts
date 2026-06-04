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
    location: 'Großmehring',
    shortDesc:
      'Gruppenphase auf Punkte, KO-Phase mit Hin+Rückspiel (Best of Three), Ehren-Bracket auf Court 3 — und Sunset, Drinks, House Music von 18 Uhr bis Mitternacht. Bei Padel Haus in Großmehring.',
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
      'Mitternacht. Drei Courts, ein Abend.',

      'Das Turnier startet mit einer Gruppenphase: jeder gegen jeden, offene Zeit, ' +
      'maximal Punkte sammeln — keine Sätze, keine Games, nur Punkte. Die Top 12 ' +
      'ziehen in die KO-Phase auf Court 1 und 2: drei Runden im Hin+Rückspiel-Format, ' +
      'Best of Three. Im Großen Finale wird nur ein Spiel ausgetragen — wer gewinnt, ' +
      'gewinnt den Cup.',

      'Parallel läuft auf Court 3 das Ehren-Bracket für die acht aus der Gruppenphase ' +
      'Ausgeschiedenen: Halbfinale, Finale, dann fließend ins Große Finale auf demselben ' +
      'Court. Während gespielt wird, läuft die Sunset Session — House-Music-DJ, Drinks, ' +
      'Verpflegung. Bis Mitternacht.',
    ],

    schedule: [
      { time: '17:30', title: 'Doors & Check-in',                  note: 'Spielerregistrierung, Bändchen-Pickup' },
      { time: '18:00', title: 'Welcome Drink · Sunset Session Start' },
      { time: '18:15', title: 'Gruppenphase · Punkte sammeln',     note: 'Jeder gegen jeden · Court 1–3 parallel' },
      { time: '19:45', title: 'Gruppenphase Ende · Top 12 stehen fest' },
      { time: '20:00', title: 'KO-Phase Runde 1 · 12 → 8',         note: 'Court 1 + 2 · Hin+Rückspiel · Best of Three' },
      { time: '20:00', title: 'Ehren-Bracket Halbfinale',          note: 'Court 3 · für die 8 Ausgeschiedenen' },
      { time: '20:45', title: 'KO-Phase Runde 2 · 8 → 4',          note: 'Court 1 + 2 · Hin+Rückspiel · Best of Three' },
      { time: '21:00', title: 'Ehren-Bracket Finale',              note: 'Court 3' },
      { time: '22:00', title: 'Großes Finale · 1 Game',            note: 'Court 3 · Flutlicht · Center Stage' },
      { time: '22:30', title: 'Siegerehrung & Drop-Reveal' },
      { time: '23:00', title: 'After-Party · House Music' },
      { time: '00:00', title: 'Closing' },
    ],

    program: [
      {
        phase: '01 · Gruppenphase',
        details:
          'Jeder gegen jeden auf allen drei Courts. Offene Punkte-Wertung — ' +
          'keine Sätze, keine Games. Wer am Ende die meisten Punkte gesammelt ' +
          'hat, zieht in die KO-Phase. Die Top 12 advance, die 8 Ausgeschiedenen ' +
          'ins Ehren-Bracket.',
      },
      {
        phase: '02 · KO-Phase (Court 1 + 2)',
        details:
          'Drei KO-Runden auf zwei Courts parallel. Runde 1 (12 → 8) und ' +
          'Runde 2 (8 → 4) werden im Hin+Rückspiel-Format gespielt, Best of Three. ' +
          'Das Große Finale ist nur ein Game — alles oder nichts.',
      },
      {
        phase: '03 · Ehren-Bracket (Court 3)',
        details:
          'Parallel zur KO-Phase spielen die acht aus der Gruppenphase Ausgeschiedenen ' +
          'auf Court 3: Halbfinale, dann Ehren-Finale. Court 3 bleibt die Bühne — ' +
          'auch fürs anschließende Große Finale.',
      },
      {
        phase: '04 · Sunset, Drop & Party',
        details:
          'Während aller Phasen läuft die Sunset Session: DJ, Drinks, Catering. ' +
          'Bei der Siegerehrung enthüllen wir den nächsten RITMO-Drop. Danach: ' +
          'After-Party bis Mitternacht.',
      },
    ],

    venueInfo: {
      name: 'Padel Haus',
      address: 'Großmehring · bei Ingolstadt · Standort wird mit Ticket bestätigt',
      web:     'https://padelhaus.de',
      blurb:
        'Padel Haus in Großmehring (bei Ingolstadt) ist eine der modernsten ' +
        'Padel-Anlagen Süddeutschlands. Drei Premium-Courts, eigene Bar, ' +
        'Sound-System auf Club-Niveau. Genau der Ort, an dem ein Sunset-Cup hingehört.',
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
        a: 'Gruppenphase: jeder gegen jeden, offene Punkte-Wertung (keine Sätze, ' +
           'keine Games — nur Punkte sammeln). Die Top 12 ziehen in die KO-Phase ' +
           'auf Court 1 + 2: zwei Runden Hin+Rückspiel im Best-of-Three-Modus, ' +
           '12 → 8 → 4. Das Große Finale ist nur ein Game. Parallel läuft auf Court 3 ' +
           'das Ehren-Bracket für die 8 aus der Gruppenphase Ausgeschiedenen — ' +
           'Halbfinale, Ehren-Finale, danach Großes Finale auf demselben Court.',
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
        a: 'Padel Haus liegt in Großmehring bei Ingolstadt — direkt an der A9 erreichbar, ' +
           'Parkplätze auf dem Gelände. Mit dem Zug: Bahnhof Ingolstadt, dann ca. 15 Minuten ' +
           'mit dem Taxi. Genaue Adresse und Anfahrtsweg kommen mit der Ticket-Bestätigung.',
      },
    ],
  },
];
