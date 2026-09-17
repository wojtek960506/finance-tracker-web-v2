import { Camera, FilterX, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

type OperationsListEmptyStateProps = {
  hasAnyOperations: boolean;
  onResetFilters?: () => void;
  onCreateSnapshot?: () => void;
};

export const OperationsListEmptyState = ({
  hasAnyOperations,
  onResetFilters,
  onCreateSnapshot,
}: OperationsListEmptyStateProps) => {
  const { t } = useTranslation('investments');

  return (
    <Card
      className="flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12"
      data-testid="operations-list-empty-state"
    >
      <div className="rounded-full bg-muted/60 p-3 text-text-muted">
        {hasAnyOperations ? (
          <FilterX className="size-6" />
        ) : (
          <Layers className="size-6" />
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {!hasAnyOperations
            ? t('operations.emptyTitle')
            : t('operations.noResultsTitle')}
        </h3>
        <p className="max-w-sm text-sm text-text-muted">
          {!hasAnyOperations
            ? t('operations.emptyDescription')
            : t('operations.noResultsDescription')}
        </p>
      </div>
      {!hasAnyOperations && onCreateSnapshot ? (
        <Button variant="primary" onClick={onCreateSnapshot} className="mt-2 gap-1.5">
          <Camera className="size-4" />
          <span>{t('operations.recordFirstSnapshot')}</span>
        </Button>
      ) : null}
      {hasAnyOperations && onResetFilters ? (
        <Button variant="outline" onClick={onResetFilters} className="mt-2 gap-1.5">
          <FilterX className="size-4" />
          <span>{t('operations.clearFilters')}</span>
        </Button>
      ) : null}
    </Card>
  );
};
