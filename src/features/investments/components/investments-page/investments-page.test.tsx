import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { InvestmentsPage } from './investments-page';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInstruments: vi.fn(),
  };
});

describe('InvestmentsPage', () => {
  it('renders instruments list within investments page', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue([]);

    renderWithProviders(<InvestmentsPage />);

    expect(await screen.findByTestId('instruments-list')).toBeInTheDocument();
  });
});
