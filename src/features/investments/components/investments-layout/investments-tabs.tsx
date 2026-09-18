import clsx from 'clsx';
import { ArrowLeftRight, Layers, PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { ICON_CLASS_NAME } from '@shared/consts';

export const InvestmentsTabs = () => {
  const { t } = useTranslation('investments');

  const tabs = [
    {
      to: '/investments/portfolio',
      label: t('tabs.portfolio'),
      Icon: PieChart,
    },
    {
      to: '/investments/instruments',
      label: t('tabs.instruments'),
      Icon: Layers,
    },
    {
      to: '/investments/operations',
      label: t('tabs.operations'),
      Icon: ArrowLeftRight,
    },
  ];

  return (
    <nav
      aria-label="Investments navigation"
      className="flex items-center gap-2 border-b border-border pb-2"
    >
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-2 rounded-lg px-3 py-1.5',
              'text-sm font-medium transition-colors sm:text-base',
              isActive
                ? 'bg-fg text-bg shadow-sm'
                : 'text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
            )
          }
        >
          <Icon className={ICON_CLASS_NAME} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
