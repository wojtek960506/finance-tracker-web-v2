import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} ariaLabel="Confirm action">
        <div>Content</div>
      </Modal>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('uses dialog semantics when open', () => {
    render(
      <Modal isOpen onClose={() => {}} ariaLabel="Confirm action">
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Confirm action' })).toHaveAttribute(
      'aria-modal',
      'true',
    );
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <Modal isOpen onClose={onClose} ariaLabel="Confirm action">
        <div>Content</div>
      </Modal>,
    );

    const overlay = container.querySelector('div.fixed.inset-0.bg-fg\\/50');
    expect(overlay).toBeInTheDocument();

    await user.click(overlay as HTMLElement);

    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when the panel itself is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} ariaLabel="Confirm action">
        <button type="button">Confirm</button>
      </Modal>,
    );

    await user.click(screen.getByRole('dialog', { name: 'Confirm action' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed while open', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} ariaLabel="Confirm action">
        <button type="button">Confirm</button>
      </Modal>,
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('focuses the first focusable element when opened', () => {
    render(
      <Modal isOpen onClose={() => {}} ariaLabel="Confirm action">
        <button type="button">Confirm</button>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
  });

  it('keeps Tab navigation inside the modal', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Outside action</button>
        <Modal isOpen onClose={() => {}} ariaLabel="Confirm action">
          <button type="button">Confirm</button>
          <button type="button">Cancel</button>
        </Modal>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
  });

  it('keeps reverse Tab navigation inside the modal', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen onClose={() => {}} ariaLabel="Confirm action">
        <button type="button">Confirm</button>
        <button type="button">Cancel</button>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('keeps focus on the panel when no focusable elements are found', () => {
    const { container } = render(
      <Modal isOpen onClose={() => {}} ariaLabel="Confirm action">
        <div>Content</div>
      </Modal>,
    );

    const panel = container.querySelector('div[role="dialog"]');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveFocus();

    vi.spyOn(panel as HTMLDivElement, 'querySelectorAll').mockReturnValue([] as never);

    fireEvent.keyDown(document, { key: 'Tab' });

    expect(panel).toHaveFocus();
  });

  it('restores focus to the opener when closed', () => {
    const restoreFocusRef = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <>
        <button ref={restoreFocusRef} type="button">
          Open modal
        </button>
        <Modal
          isOpen
          onClose={() => {}}
          ariaLabel="Confirm action"
          restoreFocusRef={restoreFocusRef}
        >
          <button type="button">Confirm</button>
        </Modal>
      </>,
    );

    rerender(
      <>
        <button ref={restoreFocusRef} type="button">
          Open modal
        </button>
        <Modal
          isOpen={false}
          onClose={() => {}}
          ariaLabel="Confirm action"
          restoreFocusRef={restoreFocusRef}
        >
          <button type="button">Confirm</button>
        </Modal>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Open modal' })).toHaveFocus();
  });
});
