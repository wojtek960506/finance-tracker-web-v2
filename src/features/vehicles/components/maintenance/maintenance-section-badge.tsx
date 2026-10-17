import type { MaintenanceSection } from '@vehicles/api';
import { MAINTENANCE_SECTION_CONFIG } from '@vehicles/consts';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export type MaintenanceSectionBadgeProps = {
  section: MaintenanceSection;
  className?: string;
};

export const MaintenanceSectionBadge = ({
  section,
  className,
}: MaintenanceSectionBadgeProps) => {
  const { t } = useTranslation('vehicles');
  const config =
    MAINTENANCE_SECTION_CONFIG[section] ?? MAINTENANCE_SECTION_CONFIG.ownMaintenance;
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold',
        config.badgeClass,
        className,
      )}
      data-testid={`maintenance-section-badge-${section}`}
    >
      <Icon className="size-3" />
      <span>{t(`maintenancePage.sections.${section}`)}</span>
    </span>
  );
};
