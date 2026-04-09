import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createNamedResource,
  getNamedResources,
  NAMED_RESOURCE,
  NAMED_RESOURCE_ERROR_NAMESPACE,
  type NamedResourceKind,
} from '@named-resources/api';
import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { Button } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

import { NamedResourceInput } from '../named-resource-input';

import { getNamedResourceErrorToast } from './get-named-resource-error-toast';
import { NamedResourcePreview } from './named-resource-preview';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const NamedResourcesList = ({ kind }: { kind: NamedResourceKind }) => {
  const { t: tNamedResource } = useTranslation('namedResources');
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

  const { data, isLoading, error } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!data || data.length === 0)
    return <p>There are no {kind} - TODO add button to create one</p>;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 max-w-100 m-auto">
      <Button
        variant="primary"
        className={MAIN_BUTTON_TEXT}
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

      <ul className="flex flex-col gap-2 sm:gap-3">
        {data?.map((namedResource) => (
          <NamedResourcePreview
            key={namedResource.id}
            kind={kind}
            namedResource={namedResource}
          />
        ))}
      </ul>
    </div>
  );
};
