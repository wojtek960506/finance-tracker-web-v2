import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Lock, Pencil, Star, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  deleteNamedResource,
  type INamedResource,
  type NamedResourceKind,
  updateNamedResource,
} from '@named-resources/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import { Button, Card } from '@ui';

import { NamedResourceInput } from '../named-resource-input';

export const NamedResourcePreview = ({
  kind,
  namedResource,
}: {
  kind: NamedResourceKind;
  namedResource: INamedResource;
}) => {
  const { t } = useTranslation('namedResources');

  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(namedResource.name);
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // TODO handle errors while removing and also add confirmation dialog
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteNamedResource(kind, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      await updateNamedResource(kind, id, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <li>
      {isEditing ? (
        <NamedResourceInput
          inputRef={inputRef}
          initialValue={name}
          action={async (nextName: string) => {
            await updateMutation.mutateAsync({ id: namedResource.id, name: nextName });
            setName(nextName);
            setIsEditing(false);
          }}
          onError={(error) => {
            const apiError = normalizeApiError(error);

            pushToast({
              variant: 'error',
              title: name,
              message: apiError.code ? t(apiError.code) : apiError.message,
            });
          }}
          setIsVisible={setIsEditing}
          isCreate={false}
          autoCloseOnSubmit={false}
        />
      ) : (
        <Card className="flex-row gap-1 sm:gap-1 items-center justify-between">
          <p className="text-base sm:text-lg px-2 sm:px-3">
            {namedResource.type === 'system' ? t(name) : name}
          </p>
          <div className="flex items-center gap-1">
            {namedResource.type !== 'system' ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <Pencil />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(namedResource.id)}
                >
                  <Trash />
                </Button>
              </>
            ) : (
              <Lock className="mx-1 sm:mx-2" />
            )}
            <Button variant="default" onClick={() => setIsFavorite((prev) => !prev)}>
              <Star className={clsx('transition-all', isFavorite ? 'fill-bg' : '')} />
            </Button>
          </div>
        </Card>
      )}
    </li>
  );
};
