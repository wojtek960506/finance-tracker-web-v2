import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import type {
  Vehicle,
  VehicleEquipment,
  VehicleEquipmentWithSummaryResponse,
} from '@vehicles/api';
import * as vehiclesHooks from '@vehicles/hooks';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@context/theme-context';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { VehicleProvider } from '../single-vehicle/context';

import { VehiclesEquipmentContent } from './equipment-page';

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

const mockEquipmentItems: VehicleEquipment[] = [
  {
    id: 'eq-1',
    ownerId: 'u-1',
    vehicleId: 'veh-123',
    date: '2026-02-10T10:00:00Z',
    itemName: 'Winter Tires',
    costPln: 1800,
    description: 'Michelin Alpin 6',
    transactionId: null,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'eq-2',
    ownerId: 'u-1',
    vehicleId: 'veh-123',
    date: '2026-03-01T12:00:00Z',
    itemName: 'Dashcam',
    costPln: 450,
    description: '70mai A800S 4K front and rear',
    transactionId: null,
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
];

const mockEquipmentResponse: VehicleEquipmentWithSummaryResponse = {
  items: mockEquipmentItems,
  summary: {
    totalCostPln: 2250,
    totalItems: 2,
  },
  pagination: {
    nextCursor: null,
    hasMore: false,
    total: 2,
  },
};

const renderEquipmentPage = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/vehicles/commuter-car/equipment']}>
        <ThemeProvider>
          <VehicleProvider value={{ vehicle: mockVehicle }}>
            <Routes>
              <Route
                path="/vehicles/:vehicleSlug/equipment"
                element={<VehiclesEquipmentContent />}
              />
            </Routes>
          </VehicleProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('VehiclesEquipmentContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state when equipment items are fetching', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();
    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const mockRefetch = vi.fn();
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Failed to load equipment'),
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();
    expect(screen.getByTestId('vehicles-equipment-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load equipment')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders summary cards, filter bar, and entries table with data', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: mockEquipmentResponse,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();

    // Summary cards
    expect(screen.getByTestId('equipment-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-summary-cost')).toHaveTextContent(
      '2,250.00 PLN',
    );
    expect(screen.getByTestId('equipment-summary-count')).toHaveTextContent('2');

    // Filter bar
    expect(screen.getByTestId('equipment-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('add-equipment-button')).toBeInTheDocument();

    // Table rows
    expect(screen.getByTestId('equipment-row-eq-1')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-row-eq-2')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-row-eq-1')).toHaveTextContent('Winter Tires');
    expect(screen.getByTestId('equipment-row-eq-2')).toHaveTextContent('Dashcam');
  });

  it('filters equipment items by search term', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: mockEquipmentResponse,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();

    const searchInput = screen.getByTestId('equipment-search-input');
    fireEvent.change(searchInput, { target: { value: 'Dashcam' } });

    expect(screen.getByTestId('equipment-row-eq-2')).toBeInTheDocument();
    expect(screen.queryByTestId('equipment-row-eq-1')).not.toBeInTheDocument();
  });

  it('renders empty state when there are no equipment items', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: {
        items: [],
        summary: { totalCostPln: 0, totalItems: 0 },
        pagination: { nextCursor: null, hasMore: false, total: 0 },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();
    expect(screen.queryByTestId('equipment-summary-cards')).not.toBeInTheDocument();
    expect(screen.queryByTestId('equipment-filter-bar')).not.toBeInTheDocument();
    expect(screen.getByTestId('equipment-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-empty-create-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('equipment-empty-create-button'));
    expect(screen.getByTestId('create-equipment-modal')).toBeInTheDocument();
  });

  it('opens create modal when clicking Add Equipment button', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: mockEquipmentResponse,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();
    fireEvent.click(screen.getByTestId('add-equipment-button'));
    expect(screen.getByTestId('create-equipment-modal')).toBeInTheDocument();
  });

  it('opens update modal when clicking Edit button on a row', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: mockEquipmentResponse,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();
    const row = screen.getByTestId('equipment-row-eq-1');
    const editBtn = row.querySelector('button[aria-label="Edit"]');
    expect(editBtn).toBeInTheDocument();
    if (editBtn) fireEvent.click(editBtn);

    expect(screen.getByTestId('update-equipment-modal')).toBeInTheDocument();
  });

  it('opens delete modal when clicking Delete button on a row', () => {
    vi.spyOn(vehiclesHooks, 'useEquipment').mockReturnValue({
      data: mockEquipmentResponse,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useEquipment>);

    renderEquipmentPage();
    const row = screen.getByTestId('equipment-row-eq-1');
    const deleteBtn = row.querySelector('button[aria-label="Delete"]');
    expect(deleteBtn).toBeInTheDocument();
    if (deleteBtn) fireEvent.click(deleteBtn);

    expect(screen.getByTestId('delete-equipment-modal')).toBeInTheDocument();
  });
});
