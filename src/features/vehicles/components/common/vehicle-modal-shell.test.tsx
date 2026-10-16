import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleModalShell } from './vehicle-modal-shell';

describe('VehicleModalShell', () => {
  it('does not render modal when isOpen is false', () => {
    render(
      <VehicleModalShell
        isOpen={false}
        onClose={vi.fn()}
        title="Test Modal"
        testId="test-modal"
      >
        <div>Modal Body</div>
      </VehicleModalShell>,
    );

    expect(screen.queryByTestId('test-modal')).not.toBeInTheDocument();
  });

  it('renders title, description, and children when isOpen is true', () => {
    render(
      <VehicleModalShell
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal Title"
        description="Test Modal Description"
        testId="test-modal"
      >
        <div>Modal Body Content</div>
      </VehicleModalShell>,
    );

    expect(screen.getByTestId('test-modal')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Test Modal Title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Test Modal Description')).toBeInTheDocument();
    expect(screen.getByText('Modal Body Content')).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    render(
      <VehicleModalShell
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal Without Description"
        testId="test-modal"
      >
        <div>Only Body</div>
      </VehicleModalShell>,
    );

    expect(screen.getByTestId('test-modal')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Test Modal Without Description' }),
    ).toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <VehicleModalShell
        isOpen={true}
        onClose={handleClose}
        title="Escape Test"
        testId="escape-modal"
      >
        <div>Content</div>
      </VehicleModalShell>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
