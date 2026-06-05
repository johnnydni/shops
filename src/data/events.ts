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
      'Gruppenphase auf Punkte, Top 14 in die KO-Phase mit Viertelfinale (Court 1–3), Halbfinale (Court 2+3) und RITMO Grande Finale auf Court 3 (Top 2 bekommen Bye direkt zum Halbfinale). Parallel Ehren-Bracket auf Court 1 — niemand sitzt nur rum. Sunset, Drinks, House Music von 18 Uhr bis Mitternacht. Bei Padel Haus in Großmehring.',
    tags: ['Founders Edition', 'RITMO DNA Cup', 'House Music', 'Sunset'],
    tickets: [
      { name: 'Spieler',   price: 39, capacity: 22 },
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
      'Padel Haus. 22 Spieler:innen, drei Courts, sechs Stunden vom Sunset bis ' +
      'Mitternacht.',

      'Das Turnier startet mit einer Gruppenphase: jeder gegen jeden, offene ' +
      'Zeit, maximal Punkte sammeln — keine Sätze, keine Games, nur Punkte. ' +
      'Die Top 14 nach Punkten ziehen in die KO-Phase. Die ersten beiden ' +
      'Platzierten bekommen ein Bye direkt ins Halbfinale.',

      'KO-Phase: Viertelfinale (12 → 6) auf allen drei Courts im Hin+Rückspiel-' +
      'Format, Best of Three. Danach Halbfinale auf Court 2 und 3 — die 6 Sieger ' +
      'plus die 2 Bye-Spieler aus der Gruppenphase = 8 Spieler (8 → 4), wieder ' +
      'Hin+Rückspiel Best of Three. Das RITMO Grande Finale auf Court 3 ist nur ' +
      'ein Spiel — kein Best-of-Three, kein Rückspiel, alles oder nichts.',

      'Sobald das Halbfinale läuft, wird Court 1 frei und das Ehren-Bracket ' +
      'startet: Ehren-Halbfinale (8 → 2) für die in der Gruppenphase ' +
      'Ausgeschiedenen. Das Ehren-Finale läuft im Anschluss auf Court 3, kurz ' +
      'vor dem RITMO Grande Finale. So bekommt jede:r mehrere Matches. ' +
      'Währenddessen: Sunset Session, House-Music-DJ, Drinks, Verpflegung. ' +
      'Bis Mitternacht.',
    ],

    schedule: [
      { time: '17:30', title: 'Doors & Check-in',                  note: 'Spielerregistrierung, Bändchen-Pickup' },
      { time: '18:00', title: 'Welcome Drink · Sunset Session Start' },
      { time: '18:15', title: 'Gruppenphase · Punkte sammeln',     note: '22 Spieler · jeder gegen jeden · Court 1–3 parallel' },
      { time: '19:30', title: 'Top 14 stehen fest',                note: 'Top 2: Bye zum Halbfinale · Platz 3–14: Viertelfinale' },
      { time: '19:45', title: 'Viertelfinale · 12 → 6',            note: 'Court 1 + 2 + 3 · alle Courts · Hin+Rückspiel · Best of Three' },
      { time: '20:45', title: 'Halbfinale · 8 → 4',                note: 'Court 2 + 3 · 6 Sieger + 2 Bye · Hin+Rück · BoT' },
      { time: '20:45', title: 'Ehren-Bracket Halbfinale · 8 → 2',  note: 'Court 1 · parallel zum Hauptbracket-Halbfinale' },
      { time: '21:45', title: 'Ehren-Finale · 2 → 1',              note: 'Court 3 · gleich nach dem Hauptbracket-Halbfinale' },
      { time: '22:00', title: 'RITMO Grande Finale · 1 Game',      note: 'Court 3 · Flutlicht · Center Stage · Top 4 · alles oder nichts' },
      { time: '22:30', title: 'Siegerehrung & Drop-Reveal' },
      { time: '23:00', title: 'After-Party · House Music' },
      { time: '00:00', title: 'Closing' },
    ],

    program: [
      {
        phase: '01 · Gruppenphase',
        details:
          '22 Spieler:innen, jeder gegen jeden auf allen drei Courts. Offene ' +
          'Punkte-Wertung — keine Sätze, keine Games. Die Top 14 nach Punkten ' +
          'ziehen in die KO-Phase, die 8 Ausgeschiedenen ins Ehren-Bracket. ' +
          'Niemand fliegt komplett raus.',
      },
      {
        phase: '02 · Viertelfinale (Court 1 + 2 + 3)',
        details:
          'Plätze 3–14 spielen 6 Matches (12 → 6) auf allen drei Courts parallel ' +
          'im Hin+Rückspiel-Format, Best of Three. Alle drei Courts sind in Action — ' +
          'volles Padel-Haus-Feeling.',
      },
      {
        phase: '03 · Halbfinale (Court 2 + 3) & Ehren-Bracket (Court 1)',
        details:
          'Sobald das Viertelfinale durch ist, läuft das Halbfinale auf Court 2 + 3 ' +
          '(6 Sieger + 2 Top-Bye-Spieler = 8 → 4, Hin+Rückspiel Best of Three). ' +
          'Parallel startet auf Court 1 das Ehren-Bracket Halbfinale (8 → 2) für ' +
          'die in der Gruppenphase Ausgeschiedenen — niemand wird abgemeldet.',
      },
      {
        phase: '04 · Ehren-Finale & RITMO Grande Finale (Court 3)',
        details:
          'Court 3 wird zur Bühne: zuerst das Ehren-Finale (2 → 1), dann das ' +
          'RITMO Grande Finale — Top 4, ein Spiel, kein Rückspiel, kein Decider. ' +
          'Unter Flutlicht, mit House-Music-Backdrop. Anschließend Siegerehrung, ' +
          'Drop-Reveal, After-Party bis Mitternacht.',
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
        a: 'Gruppenphase: 22 Spieler:innen, jeder gegen jeden, offene Punkte-Wertung ' +
           '— keine Sätze, keine Games, nur Punkte. Die Top 14 ziehen in die KO-Phase. ' +
           'Die ersten beiden Platzierten bekommen direkt ein Bye ins Halbfinale. ' +
           'Viertelfinale (Plätze 3–14, 12 → 6) wird auf allen drei Courts im ' +
           'Hin+Rückspiel-Modus gespielt, Best of Three. Halbfinale (8 → 4) läuft ' +
           'auf Court 2 + 3, gleiches Format. Parallel startet auf Court 1 das ' +
           'Ehren-Bracket Halbfinale (8 → 2) für die in der Gruppenphase ' +
           'Ausgeschiedenen. Das Ehren-Finale und das RITMO Grande Finale (Top 4, ' +
           'nur 1 Spiel — kein Best-of-Three, kein Rückspiel) laufen beide auf ' +
           'Court 3.',
      },
      {
        q: 'Was ist im Spieler-Ticket enthalten?',
        a: 'Turnier-Teilnahme (Gruppenphase + KO oder Ehren-Bracket, abhängig vom ' +
           'Abschneiden in der Gruppe), Court-Zeit, Welcome-Drink, Catering, After-Party ' +
           'und Drop-Reveal. Jede:r Spieler:in bekommt garantiert mehrere Matches.',
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
