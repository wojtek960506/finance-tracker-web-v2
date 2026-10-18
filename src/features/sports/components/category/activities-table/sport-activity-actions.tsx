import { useTranslation } from 'react-i18next';

import { ItemActions } from '@shared/ui';

import type { SportActivityItemActionsProps } from './types';

export const SportActivityItemActions = (props: SportActivityItemActionsProps) => {
  const { t } = useTranslation('sports');

  return (
    <ItemActions
      editLabel={t('actions.edit')}
      deleteLabel={t('actions.delete')}
      linkLabel={t('spendings.linkTitle')}
      unlinkLabel={t('spendings.unlinkTitle')}
      menuAriaLabel={t('entries.actions')}
      {...props}
    />
  );
};
