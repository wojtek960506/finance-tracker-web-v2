import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import {
  linkSportSpendings,
  type LinkSportSpendingsPayload,
  sportsQueryKeys,
  unlinkSportSpending,
  type UnlinkSportSpendingPayload,
} from '../api';

export type UseSportSpendingLinkingOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const useSportSpendingLinking = (options?: UseSportSpendingLinkingOptions) => {
  const { t } = useTranslation('sports');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const invalidateEntriesAndStats = () => {
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.entries(),
    });
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.stats(),
    });
  };

  const linkMutation = useMutation({
    mutationFn: (payload: LinkSportSpendingsPayload) => linkSportSpendings(payload),
    onSuccess: () => {
      invalidateEntriesAndStats();
      pushToast({
        variant: 'success',
        title: t('toasts.spendingsLinkedSuccess', {
          defaultValue: 'Activities linked to transaction successfully.',
        }),
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.spendingsLinkError', {
          defaultValue: 'Failed to link activities to transaction.',
        }),
        message: apiError.message,
      });
      options?.onError?.(error);
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: (payload: UnlinkSportSpendingPayload) => unlinkSportSpending(payload),
    onSuccess: () => {
      invalidateEntriesAndStats();
      pushToast({
        variant: 'success',
        title: t('toasts.spendingsUnlinkedSuccess', {
          defaultValue: 'Activity unlinked from transaction successfully.',
        }),
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.spendingsUnlinkError', {
          defaultValue: 'Failed to unlink activity from transaction.',
        }),
        message: apiError.message,
      });
      options?.onError?.(error);
    },
  });

  return {
    linkSpendings: linkMutation.mutateAsync,
    isLinking: linkMutation.isPending,
    unlinkSpending: unlinkMutation.mutateAsync,
    isUnlinking: unlinkMutation.isPending,
    isPending: linkMutation.isPending || unlinkMutation.isPending,
  };
};
