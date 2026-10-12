import clsx from 'clsx';
import type { ElementType, ReactNode } from 'react';

export type NetWorthBreakdownRowProps = {
  icon: ElementType;
  iconClass?: string;
  label: ReactNode;
  labelClass?: string;
  value: ReactNode;
  valueClass?: string;
  hasBorder?: boolean;
  className?: string;
};

export const NetWorthBreakdownRow = ({
  icon: Icon,
  iconClass,
  label,
  labelClass = 'text-text-muted',
  value,
  valueClass = 'font-semibold text-foreground',
  className,
}: NetWorthBreakdownRowProps) => {
  return (
    <div className={clsx('flex items-center justify-between text-sm gap-1', className)}>
      <div className={clsx('flex items-center gap-2', iconClass)}>
        <Icon className="size-4 shrink-0" />
        <span className={labelClass}>{label}</span>
      </div>
      <span className={clsx('shrink-0', valueClass)}>{value}</span>
    </div>
  );
};
