import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@ui';

export const NamedResourcesLoading = ({ keySuffix }: { keySuffix: string }) => {
  const { t } = useTranslation('namedResources');

  return (
    <LoadingCard
      title={t(`loading${keySuffix}`)}
      description={t(`loading${keySuffix}Description`)}
      widthClassName="max-w-100"
    />
  );
};
