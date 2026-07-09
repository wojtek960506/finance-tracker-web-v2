import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';

import { Button } from '@ui';

type CollapsibleTriggerProps = {
  actualIsOpen: boolean;
  header: ReactNode;
  indicatorPosition: 'left' | 'right';
  triggerMode: 'split' | 'full-row';
  triggerClassName?: string;
  onToggle: () => void;
  contentId: string;
};

const ICON_CLASS_NAME = 'h-4 w-4 shrink-0 transition-transform duration-300 ease-out';

export const CollapsibleTrigger = ({
  actualIsOpen,
  header,
  indicatorPosition,
  triggerMode,
  triggerClassName,
  onToggle,
  contentId,
}: CollapsibleTriggerProps) => {
  const isIndicatorLeft = indicatorPosition === 'left';
  const isFullRowTrigger = triggerMode === 'full-row';
  const SplitTriggerIcon = isIndicatorLeft ? ChevronRight : ChevronLeft;
  const FullRowTriggerIcon = ChevronDown;
  const buttonProps = {
    type: 'button' as const,
    variant: 'ghost' as const,
    'aria-label': actualIsOpen ? 'Collapse menu' : 'Expand menu',
    'aria-expanded': actualIsOpen,
    'aria-controls': contentId,
    onClick: onToggle,
  };

  if (isFullRowTrigger) {
    return (
      <Button
        {...buttonProps}
        className={clsx(
          'w-full min-w-0',
          isIndicatorLeft ? '' : 'flex-row-reverse',
          triggerClassName,
        )}
      >
        <div
          className={clsx(
            'flex min-w-0 w-full items-center gap-2',
            isIndicatorLeft ? '' : 'flex-row-reverse',
          )}
        >
          <FullRowTriggerIcon
            className={clsx(ICON_CLASS_NAME, actualIsOpen && 'rotate-180')}
          />
          {header}
        </div>
      </Button>
    );
  }

  return (
    <div
      className={clsx(
        'flex w-full min-w-0 items-center',
        isIndicatorLeft ? '' : 'flex-row-reverse',
        triggerClassName,
      )}
    >
      <Button {...buttonProps}>
        <SplitTriggerIcon
          className={clsx(
            ICON_CLASS_NAME,
            actualIsOpen && (isIndicatorLeft ? 'rotate-90' : '-rotate-90'),
          )}
        />
      </Button>
      {header}
    </div>
  );
};
