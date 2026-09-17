import clsx from 'clsx';

export type FilterPillItem = {
  key: string;
  label: string;
};

type FilterPillsProps = {
  selected: string;
  onSelect: (key: string) => void;
  allLabel?: string;
  items: FilterPillItem[];
  className?: string;
};

export const FilterPills = ({
  selected,
  onSelect,
  allLabel,
  items,
  className,
}: FilterPillsProps) => {
  return (
    <div className={clsx('flex flex-wrap items-center gap-1', className)}>
      {allLabel ? (
        <button
          type="button"
          className={clsx(
            'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
            selected === 'all'
              ? 'bg-bt-primary text-bt-primary-fg'
              : 'bg-muted/50 text-text-muted hover:bg-muted',
          )}
          onClick={() => onSelect('all')}
        >
          {allLabel}
        </button>
      ) : null}
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={clsx(
            'rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors',
            selected === item.key
              ? 'bg-bt-primary text-bt-primary-fg'
              : 'bg-muted/50 text-text-muted hover:bg-muted',
          )}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
