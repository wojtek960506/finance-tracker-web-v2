import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { Package } from 'lucide-react';
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
      icon={Package}
      iconColorClassName="bg-purple-500/10 text-purple-500"
      title={t('equipmentPage.empty.title')}
      description={t('equipmentPage.empty.description')}
      createButtonLabel={t('equipmentPage.empty.createFirst')}
      onCreateFirst={onAddFirstItem}
      testIdPrefix="equipment"
    />
  );
};
