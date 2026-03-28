import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, Lock, Pencil, Star, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  deleteNamedResource,
  type INamedResource,
  type NamedResourceKind,
  updateNamedResource,
} from '@named-resources/api';
import { Button, Card, Input } from '@ui';

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
  const [newName, setNewName] = useState(namedResource.name);
  const queryClient = useQueryClient();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // TODO handle errors while removing and also add confirmation dialog
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteNamedResource(kind, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) =>
      await updateNamedResource(kind, id, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <li>
      <Card
        className={clsx(
          'flex-row gap-1 sm:gap-1 items-center justify-between',
          isEditing && 'bg-bt-secondary',
        )}
      >
        {isEditing ? (
          <>
            <Input
              ref={inputRef}
              value={newName}
              className="w-full"
              onChange={(event) => setNewName(event.target.value)}
            />
            <Button
              disabled={newName === ''}
              variant="primary"
              onClick={() => {
                updateMutation.mutate({ id: namedResource.id, newName });
                setIsEditing(false);
                setNewName(newName);
              }}
            >
              <Check />
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsEditing(false);
                setNewName(namedResource.name);
              }}
            >
              <X />
            </Button>
          </>
        ) : (
          <>
            <p className="text-base sm:text-lg px-2 sm:px-3">
              {namedResource.type === 'system'
                ? t(namedResource.name)
                : namedResource.name}
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
          </>
        )}
      </Card>
    </li>
  );
};
