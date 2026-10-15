import type { MaintenanceSection } from '@vehicles/types';
import clsx from 'clsx';
import { ClipboardList, Wrench } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type MaintenanceSectionBadgeProps = {
  section: MaintenanceSection;
  className?: string;
};

const SECTION_CONFIG: Record<
  MaintenanceSection,
  { icon: ReactNode; bgClass: string; textClass: string }
> = {
  ownMaintenance: {
    icon: <Wrench className="size-3" />,
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500',
  },
  previousOwnerServices: {
    icon: <ClipboardList className="size-3" />,
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-500',
  },
};

export const MaintenanceSectionBadge = ({
  section,
  className,
}: MaintenanceSectionBadgeProps) => {
  const { t } = useTranslation('vehicles');
  const config = SECTION_CONFIG[section] ?? SECTION_CONFIG.ownMaintenance;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold',
        config.bgClass,
        config.textClass,
        className,
      )}
      data-testid={`maintenance-section-badge-${section}`}
    >
      {config.icon}
      <span>{t(`maintenancePage.sections.${section}`)}</span>
    </span>
  );
};
