import { useCallback } from 'react';

import { usePicker } from './use-picker';
import { usePopupPosition } from './use-popup-position';

type UseDateInputPopupOptions = {
  disabled?: boolean;
  onOpen?: () => void;
};

export const useDateInputPopup = ({ disabled, onOpen }: UseDateInputPopupOptions) => {
  const { closePicker, isOpen, togglePicker } = usePicker({
    disabled,
    onOpen,
  });
  const { popupPosition, popupRef, resetPopupPosition, triggerRef } = usePopupPosition({
    isOpen,
  });

  const togglePopup = useCallback(() => {
    if (!isOpen) {
      resetPopupPosition();
    }

    togglePicker();
  }, [isOpen, resetPopupPosition, togglePicker]);

  return {
    closePicker,
    isOpen,
    popupPosition,
    popupRef,
    togglePicker: togglePopup,
    triggerRef,
  };
};
