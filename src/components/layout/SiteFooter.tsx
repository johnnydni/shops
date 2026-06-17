import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <div>© {new Date().getFullYear()} RITMO Padel. Made with ♥ in DACH.</div>
        <div className="foot-links">
          <a href="https://ritmopadel.de/" rel="noopener">ritmopadel.de</a>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
