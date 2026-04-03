import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { getButtonClassName } from '@ui';

export const Title = () => {
  const { t } = useTranslation('common');

  return (
    <Link
      to="/"
      className={getButtonClassName({ variant: 'ghost', className: 'py-0 sm:py-1' })}
    >
      <h1 className="px-2 text-xl sm:text-3xl font-bold">{t('title')}</h1>
    </Link>
  );
};
