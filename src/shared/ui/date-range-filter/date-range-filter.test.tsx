import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DateRangeFilter } from './date-range-filter';

describe('DateRangeFilter', () => {
  it('renders start and end date inputs with accessible labels', () => {
    render(
      <DateRangeFilter
        startDate="2026-01-01"
        endDate="2026-01-31"
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        startDateLabel="Custom From Date"
        endDateLabel="Custom To Date"
        startDateTestId="test-start-date"
        endDateTestId="test-end-date"
      />,
    );

    expect(screen.getByLabelText('Custom From Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom To Date')).toBeInTheDocument();
    expect(screen.getByTestId('test-start-date')).toBeInTheDocument();
    expect(screen.getByTestId('test-end-date')).toBeInTheDocument();
  });

  it('triggers change handlers when clear buttons are clicked', () => {
    const handleStartChange = vi.fn();
    const handleEndChange = vi.fn();

    render(
      <DateRangeFilter
        startDate="2026-01-01"
        endDate="2026-01-31"
        onStartDateChange={handleStartChange}
        onEndDateChange={handleEndChange}
        startDateLabel="From Date"
        endDateLabel="To Date"
      />,
    );

    const clearButtons = screen.getAllByRole('button', { name: 'Clear date' });
    expect(clearButtons).toHaveLength(2);

    fireEvent.click(clearButtons[0]);
    expect(handleStartChange).toHaveBeenCalledWith(undefined);

    fireEvent.click(clearButtons[1]);
    expect(handleEndChange).toHaveBeenCalledWith(undefined);
  });

  it('uses default common translations when labels are omitted', () => {
    render(
      <DateRangeFilter
        startDate="2026-01-01"
        endDate="2026-01-31"
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Start date')).toBeInTheDocument();
    expect(screen.getByLabelText('End date')).toBeInTheDocument();
  });
});
