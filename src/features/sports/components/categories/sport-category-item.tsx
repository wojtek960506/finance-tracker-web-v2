import clsx from 'clsx';
import { Lock, Pencil, Star, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NamedResourceInput } from '@named-resources/components/named-resource-input';
import { Button, Card } from '@shared/ui';

import { useSportCategoryMutations } from '../../hooks';

import type { SportCategoryItemProps } from './types';

export const SportCategoryItem = ({
  category,
  onDeleteRequest,
}: SportCategoryItemProps) => {
  const { t } = useTranslation('sports');
  const { t: tNamedResource } = useTranslation('namedResources');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    updateCategory,
    favoriteCategory,
    unfavoriteCategory,
    isFavoriting,
    isUnfavoriting,
  } = useSportCategoryMutations();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleFavoriteClick = async () => {
    if (category.isFavorite) {
      await unfavoriteCategory(category.id);
    } else {
      await favoriteCategory(category.id);
    }
  };

  const isFavoritePending = isFavoriting || isUnfavoriting;
  const isSystem = category.type === 'system';
  const displayName = isSystem ? tNamedResource(category.name) : category.name;

  if (isEditing) {
    return (
      <NamedResourceInput
        inputRef={inputRef}
        initialValue={category.name}
        action={async (nextName: string) => {
          await updateCategory({
            id: category.id,
            data: { name: nextName },
          });
          setIsEditing(false);
        }}
        setIsVisible={setIsEditing}
        isCreate={false}
        autoCloseOnSubmit={false}
      />
    );
  }

  return (
    <Card
      className="flex-row gap-1 sm:gap-1 items-center justify-between"
      data-testid={`sport-category-item-${category.id}`}
    >
      <p className="text-base sm:text-lg px-2 sm:px-3">{displayName}</p>

      <div className="flex items-center gap-1">
        {!isSystem ? (
          <>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label={t('categories.editCategory')}
              data-testid={`edit-category-${category.id}`}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteRequest(category)}
              aria-label={t('categories.deleteCategory')}
              data-testid={`delete-category-${category.id}`}
            >
              <Trash />
            </Button>
          </>
        ) : (
          <Lock className="mx-1 sm:mx-2" />
        )}

        <Button
          variant="default"
          size="icon"
          onClick={() => void handleFavoriteClick()}
          disabled={isFavoritePending}
          aria-label={
            category.isFavorite
              ? tNamedResource('unfavoriteNamedResource')
              : tNamedResource('favoriteNamedResource')
          }
          data-testid={`favorite-category-${category.id}`}
        >
          <Star
            className={clsx('transition-all', category.isFavorite ? 'fill-bg' : '')}
          />
        </Button>
      </div>
    </Card>
  );
};
