import '@shared/i18n';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { SportEntry } from '../../../api';

import { SportActivitiesTable } from './sport-activities-table';

const mockCategory = {
  id: 'cat-1',
  name: 'Running',
  type: 'system' as const,
};

const mockItems: SportEntry[] = [
  {
    id: 'entry-1',
    ownerId: 'user-1',
    categoryId: 'cat-1',
    category: mockCategory,
    date: '2026-03-01T12:00:00Z',
    itemName: 'Running Shoes',
    costPln: 450,
    description: 'Trail running sneakers',
    transactionId: 'tx-123',
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'entry-2',
    ownerId: 'user-1',
    categoryId: 'cat-1',
    category: mockCategory,
    date: '2026-03-10T12:00:00Z',
    itemName: 'Marathon Entry',
    costPln: 200,
    description: null,
    transactionId: null,
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
  },
];

const renderTable = (props = {}) => {
  return render(
    <MemoryRouter>
      <SportActivitiesTable
        items={mockItems}
        hasFilters={false}
        totalCount={2}
        loadedCount={2}
        {...props}
      />
    </MemoryRouter>,
  );
};

describe('SportActivitiesTable', () => {
  it('renders desktop table rows and mobile cards with item details and badges', () => {
    renderTable();

    expect(screen.getByTestId('sport-activities-table')).toBeInTheDocument();
    expect(screen.getByTestId('activity-row-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('activity-row-entry-2')).toBeInTheDocument();
    expect(screen.getByTestId('activity-card-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('activity-card-entry-2')).toBeInTheDocument();

    expect(screen.getAllByText('Running Shoes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('450.00 PLN').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('linked-transaction-badge').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('unlinked-transaction-badge').length).toBeGreaterThan(0);
  });

  it('renders empty state when there are no items and no active filters', () => {
    const handleAddFirstItem = vi.fn();

    render(
      <MemoryRouter>
        <SportActivitiesTable
          items={[]}
          hasFilters={false}
          onAddFirstItem={handleAddFirstItem}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('activities-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No sport activities recorded yet.')).toBeInTheDocument();

    const addBtn = screen.getByTestId('activities-empty-create-button');
    fireEvent.click(addBtn);
    expect(handleAddFirstItem).toHaveBeenCalledTimes(1);
  });

  it('renders empty matching filters state when items is empty but filters are active', () => {
    render(
      <MemoryRouter>
        <SportActivitiesTable items={[]} hasFilters={true} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('activities-empty-matching-filters')).toBeInTheDocument();
    expect(
      screen.getByText('No activities match the selected filters.'),
    ).toBeInTheDocument();
  });

  it('renders skeleton loading view when isLoading is true and items is empty', () => {
    render(
      <MemoryRouter>
        <SportActivitiesTable items={[]} hasFilters={false} isLoading={true} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('sport-activities-table-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('activities-empty-state')).not.toBeInTheDocument();
  });

  it('triggers item actions on desktop row', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleLink = vi.fn();
    const handleUnlink = vi.fn();

    renderTable({
      onEditItem: handleEdit,
      onDeleteItem: handleDelete,
      onLinkItem: handleLink,
      onUnlinkItem: handleUnlink,
    });

    const editBtn = screen.getByTestId('edit-activity-entry-1');
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(mockItems[0]);

    const unlinkBtn = screen.getByTestId('unlink-activity-entry-1');
    fireEvent.click(unlinkBtn);
    expect(handleUnlink).toHaveBeenCalledWith(mockItems[0]);

    const linkBtn = screen.getByTestId('link-activity-entry-2');
    fireEvent.click(linkBtn);
    expect(handleLink).toHaveBeenCalledWith(mockItems[1]);

    const deleteBtn = screen.getByTestId('delete-activity-entry-2');
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(mockItems[1]);
  });

  it('renders pagination controls and triggers fetchNextPage on load more click', async () => {
    const handleFetchNextPage = vi.fn().mockResolvedValue(undefined);

    renderTable({
      hasNextPage: true,
      fetchNextPage: handleFetchNextPage,
      totalCount: 15,
      loadedCount: 2,
    });

    const loadMoreBtn = screen.getByTestId('sport-activities-table-load-more-button');
    expect(loadMoreBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(loadMoreBtn);
    });

    expect(handleFetchNextPage).toHaveBeenCalledTimes(1);
  });
});
