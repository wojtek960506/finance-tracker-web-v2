import clsx from 'clsx';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Dropdown, type DropdownItem } from '@shared/ui';

export type VehicleItemActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  mode?: 'buttons' | 'dropdown';
  className?: string;
  editTestId?: string;
  deleteTestId?: string;
  menuAriaLabel?: string;
};

export const VehicleItemActions = ({
  onEdit,
  onDelete,
  mode = 'buttons',
  className,
  editTestId,
  deleteTestId,
  menuAriaLabel,
}: VehicleItemActionsProps) => {
  const { t } = useTranslation('vehicles');

  if (mode === 'dropdown') {
    const dropdownItems: DropdownItem[] = [
      {
        label: t('actions.edit'),
        icon: <Pencil className="size-3.5" />,
        onSelect: onEdit,
      },
      {
        label: t('actions.delete'),
        icon: <Trash2 className="size-3.5 text-destructive" />,
        className: clsx(
          'text-destructive hover:text-destructive',
          'hover:bg-destructive/10 dark:hover:bg-destructive/20',
        ),
        onSelect: onDelete,
      },
    ];

    return (
      <div className={className}>
        <Dropdown
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={menuAriaLabel || t('card.actionsMenu')}
            >
              <MoreVertical className="size-3.5" />
            </Button>
          }
          items={dropdownItems}
        />
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onEdit}
        title={t('actions.edit')}
        aria-label={t('actions.edit')}
        data-testid={editTestId}
      >
        <Pencil />
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onDelete}
        title={t('actions.delete')}
        aria-label={t('actions.delete')}
        data-testid={deleteTestId}
      >
        <Trash2 />
      </Button>
    </div>
  );
};
