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
      'Founders-Edition des RITMO DNA Cups. 22 Spieler:innen, 3 Courts, Americano-Gruppenphase mit anschließendem Knock-Out, Halbfinale und Grande Finale. Plätze 15–22 ziehen in die Courage Phase — niemand sitzt nur rum. 17:30 Kick the Doors, ab 23 Uhr Open End mit DJ Scoob live. Padel Haus, Ingolstadt.',
    tags: ['Founders Edition', 'RITMO DNA Cup', 'House Music', 'Sunset'],
    tickets: [
      { name: 'Spieler',   price: 39, capacity: 22 },
      {
        name: 'Zuschauer',
        price: 15,
        flag: 'Early Bird',
        note:
          'Early-Bird-Preis. Mögliche Überraschung am Eventabend — bei einer ' +
          'Preisanpassung haben Early-Bird-Holder eine kostenlose Upgrade-Option. ' +
          'Tipp: Sportschuhe und Padelschläger mitbringen, falls die Überraschung ' +
          'dich auf den Court bringt.',
      },
    ],
    salesStart: '2026-06-18',
    salesEnd:   '2026-07-17',
    ctaLabel: 'Ticket sichern',
    // ctaUrl: '<set when ticketing is live>',

    partner: { name: 'Padel Haus', web: 'https://padelhaus.de' },
    heroImageSrc: '/assets/events/sunset-hero.jpg',
    matchPosterSrc: '/assets/events/sunset-match-poster.jpg',

    longDesc: [
      'Der erste RITMO DNA Cup, Founders-Edition. 22 Spieler:innen auf drei ' +
      'Courts, von Kick the Doors um 17:30 bis Open End ab 23 Uhr. Premiere ' +
      'unseres Tournament-Formats und gleichzeitig Premiere für die ' +
      'Zusammenarbeit mit Padel Haus.',

      'Gespielt wird in vier Phasen: Americano-Gruppenphase auf allen drei ' +
      'Courts parallel, anschließend Knock-Out für die Top 14, dann Halbfinale ' +
      'Best of 3 und Grande Finale auf Court 1 unter Spotlight. Wer in der ' +
      'Gruppenphase nicht in die Top 14 schafft (Plätze 15–22), wechselt in ' +
      'die Courage Phase — eigenes Halbfinale, eigenes Finale, parallel zur ' +
      'Haupt-Schiene. Niemand sitzt nur rum.',

      'Drumherum: ANKOE & LNRT Ready Mix während des Turniers, ab 23 Uhr DJ ' +
      'Scoob live bis Open End. Holledauer Brez’nPizza und Aperol-Bar mit ' +
      'Padelé Spritz inklusive im Ticket. Spielmodi und Format-Details sind ' +
      'unten in der FAQ erklärt.',
    ],

    schedule: [
      { time: '17:30', title: 'Kick the Doors', note: 'Check-in, Warm-Up, Intro Turnierablauf' },
      { time: '18:00', title: 'Phase 1, Gruppenphase Americano' },
      { time: '20:00', title: 'Leaderboard-Auswertung' },
      { time: '20:10', title: 'Phase 2, Knock Out (12 → 6)' },
      { time: '21:00', title: 'Phase 3, Halbfinale' },
      { time: '22:00', title: 'Finals' },
      { time: '23:00', title: 'Open End', note: 'Siegerehrung, ANKOE & LNRT Ready Mix übergibt an DJ Scoob live, Food & Drinks' },
    ],

    program: [
      {
        phase: '01, Gruppenphase',
        details: [
          [
            '120 Minuten. 22 Spieler rotieren über ca. 6 Runden auf allen drei Courts.',
            'No Limits: Offene Punkte Wertung — 2 Angaben pro Kopf.',
            'Pausierende erhalten den Mittelwert der Runde.',
          ],
          [
            'Top 2 direktes Los zum Halbfinale, überspringen KO.',
            'Top 14 ziehen in die KO-Phase.',
            'Die letzten 8 gehen in die COURAGE Phase.',
          ],
        ],
      },
      {
        phase: '02, Knock-Out',
        details: [
          [
            '35 Minuten. Drei KO Matches.',
            'No Limits.',
          ],
          [
            'Je ein Sieger-Paar pro Match zieht ins Halbfinale.',
          ],
        ],
      },
      {
        phase: '03, DNA-Halbfinale & COURAGE-Halbfinale',
        details: [
          [
            '60 Minuten. Best of Three.',
            'Top 2 kommt dazu. DNA-Halbfinals auf Court 1 & 2.',
          ],
          [
            '30 Minuten jeweils. No Limits.',
            'COURAGE-Halbfinals auf Court 3.',
          ],
        ],
      },
      {
        phase: '04, RITMO Grande Finale & COURAGE Finale',
        details: [
          [
            '60–90 Minuten. Best of Three.',
            'RITMO DNA Grande Finale auf Court 1.',
            'COURAGE Finale auf Court 2.',
          ],
          [
            'Siegerehrung | Open End.',
          ],
        ],
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
        q: 'Was ist das Americano-Format?',
        a: 'Im Americano-Format spielen alle gegen viele: Über mehrere Runden ' +
           'rotieren Partner und Gegner, du bekommst pro Match neue Mitspieler:innen. ' +
           'Bis zu 108 verschiedene Paarungen sind möglich. Punkte zählen individuell ' +
           '— nicht das Team gewinnt, sondern du sammelst dein eigenes Konto. Perfekt ' +
           'für gemischte Niveaus, gemixte Communities und alle, die ohne festen ' +
           'Partner anreisen.',
      },
      {
        q: 'Was bedeutet "No Limits"?',
        a: 'No Limits = Punkte spielen ohne Sätze oder Games, einfach durchgespielt ' +
           'auf Zeit. Die Match-Uhr läuft (z.B. 20 Minuten), jeder Ballwechsel ist ' +
           'ein Punkt für eines der Teams. Wer am Ende mehr Punkte hat, gewinnt das ' +
           'Match. Vorteil: keine Match-Bälle-Dramaturgie, jede:r kommt zum Spielen, ' +
           'Zeit-Schedule bleibt stabil.',
      },
      {
        q: 'Was ist die Courage Phase?',
        a: 'Plätze 15–22 aus der Gruppenphase ziehen nach Phase 2 in die Courage ' +
           'Phase weiter — ein paralleles Bracket mit eigenem Halbfinale und Finale ' +
           'auf Court 1. So sitzt niemand nach der Gruppe nur rum: du spielst weiter, ' +
           'nur eben auf einer anderen Schiene. Das Courage Finale läuft parallel ' +
           'zum Grande Finale auf Court 1, beide unter Spotlight.',
      },
      {
        q: 'Was heißt Best of 3?',
        a: 'Klassisches Padel-Finale-Format: gespielt werden zwei gewonnene Sätze, ' +
           'maximal drei. Erst Hin- und Rückspiel (Satz 1 + Satz 2). Steht es 1:1, ' +
           'gibt es einen Decider-Satz. Sätze gehen bis 6 Games, Tiebreak bei 5:5.',
      },
      {
        q: 'Wie werden die Punkte eingetragen?',
        a: 'Neben jedem Court (Court 1, 2, 3) steht ein Tablet an der RITMO Refresh ' +
           'Bar. Nach jedem Ballwechsel oder Match tippt eine:r aus deinem Team kurz ' +
           'auf den Score-Button — fertig. Die Punkte landen sofort im Leaderboard. ' +
           'Du musst nichts mitschreiben, kein Zettel, kein App-Download. Das ' +
           'Schiedsrichter-Team ist während der Phasen vor Ort, falls etwas hakt.',
      },
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
           'Bis zu 108 verschiedene Paarungen möglich, 2 Angaben pro Match. ' +
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
        name: 'Foodtruck',
        tagline: 'Big & Small Food Items',
        description:
          'Wechselnder Foodtruck am Eventabend, vegetarisch + nicht-vegetarisch. ' +
          'Spieler-Tickets bekommen ein Big Food Item inklusive, Zuschauer-Tickets ' +
          'ein Small Food Item. Nachorder jederzeit möglich.',
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
      imageSrc: '/assets/events/dj-scoob.jpg',
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
