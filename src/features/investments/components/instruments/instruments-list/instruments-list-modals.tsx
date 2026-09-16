import type { InvestmentInstrument } from '@features/investments/api';

import { CreateInstrumentModal } from '../create-instrument-modal';
import { DeleteInstrumentModal } from '../delete-instrument-modal';
import { UpdateInstrumentModal } from '../update-instrument-modal';

type InstrumentsListModalsProps = {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  editingInstrument: InvestmentInstrument | null;
  onCloseEditModal: () => void;
  deletingInstrument: InvestmentInstrument | null;
  onCloseDeleteModal: () => void;
};

export const InstrumentsListModals = ({
  isCreateModalOpen,
  onCloseCreateModal,
  editingInstrument,
  onCloseEditModal,
  deletingInstrument,
  onCloseDeleteModal,
}: InstrumentsListModalsProps) => {
  return (
    <>
      <CreateInstrumentModal isOpen={isCreateModalOpen} onClose={onCloseCreateModal} />

      <UpdateInstrumentModal
        instrument={editingInstrument}
        isOpen={Boolean(editingInstrument)}
        onClose={onCloseEditModal}
      />

      <DeleteInstrumentModal
        instrument={deletingInstrument}
        isOpen={Boolean(deletingInstrument)}
        onClose={onCloseDeleteModal}
      />
    </>
  );
};
