export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <div>© {new Date().getFullYear()} RITMO Padel. Made with ♥ in DACH.</div>
        <div>
          <a href="https://ritmopadel.de/" rel="noopener">ritmopadel.de</a>
          &nbsp;
          <a href="https://ritmopadel.de/#impressum">Impressum</a>
        </div>
      </div>
    </footer>
  );
}
