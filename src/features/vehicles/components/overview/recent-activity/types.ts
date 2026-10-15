import type { VehicleOverviewActivityItem } from '@vehicles/api';

export type RecentActivityFeedProps = {
  items: VehicleOverviewActivityItem[];
  vehicleSlug: string;
};

export type ActivityItemRowProps = {
  item: VehicleOverviewActivityItem;
};
