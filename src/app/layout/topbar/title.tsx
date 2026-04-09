import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { getMatchedRouteTitle } from '@app/routes';
import { getButtonClassName } from '@ui';

export const Title = () => {
  const { pathname } = useLocation();
  const { t: tCommon } = useTranslation('common');
  const { t: tNavigation } = useTranslation('navigation');
  const matchedTitle = getMatchedRouteTitle(pathname);
  const title = matchedTitle
    ? matchedTitle.namespace === 'common'
      ? tCommon(matchedTitle.key)
      : tNavigation(matchedTitle.key)
    : tCommon('title');
  const isPublicPage = matchedTitle?.namespace === 'common';

  if (!isPublicPage) {
    return <h1 className="px-2 text-xl sm:text-3xl font-bold">{title}</h1>;
  }

  return (
    <Link
      to="/"
      className={getButtonClassName({ variant: 'ghost', className: 'py-0 sm:py-1' })}
    >
      <h1 className="px-2 text-xl sm:text-3xl font-bold">{title}</h1>
    </Link>
  );
};
