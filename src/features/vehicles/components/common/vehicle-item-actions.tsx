import clsx from 'clsx';
import { Link2, MoreVertical, Pencil, Trash2, Unlink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Dropdown, type DropdownItem } from '@shared/ui';

export type VehicleItemActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
  mode?: 'buttons' | 'dropdown';
  className?: string;
  editTestId?: string;
  deleteTestId?: string;
  linkTestId?: string;
  unlinkTestId?: string;
  menuAriaLabel?: string;
};

export const VehicleItemActions = ({
  onEdit,
  onDelete,
  onLink,
  onUnlink,
  mode = 'buttons',
  className,
  editTestId,
  deleteTestId,
  linkTestId,
  unlinkTestId,
  menuAriaLabel,
}: VehicleItemActionsProps) => {
  const { t } = useTranslation('vehicles');

  if (!onEdit && !onDelete && !onLink && !onUnlink) {
    return null;
  }

  if (mode === 'dropdown') {
    const dropdownItems: DropdownItem[] = [
      ...(onEdit
        ? [
            {
              label: t('actions.edit'),
              icon: <Pencil className="size-3.5" />,
              onSelect: onEdit,
            },
          ]
        : []),
      ...(onLink
        ? [
            {
              label: t('actions.linkTransaction'),
              icon: <Link2 className="size-3.5" />,
              onSelect: onLink,
            },
          ]
        : []),
      ...(onUnlink
        ? [
            {
              label: t('actions.unlinkTransaction'),
              icon: <Unlink className="size-3.5" />,
              onSelect: onUnlink,
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: t('actions.delete'),
              icon: <Trash2 className="size-3.5 text-destructive" />,
              className: clsx(
                'text-destructive hover:text-destructive',
                'hover:bg-destructive/10 dark:hover:bg-destructive/20',
              ),
              onSelect: onDelete,
            },
          ]
        : []),
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
      {onEdit && (
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
      )}
      {onLink && (
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={onLink}
          title={t('actions.linkTransaction')}
          aria-label={t('actions.linkTransaction')}
          data-testid={linkTestId}
        >
          <Link2 />
        </Button>
      )}
      {onUnlink && (
        <Button
          type="button"
          variant="warning"
          size="icon"
          onClick={onUnlink}
          title={t('actions.unlinkTransaction')}
          aria-label={t('actions.unlinkTransaction')}
          data-testid={unlinkTestId}
        >
          <Unlink />
        </Button>
      )}
      {onDelete && (
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
      )}
    </div>
  );
};
