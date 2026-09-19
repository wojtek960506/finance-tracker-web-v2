import { createContext } from 'react';

import type {
  InvestmentInstrumentSummary,
  InvestmentOperation,
  InvestmentSnapshotOperation,
} from '@features/investments/api';

export type InstrumentDetailsContextValue = {
  instrument: InvestmentInstrumentSummary;
  operations: InvestmentOperation[];
  currency: string;
  isCreateSnapshotModalOpen: boolean;
  openCreateSnapshotModal: () => void;
  closeCreateSnapshotModal: () => void;
  editingSnapshot: InvestmentSnapshotOperation | null;
  openEditSnapshotModal: (snapshot: InvestmentSnapshotOperation) => void;
  closeEditSnapshotModal: () => void;
  deletingSnapshot: InvestmentSnapshotOperation | null;
  openDeleteSnapshotModal: (snapshot: InvestmentSnapshotOperation) => void;
  closeDeleteSnapshotModal: () => void;
  isUpdateInstrumentModalOpen: boolean;
  openUpdateInstrumentModal: () => void;
  closeUpdateInstrumentModal: () => void;
  isDeleteInstrumentModalOpen: boolean;
  openDeleteInstrumentModal: () => void;
  closeDeleteInstrumentModal: () => void;
};

export const InstrumentDetailsContext =
  createContext<InstrumentDetailsContextValue | null>(null);
