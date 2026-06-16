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
    title: 'RITMO X Padel Haus, Summer Sunset Special',
    subtitle: 'RITMO DNA Cup, Founders Edition',
    date: '2026-07-18',
    venue: 'Padel Haus',
    location: 'Ingolstadt',
    shortDesc:
      'Gruppenphase im Americano-Format (No Limits, 108 Paarungen, 2 Angaben pro Kopf, alle 3 Courts parallel). Top 14 ziehen in die KO-Phase, Plätze 15–22 in die Courage Phase. Halbfinale Best of 3 (Court 2+3) parallel zum Courage-Halbfinale auf Court 1. Finals ab 22 Uhr: RITMO Grande Finale auf Court 1, Courage Finale auf Court 2, beide Best of 3 unter Spotlight. Niemand sitzt nur rum. 17:30 Kick the Doors, ab 23 Uhr Open End. ANKOE & LNRT Ready Mix, danach DJ Scoob live. Bei Padel Haus in Ingolstadt.',
    tags: ['Founders Edition', 'RITMO DNA Cup', 'House Music', 'Sunset'],
    tickets: [
      { name: 'Spieler',   price: 39, capacity: 22 },
      {
        name: 'Zuschauer',
        price: 15,
        flag: 'Early Bird',
        note:
          'Early-Bird-Preis. Mögliche Überraschung am Eventabend — bei einer ' +
          'Preisanpassung haben Early-Bird-Holder eine kostenlose Upgrade-Option.',
      },
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
      'Padel Haus. 22 Spieler:innen, drei Courts, von Kick the Doors um 17:30 ' +
      'bis Open End ab 23 Uhr.',

      'Phase 1, Gruppenphase im Americano-Format: 22 Spieler:innen, rotierende ' +
      'Partner, alle drei Courts parallel — 108 verschiedene Paarungen über ' +
      '~6 Runden, 2 Angaben pro Kopf, offene Punkte-Wertung (No Limits, keine ' +
      'Sätze, keine Games — nur Punkte). Dein Match siehst du am Tablet neben ' +
      'der RITMO Refresh Bar deines Courts. Wer pausiert, bekommt automatisch ' +
      'den Mittelwert der Punkte aus der laufenden Runde gutgeschrieben — niemand ' +
      'verliert durch eine Pause. 120 Minuten am Stück.',

      'Phase 2, Knock Out: Top 14 ziehen weiter. Plätze 3–14 (12 Spieler:innen) ' +
      'spielen auf allen drei Courts parallel — Court 3: Plätze 3+14 vs 4+13, ' +
      'Court 2: 5+12 vs 6+11, Court 1: 7+9 vs 8+10. Je 4 Spieler:innen pro Match, ' +
      'No Limits, 35 Minuten — je 2 Sieger ziehen ins Halbfinale. Die Top 2 ' +
      'aus der Gruppe haben Bye und warten in der Refresh Bar. Die Plätze 15–22 ' +
      'wechseln in die Courage Phase und sitzen Phase 2 aus.',

      'Phase 3, Halbfinale (60 Minuten): Auf Court 2 + 3 läuft das DNA-Halbfinale ' +
      'im Best-of-3-Format — Match 1 mit #1 (Bye) + 3 KO-Sieger:innen, Match 2 ' +
      'mit #2 (Bye) + 3 KO-Sieger:innen. Parallel auf Court 1 das Courage-Halbfinale: ' +
      'die 8 aus den Plätzen 15–22 spielen nacheinander zwei Matches à 4 Spieler:innen, ' +
      'je 30 Minuten No Limits.',

      'Ab 22 Uhr die Finals, beide Best of 3 unter Spotlight: das RITMO Grande ' +
      'Finale auf Court 1, parallel das Courage Finale auf Court 2. ' +
      'Anschließend ab 23 Uhr Open End: Siegerehrung, ANKOE & LNRT Ready Mix ' +
      'übergibt an DJ Scoob live, Food & Drinks bis die Energie geht.',
    ],

    schedule: [
      { time: '17:30', title: 'Kick the Doors',                    note: 'Check-in, Warm-Up, Intro Turnierablauf' },
      { time: '18:00', title: 'Phase 1, Gruppenphase Americano',   note: '22 Spieler:innen, rotierende Partner, alle 3 Courts parallel, 108 Paarungen, 2 Angaben pro Kopf, No Limits, 120 min' },
      { time: '20:00', title: 'Leaderboard-Auswertung',            note: 'Top 14 ins KO, Top 2 BYE bis Halbfinale, Plätze 15–22 wechseln in die Courage Phase' },
      { time: '20:10', title: 'Phase 2, Knock Out (12 → 6)',       note: '3 Matches parallel — Court 3: 3+14 vs 4+13, Court 2: 5+12 vs 6+11, Court 1: 7+9 vs 8+10, je 4 Spieler:innen, No Limits, 35 min' },
      { time: '21:00', title: 'Phase 3, Halbfinale',               note: 'DNA Halbfinale Best of 3 auf Court 2+3 (Match 1: #1 + 3 KO-Sieger, Match 2: #2 + 3 KO-Sieger), parallel Courage-Halbfinale auf Court 1 (2× 30 min No Limits), 60 min' },
      { time: '22:00', title: 'Finals',                            note: 'RITMO Grande Finale Best of 3 auf Court 1 (Spotlight), parallel Courage Finale Best of 3 auf Court 2 (Spotlight), Court 3 ruht' },
      { time: '23:00', title: 'Open End',                          note: 'Siegerehrung, ANKOE & LNRT Ready Mix übergibt an DJ Scoob live, Food & Drinks' },
    ],

    program: [
      {
        phase: '01, Gruppenphase Americano (Court 1 + 2 + 3)',
        details:
          '22 Spieler:innen, rotierende Partner auf allen drei Courts parallel — ' +
          '108 verschiedene Paarungen über ~6 Runden, 2 Angaben pro Kopf. Offene ' +
          'Punkte-Wertung (No Limits, keine Sätze, keine Games — nur Punkte). ' +
          'Pausierende einer Runde bekommen automatisch den Mittelwert der Punkte ' +
          'aus der laufenden Runde gutgeschrieben — niemand verliert durch eine ' +
          'Pause. Dein nächstes Match siehst du am Tablet neben der RITMO Refresh ' +
          'Bar deines Courts. 120 Minuten am Stück. Top 14 ziehen weiter, ' +
          'Plätze 15–22 wechseln in die Courage Phase.',
      },
      {
        phase: '02, Knock Out (Court 1 + 2 + 3)',
        details:
          'Plätze 3–14 (12 Spieler:innen) spielen drei KO-Matches parallel — ' +
          'Court 3: Plätze 3+14 vs 4+13, Court 2: 5+12 vs 6+11, Court 1: 7+9 vs 8+10. ' +
          'Je 4 Spieler:innen pro Match, No Limits, 35 Minuten. Je 2 Sieger:innen ' +
          'ziehen ins DNA-Halbfinale. Die Top 2 (#1, #2) haben Bye und warten in ' +
          'der Refresh Bar. Plätze 15–22 sitzen Phase 2 aus.',
      },
      {
        phase: '03, Halbfinale & Courage-Halbfinale',
        details:
          'DNA-Halbfinale Best of 3 parallel auf Court 2 + 3: Match 1 mit #1 (Bye) ' +
          '+ 3 KO-Sieger:innen, Match 2 mit #2 (Bye) + 3 KO-Sieger:innen — die ' +
          'jeweiligen Sieger ziehen ins Grande Finale. Parallel auf Court 1 das ' +
          'Courage-Halbfinale: die 8 Spieler:innen aus den Plätzen 15–22 spielen ' +
          'zwei Matches nacheinander à 4 Spieler:innen, je 30 Minuten No Limits — ' +
          'die 4 Sieger:innen ziehen ins Courage Finale. 60 Minuten gesamt.',
      },
      {
        phase: '04, RITMO Grande Finale + Courage Finale',
        details:
          'Die Finals laufen parallel unter Spotlight: RITMO Grande Finale auf ' +
          'Court 1 (Top 4 aus DNA-Halbfinale, Best of 3) und Courage Finale auf ' +
          'Court 2 (Top 4 aus Courage-Halbfinale, Best of 3). Court 3 ruht. ' +
          'Anschließend ab 23 Uhr Open End: Siegerehrung, Musik-Übergabe von ' +
          'ANKOE & LNRT zum DJ-Scoob-Live-Set, Food & Drinks bis die Energie geht.',
      },
    ],

    venueInfo: {
      name: 'Padel Haus',
      address: 'Ingolstadt, Standort wird mit Ticket bestätigt',
      web:     'https://padel-haus.de',
      blurb:
        'Padel Haus in Ingolstadt ist eine der modernsten ' +
        'Padel-Anlagen Süddeutschlands. Drei Premium-Courts,' +
        'Sound-System für die passenden Padel Vibes., ' +
        'Genau der Ort, an dem ein Sunset-Cup hingehört.',
      imageSrc: '/assets/events/sunset-court.jpg',
    },

    faq: [
      {
        q: 'Brauche ich einen Doppel-Partner?',
        a: 'Nein — du kannst dich allein anmelden. Das Turnier läuft im Americano-Format: ' +
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
        a: 'PHASE 0, KICK THE DOORS (17:30): Check-in, Warm-Up, Intro zum Turnierablauf.' +
           '\n\n' +
           'PHASE 1, GRUPPENPHASE AMERICANO (18:00–20:00, alle 3 Courts parallel): ' +
           '22 Spieler:innen rotieren über ~6 Runden Partner und Gegner. Offene Punkte-' +
           'Wertung (No Limits) — keine Sätze, keine Games, nur die Gesamtpunkte zählen. ' +
           '108 verschiedene Paarungen sind möglich, jede:r hat 2 Angaben pro Match. ' +
           'Dein nächstes Match siehst du am Tablet neben der RITMO Refresh Bar deines ' +
           'Courts. ' +
           'Pausen-Fairness: Wer eine Runde aussetzen muss (mit 22 Spielern auf 3 Courts ' +
           'sitzen pro Runde 10 Personen), bekommt automatisch den Mittelwert der in ' +
           'dieser Runde erzielten Punkte gutgeschrieben — niemand verliert durch eine Pause. ' +
           'Zusatz: Jedes Match wird per RITMO DNA in einen Match-Tier eingeordnet ' +
           '(S/A/B/C/X) — gewinnst du ein höher-tieriges Match, bekommst du Bonus-Punkte. ' +
           'Details unten in der "Match-Tier"-Sektion.' +
           '\n\n' +
           'LEADERBOARD-AUSWERTUNG (20:00, 10 min): Punkte werden zusammengezählt. Top 14 ' +
           'ziehen ins KO, Top 2 (#1, #2) bekommen Bye direkt ins Halbfinale, Plätze 15–22 ' +
           'wechseln in die Courage Phase und sitzen Phase 2 aus.' +
           '\n\n' +
           'PHASE 2, KNOCK OUT (20:10–20:45, alle 3 Courts parallel, 35 min): Plätze 3–14 ' +
           'spielen drei Matches parallel — Court 3: Plätze 3+14 vs 4+13, Court 2: 5+12 vs 6+11, ' +
           'Court 1: 7+9 vs 8+10. Je 4 Spieler:innen pro Match, No Limits. Aus jedem Match ' +
           'ziehen 2 Sieger:innen ins Halbfinale.' +
           '\n\n' +
           'PHASE 3, HALBFINALE (21:00–22:00, 60 min): DNA-Halbfinale Best of 3 auf Court 2+3 ' +
           '— Match 1 mit #1 (Bye) + 3 KO-Sieger:innen, Match 2 mit #2 (Bye) + 3 KO-Sieger:innen. ' +
           'Die Sieger ziehen ins Grande Finale. Parallel auf Court 1 das Courage-Halbfinale: ' +
           'die 8 Spieler:innen aus den Plätzen 15–22 spielen zwei Matches nacheinander à ' +
           '4 Spieler:innen, je 30 Minuten No Limits. Die 4 Sieger:innen ziehen ins Courage Finale.' +
           '\n\n' +
           'FINALS (ab 22:00, beide Best of 3 unter Spotlight): RITMO Grande Finale auf ' +
           'Court 1 (Top 4 aus DNA-Halbfinale, klassisches Padel-Finale-Format — zwei ' +
           'gewonnene Sätze entscheiden, dritter Satz wenn 1:1). Parallel Courage Finale auf ' +
           'Court 2 (Top 4 aus Courage-Halbfinale, gleiches Format). Court 3 ruht.' +
           '\n\n' +
           'OPEN END (ab 23:00): Siegerehrung, ANKOE & LNRT Ready Mix übergibt an DJ Scoob ' +
           'live, Food & Drinks bis die Energie geht.',
      },
      {
        q: 'Was ist im Spieler-Ticket enthalten?',
        a: 'Turnier-Teilnahme (Gruppenphase + KO oder Courage Phase, abhängig vom ' +
           'Abschneiden in der Gruppe), Court-Zeit, Welcome-Drink, Refresh Bar, After-Party ' +
           'und Siegerehrung. Jede:r Spieler:in bekommt garantiert mehrere Matches.',
      },
      {
        q: 'Was ist im Zuschauer-Ticket enthalten?',
        a: 'Eintritt ab 17:30 (Kick the Doors), Welcome-Drink, Zugang zur Sunset Session ' +
           'und After-Party ab 23 Uhr Open End. Weitere Drinks und Food separat.',
      },
      {
        q: 'Wo werden die Tickets verkauft?',
        a: 'Der Ticketverkauf läuft über Playtomic. Sobald der Verkauf startet, ' +
           'findest du den Link hier auf der Event-Seite und in der ' +
           'Wartelisten-Bestätigungsmail. Wartelisten-Holder werden bevorzugt ' +
           'benachrichtigt, bevor der allgemeine Verkauf live geht.',
      },
      {
        q: 'Stornierung möglich?',
        a: 'Bis 7 Tage vor Event: volle Rückerstattung. Danach übertragbar an eine ' +
           'andere Person, aber nicht erstattbar.',
      },
      {
        q: 'Wie komme ich hin?',
        a: 'Padel Haus liegt in Ingolstadt — direkt an der A9 erreichbar, ' +
           'Parkplätze auf dem Gelände. Mit dem Zug: Bahnhof Ingolstadt, dann ca. 15 Minuten ' +
           'mit dem Taxi. Genaue Adresse und Anfahrtsweg kommen mit der Ticket-Bestätigung.',
      },
    ],

    /* ───────── Verpflegung / Proviant ───────── */
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
        name: 'Holledauer Raut’n Gold Brez’nPizza',
        tagline: 'Breznpizza-Stand',
        description:
          'Holledauer Brez’nPizza in zwei Größen — knusprige Laugen-Basis, ' +
          'belegt mit Klassikern (auch vegetarisch). Spieler-Tickets bekommen ' +
          'eine große Brez’nPizza, Zuschauer-Tickets eine kleine — beide ' +
          'inklusive. Open für Nachorder.',
        imageSrc: '/assets/events/sunset-bbq.jpg',
      },
      {
        name: 'Aperol Bar',
        tagline: 'Spritz, Signature',
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
      djName: 'ANKOE & LNRT, DJ SCOOB',
      setTitle: 'Ready Mix & Live Set',
      description:
        'ANKOE und LNRT legen einen eigens für das Event produzierten Ready Mix auf — ' +
        'Sunset-Vibes zur Gruppenphase, Tempo-Anstieg fürs Halbfinale, Festival-Drop ' +
        'zu den Finals. Soundtrack, der mit dem Turnier wächst.',
      followUp:
        'Ab 23 Uhr übernimmt DJ Scoob live — tiefer, deeper, dancefloor-tauglich, ' +
        'Open End. Padel Haus wird zum Club.',
      imageSrc: '/assets/events/sunset-dj.jpg',
    },

    /* ───────── Scoring, RITMO Match Tiers ───────── */
    scoring: {
      title: 'RITMO Match Tiers',
      description:
        'In der Gruppenphase werden alle Matches per RITMO DNA in fünf Tiers ' +
        'eingeordnet — basierend auf den Spielstilen der gepaarten Spieler:innen. ' +
        'Deinen Spielstil findest du im DNA-Quiz heraus (Link am Ende dieser Sektion). ' +
        'Gewinnst du ein höher-tieriges Match, bekommst du Extra-Punkte aufs ' +
        'Gesamtkonto. So zählen Siege gegen starke Gegner mehr — und das Bracket-' +
        'Seeding spiegelt echte Leistung wider, nicht nur Wins.',
      tiers: [
        { tier: 'S', bonus: 4, label: 'Top-Pairings, höchster Schwierigkeitsgrad' },
        { tier: 'A', bonus: 3, label: 'Starkes Pairing, ein Level über Mittel' },
        { tier: 'B', bonus: 2, label: 'Solides Matchup' },
        { tier: 'C', bonus: 1, label: 'Standard-Pairing' },
        { tier: 'X', bonus: 0, label: 'Warm-Up, keine Bonuspunkte' },
      ],
    },
  },
];
