import { MAINTENANCE_SECTIONS } from '@vehicles/consts';
import clsx from 'clsx';
import { ClipboardList, Layers, Wrench } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { MaintenanceSectionFilter } from './types';

export type MaintenanceSectionSwitcherProps = {
  selectedSection: MaintenanceSectionFilter;
  onSectionChange: (section: MaintenanceSectionFilter) => void;
  sectionCounts?: Record<MaintenanceSectionFilter, number>;
  className?: string;
};

const SECTION_ICONS: Record<MaintenanceSectionFilter, ReactNode> = {
  all: <Layers className="size-3.5" />,
  own_maintenance: <Wrench className="size-3.5" />,
  previous_owner_services: <ClipboardList className="size-3.5" />,
};

export const MaintenanceSectionSwitcher = ({
  selectedSection,
  onSectionChange,
  sectionCounts,
  className,
}: MaintenanceSectionSwitcherProps) => {
  const { t } = useTranslation('vehicles');

  const options: MaintenanceSectionFilter[] = ['all', ...MAINTENANCE_SECTIONS];

  return (
    <div
      className={clsx('flex flex-wrap items-center gap-1.5 sm:gap-2', className)}
      data-testid="maintenance-section-switcher"
    >
      {options.map((sec) => {
        const isSelected = selectedSection === sec;
        const count = sectionCounts?.[sec];

        return (
          <button
            key={sec}
            type="button"
            onClick={() => onSectionChange(sec)}
            data-testid={`maintenance-section-tab-${sec}`}
            className={clsx(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              'transition-colors duration-150',
              isSelected
                ? 'bg-bt-primary text-bt-primary-fg shadow-sm'
                : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-fg',
            )}
          >
            {SECTION_ICONS[sec]}
            <span>{t(`maintenancePage.sections.${sec}`)}</span>
            {typeof count === 'number' && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isSelected
                    ? 'bg-white/20 text-bt-primary-fg'
                    : 'bg-muted text-text-muted',
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
