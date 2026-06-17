import { motion } from 'framer-motion';

/**
 * /datenschutz — DSGVO privacy policy.
 *
 * Covers every processor we actually use: GitHub Pages (hosting),
 * Cloudflare (worker + Turnstile), Stripe (payments), Resend (transactional
 * email), plus the waitlist KV + localStorage device-lock pattern.
 *
 * Owner-fillable address/phone are marked `[…]` — must be filled in before
 * go-live.
 */
export function DatenschutzPage() {
  return (
    <>
      <motion.section
        className="page-intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="wrap">
          <p className="rule">Legal</p>
          <h1 className="page-title">
            Datenschutz<span className="accent">.</span>
          </h1>
          <p className="page-lead">
            Diese Erklärung informiert dich über Art, Umfang und Zweck der
            Verarbeitung personenbezogener Daten auf{' '}
            <strong>ritmopadel.shop</strong> gemäß Datenschutz-Grundverordnung
            (DSGVO) und Bundesdatenschutzgesetz (BDSG).
          </p>
        </div>
      </motion.section>

      <section className="legal">
        <div className="wrap legal-wrap">
          <h2>1. Verantwortlicher</h2>
          <p>
            RITMO Padel<br />
            Ilie Felix Jesús Doni<br />
            [Straße + Hausnummer]<br />
            [PLZ + Ort], Deutschland<br />
            E-Mail:{' '}
            <a href="mailto:hallo@ritmopadel.de">hallo@ritmopadel.de</a>
          </p>

          <h2>2. Hosting</h2>
          <p>
            Diese Website wird über <strong>GitHub</strong> (GitHub, Inc.,
            88 Colin P Kelly Jr St, San Francisco, CA 94107, USA)
            ausgeliefert. Beim Aufruf werden technisch notwendige Daten
            verarbeitet (IP-Adresse, Zeitpunkt, abgerufene Ressource,
            Browser-User-Agent, Referrer). Rechtsgrundlage: Art. 6 Abs. 1
            lit. f DSGVO (berechtigtes Interesse am stabilen Betrieb der
            Website).
          </p>

          <h2>3. Server-Logfiles</h2>
          <p>
            Unsere API-Endpunkte (Wartelisten- und Ticket-Funktionen) werden
            auf <strong>Cloudflare Workers</strong> (Cloudflare, Inc., 101
            Townsend Street, San Francisco, CA 94107, USA) betrieben. Dabei
            verarbeitet Cloudflare:
          </p>
          <ul>
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit der Anfrage</li>
            <li>angefragte URL und HTTP-Methode</li>
            <li>HTTP-Statuscode und übertragene Datenmenge</li>
            <li>Browser-User-Agent und Referrer</li>
          </ul>
          <p>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Speicherdauer: in der
            Regel max. 14 Tage zu Sicherheits- und Diagnosezwecken.
            Cloudflare-Datenschutz:{' '}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              cloudflare.com/privacypolicy
            </a>
            .
          </p>

          <h2>4. Warteliste</h2>
          <p>
            Wenn du dich für ein Event auf die Warteliste setzt, verarbeiten
            wir folgende Daten:
          </p>
          <ul>
            <li>Vor- und Nachname</li>
            <li>E-Mail-Adresse</li>
            <li>Ticket-Wunsch (Spieler oder Zuschauer)</li>
            <li>IP-Adresse (zur Drosselung und Missbrauchsabwehr)</li>
            <li>Zeitpunkt der Eintragung</li>
          </ul>
          <p>
            <strong>Zweck:</strong> Information über den Verkaufsstart,
            Versand des Ticket-Kauf-Links sowie der Tickets.
            <br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
            (Einwilligung).
            <br />
            <strong>Speicherung:</strong> bis zum Abschluss des betreffenden
            Events und maximal 6 Monate danach. Du kannst deine Einwilligung
            jederzeit per Mail an{' '}
            <a href="mailto:hallo@ritmopadel.de">hallo@ritmopadel.de</a>{' '}
            widerrufen — wir löschen deine Daten dann unverzüglich.
          </p>
          <p>
            <strong>Interne Benachrichtigung:</strong> Zusätzlich erhält der
            Veranstalter (RITMO Padel) eine interne E-Mail mit deinem Eintrag,
            damit die Liste tagesaktuell verwaltet werden kann. Diese Mail
            wird ebenfalls über Resend (siehe Abschnitt 7) verschickt und
            nicht an Dritte weitergegeben.
          </p>

          <h2>5. Ticket-Verkauf via Stripe</h2>
          <p>
            Der Bezahlvorgang läuft über <strong>Stripe</strong> (Stripe
            Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal
            Dock, Dublin, Irland). An Stripe übermittelt werden: Name,
            E-Mail-Adresse, Land, Zahlungsdaten. Wir selbst sehen niemals
            Karten- oder Bankdaten — die Zahlungsabwicklung erfolgt
            ausschließlich auf stripe.com.
          </p>
          <p>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung
            und -erfüllung). Stripe-Datenschutz:{' '}
            <a
              href="https://stripe.com/de/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              stripe.com/de/privacy
            </a>
            .
          </p>

          <h2>6. Bot-Schutz via Cloudflare Turnstile</h2>
          <p>
            Vor dem Absenden des Ticket-Formulars wird Cloudflare Turnstile
            zur Bot-Erkennung eingebunden. Dabei werden Browser- und
            Verhaltenssignale anonymisiert ausgewertet. Tracking-Cookies
            werden nicht gesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
            (Schutz vor automatisiertem Missbrauch).
          </p>

          <h2>7. Transaktionale E-Mails</h2>
          <p>
            Bestellbestätigungen, Tickets sowie Wartelisten-Updates werden
            über <strong>Resend</strong> (Resend, Inc., 2261 Market Street
            #5039, San Francisco, CA 94114, USA) verschickt. Übermittelt
            werden: Empfänger-Name, E-Mail-Adresse, Inhalt der Nachricht.
          </p>
          <p>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bzw. lit. a DSGVO
            (bei Wartelisten-Updates). Resend-Datenschutz:{' '}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              resend.com/legal/privacy-policy
            </a>
            .
          </p>

          <h2>8. localStorage statt Tracking-Cookies</h2>
          <p>
            Wir setzen <strong>keine Tracking-Cookies</strong>, kein Analytics
            und keine Werbe-Pixel. Im Browser werden lediglich zwei Schlüssel
            im localStorage abgelegt:
          </p>
          <ul>
            <li>
              <code>cart</code> — dein Warenkorb für die Shop-Funktion
              (verbleibt lokal, wird nur beim Checkout an unseren Worker zur
              Preis-Verifikation übermittelt).
            </li>
            <li>
              <code>waitlist:&lt;event-id&gt;</code> — Merker, dass du dich
              bereits für die Warteliste eingetragen hast, damit das Formular
              dir nicht erneut angezeigt wird.
            </li>
          </ul>
          <p>
            Diese Daten verlassen dein Gerät nicht und enthalten keine
            personenbezogenen Informationen.
          </p>

          <h2>9. Drittland-Übermittlung</h2>
          <p>
            Einige der oben genannten Dienste (GitHub, Cloudflare, Stripe,
            Resend) haben Konzernsitz in den USA und können Daten in
            Drittländer übermitteln. Die Anbieter unterliegen entweder dem
            EU-US Data Privacy Framework oder es bestehen
            EU-Standardvertragsklauseln nach Art. 46 DSGVO.
          </p>

          <h2>10. Deine Rechte</h2>
          <p>Du hast jederzeit Anspruch auf:</p>
          <ul>
            <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>
              Widerruf einer erteilten Einwilligung, mit Wirkung für die
              Zukunft (Art. 7 Abs. 3 DSGVO)
            </li>
            <li>
              Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO) — z. B.
              beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA)
            </li>
          </ul>
          <p>
            Anfragen richtest du formlos an{' '}
            <a href="mailto:hallo@ritmopadel.de">hallo@ritmopadel.de</a>.
          </p>

          <h2>11. Datensicherheit</h2>
          <p>
            Die Übertragung erfolgt durchgängig verschlüsselt (TLS).
            Wartelisten- und Ticket-Daten werden in einem Cloudflare-KV-Store
            verarbeitet; Zahlungsabwicklung ausschließlich auf
            Stripe-Infrastruktur. Wir geben deine Daten nicht zu
            Werbezwecken weiter und verkaufen sie nicht.
          </p>

          <h2>12. Änderungen dieser Erklärung</h2>
          <p>
            Wir passen diese Datenschutzerklärung an, sobald wir neue
            Funktionen einführen oder sich gesetzliche Anforderungen ändern.
            Die jeweils aktuelle Fassung findest du hier auf{' '}
            <a href="/datenschutz">ritmopadel.shop/datenschutz</a>.
          </p>

          <p className="legal-stand">Stand: Juni 2026</p>
        </div>
      </section>
    </>
  );
}
