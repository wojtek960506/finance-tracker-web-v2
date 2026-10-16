import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, type ButtonVariant, Modal } from '@shared/ui';

export type DeleteVehicleRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isPending: boolean;
  title: string;
  prompt: string;
  hint?: string;
  hintClassName?: string;
  confirmLabel: string;
  cancelLabel?: string;
  testIdPrefix: string;
  confirmVariant?: ButtonVariant;
  children?: ReactNode;
};

export const DeleteVehicleRecordModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title,
  prompt,
  hint,
  hintClassName = 'text-xs text-destructive',
  confirmLabel,
  cancelLabel,
  testIdPrefix,
  confirmVariant = 'destructive',
  children,
}: DeleteVehicleRecordModalProps) => {
  const { t: tCommon } = useTranslation('common');

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={title}>
      <div className="flex flex-col gap-4" data-testid={`delete-${testIdPrefix}-modal`}>
        <header className="space-y-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">{title}</h2>
          <p className="text-xs text-text-muted">{prompt}</p>
        </header>

        {children}

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
            onClick={() => void onConfirm()}
            disabled={isPending}
            data-testid={`confirm-delete-${testIdPrefix}-button`}
          >
            {isPending ? tCommon('loading') : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
