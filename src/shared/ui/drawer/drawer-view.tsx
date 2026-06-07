import { type ReactNode, type RefObject } from 'react';

import { DrawerOverlay } from './drawer-overlay';
import { DrawerPanel } from './drawer-panel';

type DrawerViewProps = {
  isOpen: boolean;
  fromLeft: boolean;
  onClose: () => void;
  children: ReactNode;
  headerLeft?: ReactNode;
  ariaLabel: string;
  panelClassName?: string;
  contentClassName?: string;
  showOverlay?: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  navRef: RefObject<HTMLElement | null>;
};

export const DrawerView = ({
  isOpen,
  fromLeft,
  onClose,
  children,
  headerLeft,
  ariaLabel,
  panelClassName,
  contentClassName,
  showOverlay = true,
  panelRef,
  navRef,
}: DrawerViewProps) => (
  <>
    {showOverlay ? <DrawerOverlay isOpen={isOpen} onClose={onClose} /> : null}
    <DrawerPanel
      isOpen={isOpen}
      fromLeft={fromLeft}
      onClose={onClose}
      children={children}
      headerLeft={headerLeft}
      ariaLabel={ariaLabel}
      panelClassName={panelClassName}
      contentClassName={contentClassName}
      panelRef={panelRef}
      navRef={navRef}
    />
  </>
);
