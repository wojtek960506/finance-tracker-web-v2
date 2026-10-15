import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Vehicle, VehicleFuelEntryEnriched } from '@vehicles/api';
import * as vehiclesHooks from '@vehicles/hooks';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@context/theme-context';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { VehicleProvider } from '../single-vehicle/context';

import { VehiclesFuelContent } from './fuel-page';

const mockVehicle: Vehicle = {
  id: 'veh-123',
  ownerId: 'u-1',
  name: 'Commuter Car',
  slug: 'commuter-car',
  brand: 'Toyota',
  vehicleModel: 'Corolla',
  productionYear: 2020,
  type: 'car',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockFuelEntries: VehicleFuelEntryEnriched[] = [
  {
    id: 'fuel-1',
    ownerId: 'u-1',
    vehicleId: 'veh-123',
    date: '2026-03-01T10:00:00Z',
    fuelLiters: 45,
    isFullTank: true,
    unitPricePln: 6.5,
    costPln: 292.5,
    odometerKm: 150000,
    stationBrand: 'Orlen',
    stationAddress: 'Warsaw',
    consumptionLPer100Km: 7.2,
    costPerKmPln: 0.47,
    distanceSincePreviousKm: 625,
    distanceSincePreviousFullKm: 625,
    fuelLitersToFull: 45,
    costToFullPln: 292.5,
    kmPerLiter: 13.89,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'fuel-2',
    ownerId: 'u-1',
    vehicleId: 'veh-123',
    date: '2026-03-15T12:00:00Z',
    fuelLiters: 40,
    isFullTank: true,
    unitPricePln: 6.6,
    costPln: 264,
    odometerKm: 150600,
    stationBrand: 'Shell',
    stationAddress: 'Krakow',
    consumptionLPer100Km: 6.67,
    costPerKmPln: 0.44,
    distanceSincePreviousKm: 600,
    distanceSincePreviousFullKm: 600,
    fuelLitersToFull: 40,
    costToFullPln: 264,
    kmPerLiter: 15.0,
    createdAt: '',
    updatedAt: '',
  },
];

const renderFuelPage = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/vehicles/commuter-car/fuel']}>
        <ThemeProvider>
          <VehicleProvider value={{ vehicle: mockVehicle }}>
            <Routes>
              <Route
                path="/vehicles/:vehicleSlug/fuel"
                element={<VehiclesFuelContent />}
              />
            </Routes>
          </VehicleProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('VehiclesFuelContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state when fuel entries are fetching', () => {
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const mockRefetch = vi.fn();
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Failed to load fuel entries'),
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    expect(screen.getByTestId('vehicles-fuel-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load fuel entries')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders summary cards, filter bar, and entries table with data', () => {
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: mockFuelEntries,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();

    // Summary cards
    expect(screen.getByTestId('fuel-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('fuel-summary-volume')).toHaveTextContent('85.00 L');
    expect(screen.getByTestId('fuel-summary-cost')).toHaveTextContent('556.50 PLN');

    // Filter bar
    expect(screen.getByTestId('fuel-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('add-fuel-entry-button')).toBeInTheDocument();

    // Table rows
    expect(screen.getByTestId('fuel-row-fuel-1')).toBeInTheDocument();
    expect(screen.getByTestId('fuel-row-fuel-2')).toBeInTheDocument();
    expect(screen.getByText('Orlen')).toBeInTheDocument();
    expect(screen.getByText('Shell')).toBeInTheDocument();
  });

  it('renders empty state when there are no fuel entries', () => {
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    expect(screen.getByTestId('fuel-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('fuel-empty-create-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('fuel-empty-create-button'));
    expect(screen.getByTestId('create-fuel-modal')).toBeInTheDocument();
  });

  it('opens create modal when clicking Add Refueling button', () => {
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: mockFuelEntries,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    fireEvent.click(screen.getByTestId('add-fuel-entry-button'));
    expect(screen.getByTestId('create-fuel-modal')).toBeInTheDocument();
  });
});
