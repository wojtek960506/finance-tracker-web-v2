import { describe, expect, it } from 'vitest';

import { createUserFormSchema, getDefaultCreateUserFormValues } from './utils';

describe('createUserFormSchema', () => {
  it('returns empty default form values', () => {
    expect(getDefaultCreateUserFormValues()).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('parses and trims valid values', () => {
    const result = createUserFormSchema.parse({
      firstName: '  John  ',
      lastName: '  Doe  ',
      email: '  john@example.com  ',
      password: 'secret',
      confirmPassword: 'secret',
    });

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
      confirmPassword: 'secret',
    });
  });

  it('rejects invalid email format', () => {
    const result = createUserFormSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid',
      password: 'secret',
      confirmPassword: 'secret',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('invalidEmailFormat');
  });

  it('rejects mismatched passwords', () => {
    const result = createUserFormSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
      confirmPassword: 'different',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword']);
    expect(result.error?.issues[0]?.message).toBe('passwordsDoNotMatch');
  });
});
