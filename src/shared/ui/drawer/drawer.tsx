import clsx from 'clsx';
import { X } from 'lucide-react';
import { type ReactNode, type RefObject, useEffect, useRef } from 'react';

import { Button } from '@ui';

import { getFocusableElements } from './get-focusable-elements';

type DrawerProps = {
  isOpen: boolean;
  fromLeft: boolean;
  onClose: () => void;
  children: ReactNode;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  ariaLabel?: string;
};

export const Drawer = ({
  isOpen,
  fromLeft,
  onClose,
  children,
  restoreFocusRef,
  ariaLabel = 'Drawer',
}: DrawerProps) => {
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;

    if (!wasOpen && isOpen) {
      const firstFocusableElement =
        getFocusableElements(navRef.current)[0] ?? panelRef.current;

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
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(panelRef.current);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
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
        aria-hidden={!isOpen}
        inert={!isOpen}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
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
            aria-label="Close drawer"
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
