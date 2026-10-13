import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import * as vehiclesHooks from '@vehicles/hooks';
import type { Vehicle, VehicleOverviewData } from '@vehicles/types';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@context/theme-context';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { VehicleProvider } from '../single-vehicle/context';

import { VehiclesOverviewContent } from './overview-page';

const mockVehicle: Vehicle = {
  id: 'veh-123',
  ownerId: 'u-1',
  name: 'Daily Commuter',
  slug: 'daily-commuter',
  brand: 'Toyota',
  vehicleModel: 'Corolla',
  productionYear: 2020,
  type: 'car',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockOverviewData: VehicleOverviewData = {
  totalSpentPln: 1450,
  fuel: {
    totalSpentPln: 600,
    totalLiters: 100,
    avgConsumptionLPer100Km: 6.8,
    costPerKmPln: 0.42,
    entriesCount: 3,
  },
  maintenance: {
    totalSpentPln: 650,
    entriesCount: 2,
    bySection: {
      own_maintenance: { costPln: 400, count: 1 },
      previous_owner_services: { costPln: 250, count: 1 },
      driving_licence_costs: { costPln: 0, count: 0 },
    },
  },
  equipment: {
    totalSpentPln: 200,
    entriesCount: 1,
  },
  stats: {
    currentOdometerKm: 85200,
    minOdometerKm: 84000,
    totalDistanceKm: 1200,
    refuelingCount: 3,
    maintenanceCount: 2,
    equipmentCount: 1,
  },
  recentActivity: [
    {
      id: 'eq-1',
      type: 'equipment',
      date: '2026-03-10T12:00:00Z',
      costPln: 200,
      title: 'Roof Rack',
      description: 'Aerodynamic roof rack',
    },
    {
      id: 'm-1',
      type: 'maintenance',
      date: '2026-03-05T12:00:00Z',
      costPln: 400,
      title: 'Oil & Filter Replacement',
      maintenanceSection: 'own_maintenance',
      odometerKm: 84800,
    },
    {
      id: 'f-1',
      type: 'fuel',
      date: '2026-03-01T10:00:00Z',
      costPln: 250,
      title: 'Orlen Station',
      fuelLiters: 40,
      isFullTank: true,
      consumptionLPer100Km: 6.5,
      odometerKm: 84400,
      transactionId: 'tx-123',
    },
  ],
};

const renderOverview = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/vehicles/daily-commuter']}>
        <ThemeProvider>
          <VehicleProvider value={{ vehicle: mockVehicle }}>
            <Routes>
              <Route
                path="/vehicles/:vehicleSlug"
                element={<VehiclesOverviewContent />}
              />
            </Routes>
          </VehicleProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('VehiclesOverviewContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state when overview data is fetching', () => {
    vi.spyOn(vehiclesHooks, 'useVehicleOverview').mockReturnValue({
      overviewData: {
        totalSpentPln: 0,
        fuel: {
          totalSpentPln: 0,
          totalLiters: 0,
          avgConsumptionLPer100Km: null,
          costPerKmPln: null,
          entriesCount: 0,
        },
        maintenance: {
          totalSpentPln: 0,
          entriesCount: 0,
          bySection: {
            own_maintenance: { costPln: 0, count: 0 },
            previous_owner_services: { costPln: 0, count: 0 },
            driving_licence_costs: { costPln: 0, count: 0 },
          },
        },
        equipment: { totalSpentPln: 0, entriesCount: 0 },
        stats: {
          currentOdometerKm: null,
          minOdometerKm: null,
          totalDistanceKm: null,
          refuelingCount: 0,
          maintenanceCount: 0,
          equipmentCount: 0,
        },
        recentActivity: [],
      },
      fuelEntries: [],
      maintenanceEntries: [],
      equipmentEntries: [],
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderOverview();
    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const mockRefetch = vi.fn();
    vi.spyOn(vehiclesHooks, 'useVehicleOverview').mockReturnValue({
      overviewData: {
        totalSpentPln: 0,
        fuel: {
          totalSpentPln: 0,
          totalLiters: 0,
          avgConsumptionLPer100Km: null,
          costPerKmPln: null,
          entriesCount: 0,
        },
        maintenance: {
          totalSpentPln: 0,
          entriesCount: 0,
          bySection: {
            own_maintenance: { costPln: 0, count: 0 },
            previous_owner_services: { costPln: 0, count: 0 },
            driving_licence_costs: { costPln: 0, count: 0 },
          },
        },
        equipment: { totalSpentPln: 0, entriesCount: 0 },
        stats: {
          currentOdometerKm: null,
          minOdometerKm: null,
          totalDistanceKm: null,
          refuelingCount: 0,
          maintenanceCount: 0,
          equipmentCount: 0,
        },
        recentActivity: [],
      },
      fuelEntries: [],
      maintenanceEntries: [],
      equipmentEntries: [],
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Failed to load overview'),
      refetch: mockRefetch,
    });

    renderOverview();
    expect(screen.getByTestId('vehicles-overview-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load overview')).toBeInTheDocument();
  });

  it('renders vehicle stats cards, spending breakdown, and recent activity', () => {
    vi.spyOn(vehiclesHooks, 'useVehicleOverview').mockReturnValue({
      overviewData: mockOverviewData,
      fuelEntries: [],
      maintenanceEntries: [],
      equipmentEntries: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderOverview();

    // Stats cards
    expect(screen.getByTestId('stats-card-odometer')).toHaveTextContent('85,200 km');
    expect(screen.getByTestId('stats-card-distance')).toHaveTextContent('+1,200 km');
    expect(screen.getByTestId('stats-card-fuel')).toHaveTextContent('3');
    expect(screen.getByTestId('stats-card-maintenance')).toHaveTextContent('2');

    // Spending breakdown cards
    expect(screen.getByTestId('breakdown-card-fuel')).toBeInTheDocument();
    expect(screen.getByTestId('breakdown-card-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('breakdown-card-equipment')).toBeInTheDocument();
    expect(screen.getByText('1,450.00 PLN')).toBeInTheDocument();

    // Recent activity feed
    expect(screen.getByTestId('recent-activity-feed')).toBeInTheDocument();
    expect(screen.getByTestId('activity-row-eq-1')).toHaveTextContent('Roof Rack');
    expect(screen.getByTestId('activity-row-m-1')).toHaveTextContent(
      'Oil & Filter Replacement',
    );
    expect(screen.getByTestId('activity-row-f-1')).toHaveTextContent('Orlen Station');
    expect(screen.getByText('Linked')).toBeInTheDocument();
  });

  it('renders empty activity state when no entries exist', () => {
    vi.spyOn(vehiclesHooks, 'useVehicleOverview').mockReturnValue({
      overviewData: {
        totalSpentPln: 0,
        fuel: {
          totalSpentPln: 0,
          totalLiters: 0,
          avgConsumptionLPer100Km: null,
          costPerKmPln: null,
          entriesCount: 0,
        },
        maintenance: {
          totalSpentPln: 0,
          entriesCount: 0,
          bySection: {
            own_maintenance: { costPln: 0, count: 0 },
            previous_owner_services: { costPln: 0, count: 0 },
            driving_licence_costs: { costPln: 0, count: 0 },
          },
        },
        equipment: { totalSpentPln: 0, entriesCount: 0 },
        stats: {
          currentOdometerKm: null,
          minOdometerKm: null,
          totalDistanceKm: null,
          refuelingCount: 0,
          maintenanceCount: 0,
          equipmentCount: 0,
        },
        recentActivity: [],
      },
      fuelEntries: [],
      maintenanceEntries: [],
      equipmentEntries: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderOverview();
    expect(screen.getByTestId('activity-empty-state')).toBeInTheDocument();
  });
});
