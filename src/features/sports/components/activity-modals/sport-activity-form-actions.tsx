import { FormActions, type FormActionsProps } from '@shared/ui';

export type SportActivityFormActionsProps = FormActionsProps;

export const SportActivityFormActions = (props: SportActivityFormActionsProps) => {
  return <FormActions {...props} />;
};
