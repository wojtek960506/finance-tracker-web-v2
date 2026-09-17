import type {
  InvestmentInstrument,
  InvestmentSnapshotOperation,
} from '@features/investments/api';
import {
  CreateSnapshotModal,
  DeleteSnapshotModal,
} from '@features/investments/components/snapshots';

type OperationsListModalsProps = {
  isCreateSnapshotModalOpen: boolean;
  onCloseCreateSnapshotModal: () => void;
  deletingSnapshot: InvestmentSnapshotOperation | null;
  onCloseDeleteSnapshotModal: () => void;
  instrumentsMap: Map<string, InvestmentInstrument>;
};

export const OperationsListModals = ({
  isCreateSnapshotModalOpen,
  onCloseCreateSnapshotModal,
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
