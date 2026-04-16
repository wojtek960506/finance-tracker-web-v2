import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type PopupPosition = {
  top: number;
  left: number;
};

type UseDateInputPopupOptions = {
  disabled?: boolean;
  onOpen?: () => void;
};

const VIEWPORT_MARGIN = 16;
const OFFSET_FROM_TRIGGER = 8;

export const useDateInputPopup = ({
  disabled,
  onOpen,
}: UseDateInputPopupOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const closePicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updatePopupPosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();

    const maxLeft = window.innerWidth - VIEWPORT_MARGIN - popupRect.width;
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(triggerRect.left, maxLeft),
    );
    const top = Math.max(
      VIEWPORT_MARGIN,
      triggerRect.bottom + OFFSET_FROM_TRIGGER,
    );

    setPopupPosition({ top, left });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      closePicker();
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closePicker, isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePopupPosition();

    const handleViewportChange = () => {
      updatePopupPosition();
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { capture: true });

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, {
        capture: true,
      });
    };
  }, [isOpen, updatePopupPosition]);

  const openPicker = useCallback(() => {
    if (disabled) return;

    setPopupPosition(null);
    onOpen?.();
    setIsOpen(true);
  }, [disabled, onOpen]);

  const togglePicker = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      closePicker();
      return;
    }

    openPicker();
  }, [closePicker, disabled, isOpen, openPicker]);

  return {
    closePicker,
    isOpen,
    popupPosition,
    popupRef,
    togglePicker,
    triggerRef,
  };
};
