import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Title } from './title';

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}:${key}`,
  }),
}));

describe('Title', () => {
  it('renders the app title and links to root on login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Title />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'common:title' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders transactions title on transactions page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:transactions' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders transaction details title on transaction details page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/123']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:transactionDetails' }),
    ).toBeInTheDocument();
  });

  it('renders specific title on transfer create page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/new/transfer']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:newTransferTransaction' }),
    ).toBeInTheDocument();
  });

  it('renders edit title on transaction edit page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/123/edit']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:editTransaction' }),
    ).toBeInTheDocument();
  });
});
