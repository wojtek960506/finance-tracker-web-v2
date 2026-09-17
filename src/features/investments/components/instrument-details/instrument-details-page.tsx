import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const InstrumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('navigation');

  return (
    <div
      className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-4 p-2"
      data-testid="instrument-details-page"
    >
      <p className="text-text-muted">
        {t('instrumentDetails')}: {id}
      </p>
    </div>
  );
};
