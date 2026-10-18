import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../button';
import { Modal } from '../modal';

import type { DeleteRecordModalProps } from './types';

export const DeleteRecordModal = <T = unknown,>({
  isOpen,
  onClose,
  onConfirm,
  isPending: externalIsPending,
  title,
  prompt,
  hint,
  hintClassName = 'text-xs text-destructive',
  confirmLabel,
  cancelLabel,
  testIdPrefix,
  confirmVariant = 'destructive',
  item,
  children,
}: DeleteRecordModalProps<T>) => {
  const { t: tCommon } = useTranslation('common');
  const [internalPending, setInternalPending] = useState(false);
  const isPending = externalIsPending ?? internalPending;

  if (item === null) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      setInternalPending(true);
      await onConfirm();
    } finally {
      setInternalPending(false);
    }
  };

  const renderedContent =
    typeof children === 'function' ? (item ? children(item) : null) : children;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={title}>
      <div className="flex flex-col gap-4" data-testid={`delete-${testIdPrefix}-modal`}>
        <header className="space-y-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">{title}</h2>
          <p className="text-xs text-text-muted">{prompt}</p>
        </header>

        {renderedContent}

        {hint && <p className={hintClassName}>{hint}</p>}

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
            data-testid={`cancel-delete-${testIdPrefix}-button`}
          >
            {cancelLabel || tCommon('cancel')}
          </Button>

          <Button
            type="button"
            variant={confirmVariant}
            onClick={() => void handleConfirm()}
            disabled={isPending}
            data-testid={`confirm-delete-${testIdPrefix}-button`}
          >
            {isPending ? tCommon('loading') : confirmLabel || tCommon('delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
