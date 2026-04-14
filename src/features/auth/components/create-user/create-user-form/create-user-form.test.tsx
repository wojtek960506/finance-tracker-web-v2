import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateUserForm } from './create-user-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CreateUserForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderCreateUserForm = (
    props?: Partial<Parameters<typeof CreateUserForm>[0]>,
  ) => {
    const onSubmit = vi.fn();

    render(
      <MemoryRouter>
        <CreateUserForm isPending={false} onSubmit={onSubmit} {...props} />
      </MemoryRouter>,
    );

    return { onSubmit };
  };

  it('focuses first name input on initial render and disables submit by default', () => {
    renderCreateUserForm();

    expect(screen.getByRole('button', { name: 'createAccount' })).toBeDisabled();
  });

  it('focuses first name input on initial render', async () => {
    renderCreateUserForm();

    await waitFor(() => {
      expect(screen.getByLabelText('firstName')).toHaveFocus();
    });
  });

  it('submits valid trimmed form values', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderCreateUserForm();

    await user.type(screen.getByLabelText('firstName'), '  John  ');
    await user.type(screen.getByLabelText('lastName'), '  Doe  ');
    await user.type(screen.getByLabelText('email'), '  john@example.com  ');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.type(screen.getByLabelText('confirmPassword'), 'secret');
    await user.click(screen.getByRole('button', { name: 'createAccount' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'secret',
        confirmPassword: 'secret',
      });
    });
  });

  it('shows translated errors after invalid blur and prevents submit', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderCreateUserForm();

    await user.type(screen.getByLabelText('firstName'), 'J');
    await user.tab();
    await user.type(screen.getByLabelText('lastName'), 'Doe');
    await user.tab();
    await user.type(screen.getByLabelText('email'), 'invalid');
    await user.tab();
    await user.type(screen.getByLabelText('password'), '12');
    await user.tab();
    await user.type(screen.getByLabelText('confirmPassword'), '13');
    await user.tab();

    expect(screen.getByText('firstNameTooShort')).toBeInTheDocument();
    expect(screen.getByText('invalidEmailFormat')).toBeInTheDocument();
    expect(screen.getByText('passwordTooShort')).toBeInTheDocument();
    expect(screen.getByText('passwordsDoNotMatch')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'createAccount' })).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps submit disabled when pending', async () => {
    const user = userEvent.setup();

    renderCreateUserForm({ isPending: true });

    await user.type(screen.getByLabelText('firstName'), 'John');
    await user.type(screen.getByLabelText('lastName'), 'Doe');
    await user.type(screen.getByLabelText('email'), 'john@example.com');
    await user.type(screen.getByLabelText('password'), 'secret');
    await user.type(screen.getByLabelText('confirmPassword'), 'secret');

    expect(screen.getByRole('button', { name: 'createAccount' })).toBeDisabled();
  });

  it('renders link back to login', () => {
    renderCreateUserForm();

    expect(screen.getByRole('link', { name: 'backToLogin' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
