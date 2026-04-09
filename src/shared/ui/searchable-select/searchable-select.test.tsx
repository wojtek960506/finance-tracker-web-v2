import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchableSelect } from './searchable-select';

vi.mock('@ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
}));

const groups = [
  {
    key: 'favorites',
    label: 'Favorites',
    options: [
      {
        value: 'apple',
        label: 'Apple',
        hint: 'Fruit',
        searchText: 'Red fruit',
        icon: <span data-testid="apple-icon">A</span>,
      },
    ],
  },
  {
    key: 'others',
    options: [
      {
        value: 'banana',
        label: 'Banana',
        hint: 'Yellow fruit',
        searchText: 'Yellow',
      },
      {
        value: 'disabled',
        label: 'Disabled',
        disabled: true,
      },
    ],
  },
];

describe('SearchableSelect', () => {
  it('renders a provided selected option with its icon', () => {
    render(
      <SearchableSelect
        value="missing"
        groups={groups}
        onChange={() => {}}
        placeholder="Pick one"
        searchPlaceholder="Search"
        emptyMessage="Nothing found"
        selectedOption={{
          value: 'provided',
          label: 'Provided option',
          icon: <span data-testid="provided-icon">P</span>,
        }}
      />,
    );

    expect(screen.getByText('Provided option')).toBeInTheDocument();
    expect(screen.getByTestId('provided-icon')).toBeInTheDocument();
  });

  it('opens, filters, selects options, and handles overlay/escape closing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <SearchableSelect
        value="banana"
        groups={groups}
        onChange={onChange}
        placeholder="Pick one"
        searchPlaceholder="Search"
        emptyMessage="Nothing found"
        footer={<div>Footer actions</div>}
      />,
    );

    await user.click(screen.getByRole('button', { name: /banana/i }));

    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toHaveFocus();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Yellow fruit')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /disabled/i })).toBeDisabled();

    await user.clear(searchInput);
    await user.type(searchInput, 'zzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, 'apple');

    const option = screen.getByRole('option', { name: /apple/i });
    fireEvent.mouseDown(option);
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith('apple');
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /banana/i }));
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /banana/i }));
    await user.type(screen.getByPlaceholderText('Search'), 'banana');
    await user.click(screen.getByRole('button', { name: /banana/i }));
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /banana/i }));
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    const overlay = container.querySelector('button.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    await user.click(overlay as HTMLElement);
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /banana/i }));
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('button', { name: /banana/i }), {
      key: 'ArrowUp',
    });
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('button', { name: /banana/i }), {
      key: 'ArrowDown',
    });
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  it('renders selected option styles for options with icons', async () => {
    const user = userEvent.setup();

    render(
      <SearchableSelect
        value="apple"
        groups={groups}
        onChange={() => {}}
        placeholder="Pick one"
        searchPlaceholder="Search"
        emptyMessage="Nothing found"
      />,
    );

    await user.click(screen.getByRole('button', { name: /apple/i }));

    const option = screen.getByRole('option', { name: /apple/i });
    expect(option).toHaveClass('bg-bt-primary');
    expect(option.querySelector('[data-testid="apple-icon"]')?.parentElement).toHaveClass(
      'text-white',
    );
  });

  it('uses controlled open state and notifies about open changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <SearchableSelect
        value=""
        groups={groups}
        onChange={() => {}}
        placeholder="Pick one"
        searchPlaceholder="Search"
        emptyMessage="Nothing found"
        isOpen={false}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /pick one/i }));
    fireEvent.keyDown(screen.getByRole('button', { name: /pick one/i }), {
      key: 'Enter',
    });
    fireEvent.keyDown(screen.getByRole('button', { name: /pick one/i }), { key: ' ' });

    expect(onOpenChange).toHaveBeenNthCalledWith(1, true);
    expect(onOpenChange).toHaveBeenNthCalledWith(2, true);
    expect(onOpenChange).toHaveBeenNthCalledWith(3, true);
  });
});
