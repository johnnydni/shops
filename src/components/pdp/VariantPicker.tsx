import type { VariantGroup } from '../../lib/types';

interface Props {
  group: VariantGroup;
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * One option-row (e.g. "Größe" with S/M/L/XL). Switches between
 * button-style and swatch-style based on whether the first option
 * specifies a swatch color.
 */
export function VariantPicker({ group, selected, onSelect }: Props) {
  const isSwatches = group.options.every((o) => !!o.swatch);
  return (
    <div>
      <label className="opt-label">{group.label}</label>
      <div className="opt-row">
        {group.options.map((opt) => {
          const active = opt.value === selected;
          if (isSwatches && opt.swatch) {
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
    </div>
  );
}
