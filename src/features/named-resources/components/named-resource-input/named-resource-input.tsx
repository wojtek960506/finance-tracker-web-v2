import './named-resource-input.css';

import clsx from 'clsx';
import { Check, LoaderCircle, X } from 'lucide-react';
import { type KeyboardEvent, type RefObject, useEffect, useState } from 'react';

import { Button, Card, Input } from '@shared/ui';

type NamedResourceInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  initialValue: string;
  action: (name: string) => Promise<void>;
  onError?: (err: unknown) => void;
  setIsVisible: (isVisible: boolean) => void;
  isCreate: boolean;
  autoCloseOnSubmit?: boolean;
};

// TODO probably split this component
export const NamedResourceInput = ({
  inputRef,
  initialValue = '',
  action,
  onError,
  setIsVisible,
  isCreate,
  autoCloseOnSubmit = true,
}: NamedResourceInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const focusClassName =
    'focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-bt-primary-border';

  const handleSubmit = async () => {
    if (value === '') return;

    try {
      setIsError(false);
      setIsSubmitting(true);
      await action(value);
      if (autoCloseOnSubmit) setIsVisible(false);
      if (isCreate) setValue(initialValue);
    } catch (err) {
      setIsError(true);
      onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitting || !isError) return;

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [inputRef, isError, isSubmitting]);

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsVisible(false);
      setValue(initialValue);
      setIsError(false);
      return;
    }

    if (event.key !== 'Enter') return;

    event.preventDefault();
    await handleSubmit();
  };

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
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />
        {isSubmitting && (
          <LoaderCircle
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-text-muted sm:size-5"
            aria-hidden="true"
          />
        )}
      </div>
      <Button
        variant="primary"
        className={focusClassName}
        onClick={async () => await handleSubmit()}
        disabled={value === '' || isSubmitting}
      >
        <Check />
      </Button>
      <Button
        variant="destructive"
        className={focusClassName}
        onClick={() => {
          setIsVisible(false);
          setValue(initialValue);
        }}
        disabled={isSubmitting}
      >
        <X />
      </Button>
    </Card>
  );
};
