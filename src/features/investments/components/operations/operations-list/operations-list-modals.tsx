import type {
  InvestmentInstrument,
  InvestmentSnapshotOperation,
} from '@features/investments/api';
import {
  CreateSnapshotModal,
  DeleteSnapshotModal,
  EditSnapshotModal,
} from '@features/investments/components/snapshots';

type OperationsListModalsProps = {
  isCreateSnapshotModalOpen: boolean;
  onCloseCreateSnapshotModal: () => void;
  editingSnapshot: InvestmentSnapshotOperation | null;
  onCloseEditSnapshotModal: () => void;
  deletingSnapshot: InvestmentSnapshotOperation | null;
  onCloseDeleteSnapshotModal: () => void;
  instrumentsMap: Map<string, InvestmentInstrument>;
};

export const OperationsListModals = ({
  isCreateSnapshotModalOpen,
  onCloseCreateSnapshotModal,
  editingSnapshot,
  onCloseEditSnapshotModal,
  deletingSnapshot,
  onCloseDeleteSnapshotModal,
  instrumentsMap,
}: OperationsListModalsProps) => {
  return (
    <>
      <CreateSnapshotModal
        isOpen={isCreateSnapshotModalOpen}
        onClose={onCloseCreateSnapshotModal}
      />

      <EditSnapshotModal
        snapshot={editingSnapshot}
        isOpen={Boolean(editingSnapshot)}
        onClose={onCloseEditSnapshotModal}
      />

      <DeleteSnapshotModal
        snapshot={deletingSnapshot}
        instrument={
          deletingSnapshot ? instrumentsMap.get(deletingSnapshot.instrumentId) : undefined
        }
        isOpen={Boolean(deletingSnapshot)}
        onClose={onCloseDeleteSnapshotModal}
      />
    </>
  );
};
