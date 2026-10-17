import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

export type VehiclePageLoadingProps = {
  title?: string;
  description?: string;
};

export const VehiclePageLoading = ({ title, description }: VehiclePageLoadingProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <div className="flex h-64 items-center justify-center p-4">
      <LoadingCard
        title={title || t('singleVehicle.loadingTitle')}
        description={description || t('singleVehicle.loadingDescription')}
        widthClassName="max-w-[35rem]"
      />
    </div>
  );
};
