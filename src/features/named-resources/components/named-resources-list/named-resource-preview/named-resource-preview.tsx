import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Lock, Pencil, Star, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  deleteNamedResource,
  favoriteNamedResource,
  type INamedResource,
  NAMED_RESOURCE,
  NAMED_RESOURCE_ERROR_NAMESPACE,
  type NamedResourceKind,
  unfavoriteNamedResource,
  updateNamedResource,
} from '@named-resources/api';
import { NamedResourceInput } from '@named-resources/components/named-resource-input';
import { normalizeApiError } from '@shared/api/api-error';
import { capitalize } from '@shared/utils';
import { useToastStore } from '@store/toast-store';
import { Button, Card, Modal } from '@ui';

import { getNamedResourceErrorToast } from '../get-named-resource-error-toast';

const setNamedResourceFavoriteState = (
  resources: INamedResource[] | undefined,
  id: string,
  isFavorite: boolean,
) =>
  resources?.map((resource) =>
    resource.id === id ? { ...resource, isFavorite } : resource,
  );

// TODO for sure split this component
export const NamedResourcePreview = ({
  kind,
  namedResource,
}: {
  kind: NamedResourceKind;
  namedResource: INamedResource;
}) => {
  const { t: tNamedResource } = useTranslation('namedResources');
  const { t: tError } = useTranslation(NAMED_RESOURCE_ERROR_NAMESPACE[kind]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState(namedResource.name);
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeDeleteErrorButtonRef = useRef<HTMLButtonElement | null>(null);
  const resourceKindKeySuffix = capitalize(NAMED_RESOURCE[kind]);
  const deleteModalTitle = tNamedResource(
    `deleteResourceModalTitle${resourceKindKeySuffix}`,
    { resourceName: name },
  );
  const deleteModalHint = tNamedResource(
    `deleteResourceModalHint${resourceKindKeySuffix}`,
  );
  const deleteErrorTitle = tNamedResource(
    `deleteResourceErrorTitle${resourceKindKeySuffix}`,
    { resourceName: name },
  );
  const updateSuccessTitle = (resourceName: string) =>
    tNamedResource(`resourceUpdatedTitle${resourceKindKeySuffix}`, { resourceName });
  const resourceDeletedTitle = tNamedResource(
    `resourceDeletedTitle${resourceKindKeySuffix}`,
    { resourceName: name },
  );
  const optimisticallySetFavoriteState = async (id: string, isFavorite: boolean) => {
    await queryClient.cancelQueries({ queryKey: [kind] });

    const previousResources = queryClient.getQueryData<INamedResource[]>([kind]);

    queryClient.setQueryData<INamedResource[] | undefined>([kind], (resources) =>
      setNamedResourceFavoriteState(resources, id, isFavorite),
    );

    return { previousResources };
  };
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteNamedResource(kind, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      await updateNamedResource(kind, id, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });
  const favoriteMutation = useMutation({
    mutationFn: async (id: string) => await favoriteNamedResource(kind, id),
    onMutate: async (id: string) => await optimisticallySetFavoriteState(id, true),
    onError: (_error, _id, context) => {
      if (context) {
        queryClient.setQueryData([kind], context.previousResources);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });
  const unfavoriteMutation = useMutation({
    mutationFn: async (id: string) => await unfavoriteNamedResource(kind, id),
    onMutate: async (id: string) => await optimisticallySetFavoriteState(id, false),
    onError: (_error, _id, context) => {
      if (context) {
        queryClient.setQueryData([kind], context.previousResources);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (deleteErrorMessage) {
      closeDeleteErrorButtonRef.current?.focus();
    }
  }, [deleteErrorMessage]);

  const openDeleteModal = () => {
    setDeleteErrorMessage(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteErrorMessage(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(namedResource.id);
      closeDeleteModal();
      pushToast({
        variant: 'success',
        title: resourceDeletedTitle,
      });
    } catch (error) {
      const apiError = normalizeApiError(error);

      setDeleteErrorMessage(apiError.code ? tError(apiError.code) : apiError.message);
    }
  };

  const handleFavoriteClick = async () => {
    try {
      if (namedResource.isFavorite) {
        await unfavoriteMutation.mutateAsync(namedResource.id);
        return;
      }

      if (!namedResource.isFavorite) {
        await favoriteMutation.mutateAsync(namedResource.id);
      }
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: apiError.code ? tError(apiError.code) : name,
        ...(apiError.code ? {} : { message: apiError.message }),
      });
    }
  };

  const isFavoriteMutationPending =
    favoriteMutation.isPending || unfavoriteMutation.isPending;

  return (
    <li>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        ariaLabel={deleteModalTitle}
        restoreFocusRef={deleteButtonRef}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">
              {deleteErrorMessage ? deleteErrorTitle : deleteModalTitle}
            </h2>
            {deleteErrorMessage ? (
              <p className="text-sm sm:text-base">{deleteErrorMessage}</p>
            ) : (
              <p className="text-sm sm:text-base">{deleteModalHint}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            {deleteErrorMessage ? (
              <Button
                ref={closeDeleteErrorButtonRef}
                variant="primary"
                onClick={closeDeleteModal}
              >
                {tNamedResource('closeModal')}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={closeDeleteModal}>
                  {tNamedResource('cancelDeletion')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => void handleDelete()}
                  disabled={deleteMutation.isPending}
                >
                  {tNamedResource('confirmDeletion')}
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
      {isEditing ? (
        <NamedResourceInput
          inputRef={inputRef}
          initialValue={name}
          action={async (nextName: string) => {
            await updateMutation.mutateAsync({ id: namedResource.id, name: nextName });
            setName(nextName);
            setIsEditing(false);
            pushToast({
              variant: 'success',
              title: updateSuccessTitle(nextName),
            });
          }}
          onError={(error) => {
            const apiError = normalizeApiError(error);
            const attemptedName = inputRef.current?.value ?? name;

            pushToast({
              variant: 'error',
              ...getNamedResourceErrorToast({
                apiError,
                fallbackTitle: attemptedName,
                resourceName: attemptedName,
                tError,
              }),
            });
          }}
          setIsVisible={setIsEditing}
          isCreate={false}
          autoCloseOnSubmit={false}
        />
      ) : (
        <Card className="flex-row gap-1 sm:gap-1 items-center justify-between">
          <p className="text-base sm:text-lg px-2 sm:px-3">
            {namedResource.type === 'system' ? tNamedResource(name) : name}
          </p>
          <div className="flex items-center gap-1">
            {namedResource.type !== 'system' ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <Pencil />
                </Button>
                <Button
                  ref={deleteButtonRef}
                  variant="destructive"
                  onClick={openDeleteModal}
                >
                  <Trash />
                </Button>
              </>
            ) : (
              <Lock className="mx-1 sm:mx-2" />
            )}
            <Button
              variant="default"
              onClick={() => void handleFavoriteClick()}
              disabled={isFavoriteMutationPending}
              aria-label={
                namedResource.isFavorite
                  ? tNamedResource('unfavoriteNamedResource')
                  : tNamedResource('favoriteNamedResource')
              }
            >
              <Star
                className={clsx(
                  'transition-all',
                  namedResource.isFavorite ? 'fill-bg' : '',
                )}
              />
            </Button>
          </div>
        </Card>
      )}
    </li>
  );
};
