import { ModalShell, type ModalShellProps } from '@shared/ui';

export type VehicleModalShellProps = ModalShellProps;

export const VehicleModalShell = (props: VehicleModalShellProps) => {
  return <ModalShell {...props} />;
};
