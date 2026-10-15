import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getVehicle, type Vehicle } from '../api';
import { vehiclesQueryKeys } from '../consts';

export const useVehicle = (vehicleSlugParam?: string) => {
  const { vehicleSlug } = useParams<{ vehicleSlug: string }>();
  const targetSlug = vehicleSlugParam ?? vehicleSlug;

  const query = useQuery<Vehicle, Error>({
    queryKey: vehiclesQueryKeys.details(targetSlug ?? ''),
    queryFn: () => getVehicle(targetSlug!),
    enabled: Boolean(targetSlug),
  });

  return {
    ...query,
    vehicle: query.data,
    vehicleSlug: targetSlug,
  };
};
