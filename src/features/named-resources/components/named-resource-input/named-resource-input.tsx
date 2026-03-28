import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { type RefObject,useState } from 'react';

import { Button, Card, Input } from '@shared/ui';

type NamedResourceInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  initialValue: string;
  action: (name: string) => void;
  setIsVisible: (isVisible: boolean) => void;
  isCreate: boolean;
  autoCloseOnSubmit?: boolean;
};

export const NamedResourceInput = ({
  inputRef,
  initialValue = "",
  action,
  setIsVisible,
  isCreate,
  autoCloseOnSubmit = true,
}: NamedResourceInputProps) => {

  const [value, setValue] = useState(initialValue);

  return (
  <Card
    className={clsx(
      'flex-row gap-1 sm:gap-1 items-center',
      isCreate ? 'bg-bt-primary' : 'bg-bt-secondary',
    )}
  >
    <Input
      ref={inputRef}
      value={value}
      className="w-full"
      onChange={(event) => setValue(event.target.value)}
    />
    <Button
      disabled={value === ''}
      variant="primary"
      onClick={() => {
        action(value);
        if (autoCloseOnSubmit) setIsVisible(false);
        if (isCreate) setValue(initialValue);
      }}
    >
      <Check />
    </Button>
    <Button
      variant="destructive"
      onClick={() => {
        setIsVisible(false);
        setValue(initialValue);
      }}
    >
      <X />
    </Button>
  </Card>);
};
