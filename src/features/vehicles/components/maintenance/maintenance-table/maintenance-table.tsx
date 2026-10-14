import { MAINTENANCE_SECTIONS } from '@vehicles/consts';

import { MaintenanceEmptyState } from './maintenance-empty-state';
import { MaintenanceSectionCollapsible } from './maintenance-section-collapsible';
import type { MaintenanceTableProps } from './types';

export const MaintenanceTable = ({
  items,
  hasFilters,
  onEditItem,
  onDeleteItem,
  onAddFirstItem,
}: MaintenanceTableProps) => {
  if (items.length === 0) {
    return (
      <MaintenanceEmptyState hasFilters={hasFilters} onAddFirstItem={onAddFirstItem} />
    );
  }

  return (
    <div className="flex flex-col gap-4" data-testid="maintenance-entries-list">
      {MAINTENANCE_SECTIONS.map((sec) => {
        const sectionItems = items.filter((item) => item.section === sec);
        if (sectionItems.length === 0) return null;

        return (
          <MaintenanceSectionCollapsible
            key={sec}
            section={sec}
            items={sectionItems}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        );
      })}
    </div>
  );
};
