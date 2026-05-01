import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

type LoadingStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export const LoadingState = ({
  title,
  description,
  className,
}: LoadingStateProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'flex flex-col items-center justify-center gap-3 text-center',
        className,
      )}
    >
      <div className={clsx(
        "flex size-14 items-center justify-center rounded-full border border-fg/10 bg-bg/70",
        "text-text-muted sm:size-16"
      )}>
        <LoaderCircle className="size-7 animate-spin sm:size-8" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold sm:text-lg">{title}</p>
        {description ? (
          <p className="text-sm text-text-muted sm:text-base">{description}</p>
        ) : null}
      </div>
    </div>
  );
};

