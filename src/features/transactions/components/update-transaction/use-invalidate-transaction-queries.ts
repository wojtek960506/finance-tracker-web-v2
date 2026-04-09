import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateTransactionQueries = () => {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['transaction'] }),
    ]);
  };
};
