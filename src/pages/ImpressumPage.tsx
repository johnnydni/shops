import { motion } from 'framer-motion';

/**
 * /impressum — German legal notice per §5 TMG and §18 MStV.
 *
 * Owner-fillable fields are marked with `[…]` placeholders. They MUST be
 * completed with real data before go-live (address, USt-ID, optional phone).
 */
export function ImpressumPage() {
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
            Impressum<span className="accent">.</span>
          </h1>
          <p className="page-lead">
            Angaben gemäß § 5 TMG und § 18 Abs. 2 Medienstaatsvertrag (MStV).
          </p>
        </div>
      </motion.section>

      <section className="legal">
        <div className="wrap legal-wrap">
          <h2>Anbieter</h2>
          <p>
            RITMO Padel<br />
            Ilie Felix Jesús Doni<br />
            [Straße + Hausnummer]<br />
            [PLZ + Ort]<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:hallo@ritmopadel.de">hallo@ritmopadel.de</a><br />
            Telefon: [optional, kann entfallen]<br />
            Web: <a href="https://ritmopadel.shop">ritmopadel.shop</a>
          </p>

          <h2>Vertretungsberechtigte Person</h2>
          <p>Ilie Felix Jesús Doni</p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Ilie Felix Jesús Doni<br />
            Anschrift wie oben.
          </p>

          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
            {' '}[USt-IdNr. eintragen, sofern vorhanden — sonst Hinweis
            „Kleinunternehmer gemäß § 19 UStG, keine Umsatzsteuer ausgewiesen"].
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse findest du oben im Impressum.
          </p>

          <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
            gespeicherte fremde Informationen zu überwachen oder nach
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
            Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
            hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
            ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
            möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die
            Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
            wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
            überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
            Verlinkung nicht erkennbar.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
            der schriftlichen Zustimmung des jeweiligen Autors bzw.
            Erstellers. Downloads und Kopien dieser Seite sind nur für den
            privaten, nicht kommerziellen Gebrauch gestattet.
          </p>

          <p className="legal-stand">Stand: Juni 2026</p>
        </div>
      </section>
    </>
  );
}
