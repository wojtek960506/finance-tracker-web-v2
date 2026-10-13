import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { Plus, SearchX } from 'lucide-react';

import { Button, Card } from '@shared/ui';

export type VehicleDomainEmptyStateProps = {
  hasFilters: boolean;
  noMatchingText: string;
  icon: LucideIcon;
  iconColorClassName: string;
  title: string;
  description: string;
  createButtonLabel: string;
  onCreateFirst: () => void;
  testIdPrefix: string;
};

export const VehicleDomainEmptyState = ({
  hasFilters,
  noMatchingText,
  icon: Icon,
  iconColorClassName,
  title,
  description,
  createButtonLabel,
  onCreateFirst,
  testIdPrefix,
}: VehicleDomainEmptyStateProps) => {
  if (hasFilters) {
    return (
      <Card
        className="flex flex-col items-center justify-center py-12 text-center"
        data-testid={`${testIdPrefix}-empty-matching-filters`}
      >
        <div
          className={clsx(
            'flex size-12 items-center justify-center rounded-2xl',
            'bg-muted/40 text-text-muted',
          )}
        >
          <SearchX className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-fg">{noMatchingText}</h3>
      </Card>
    );
  }

  return (
    <Card
      className="flex flex-col items-center justify-center py-12 text-center"
      data-testid={`${testIdPrefix}-empty-state`}
    >
      <div
        className={clsx(
          'flex size-12 items-center justify-center rounded-2xl',
          iconColorClassName,
        )}
      >
        <Icon className="size-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-text-muted">{description}</p>
      <Button
        variant="primary"
        className="mt-4"
        onClick={onCreateFirst}
        data-testid={`${testIdPrefix}-empty-create-button`}
      >
        <Plus className="size-4" />
        <span>{createButtonLabel}</span>
      </Button>
    </Card>
  );
};
