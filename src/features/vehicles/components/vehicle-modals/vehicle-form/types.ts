import type { VehicleType } from '@vehicles/api';
import type { VehicleFormInput, VehicleFormValues } from '@vehicles/schemas';

export type VehicleFormProps = {
  defaultValues: VehicleFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: VehicleFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export type { VehicleFormInput, VehicleFormValues, VehicleType };
