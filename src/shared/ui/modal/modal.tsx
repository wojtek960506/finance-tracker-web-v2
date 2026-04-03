import { type ReactNode, type RefObject, useEffect, useRef } from 'react';

import { Card } from '../card';
import { getFocusableElements } from '../drawer/get-focusable-elements';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
  restoreFocusRef?: RefObject<HTMLElement | null>;
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  ariaLabel,
  restoreFocusRef,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;

    if (!wasOpen && isOpen) {
      const firstFocusableElement =
        getFocusableElements(panelRef.current)[0] ?? panelRef.current;

      firstFocusableElement?.focus();
    }

    if (wasOpen && !isOpen && restoreFocusRef) {
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-fg/50" onClick={onClose} />
      <div
        className="fixed inset-0 z-[111] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <Card
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          tabIndex={-1}
          className="w-full max-w-md gap-4 shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </Card>
      </div>
    </>
  );
};
