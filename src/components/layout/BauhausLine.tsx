/** 5-color Bauhaus stripe — sits at the very bottom of every page. */
export function BauhausLine() {
  return (
    <div className="bauhausline" aria-hidden="true">
      <span className="a" />
      <span className="b" />
      <span className="c" />
      <span className="d" />
      <span className="e" />
    </div>
  );
}
