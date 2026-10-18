import { useTranslation } from 'react-i18next';

import { ItemActions, type ItemActionsProps } from '@shared/ui';

export type VehicleItemActionsProps = ItemActionsProps;

export const VehicleItemActions = ({
  menuAriaLabel,
  ...props
}: VehicleItemActionsProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <ItemActions
      editLabel={t('actions.edit')}
      deleteLabel={t('actions.delete')}
      linkLabel={t('actions.linkTransaction')}
      unlinkLabel={t('actions.unlinkTransaction')}
      menuAriaLabel={menuAriaLabel || t('card.actionsMenu')}
      {...props}
    />
  );
};
