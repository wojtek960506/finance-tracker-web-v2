import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
  getInstrument,
  getOperations,
  type InvestmentSnapshotOperation,
} from '@features/investments/api';
import { Card, LoadingCard } from '@shared/ui';

import {
  InstrumentDetailsHeader,
  InstrumentDetailsModals,
  InstrumentOperationsLedger,
  InstrumentSummaryMetrics,
} from './components';
import { calculateInstrumentMetrics } from './utils';

export const InstrumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('investments');

  const [isCreateSnapshotModalOpen, setIsCreateSnapshotModalOpen] = useState(false);
  const [editingSnapshot, setEditingSnapshot] =
    useState<InvestmentSnapshotOperation | null>(null);
  const [deletingSnapshot, setDeletingSnapshot] =
    useState<InvestmentSnapshotOperation | null>(null);
  const [isUpdateInstrumentModalOpen, setIsUpdateInstrumentModalOpen] = useState(false);
  const [isDeleteInstrumentModalOpen, setIsDeleteInstrumentModalOpen] = useState(false);

  const {
    data: instrument,
    isLoading: isLoadingInstrument,
    error: instrumentError,
  } = useQuery({
    queryKey: ['instrument', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing instrument id');
      return await getInstrument(id);
    },
    enabled: Boolean(id),
  });

  const {
    data: operations = [],
    isLoading: isLoadingOperations,
    error: operationsError,
  } = useQuery({
    queryKey: ['operations', { instrumentId: id }],
    queryFn: async () => {
      if (!id) return [];
      return await getOperations({ instrumentId: id });
    },
    enabled: Boolean(id),
  });

  const isLoading = isLoadingInstrument || isLoadingOperations;
  const error = instrumentError || operationsError;

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-4 p-2 sm:p-4">
        <LoadingCard
          title={t('details.loadingTitle')}
          description={t('details.loadingDescription')}
          widthClassName="max-w-[35rem]"
        />
      </div>
    );
  }

  if (error || !instrument) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-4 p-2 sm:p-4">
        <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {t('details.notFoundTitle')}
          </h2>
          <p className="max-w-md text-xs text-text-muted sm:text-sm">
            {t('details.notFoundDescription')}
          </p>
          <Link
            to="/investments/instruments"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>{t('details.backToInstruments')}</span>
          </Link>
        </Card>
      </div>
    );
  }

  const metrics = calculateInstrumentMetrics(operations);

  return (
    <div
      className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-6 p-2 sm:p-4"
      data-testid="instrument-details-page"
    >
      <InstrumentDetailsHeader
        instrument={instrument}
        onRecordSnapshot={() => setIsCreateSnapshotModalOpen(true)}
        onEditInstrument={() => setIsUpdateInstrumentModalOpen(true)}
        onDeleteInstrument={() => setIsDeleteInstrumentModalOpen(true)}
      />

      <InstrumentSummaryMetrics metrics={metrics} currency={instrument.currency} />

      <InstrumentOperationsLedger
        instrument={instrument}
        operations={operations}
        onRecordSnapshot={() => setIsCreateSnapshotModalOpen(true)}
        onEditSnapshot={(snapshot) => setEditingSnapshot(snapshot)}
        onDeleteSnapshot={(snapshot) => setDeletingSnapshot(snapshot)}
      />

      <InstrumentDetailsModals
        instrument={instrument}
        isCreateSnapshotModalOpen={isCreateSnapshotModalOpen}
        onCloseCreateSnapshotModal={() => setIsCreateSnapshotModalOpen(false)}
        editingSnapshot={editingSnapshot}
        onCloseEditSnapshotModal={() => setEditingSnapshot(null)}
        deletingSnapshot={deletingSnapshot}
        onCloseDeleteSnapshotModal={() => setDeletingSnapshot(null)}
        isUpdateInstrumentModalOpen={isUpdateInstrumentModalOpen}
        onCloseUpdateInstrumentModal={() => setIsUpdateInstrumentModalOpen(false)}
        isDeleteInstrumentModalOpen={isDeleteInstrumentModalOpen}
        onCloseDeleteInstrumentModal={() => setIsDeleteInstrumentModalOpen(false)}
      />
    </div>
  );
};
