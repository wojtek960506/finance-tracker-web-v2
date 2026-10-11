import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import type { GlobalVehiclesSummary } from '../../../types';

import { GlobalSummaryCards } from './global-summary-cards';

describe('GlobalSummaryCards', () => {
  const mockSummary: GlobalVehiclesSummary = {
    totalVehicles: 3,
    totalSpentPln: 15400.5,
    totalFuelSpentPln: 8200.0,
    totalMaintenanceSpentPln: 5300.5,
    totalEquipmentSpentPln: 1900.0,
  };

  it('renders all four summary cards with formatted amounts', () => {
    renderWithProviders(<GlobalSummaryCards summary={mockSummary} />);

    expect(screen.getByTestId('global-spending-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('summary-card-total')).toBeInTheDocument();
    expect(screen.getByTestId('summary-card-fuel')).toBeInTheDocument();
    expect(screen.getByTestId('summary-card-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('summary-card-equipment')).toBeInTheDocument();

    expect(screen.getByText('15,400.50 PLN')).toBeInTheDocument();
    expect(screen.getByText('8,200.00 PLN')).toBeInTheDocument();
    expect(screen.getByText('5,300.50 PLN')).toBeInTheDocument();
    expect(screen.getByText('1,900.00 PLN')).toBeInTheDocument();
  });
});
