import { useNavigate } from 'react-router-dom';

import {
  DeleteInstrumentModal,
  UpdateInstrumentModal,
} from '@features/investments/components/instruments';
import {
  CreateSnapshotModal,
  DeleteSnapshotModal,
  EditSnapshotModal,
} from '@features/investments/components/snapshots';

import { useInstrumentDetailsContext } from '../context';

export const InstrumentDetailsModals = () => {
  const navigate = useNavigate();
  const {
    instrument,
    isCreateSnapshotModalOpen,
    closeCreateSnapshotModal,
    editingSnapshot,
    closeEditSnapshotModal,
    deletingSnapshot,
    closeDeleteSnapshotModal,
    isUpdateInstrumentModalOpen,
    closeUpdateInstrumentModal,
    isDeleteInstrumentModalOpen,
    closeDeleteInstrumentModal,
  } = useInstrumentDetailsContext();

  return (
    <>
      <CreateSnapshotModal
        isOpen={isCreateSnapshotModalOpen}
        onClose={closeCreateSnapshotModal}
        defaultInstrumentId={instrument.id}
        defaultCurrency={instrument.currency}
        isInstrumentDisabled={true}
      />

      <EditSnapshotModal
        snapshot={editingSnapshot}
        isOpen={Boolean(editingSnapshot)}
        onClose={closeEditSnapshotModal}
      />

      <DeleteSnapshotModal
        snapshot={deletingSnapshot}
        instrument={instrument}
        isOpen={Boolean(deletingSnapshot)}
        onClose={closeDeleteSnapshotModal}
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
