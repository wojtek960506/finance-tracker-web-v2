import { type ReactNode } from 'react';
import { matchPath, Navigate } from 'react-router-dom';

import { Login } from '@auth/components';
import { NamedResourcesList } from '@named-resources/components';
import {
  CreateTransaction,
  TransactionDetails,
  TransactionsList,
} from '@transactions/components';

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
];

export const PROTECTED_APP_ROUTES: AppRouteConfig[] = [
  {
    path: '/transactions',
    element: <TransactionsList />,
    title: { namespace: 'navigation', key: 'transactions' },
  },
  {
    path: '/transactions/new',
    element: <CreateTransaction />,
    title: { namespace: 'navigation', key: 'newTransaction' },
  },
  {
    path: '/transactions/:transactionId',
    element: <TransactionDetails />,
    title: { namespace: 'navigation', key: 'transactionDetails' },
  },
  {
    path: '/categories',
    element: <NamedResourcesList kind="categories" />,
    title: { namespace: 'navigation', key: 'categories' },
  },
  {
    path: '/paymentMethods',
    element: <NamedResourcesList kind="paymentMethods" />,
    title: { namespace: 'navigation', key: 'paymentMethods' },
  },
  {
    path: '/accounts',
    element: <NamedResourcesList kind="accounts" />,
    title: { namespace: 'navigation', key: 'bankAccounts' },
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
