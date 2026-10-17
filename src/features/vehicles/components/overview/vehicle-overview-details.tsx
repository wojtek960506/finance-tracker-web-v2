import {
  DeleteVehicleModal,
  UpdateVehicleModal,
} from '@vehicles/components/vehicle-modals';
import clsx from 'clsx';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@shared/ui';

import { useVehicleContext } from '../single-vehicle';

export const VehicleOverviewDetails = () => {
  const { t } = useTranslation('vehicles');
  const navigate = useNavigate();
  const { vehicle, refetchVehicle } = useVehicleContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const brandModel = [vehicle.brand, vehicle.vehicleModel].filter(Boolean).join(' ');
  const subtitle = [brandModel, vehicle.productionYear].filter(Boolean).join(' • ');

  return (
    <Card
      className={clsx(
        'flex-row items-center justify-between gap-4 rounded-2xl',
        'border-border bg-card-bg p-3.5 sm:p-4',
      )}
      data-testid="vehicle-overview-details"
    >
      {/* Details (brand, model, production year, notes) */}
      <div className="flex flex-col justify-center gap-0.5 min-w-0 self-center">
        {subtitle && (
          <p className="truncate text-sm font-semibold text-fg sm:text-base">
            {subtitle}
          </p>
        )}
        {vehicle.notes && (
          <p className="line-clamp-1 text-xs text-text-muted italic sm:text-sm">
            {vehicle.notes}
          </p>
        )}
      </div>

      {/* Actions (icons on mobile, icon + label on larger screens) */}
      <div className="my-auto flex items-center gap-1.5 shrink-0 self-center sm:gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => setIsEditModalOpen(true)}
          className="self-center sm:aspect-auto sm:gap-2 sm:px-3"
          title={t('actions.edit')}
          aria-label={t('actions.edit')}
          data-testid="edit-vehicle-button"
        >
          <Pencil className="shrink-0" />
          <span className="hidden font-semibold leading-none sm:inline">
            {t('actions.edit')}
          </span>
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => setIsDeleteModalOpen(true)}
          className="self-center sm:aspect-auto sm:gap-2 sm:px-3"
          title={t('actions.delete')}
          aria-label={t('actions.delete')}
          data-testid="delete-vehicle-button"
        >
          <Trash2 className="shrink-0" />
          <span className="hidden font-semibold leading-none sm:inline">
            {t('actions.delete')}
          </span>
        </Button>
      </div>

      {isEditModalOpen && (
        <UpdateVehicleModal
          vehicle={vehicle}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updated) => {
            void refetchVehicle?.();
            if (updated.slug && updated.slug !== vehicle.slug) {
              navigate(`/vehicles/${updated.slug}`, { replace: true });
            }
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteVehicleModal
          vehicle={vehicle}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => {
            navigate('/vehicles', { replace: true });
          }}
        />
      )}
    </Card>
  );
};
