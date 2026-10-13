import type { VehicleActivityItem } from '@vehicles/types';

export type RecentActivityFeedProps = {
  items: VehicleActivityItem[];
  vehicleSlug: string;
};

export type ActivityItemRowProps = {
  item: VehicleActivityItem;
};
