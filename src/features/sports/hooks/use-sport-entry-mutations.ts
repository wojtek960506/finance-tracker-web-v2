import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import {
  createSportEntry,
  deleteSportEntry,
  type SportEntryCreate,
  type SportEntryUpdate,
  sportsQueryKeys,
  updateSportEntry,
} from '../api';

export const useSportEntryMutations = () => {
  const { t } = useTranslation('sports');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const invalidateEntriesAndStats = (transactionId?: string | null) => {
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.entries(),
    });
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.stats(),
    });
    if (transactionId) {
      void queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['transaction', transactionId],
      });
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: SportEntryCreate) => createSportEntry(data),
    onSuccess: () => {
      invalidateEntriesAndStats();
      pushToast({
        variant: 'success',
        title: t('toasts.entryCreatedSuccess'),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.entryCreateError'),
        message: apiError.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SportEntryUpdate }) =>
      updateSportEntry(id, data),
    onSuccess: () => {
      invalidateEntriesAndStats();
      pushToast({
        variant: 'success',
        title: t('toasts.entryUpdatedSuccess'),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.entryUpdateError'),
        message: apiError.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (args: string | { id: string; transactionId?: string | null }) => {
      const id = typeof args === 'string' ? args : args.id;
      return deleteSportEntry(id);
    },
    onSuccess: (_data, variables) => {
      const transactionId =
        typeof variables === 'string' ? undefined : variables.transactionId;
      invalidateEntriesAndStats(transactionId);
      pushToast({
        variant: 'success',
        title: t('toasts.entryDeletedSuccess'),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.entryDeleteError'),
        message: apiError.message,
      });
    },
  });

  return {
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEntry: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
