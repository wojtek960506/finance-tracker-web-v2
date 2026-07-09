import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import { exportTransactions, type TransactionFilters } from '@transactions/api';

import {
  DEFAULT_EXPORT_FILE_BASE,
  downloadCsvFile,
  getExportFilename,
} from './export-transactions.utils';
import { ExportTransactionsModal } from './export-transactions-modal';

type ExportTransactionsProps = { filters: TransactionFilters };

export const ExportTransactionsButton = ({ filters }: ExportTransactionsProps) => {
  const { t } = useTranslation('transactions');
  const pushToast = useToastStore((state) => state.pushToast);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exportMutation = useMutation({
    mutationFn: () => exportTransactions(filters),
  });
  const isPending = exportMutation.isPending;
  const buttonLabel = t(isPending ? 'exportingTransactions' : 'exportTransactions');

  const handleCloseModal = () => !isPending && setIsModalOpen(false);

  const handleExport = async (fileName: string) => {
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
        className={clsx(
          FORM_BUTTON_SIZE_CLASS,
          'w-full gap-2 font-semibold sm:font-bold',
        )}
        disabled={isPending}
        onClick={() => setIsModalOpen(true)}
      >
        <Download className="size-4 sm:size-5" aria-hidden="true" />
        <span>{buttonLabel}</span>
      </Button>
      {isModalOpen ? (
        <ExportTransactionsModal
          onClose={handleCloseModal}
          restoreFocusRef={buttonRef}
          fileNamePlaceholder={DEFAULT_EXPORT_FILE_BASE}
          isPending={isPending}
          onSubmit={(nextFileName) => void handleExport(nextFileName)}
        />
      ) : null}
    </>
  );
};
