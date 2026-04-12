import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthFormShell } from './auth-form-shell';

describe('AuthFormShell', () => {
  it('renders children in the default auth form layout', () => {
    render(
      <AuthFormShell>
        <input aria-label="Email" />
      </AuthFormShell>,
    );

    const input = screen.getByLabelText('Email');
    const form = input.closest('form');

    expect(input).toBeInTheDocument();
    expect(form).toHaveClass('flex', 'flex-col');
    expect(form).toHaveAttribute('autocomplete', 'off');
  });

  it('accepts form props and custom className', () => {
    const onSubmit = vi.fn();

    const { container } = render(
      <AuthFormShell
        className="custom-form"
        aria-label="Auth form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        <button type="submit">Submit</button>
      </AuthFormShell>,
    );

    const form = container.querySelector('form');

    expect(form).toHaveAttribute('aria-label', 'Auth form');

    fireEvent.submit(form!);

    expect(form).toHaveClass('custom-form');
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
