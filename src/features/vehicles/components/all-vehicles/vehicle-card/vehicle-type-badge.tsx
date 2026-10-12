import type { VehicleType } from '@vehicles/types';
import clsx from 'clsx';
import { Bike, Bus, Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type VehicleTypeBadgeProps = {
  type: VehicleType;
  className?: string;
};

export const VehicleTypeBadge = ({ type, className }: VehicleTypeBadgeProps) => {
  const { t } = useTranslation('vehicles');

  const config = (() => {
    switch (type) {
      case 'motorcycle':
        return {
          Icon: Bike,
          label: t('types.motorcycle'),
          colorClass:
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
      case 'public_transport':
        return {
          Icon: Bus,
          label: t('types.public_transport'),
          colorClass:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        };
      case 'car':
      default:
        return {
          Icon: Car,
          label: t('types.car'),
          colorClass:
            'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        };
    }
  })();

  const { Icon, label, colorClass } = config;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'text-xs font-medium',
        colorClass,
        className,
      )}
    >
      <Icon className="size-3.5" />
      <span>{label}</span>
    </span>
  );
};
