import type { Category } from '../../lib/types';

type ChipValue = Category | 'all';

interface Props {
  active: ChipValue;
  onChange: (next: ChipValue) => void;
}

const CHIPS: Array<{ value: ChipValue; label: string }> = [
  { value: 'all',       label: 'Alle' },
  { value: 'schlaeger', label: 'Schläger' },
  { value: 'baelle',    label: 'Bälle' },
  { value: 'apparel',   label: 'Apparel' },
  { value: 'prints',    label: 'Prints' },
  { value: 'tech',      label: 'Smart Gear' },
];

export function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="filters" role="tablist" aria-label="Kategorie-Filter">
      {CHIPS.map((c) => (
        <button
          key={c.value}
          type="button"
          className={`chip-btn${active === c.value ? ' active' : ''}`}
          onClick={() => onChange(c.value)}
          aria-pressed={active === c.value}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
