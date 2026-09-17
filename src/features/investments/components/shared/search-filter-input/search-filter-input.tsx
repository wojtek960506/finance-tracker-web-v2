import clsx from 'clsx';
import { LoaderCircle, Search } from 'lucide-react';

import { Input } from '@shared/ui';

type SearchFilterInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isFetching?: boolean;
  ariaLabel?: string;
  className?: string;
};

export const SearchFilterInput = ({
  value,
  onChange,
  placeholder,
  isFetching,
  ariaLabel,
  className,
}: SearchFilterInputProps) => {
  return (
    <div className={clsx('relative w-full md:min-w-[220px] md:flex-1', className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-9 sm:pr-10"
        aria-label={ariaLabel || placeholder}
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
