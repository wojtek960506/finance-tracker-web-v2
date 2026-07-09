import { useQueryClient } from '@tanstack/react-query';
import {
  Banknote,
  Bike,
  Car,
  Landmark,
  LogOut,
  Settings,
  Tags,
  Trash2,
  WalletCards,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { logout } from '@auth/api';
import { useNavigation } from '@context/navigation-context';
import { useAuthToken } from '@shared/hooks';
import { useUIStore } from '@store/ui-store';
import { Collapsible } from '@ui';

import { NavigationItem } from './navigation-item';

const TRANSACTIONS_NAVIGATION_ITEM_ID = 'transactions';

export const Navigation = () => {
  const { t } = useTranslation('navigation');

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  const { fromLeft } = useNavigation();
  const { expandedNavigationItems, setNavigationItemExpanded, resetPersistedUIState } =
    useUIStore();
  const isTransactionsNavigationItemOpen = expandedNavigationItems.includes(
    TRANSACTIONS_NAVIGATION_ITEM_ID,
  );

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
        <Collapsible
          header={
            <NavigationItem
              to="/transactions"
              title={t('transactions')}
              Icon={Banknote}
              end
              additionalAction={() =>
                setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, false)
              }
            />
          }
          indicatorPosition={fromLeft ? 'left' : 'right'}
          isOpen={isTransactionsNavigationItemOpen}
          onOpenChange={(isOpen) =>
            setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, isOpen)
          }
        >
          <ul>
            <li>
              <NavigationItem
                to="/categories"
                title={t('categories')}
                Icon={Tags}
                additionalAction={() =>
                  setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, true)
                }
              />
            </li>
            <li>
              <NavigationItem
                to="/paymentMethods"
                title={t('paymentMethods')}
                Icon={WalletCards}
                additionalAction={() =>
                  setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, true)
                }
              />
            </li>
            <li>
              <NavigationItem
                to="/accounts"
                title={t('bankAccounts')}
                Icon={Landmark}
                additionalAction={() =>
                  setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, true)
                }
              />
            </li>
            <li>
              <NavigationItem
                to="/transactions/statistics"
                title={t('transactionStatistics')}
                Icon={Banknote}
                additionalAction={() =>
                  setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, true)
                }
              />
            </li>
            <li>
              <NavigationItem
                to="/transactions/trash"
                title={t('transactionsTrash')}
                Icon={Trash2}
                additionalAction={() =>
                  setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, true)
                }
              />
            </li>
          </ul>
        </Collapsible>
      </li>

      <li>
        <NavigationItem
          to="/vehicles"
          title={t('vehicles')}
          Icon={Car}
          additionalAction={() =>
            setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, false)
          }
        />
      </li>
      <li>
        <NavigationItem
          to="/sports"
          title={t('sports')}
          Icon={Bike}
          additionalAction={() =>
            setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, false)
          }
        />
      </li>
      <li>
        <NavigationItem
          to="/settings"
          title={t('settings')}
          Icon={Settings}
          additionalAction={() =>
            setNavigationItemExpanded(TRANSACTIONS_NAVIGATION_ITEM_ID, false)
          }
        />
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
