import { Layers, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

type InstrumentsListEmptyStateProps = {
  hasAnyInstruments: boolean;
  onCreateNew: () => void;
};

export const InstrumentsListEmptyState = ({
  hasAnyInstruments,
  onCreateNew,
}: InstrumentsListEmptyStateProps) => {
  const { t } = useTranslation('investments');

  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12">
      <div className="rounded-full bg-muted/60 p-3 text-text-muted">
        <Layers className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {!hasAnyInstruments
            ? t('emptyTitle', { defaultValue: 'No investment instruments yet' })
            : t('noResultsTitle', { defaultValue: 'No matching instruments' })}
        </h3>
        <p className="text-sm text-text-muted max-w-sm">
          {!hasAnyInstruments
            ? t('emptyDescription', {
                defaultValue:
                  'Create your first instrument like Apple (AAPL), S&P 500 ETF, or Bitcoin to start tracking investments.',
              })
            : t('noResultsDescription', {
                defaultValue: 'Try changing your search query or kind filter.',
              })}
        </p>
      </div>
      {!hasAnyInstruments ? (
        <Button variant="primary" onClick={onCreateNew} className="mt-2 gap-1.5">
          <Plus className="size-4" />
          <span>
            {t('createFirstInstrument', { defaultValue: 'Add First Instrument' })}
          </span>
        </Button>
      ) : null}
    </Card>
  );
};
