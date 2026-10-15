import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { ClipboardList, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { MaintenanceEmptyStateProps } from './types';

export const MaintenanceEmptyState = ({
  activeSection = 'ownMaintenance',
  hasFilters,
  onAddFirstItem,
}: MaintenanceEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  const isPreviousOwner = activeSection === 'previousOwnerServices';

  return (
    <VehicleDomainEmptyState
      hasFilters={hasFilters}
      noMatchingText={t('maintenancePage.empty.noMatching')}
      icon={isPreviousOwner ? ClipboardList : Wrench}
      iconColorClassName={
        isPreviousOwner
          ? 'bg-amber-500/10 text-amber-500'
          : 'bg-blue-500/10 text-blue-500'
      }
      title={
        isPreviousOwner
          ? t('maintenancePage.empty.previousOwnerTitle')
          : t('maintenancePage.empty.title')
      }
      description={
        isPreviousOwner
          ? t('maintenancePage.empty.previousOwnerDescription')
          : t('maintenancePage.empty.description')
      }
      createButtonLabel={
        isPreviousOwner
          ? t('maintenancePage.empty.previousOwnerCreateFirst')
          : t('maintenancePage.empty.createFirst')
      }
      onCreateFirst={onAddFirstItem}
      testIdPrefix="maintenance"
    />
  );
};
