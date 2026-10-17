import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  linkSpendings,
  type LinkSpendingsToTransactionPayload,
  unlinkSpending,
  type UnlinkSpendingPayload,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

export type UseSpendingLinkingOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const useSpendingLinking = (options?: UseSpendingLinkingOptions) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const linkMutation = useMutation({
    mutationFn: async (payload: LinkSpendingsToTransactionPayload) => {
      return await linkSpendings(payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('spendings.toasts.linkedSuccess'),
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('spendings.toasts.linkError'),
        message: apiError.message,
      });
      options?.onError?.(error);
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async (payload: UnlinkSpendingPayload) => {
      return await unlinkSpending(payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('spendings.toasts.unlinkedSuccess'),
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('spendings.toasts.unlinkError'),
        message: apiError.message,
      });
      options?.onError?.(error);
    },
  });

  return {
    linkSpendings: linkMutation.mutateAsync,
    unlinkSpending: unlinkMutation.mutateAsync,
    isLinking: linkMutation.isPending,
    isUnlinking: unlinkMutation.isPending,
    isPending: linkMutation.isPending || unlinkMutation.isPending,
  };
};
