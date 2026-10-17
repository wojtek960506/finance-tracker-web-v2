import { describe, expect, it } from 'vitest';

import {
  equipmentFormSchema,
  fuelEntryFormSchema,
  linkSpendingsFormSchema,
  maintenanceFormSchema,
  vehicleFormSchema,
} from './schemas';

describe('Vehicles Form Schemas', () => {
  describe('vehicleFormSchema', () => {
    it('validates a valid vehicle payload', () => {
      const valid = {
        name: 'Suzuki SV650',
        slug: 'suzuki-sv-650',
        brand: 'Suzuki',
        vehicleModel: 'SV650',
        type: 'motorcycle',
        productionYear: 2007,
        notes: 'V-Twin roadster',
      };
      const parsed = vehicleFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('uses default vehicle type when omitted', () => {
      const parsed = vehicleFormSchema.safeParse({ name: 'Toyota Corolla' });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.type).toBe('car');
      }
    });

    it('rejects empty vehicle name', () => {
      const parsed = vehicleFormSchema.safeParse({ name: '   ' });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe('nameRequired');
      }
    });
  });

  describe('fuelEntryFormSchema', () => {
    it('validates a valid fuel entry payload', () => {
      const valid = {
        date: '2026-01-01',
        fuelLiters: 14.5,
        isFullTank: true,
        unitPricePln: 6.45,
        costPln: 93.53,
        odometerKm: 34500,
        stationBrand: 'Orlen',
      };
      const parsed = fuelEntryFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects negative or zero fuel amounts and unit price', () => {
      const invalid = {
        date: '2026-01-01',
        fuelLiters: -5,
        unitPricePln: 0,
        costPln: -10,
        odometerKm: -1,
      };
      const parsed = fuelEntryFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('equipmentFormSchema', () => {
    it('validates valid equipment payload', () => {
      const valid = {
        date: '2026-01-02',
        itemName: 'Crash Bars',
        costPln: 450,
        description: 'Heed crash bars',
      };
      const parsed = equipmentFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects empty item name', () => {
      const parsed = equipmentFormSchema.safeParse({
        date: '2026-01-02',
        itemName: '   ',
        costPln: 450,
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe('itemNameRequired');
      }
    });
  });

  describe('maintenanceFormSchema', () => {
    it('validates valid maintenance payload', () => {
      const valid = {
        section: 'ownMaintenance',
        date: '2026-01-03',
        costPln: 150,
        odometerKm: 35000,
        serviceProvider: 'Self',
        serviceAddress: 'ul. Opolska 12, Kraków',
      };
      const parsed = maintenanceFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('uses default section when omitted', () => {
      const parsed = maintenanceFormSchema.safeParse({
        date: '2026-01-03',
        costPln: 150,
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.section).toBe('ownMaintenance');
      }
    });

    it('rejects serviceAddress exceeding 200 characters', () => {
      const parsed = maintenanceFormSchema.safeParse({
        date: '2026-01-03',
        costPln: 150,
        serviceAddress: 'a'.repeat(201),
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('linkSpendingsFormSchema', () => {
    it('validates linking spendings payload', () => {
      const valid = {
        transactionId: 'tx-1',
        spendings: [
          { spendingType: 'fuel', spendingId: 'fuel-1' },
          { spendingType: 'equipment', spendingId: 'eq-1' },
        ],
      };
      const parsed = linkSpendingsFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects empty spendings array', () => {
      const invalid = {
        transactionId: 'tx-1',
        spendings: [],
      };
      const parsed = linkSpendingsFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe('atLeastOneSpendingRequired');
      }
    });
  });
});
