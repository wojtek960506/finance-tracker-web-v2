import { createContext } from 'react';

import type {
  InvestmentInstrumentSummary,
  InvestmentOperation,
} from '@features/investments/api';

export type InstrumentDetailsContextValue = {
  instrument: InvestmentInstrumentSummary;
  operations: InvestmentOperation[];
  currency: string;
  isCreateOperationModalOpen: boolean;
  openCreateOperationModal: () => void;
  closeCreateOperationModal: () => void;
  editingOperation: InvestmentOperation | null;
  openEditOperationModal: (operation: InvestmentOperation) => void;
  closeEditOperationModal: () => void;
  deletingOperation: InvestmentOperation | null;
  openDeleteOperationModal: (operation: InvestmentOperation) => void;
  closeDeleteOperationModal: () => void;
  isUpdateInstrumentModalOpen: boolean;
  openUpdateInstrumentModal: () => void;
  closeUpdateInstrumentModal: () => void;
  isDeleteInstrumentModalOpen: boolean;
  openDeleteInstrumentModal: () => void;
  closeDeleteInstrumentModal: () => void;
};

export const InstrumentDetailsContext =
  createContext<InstrumentDetailsContextValue | null>(null);
