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
  VerifyEmail: () => <div>verify-email</div>,
}));

vi.mock('@named-resources/components', () => ({
  NamedResourcesPage: ({ kind }: { kind: string }) => <div>{kind}</div>,
  NamedResourcesList: ({ kind }: { kind: string }) => <div>{kind}</div>,
}));

vi.mock('@net-worth/components', () => ({
  NetWorthPage: () => <div>net-worth</div>,
  FinancialIndependencePage: () => <div>financial-independence</div>,
}));

vi.mock('@investments/components', () => ({
  InvestmentsLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PortfolioPage: () => <div>portfolio</div>,
  InvestmentsPage: () => <div>investments</div>,
  OperationsPage: () => <div>operations</div>,
  InstrumentDetailsPage: () => <div>instrument-details</div>,
}));

vi.mock('@transactions/components', () => ({
  CreateBulkTransaction: () => <div>bulk</div>,
  CreateExchangeTransaction: () => <div>exchange</div>,
  CreateInvestmentTransaction: () => <div>investment</div>,
  CreateStandardTransaction: () => <div>standard</div>,
  CreateTransaction: () => <div>new</div>,
  CreateTransferTransaction: () => <div>transfer</div>,
  TransactionAccountStatistics: () => <div>stats</div>,
  TrashedTransactionDetails: () => <div>trash-details</div>,
  TrashedTransactionsList: () => <div>trash-list</div>,
  TransactionDetails: () => <div>details</div>,
  TransactionsPage: () => <div>page</div>,
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

  it('renders net worth title on net worth page', () => {
    render(
      <MemoryRouter initialEntries={['/net-worth']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:netWorth' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders financial independence title on financial independence page', () => {
    render(
      <MemoryRouter initialEntries={['/financial-independence']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:financialIndependence' }),
    ).toBeInTheDocument();
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

  it('renders investments title on investments portfolio page', () => {
    render(
      <MemoryRouter initialEntries={['/investments/portfolio']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:investments' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders investments title on investments instruments page', () => {
    render(
      <MemoryRouter initialEntries={['/investments/instruments']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:investments' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders investments title on investments operations page', () => {
    render(
      <MemoryRouter initialEntries={['/investments/operations']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:investments' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders instrument details title on instrument details page', () => {
    render(
      <MemoryRouter initialEntries={['/investments/instruments/inst-1']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:instrumentDetails' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders categories title on categories page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/categories']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:categories' }),
    ).toBeInTheDocument();
  });

  it('renders payment methods title on payment methods page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/payment-methods']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:paymentMethods' }),
    ).toBeInTheDocument();
  });

  it('renders bank accounts title on accounts page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/accounts']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:bankAccounts' }),
    ).toBeInTheDocument();
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

  it('renders statistics title on account statistics page', () => {
    render(
      <MemoryRouter initialEntries={['/transactions/statistics']}>
        <Title />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'navigation:transactionStatistics' }),
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
