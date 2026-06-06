import type { VariantGroup } from '../../lib/types';

interface Props {
  group: VariantGroup;
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * One option-row (e.g. "Größe" with S/M/L/XL).
 *
 * Renderer selection precedence:
 *   1. `group.displayAs` (explicit override)
 *   2. all options have `swatch`  → swatch buttons
 *   3. otherwise                  → chip buttons
 *
 * 'dropdown' mode renders a native <select> so we don't ship a custom
 * combobox just for "many options". Styling matches the Bauhaus
 * design system (sharp corners, dark surface).
 */
export function VariantPicker({ group, selected, onSelect }: Props) {
  const allSwatches = group.options.every((o) => !!o.swatch);
  const mode =
    group.displayAs ??
    (allSwatches ? 'swatches' : 'buttons');

  return (
    <div>
      <label className="opt-label">{group.label}</label>

      {mode === 'dropdown' ? (
        <div className="opt-dropdown-wrap">
          <select
            className="opt-dropdown"
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
            aria-label={group.label}
          >
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label ?? opt.value}
              </option>
            ))}
          </select>
          <svg
            className="opt-dropdown-arrow"
            viewBox="0 0 12 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M1 1l5 5 5-5" />
          </svg>
        </div>
      ) : (
        <div className="opt-row">
          {group.options.map((opt) => {
            const active = opt.value === selected;
            if (mode === 'swatches' && opt.swatch) {
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`opt-swatch sw-${opt.swatch}${active ? ' active' : ''}`}
                  aria-label={opt.label ?? opt.value}
                  onClick={() => onSelect(opt.value)}
                />
              );
            }
            return (
              <button
                key={opt.value}
                type="button"
                className={`opt-btn${active ? ' active' : ''}`}
                onClick={() => onSelect(opt.value)}
              >
                {opt.label ?? opt.value}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
