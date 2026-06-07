import './named-resource-input.css';

import clsx from 'clsx';
import { Check, LoaderCircle, X } from 'lucide-react';
import { type KeyboardEvent, type RefObject } from 'react';

import { Button, Card, Input } from '@shared/ui';

type NamedResourceInputViewProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isError: boolean;
  isCreate: boolean;
};

export const NamedResourceInputView = ({
  inputRef,
  value,
  onChange,
  onSubmit,
  onCancel,
  onKeyDown,
  isSubmitting,
  isError,
  isCreate,
}: NamedResourceInputViewProps) => {
  const focusClassName =
    'focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-bt-primary-border';

  return (
    <Card
      className={clsx(
        'flex-row gap-1 sm:gap-1 items-center',
        isCreate ? 'bg-bt-primary' : 'bg-bt-secondary',
      )}
    >
      <div className="relative w-full">
        <Input
          ref={inputRef}
          value={value}
          className={clsx(
            'w-full pr-9 sm:pr-10',
            focusClassName,
            isError && 'shake border-1 border-destructive focus-visible:border-0',
          )}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={isSubmitting}
        />
        {isSubmitting && (
          <LoaderCircle
            className={clsx(
              'pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2',
              'animate-spin text-text-muted sm:size-5',
            )}
            aria-hidden="true"
          />
        )}
      </div>
      <Button
        variant="primary"
        className={focusClassName}
        onClick={async () => await onSubmit()}
        disabled={value === '' || isSubmitting}
      >
        <Check />
      </Button>
      <Button
        variant="destructive"
        className={focusClassName}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X />
      </Button>
    </Card>
  );
};
