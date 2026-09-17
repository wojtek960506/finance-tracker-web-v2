import { FilterX, Layers, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

type InstrumentsListEmptyStateProps = {
  hasAnyInstruments: boolean;
  onCreateNew: () => void;
  onResetFilters?: () => void;
};

export const InstrumentsListEmptyState = ({
  hasAnyInstruments,
  onCreateNew,
  onResetFilters,
}: InstrumentsListEmptyStateProps) => {
  const { t } = useTranslation('investments');

  return (
    <Card
      className="flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12"
      data-testid="instruments-list-empty-state"
    >
      <div className="rounded-full bg-muted/60 p-3 text-text-muted">
        {hasAnyInstruments ? (
          <FilterX className="size-6" />
        ) : (
          <Layers className="size-6" />
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {!hasAnyInstruments ? t('emptyTitle') : t('noResultsTitle')}
        </h3>
        <p className="max-w-sm text-sm text-text-muted">
          {!hasAnyInstruments ? t('emptyDescription') : t('noResultsDescription')}
        </p>
      </div>
      {!hasAnyInstruments ? (
        <Button variant="primary" onClick={onCreateNew} className="mt-2 gap-1.5">
          <Plus className="size-4" />
          <span>{t('createFirstInstrument')}</span>
        </Button>
      ) : null}
      {hasAnyInstruments && onResetFilters ? (
        <Button variant="outline" onClick={onResetFilters} className="mt-2 gap-1.5">
          <FilterX className="size-4" />
          <span>{t('clearFilters')}</span>
        </Button>
      ) : null}
    </Card>
  );
};
