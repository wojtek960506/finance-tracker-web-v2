import { type ReactNode, type RefObject, useRef } from 'react';

import { DrawerView } from './drawer-view';
import { useDrawerFocusManagement } from './use-drawer-focus-management';
import { useDrawerKeyboardTrap } from './use-drawer-keyboard-trap';

type DrawerProps = {
  isOpen: boolean;
  fromLeft: boolean;
  onClose: () => void;
  children: ReactNode;
  headerLeft?: ReactNode;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  ariaLabel?: string;
  panelClassName?: string;
  contentClassName?: string;
  showOverlay?: boolean;
};

export const Drawer = ({
  isOpen,
  fromLeft,
  onClose,
  children,
  headerLeft,
  restoreFocusRef,
  ariaLabel = 'Drawer',
  panelClassName,
  contentClassName,
  showOverlay = true,
}: DrawerProps) => {
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useDrawerFocusManagement({
    isOpen,
    restoreFocusRef,
    navRef,
    panelRef,
  });

  useDrawerKeyboardTrap({
    isOpen,
    onClose,
  });

  return (
    <DrawerView
      isOpen={isOpen}
      fromLeft={fromLeft}
      onClose={onClose}
      children={children}
      headerLeft={headerLeft}
      ariaLabel={ariaLabel}
      panelClassName={panelClassName}
      contentClassName={contentClassName}
      showOverlay={showOverlay}
      panelRef={panelRef}
      navRef={navRef}
    />
  );
};
