import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().trim().pipe(z.email('invalidEmailFormat')),
  password: z.string().min(3, 'passwordTooShort'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const getDefaultLoginFormValues = (redirectedEmail?: string): LoginFormValues => ({
  email: redirectedEmail ?? '',
  password: '',
});
