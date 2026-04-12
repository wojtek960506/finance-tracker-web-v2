import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Title } from './title';

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}:${key}`,
  }),
}));

vi.mock('@auth/components', () => ({
  CreateUser: () => <div>register</div>,
  Login: () => <div>login</div>,
}));

vi.mock('@named-resources/components', () => ({
  NamedResourcesList: ({ kind }: { kind: string }) => <div>{kind}</div>,
}));

vi.mock('@transactions/components', () => ({
  CreateExchangeTransaction: () => <div>exchange</div>,
  CreateStandardTransaction: () => <div>standard</div>,
  CreateTransaction: () => <div>new</div>,
  CreateTransferTransaction: () => <div>transfer</div>,
  TrashedTransactionDetails: () => <div>trash-details</div>,
  TrashedTransactionsList: () => <div>trash-list</div>,
  TransactionDetails: () => <div>details</div>,
  TransactionsList: () => <div>list</div>,
  UpdateTransaction: () => <div>update</div>,
}));

describe('Title', () => {
  it('renders a plain heading on login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Title />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'common:title' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a plain heading on register page', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Title />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'common:title' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
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

  it('renders trash title on trash page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/trash']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:transactionsTrash' }),
    ).toBeInTheDocument();
  });

  it('renders trashed transaction title on trashed transaction page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/trash/123']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:trashedTransactionDetails' }),
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
