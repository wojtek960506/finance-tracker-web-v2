import clsx from 'clsx';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@shared/ui';

import { VehicleTypeBadge } from '../../all-vehicles/vehicle-card/vehicle-type-badge';
import { DeleteVehicleModal, UpdateVehicleModal } from '../../vehicle-modals';

import type { SingleVehicleHeaderProps } from './types';

export const SingleVehicleHeader = ({
  vehicle,
  onVehicleUpdated,
}: SingleVehicleHeaderProps) => {
  const { t } = useTranslation('vehicles');
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const brandModel = [vehicle.brand, vehicle.vehicleModel].filter(Boolean).join(' ');
  const subtitle = [brandModel, vehicle.productionYear].filter(Boolean).join(' • ');

  return (
    <header
      className="flex flex-col gap-2.5 sm:gap-3"
      data-testid="single-vehicle-header"
    >
      {/* Top back navigation */}
      <div>
        <Link
          to="/vehicles"
          className={clsx(
            'inline-flex items-center gap-1.5 text-xs font-medium text-text-muted',
            'transition-colors hover:text-active-nav',
          )}
          aria-label={t('singleVehicle.backToVehicles')}
        >
          <ArrowLeft className="size-3.5" />
          <span>{t('singleVehicle.backToVehicles')}</span>
        </Link>
      </div>

      {/* Main title & action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {vehicle.name}
          </h1>
          <VehicleTypeBadge type={vehicle.type} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5 px-2.5 py-1 text-xs font-semibold"
            aria-label={t('actions.edit')}
          >
            <Pencil className="size-3.5" />
            <span>{t('actions.edit')}</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="gap-1.5 px-2.5 py-1 text-xs font-semibold"
            aria-label={t('actions.delete')}
          >
            <Trash2 className="size-3.5" />
            <span>{t('actions.delete')}</span>
          </Button>
        </div>
      </div>

      {/* Subtitle / specs & optional notes */}
      {subtitle && (
        <p className="text-xs font-medium text-text-muted sm:text-sm">{subtitle}</p>
      )}
      {vehicle.notes && <p className="text-xs text-text-muted italic">{vehicle.notes}</p>}

      {/* Edit Vehicle Modal */}
      {isEditModalOpen && (
        <UpdateVehicleModal
          vehicle={vehicle}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updated) => {
            onVehicleUpdated?.(updated);
            if (updated.slug && updated.slug !== vehicle.slug) {
              navigate(`/vehicles/${updated.slug}`, { replace: true });
            }
          }}
        />
      )}

      {/* Delete Vehicle Modal */}
      {isDeleteModalOpen && (
        <DeleteVehicleModal
          vehicle={vehicle}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => {
            navigate('/vehicles');
          }}
        />
      )}
    </header>
  );
};
