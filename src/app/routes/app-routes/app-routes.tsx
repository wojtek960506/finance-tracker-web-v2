import { lazy, type ReactNode } from 'react';
import { matchPath, Navigate } from 'react-router-dom';

const Login = lazy(() => import('@auth/components').then((m) => ({ default: m.Login })));
const CreateUser = lazy(() =>
  import('@auth/components').then((m) => ({ default: m.CreateUser })),
);
const VerifyEmail = lazy(() =>
  import('@auth/components').then((m) => ({ default: m.VerifyEmail })),
);

const NetWorthPage = lazy(() =>
  import('@net-worth/components').then((m) => ({ default: m.NetWorthPage })),
);
const FinancialIndependencePage = lazy(() =>
  import('@net-worth/components').then((m) => ({
    default: m.FinancialIndependencePage,
  })),
);

const NamedResourcesPage = lazy(() =>
  import('@named-resources/components').then((m) => ({
    default: m.NamedResourcesPage,
  })),
);

const TransactionsPage = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.TransactionsPage,
  })),
);
const TrashedTransactionsList = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.TrashedTransactionsList,
  })),
);
const TrashedTransactionDetails = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.TrashedTransactionDetails,
  })),
);
const CreateTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.CreateTransaction,
  })),
);
const CreateStandardTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.CreateStandardTransaction,
  })),
);
const CreateInvestmentTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.CreateInvestmentTransaction,
  })),
);
const CreateTransferTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.CreateTransferTransaction,
  })),
);
const CreateExchangeTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.CreateExchangeTransaction,
  })),
);
const CreateBulkTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.CreateBulkTransaction,
  })),
);
const TransactionAccountStatistics = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.TransactionAccountStatistics,
  })),
);
const UpdateTransaction = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.UpdateTransaction,
  })),
);
const TransactionDetails = lazy(() =>
  import('@transactions/components').then((m) => ({
    default: m.TransactionDetails,
  })),
);

const PortfolioPage = lazy(() =>
  import('@investments/components').then((m) => ({
    default: m.PortfolioPage,
  })),
);
const InvestmentsPage = lazy(() =>
  import('@investments/components').then((m) => ({
    default: m.InvestmentsPage,
  })),
);
const OperationsPage = lazy(() =>
  import('@investments/components').then((m) => ({
    default: m.OperationsPage,
  })),
);
const InstrumentDetailsPage = lazy(() =>
  import('@investments/components').then((m) => ({
    default: m.InstrumentDetailsPage,
  })),
);

type RouteTitle = {
  key: string;
  namespace: 'common' | 'navigation';
};

type AppRouteConfig = {
  element: ReactNode;
  path: string;
  title?: RouteTitle;
};

export const PUBLIC_APP_ROUTES: AppRouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
    title: { namespace: 'common', key: 'title' },
  },
  {
    path: '/register',
    element: <CreateUser />,
    title: { namespace: 'common', key: 'title' },
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
    title: { namespace: 'common', key: 'title' },
  },
];

export const PROTECTED_APP_ROUTES: AppRouteConfig[] = [
  {
    path: '/net-worth',
    element: <NetWorthPage />,
    title: { namespace: 'navigation', key: 'netWorth' },
  },
  {
    path: '/financial-independence',
    element: <FinancialIndependencePage />,
    title: { namespace: 'navigation', key: 'financialIndependence' },
  },
  {
    path: '/net-worth/independence',
    element: <Navigate to="/financial-independence" replace />,
  },
  {
    path: '/transactions',
    element: <TransactionsPage />,
    title: { namespace: 'navigation', key: 'transactions' },
  },

  {
    path: '/transactions/trash',
    element: <TrashedTransactionsList />,
    title: { namespace: 'navigation', key: 'transactionsTrash' },
  },
  {
    path: '/transactions/trash/:transactionId',
    element: <TrashedTransactionDetails />,
    title: { namespace: 'navigation', key: 'trashedTransactionDetails' },
  },
  {
    path: '/transactions/new',
    element: <CreateTransaction />,
    title: { namespace: 'navigation', key: 'newTransaction' },
  },
  {
    path: '/transactions/new/standard',
    element: <CreateStandardTransaction />,
    title: { namespace: 'navigation', key: 'newStandardTransaction' },
  },
  {
    path: '/transactions/new/investment',
    element: <CreateInvestmentTransaction />,
    title: { namespace: 'navigation', key: 'newInvestmentTransaction' },
  },
  {
    path: '/transactions/new/transfer',
    element: <CreateTransferTransaction />,
    title: { namespace: 'navigation', key: 'newTransferTransaction' },
  },
  {
    path: '/transactions/new/exchange',
    element: <CreateExchangeTransaction />,
    title: { namespace: 'navigation', key: 'newExchangeTransaction' },
  },
  {
    path: '/transactions/new/bulk',
    element: <CreateBulkTransaction />,
    title: { namespace: 'navigation', key: 'newBulkTransaction' },
  },
  {
    path: '/transactions/statistics',
    element: <TransactionAccountStatistics />,
    title: { namespace: 'navigation', key: 'transactionStatistics' },
  },
  {
    path: '/transactions/categories',
    element: <NamedResourcesPage kind="categories" />,
    title: { namespace: 'navigation', key: 'categories' },
  },
  {
    path: '/transactions/payment-methods',
    element: <NamedResourcesPage kind="paymentMethods" />,
    title: { namespace: 'navigation', key: 'paymentMethods' },
  },
  {
    path: '/transactions/accounts',
    element: <NamedResourcesPage kind="accounts" />,
    title: { namespace: 'navigation', key: 'bankAccounts' },
  },
  {
    path: '/transactions/:transactionId/edit',
    element: <UpdateTransaction />,
    title: { namespace: 'navigation', key: 'editTransaction' },
  },
  {
    path: '/transactions/:transactionId',
    element: <TransactionDetails />,
    title: { namespace: 'navigation', key: 'transactionDetails' },
  },
  {
    path: '/investments',
    element: <Navigate to="/investments/portfolio" replace />,
  },
  {
    path: '/investments/portfolio',
    element: <PortfolioPage />,
    title: { namespace: 'navigation', key: 'investments' },
  },
  {
    path: '/investments/instruments',
    element: <InvestmentsPage />,
    title: { namespace: 'navigation', key: 'investments' },
  },
  {
    path: '/investments/operations',
    element: <OperationsPage />,
    title: { namespace: 'navigation', key: 'investments' },
  },
  {
    path: '/investments/instruments/:id',
    element: <InstrumentDetailsPage />,
    title: { namespace: 'navigation', key: 'instrumentDetails' },
  },
  {
    path: '/vehicles',
    element: <p>Vehicles will be there</p>,
    title: { namespace: 'navigation', key: 'vehicles' },
  },
  {
    path: '/sports',
    element: <p>Sports will be there</p>,
    title: { namespace: 'navigation', key: 'sports' },
  },
  {
    path: '/settings',
    element: <p>Settings will be there</p>,
    title: { namespace: 'navigation', key: 'settings' },
  },
];

const APP_ROUTES = [...PUBLIC_APP_ROUTES, ...PROTECTED_APP_ROUTES];

export const getMatchedRouteTitle = (pathname: string) =>
  APP_ROUTES.find((route) => route.title && matchPath(route.path, pathname))?.title;
