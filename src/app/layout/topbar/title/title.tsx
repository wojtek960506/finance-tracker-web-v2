import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { getMatchedRouteTitle } from '@app/routes';

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

  return <h1 className="px-2 text-xl sm:text-3xl font-bold">{title}</h1>;
};
