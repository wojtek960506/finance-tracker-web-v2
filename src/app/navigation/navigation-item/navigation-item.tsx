import clsx from 'clsx';
import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';

import { useNavigation } from '@context/navigation-context';
import { ICON_CLASS_NAME } from '@shared/consts';
import { useUIStore } from '@store/ui-store';
import { getButtonClassName } from '@ui';

type NavigationItemProps = {
  to?: string;
  title: string;
  Icon?: ComponentType<{ className?: string }>;
  additionalAction?: () => void | Promise<void>;
  end?: boolean;
};

export const NavigationItem = ({
  to,
  title,
  additionalAction,
  Icon,
  end = false,
}: NavigationItemProps) => {
  const { setIsNavOpen } = useUIStore();
  const { fromLeft } = useNavigation();
  const className = clsx('w-full justify-between gap-3 sm:gap-4', {
    'text-left': fromLeft,
    'flex-row-reverse text-right': !fromLeft,
  });
  const content = (
    <>
      {title}
      {Icon ? <Icon className={ICON_CLASS_NAME} /> : <div className={ICON_CLASS_NAME} />}
    </>
  );

  if (!to) {
    return (
      <button
        type="button"
        className={getButtonClassName({
          variant: 'ghost',
          className,
        })}
        onClick={() => {
          setIsNavOpen(false);
          void additionalAction?.();
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        getButtonClassName({
          variant: 'ghost',
          className: clsx(
            className,
            isActive && 'text-active-nav',
          ),
        })
      }
      onClick={() => {
        setIsNavOpen(false);
        void additionalAction?.();
      }}
    >
      {content}
    </NavLink>
  );
};
