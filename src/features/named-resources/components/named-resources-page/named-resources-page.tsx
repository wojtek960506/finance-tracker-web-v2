import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  NAMED_RESOURCE,
  type NamedResourceKind,
} from '@named-resources/api';
import { capitalize } from '@shared/utils';

import { CreateNamedResource } from './create-named-resource';
import { NamedResourcePreview } from './named-resource-preview';
import { NamedResourcesEmpty, NamedResourcesError, NamedResourcesLoading } from './utils';

const getNamedResourceDisplayLabel = (
  resource: { name: string; type: 'system' | 'user' },
  tNamedResource: (key: string) => string,
) => (resource.type === 'system' ? tNamedResource(resource.name) : resource.name);

export const NamedResourcesPage = ({ kind }: { kind: NamedResourceKind }) => {
  const { t: tNamedResource, i18n } = useTranslation('namedResources');
  const resourceKindKeySuffix = capitalize(NAMED_RESOURCE[kind]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });
  const sortedResources = useMemo(() => {
    if (!data) return [];

    const collator = new Intl.Collator(i18n.language, {
      sensitivity: 'base',
      numeric: true,
    });

    return [...data].sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'system' ? -1 : 1;
      }

      return collator.compare(
        getNamedResourceDisplayLabel(left, tNamedResource),
        getNamedResourceDisplayLabel(right, tNamedResource),
      );
    });
  }, [data, i18n.language, tNamedResource]);

  if (isLoading) return <NamedResourcesLoading keySuffix={resourceKindKeySuffix} />;
  if (error) {
    return (
      <NamedResourcesError
        keySuffix={resourceKindKeySuffix}
        error={error}
        handleClick={() => void refetch()}
      />
    );
  }

  const isEmpty = sortedResources.length === 0;
  return (
    <div className="m-auto flex max-w-100 flex-col gap-2 sm:gap-3">
      <CreateNamedResource kind={kind} />

      {isEmpty ? (
        <NamedResourcesEmpty keySuffix={resourceKindKeySuffix} />
      ) : (
        <ul className="flex flex-col gap-2 sm:gap-3">
          {sortedResources.map((namedResource) => (
            <NamedResourcePreview
              key={namedResource.id}
              kind={kind}
              namedResource={namedResource}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
