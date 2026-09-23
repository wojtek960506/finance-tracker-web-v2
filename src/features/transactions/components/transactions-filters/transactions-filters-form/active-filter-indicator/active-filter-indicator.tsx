import clsx from 'clsx';

type ActiveFilterIndicatorProps = {
  className?: string;
};

export const ActiveFilterIndicator = ({ className }: ActiveFilterIndicatorProps) => {
  return (
    <span
      className={clsx('size-1.5 shrink-0 rounded-full bg-bt-primary', className)}
      aria-hidden="true"
    />
  );
};
