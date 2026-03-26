import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dropdown } from './dropdown';

describe('Dropdown', () => {
  it('toggles open state and calls item action', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown
        trigger={<button type="button">Open</button>}
        items={[{ label: 'Profile', onSelect }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const item = screen.getByRole('button', { name: 'Profile' });
    expect(item).toBeInTheDocument();

    await user.click(item);

    expect(onSelect).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Profile' })).not.toBeInTheDocument();
    });
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Dropdown
          trigger={<button type="button">Menu</button>}
          items={[{ label: 'Item', onSelect: () => {} }]}
        />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('button', { name: 'Item' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Item' })).not.toBeInTheDocument();
    });
  });

  it('renders item icons when provided', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        trigger={<button type="button">Open</button>}
        items={[{ label: 'Settings', icon: <span>Icon</span>, onSelect: () => {} }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByText('Icon')).toBeInTheDocument();
  });
});
