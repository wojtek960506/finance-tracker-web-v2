import clsx from 'clsx';
import { LoaderCircle, Search } from 'lucide-react';

import { Input } from '../input';

export type SearchFilterInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isFetching?: boolean;
  ariaLabel?: string;
  className?: string;
  inputClassName?: string;
  dataTestId?: string;
};

export const SearchFilterInput = ({
  value,
  onChange,
  placeholder,
  isFetching,
  ariaLabel,
  className,
  inputClassName,
  dataTestId,
}: SearchFilterInputProps) => {
  return (
    <div className={clsx('relative w-full', className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx('w-full pr-9 sm:pr-10', inputClassName)}
        aria-label={ariaLabel || placeholder}
        data-testid={dataTestId}
      />
      {isFetching ? (
        <LoaderCircle
          className={clsx(
            'pointer-events-none absolute right-3 top-1/2 size-4',
            '-translate-y-1/2 animate-spin text-text-muted',
          )}
        />
      ) : (
        <Search
          className={clsx(
            'pointer-events-none absolute right-3 top-1/2 size-4',
            '-translate-y-1/2 text-text-muted',
          )}
        />
      )}
    </div>
  );
};
