import { createContext } from 'react';

import type {
  InvestmentInstrument,
  InvestmentOperation,
  InvestmentSnapshotOperation,
} from '@features/investments/api';

import type { InstrumentMetrics } from '../utils';

export type InstrumentDetailsContextValue = {
  instrument: InvestmentInstrument;
  operations: InvestmentOperation[];
  metrics: InstrumentMetrics;
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
