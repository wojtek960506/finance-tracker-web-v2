import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesQueryKeys } from '@vehicles/consts';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

export type UseDeleteVehicleRecordMutationOptions = {
  mutationFn: () => Promise<void>;
  successTitle: string;
  errorTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const useDeleteVehicleRecordMutation = ({
  mutationFn,
  successTitle,
  errorTitle,
  onClose,
  onSuccess,
  onError,
}: UseDeleteVehicleRecordMutationOptions) => {
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: successTitle,
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: errorTitle,
        message: apiError.message,
      });
      onError?.(error);
    },
  });
};
