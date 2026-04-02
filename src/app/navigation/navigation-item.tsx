import clsx from 'clsx';
import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';

import { useNavigation } from '@context/navigation-context';
import { ICON_CLASS_NAME } from '@shared/consts';
import { useUIStore } from '@store/ui-store';
import { getButtonClassName } from '@ui';

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
        getButtonClassName({
          variant: 'ghost',
          className: clsx(
            'w-full justify-between gap-3 sm:gap-4',
            isActive && 'text-active-nav',
            fromLeft ? 'text-left' : 'flex-row-reverse text-right',
          ),
        })
      }
      onClick={() => {
        setIsNavOpen(false);
        void additionalAction?.();
      }}
    >
      {title}
      {Icon ? <Icon className={ICON_CLASS_NAME} /> : <div className={ICON_CLASS_NAME} />}
    </NavLink>
  );
};
