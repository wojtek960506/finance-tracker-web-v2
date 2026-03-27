import clsx from 'clsx';
import { Lock, Pencil, Star, Trash } from 'lucide-react';
import { useState } from 'react';

import type { INamedResource, NamedResourceName } from '@named-resources/api';
import { Button, Card } from '@ui';

export const NamedResourcePreview = ({
  name,
  namedResource,
}: {
  name: NamedResourceName;
  namedResource: INamedResource;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <li>
      <Card className="flex-row gap-2 sm:gap-2 items-center justify-between">
        <p>{namedResource.name}</p>
        <div className="flex items-center">
          {namedResource.type !== 'system' ? (
            <>
              <Button variant="ghost">
                <Pencil />
              </Button>
              <Button variant="ghost">
                <Trash />
              </Button>
            </>
          ) : (
            <Lock className="mx-2" />
          )}
          <Button variant="ghost" onClick={() => setIsFavorite((prev) => !prev)}>
            <Star className={clsx('transition-all', isFavorite ? 'fill-fg' : '')} />
          </Button>
        </div>
      </Card>
    </li>
  );
};
