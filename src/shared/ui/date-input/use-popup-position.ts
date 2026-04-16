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
const CENTERED_SMALL_SCREEN_MAX_WIDTH = 399;

export const usePopupPosition = ({ isOpen }: UsePopupPositionOptions) => {
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const updatePopupPosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const popupWidth = popupRect.width;
    const isCenteredSmallScreen =
      window.innerWidth <= CENTERED_SMALL_SCREEN_MAX_WIDTH;
    const viewportMargin = isCenteredSmallScreen ? 0 : VIEWPORT_MARGIN;

    const fitsHorizontally = (left: number) =>
      left >= viewportMargin &&
      left + popupWidth <= window.innerWidth - viewportMargin;

    const leftAligned = triggerRect.left;
    const rightAligned = triggerRect.right - popupWidth;
    const centered = (window.innerWidth - popupWidth) / 2;
    const maxLeft = window.innerWidth - viewportMargin - popupWidth;

    let left = isCenteredSmallScreen ? centered : leftAligned;

    if (!isCenteredSmallScreen && !fitsHorizontally(leftAligned)) {
      if (fitsHorizontally(rightAligned)) {
        left = rightAligned;
      } else {
        left = centered;
      }
    }

    left = Math.max(viewportMargin, Math.min(left, maxLeft));
    const top = Math.max(viewportMargin, triggerRect.bottom + OFFSET_FROM_TRIGGER);

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
