import type { MaintenanceSection } from '@vehicles/api';
import clsx from 'clsx';
import { ClipboardList, Wrench } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type MaintenanceSectionSwitcherProps = {
  activeSection: MaintenanceSection;
  onSectionChange: (section: MaintenanceSection) => void;
};

const SECTIONS: Array<{
  key: MaintenanceSection;
  icon: ReactNode;
}> = [
  {
    key: 'ownMaintenance',
    icon: <Wrench className="size-4" />,
  },
  {
    key: 'previousOwnerServices',
    icon: <ClipboardList className="size-4" />,
  },
];

export const MaintenanceSectionSwitcher = ({
  activeSection,
  onSectionChange,
}: MaintenanceSectionSwitcherProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1 rounded-xl p-1',
        'border border-border bg-card-bg shadow-sm',
      )}
      role="tablist"
      aria-label={t('maintenancePage.filter.section')}
      data-testid="maintenance-section-switcher"
    >
      {SECTIONS.map(({ key, icon }) => {
        const isActive = activeSection === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-testid={`maintenance-section-tab-${key}`}
            onClick={() => onSectionChange(key)}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-1.5',
              'text-xs font-semibold sm:px-4 sm:text-sm',
              'transition-all duration-150',
              isActive
                ? 'bg-bt-primary text-bt-primary-subtle shadow-sm'
                : 'text-text-muted hover:bg-muted/70 hover:text-fg',
            )}
          >
            {icon}
            <span>{t(`maintenancePage.sections.${key}`)}</span>
          </button>
        );
      })}
    </div>
  );
};
