import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PaginationFooter } from './pagination-footer';

describe('PaginationFooter', () => {
  it('renders null when there are no pages and no count', () => {
    const { container } = render(<PaginationFooter testId="test-footer" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders counter and load more button when hasNextPage is true', () => {
    const handleFetchNextPage = vi.fn();

    render(
      <PaginationFooter
        testId="test-footer"
        hasNextPage={true}
        fetchNextPage={handleFetchNextPage}
        totalCount={20}
        loadedCount={10}
      />,
    );

    expect(screen.getByTestId('test-footer-pagination-footer')).toBeInTheDocument();
    const loadMoreBtn = screen.getByTestId('test-footer-load-more-button');
    expect(loadMoreBtn).toBeInTheDocument();

    fireEvent.click(loadMoreBtn);
    expect(handleFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('renders showing all count when hasNextPage is false', () => {
    render(
      <PaginationFooter
        testId="test-footer"
        hasNextPage={false}
        totalCount={20}
        loadedCount={20}
      />,
    );

    expect(screen.getByTestId('test-footer-counter')).toBeInTheDocument();
    expect(screen.queryByTestId('test-footer-load-more-button')).not.toBeInTheDocument();
  });
});
