import '@shared/i18n';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehiclePaginationFooter } from './vehicle-pagination-footer';

describe('VehiclePaginationFooter', () => {
  it('renders null when there are no pages and no count', () => {
    const { container } = render(<VehiclePaginationFooter testId="test-footer" />);

    expect(container.firstChild).toBeNull();
  });

  it('renders mobile counter and load more button when hasNextPage is true', async () => {
    let resolveFetch: () => void = () => {};
    const fetchNextPage = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(
      <VehiclePaginationFooter
        testId="test-footer"
        hasNextPage={true}
        isFetchingNextPage={false}
        fetchNextPage={fetchNextPage}
        totalCount={50}
        loadedCount={20}
      />,
    );

    expect(screen.getByTestId('test-footer-pagination-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-footer-counter')).toHaveTextContent(
      'Showing 20 of 50 records',
    );

    const loadMoreBtn = screen.getByTestId('test-footer-load-more-button');
    expect(loadMoreBtn).toBeInTheDocument();
    expect(loadMoreBtn).not.toBeDisabled();
    expect(loadMoreBtn).toHaveTextContent('Load More');
    expect(loadMoreBtn).toHaveTextContent('Load more (20 of 50)');

    fireEvent.click(loadMoreBtn);
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
    expect(loadMoreBtn).toBeDisabled();
    expect(screen.getByTestId('test-footer-load-more-spinner')).toBeInTheDocument();

    await act(async () => {
      resolveFetch();
    });

    expect(loadMoreBtn).not.toBeDisabled();
    expect(screen.queryByTestId('test-footer-load-more-spinner')).not.toBeInTheDocument();
  });

  it('disables load more button when isFetchingNextPage is true', () => {
    render(
      <VehiclePaginationFooter
        testId="test-footer"
        hasNextPage={true}
        isFetchingNextPage={true}
        fetchNextPage={vi.fn()}
      />,
    );

    const loadMoreBtn = screen.getByTestId('test-footer-load-more-button');
    expect(loadMoreBtn).toBeDisabled();
  });

  it('renders showingAll text when hasNextPage is false and records exist', () => {
    render(
      <VehiclePaginationFooter
        testId="test-footer"
        hasNextPage={false}
        totalCount={50}
        loadedCount={50}
      />,
    );

    expect(screen.getByTestId('test-footer-counter')).toHaveTextContent(
      'Showing all 50 records',
    );
    expect(screen.queryByTestId('test-footer-load-more-button')).not.toBeInTheDocument();
  });
});
