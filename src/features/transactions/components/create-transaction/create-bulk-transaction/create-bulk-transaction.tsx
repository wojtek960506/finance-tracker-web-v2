import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { CreateInstrumentModal } from '@features/investments/components/instruments';
import { normalizeApiError } from '@shared/api/api-error';
import { Button, Card } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import { createBulkTransactions } from '@transactions/api';
import { TransactionActionModal } from '@transactions/components/shared';
import {
  FieldError,
  FORM_BUTTON_CLASS_NAME,
  normalizeExchangeTransactionFormValues,
  normalizeInvestmentTransactionFormValues,
  normalizeStandardTransactionFormValues,
  normalizeTransferTransactionFormValues,
  preventImplicitFormSubmit,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

import { BulkTransactionKindField } from './bulk-transaction-kind-field';
import { ExchangeRowFields } from './exchange-row-fields';
import { InvestmentRowFields } from './investment-row-fields';
import { bulkTransactionFormSchema } from './schemas';
import { StandardRowFields } from './standard-row-fields';
import { TransferRowFields } from './transfer-row-fields';
import type { BulkTransactionFormValues, BulkTransactionKind } from './types';
import {
  cloneBulkTransactionRowValues,
  getBulkExchangeTransactionFormValues,
  getBulkInvestmentTransactionFormValues,
  getBulkStandardTransactionFormValues,
  getBulkTransactionRowDate,
  getBulkTransferTransactionFormValues,
  getDefaultBulkTransactionRowValues,
  getDeleteActionLabel,
  getMeaningfulBulkTransactionRows,
} from './utils';

export const CreateBulkTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);
  const [isPending, setIsPending] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [createInstrumentRowIndex, setCreateInstrumentRowIndex] = useState<number | null>(
    null,
  );

  const form = useForm<BulkTransactionFormValues>({
    resolver: zodResolver(bulkTransactionFormSchema),
    defaultValues: {
      rows: [getDefaultBulkTransactionRowValues()],
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'rows',
  });
  const rows = useWatch({
    control: form.control,
    name: 'rows',
  });
  const meaningfulRows = getMeaningfulBulkTransactionRows(rows ?? []);
  const kindSelectTriggerRefs = useRef(new Map<number, HTMLButtonElement>());
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const [pendingKindFocusRowIndex, setPendingKindFocusRowIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (pendingKindFocusRowIndex === null) return;

    const trigger = kindSelectTriggerRefs.current.get(pendingKindFocusRowIndex);
    if (!trigger) return;

    trigger.focus();
    setPendingKindFocusRowIndex(null);
  }, [fields.length, pendingKindFocusRowIndex]);

  const registerKindSelectTrigger =
    (index: number) => (node: HTMLButtonElement | null) => {
      if (node) {
        kindSelectTriggerRefs.current.set(index, node);
        return;
      }

      kindSelectTriggerRefs.current.delete(index);
    };

  const appendRow = (rowValues = getDefaultBulkTransactionRowValues()) => {
    const nextRowIndex = fields.length;
    append(rowValues);
    setPendingKindFocusRowIndex(nextRowIndex);
  };

  const duplicateLastRow = () => {
    const currentRows = form.getValues('rows');
    const lastRow =
      currentRows[currentRows.length - 1] ?? getDefaultBulkTransactionRowValues();
    const nextRows = [...currentRows, cloneBulkTransactionRowValues(lastRow)];

    form.reset(
      { rows: nextRows },
      {
        keepDirty: true,
        keepErrors: true,
        keepTouched: true,
      },
    );
    setPendingKindFocusRowIndex(nextRows.length - 1);
  };

  const setRowKind = (index: number, kind: BulkTransactionKind) => {
    const currentRow = form.getValues(`rows.${index}`);
    const date = getBulkTransactionRowDate(currentRow);

    form.setValue(
      `rows.${index}`,
      {
        ...getDefaultBulkTransactionRowValues(),
        kind,
        standardValues: {
          ...getBulkStandardTransactionFormValues(),
          date,
        },
        transferValues: {
          ...getBulkTransferTransactionFormValues(),
          date,
        },
        exchangeValues: {
          ...getBulkExchangeTransactionFormValues(),
          date,
        },
        investmentValues: {
          ...getBulkInvestmentTransactionFormValues(),
          date,
        },
      },
      { shouldDirty: true, shouldValidate: form.formState.isSubmitted },
    );
  };

  const deleteRow = (index: number) => {
    if (fields.length === 1) {
      replace([getDefaultBulkTransactionRowValues()]);
      return;
    }

    remove(index);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const transactionsToCreate = getMeaningfulBulkTransactionRows(values.rows);

    if (transactionsToCreate.length === 0) {
      return;
    }

    setIsPending(true);
    try {
      const createdTransactions = await createBulkTransactions({
        transactions: transactionsToCreate.map((row) => {
          if (row.kind === 'standard') {
            return {
              kind: 'standard' as const,
              ...normalizeStandardTransactionFormValues(row.standardValues),
              amount: Number(row.standardValues.amount),
            };
          }

          if (row.kind === 'transfer') {
            return {
              kind: 'transfer' as const,
              ...normalizeTransferTransactionFormValues(row.transferValues),
              amount: Number(row.transferValues.amount),
            };
          }

          if (row.kind === 'exchange') {
            return {
              kind: 'exchange' as const,
              ...normalizeExchangeTransactionFormValues(row.exchangeValues),
              amountExpense: Number(row.exchangeValues.amountExpense),
              amountIncome: Number(row.exchangeValues.amountIncome),
            };
          }

          return {
            kind: 'investment' as const,
            ...normalizeInvestmentTransactionFormValues(row.investmentValues),
            amount: Number(row.investmentValues.amount),
          };
        }),
      });

      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      pushToast({
        variant: 'success',
        title: t('transactionsCreated'),
        message: shouldWarnAboutHiddenTransactions(createdTransactions, returnTo)
          ? t('transactionMayBeHiddenByCurrentFilters')
          : undefined,
      });
      queryClient.removeQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['transaction-totals'] });
      navigate(returnTo);
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('bulkTransactionCreateFailed'),
        message:
          apiError.message ||
          t('bulkTransactionCreatePartiallyFailedMessage', {
            count: values.rows.length,
          }),
      });
    } finally {
      setIsPending(false);
    }
  });

  const handleCancel = () => {
    if (meaningfulRows.length === 0) {
      navigate('/transactions/new', {
        state: getTransactionsRouteState(returnTo),
      });
      return;
    }

    setIsDiscardModalOpen(true);
  };

  const handleConfirmDiscard = () => {
    setIsDiscardModalOpen(false);
    navigate('/transactions/new', {
      state: getTransactionsRouteState(returnTo),
    });
  };

  return (
    <Card className="flex max-h-full min-h-0 w-full flex-col gap-3 overflow-hidden">
      <TransactionActionModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        ariaLabel={t('bulkTransactionDiscardModalTitle')}
        title={t('bulkTransactionDiscardModalTitle')}
        cancelLabel={t('cancel')}
        confirmLabel={t('bulkTransactionDiscardConfirmLabel')}
        onConfirm={handleConfirmDiscard}
        restoreFocusRef={cancelButtonRef}
      >
        <p>
          {t('bulkTransactionDiscardModalDescription', {
            count: meaningfulRows.length,
          })}
        </p>
      </TransactionActionModal>
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
              const kindError = form.formState.errors.rows?.[index]?.kind?.message;
              const previousRowKind = index > 0 ? (rows?.[index - 1]?.kind ?? '') : null;
              const showLabels = index === 0 || previousRowKind !== row.kind;

              return (
                <div
                  key={field.id}
                  className="overflow-x-auto rounded-xl border border-fg/10 bg-bg/30 p-2"
                >
                  <div className="flex min-w-max items-stretch gap-2">
                    <div className="flex self-stretch flex-col">
                      <Button
                        type="button"
                        variant="ghost"
                        className="my-auto rounded-lg px-2 text-text-muted"
                        onClick={() => deleteRow(index)}
                        aria-label={getDeleteActionLabel(index)}
                        disabled={fields.length === 1 && row.kind === ''}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <BulkTransactionKindField
                        index={index}
                        kind={row.kind}
                        showLabel={showLabels && !(row.kind === '' && index > 0)}
                        triggerRef={registerKindSelectTrigger(index)}
                        setKind={(kind) => setRowKind(index, kind)}
                      />
                      <FieldError message={kindError && t(kindError)} />
                    </div>
                    {row.kind === 'standard' ? (
                      <StandardRowFields
                        form={form}
                        index={index}
                        showLabels={showLabels}
                      />
                    ) : null}
                    {row.kind === 'transfer' ? (
                      <TransferRowFields
                        form={form}
                        index={index}
                        showLabels={showLabels}
                      />
                    ) : null}
                    {row.kind === 'exchange' ? (
                      <ExchangeRowFields
                        form={form}
                        index={index}
                        showLabels={showLabels}
                      />
                    ) : null}
                    {row.kind === 'investment' ? (
                      <InvestmentRowFields
                        form={form}
                        index={index}
                        showLabels={showLabels}
                        onAddNewInstrument={() => setCreateInstrumentRowIndex(index)}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Button
            type="button"
            variant="inverse"
            className={FORM_BUTTON_CLASS_NAME}
            onClick={() => appendRow()}
          >
            {t('addTransactionRow')}
          </Button>
          <Button
            type="button"
            variant="inverse"
            className={FORM_BUTTON_CLASS_NAME}
            onClick={duplicateLastRow}
          >
            {t('duplicateLastRow')}
          </Button>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className={FORM_BUTTON_CLASS_NAME}
              ref={cancelButtonRef}
              onClick={handleCancel}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={FORM_BUTTON_CLASS_NAME}
              disabled={isPending || meaningfulRows.length === 0}
            >
              {isPending ? t('creatingTransactions') : t('createTransactions')}
            </Button>
          </div>
        </div>
      </form>

      <CreateInstrumentModal
        isOpen={createInstrumentRowIndex !== null}
        onClose={() => setCreateInstrumentRowIndex(null)}
        onSuccess={(instrumentId) => {
          if (createInstrumentRowIndex !== null) {
            form.setValue(
              `rows.${createInstrumentRowIndex}.investmentValues.instrumentId`,
              instrumentId,
              { shouldDirty: true, shouldValidate: true },
            );
          }
        }}
      />
    </Card>
  );
};
