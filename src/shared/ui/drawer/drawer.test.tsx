import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from './drawer';

describe('Drawer', () => {
  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <Drawer isOpen fromLeft onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    const overlay = container.querySelector('div.fixed.inset-0');
    expect(overlay).toBeInTheDocument();

    await user.click(overlay as HTMLElement);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Drawer isOpen fromLeft onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: 'Close drawer' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed while open', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Drawer isOpen fromLeft onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('renders from the right when fromLeft is false', () => {
    const { container } = render(
      <Drawer isOpen={false} fromLeft={false} onClose={() => {}}>
        <div>Content</div>
      </Drawer>,
    );

    const panel = container.querySelector('div.fixed.flex');
    expect(panel).toHaveClass('right-0');
    expect(panel).toHaveClass('translate-x-full');
  });

  it('renders closed state when fromLeft is true', () => {
    const { container } = render(
      <Drawer isOpen={false} fromLeft onClose={() => {}}>
        <div>Content</div>
      </Drawer>,
    );

    const panel = container.querySelector('div.fixed.flex');
    expect(panel).toHaveClass('left-0');
    expect(panel).toHaveClass('-translate-x-full');
  });

  it('makes closed drawer content inert and hidden from assistive technologies', () => {
    const { container } = render(
      <Drawer isOpen={false} fromLeft onClose={() => {}}>
        <a href="/transactions">Transactions</a>
      </Drawer>,
    );

    const panel = container.querySelector('div.fixed.flex');

    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');
  });

  it('renders open state when fromLeft is false', () => {
    const { container } = render(
      <Drawer isOpen fromLeft={false} onClose={() => {}}>
        <div>Content</div>
      </Drawer>,
    );

    const panel = container.querySelector('div.fixed.flex');
    expect(panel).toHaveClass('right-0');
    expect(panel).toHaveClass('translate-x-0');
  });

  it('uses dialog semantics when open', () => {
    render(
      <Drawer isOpen fromLeft onClose={() => {}} ariaLabel="Navigation menu">
        <div>Content</div>
      </Drawer>,
    );

    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toHaveAttribute(
      'aria-modal',
      'true',
    );
  });

  it('focuses the first navigation element when opened', () => {
    render(
      <Drawer isOpen fromLeft onClose={() => {}}>
        <a href="/transactions">Transactions</a>
      </Drawer>,
    );

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveFocus();
  });

  it('restores focus to the opener when closed', () => {
    const restoreFocusRef = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <>
        <button ref={restoreFocusRef} type="button">
          Open navigation
        </button>
        <Drawer isOpen fromLeft onClose={() => {}} restoreFocusRef={restoreFocusRef}>
          <a href="/transactions">Transactions</a>
        </Drawer>
      </>,
    );

    rerender(
      <>
        <button ref={restoreFocusRef} type="button">
          Open navigation
        </button>
        <Drawer
          isOpen={false}
          fromLeft
          onClose={() => {}}
          restoreFocusRef={restoreFocusRef}
        >
          <a href="/transactions">Transactions</a>
        </Drawer>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus();
  });

  it('keeps Tab navigation inside the drawer', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Outside action</button>
        <Drawer isOpen fromLeft onClose={() => {}}>
          <a href="/transactions">Transactions</a>
        </Drawer>
      </>,
    );

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveFocus();

    await user.tab();

    expect(screen.getByRole('button', { name: 'Close drawer' })).toHaveFocus();
  });

  it('keeps reverse Tab navigation inside the drawer', async () => {
    const user = userEvent.setup();

    render(
      <Drawer isOpen fromLeft onClose={() => {}}>
        <a href="/transactions">Transactions</a>
      </Drawer>,
    );

    await user.tab({ shift: true });

    expect(screen.getByRole('button', { name: 'Close drawer' })).toHaveFocus();

    await user.tab({ shift: true });

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveFocus();
  });
});
