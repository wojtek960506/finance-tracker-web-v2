import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ModalShell } from './modal-shell';

describe('ModalShell', () => {
  it('renders title, description, and children when isOpen is true', () => {
    render(
      <ModalShell
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal"
        description="This is a description"
        testId="custom-modal-shell"
      >
        <p>Modal body content</p>
      </ModalShell>,
    );

    expect(screen.getByTestId('custom-modal-shell')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.getByText('Modal body content')).toBeInTheDocument();
  });

  it('does not render content when isOpen is false', () => {
    render(
      <ModalShell
        isOpen={false}
        onClose={vi.fn()}
        title="Test Modal"
        testId="custom-modal-shell"
      >
        <p>Modal body content</p>
      </ModalShell>,
    );

    expect(screen.queryByTestId('custom-modal-shell')).not.toBeInTheDocument();
  });
});
