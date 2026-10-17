import { VehicleTypeBadge } from '@vehicles/components/common';
import clsx from 'clsx';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@shared/ui';

import type { SingleVehicleHeaderProps } from './types';

export const SingleVehicleHeader = ({
  vehicle,
  isMobileNavOpen,
  onToggleMobileNav,
}: SingleVehicleHeaderProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <header
      className="flex items-center justify-between gap-3 min-w-0"
      data-testid="single-vehicle-header"
    >
      {/* Title & Badge */}
      <div className="flex items-center gap-2 min-w-0 sm:gap-3">
        <h1 className="truncate text-lg font-bold tracking-tight text-fg sm:text-2xl">
          {vehicle.name}
        </h1>
        <VehicleTypeBadge type={vehicle.type} />
      </div>

      {/* Desktop Navigation / Back button */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <Link
          to="/vehicles"
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-lg border border-border',
            'bg-card-bg px-3 py-1.5 text-xs font-semibold text-text-muted',
            'transition-colors hover:bg-bt-ghost-hover hover:text-fg shadow-xs',
          )}
          aria-label={t('singleVehicle.backToVehicles')}
          data-testid="single-vehicle-back-button-desktop"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t('singleVehicle.backToVehicles')}</span>
        </Link>
      </div>

      {/* Mobile Controls (Hamburger + Back icon) */}
      <div className="flex sm:hidden items-center gap-1.5 shrink-0">
        <Button
          type="button"
          variant="ghost"
          onClick={onToggleMobileNav}
          className="p-1.5 text-text-muted hover:text-fg"
          aria-label={
            isMobileNavOpen
              ? t('singleVehicle.closeNavigation')
              : t('singleVehicle.openNavigation')
          }
          data-testid="single-vehicle-mobile-nav-toggle"
        >
          {isMobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        <Link
          to="/vehicles"
          className={clsx(
            'flex items-center justify-center rounded-lg border border-border',
            'bg-card-bg p-1.5 text-text-muted shadow-xs',
            'transition-colors hover:bg-bt-ghost-hover hover:text-fg',
          )}
          aria-label={t('singleVehicle.backToVehicles')}
          data-testid="single-vehicle-back-button-mobile"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </header>
  );
};
