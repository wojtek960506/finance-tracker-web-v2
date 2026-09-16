import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getTransactionsRouteState } from '@transactions/utils';

type UseBulkDiscardModalProps = {
  meaningfulRowsCount: number;
  returnTo: string;
};

export const useBulkDiscardModal = ({
  meaningfulRowsCount,
  returnTo,
}: UseBulkDiscardModalProps) => {
  const navigate = useNavigate();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleCancel = () => {
    if (meaningfulRowsCount === 0) {
      navigate('/transactions/new', {
        state: getTransactionsRouteState(returnTo),
      });
      return;
    }

    setIsDiscardModalOpen(true);
  };

  const handleConfirmDiscard = () => {
    setIsDiscardModalOpen(false);
    navigate('/transactions/new', {
      state: getTransactionsRouteState(returnTo),
    });
  };

  return {
    isDiscardModalOpen,
    setIsDiscardModalOpen,
    cancelButtonRef,
    handleCancel,
    handleConfirmDiscard,
  };
};
