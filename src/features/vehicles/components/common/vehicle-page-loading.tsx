import { useTranslation } from 'react-i18next';

import { PageLoading, type PageLoadingProps } from '@shared/ui';

export type VehiclePageLoadingProps = PageLoadingProps;

export const VehiclePageLoading = ({
  title,
  description,
  ...props
}: VehiclePageLoadingProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <PageLoading
      title={title || t('singleVehicle.loadingTitle')}
      description={description || t('singleVehicle.loadingDescription')}
      {...props}
    />
  );
};
