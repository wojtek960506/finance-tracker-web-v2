import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import { exportTransactions, type TransactionFilters } from '@transactions/api';

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

export const ExportTransactionsButton = ({ filters }: ExportTransactionsProps) => {
  const { t } = useTranslation('transactions');
  const pushToast = useToastStore((state) => state.pushToast);

  const exportMutation = useMutation({
    mutationFn: async () => await exportTransactions(filters),
  });

  const handleExport = async () => {
    try {
      const { csv, fileName } = await exportMutation.mutateAsync();

      downloadCsvFile(csv, fileName);

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
    <Button
      type="button"
      variant="outline"
      className={clsx(FORM_BUTTON_SIZE_CLASS, 'w-full gap-2 font-semibold sm:font-bold')}
      disabled={exportMutation.isPending}
      onClick={() => void handleExport()}
    >
      <Download className="size-4 sm:size-5" aria-hidden="true" />
      <span>{exportMutation.isPending ? t('exportingTransactions') : t('exportTransactions')}</span>
    </Button>
  );
};
