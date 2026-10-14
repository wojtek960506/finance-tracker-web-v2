import { useVehicle } from '@vehicles/hooks';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { LoadingCard } from '@shared/ui';

import { VehicleProvider } from '../context';

import { SingleVehicleHeader } from './single-vehicle-header';
import { SingleVehicleNotFound } from './single-vehicle-not-found';
import { SingleVehicleTabs } from './single-vehicle-tabs';
import type { SingleVehicleLayoutProps } from './types';

export const SingleVehicleLayout = ({
  vehicleSlug,
  children,
}: SingleVehicleLayoutProps) => {
  const { t } = useTranslation('vehicles');
  const location = useLocation();
  const { vehicle, isLoading, isError, refetch } = useVehicle(vehicleSlug);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMobileNavOpen(false);
  }

  if (isLoading) {
    return (
      <div
        className={clsx(
          'mx-auto flex h-full min-h-0 w-full max-w-[120rem]',
          'flex-col gap-4 p-2 sm:p-4',
        )}
      >
        <LoadingCard
          title={t('singleVehicle.loadingTitle')}
          description={t('singleVehicle.loadingDescription')}
          widthClassName="max-w-[35rem]"
        />
      </div>
    );
  }

  if (isError || !vehicle) {
    return <SingleVehicleNotFound />;
  }

  const activeSlug = vehicle.slug || vehicle.id;

  return (
    <VehicleProvider value={{ vehicle, refetchVehicle: refetch }}>
      <div
        className={clsx(
          'mx-auto flex h-full min-h-0 w-full max-w-[120rem]',
          'flex-col gap-3.5 overflow-hidden p-2 sm:p-4 sm:gap-4',
        )}
        data-testid="single-vehicle-layout"
      >
        <SingleVehicleHeader
          vehicle={vehicle}
          isMobileNavOpen={isMobileNavOpen}
          onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        />

        <SingleVehicleTabs
          vehicleSlug={activeSlug}
          isMobileNavOpen={isMobileNavOpen}
          onCloseMobileNav={() => setIsMobileNavOpen(false)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto pt-1">
          {children ?? <Outlet />}
        </div>
      </div>
    </VehicleProvider>
  );
};
