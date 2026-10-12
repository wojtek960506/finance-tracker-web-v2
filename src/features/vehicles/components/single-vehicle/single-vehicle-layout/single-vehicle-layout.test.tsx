import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@context/theme-context';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as vehiclesApi from '../../../api';
import type { Vehicle } from '../../../types';

import { SingleVehicleLayout } from './single-vehicle-layout';

const mockVehicle: Vehicle = {
  id: 'veh-abc',
  ownerId: 'user-1',
  name: 'Commuter Car',
  slug: 'commuter-car',
  brand: 'Honda',
  vehicleModel: 'Civic',
  productionYear: 2019,
  type: 'car',
  notes: 'Reliable daily runner',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const renderLayout = (initialRoute = '/vehicles/commuter-car') => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider>
          <Routes>
            <Route
              path="/vehicles/:vehicleSlug"
              element={
                <SingleVehicleLayout>
                  <div data-testid="test-content">Dashboard Content</div>
                </SingleVehicleLayout>
              }
            />
            <Route path="/vehicles" element={<div>Vehicles Fleet List</div>} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SingleVehicleLayout', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading indicator when fetching vehicle details', () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockImplementation(() => new Promise(() => {}));

    renderLayout();

    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders not found card when vehicle does not exist or fetch fails', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockRejectedValueOnce(
      new Error('Vehicle not found'),
    );

    renderLayout();

    const notFoundCard = await screen.findByTestId('single-vehicle-not-found');
    expect(notFoundCard).toBeInTheDocument();
    expect(screen.getByText(/vehicle not found/i)).toBeInTheDocument();

    const backLink = screen.getByRole('link', { name: /back to all vehicles/i });
    expect(backLink).toHaveAttribute('href', '/vehicles');
  });

  it('renders vehicle header, badge, navigation tabs, and children on success', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockResolvedValueOnce(mockVehicle);

    renderLayout();

    await screen.findByTestId('single-vehicle-layout');

    // Header info
    expect(screen.getByText('Commuter Car')).toBeInTheDocument();
    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic • 2019')).toBeInTheDocument();
    expect(screen.getByText('Reliable daily runner')).toBeInTheDocument();

    // Back link
    const backLink = screen.getByRole('link', { name: /back to all vehicles/i });
    expect(backLink).toHaveAttribute('href', '/vehicles');

    // Navigation tabs
    const overviewTab = screen.getByRole('link', { name: /overview/i });
    expect(overviewTab).toHaveAttribute('href', '/vehicles/commuter-car');

    const fuelTab = screen.getByRole('link', { name: /fuel/i });
    expect(fuelTab).toHaveAttribute('href', '/vehicles/commuter-car/fuel');

    const equipmentTab = screen.getByRole('link', { name: /equipment/i });
    expect(equipmentTab).toHaveAttribute('href', '/vehicles/commuter-car/equipment');

    const maintenanceTab = screen.getByRole('link', { name: /maintenance/i });
    expect(maintenanceTab).toHaveAttribute('href', '/vehicles/commuter-car/maintenance');

    // Child content
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('opens edit vehicle modal when clicking Edit button', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockResolvedValueOnce(mockVehicle);

    renderLayout();

    await screen.findByTestId('single-vehicle-layout');

    const editBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editBtn);

    expect(
      await screen.findByRole('heading', { name: /edit vehicle/i }),
    ).toBeInTheDocument();
  });

  it('opens delete vehicle modal when clicking Delete button', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockResolvedValueOnce(mockVehicle);

    renderLayout();

    await screen.findByTestId('single-vehicle-layout');

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(
      await screen.findByText(/are you sure you want to delete commuter car/i),
    ).toBeInTheDocument();
  });

  it('falls back to vehicle id when vehicle has no slug', async () => {
    const vehicleWithoutSlug: Vehicle = {
      ...mockVehicle,
      id: 'id-fallback-999',
      slug: undefined as unknown as string,
    };
    vi.spyOn(vehiclesApi, 'getVehicle').mockResolvedValueOnce(vehicleWithoutSlug);

    renderLayout('/vehicles/id-fallback-999');

    await screen.findByTestId('single-vehicle-layout');

    const overviewTab = screen.getByRole('link', { name: /overview/i });
    expect(overviewTab).toHaveAttribute('href', '/vehicles/id-fallback-999');

    const fuelTab = screen.getByRole('link', { name: /fuel/i });
    expect(fuelTab).toHaveAttribute('href', '/vehicles/id-fallback-999/fuel');
  });
});
