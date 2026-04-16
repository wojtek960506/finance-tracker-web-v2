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
    const popupWidth = popupRect.width;

    const fitsHorizontally = (left: number) =>
      left >= VIEWPORT_MARGIN &&
      left + popupWidth <= window.innerWidth - VIEWPORT_MARGIN;

    const leftAligned = triggerRect.left;
    const rightAligned = triggerRect.right - popupWidth;
    const centered = (window.innerWidth - popupWidth) / 2;
    const maxLeft = window.innerWidth - VIEWPORT_MARGIN - popupWidth;

    let left = leftAligned;

    if (!fitsHorizontally(leftAligned)) {
      if (fitsHorizontally(rightAligned)) {
        left = rightAligned;
      } else {
        left = centered;
      }
    }

    left = Math.max(VIEWPORT_MARGIN, Math.min(left, maxLeft));
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
