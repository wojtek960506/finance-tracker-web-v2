import clsx from 'clsx';
import { X } from 'lucide-react';
import { type ReactNode, type RefObject, useEffect, useRef } from 'react';

import { Button } from '@ui';

type DrawerProps = {
  isOpen: boolean;
  fromLeft: boolean;
  onClose: () => void;
  children: ReactNode;
  restoreFocusRef?: RefObject<HTMLElement | null>;
};

export const Drawer = ({
  isOpen,
  fromLeft,
  onClose,
  children,
  restoreFocusRef,
}: DrawerProps) => {
  const navRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;

    if (!wasOpen && isOpen) {
      const firstFocusableElement = navRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      firstFocusableElement?.focus();
    }

    if (wasOpen && !isOpen) {
      restoreFocusRef?.current?.focus();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, restoreFocusRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          'z-100 fixed inset-0 bg-fg/50 transition-opacity duration-300',
          `${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`,
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={clsx(
          'z-100 fixed flex flex-col top-0 h-full w-72 bg-bg shadow-lg transform ',
          'transition-transform duration-300',
          fromLeft ? 'left-0' : 'right-0',
          `${
            fromLeft
              ? isOpen
                ? 'translate-x-0'
                : '-translate-x-full'
              : isOpen
                ? 'translate-x-0'
                : 'translate-x-full'
          }`,
        )}
      >
        <div
          className={clsx(
            'flex p-2 h-[var(--topbar-h)] sm:h-[var(--topbar-h-sm)] border-b border-foreground',
            'min-h-[var(--topbar-h)] sm:min-h-[var(--topbar-h-sm)]',
            fromLeft ? 'justify-end' : 'justify-start',
          )}
        >
          <Button
            onClick={onClose}
            variant="ghost"
            className={fromLeft ? 'mx-2' : 'mx-1'}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav ref={navRef} className="px-4 py-2 overflow-y-auto h-full">
          {children}
        </nav>
      </div>
    </>
  );
};
