import { useNavigate } from 'react-router-dom';

import {
  DeleteInstrumentModal,
  UpdateInstrumentModal,
} from '@features/investments/components/instruments';
import {
  CreateOperationModal,
  DeleteOperationModal,
  EditOperationModal,
} from '@features/investments/components/operations';

import { useInstrumentDetailsContext } from '../context';

export const InstrumentDetailsModals = () => {
  const navigate = useNavigate();
  const {
    instrument,
    isCreateOperationModalOpen,
    closeCreateOperationModal,
    editingOperation,
    closeEditOperationModal,
    deletingOperation,
    closeDeleteOperationModal,
    isUpdateInstrumentModalOpen,
    closeUpdateInstrumentModal,
    isDeleteInstrumentModalOpen,
    closeDeleteInstrumentModal,
  } = useInstrumentDetailsContext();

  return (
    <>
      <CreateOperationModal
        isOpen={isCreateOperationModalOpen}
        onClose={closeCreateOperationModal}
        defaultInstrumentId={instrument.id}
        defaultCurrency={instrument.currency}
        isInstrumentDisabled={true}
      />

      <EditOperationModal
        operation={editingOperation}
        isOpen={Boolean(editingOperation)}
        onClose={closeEditOperationModal}
      />

      <DeleteOperationModal
        operation={deletingOperation}
        instrument={instrument}
        isOpen={Boolean(deletingOperation)}
        onClose={closeDeleteOperationModal}
      />

      <UpdateInstrumentModal
        instrument={instrument}
        isOpen={isUpdateInstrumentModalOpen}
        onClose={closeUpdateInstrumentModal}
      />

      <DeleteInstrumentModal
        instrument={instrument}
        isOpen={isDeleteInstrumentModalOpen}
        onClose={closeDeleteInstrumentModal}
        onSuccess={() => navigate('/investments/instruments')}
      />
    </>
  );
};
