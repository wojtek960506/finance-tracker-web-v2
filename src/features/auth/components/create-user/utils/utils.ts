import { z } from 'zod';

export const createUserFormSchema = z
  .object({
    firstName: z.string().trim().min(2, 'firstNameTooShort'),
    lastName: z.string().trim().min(2, 'lastNameTooShort'),
    email: z.string().trim().pipe(z.email('invalidEmailFormat')),
    password: z.string().min(3, 'passwordTooShort'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'passwordsDoNotMatch',
      });
    }
  });

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const getDefaultCreateUserFormValues = (): CreateUserFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});
