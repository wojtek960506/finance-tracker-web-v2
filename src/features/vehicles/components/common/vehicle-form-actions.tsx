import { FormActions, type FormActionsProps } from '@shared/ui';

export type VehicleFormActionsProps = FormActionsProps;

export const VehicleFormActions = (props: VehicleFormActionsProps) => {
  return <FormActions {...props} />;
};
