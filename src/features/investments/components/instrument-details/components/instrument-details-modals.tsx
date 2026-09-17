import { useNavigate } from 'react-router-dom';

import type {
  InvestmentInstrument,
  InvestmentSnapshotOperation,
} from '@features/investments/api';
import {
  DeleteInstrumentModal,
  UpdateInstrumentModal,
} from '@features/investments/components/instruments';
import {
  CreateSnapshotModal,
  DeleteSnapshotModal,
  EditSnapshotModal,
} from '@features/investments/components/snapshots';

type InstrumentDetailsModalsProps = {
  instrument: InvestmentInstrument;
  isCreateSnapshotModalOpen: boolean;
  onCloseCreateSnapshotModal: () => void;
  editingSnapshot: InvestmentSnapshotOperation | null;
  onCloseEditSnapshotModal: () => void;
  deletingSnapshot: InvestmentSnapshotOperation | null;
  onCloseDeleteSnapshotModal: () => void;
  isUpdateInstrumentModalOpen: boolean;
  onCloseUpdateInstrumentModal: () => void;
  isDeleteInstrumentModalOpen: boolean;
  onCloseDeleteInstrumentModal: () => void;
};

export const InstrumentDetailsModals = ({
  instrument,
  isCreateSnapshotModalOpen,
  onCloseCreateSnapshotModal,
  editingSnapshot,
  onCloseEditSnapshotModal,
  deletingSnapshot,
  onCloseDeleteSnapshotModal,
  isUpdateInstrumentModalOpen,
  onCloseUpdateInstrumentModal,
  isDeleteInstrumentModalOpen,
  onCloseDeleteInstrumentModal,
}: InstrumentDetailsModalsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <CreateSnapshotModal
        isOpen={isCreateSnapshotModalOpen}
        onClose={onCloseCreateSnapshotModal}
        defaultInstrumentId={instrument.id}
        defaultCurrency={instrument.currency}
        isInstrumentDisabled={true}
      />

      <EditSnapshotModal
        snapshot={editingSnapshot}
        isOpen={Boolean(editingSnapshot)}
        onClose={onCloseEditSnapshotModal}
      />

      <DeleteSnapshotModal
        snapshot={deletingSnapshot}
        instrument={instrument}
        isOpen={Boolean(deletingSnapshot)}
        onClose={onCloseDeleteSnapshotModal}
      />

      <UpdateInstrumentModal
        instrument={instrument}
        isOpen={isUpdateInstrumentModalOpen}
        onClose={onCloseUpdateInstrumentModal}
      />

      <DeleteInstrumentModal
        instrument={instrument}
        isOpen={isDeleteInstrumentModalOpen}
        onClose={onCloseDeleteInstrumentModal}
        onSuccess={() => navigate('/investments/instruments')}
      />
    </>
  );
};
