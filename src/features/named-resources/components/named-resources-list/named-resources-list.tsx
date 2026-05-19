import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createNamedResource,
  getNamedResources,
  NAMED_RESOURCE,
  NAMED_RESOURCE_ERROR_NAMESPACE,
  type NamedResourceKind,
} from '@named-resources/api';
import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button, Card, LoadingState } from '@shared/ui';
import { capitalize } from '@shared/utils';
import { useToastStore } from '@store/toast-store';

import { NamedResourceInput } from '../named-resource-input';

import { getNamedResourceErrorToast } from './get-named-resource-error-toast';
import { NamedResourcePreview } from './named-resource-preview';

const getNamedResourceDisplayLabel = (
  resource: { name: string; type: 'system' | 'user' },
  tNamedResource: (key: string) => string,
) => (resource.type === 'system' ? tNamedResource(resource.name) : resource.name);

// TODO maybe split this component
export const NamedResourcesList = ({ kind }: { kind: NamedResourceKind }) => {
  const { t: tNamedResource, i18n } = useTranslation('namedResources');
  const { t: tError } = useTranslation(NAMED_RESOURCE_ERROR_NAMESPACE[kind]);
  const resourceKindKeySuffix = capitalize(NAMED_RESOURCE[kind]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const pushToast = useToastStore((state) => state.pushToast);

  const queryClient = useQueryClient();
  // TODO handle errors while creating
  const createMutation = useMutation({
    mutationFn: async (name: string) => await createNamedResource(kind, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  useEffect(() => {
    if (isCreating) inputRef.current!.focus();
  }, [isCreating]);

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

  if (isLoading) {
    return (
      <div className="m-auto flex w-full max-w-100 flex-col gap-2 sm:gap-3">
        <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
          <LoadingState
            title={tNamedResource(`loading${resourceKindKeySuffix}`)}
            description={tNamedResource(`loading${resourceKindKeySuffix}Description`)}
            className="py-4"
          />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-auto flex w-full max-w-100 flex-col gap-2 sm:gap-3">
        <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-xl font-semibold sm:text-2xl">
              {tNamedResource(`resourcesLoadFailedTitle${resourceKindKeySuffix}`)}
            </h2>
            <p className="text-sm text-text-muted sm:text-base">{error.message}</p>
          </div>
          <Button
            variant="primary"
            className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
            onClick={() => void refetch()}
          >
            {tNamedResource('retryLoadingResources')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="m-auto flex max-w-100 flex-col gap-2 sm:gap-3">
      <Button
        variant="primary"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        disabled={isCreating}
        onClick={() => setIsCreating(true)}
      >
        {tNamedResource(`new${capitalize(NAMED_RESOURCE[kind])}`)}
      </Button>

      {isCreating && (
        <NamedResourceInput
          inputRef={inputRef}
          initialValue=""
          action={async (resourceName: string) => {
            await createMutation.mutateAsync(resourceName);
            pushToast({
              variant: 'success',
              title: tNamedResource(`resourceCreatedTitle${resourceKindKeySuffix}`, {
                resourceName,
              }),
            });
          }}
          onError={(error) => {
            const apiError = normalizeApiError(error);

            pushToast({
              variant: 'error',
              ...getNamedResourceErrorToast({
                apiError,
                fallbackTitle: tNamedResource(`new${capitalize(NAMED_RESOURCE[kind])}`),
                resourceName: inputRef.current?.value ?? '',
                tError,
              }),
            });
          }}
          setIsVisible={setIsCreating}
          isCreate={true}
        />
      )}

      {sortedResources.length === 0 ? (
        <Card className="gap-3 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 text-center sm:gap-4 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {tNamedResource(`emptyResourcesTitle${resourceKindKeySuffix}`)}
          </h2>
          <p className="text-sm text-text-muted sm:text-base">
            {tNamedResource(`emptyResourcesDescription${resourceKindKeySuffix}`)}
          </p>
        </Card>
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
