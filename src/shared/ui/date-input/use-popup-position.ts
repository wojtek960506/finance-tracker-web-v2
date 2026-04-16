import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type PopupPosition = {
  top: number;
  left: number;
};

type UsePopupPositionOptions = {
  isOpen: boolean;
};

const VIEWPORT_MARGIN = 16;
const OFFSET_FROM_TRIGGER = 8;

export const usePopupPosition = ({ isOpen }: UsePopupPositionOptions) => {
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const updatePopupPosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();

    const maxLeft = window.innerWidth - VIEWPORT_MARGIN - popupRect.width;
    const left = Math.max(VIEWPORT_MARGIN, Math.min(triggerRect.left, maxLeft));
    const top = Math.max(VIEWPORT_MARGIN, triggerRect.bottom + OFFSET_FROM_TRIGGER);

    setPopupPosition({ top, left });
  }, []);

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
      window.removeEventListener('scroll', handleViewportChange, { capture: true });
    };
  }, [isOpen, updatePopupPosition]);

  const resetPopupPosition = useCallback(() => {
    setPopupPosition(null);
  }, []);

  return {
    popupPosition,
    popupRef,
    resetPopupPosition,
    triggerRef,
  };
};
