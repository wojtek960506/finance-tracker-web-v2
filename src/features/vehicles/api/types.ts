import type { components, paths } from '@shared/types/api.generated';

// Vehicle types
export type VehicleType = components['schemas']['VehicleResponse']['type'];

export type Vehicle = components['schemas']['VehicleResponse'];

export type VehicleListResponse = components['schemas']['VehicleListResponse'];

export type CreateVehiclePayload = components['schemas']['VehicleCreateInput'];

export type UpdateVehiclePayload = components['schemas']['VehicleUpdateInput'];

// Pagination
export type VehiclePagination = components['schemas']['VehiclePagination'];

// Fuel Entry types
export type VehicleFuelEntry = components['schemas']['VehicleFuelEntryResponse'];

export type VehicleFuelEntryEnriched =
  components['schemas']['VehicleFuelEntryEnrichedResponse'];

export type VehicleFuelEntryListResponse =
  components['schemas']['VehicleFuelEntryListResponse'];

export type VehicleFuelSummary = components['schemas']['VehicleFuelSummary'];

export type VehicleFuelWithSummaryResponse =
  components['schemas']['VehicleFuelWithSummaryResponse'];

export type CreateFuelEntryPayload = components['schemas']['VehicleFuelEntryCreateInput'];

export type UpdateFuelEntryPayload = Partial<
  components['schemas']['VehicleFuelEntryUpdateInput']
>;

export type GetFuelEntriesQuery = NonNullable<
  paths['/api/vehicles/{vehicleId}/fuel']['get']['parameters']['query']
>;

// Equipment types
export type VehicleEquipment = components['schemas']['VehicleEquipmentResponse'];

export type VehicleEquipmentListResponse =
  components['schemas']['VehicleEquipmentListResponse'];

export type VehicleEquipmentSummary = components['schemas']['VehicleEquipmentSummary'];

export type VehicleEquipmentWithSummaryResponse =
  components['schemas']['VehicleEquipmentWithSummaryResponse'];

export type CreateEquipmentPayload = components['schemas']['VehicleEquipmentCreateInput'];

export type UpdateEquipmentPayload = components['schemas']['VehicleEquipmentUpdateInput'];

export type GetEquipmentQuery = NonNullable<
  paths['/api/vehicles/{vehicleId}/equipment']['get']['parameters']['query']
>;

// Maintenance types
export type MaintenanceSection =
  components['schemas']['VehicleMaintenanceResponse']['section'];

export type VehicleMaintenance = components['schemas']['VehicleMaintenanceResponse'];

export type VehicleMaintenanceListResponse = VehicleMaintenance[];

export type VehicleMaintenanceSummary =
  components['schemas']['VehicleMaintenanceSummary'];

export type VehicleMaintenanceWithSummaryResponse = {
  items: VehicleMaintenance[];
  summary: VehicleMaintenanceSummary;
  pagination: VehiclePagination;
};

export type CreateMaintenancePayload =
  components['schemas']['VehicleMaintenanceCreateInput'];

export type UpdateMaintenancePayload =
  components['schemas']['VehicleMaintenanceUpdateInput'];

export type GetMaintenanceQuery = NonNullable<
  paths['/api/vehicles/{vehicleId}/maintenance']['get']['parameters']['query']
>;

// Spending Linking types
export type SpendingType = components['schemas']['SpendingLinkItem']['spendingType'];

export type SpendingLinkItem = components['schemas']['SpendingLinkItem'];

export type LinkSpendingsToTransactionPayload =
  components['schemas']['LinkSpendingsToTransaction'];

export type UnlinkSpendingPayload =
  components['schemas']['UnlinkSpendingFromTransaction'];

export type SpendingLinkResponse = components['schemas']['SpendingLinkResponse'];

// Fleet Summary & Vehicle Overview types
export type VehiclesSummaryResponse = components['schemas']['VehiclesSummaryResponse'];

export type GlobalVehiclesSummary = components['schemas']['GlobalVehiclesSummary'];

export type VehicleWithSpending = components['schemas']['VehicleWithSpending'];

export type VehicleSpendingSummary = components['schemas']['VehicleSpendingSummary'];

export type VehicleOverviewResponse = components['schemas']['VehicleOverviewResponse'];

export type VehicleOverviewStats = components['schemas']['VehicleOverviewStats'];

export type VehicleOverviewFuelStats = components['schemas']['VehicleOverviewFuelStats'];

export type VehicleOverviewMaintenanceStats =
  components['schemas']['VehicleOverviewMaintenanceStats'];

export type VehicleOverviewEquipmentStats =
  components['schemas']['VehicleOverviewEquipmentStats'];

export type VehicleOverviewActivityItem =
  components['schemas']['VehicleOverviewActivityItem'];

export type GetVehicleOverviewQuery = NonNullable<
  paths['/api/vehicles/{vehicleId}/overview']['get']['parameters']['query']
>;
