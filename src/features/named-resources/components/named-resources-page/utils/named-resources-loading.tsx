import { useTranslation } from 'react-i18next';

import { Card, LoadingState } from '@ui';

export const NamedResourcesLoading = ({ keySuffix }: { keySuffix: string }) => {
  const { t } = useTranslation('namedResources');

  return (
    <div className="m-auto flex w-full max-w-100 flex-col gap-2 sm:gap-3">
      <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
        <LoadingState
          title={t(`loading${keySuffix}`)}
          description={t(`loading${keySuffix}Description`)}
          className="py-4"
        />
      </Card>
    </div>
  );
};
