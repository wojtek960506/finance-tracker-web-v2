import { useVehicle } from '@vehicles/hooks';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

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
  const { vehicle, isLoading, isError, refetch } = useVehicle(vehicleSlug);

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-4 p-2 sm:p-4">
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
          'flex-col gap-4 overflow-hidden p-2 sm:p-4',
        )}
        data-testid="single-vehicle-layout"
      >
        <SingleVehicleHeader
          vehicle={vehicle}
          onVehicleUpdated={() => {
            void refetch();
          }}
        />

        <SingleVehicleTabs vehicleSlug={activeSlug} />

        <div className="min-h-0 flex-1 overflow-y-auto pt-1">
          {children ?? <Outlet />}
        </div>
      </div>
    </VehicleProvider>
  );
};
