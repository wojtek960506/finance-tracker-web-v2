import type { MaintenanceSection } from '@vehicles/types';

export type MaintenanceSectionFilter = 'all' | MaintenanceSection;

export type MaintenanceFilters = {
  section?: MaintenanceSectionFilter;
  search?: string;
  startDate?: string;
  endDate?: string;
};
