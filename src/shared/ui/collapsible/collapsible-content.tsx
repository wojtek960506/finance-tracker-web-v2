import clsx from 'clsx';
import { type ReactNode } from 'react';

type CollapsibleContentProps = {
  actualIsOpen: boolean;
  isClosing: boolean;
  contentId: string;
  contentInset: 'default' | 'none';
  isIndicatorLeft: boolean;
  contentClassName?: string;
  children: ReactNode;
  onTransitionEnd: () => void;
};

export const CollapsibleContent = ({
  actualIsOpen,
  isClosing,
  contentId,
  contentInset,
  isIndicatorLeft,
  contentClassName,
  children,
  onTransitionEnd,
}: CollapsibleContentProps) => (
  <div
    id={contentId}
    aria-hidden={!actualIsOpen}
    inert={!actualIsOpen}
    className={clsx(
      'grid min-w-0 overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
      actualIsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      contentInset === 'default' && (isIndicatorLeft ? 'pl-10' : 'pr-10'),
    )}
    onTransitionEnd={onTransitionEnd}
  >
    <div
      className={clsx(
        'min-w-0 overflow-hidden',
        contentInset === 'default' && '-m-2 p-2',
        (actualIsOpen || isClosing) && contentClassName,
      )}
    >
      {children}
    </div>
  </div>
);
