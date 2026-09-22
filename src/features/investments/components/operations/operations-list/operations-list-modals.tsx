import type {
  InvestmentInstrument,
  InvestmentOperation,
} from '@features/investments/api';

import { CreateOperationModal } from '../create-operation-modal';
import { DeleteOperationModal } from '../delete-operation-modal';
import { EditOperationModal } from '../edit-operation-modal';

type OperationsListModalsProps = {
  isCreateOperationModalOpen: boolean;
  onCloseCreateOperationModal: () => void;
  editingOperation: InvestmentOperation | null;
  onCloseEditOperationModal: () => void;
  deletingOperation: InvestmentOperation | null;
  onCloseDeleteOperationModal: () => void;
  instrumentsMap: Map<string, InvestmentInstrument>;
};

export const OperationsListModals = ({
  isCreateOperationModalOpen,
  onCloseCreateOperationModal,
  editingOperation,
  onCloseEditOperationModal,
  deletingOperation,
  onCloseDeleteOperationModal,
  instrumentsMap,
}: OperationsListModalsProps) => {
  return (
    <>
      <CreateOperationModal
        isOpen={isCreateOperationModalOpen}
        onClose={onCloseCreateOperationModal}
      />

      <EditOperationModal
        operation={editingOperation}
        isOpen={Boolean(editingOperation)}
        onClose={onCloseEditOperationModal}
      />

      <DeleteOperationModal
        operation={deletingOperation}
        instrument={
          deletingOperation
            ? instrumentsMap.get(deletingOperation.instrumentId)
            : undefined
        }
        isOpen={Boolean(deletingOperation)}
        onClose={onCloseDeleteOperationModal}
      />
    </>
  );
};
