import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { IS_SM_MEDIA_QUERY } from '@shared/consts';
import { useMediaQuery } from '@shared/hooks';
import { Button } from '@shared/ui';

import { getPaginationItems } from './get-pagination-items';

type TransactionsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// TODO maybe split this component
export const TransactionsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: TransactionsPaginationProps) => {
  const { t } = useTranslation('transactions');
  const isSmScreen = useMediaQuery(IS_SM_MEDIA_QUERY);
  const paginationButtonCn = clsx(
    'px-0.5 sm:min-w-10 sm:px-1 text-sm sm:text-base text-center',
    totalPages > 10003 ? 'min-w-5' : 'min-w-7',
  );

  if (totalPages <= 0) return null;

  const items = getPaginationItems(currentPage, totalPages, isSmScreen ? 2 : 1);

  return (
    <nav
      aria-label={t('pagination')}
      className="grid grid-cols-[auto_1fr_auto]  gap-2 pt-2 sm:pt-3"
    >
      <Button
        type="button"
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={t('previousPage')}
        className={clsx('justify-self-start', paginationButtonCn)}
      >
        <ChevronLeft className="size-5" />
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-0 sm:gap-0">
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className={paginationButtonCn}
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant="ghost"
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              className={clsx(
                paginationButtonCn,
                item === currentPage
                  ? 'font-bold text-active-nav underline underline-offset-4'
                  : 'text-text-muted hover:text-fg',
              )}
            >
              {item}
            </Button>
          ),
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={t('nextPage')}
        className={clsx('justify-self-end', paginationButtonCn)}
      >
        <ChevronRight className="size-5" />
      </Button>
    </nav>
  );
};
