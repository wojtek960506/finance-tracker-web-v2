import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import * as vehiclesHooks from '@vehicles/hooks';
import type { Vehicle, VehicleMaintenance } from '@vehicles/types';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@context/theme-context';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { VehicleProvider } from '../single-vehicle/context';

import { VehiclesMaintenanceContent } from './maintenance-page';

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

const mockMaintenanceItems: VehicleMaintenance[] = [
  {
    id: 'maint-1',
    ownerId: 'u-1',
    vehicleId: 'veh-123',
    section: 'own_maintenance',
    date: '2026-02-15T10:00:00Z',
    costPln: 350,
    odometerKm: 145000,
    serviceProvider: 'Auto Serwis Kowalski',
    description: 'Oil and oil filter replacement',
    transactionId: null,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'maint-2',
    ownerId: 'u-1',
    vehicleId: 'veh-123',
    section: 'previous_owner_services',
    date: '2025-11-01T12:00:00Z',
    costPln: 1200,
    odometerKm: 130000,
    serviceProvider: 'ASO Toyota',
    description: 'Timing belt kit replacement',
    transactionId: 'tx-999',
    createdAt: '2025-11-01T12:00:00Z',
    updatedAt: '2025-11-01T12:00:00Z',
  },
];

const renderMaintenancePage = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/vehicles/commuter-car/maintenance']}>
        <ThemeProvider>
          <VehicleProvider value={{ vehicle: mockVehicle }}>
            <Routes>
              <Route
                path="/vehicles/:vehicleSlug/maintenance"
                element={<VehiclesMaintenanceContent />}
              />
            </Routes>
          </VehicleProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('VehiclesMaintenanceContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state when maintenance items are fetching', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();
    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const mockRefetch = vi.fn();
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Failed to load maintenance records'),
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();
    expect(screen.getByTestId('vehicles-maintenance-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load maintenance records')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders summary cards, section tabs, filter bar, and entries table with data', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: mockMaintenanceItems,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();

    // Summary cards
    expect(screen.getByTestId('maintenance-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('maintenance-summary-cost')).toHaveTextContent(
      '350.00 PLN',
    );
    expect(screen.getByTestId('maintenance-summary-count')).toHaveTextContent('2');
    expect(screen.getByTestId('maintenance-summary-previous-owner')).toHaveTextContent(
      '1,200.00 PLN',
    );

    // Section switcher
    expect(screen.getByTestId('maintenance-section-switcher')).toBeInTheDocument();
    expect(
      screen.getByTestId('maintenance-section-tab-own_maintenance'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('maintenance-section-tab-previous_owner_services'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('maintenance-section-tab-driving_licence_costs'),
    ).not.toBeInTheDocument();

    // Filter bar
    expect(screen.getByTestId('maintenance-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('add-maintenance-button')).toBeInTheDocument();

    // Table rows
    expect(screen.getByTestId('maintenance-row-maint-1')).toBeInTheDocument();
    expect(screen.getByTestId('maintenance-row-maint-2')).toBeInTheDocument();
    expect(screen.getByTestId('maintenance-row-maint-1')).toHaveTextContent(
      'Auto Serwis Kowalski',
    );
    expect(screen.getByTestId('maintenance-row-maint-2')).toHaveTextContent('ASO Toyota');
    expect(screen.getByTestId('maintenance-linked-badge-maint-2')).toBeInTheDocument();
  });

  it('filters maintenance items by search term', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: mockMaintenanceItems,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();

    const searchInput = screen.getByTestId('maintenance-search-input');
    fireEvent.change(searchInput, { target: { value: 'Timing belt' } });

    expect(screen.getByTestId('maintenance-row-maint-2')).toBeInTheDocument();
    expect(screen.queryByTestId('maintenance-row-maint-1')).not.toBeInTheDocument();
  });

  it('changes selected section when clicking section tab', () => {
    const useMaintenanceSpy = vi.spyOn(vehiclesHooks, 'useMaintenance');
    useMaintenanceSpy.mockReturnValue({
      data: mockMaintenanceItems,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();

    const ownTab = screen.getByTestId('maintenance-section-tab-own_maintenance');
    fireEvent.click(ownTab);

    // useMaintenance should be called with section = 'own_maintenance'
    expect(useMaintenanceSpy).toHaveBeenCalledWith(
      'veh-123',
      expect.objectContaining({ section: 'own_maintenance' }),
    );
  });

  it('renders empty state when there are no maintenance items', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();
    expect(screen.getByTestId('maintenance-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('maintenance-empty-create-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('maintenance-empty-create-button'));
    expect(screen.getByTestId('create-maintenance-modal')).toBeInTheDocument();
  });

  it('opens create modal when clicking Add Maintenance button', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: mockMaintenanceItems,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();
    fireEvent.click(screen.getByTestId('add-maintenance-button'));
    expect(screen.getByTestId('create-maintenance-modal')).toBeInTheDocument();
  });

  it('opens update modal when clicking Edit button on a row', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: mockMaintenanceItems,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();
    const row = screen.getByTestId('maintenance-row-maint-1');
    const editBtn = row.querySelector('button[aria-label="Edit"]');
    expect(editBtn).toBeInTheDocument();
    if (editBtn) fireEvent.click(editBtn);

    expect(screen.getByTestId('update-maintenance-modal')).toBeInTheDocument();
  });

  it('opens delete modal when clicking Delete button on a row', () => {
    vi.spyOn(vehiclesHooks, 'useMaintenance').mockReturnValue({
      data: mockMaintenanceItems,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof vehiclesHooks.useMaintenance>);

    renderMaintenancePage();
    const row = screen.getByTestId('maintenance-row-maint-1');
    const deleteBtn = row.querySelector('button[aria-label="Delete"]');
    expect(deleteBtn).toBeInTheDocument();
    if (deleteBtn) fireEvent.click(deleteBtn);

    expect(screen.getByTestId('delete-maintenance-modal')).toBeInTheDocument();
  });
});
