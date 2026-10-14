import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { MaintenanceEmptyStateProps } from './types';

export const MaintenanceEmptyState = ({
  hasFilters,
  onAddFirstItem,
}: MaintenanceEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <VehicleDomainEmptyState
      hasFilters={hasFilters}
      noMatchingText={t('maintenancePage.empty.noMatching')}
      icon={Wrench}
      iconColorClassName="bg-blue-500/10 text-blue-500"
      title={t('maintenancePage.empty.title')}
      description={t('maintenancePage.empty.description')}
      createButtonLabel={t('maintenancePage.empty.createFirst')}
      onCreateFirst={onAddFirstItem}
      testIdPrefix="maintenance"
    />
  );
};
