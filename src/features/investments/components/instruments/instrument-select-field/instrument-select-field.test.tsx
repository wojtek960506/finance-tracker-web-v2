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

vi.mock('@/components/ui/combobox', () => ({
  Combobox: ({
    value,
    disabled,
    children,
  }: {
    value?: { id: string; name: string } | null;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <span>value:{value?.id ?? 'unset'}</span>
      <span>{disabled ? 'disabled' : 'enabled'}</span>
      {children}
    </div>
  ),
  ComboboxInput: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
  ComboboxContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="combobox-content">{children}</div>
  ),
  ComboboxEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComboboxList: ({
    children,
  }: {
    children:
      | ((item: {
          id: string;
          name: string;
          kind: string;
          currency: string;
        }) => React.ReactNode)
      | React.ReactNode;
  }) =>
    typeof children === 'function' ? (
      <div>
        {children({ id: 'inst-1', name: 'Apple Inc.', kind: 'share', currency: 'USD' })}
      </div>
    ) : (
      <div>{children}</div>
    ),
  ComboboxItem: ({
    children,
    value,
    disabled,
  }: {
    children: React.ReactNode;
    value: { id: string; name: string };
    disabled?: boolean;
  }) => (
    <div>
      <span>item-value:{value.id}</span>
      <span>{disabled ? 'item-disabled' : 'item-enabled'}</span>
      {children}
    </div>
  ),
}));

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

  it('renders quick add button with menu placement when requested', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    const onChange = vi.fn();
    const onAddNew = vi.fn();

    renderWithProviders(
      <InstrumentSelectField
        value=""
        onChange={onChange}
        onAddNewInstrument={onAddNew}
        addNewPlacement="menu"
      />,
    );

    const quickAddBtn = screen.getByRole('button', {
      name: /create new instrument/i,
    });
    expect(quickAddBtn).toBeInTheDocument();

    fireEvent.click(quickAddBtn);
    expect(onAddNew).toHaveBeenCalled();
  });
});
