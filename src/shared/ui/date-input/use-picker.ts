import { useCallback, useEffect, useState } from 'react';

type UsePickerOptions = {
  disabled?: boolean;
  onOpen?: () => void;
};

export const usePicker = ({ disabled, onOpen }: UsePickerOptions) => {
  const [isOpen, setIsOpen] = useState(false);

  const closePicker = useCallback(() => {
    setIsOpen(false);
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

  const openPicker = useCallback(() => {
    if (disabled) return;

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
    openPicker,
    togglePicker,
  };
};
