import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Card } from '@ui';

export const NamedResourcesEmpty = ({ keySuffix }: { keySuffix: string }) => {
  const { t } = useTranslation('namedResources');

  return (
    <Card
      className={clsx(
        'gap-3 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 text-center sm:gap-4 sm:p-8',
      )}
    >
      <h2 className="text-xl font-semibold sm:text-2xl">
        {t(`emptyResourcesTitle${keySuffix}`)}
      </h2>
      <p className="text-sm text-text-muted sm:text-base">
        {t(`emptyResourcesDescription${keySuffix}`)}
      </p>
    </Card>
  );
};
