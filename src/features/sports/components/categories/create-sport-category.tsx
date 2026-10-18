import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NamedResourceInput } from '@named-resources/components/named-resource-input';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';

import { useSportCategoryMutations } from '../../hooks';

export const CreateSportCategory = () => {
  const { t } = useTranslation('sports');
  const [isCreatingInline, setIsCreatingInline] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { createCategory, isCreating } = useSportCategoryMutations();

  useEffect(() => {
    if (isCreatingInline) {
      inputRef.current?.focus();
    }
  }, [isCreatingInline]);

  return (
    <>
      <Button
        variant="primary"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
        disabled={isCreatingInline || isCreating}
        onClick={() => setIsCreatingInline(true)}
        data-testid="create-sport-category-button"
      >
        {t('categories.addCategory')}
      </Button>

      {isCreatingInline && (
        <NamedResourceInput
          inputRef={inputRef}
          initialValue=""
          action={async (name: string) => {
            await createCategory({ name });
            setIsCreatingInline(false);
          }}
          setIsVisible={setIsCreatingInline}
          isCreate
        />
      )}
    </>
  );
};
