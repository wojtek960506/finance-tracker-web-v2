import clsx from 'clsx';

export type FilterPillItem = {
  key: string;
  label: string;
  testId?: string;
};

type FilterPillsProps = {
  selected: string;
  onSelect: (key: string) => void;
  allLabel?: string;
  allTestId?: string;
  items: FilterPillItem[];
  className?: string;
  capitalize?: boolean;
};

export const FilterPills = ({
  selected,
  onSelect,
  allLabel,
  allTestId,
  items,
  className,
  capitalize = false,
}: FilterPillsProps) => {
  return (
    <div className={clsx('flex flex-wrap items-center gap-1', className)}>
      {allLabel ? (
        <button
          type="button"
          data-testid={allTestId}
          className={clsx(
            'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
            selected === 'all'
              ? 'bg-bt-primary text-bt-primary-fg shadow-sm'
              : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-foreground',
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
          data-testid={item.testId}
          className={clsx(
            'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
            capitalize && 'capitalize',
            selected === item.key
              ? 'bg-bt-primary text-bt-primary-fg shadow-sm'
              : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-foreground',
          )}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
