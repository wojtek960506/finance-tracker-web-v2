import type { VehicleWithSpending } from '../../../types';

import { VehicleCard } from './vehicle-card';

type VehicleCardsGridProps = {
  vehicles: VehicleWithSpending[];
  onEdit?: (vehicle: VehicleWithSpending) => void;
  onDelete?: (vehicle: VehicleWithSpending) => void;
};

export const VehicleCardsGrid = ({
  vehicles,
  onEdit,
  onDelete,
}: VehicleCardsGridProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="vehicle-cards-grid"
    >
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
