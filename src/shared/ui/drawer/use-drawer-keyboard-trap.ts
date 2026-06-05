import { useEffect } from 'react';

type UseDrawerKeyboardTrapParams = {
  isOpen: boolean;
  onClose: () => void;
};

export const useDrawerKeyboardTrap = ({
  isOpen,
  onClose,
}: UseDrawerKeyboardTrapParams) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
};
