import { VehicleDomainEmptyState } from '@vehicles/components/common';
import { Fuel } from 'lucide-react';
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
      icon={Fuel}
      iconColorClassName="bg-amber-500/10 text-amber-500"
      title={t('fuelPage.empty.title')}
      description={t('fuelPage.empty.description')}
      createButtonLabel={t('fuelPage.empty.createFirst')}
      onCreateFirst={onAddFirstEntry}
      testIdPrefix="fuel"
    />
  );
};
