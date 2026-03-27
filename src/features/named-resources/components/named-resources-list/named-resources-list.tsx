import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  NAMED_RESOURCE,
  type NamedResourceName,
} from '@named-resources/api';

import { Button } from '@/shared/ui';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const NamedResourcesList = ({ name }: { name: NamedResourceName }) => {
  const { t } = useTranslation(name);

  const { data, isLoading, error } = useQuery({
    queryKey: [name],
    queryFn: async () => await getNamedResources(name),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!data || data.length === 0)
    return <p>There are no {name} - TODO add button to create one</p>;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 max-w-150 m-auto">
      <Button variant="primary">{t(`new${capitalize(NAMED_RESOURCE[name])}`)}</Button>

      <ul className="flex flex-col gap-2 sm-gap-3">
        {data.map((namedResource) => (
          <li key={namedResource.id}>
            <p>{namedResource.name}</p>
            <p>{namedResource.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
