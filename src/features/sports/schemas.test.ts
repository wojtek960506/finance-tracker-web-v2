import { describe, expect, it } from 'vitest';

import { sportCategoryFormSchema, sportEntryFormSchema } from './schemas';

describe('Sports Form Schemas', () => {
  describe('sportEntryFormSchema', () => {
    it('validates a valid sport entry payload', () => {
      const valid = {
        categoryId: '67116b43e18a0029b31d8001',
        date: '2026-05-10',
        itemName: 'Kask rowerowy Giro',
        costPln: 299.99,
        description: 'Nowy kask szosowy',
        transactionId: '67116b43e18a0029b31d8999',
      };
      const parsed = sportEntryFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('allows optional description and transactionId to be omitted or null', () => {
      const valid = {
        categoryId: '67116b43e18a0029b31d8001',
        date: '2026-05-10',
        itemName: 'Karnet na siłownię',
        costPln: '150',
      };
      const parsed = sportEntryFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.costPln).toBe(150);
        expect(parsed.data.description).toBeUndefined();
        expect(parsed.data.transactionId).toBeUndefined();
      }
    });

    it('rejects empty categoryId', () => {
      const invalid = {
        categoryId: '',
        date: '2026-05-10',
        itemName: 'Opony rowerowe',
        costPln: 120,
      };
      const parsed = sportEntryFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain('categoryId');
      }
    });

    it('rejects empty or whitespace itemName', () => {
      const invalid = {
        categoryId: 'cat-1',
        date: '2026-05-10',
        itemName: '   ',
        costPln: 120,
      };
      const parsed = sportEntryFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain('itemName');
      }
    });

    it('rejects negative or zero cost', () => {
      const zeroCost = {
        categoryId: 'cat-1',
        date: '2026-05-10',
        itemName: 'Skarpetki',
        costPln: 0,
      };
      const negCost = {
        categoryId: 'cat-1',
        date: '2026-05-10',
        itemName: 'Skarpetki',
        costPln: -50,
      };
      expect(sportEntryFormSchema.safeParse(zeroCost).success).toBe(false);
      expect(sportEntryFormSchema.safeParse(negCost).success).toBe(false);
    });

    it('rejects descriptions exceeding 500 characters', () => {
      const longDesc = {
        categoryId: 'cat-1',
        date: '2026-05-10',
        itemName: 'Rower',
        costPln: 5000,
        description: 'a'.repeat(501),
      };
      const parsed = sportEntryFormSchema.safeParse(longDesc);
      expect(parsed.success).toBe(false);
    });
  });

  describe('sportCategoryFormSchema', () => {
    it('validates a valid sport category name', () => {
      const valid = { name: 'Kolarstwo szosowe' };
      const parsed = sportCategoryFormSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects empty or whitespace name', () => {
      const invalid = { name: '   ' };
      const parsed = sportCategoryFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain('name');
      }
    });

    it('rejects category name exceeding 100 characters', () => {
      const invalid = { name: 'x'.repeat(101) };
      const parsed = sportCategoryFormSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });
});
