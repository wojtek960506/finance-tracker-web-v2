import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

export type VehiclePageErrorProps = {
  error?: Error | null;
  fallbackMessage?: string;
  onRetry: () => void;
  testId: string;
};

export const VehiclePageError = ({
  error,
  fallbackMessage,
  onRetry,
  testId,
}: VehiclePageErrorProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
      data-testid={testId}
    >
      <AlertCircle className="size-8 text-destructive" />
      <p className="text-sm font-semibold text-fg">
        {error?.message || fallbackMessage || t('toasts.updateErrorTitle')}
      </p>
      <Button variant="secondary" onClick={() => void onRetry()}>
        Retry
      </Button>
    </div>
  );
};
