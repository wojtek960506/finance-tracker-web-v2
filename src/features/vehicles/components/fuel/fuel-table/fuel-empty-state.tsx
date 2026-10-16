import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { SPENDING_TYPE_CONFIG } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

type FuelEmptyStateProps = {
  hasFilters: boolean;
  onAddFirstEntry: () => void;
};

export const FuelEmptyState = ({ hasFilters, onAddFirstEntry }: FuelEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <VehicleDomainEmptyState
      hasFilters={hasFilters}
      noMatchingText={t('fuelPage.empty.noMatching')}
      icon={SPENDING_TYPE_CONFIG.fuel.icon}
      iconColorClassName={SPENDING_TYPE_CONFIG.fuel.badgeClass}
      title={t('fuelPage.empty.title')}
      description={t('fuelPage.empty.description')}
      createButtonLabel={t('fuelPage.empty.createFirst')}
      onCreateFirst={onAddFirstEntry}
      testIdPrefix="fuel"
    />
  );
};
