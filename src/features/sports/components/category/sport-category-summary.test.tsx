import '@shared/i18n';

import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SportCategorySummary } from './sport-category-summary';
import type { SportCategorySummaryData } from './types';

const mockSummary: SportCategorySummaryData = {
  totalCostPln: 2450.5,
  totalEntries: 18,
  linkedCostPln: 1800,
  linkedEntriesCount: 12,
  linkedPercentage: 73,
};

describe('SportCategorySummary', () => {
  it('renders all 3 summary cards with formatted values and percentage badge', () => {
    render(<SportCategorySummary summary={mockSummary} />);

    const totalSpentCard = screen.getByTestId('category-summary-total-spent');
    const totalEntriesCard = screen.getByTestId('category-summary-total-entries');
    const linkedCard = screen.getByTestId('category-summary-linked');

    expect(totalSpentCard).toBeInTheDocument();
    expect(totalEntriesCard).toBeInTheDocument();
    expect(linkedCard).toBeInTheDocument();

    expect(within(totalSpentCard).getByText('2,450.50 PLN')).toBeInTheDocument();
    expect(within(totalEntriesCard).getByText('18')).toBeInTheDocument();
    expect(within(linkedCard).getByText('1,800.00 PLN')).toBeInTheDocument();
    expect(within(linkedCard).getByText('12 of 18 linked')).toBeInTheDocument();
    expect(within(linkedCard).getByText('73%')).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(<SportCategorySummary isLoading={true} />);

    expect(screen.getByTestId('sport-category-summary-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('category-summary-total-spent')).not.toBeInTheDocument();
  });

  it('handles empty or zero summary values gracefully', () => {
    render(
      <SportCategorySummary
        summary={{
          totalCostPln: 0,
          totalEntries: 0,
          linkedCostPln: 0,
          linkedEntriesCount: 0,
          linkedPercentage: 0,
        }}
      />,
    );

    const totalSpentCard = screen.getByTestId('category-summary-total-spent');
    const totalEntriesCard = screen.getByTestId('category-summary-total-entries');
    const linkedCard = screen.getByTestId('category-summary-linked');

    expect(within(totalSpentCard).getByText('0.00 PLN')).toBeInTheDocument();
    expect(within(totalEntriesCard).getByText('0')).toBeInTheDocument();
    expect(within(linkedCard).getByText('0.00 PLN')).toBeInTheDocument();
    expect(within(linkedCard).getByText('0 of 0 linked')).toBeInTheDocument();
    expect(within(linkedCard).queryByText('0%')).not.toBeInTheDocument();
  });
});
