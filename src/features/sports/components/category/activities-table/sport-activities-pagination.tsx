import { PaginationFooter } from '@shared/ui';

import type { SportActivitiesPaginationProps } from './types';

export const SportActivitiesPagination = ({
  testId = 'sport-activities-table',
  ...props
}: SportActivitiesPaginationProps) => {
  return (
    <PaginationFooter
      testId={testId}
      containerTestId={`${testId}-pagination`}
      i18nNamespace="sports"
      {...props}
    />
  );
};
