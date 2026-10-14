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
  itemClassName?: string;
  capitalize?: boolean;
};

export const FilterPills = ({
  selected,
  onSelect,
  allLabel,
  allTestId,
  items,
  className,
  itemClassName,
  capitalize = false,
}: FilterPillsProps) => {
  return (
    <div className={clsx('flex flex-wrap items-center gap-1.5', className)}>
      {allLabel ? (
        <button
          type="button"
          data-testid={allTestId}
          className={clsx(
            'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
            'sm:px-4 sm:text-base',
            selected === 'all'
              ? 'bg-bt-primary text-bt-primary-subtle shadow-sm'
              : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-foreground',
            itemClassName,
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
            'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
            'sm:px-4 sm:text-base',
            capitalize && 'capitalize',
            selected === item.key
              ? 'bg-bt-primary text-bt-primary-subtle shadow-sm'
              : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-foreground',
            itemClassName,
          )}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
