import { useTranslation } from 'react-i18next';

import { LoadingCard } from '../loading-card';

import type { PageLoadingProps } from './types';

export const PageLoading = ({
  title,
  description,
  testId = 'page-loading',
  className = 'flex h-64 items-center justify-center p-4',
}: PageLoadingProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={className} data-testid={testId}>
      <LoadingCard
        title={title || t('loading')}
        description={description || t('loadingDescription')}
        widthClassName="max-w-[35rem]"
      />
    </div>
  );
};
