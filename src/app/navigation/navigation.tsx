import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  Banknote,
  Bike,
  Car,
  ChartNoAxesColumn,
  Landmark,
  LogOut,
  PieChart,
  Settings,
  ShieldCheck,
  Tags,
  Trash2,
  WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { logout } from '@auth/api';
import { useNavigation } from '@context/navigation-context';
import { useAuthToken } from '@shared/hooks';
import { useUIStore } from '@store/ui-store';
import { Collapsible } from '@ui';

import { NavigationItem } from './navigation-item';

export const Navigation = () => {
  const { t } = useTranslation('navigation');

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  const { fromLeft } = useNavigation();
  const { resetPersistedUIState } = useUIStore();

  const isTransactionsRoute = pathname.startsWith('/transactions');
  const isSportsRoute = pathname.startsWith('/sports');
  const isTransactionsChildActive = isTransactionsRoute && pathname !== '/transactions';
  const isSportsChildActive = isSportsRoute && pathname !== '/sports';

  const [isTransactionsOpen, setIsTransactionsOpen] = useState(isTransactionsRoute);
  const [isSportsOpen, setIsSportsOpen] = useState(isSportsRoute);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isTransactionsRoute) {
      setIsTransactionsOpen(true);
    }
    if (isSportsRoute) {
      setIsSportsOpen(true);
    }
  }

  if (!authToken) return;

  const handleLogout = async () => {
    await queryClient.cancelQueries();
    removeAuthToken();
    queryClient.clear();
    resetPersistedUIState();
    navigate('/login', { replace: true });
    void logout().catch(() => undefined);
  };

  return (
    <ul className="text-base sm:text-lg">
      <li>
        <NavigationItem to="/net-worth" title={t('netWorth')} Icon={PieChart} />
      </li>
      <li>
        <NavigationItem
          to="/financial-independence"
          title={t('financialIndependence')}
          Icon={ShieldCheck}
        />
      </li>

      <li>
        <Collapsible
          header={
            <NavigationItem
              to="/transactions"
              title={t('transactions')}
              Icon={Banknote}
              end
            />
          }
          indicatorPosition={fromLeft ? 'left' : 'right'}
          indicatorClassName={clsx(isTransactionsChildActive && 'text-active-nav')}
          isOpen={isTransactionsOpen}
          onOpenChange={setIsTransactionsOpen}
        >
          <ul>
            <li>
              <NavigationItem
                to="/transactions/categories"
                title={t('categories')}
                Icon={Tags}
              />
            </li>
            <li>
              <NavigationItem
                to="/transactions/payment-methods"
                title={t('paymentMethods')}
                Icon={WalletCards}
              />
            </li>
            <li>
              <NavigationItem
                to="/transactions/accounts"
                title={t('bankAccounts')}
                Icon={Landmark}
              />
            </li>
            <li>
              <NavigationItem
                to="/transactions/statistics"
                title={t('transactionStatistics')}
                Icon={Banknote}
              />
            </li>
            <li>
              <NavigationItem
                to="/transactions/trash"
                title={t('transactionsTrash')}
                Icon={Trash2}
              />
            </li>
          </ul>
        </Collapsible>
      </li>

      <li>
        <NavigationItem
          to="/investments"
          title={t('investments')}
          Icon={ChartNoAxesColumn}
        />
      </li>
      <li>
        <NavigationItem to="/vehicles" title={t('vehicles')} Icon={Car} />
      </li>
      <li>
        <Collapsible
          header={<NavigationItem to="/sports" title={t('sports')} Icon={Bike} end />}
          indicatorPosition={fromLeft ? 'left' : 'right'}
          indicatorClassName={clsx(isSportsChildActive && 'text-active-nav')}
          isOpen={isSportsOpen}
          onOpenChange={setIsSportsOpen}
        >
          <ul>
            <li>
              <NavigationItem
                to="/sports/categories"
                title={t('categories')}
                Icon={Tags}
              />
            </li>
          </ul>
        </Collapsible>
      </li>
      <li>
        <NavigationItem to="/settings" title={t('settings')} Icon={Settings} />
      </li>
      <li>
        <NavigationItem
          additionalAction={handleLogout}
          title={t('logout')}
          Icon={LogOut}
        />
      </li>
    </ul>
  );
};
