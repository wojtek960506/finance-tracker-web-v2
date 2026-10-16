import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { MAINTENANCE_SECTION_CONFIG } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import type { MaintenanceEmptyStateProps } from './types';

export const MaintenanceEmptyState = ({
  activeSection = 'ownMaintenance',
  hasFilters,
  onAddFirstItem,
}: MaintenanceEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  const isPreviousOwner = activeSection === 'previousOwnerServices';
  const sectionConfig =
    MAINTENANCE_SECTION_CONFIG[activeSection] ??
    MAINTENANCE_SECTION_CONFIG.ownMaintenance;

  return (
    <VehicleDomainEmptyState
      hasFilters={hasFilters}
      noMatchingText={t('maintenancePage.empty.noMatching')}
      icon={sectionConfig.icon}
      iconColorClassName={sectionConfig.badgeClass}
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
