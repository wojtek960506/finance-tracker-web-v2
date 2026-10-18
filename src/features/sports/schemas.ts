import { z } from 'zod';

export const sportEntryFormSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  itemName: z.string().trim().min(1, 'Item name is required').max(200),
  costPln: z.coerce.number().positive('Cost must be greater than 0'),
  description: z.string().max(500).optional().nullable(),
  transactionId: z.string().optional().nullable(),
});

export type SportEntryFormValues = z.infer<typeof sportEntryFormSchema>;
export type SportEntryFormInput = z.input<typeof sportEntryFormSchema>;

export const sportCategoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(100),
});

export type SportCategoryFormValues = z.infer<typeof sportCategoryFormSchema>;
export type SportCategoryFormInput = z.input<typeof sportCategoryFormSchema>;
