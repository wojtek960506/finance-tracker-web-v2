import { type RefObject, useEffect, useRef } from 'react';

import { getFocusableElements } from './get-focusable-elements';

type UseDrawerFocusManagementParams = {
  isOpen: boolean;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  navRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
};

export const useDrawerFocusManagement = ({
  isOpen,
  restoreFocusRef,
  navRef,
  panelRef,
}: UseDrawerFocusManagementParams) => {
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
  }, [isOpen, navRef, panelRef, restoreFocusRef]);
};
