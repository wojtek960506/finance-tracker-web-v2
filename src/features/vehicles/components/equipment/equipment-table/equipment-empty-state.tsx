import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { SPENDING_TYPE_CONFIG } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import type { EquipmentEmptyStateProps } from './types';

export const EquipmentEmptyState = ({
  hasFilters,
  onAddFirstItem,
}: EquipmentEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <VehicleDomainEmptyState
      hasFilters={hasFilters}
      noMatchingText={t('equipmentPage.empty.noMatching')}
      icon={SPENDING_TYPE_CONFIG.equipment.icon}
      iconColorClassName={SPENDING_TYPE_CONFIG.equipment.badgeClass}
      title={t('equipmentPage.empty.title')}
      description={t('equipmentPage.empty.description')}
      createButtonLabel={t('equipmentPage.empty.createFirst')}
      onCreateFirst={onAddFirstItem}
      testIdPrefix="equipment"
    />
  );
};
