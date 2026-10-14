import type { MaintenanceSection } from '@vehicles/types';

export type MaintenanceSectionFilter = 'all' | MaintenanceSection;

export type MaintenanceFilters = {
  search?: string;
  startDate?: string;
  endDate?: string;
};
