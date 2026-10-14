import clsx from 'clsx';
import { Fuel, LayoutDashboard, Package, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import type { SingleVehicleTabsProps } from './types';

export const SingleVehicleTabs = ({
  vehicleSlug,
  isMobileNavOpen,
  onCloseMobileNav,
}: SingleVehicleTabsProps) => {
  const { t } = useTranslation('vehicles');

  const tabs = [
    {
      to: `/vehicles/${vehicleSlug}`,
      label: t('tabs.overview'),
      Icon: LayoutDashboard,
      end: true,
    },
    {
      to: `/vehicles/${vehicleSlug}/fuel`,
      label: t('tabs.fuel'),
      Icon: Fuel,
      end: false,
    },
    {
      to: `/vehicles/${vehicleSlug}/equipment`,
      label: t('tabs.equipment'),
      Icon: Package,
      end: false,
    },
    {
      to: `/vehicles/${vehicleSlug}/maintenance`,
      label: t('tabs.maintenance'),
      Icon: Wrench,
      end: false,
    },
  ];

  return (
    <>
      {/* Desktop Horizontal Tabs */}
      <nav
        aria-label="Vehicle sub-navigation"
        className="hidden sm:flex items-center gap-1.5 border-b border-border pb-2 sm:gap-2"
        data-testid="single-vehicle-tabs"
      >
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                'whitespace-nowrap transition-colors sm:text-sm',
                isActive
                  ? 'bg-fg text-bg shadow-sm'
                  : 'text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile Collapsible Navigation */}
      {isMobileNavOpen && (
        <nav
          aria-label="Vehicle mobile sub-navigation"
          className={clsx(
            'flex flex-col gap-1 rounded-2xl border border-border bg-card-bg p-2',
            'shadow-sm sm:hidden',
          )}
          data-testid="single-vehicle-mobile-nav"
        >
          {tabs.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobileNav}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold',
                  'transition-colors',
                  isActive
                    ? 'bg-fg text-bg shadow-xs'
                    : 'text-text-muted hover:bg-muted hover:text-fg',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
};
