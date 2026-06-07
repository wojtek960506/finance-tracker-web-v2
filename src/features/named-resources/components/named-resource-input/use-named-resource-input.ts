import { type KeyboardEvent, type RefObject, useEffect, useState } from 'react';

type UseNamedResourceInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  initialValue: string;
  action: (name: string) => Promise<void>;
  onError?: (err: unknown) => void;
  setIsVisible: (isVisible: boolean) => void;
  isCreate: boolean;
  autoCloseOnSubmit?: boolean;
};

export const useNamedResourceInput = ({
  inputRef,
  initialValue,
  action,
  onError,
  setIsVisible,
  isCreate,
  autoCloseOnSubmit = true,
}: UseNamedResourceInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    if (value === '') return;

    try {
      setIsError(false);
      setIsSubmitting(true);
      await action(value);
      if (autoCloseOnSubmit) setIsVisible(false);
      if (isCreate) setValue(initialValue);
    } catch (error) {
      setIsError(true);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setValue(initialValue);
    setIsError(false);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
      return;
    }

    if (event.key !== 'Enter') return;

    event.preventDefault();
    await handleSubmit();
  };

  useEffect(() => {
    if (isSubmitting || !isError) return;

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [inputRef, isError, isSubmitting]);

  return {
    handleCancel,
    handleKeyDown,
    handleSubmit,
    isError,
    isSubmitting,
    setValue,
    value,
  };
};
