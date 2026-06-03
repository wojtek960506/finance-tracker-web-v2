import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@ui';

import { NamedResourceInput } from '../../named-resource-input';
import { getNamedResourceErrorToast } from '../get-named-resource-error-toast';

import {
  createNamedResource,
  NAMED_RESOURCE,
  NAMED_RESOURCE_ERROR_NAMESPACE,
  type NamedResourceKind,
} from '@/features/named-resources/api';
import { normalizeApiError } from '@/shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@/shared/consts';
import { useToastStore } from '@/shared/store/toast-store';
import { capitalize } from '@/shared/utils';

export const CreateNamedResource = ({ kind }: { kind: NamedResourceKind }) => {
  const { t: tNamedResource } = useTranslation('namedResources');
  const { t: tError } = useTranslation(NAMED_RESOURCE_ERROR_NAMESPACE[kind]);
  const resourceKindKeySuffix = capitalize(NAMED_RESOURCE[kind]);

  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isCreating) inputRef.current!.focus();
  }, [isCreating]);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (name: string) => await createNamedResource(kind, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });
  const pushToast = useToastStore((state) => state.pushToast);

  return (
    <>
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
    </>
  );
};
