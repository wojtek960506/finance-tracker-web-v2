import { type RefObject } from 'react';

import { NamedResourceInputView } from './named-resource-input-view';
import { useNamedResourceInput } from './use-named-resource-input';

type NamedResourceInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  initialValue: string;
  action: (name: string) => Promise<void>;
  onError?: (err: unknown) => void;
  setIsVisible: (isVisible: boolean) => void;
  isCreate: boolean;
  autoCloseOnSubmit?: boolean;
};

export const NamedResourceInput = (props: NamedResourceInputProps) => {
  const { handleCancel, handleKeyDown, handleSubmit, isError, isSubmitting, setValue, value } =
    useNamedResourceInput(props);

  return (
    <NamedResourceInputView
      inputRef={props.inputRef}
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
      isSubmitting={isSubmitting}
      isError={isError}
      isCreate={props.isCreate}
    />
  );
};
