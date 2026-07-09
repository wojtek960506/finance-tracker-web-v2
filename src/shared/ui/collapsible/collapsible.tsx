import { type ReactNode, useId, useState } from 'react';

import { CollapsibleContent } from './collapsible-content';
import { CollapsibleTrigger } from './collapsible-trigger';

type CollapsibleProps = {
  header: ReactNode;
  indicatorPosition: 'left' | 'right';
  children: ReactNode;
  isInitiallyOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  triggerMode?: 'split' | 'full-row';
  contentInset?: 'default' | 'none';
  className?: string;
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
  className,
  triggerClassName,
  contentClassName,
}: CollapsibleProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(isInitiallyOpen ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const contentId = useId();
  const actualIsOpen = isOpen ?? uncontrolledIsOpen;
  const isIndicatorLeft = indicatorPosition === 'left';

  const handleToggle = () => {
    const nextIsOpen = !actualIsOpen;
    setIsClosing(!nextIsOpen);

    if (isOpen === undefined) setUncontrolledIsOpen(nextIsOpen);
    onOpenChange?.(nextIsOpen);
  };

  return (
    <div className={className ? `min-w-0 ${className}` : 'min-w-0'}>
      <CollapsibleTrigger
        actualIsOpen={actualIsOpen}
        header={header}
        indicatorPosition={indicatorPosition}
        triggerMode={triggerMode}
        triggerClassName={triggerClassName}
        onToggle={handleToggle}
        contentId={contentId}
      />
      <CollapsibleContent
        actualIsOpen={actualIsOpen}
        isClosing={isClosing}
        contentId={contentId}
        contentInset={contentInset}
        isIndicatorLeft={isIndicatorLeft}
        contentClassName={contentClassName}
        onTransitionEnd={() => {
          if (!actualIsOpen) setIsClosing(false);
        }}
      >
        {children}
      </CollapsibleContent>
    </div>
  );
};
