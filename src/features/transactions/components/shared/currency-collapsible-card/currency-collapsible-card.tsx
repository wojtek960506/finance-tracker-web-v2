import clsx from 'clsx';
import { type ReactNode } from 'react';

import { Card, Collapsible } from '@ui';

type CurrencyCollapsibleCardProps = {
  header: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  isInitiallyOpen?: boolean;
};

const DEFAULT_CARD_CLASS_NAME =
  'gap-0 rounded-2xl border-fg/15 bg-card-bg p-0 shadow-none sm:p-0';
const DEFAULT_TRIGGER_CLASS_NAME =
  'justify-between rounded-2xl border-0 p-3 sm:rounded-3xl sm:p-4';
const DEFAULT_CONTENT_CLASS_NAME = 'px-3 pb-3 sm:px-4 sm:pb-4';

export const CurrencyCollapsibleCard = ({
  header,
  children,
  isOpen,
  onOpenChange,
  className,
  triggerClassName,
  contentClassName,
  isInitiallyOpen,
}: CurrencyCollapsibleCardProps) => {
  return (
    <Card className={clsx(DEFAULT_CARD_CLASS_NAME, className)}>
      <Collapsible
        header={header}
        indicatorPosition="left"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isInitiallyOpen={isInitiallyOpen}
        triggerMode="full-row"
        contentInset="none"
        triggerClassName={clsx(DEFAULT_TRIGGER_CLASS_NAME, triggerClassName)}
        contentClassName={clsx(DEFAULT_CONTENT_CLASS_NAME, contentClassName)}
      >
        {children}
      </Collapsible>
    </Card>
  );
};
