import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { InstrumentSelectField } from './instrument-select-field';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInstruments: vi.fn(),
  };
});

const mockInstruments: investmentsApi.InvestmentInstrument[] = [
  {
    id: 'inst-1',
    name: 'Apple Inc.',
    nameNormalized: 'apple inc.',
    kind: 'share',
    currency: 'USD',
    ownerId: 'user-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('InstrumentSelectField', () => {
  it('renders select field and quick add button when onAddNewInstrument provided', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    const onChange = vi.fn();
    const onAddNew = vi.fn();

    renderWithProviders(
      <InstrumentSelectField
        value=""
        onChange={onChange}
        onAddNewInstrument={onAddNew}
      />,
    );

    const quickAddBtn = screen.getByRole('button', { name: /create new instrument/i });
    expect(quickAddBtn).toBeInTheDocument();

    fireEvent.click(quickAddBtn);
    expect(onAddNew).toHaveBeenCalled();
  });
});
