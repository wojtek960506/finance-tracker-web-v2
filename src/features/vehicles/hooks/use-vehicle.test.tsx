import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import type { Vehicle } from '../api';
import * as vehiclesApi from '../api';

import { useVehicle } from './use-vehicle';

const mockVehicle: Vehicle = {
  id: 'veh-1',
  ownerId: 'user-1',
  name: 'My Toyota',
  slug: 'my-toyota',
  brand: 'Toyota',
  vehicleModel: 'Corolla',
  productionYear: 2020,
  type: 'car',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const createWrapper =
  (initialRoute = '/vehicles/my-toyota') =>
  ({ children }: { children: ReactNode }) => {
    const queryClient = createTestQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/vehicles/:vehicleSlug" element={<>{children}</>} />
            <Route path="/vehicles" element={<>{children}</>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

describe('useVehicle', () => {
  it('resolves vehicle by route param', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockResolvedValueOnce(mockVehicle);

    const { result } = renderHook(() => useVehicle(), {
      wrapper: createWrapper('/vehicles/my-toyota'),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.vehicleSlug).toBe('my-toyota');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.vehicle).toEqual(mockVehicle);
    expect(vehiclesApi.getVehicle).toHaveBeenCalledWith('my-toyota');
  });

  it('resolves vehicle using explicit vehicleSlug parameter', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockResolvedValueOnce(mockVehicle);

    const { result } = renderHook(() => useVehicle('custom-slug'), {
      wrapper: createWrapper('/vehicles'),
    });

    expect(result.current.vehicleSlug).toBe('custom-slug');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.vehicle).toEqual(mockVehicle);
    expect(vehiclesApi.getVehicle).toHaveBeenCalledWith('custom-slug');
  });

  it('handles vehicle fetch error', async () => {
    vi.spyOn(vehiclesApi, 'getVehicle').mockRejectedValueOnce(
      new Error('Vehicle not found'),
    );

    const { result } = renderHook(() => useVehicle('non-existent'), {
      wrapper: createWrapper('/vehicles'),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Vehicle not found');
    expect(result.current.vehicle).toBeUndefined();
  });
});
