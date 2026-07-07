import { render, screen } from '@testing-library/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { NamedResourceFilterField } from './named-resource-field';

const mocks = vi.hoisted(() => ({
  getNamedResources: vi.fn(),
  multiSelectProps: null as null | {
    groups: Array<{ key: string; label?: string; options: Array<{ label: string }> }>;
  },
  setValue: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: mocks.getNamedResources(), isLoading: false }),
}));

vi.mock('react-hook-form', () => ({
  Controller: ({
    render,
  }: {
    render: (args: { field: { value: string[]; onChange: () => void } }) => ReactNode;
  }) =>
    render({
      field: {
        value: [],
        onChange: vi.fn(),
      },
    }),
  useFormContext: () => ({ control: {}, setValue: mocks.setValue }),
  useWatch: () => 'include',
}));

vi.mock('@shared/ui', () => ({
  Button: ({ children }: PropsWithChildren) => <button type="button">{children}</button>,
}));

vi.mock('../filter-field-label', () => ({
  FilterFieldLabel: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

vi.mock('@/components/ui/multi-select', () => ({
  MultiSelect: (props: { groups: Array<{ key: string; label?: string; options: Array<{ label: string }> }> }) => {
    mocks.multiSelectProps = props;
    return <div data-testid="multi-select" />;
  },
}));

describe('NamedResourceFilterField', () => {
  it('sorts multi-select options by displayed label within each group', () => {
    mocks.getNamedResources.mockReturnValue([
      {
        id: 'fav-z',
        name: 'Zoo',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'zoo',
        isFavorite: true,
      },
      {
        id: 'fav-a',
        name: 'Alpha',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'alpha',
        isFavorite: true,
      },
      {
        id: 'other-t',
        name: 'Travel',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'travel',
        isFavorite: false,
      },
      {
        id: 'other-b',
        name: 'Beta',
        ownerId: 'user-1',
        type: 'user',
        nameNormalized: 'beta',
        isFavorite: false,
      },
    ]);

    render(<NamedResourceFilterField kind="categories" includeSystem />);

    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
    expect(mocks.multiSelectProps?.groups).toHaveLength(2);
    expect(mocks.multiSelectProps?.groups[0].options.map((option) => option.label)).toEqual([
      'Alpha',
      'Zoo',
    ]);
    expect(mocks.multiSelectProps?.groups[1].options.map((option) => option.label)).toEqual([
      'Beta',
      'Travel',
    ]);
  });
});
