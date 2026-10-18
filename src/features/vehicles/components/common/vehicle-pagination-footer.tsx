import { PaginationFooter, type PaginationFooterProps } from '@shared/ui';

export type VehiclePaginationFooterProps = PaginationFooterProps;

export const VehiclePaginationFooter = (props: VehiclePaginationFooterProps) => {
  return <PaginationFooter i18nNamespace="vehicles" {...props} />;
};
