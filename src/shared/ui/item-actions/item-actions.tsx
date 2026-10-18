import clsx from 'clsx';
import { Link2, MoreVertical, Pencil, Trash2, Unlink } from 'lucide-react';

import { Button } from '../button';
import { Dropdown, type DropdownItem } from '../dropdown';

import type { ItemActionsProps } from './types';

export const ItemActions = ({
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
  menuAriaLabel = 'Actions menu',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  linkLabel = 'Link to transaction',
  unlinkLabel = 'Unlink from transaction',
}: ItemActionsProps) => {
  if (!onEdit && !onDelete && !onLink && !onUnlink) {
    return null;
  }

  if (mode === 'dropdown') {
    const dropdownItems: DropdownItem[] = [
      ...(onEdit
        ? [
            {
              label: editLabel,
              icon: <Pencil className="size-3.5" />,
              onSelect: onEdit,
            },
          ]
        : []),
      ...(onLink
        ? [
            {
              label: linkLabel,
              icon: <Link2 className="size-3.5" />,
              onSelect: onLink,
            },
          ]
        : []),
      ...(onUnlink
        ? [
            {
              label: unlinkLabel,
              icon: <Unlink className="size-3.5" />,
              onSelect: onUnlink,
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: deleteLabel,
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
              aria-label={menuAriaLabel}
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
          title={editLabel}
          aria-label={editLabel}
          data-testid={editTestId}
        >
          <Pencil className="size-3.5" />
        </Button>
      )}

      {onLink && (
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={onLink}
          title={linkLabel}
          aria-label={linkLabel}
          data-testid={linkTestId}
        >
          <Link2 className="size-3.5" />
        </Button>
      )}

      {onUnlink && (
        <Button
          type="button"
          variant="warning"
          size="icon"
          onClick={onUnlink}
          title={unlinkLabel}
          aria-label={unlinkLabel}
          data-testid={unlinkTestId}
        >
          <Unlink className="size-3.5" />
        </Button>
      )}

      {onDelete && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onDelete}
          title={deleteLabel}
          aria-label={deleteLabel}
          data-testid={deleteTestId}
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
};
