import { z } from 'zod';

import {
  DEFAULT_MAINTENANCE_SECTION,
  DEFAULT_VEHICLE_TYPE,
  MAINTENANCE_SECTIONS,
  SPENDING_TYPES,
  VEHICLE_TYPES,
} from './consts';

export const vehicleFormSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired').max(100),
  slug: z.string().trim().max(100).optional().or(z.literal('')),
  brand: z.string().trim().max(50).optional().or(z.literal('')),
  vehicleModel: z.string().trim().max(50).optional().or(z.literal('')),
  type: z.enum(VEHICLE_TYPES as [string, ...string[]]).default(DEFAULT_VEHICLE_TYPE),
  productionYear: z.number().int().min(1900).max(2100).optional().nullable(),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export const fuelEntryFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  fuelLiters: z.number().positive('fuelLitersPositive'),
  isFullTank: z.boolean().default(true),
  unitPricePln: z.number().positive('unitPricePositive'),
  costPln: z.number().positive('costPositive'),
  odometerKm: z.number().int().nonnegative('odometerNonNegative'),
  stationBrand: z.string().trim().max(100).optional().or(z.literal('')),
  stationAddress: z.string().trim().max(200).optional().or(z.literal('')),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  transactionId: z.string().trim().optional().nullable(),
});

export type FuelEntryFormValues = z.infer<typeof fuelEntryFormSchema>;

export const equipmentFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  itemName: z.string().trim().min(1, 'itemNameRequired').max(100),
  costPln: z.number().positive('costPositive'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  transactionId: z.string().trim().optional().nullable(),
});

export type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

export const maintenanceFormSchema = z.object({
  section: z
    .enum(MAINTENANCE_SECTIONS as [string, ...string[]])
    .default(DEFAULT_MAINTENANCE_SECTION),
  date: z.string().min(1, 'dateRequired'),
  costPln: z.number().positive('costPositive'),
  odometerKm: z.number().int().nonnegative().optional().nullable(),
  serviceProvider: z.string().trim().max(100).optional().or(z.literal('')),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  transactionId: z.string().trim().optional().nullable(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export const linkSpendingsFormSchema = z.object({
  transactionId: z.string().trim().min(1, 'transactionRequired'),
  spendings: z
    .array(
      z.object({
        spendingType: z.enum(SPENDING_TYPES as [string, ...string[]]),
        spendingId: z.string().trim().min(1),
      }),
    )
    .min(1, 'atLeastOneSpendingRequired'),
});

export type LinkSpendingsFormValues = z.infer<typeof linkSpendingsFormSchema>;
