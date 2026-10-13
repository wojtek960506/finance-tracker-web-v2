import { Package, Plus, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

import type { EquipmentEmptyStateProps } from './types';

export const EquipmentEmptyState = ({
  hasFilters,
  onAddFirstItem,
}: EquipmentEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  if (hasFilters) {
    return (
      <Card
        className="flex flex-col items-center justify-center py-12 text-center"
        data-testid="equipment-empty-matching-filters"
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/40 text-text-muted">
          <SearchX className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-fg">
          {t('equipmentPage.empty.noMatching')}
        </h3>
      </Card>
    );
  }

  return (
    <Card
      className="flex flex-col items-center justify-center py-12 text-center"
      data-testid="equipment-empty-state"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
        <Package className="size-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-fg">
        {t('equipmentPage.empty.title')}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-text-muted">
        {t('equipmentPage.empty.description')}
      </p>
      <Button
        variant="primary"
        className="mt-4"
        onClick={onAddFirstItem}
        data-testid="equipment-empty-create-button"
      >
        <Plus className="size-4" />
        <span>{t('equipmentPage.empty.createFirst')}</span>
      </Button>
    </Card>
  );
};
