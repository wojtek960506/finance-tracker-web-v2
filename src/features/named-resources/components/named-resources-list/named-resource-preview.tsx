import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Lock, Pencil, Star, Trash } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  deleteNamedResource,
  type INamedResource,
  type NamedResourceKind,
} from '@named-resources/api';
import { Button, Card } from '@ui';

export const NamedResourcePreview = ({
  kind,
  namedResource,
}: {
  kind: NamedResourceKind;
  namedResource: INamedResource;
}) => {
  const { t } = useTranslation('namedResources');

  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();

  // TODO handle errors while removing and also add confirmation dialog
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteNamedResource(kind, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }),
  });

  return (
    <li>
      <Card className="flex-row gap-1 sm:gap-1 items-center justify-between">
        <p className="text-base sm:text-lg">
          {namedResource.type === 'system' ? t(namedResource.name) : namedResource.name}
        </p>
        <div className="flex items-center gap-1">
          {namedResource.type !== 'system' ? (
            <>
              <Button variant="ghost">
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                onClick={() => deleteMutation.mutate(namedResource.id)}
              >
                <Trash />
              </Button>
            </>
          ) : (
            <Lock className="mx-1 sm:mx-2" />
          )}
          <Button variant="ghost" onClick={() => setIsFavorite((prev) => !prev)}>
            <Star className={clsx('transition-all', isFavorite ? 'fill-fg' : '')} />
          </Button>
        </div>
      </Card>
    </li>
  );
};
