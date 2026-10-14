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
        'flex flex-col gap-3 rounded-2xl border-border bg-card-bg p-4',
        'sm:flex-row sm:items-center sm:justify-between',
      )}
      data-testid="vehicle-overview-details"
    >
      <div className="flex flex-col gap-1 min-w-0">
        {subtitle && (
          <p className="text-sm font-semibold text-fg sm:text-base">{subtitle}</p>
        )}
        {vehicle.notes && (
          <p className="text-xs text-text-muted italic">{vehicle.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsEditModalOpen(true)}
          className="gap-1.5 px-3 py-1.5 text-xs font-semibold"
          aria-label={t('actions.edit')}
          data-testid="edit-vehicle-button"
        >
          <Pencil className="size-3.5" />
          <span>{t('actions.edit')}</span>
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
          className="gap-1.5 px-3 py-1.5 text-xs font-semibold"
          aria-label={t('actions.delete')}
          data-testid="delete-vehicle-button"
        >
          <Trash2 className="size-3.5" />
          <span>{t('actions.delete')}</span>
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
