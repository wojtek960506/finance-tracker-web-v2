import clsx from 'clsx';
import { type ReactNode, type RefObject } from 'react';
import FocusLock from 'react-focus-lock';

import { DrawerHeader } from './drawer-header';

type DrawerPanelProps = {
  isOpen: boolean;
  fromLeft: boolean;
  onClose: () => void;
  children: ReactNode;
  headerLeft?: ReactNode;
  ariaLabel: string;
  panelClassName?: string;
  contentClassName?: string;
  panelRef: RefObject<HTMLDivElement | null>;
  navRef: RefObject<HTMLElement | null>;
};

export const DrawerPanel = ({
  isOpen,
  fromLeft,
  onClose,
  children,
  headerLeft,
  ariaLabel,
  panelClassName,
  contentClassName,
  panelRef,
  navRef,
}: DrawerPanelProps) => (
  <FocusLock disabled={!isOpen} autoFocus={false} returnFocus={false} persistentFocus>
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      tabIndex={-1}
      className={clsx(
        // Default drawers fit within the viewport; specific callers can override this via `panelClassName`.
        'z-400 fixed top-0 flex h-full w-[min(20rem,100vh)] max-w-full flex-col bg-bg shadow-lg',
        'transform transition-transform duration-300',
        fromLeft ? 'left-0' : 'right-0',
        `${isOpen ? 'translate-x-0' : fromLeft ? '-translate-x-full' : 'translate-x-full'}`,
        panelClassName,
      )}
    >
      <div className={clsx('flex h-full flex-col', contentClassName)}>
        <DrawerHeader fromLeft={fromLeft} onClose={onClose} headerLeft={headerLeft} />
        <nav ref={navRef} className="h-full overflow-y-auto px-4 py-2">
          {children}
        </nav>
      </div>
    </div>
  </FocusLock>
);
