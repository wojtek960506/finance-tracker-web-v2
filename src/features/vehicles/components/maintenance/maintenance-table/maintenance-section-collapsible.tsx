import type { MaintenanceSection } from '@vehicles/types';
import { formatPln } from '@vehicles/utils';
import clsx from 'clsx';
import { ClipboardList, Wrench } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Collapsible } from '@shared/ui';

import { MaintenanceMobileCard } from './maintenance-mobile-card';
import { MaintenanceTableRow } from './maintenance-table-row';
import type { MaintenanceSectionCollapsibleProps } from './types';

const SECTION_CONFIG: Record<
  MaintenanceSection,
  {
    icon: ReactNode;
  }
> = {
  ownMaintenance: {
    icon: <Wrench className="size-4 text-bt-primary" />,
  },
  previousOwnerServices: {
    icon: <ClipboardList className="size-4 text-amber-500" />,
  },
};

export const MaintenanceSectionCollapsible = ({
  section,
  items,
  onEditItem,
  onDeleteItem,
  isInitiallyOpen = true,
}: MaintenanceSectionCollapsibleProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const totalCost = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.costPln || 0), 0);
  }, [items]);

  const headerContent = (
    <div className="flex w-full min-w-0 items-center justify-between gap-3 text-left">
      <div className="flex min-w-0 items-center gap-2">
        {SECTION_CONFIG[section].icon}
        <span className="truncate text-xs font-semibold text-fg sm:text-sm">
          {t(`maintenancePage.sections.${section}`)}
        </span>
        <span
          className={clsx(
            'rounded-full px-2 py-0.5 text-[11px] font-bold',
            'bg-muted text-text-muted',
          )}
        >
          {items.length}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-xs font-bold text-fg sm:text-sm">
          {formatPln(totalCost, lang)}
        </span>
      </div>
    </div>
  );

  return (
    <Card
      className="overflow-hidden p-0 shadow-none border border-border bg-card-bg"
      data-testid={`maintenance-section-collapsible-${section}`}
    >
      <Collapsible
        header={headerContent}
        indicatorPosition="left"
        isInitiallyOpen={isInitiallyOpen}
        triggerMode="full-row"
        contentInset="none"
        triggerClassName={clsx(
          'w-full justify-between p-3 sm:p-3.5',
          'transition-colors hover:bg-muted/30',
        )}
        contentClassName="border-t border-border"
      >
        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-text-muted">
              <tr>
                <th className="px-3 py-2.5 font-medium">
                  {t('maintenancePage.table.date')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('maintenancePage.table.serviceProvider')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('maintenancePage.table.odometer')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('maintenancePage.table.cost')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('maintenancePage.table.description')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('maintenancePage.table.linked')}
                </th>
                <th className="px-3 py-2.5 text-right font-medium">
                  {t('maintenancePage.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <MaintenanceTableRow
                  key={item.id}
                  item={item}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item)}
                  showSectionBadge={false}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-2.5 p-3 lg:hidden">
          {items.map((item) => (
            <MaintenanceMobileCard
              key={item.id}
              item={item}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item)}
            />
          ))}
        </div>
      </Collapsible>
    </Card>
  );
};
