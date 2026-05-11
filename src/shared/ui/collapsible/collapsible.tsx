import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';

import { Button } from '@ui';

type CollapsibleProps = {
  header: ReactNode;
  indicatorPosition: 'left' | 'right';
  children: ReactNode;
  isInitiallyOpen?: boolean;
  triggerMode?: 'split' | 'full-row';
  contentInset?: 'default' | 'none';
  triggerClassName?: string;
  contentClassName?: string;
};

export const Collapsible = ({
  header,
  indicatorPosition,
  children,
  isInitiallyOpen,
  triggerMode = 'split',
  contentInset = 'default',
  triggerClassName,
  contentClassName,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen ?? false);
  const contentId = useId();

  const isIndicatorLeft = indicatorPosition === 'left';
  const isFullRowTrigger = triggerMode === 'full-row';
  const SplitTriggerIcon = isIndicatorLeft ? ChevronRight : ChevronLeft;
  const FullRowTriggerIcon = ChevronDown;

  // TODO maybe simplify conditions with some common elements
  return (
    <div>
      {isFullRowTrigger ? (
        <Button
          type="button"
          variant="ghost"
          aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className={clsx(
            'w-full',
            isIndicatorLeft ? '' : 'flex-row-reverse',
            triggerClassName,
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div
            className={clsx(
              'flex min-w-0 items-center gap-2',
              isIndicatorLeft ? '' : 'flex-row-reverse',
            )}
          >
            <FullRowTriggerIcon
              className={clsx(
                'h-4 w-4 shrink-0 transition-transform duration-300 ease-out',
                isOpen && 'rotate-180',
              )}
            />
            {header}
          </div>
        </Button>
      ) : (
        <div
          className={clsx(
            'flex w-full items-center',
            isIndicatorLeft ? '' : 'flex-row-reverse',
            triggerClassName,
          )}
        >
          <Button
            type="button"
            variant="ghost"
            aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={isOpen}
            aria-controls={contentId}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <SplitTriggerIcon
              className={clsx(
                'h-4 w-4 shrink-0 transition-transform duration-300 ease-out',
                isOpen && (isIndicatorLeft ? 'rotate-90' : '-rotate-90'),
              )}
            />
          </Button>
          {header}
        </div>
      )}
      <div
        id={contentId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={clsx(
          'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          contentInset === 'default' &&
            (isIndicatorLeft ? 'pl-10' : 'pr-10'),
        )}
      >
        <div
          className={clsx(
            'overflow-hidden',
            contentInset === 'default' && '-m-2 p-2',
            isOpen && contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
