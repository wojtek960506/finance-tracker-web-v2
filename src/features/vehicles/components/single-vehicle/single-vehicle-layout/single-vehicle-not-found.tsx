import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Card } from '@shared/ui';

export const SingleVehicleNotFound = () => {
  const { t } = useTranslation('vehicles');

  return (
    <div
      className="mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-4 p-2 sm:p-4"
      data-testid="single-vehicle-not-found"
    >
      <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          {t('singleVehicle.notFoundTitle')}
        </h2>
        <p className="max-w-md text-xs text-text-muted sm:text-sm">
          {t('singleVehicle.notFoundDescription')}
        </p>
        <Link
          to="/vehicles"
          className={clsx(
            'mt-2 inline-flex items-center gap-1.5 text-xs font-medium',
            'text-active-nav hover:underline',
          )}
        >
          <ArrowLeft className="size-3.5" />
          <span>{t('singleVehicle.backToVehicles')}</span>
        </Link>
      </Card>
    </div>
  );
};
