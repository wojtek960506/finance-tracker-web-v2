import '@shared/i18n';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleTableShell } from './vehicle-table-shell';

describe('VehicleTableShell', () => {
  it('renders emptyState when isEmpty is true', () => {
    render(
      <VehicleTableShell
        isEmpty={true}
        emptyState={<div data-testid="test-empty">No items</div>}
        testId="test-entries-list"
        headers={<th>Header</th>}
        desktopRows={
          <tr>
            <td>Row</td>
          </tr>
        }
        mobileCards={<div>Card</div>}
      />,
    );

    expect(screen.getByTestId('test-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('test-entries-list')).not.toBeInTheDocument();
  });

  it('renders desktop table and mobile cards when isEmpty is false', () => {
    render(
      <VehicleTableShell
        isEmpty={false}
        emptyState={<div>No items</div>}
        testId="test-entries-list"
        headers={<th>Date Header</th>}
        desktopRows={
          <tr>
            <td>Row 1</td>
          </tr>
        }
        mobileCards={<div data-testid="mobile-card-1">Mobile Card 1</div>}
      />,
    );

    expect(screen.getByTestId('test-entries-list')).toBeInTheDocument();
    expect(screen.getByText('Date Header')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
  });

  it('renders progress counter and load more button when hasNextPage is true', async () => {
    let resolveFetch: () => void = () => {};
    const fetchNextPage = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(
      <VehicleTableShell
        isEmpty={false}
        emptyState={<div>No items</div>}
        testId="test-entries-list"
        headers={<th>Date Header</th>}
        desktopRows={
          <tr>
            <td>Row 1</td>
          </tr>
        }
        mobileCards={<div>Mobile Card 1</div>}
        hasNextPage={true}
        isFetchingNextPage={false}
        fetchNextPage={fetchNextPage}
        totalCount={50}
        loadedCount={20}
      />,
    );

    expect(screen.getByTestId('test-entries-list-pagination-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-entries-list-counter')).toHaveTextContent(
      'Showing 20 of 50 records',
    );

    const loadMoreBtn = screen.getByTestId('test-entries-list-load-more-button');
    expect(loadMoreBtn).toBeInTheDocument();
    expect(loadMoreBtn).not.toBeDisabled();

    fireEvent.click(loadMoreBtn);
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
    expect(loadMoreBtn).toBeDisabled();
    expect(screen.getByTestId('test-entries-list-load-more-spinner')).toBeInTheDocument();

    await act(async () => {
      resolveFetch();
    });

    expect(loadMoreBtn).not.toBeDisabled();
    expect(
      screen.queryByTestId('test-entries-list-load-more-spinner'),
    ).not.toBeInTheDocument();
  });

  it('disables load more button when isFetchingNextPage is true', () => {
    render(
      <VehicleTableShell
        isEmpty={false}
        emptyState={<div>No items</div>}
        testId="test-entries-list"
        headers={<th>Date Header</th>}
        desktopRows={
          <tr>
            <td>Row 1</td>
          </tr>
        }
        mobileCards={<div>Mobile Card 1</div>}
        hasNextPage={true}
        isFetchingNextPage={true}
        fetchNextPage={vi.fn()}
      />,
    );

    const loadMoreBtn = screen.getByTestId('test-entries-list-load-more-button');
    expect(loadMoreBtn).toBeDisabled();
  });

  it('renders showingAll text when hasNextPage is false and records exist', () => {
    render(
      <VehicleTableShell
        isEmpty={false}
        emptyState={<div>No items</div>}
        testId="test-entries-list"
        headers={<th>Date Header</th>}
        desktopRows={
          <tr>
            <td>Row 1</td>
          </tr>
        }
        mobileCards={<div>Mobile Card 1</div>}
        hasNextPage={false}
        totalCount={50}
        loadedCount={50}
      />,
    );

    expect(screen.getByTestId('test-entries-list-counter')).toHaveTextContent(
      'Showing all 50 records',
    );
    expect(
      screen.queryByTestId('test-entries-list-load-more-button'),
    ).not.toBeInTheDocument();
  });
});
