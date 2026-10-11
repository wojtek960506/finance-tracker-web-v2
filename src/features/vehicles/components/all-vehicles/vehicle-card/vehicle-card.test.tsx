import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import type { VehicleWithSpending } from '../../../types';

import { VehicleCard } from './vehicle-card';

describe('VehicleCard', () => {
  const mockVehicle: VehicleWithSpending = {
    id: 'veh-123',
    ownerId: 'user-1',
    name: 'Daily Driver',
    slug: 'daily-driver',
    brand: 'Toyota',
    vehicleModel: 'Corolla',
    productionYear: 2021,
    type: 'car',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    spending: {
      totalSpentPln: 3450,
      fuelTotalPln: 2400,
      maintenanceTotalPln: 800,
      equipmentTotalPln: 250,
      lastOdometerKm: 45200,
      fuelEntriesCount: 8,
      maintenanceCount: 2,
      equipmentCount: 1,
    },
  };

  it('renders vehicle details, metrics, and navigation link', () => {
    renderWithProviders(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByTestId('vehicle-card-veh-123')).toBeInTheDocument();
    expect(screen.getByText('Daily Driver')).toBeInTheDocument();
    expect(screen.getByText('Toyota Corolla • 2021')).toBeInTheDocument();
    expect(screen.getByText('3,450.00 PLN')).toBeInTheDocument();
    expect(screen.getByText('45,200 km')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /view vehicle daily driver/i });
    expect(link).toHaveAttribute('href', '/vehicles/daily-driver');
  });

  it('falls back to vehicle id if slug is not present', () => {
    const vehicleWithoutSlug: VehicleWithSpending = {
      ...mockVehicle,
      id: 'fallback-id',
      slug: undefined as unknown as string,
    };

    renderWithProviders(<VehicleCard vehicle={vehicleWithoutSlug} />);

    const link = screen.getByRole('link', { name: /view vehicle daily driver/i });
    expect(link).toHaveAttribute('href', '/vehicles/fallback-id');
  });
});
