import clsx from 'clsx';

type DrawerOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DrawerOverlay = ({ isOpen, onClose }: DrawerOverlayProps) => (
  <div
    className={clsx(
      'z-300 fixed inset-0 bg-fg/50 transition-opacity duration-300',
      `${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`,
    )}
    onClick={onClose}
  />
);
