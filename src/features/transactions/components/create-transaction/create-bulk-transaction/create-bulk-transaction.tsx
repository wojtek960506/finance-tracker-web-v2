import { useTranslation } from 'react-i18next';

import { CreateInstrumentModal } from '@features/investments/components/instruments';
import { Card } from '@shared/ui';
import { preventImplicitFormSubmit } from '@transactions/components/transaction-forms';

import { BulkTransactionDiscardModal } from './bulk-transaction-discard-modal';
import { BulkTransactionFormActions } from './bulk-transaction-form-actions';
import { BulkTransactionRow } from './bulk-transaction-row';
import { useCreateBulkTransaction } from './use-create-bulk-transaction';
import { getDefaultBulkTransactionRowValues } from './utils';

export const CreateBulkTransaction = () => {
  const { t } = useTranslation('transactions');
  const {
    form,
    fields,
    rows,
    meaningfulRows,
    isPending,
    isDiscardModalOpen,
    setIsDiscardModalOpen,
    cancelButtonRef,
    createInstrumentRowIndex,
    setCreateInstrumentRowIndex,
    registerKindSelectTrigger,
    appendRow,
    duplicateLastRow,
    setRowKind,
    deleteRow,
    onSubmit,
    handleCancel,
    handleConfirmDiscard,
    handleCreateInstrumentSuccess,
  } = useCreateBulkTransaction();

  return (
    <Card className="flex max-h-full min-h-0 w-full flex-col gap-3 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold sm:text-lg">
          {t('bulkTransactionPageTitle')}
        </h2>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col gap-2"
        onKeyDown={preventImplicitFormSubmit}
        onSubmit={onSubmit}
      >
        <div className="scrollbar-track-modal min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              const row = rows?.[index] ?? getDefaultBulkTransactionRowValues();
              const previousRowKind = index > 0 ? (rows?.[index - 1]?.kind ?? '') : null;
              const showLabels = index === 0 || previousRowKind !== row.kind;

              return (
                <BulkTransactionRow
                  key={field.id}
                  form={form}
                  index={index}
                  row={row}
                  isDeleteDisabled={fields.length === 1 && row.kind === ''}
                  showLabels={showLabels}
                  registerKindSelectTrigger={registerKindSelectTrigger(index)}
                  onSetRowKind={(kind) => setRowKind(index, kind)}
                  onDeleteRow={() => deleteRow(index)}
                  onAddNewInstrument={() => setCreateInstrumentRowIndex(index)}
                />
              );
            })}
          </div>
        </div>

        <BulkTransactionFormActions
          onAddRow={() => appendRow()}
          onDuplicateLastRow={duplicateLastRow}
          onCancel={handleCancel}
          isPending={isPending}
          isSubmitDisabled={isPending || meaningfulRows.length === 0}
          cancelButtonRef={cancelButtonRef}
        />
      </form>

      <BulkTransactionDiscardModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirm={handleConfirmDiscard}
        meaningfulRowsCount={meaningfulRows.length}
        restoreFocusRef={cancelButtonRef}
      />

      <CreateInstrumentModal
        isOpen={createInstrumentRowIndex !== null}
        onClose={() => setCreateInstrumentRowIndex(null)}
        onSuccess={handleCreateInstrumentSuccess}
      />
    </Card>
  );
};
