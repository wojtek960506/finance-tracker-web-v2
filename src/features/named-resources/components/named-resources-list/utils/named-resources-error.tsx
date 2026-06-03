import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@ui';

import { FORM_BUTTON_SIZE_CLASS } from '@/shared/consts';

export const NamedResourcesError = ({
  keySuffix,
  error,
  handleClick,
}: {
  keySuffix: string;
  error: Error;
  handleClick: () => void;
}) => {
  const { t } = useTranslation('namedResources');

  return (
    <div className="m-auto flex w-full max-w-100 flex-col gap-2 sm:gap-3">
      <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {t(`resourcesLoadFailedTitle${keySuffix}`)}
          </h2>
          <p className="text-sm text-text-muted sm:text-base">{error.message}</p>
        </div>
        <Button
          variant="primary"
          className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
          onClick={handleClick}
        >
          {t('retryLoadingResources')}
        </Button>
      </Card>
    </div>
  );
};
