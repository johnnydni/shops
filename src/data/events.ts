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
    title: 'RITMO X Padel Haus · Summer Sunset Special',
    subtitle: 'RITMO DNA Cup · Founders Edition',
    date: '2026-07-18',
    venue: 'Padel Haus',
    location: 'Großmehring',
    shortDesc:
      'Gruppenphase im Mexicano-Format (rotierende Partner, alle werden durchgemixt), Top 14 in die KO-Phase: Knock-Out 1 Set (Court 1–3), Halbfinale 2 Sets (Court 2+3), RITMO Grande Finale Best of 3 auf Court 3. Parallel Ehren-Bracket auf Court 1 — niemand sitzt nur rum. Sunset, Drinks, House Music ab 18 Uhr bis Open End. Bei Padel Haus in Großmehring.',
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

      'Das Turnier startet mit einer Gruppenphase im Mexicano-Format: rotierende ' +
      'Partner über mehrere Runden, jeder gegen viele, offene Punkte-Wertung — ' +
      'keine Sätze, keine Games, nur Punkte. So bekommt jede:r Spielzeit und ' +
      'spielt mit unterschiedlichen Leuten. Die Top 14 nach Punkten ziehen in die ' +
      'KO-Phase. Die ersten beiden Platzierten bekommen ein Bye direkt ins Halbfinale.',

      'KO-Phase: Knock-Out (12 → 6) auf allen drei Courts — pro Pairing ' +
      '1 Set bis 6 Games mit Tiebreak bei 5:5. Halbfinale auf Court 2 und 3: ' +
      '6 Sieger plus 2 Bye-Spieler = 8 Spieler (8 → 4), pro Pairing 2 Sets ' +
      '(Hin + Rück, ohne Decider — entschieden über die zwei Sätze). ' +
      'Das RITMO Grande Finale auf Court 3 ist ein klassisches Best of 3 ' +
      'Sätze bis 6 (Tiebreak bei 5:5).',

      'Parallel zum Halbfinale läuft auf Court 1 das Ehren-Bracket Halbfinale ' +
      'für die 8 aus der Gruppenphase Ausgeschiedenen — kurze Sätze, damit ' +
      'alle fit für die Party bleiben. Das Ehren-Finale läuft direkt vor dem ' +
      'RITMO Grande Finale auf Court 3. Währenddessen: Sunset Session, ' +
      'House-Music-DJ, Drinks, Verpflegung. Bis Mitternacht.',
    ],

    schedule: [
      { time: '17:30', title: 'Doors & Check-in',                  note: 'Spielerregistrierung, Bändchen-Pickup' },
      { time: '18:00', title: 'Sunset Session Start' },
      { time: '18:15', title: 'Gruppenphase · Mexicano-Format',    note: '22 Spieler · rotierende Partner · Court 1–3 parallel · ~75 min' },
      { time: '19:30', title: 'Top 14 stehen fest',                note: 'Top 2: Bye zum Halbfinale · Platz 3–14: Knock-Out' },
      { time: '19:45', title: 'Knock-Out · 12 → 6',                note: 'Court 1 + 2 + 3 · alle Courts · 1 Set (Tiebreak bei 5:5)' },
      { time: '20:45', title: 'Halbfinale · 8 → 4',                note: 'Court 2 + 3 · 6 Sieger + 2 Bye · 2 Sets (Hin + Rück, kein Decider)' },
      { time: '20:45', title: 'Ehren-Bracket Halbfinale · 8 → 2',  note: 'Court 1 · parallel · kurze Sätze' },
      { time: '22:00', title: 'Ehren-Finale · 2 → 1',              note: 'Court 3 · 1 Set · direkt nach dem Halbfinale' },
      { time: '22:30', title: 'RITMO Grande Finale',               note: 'Court 3 · Flutlicht · Best of 3 Sätze bis 6 (Tiebreak bei 5:5) · Top 4 · 50-75 min' },
      { time: '23:30', title: 'Siegerehrung & Drop-Reveal' },
      { time: '23:45', title: 'After-Party · LNRT House Music' },
      { time: '00:00', title: 'Open End',                          note: 'Closing-Time ist Orientierung — DJ läuft bis die Energie passt' },
    ],

    program: [
      {
        phase: '01 · Gruppenphase · Mexicano-Format',
        details:
          '22 Spieler:innen, rotierende Partner über mehrere Runden auf allen ' +
          'drei Courts parallel. Offene Punkte-Wertung — keine Sätze, keine Games. ' +
          'Jede:r spielt mit unterschiedlichen Leuten, sammelt Punkte über alle ' +
          'Runden. Pausierende einer Runde bekommen den aufgerundeten Median ' +
          'der Punkte aus der laufenden Runde gutgeschrieben — niemand verliert ' +
          'durch eine Pause. Die Top 14 ziehen in die KO-Phase, die übrigen 8 ' +
          'ins Ehren-Bracket. Niemand fliegt komplett raus.',
      },
      {
        phase: '02 · Knock-Out (Court 1 + 2 + 3)',
        details:
          'Plätze 3–14 spielen 6 Matches (12 → 6) auf allen drei Courts parallel. ' +
          '1 Set pro Pairing, bis 6 Games mit Tiebreak bei 5:5. Schnell, ' +
          'fokussiert — keine Best-of-Three-Verlängerung.',
      },
      {
        phase: '03 · Halbfinale (Court 2 + 3) & Ehren-Bracket (Court 1)',
        details:
          'Sobald die Knock-Out-Runde durch ist, läuft das Halbfinale auf Court 2 + 3 ' +
          '(6 Sieger + 2 Top-Bye-Spieler = 8 → 4). 2 Sets pro Pairing — Hin und ' +
          'Rück, ohne Decider, der Sieger steht über die zwei Sätze fest. Parallel ' +
          'startet auf Court 1 das Ehren-Bracket Halbfinale (8 → 2) für die in ' +
          'der Gruppenphase Ausgeschiedenen — kurze Sätze, damit alle fit für die ' +
          'Party bleiben.',
      },
      {
        phase: '04 · Ehren-Finale & RITMO Grande Finale (Court 3)',
        details:
          'Court 3 wird zur Bühne: zuerst das Ehren-Finale (2 → 1, 1 Set bis 6). ' +
          'Dann das RITMO Grande Finale — Top 4, Best of 3 Sätze bis 6 (Tiebreak ' +
          'bei 5:5), klassisches Padel-Finale-Format. Unter Flutlicht, mit ' +
          'House-Music-Backdrop. Anschließend Siegerehrung, Drop-Reveal, ' +
          'After-Party — Open End.',
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
      imageSrc: '/assets/events/sunset-court.jpg',
    },

    faq: [
      {
        q: 'Brauche ich einen Doppel-Partner?',
        a: 'Nein — du kannst dich allein anmelden. Das Turnier läuft im Mexicano-Format: ' +
           'alle Spieler:innen werden über mehrere Runden durchgemixt und rotieren ' +
           'Partner sowie Gegner. Heißt: du spielst mit vielen unterschiedlichen Leuten ' +
           'und musst dir keinen festen Partner suchen. Punkte sammelst du individuell.',
      },
      {
        q: 'Welches Niveau wird erwartet?',
        a: 'Wir spielen offen. Mittelstufe bis Fortgeschritten ist die Zielgruppe — ' +
           'die Gruppenphase sorgt dafür, dass jedes Match auf Augenhöhe stattfindet.',
      },
      {
        q: 'Wie läuft das Turnier exakt ab?',
        a: 'GRUPPENPHASE (Mexicano-Format, Court 1+2+3 parallel, ~75 min): 22 Spieler:innen ' +
           'rotieren über mehrere Runden Partner und Gegner. Pro Match werden offene Punkte ' +
           'gespielt (z.B. 8 Punkte pro Runde, oder time-based). Keine Sätze, keine Games — ' +
           'nur die Gesamtpunkte zählen. ' +
           'Pausen-Fairness: Wer eine Runde aussetzen muss (mit 22 Spielern auf 3 Courts ' +
           'sitzen pro Runde 10 Personen), bekommt automatisch den aufgerundeten Median ' +
           'der in dieser Runde erzielten Punkte gutgeschrieben — niemand verliert durch ' +
           'eine Pause. ' +
           'Zusatz: Jedes Match wird per RITMO DNA in einen Match-Tier eingeordnet (S/A/B/C/X) ' +
           '— gewinnst du ein höher-tieriges Match, bekommst du Bonus-Punkte. Details unten in ' +
           'der "Match-Tier"-Sektion.' +
           '\n\n' +
           'KNOCK-OUT (Court 1+2+3 parallel, ~60 min): 12 → 6. Pro Pairing genau 1 Satz ' +
           'bis 6 Games gewonnen, Tiebreak bei 5:5. Kein Rückspiel, kein Best-of-Three.' +
           '\n\n' +
           'HALBFINALE (Court 2+3 parallel, ~75 min): 8 → 4. Pro Pairing 2 Sätze (Hin + Rück), ' +
           'beide bis 6 Games mit Tiebreak bei 5:5. Wer in Summe mehr Spiele gewonnen hat, ' +
           'zieht weiter. Kein Decider-Match — Punkteglechheit wird über Spielgewinne aufgelöst.' +
           '\n\n' +
           'EHREN-BRACKET (Court 1, parallel zum Halbfinale, ~75 min): 8 → 2 im Halbfinale, ' +
           'dann 2 → 1 im Ehren-Finale auf Court 3. Kurze Sätze (1 Satz bis 4 Games oder ' +
           'time-based, je nach Restzeit) — Spielzeit ohne Pausenstress.' +
           '\n\n' +
           'RITMO GRANDE FINALE (Court 3, Flutlicht, ~60 min): Top 4 spielen ein klassisches ' +
           'Padel-Finale — Best of 3 Sätze bis 6 Games (Tiebreak bei 5:5). Wer zwei Sätze ' +
           'gewinnt, gewinnt den Cup. Drei Sätze möglich, wenn 1:1 nach Hin+Rück.',
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

    /* ───────── Verpflegung / Catering ───────── */
    catering: [
      {
        name: 'RITMO Refresh Bar',
        tagline: 'Obstbar',
        description:
          'Frisch geschnittenes Obst, kalt-gepresste Säfte und Wasser-Stationen. ' +
          'Court-Side platziert — schnell rein, schnell raus, fit fürs nächste Match. ' +
          'Exklusiv für Spieler-Tickets.',
        imageSrc: '/assets/events/sunset-refresh-bar.jpg',
      },
      {
        name: "Manny's BBQ",
        tagline: 'Burger Stand',
        description:
          'Smashed Patties auf Brioche-Bun, knusprige Pommes, vegetarische Option. ' +
          'Spieler-Tickets bekommen einen großen Burger, Zuschauer-Tickets einen kleinen — ' +
          'beide inklusive. Open für Nachorder.',
        imageSrc: '/assets/events/sunset-bbq.jpg',
      },
      {
        name: 'Aperol Bar',
        tagline: 'Spritz · Signature',
        description:
          'Zwei Drinks auf der Karte: klassischer Aperol Spritz und der ' +
          'Padelé Spritz — unser Signature Drink für den Cup, exklusiv vor Ort. ' +
          'Spieler-Tickets bekommen einen Welcome-Drink inklusive (auch ' +
          'non-alkoholische Variante verfügbar), Zuschauer einen Softdrink.',
        imageSrc: '/assets/events/sunset-aperol-bar.jpg',
      },
    ],

    /* ───────── Musik ───────── */
    music: {
      djName: 'DJ ANKOE',
      setTitle: 'Ready Mix für RITMO X Padel Haus',
      description:
        'ANKOE legt einen eigens für das Event produzierten Ready Mix auf — ' +
        'Sunset-Vibes zur Gruppenphase, Tempo-Anstieg fürs Halbfinale, ' +
        'Festival-Drop zum Grande Finale. Soundtrack, der mit dem Turnier wächst.',
      followUp:
        'Nach dem Drop-Reveal übernimmt LNRT mit einem House-Music-Set bis Open End — ' +
        'tiefer, deeper, dancefloor-tauglich. Padel Haus wird zum Club.',
      imageSrc: '/assets/events/sunset-dj.jpg',
    },

    /* ───────── Scoring · RITMO Match Tiers ───────── */
    scoring: {
      title: 'RITMO Match Tiers',
      description:
        'In der Gruppenphase werden alle Matches per RITMO DNA in fünf Tiers ' +
        'eingeordnet — basierend auf Niveau und Form der Pairings. Gewinnst du ein ' +
        'höher-tieriges Match, bekommst du Extra-Punkte aufs Gesamtkonto. So zählen ' +
        'Siege gegen starke Gegner mehr — und das Bracket-Seeding spiegelt echte ' +
        'Leistung wider, nicht nur Wins.',
      tiers: [
        { tier: 'S', bonus: 4, label: 'Top-Pairings · höchster Schwierigkeitsgrad' },
        { tier: 'A', bonus: 3, label: 'Starkes Pairing · ein Level über Mittel' },
        { tier: 'B', bonus: 2, label: 'Solides Matchup' },
        { tier: 'C', bonus: 1, label: 'Standard-Pairing' },
        { tier: 'X', bonus: 0, label: 'Warm-Up · keine Bonuspunkte' },
      ],
    },
  },
];
