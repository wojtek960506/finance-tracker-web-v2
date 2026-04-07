import { type ComponentProps, forwardRef } from 'react';

import { useLanguage } from '@shared/hooks';
import { Input } from '@ui';

type DateInputProps = Omit<ComponentProps<'input'>, 'type'>;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => {
  const { language } = useLanguage();

  return <Input {...props} ref={ref} type="date" lang={language} />;
});
