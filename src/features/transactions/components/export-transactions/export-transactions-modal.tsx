import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input, Modal } from '@shared/ui';

type ExportTransactionsModalProps = {
  onClose: () => void;
  restoreFocusRef: React.RefObject<HTMLButtonElement | null>;
  fileNamePlaceholder: string;
  isPending: boolean;
  onSubmit: (fileName: string) => void;
};

export const ExportTransactionsModal = ({
  onClose,
  restoreFocusRef,
  fileNamePlaceholder,
  isPending,
  onSubmit,
}: ExportTransactionsModalProps) => {
  const { t } = useTranslation('transactions');
  const [fileName, setFileName] = useState(fileNamePlaceholder);
  const [fileNameError, setFileNameError] = useState<string | null>(null);
  const errorMessage = fileNameError ? t(fileNameError) : null;
  const submitLabel = t(
    isPending ? 'exportingTransactionsSubmit' : 'exportTransactionsSubmit',
  );

  const handleClose = () => !isPending && onClose();

  const handleChange = (value: string) => {
    setFileName(value);

    if (fileNameError && value.trim()) setFileNameError(null);
  };

  const handleSubmit = () => {
    const nextFileName = fileName.trim();

    if (!nextFileName) {
      setFileNameError('exportFileNameRequired');
      return;
    }

    onSubmit(nextFileName);
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      ariaLabel={t('exportTransactionsModalTitle')}
      restoreFocusRef={restoreFocusRef}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            {t('exportTransactionsModalTitle')}
          </h2>
          <p className="text-sm sm:text-base text-text-muted">
            {t('exportTransactionsModalDescription')}
          </p>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm sm:text-base font-medium">
            {t('exportFileNameLabel')}
          </span>
          <Input
            value={fileName}
            onChange={(event) => handleChange(event.target.value)}
            placeholder={fileNamePlaceholder}
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(errorMessage)}
          />
          {errorMessage ? (
            <span className="text-xs sm:text-sm text-destructive">{errorMessage}</span>
          ) : null}
        </label>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
