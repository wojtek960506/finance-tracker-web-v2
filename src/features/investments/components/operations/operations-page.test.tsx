import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { OperationsPage } from './operations-page';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInstruments: vi.fn(),
    getOperations: vi.fn(),
  };
});

describe('OperationsPage', () => {
  it('renders operations list within investments layout', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue([]);
    vi.mocked(investmentsApi.getOperations).mockResolvedValue([]);

    renderWithProviders(<OperationsPage />);

    expect(await screen.findByTestId('operations-list')).toBeInTheDocument();
  });
});
