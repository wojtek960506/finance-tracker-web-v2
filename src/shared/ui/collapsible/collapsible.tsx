import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';

import { Button } from '@ui';

type CollapsibleProps = {
  header: ReactNode;
  indicatorPosition: 'left' | 'right';
  children: ReactNode;
  isInitiallyOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
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
  isOpen,
  onOpenChange,
  triggerMode = 'split',
  contentInset = 'default',
  triggerClassName,
  contentClassName,
}: CollapsibleProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(isInitiallyOpen ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const contentId = useId();
  const actualIsOpen = isOpen ?? uncontrolledIsOpen;
  const shouldApplyContentClassName = actualIsOpen || isClosing;

  const isIndicatorLeft = indicatorPosition === 'left';
  const isFullRowTrigger = triggerMode === 'full-row';
  const SplitTriggerIcon = isIndicatorLeft ? ChevronRight : ChevronLeft;
  const FullRowTriggerIcon = ChevronDown;

  const handleToggle = () => {
    const nextIsOpen = !actualIsOpen;
    setIsClosing(!nextIsOpen);

    if (isOpen === undefined) setUncontrolledIsOpen(nextIsOpen);
    onOpenChange?.(nextIsOpen);
  };

  // TODO maybe simplify conditions with some common elements
  return (
    <div className="min-w-0">
      {isFullRowTrigger ? (
        <Button
          type="button"
          variant="ghost"
          aria-label={actualIsOpen ? 'Collapse menu' : 'Expand menu'}
          aria-expanded={actualIsOpen}
          aria-controls={contentId}
          className={clsx(
            'w-full min-w-0',
            isIndicatorLeft ? '' : 'flex-row-reverse',
            triggerClassName,
          )}
          onClick={handleToggle}
        >
          <div
            className={clsx(
              'flex min-w-0 items-center gap-2 w-full',
              isIndicatorLeft ? '' : 'flex-row-reverse',
            )}
          >
            <FullRowTriggerIcon
              className={clsx(
                'h-4 w-4 shrink-0 transition-transform duration-300 ease-out',
                actualIsOpen && 'rotate-180',
              )}
            />
            {header}
          </div>
        </Button>
      ) : (
        <div
          className={clsx(
            'flex w-full min-w-0 items-center',
            isIndicatorLeft ? '' : 'flex-row-reverse',
            triggerClassName,
          )}
        >
          <Button
            type="button"
            variant="ghost"
            aria-label={actualIsOpen ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={actualIsOpen}
            aria-controls={contentId}
            onClick={handleToggle}
          >
            <SplitTriggerIcon
              className={clsx(
                'h-4 w-4 shrink-0 transition-transform duration-300 ease-out',
                actualIsOpen && (isIndicatorLeft ? 'rotate-90' : '-rotate-90'),
              )}
            />
          </Button>
          {header}
        </div>
      )}
      <div
        id={contentId}
        aria-hidden={!actualIsOpen}
        inert={!actualIsOpen}
        className={clsx(
          'grid min-w-0 overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
          actualIsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          contentInset === 'default' && (isIndicatorLeft ? 'pl-10' : 'pr-10'),
        )}
        onTransitionEnd={() => {
          if (!actualIsOpen) setIsClosing(false);
        }}
      >
        <div
          className={clsx(
            'min-w-0 overflow-hidden',
            contentInset === 'default' && '-m-2 p-2',
            shouldApplyContentClassName && contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
