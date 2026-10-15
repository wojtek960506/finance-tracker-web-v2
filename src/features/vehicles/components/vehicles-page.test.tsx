import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import type { GlobalVehiclesSummary, VehicleWithSpending } from '../api';
import * as hooks from '../hooks';

import { VehiclesPage } from './vehicles-page';

vi.mock('../hooks', () => ({
  useAllVehiclesSummary: vi.fn(),
}));

const defaultMockSummary: GlobalVehiclesSummary = {
  totalVehicles: 0,
  totalSpentPln: 0,
  totalFuelSpentPln: 0,
  totalMaintenanceSpentPln: 0,
  totalEquipmentSpentPln: 0,
  totalFuelEntriesCount: 0,
  totalMaintenanceCount: 0,
  totalEquipmentCount: 0,
  totalDistanceKm: 0,
};

describe('VehiclesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    vi.mocked(hooks.useAllVehiclesSummary).mockReturnValue({
      vehicles: [],
      summary: defaultMockSummary,
      hasVehicles: false,
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<VehiclesPage />);

    expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument();
  });

  it('renders error state when fetch fails', () => {
    vi.mocked(hooks.useAllVehiclesSummary).mockReturnValue({
      vehicles: [],
      summary: defaultMockSummary,
      hasVehicles: false,
      isLoading: false,
      isFetching: false,
      error: new Error('Failed to load vehicles'),
      refetch: vi.fn(),
    });

    renderWithProviders(<VehiclesPage />);

    expect(screen.getByText('Failed to load vehicles')).toBeInTheDocument();
  });

  it('renders empty state when user has no vehicles', () => {
    vi.mocked(hooks.useAllVehiclesSummary).mockReturnValue({
      vehicles: [],
      summary: defaultMockSummary,
      hasVehicles: false,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<VehiclesPage />);

    expect(screen.getByTestId('vehicles-empty-state')).toBeInTheDocument();
  });

  it('renders summary cards and vehicle cards when vehicles are loaded', () => {
    const mockVehicles: VehicleWithSpending[] = [
      {
        id: 'v1',
        ownerId: 'u1',
        name: 'Work Car',
        slug: 'work-car',
        type: 'car',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        spending: {
          totalSpentPln: 1200,
          fuelTotalPln: 800,
          maintenanceTotalPln: 400,
          equipmentTotalPln: 0,
          lastOdometerKm: 85000,
          totalDistanceKm: 1200,
          fuelEntriesCount: 3,
          maintenanceCount: 1,
          equipmentCount: 0,
        },
      },
    ];

    vi.mocked(hooks.useAllVehiclesSummary).mockReturnValue({
      vehicles: mockVehicles,
      summary: {
        ...defaultMockSummary,
        totalVehicles: 1,
        totalSpentPln: 1200,
        totalFuelSpentPln: 800,
        totalMaintenanceSpentPln: 400,
        totalEquipmentSpentPln: 0,
        totalDistanceKm: 1200,
        totalFuelEntriesCount: 3,
        totalMaintenanceCount: 1,
      },
      hasVehicles: true,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<VehiclesPage />);

    expect(screen.getByTestId('global-spending-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-cards-grid')).toBeInTheDocument();
    expect(screen.getByText('Work Car')).toBeInTheDocument();
  });

  it('opens CreateVehicleModal when Add Vehicle button is clicked', () => {
    vi.mocked(hooks.useAllVehiclesSummary).mockReturnValue({
      vehicles: [],
      summary: defaultMockSummary,
      hasVehicles: false,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<VehiclesPage />);

    const addBtn = screen.getByRole('button', { name: /add your first vehicle/i });
    fireEvent.click(addBtn);

    expect(screen.getByTestId('vehicle-form')).toBeInTheDocument();
  });
});
