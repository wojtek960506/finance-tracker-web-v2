import { useTranslation } from 'react-i18next';

import { Card } from '@ui';

export const InvestmentsPage = () => {
  const { t } = useTranslation('navigation');

  return (
    <Card className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6 sm:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('investments')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          First entry point for the investments area.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-4">
        <p className="text-sm font-medium">TODO</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Connect investments API.</li>
          <li>Add portfolio summary.</li>
          <li>Show holdings and activity.</li>
        </ul>
      </div>
    </Card>
  );
};
