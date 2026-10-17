import type { ReactNode } from 'react';

import { Card } from '@shared/ui';

import { VehiclePaginationFooter } from './vehicle-pagination-footer';

export type VehicleTableShellProps = {
  isEmpty: boolean;
  emptyState: ReactNode;
  testId: string;
  headers: ReactNode;
  desktopRows: ReactNode;
  mobileCards: ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void | Promise<unknown>;
  totalCount?: number;
  loadedCount?: number;
};

export const VehicleTableShell = ({
  isEmpty,
  emptyState,
  testId,
  headers,
  desktopRows,
  mobileCards,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  totalCount,
  loadedCount,
}: VehicleTableShellProps) => {
  if (isEmpty) {
    return <>{emptyState}</>;
  }

  return (
    <div className="flex flex-col gap-3" data-testid={testId}>
      {/* Desktop table view */}
      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-text-muted">
              <tr>{headers}</tr>
            </thead>
            <tbody className="divide-y divide-border">{desktopRows}</tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="flex flex-col gap-2.5 lg:hidden">{mobileCards}</div>

      {/* Pagination / Cursor Load More Footer */}
      <VehiclePaginationFooter
        testId={testId}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        totalCount={totalCount}
        loadedCount={loadedCount}
      />
    </div>
  );
};
