import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button, Input, Modal } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import {
  DEFAULT_EXPORT_FILENAME,
  exportTransactions,
  type TransactionFilters,
} from '@transactions/api';

const downloadCsvFile = (csv: Blob, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(csv);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

type ExportTransactionsProps = {
  filters: TransactionFilters;
};

const DEFAULT_EXPORT_FILE_BASE = DEFAULT_EXPORT_FILENAME.replace(/\.csv$/i, '');

const formatExportTimestamp = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

const getExportFilename = (fileBase: string, now = new Date()) => {
  const trimmedFileBase = fileBase.trim();
  const normalizedFileBase = trimmedFileBase.replace(/\.csv$/i, '');
  const safeFileBase = normalizedFileBase || DEFAULT_EXPORT_FILE_BASE;

  return `${safeFileBase}_${formatExportTimestamp(now)}.csv`;
};

export const ExportTransactionsButton = ({ filters }: ExportTransactionsProps) => {
  // TODO: Split this component into smaller pieces once the export modal flow settles down.
  const { t } = useTranslation('transactions');
  const pushToast = useToastStore((state) => state.pushToast);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState(DEFAULT_EXPORT_FILE_BASE);
  const [fileNameError, setFileNameError] = useState<string | null>(null);

  const exportMutation = useMutation({
    mutationFn: async () => await exportTransactions(filters),
  });

  const handleCloseModal = () => {
    if (exportMutation.isPending) return;

    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setFileName(DEFAULT_EXPORT_FILE_BASE);
    setFileNameError(null);
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    if (!fileName.trim()) {
      setFileNameError('exportFileNameRequired');
      return;
    }

    try {
      const { csv } = await exportMutation.mutateAsync();

      downloadCsvFile(csv, getExportFilename(fileName));
      setIsModalOpen(false);

      pushToast({
        variant: 'success',
        title: t('transactionsExported'),
      });
    } catch (error) {
      const apiError = normalizeApiError(error);

      pushToast({
        variant: 'error',
        title: t('transactionsExportFailed'),
        message: apiError.message,
      });
    }
  };

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        variant="default"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'w-full gap-2 font-semibold sm:font-bold')}
        disabled={exportMutation.isPending}
        onClick={handleOpenModal}
      >
        <Download className="size-4 sm:size-5" aria-hidden="true" />
        <span>{exportMutation.isPending ? t('exportingTransactions') : t('exportTransactions')}</span>
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ariaLabel={t('exportTransactionsModalTitle')}
        restoreFocusRef={buttonRef}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleExport();
          }}
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t('exportTransactionsModalTitle')}</h2>
            <p className="text-sm text-text-muted">{t('exportTransactionsModalDescription')}</p>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t('exportFileNameLabel')}</span>
            <Input
              value={fileName}
              onChange={(event) => {
                setFileName(event.target.value);

                if (fileNameError && event.target.value.trim()) {
                  setFileNameError(null);
                }
              }}
              placeholder={DEFAULT_EXPORT_FILE_BASE}
              autoComplete="off"
              disabled={exportMutation.isPending}
              aria-invalid={fileNameError ? 'true' : 'false'}
            />
            {fileNameError ? (
              <span className="text-sm text-destructive">{t(fileNameError)}</span>
            ) : null}
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={exportMutation.isPending}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={exportMutation.isPending}>
              {exportMutation.isPending
                ? t('exportingTransactionsSubmit')
                : t('exportTransactionsSubmit')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
