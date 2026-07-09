import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  NAMED_RESOURCE,
  type NamedResourceKind,
} from '@named-resources/api';
import { capitalize } from '@shared/utils';

import { CreateNamedResource } from './create-named-resource';
import {
  getNamedResourceDisplayLabel,
  NAMED_RESOURCES_PAGE_WIDTH_CLASS_NAME,
  NamedResourcesEmpty,
  NamedResourcesError,
  NamedResourcesList,
  NamedResourcesLoading,
} from './utils';

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
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden sm:gap-3',
        NAMED_RESOURCES_PAGE_WIDTH_CLASS_NAME,
      )}
    >
      <CreateNamedResource kind={kind} />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {isEmpty ? (
          <NamedResourcesEmpty keySuffix={resourceKindKeySuffix} />
        ) : (
          <NamedResourcesList kind={kind} sortedResources={sortedResources} />
        )}
      </div>
    </div>
  );
};
