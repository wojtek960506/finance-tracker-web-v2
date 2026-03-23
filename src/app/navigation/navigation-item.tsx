import clsx from 'clsx';
import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';

import { useNavigation } from '@context/navigation-context';
import { ICON_CLASS_NAME } from '@shared/consts';
import { useUIStore } from '@store/ui-store';
import { Button } from '@ui';

type NavigationItemProps = {
  to: string;
  title: string;
  Icon?: ComponentType<{ className?: string }>;
  additionalAction?: () => void;
};

export const NavigationItem = ({
  to,
  title,
  additionalAction,
  Icon,
}: NavigationItemProps) => {
  const { setIsNavOpen } = useUIStore();
  const { fromLeft } = useNavigation();

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? clsx('text-active-nav w-full') : clsx('w-full')
      }
      onClick={() => {
        setIsNavOpen(false);
        additionalAction?.();
      }}
    >
      <Button
        className={clsx(
          'w-full justify-between gap-3 md:gap-4',
          fromLeft ? 'text-left' : 'flex-row-reverse text-right',
        )}
        variant="ghost"
      >
        {title}
        {Icon ? (
          <Icon className={ICON_CLASS_NAME} />
        ) : (
          <div className={ICON_CLASS_NAME} />
        )}
      </Button>
    </NavLink>
  );
};
