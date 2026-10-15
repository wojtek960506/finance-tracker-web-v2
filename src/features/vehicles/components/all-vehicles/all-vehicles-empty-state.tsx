import { Car, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

type AllVehiclesEmptyStateProps = {
  onCreateVehicle: () => void;
};

export const AllVehiclesEmptyState = ({
  onCreateVehicle,
}: AllVehiclesEmptyStateProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <Card
      className="flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12"
      data-testid="vehicles-empty-state"
    >
      <div className="rounded-full bg-muted/60 p-4 text-text-muted">
        <Car className="size-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          {t('empty.title')}
        </h3>
        <p className="max-w-md text-xs text-text-muted sm:text-sm">
          {t('empty.description')}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <Button
          variant="primary"
          onClick={onCreateVehicle}
          className="flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold sm:h-11 sm:px-5 sm:text-base"
        >
          <Plus className="size-5 shrink-0" />
          <span>{t('empty.createFirst')}</span>
        </Button>
      </div>
    </Card>
  );
};
