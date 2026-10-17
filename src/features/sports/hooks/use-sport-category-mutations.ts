import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import {
  createSportCategory,
  deleteSportCategory,
  favoriteSportCategory,
  type SportCategoryCreate,
  type SportCategoryUpdate,
  sportsQueryKeys,
  unfavoriteSportCategory,
  updateSportCategory,
} from '../api';

export const useSportCategoryMutations = () => {
  const { t } = useTranslation('sports');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const invalidateCategoriesAndDependent = () => {
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.categories(),
    });
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.entries(),
    });
    void queryClient.invalidateQueries({
      queryKey: sportsQueryKeys.stats(),
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: SportCategoryCreate) => createSportCategory(data),
    onSuccess: () => {
      invalidateCategoriesAndDependent();
      pushToast({
        variant: 'success',
        title: t('toasts.categoryCreatedSuccess'),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.categoryCreateError'),
        message: apiError.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SportCategoryUpdate }) =>
      updateSportCategory(id, data),
    onSuccess: () => {
      invalidateCategoriesAndDependent();
      pushToast({
        variant: 'success',
        title: t('toasts.categoryUpdatedSuccess'),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.categoryUpdateError'),
        message: apiError.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSportCategory(id),
    onSuccess: () => {
      invalidateCategoriesAndDependent();
      pushToast({
        variant: 'success',
        title: t('toasts.categoryDeletedSuccess'),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.categoryDeleteError'),
        message: apiError.message,
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (id: string) => favoriteSportCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: sportsQueryKeys.categories(),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.favoriteError'),
        message: apiError.message,
      });
    },
  });

  const unfavoriteMutation = useMutation({
    mutationFn: (id: string) => unfavoriteSportCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: sportsQueryKeys.categories(),
      });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.unfavoriteError'),
        message: apiError.message,
      });
    },
  });

  return {
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    favoriteCategory: favoriteMutation.mutateAsync,
    isFavoriting: favoriteMutation.isPending,
    unfavoriteCategory: unfavoriteMutation.mutateAsync,
    isUnfavoriting: unfavoriteMutation.isPending,
  };
};
