import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import type {
  Vehicle,
  VehicleFuelEntryEnriched,
  VehicleFuelWithSummaryResponse,
} from '@vehicles/api';
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

const mockFuelResponse: VehicleFuelWithSummaryResponse = {
  items: mockFuelEntries,
  summary: {
    totalVolume: 85,
    totalCostPln: 556.5,
    avgConsumptionLPer100Km: 6.67,
    avgUnitPricePln: 6.55,
    totalCount: 2,
  },
  pagination: {
    nextCursor: null,
    hasMore: false,
    total: 2,
  },
};

const createMockInfiniteData = (response: VehicleFuelWithSummaryResponse) => ({
  pages: [response],
  pageParams: [undefined],
});

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
      data: createMockInfiniteData(mockFuelResponse),
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
      data: createMockInfiniteData({
        items: [],
        summary: {
          totalVolume: 0,
          totalCostPln: 0,
          avgConsumptionLPer100Km: null,
          avgUnitPricePln: null,
          totalCount: 0,
        },
        pagination: { nextCursor: null, hasMore: false, total: 0 },
      }),
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    expect(screen.queryByTestId('fuel-summary-cards')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fuel-filter-bar')).not.toBeInTheDocument();
    expect(screen.getByTestId('fuel-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('fuel-empty-create-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('fuel-empty-create-button'));
    expect(screen.getByTestId('create-fuel-modal')).toBeInTheDocument();
  });

  it('opens create modal when clicking Add Refueling button', () => {
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: createMockInfiniteData(mockFuelResponse),
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

  it('opens LinkSpendingModal when clicking link action button', () => {
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: createMockInfiniteData(mockFuelResponse),
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    const linkBtns = screen.getAllByTitle('Link to transaction');
    expect(linkBtns.length).toBeGreaterThan(0);

    fireEvent.click(linkBtns[0]);
    expect(screen.getByTestId('link-spending-modal')).toBeInTheDocument();
  });

  it('renders linked transaction badge and opens UnlinkSpendingModal', () => {
    const entryWithTx: VehicleFuelEntryEnriched = {
      ...mockFuelEntries[0],
      transactionId: 'tx-123',
    };
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: createMockInfiniteData({
        ...mockFuelResponse,
        items: [entryWithTx],
      }),
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    const linkedBadges = screen.getAllByTestId('linked-transaction-badge');
    expect(linkedBadges.length).toBeGreaterThan(0);
    expect(linkedBadges[0]).toHaveAttribute('href', '/transactions/tx-123');

    const unlinkBtn = screen.getByTitle('Unlink from transaction');
    fireEvent.click(unlinkBtn);
    expect(screen.getByTestId('delete-unlink-spending-modal')).toBeInTheDocument();
  });

  it('renders pagination footer and calls fetchNextPage on load more click', () => {
    const fetchNextPage = vi.fn();
    vi.spyOn(vehiclesHooks, 'useFuelEntries').mockReturnValue({
      data: createMockInfiniteData({
        ...mockFuelResponse,
        pagination: { nextCursor: 'c-2', hasMore: true, total: 100 },
      }),
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
    } as unknown as ReturnType<typeof vehiclesHooks.useFuelEntries>);

    renderFuelPage();
    const loadMoreBtn = screen.getByTestId('fuel-entries-list-load-more-button');
    expect(loadMoreBtn).toBeInTheDocument();
    fireEvent.click(loadMoreBtn);
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
