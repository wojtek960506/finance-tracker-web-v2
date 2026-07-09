import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@ui';

import { NAMED_RESOURCES_PAGE_WIDTH_CLASS_NAME } from './named-resources-layout';

export const NamedResourcesLoading = ({ keySuffix }: { keySuffix: string }) => {
  const { t } = useTranslation('namedResources');

  return (
    <LoadingCard
      title={t(`loading${keySuffix}`)}
      description={t(`loading${keySuffix}Description`)}
      widthClassName={NAMED_RESOURCES_PAGE_WIDTH_CLASS_NAME}
    />
  );
};
