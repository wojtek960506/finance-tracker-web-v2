import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { getMatchedRouteTitle } from '@app/routes';

const BASE_TITLE_CLASS = 'px-2 text-[1.75rem] font-bold sm:text-[2rem]';
const AUTH_TITLE_CLASS = 'text-[#6f9228] dark:text-[#98bf41]';
const DEFAULT_TITLE_CLASS = 'text-fg';

export const Title = () => {
  const { pathname } = useLocation();
  const { t: tCommon } = useTranslation('common');
  const { t: tNavigation } = useTranslation('navigation');
  const matchedTitle = getMatchedRouteTitle(pathname);
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const title = matchedTitle
    ? matchedTitle.namespace === 'common'
      ? tCommon(matchedTitle.key)
      : tNavigation(matchedTitle.key)
    : tCommon('title');

  return (
    <h1 className={clsx(BASE_TITLE_CLASS, isAuthRoute ? AUTH_TITLE_CLASS : DEFAULT_TITLE_CLASS)}>
      {title}
    </h1>
  );
};
