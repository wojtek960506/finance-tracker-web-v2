import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastStore } from '@store/toast-store';

import { Toaster } from './toaster';

describe('Toaster', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when there are no toasts', () => {
    const { container } = render(<Toaster />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders toast content from the store', () => {
    useToastStore.setState({
      toasts: [
        {
          id: 'toast-1',
          title: 'Update failed',
          message: 'Resource already exists.',
          variant: 'error',
          visibilityTime: 5,
        },
      ],
    });

    render(<Toaster />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Update failed')).toBeInTheDocument();
    expect(screen.getByText('Resource already exists.')).toBeInTheDocument();
  });

  it('renders a title-only toast without an empty message row', () => {
    useToastStore.setState({
      toasts: [
        {
          id: 'toast-1',
          title: 'Deleted category "Groceries"',
          variant: 'success',
          visibilityTime: 5,
        },
      ],
    });

    render(<Toaster />);

    expect(screen.getByText('Deleted category "Groceries"')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('removes toast when dismiss button is clicked', async () => {
    const user = userEvent.setup();

    useToastStore.setState({
      toasts: [
        {
          id: 'toast-1',
          message: 'Dismiss me',
          variant: 'info',
          visibilityTime: 5,
        },
      ],
    });

    render(<Toaster />);
    expect(useToastStore.getState().toasts).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('removes toast automatically after visibility time', () => {
    vi.useFakeTimers();

    useToastStore.setState({
      toasts: [
        {
          id: 'toast-1',
          message: 'Auto close',
          variant: 'success',
          visibilityTime: 2,
        },
      ],
    });

    render(<Toaster />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
