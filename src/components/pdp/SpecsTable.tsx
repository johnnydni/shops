import type { SpecRow } from '../../lib/types';

interface Props {
  rows: SpecRow[];
  heading?: string;
  headingAccent?: string;
  intro?: string;
}

/** Tech-specs section with a 2-column intro+table layout. */
export function SpecsTable({
  rows,
  heading = 'Tech',
  headingAccent = 'Specs',
  intro = 'Alle harten Zahlen — auf einen Blick.',
}: Props) {
  return (
    <section className="specs">
      <div className="wrap">
        <div className="specs-grid">
          <div className="specs-side">
            <h2>
              {heading}
              <br />
              <span className="accent">{headingAccent}</span>.
            </h2>
            <p>{intro}</p>
          </div>
          <table className="spec-table">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <th>{r.label}</th>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
