import clsx from 'clsx';
import { Menu } from 'lucide-react';
import { forwardRef } from 'react';

import { ICON_CLASS_NAME } from '@shared/consts';
import { useAuthToken } from '@shared/hooks';
import { useUIStore } from '@store/ui-store';
import { Button } from '@ui';

export const NavButton = forwardRef<HTMLButtonElement>((_, ref) => {
  const { setIsNavOpen } = useUIStore();
  const { isAuthenticated } = useAuthToken();

  return (
    <Button
      ref={ref}
      onClick={() => setIsNavOpen(true)}
      className={clsx(`${isAuthenticated ? 'visible' : 'hidden sm:block sm:invisible'}`)}
      variant="ghost"
    >
      <Menu className={ICON_CLASS_NAME} />
    </Button>
  );
});
