import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { type Ref,useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { normalizeApiError } from '@shared/api/api-error';
import { Button, Card, DateInput, Label } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import { createBulkTransactions } from '@transactions/api';
import {
  CurrencySelectField,
  NamedResourceSelectField,
  TransactionActionModal,
} from '@transactions/components/shared';
import {
  exchangeTransactionFormSchema,
  type ExchangeTransactionFormValues,
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  FORM_BUTTON_CLASS_NAME,
  getDefaultExchangeTransactionFormValues,
  getDefaultStandardTransactionFormValues,
  getDefaultTransferTransactionFormValues,
  normalizeExchangeTransactionFormValues,
  normalizeStandardTransactionFormValues,
  normalizeTransferTransactionFormValues,
  preventImplicitFormSubmit,
  REQUIRED_LABEL_CLASS_NAME,
  standardTransactionFormSchema,
  type StandardTransactionFormValues,
  standardTransactionTypeOptions,
  transferTransactionFormSchema,
  type TransferTransactionFormValues,
} from '@transactions/components/transaction-forms';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  getTransactionTypeSelectItemClassName,
  getTransactionTypeSelectValueClassName,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// TODO split this file into smaller components
// TODO better memoization for list as now when adding or removing row it rerenders whole list

type BulkTransactionKind = 'standard' | 'transfer' | 'exchange';
type BulkTransactionKindValue = BulkTransactionKind | '';

type BulkTransactionRowValues = {
  kind: BulkTransactionKindValue;
  standardValues: StandardTransactionFormValues;
  transferValues: TransferTransactionFormValues;
  exchangeValues: ExchangeTransactionFormValues;
};

type BulkTransactionFormValues = {
  rows: BulkTransactionRowValues[];
};

const bulkTransactionKinds = ['standard', 'transfer', 'exchange'] as const;
const COMPACT_FIELD_CLASS_NAME = `${FIELD_CONTROL_CLASS_NAME} h-9 text-sm`;
const COMPACT_LABEL_CLASS_NAME = 'gap-1 text-xs font-medium text-text-muted';
const INLINE_FIELD_CLASS_NAME = 'w-[10rem] min-w-[10rem] shrink-0';
const INLINE_KIND_FIELD_CLASS_NAME = 'w-[10rem] min-w-[10rem] shrink-0';
const INLINE_LABEL_TEXT_CLASS_NAME = 'sr-only';

const getBulkLabelClassName = (showLabel: boolean, required = false) =>
  showLabel
    ? required
      ? REQUIRED_LABEL_CLASS_NAME
      : ''
    : INLINE_LABEL_TEXT_CLASS_NAME;

const bulkTransactionRowSchema = z
  .object({
    kind: z.enum(['', ...bulkTransactionKinds]),
    standardValues: z.custom<StandardTransactionFormValues>(),
    transferValues: z.custom<TransferTransactionFormValues>(),
    exchangeValues: z.custom<ExchangeTransactionFormValues>(),
  })
  .superRefine((row, ctx) => {
    if (row.kind === '') return;

    const validationResult =
      row.kind === 'standard'
        ? standardTransactionFormSchema.safeParse(row.standardValues)
        : row.kind === 'transfer'
          ? transferTransactionFormSchema.safeParse(row.transferValues)
          : exchangeTransactionFormSchema.safeParse(row.exchangeValues);

    if (validationResult.success) return;

    const valuesPath =
      row.kind === 'standard'
        ? 'standardValues'
        : row.kind === 'transfer'
          ? 'transferValues'
          : 'exchangeValues';

    for (const issue of validationResult.error.issues) {
      ctx.addIssue({
        ...issue,
        path: [valuesPath, ...issue.path],
      });
    }
  });

const bulkTransactionFormSchema = z.object({
  rows: z.array(bulkTransactionRowSchema).min(1),
});

const getBulkStandardTransactionFormValues = (): StandardTransactionFormValues => ({
  ...getDefaultStandardTransactionFormValues(),
  date: '',
  transactionType: '' as StandardTransactionFormValues['transactionType'],
});

const getBulkTransferTransactionFormValues = (): TransferTransactionFormValues => ({
  ...getDefaultTransferTransactionFormValues(),
  date: '',
});

const getBulkExchangeTransactionFormValues = (): ExchangeTransactionFormValues => ({
  ...getDefaultExchangeTransactionFormValues(),
  date: '',
});

const getDefaultBulkTransactionRowValues = (): BulkTransactionRowValues => ({
  kind: '',
  standardValues: getBulkStandardTransactionFormValues(),
  transferValues: getBulkTransferTransactionFormValues(),
  exchangeValues: getBulkExchangeTransactionFormValues(),
});

const getDeleteActionLabel = (index: number) => `delete-row-${index + 1}`;
const getBulkKindTranslationKey = (kind: BulkTransactionKind) =>
  `bulk${kind.charAt(0).toUpperCase()}${kind.slice(1)}Transaction`;

const getMeaningfulBulkTransactionRows = (rows: BulkTransactionRowValues[]) =>
  rows.filter((row) => row.kind !== '');

const getBulkTransactionRowDate = (row: BulkTransactionRowValues) =>
  row.kind === 'standard'
    ? row.standardValues.date
    : row.kind === 'transfer'
      ? row.transferValues.date
      : row.exchangeValues.date;

const cloneBulkTransactionRowValues = (
  row: BulkTransactionRowValues,
): BulkTransactionRowValues => ({
  kind: row.kind,
  standardValues: { ...row.standardValues },
  transferValues: { ...row.transferValues },
  exchangeValues: { ...row.exchangeValues },
});

const BulkTransactionKindField = ({
  index,
  kind,
  showLabel,
  triggerRef,
  setKind,
}: {
  index: number;
  kind: BulkTransactionKindValue;
  showLabel: boolean;
  triggerRef: Ref<HTMLButtonElement>;
  setKind: (kind: BulkTransactionKind) => void;
}) => {
  const { t } = useTranslation('transactions');

  return (
    <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_KIND_FIELD_CLASS_NAME}`}>
      <span className={getBulkLabelClassName(showLabel, true)}>
        {t('transactionKind')}
      </span>
        <Select
          value={kind}
          onValueChange={(value) => setKind(value as BulkTransactionKind)}
        >
          <SelectTrigger
            aria-label={t('transactionKind')}
            className={COMPACT_FIELD_CLASS_NAME}
            ref={triggerRef}
          >
            <SelectValue />
          </SelectTrigger>
        <SelectContent position="popper">
          {bulkTransactionKinds.map((transactionKind) => (
            <SelectItem key={`${index}-${transactionKind}`} value={transactionKind}>
              {t(getBulkKindTranslationKey(transactionKind))}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  );
};

const StandardRowFields = ({
  form,
  index,
  showLabels,
}: {
  form: ReturnType<typeof useForm<BulkTransactionFormValues>>;
  index: number;
  showLabels: boolean;
}) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.standardValues;
  const selectedTransactionType = useWatch({
    control: form.control,
    name: `rows.${index}.standardValues.transactionType`,
  });

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('date')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.date`}
          render={({ field }) => <DateInput {...field} className={COMPACT_FIELD_CLASS_NAME} />}
        />
        <FieldError message={errors?.date?.message && t(errors.date.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('transactionType')}
        </span>
        <Select
          value={selectedTransactionType}
          onValueChange={(value) =>
            form.setValue(
              `rows.${index}.standardValues.transactionType`,
              value as StandardTransactionFormValues['transactionType'],
              { shouldDirty: true, shouldValidate: form.formState.isSubmitted },
            )
          }
        >
          <SelectTrigger
            aria-label={t('transactionType')}
            className={clsx(
              COMPACT_FIELD_CLASS_NAME,
              getTransactionTypeSelectValueClassName(selectedTransactionType)
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {standardTransactionTypeOptions.map((transactionType) => (
              <SelectItem
                key={`${index}-${transactionType}`}
                value={transactionType}
                className={getTransactionTypeSelectItemClassName(transactionType)}
              >
                {t(transactionType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('description')}
        </span>
        <Input
          {...form.register(`rows.${index}.standardValues.description`)}
          className={COMPACT_FIELD_CLASS_NAME}
        />
        <FieldError
          message={errors?.description?.message && t(errors.description.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('amount')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.amount`}
          render={({ field }) => (
            <NumberInput
              value={field.value}
              onValueChange={field.onChange}
              decimalPlaces={2}
              step="0.01"
              min="0"
              className={COMPACT_FIELD_CLASS_NAME}
            />
          )}
        />
        <FieldError message={errors?.amount?.message && t(errors.amount.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('currency')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.currency`}
          render={({ field }) => (
            <CurrencySelectField
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              searchPlaceholder=""
              emptyMessage={t('noCurrenciesFound')}
            />
          )}
        />
        <FieldError message={errors?.currency?.message && t(errors.currency.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('category')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.categoryId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="categories"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              includeSystem
              excludedSystemNames={[TRANSFER_CATEGORY, EXCHANGE_CATEGORY]}
            />
          )}
        />
        <FieldError
          message={errors?.categoryId?.message && t(errors.categoryId.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('paymentMethod')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.paymentMethodId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="paymentMethods"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.paymentMethodId?.message && t(errors.paymentMethodId.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('account')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.accountId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError message={errors?.accountId?.message && t(errors.accountId.message)} />
      </Label>
    </div>
  );
};

const TransferRowFields = ({
  form,
  index,
  showLabels,
}: {
  form: ReturnType<typeof useForm<BulkTransactionFormValues>>;
  index: number;
  showLabels: boolean;
}) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.transferValues;

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('date')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.date`}
          render={({ field }) => <DateInput {...field} className={COMPACT_FIELD_CLASS_NAME} />}
        />
        <FieldError message={errors?.date?.message && t(errors.date.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('description')}
        </span>
        <Input
          {...form.register(`rows.${index}.transferValues.description`)}
          className={COMPACT_FIELD_CLASS_NAME}
        />
        <FieldError
          message={errors?.description?.message && t(errors.description.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('amount')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.amount`}
          render={({ field }) => (
            <NumberInput
              value={field.value}
              onValueChange={field.onChange}
              decimalPlaces={2}
              step="0.01"
              min="0"
              className={COMPACT_FIELD_CLASS_NAME}
            />
          )}
        />
        <FieldError message={errors?.amount?.message && t(errors.amount.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('currency')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.currency`}
          render={({ field }) => (
            <CurrencySelectField
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              searchPlaceholder=""
              emptyMessage={t('noCurrenciesFound')}
            />
          )}
        />
        <FieldError message={errors?.currency?.message && t(errors.currency.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('paymentMethod')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.paymentMethodId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="paymentMethods"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.paymentMethodId?.message && t(errors.paymentMethodId.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('fromAccount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.accountExpenseId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.accountExpenseId?.message && t(errors.accountExpenseId.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('toAccount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.accountIncomeId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.accountIncomeId?.message && t(errors.accountIncomeId.message)
          }
        />
      </Label>
    </div>
  );
};

const ExchangeRowFields = ({
  form,
  index,
  showLabels,
}: {
  form: ReturnType<typeof useForm<BulkTransactionFormValues>>;
  index: number;
  showLabels: boolean;
}) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.exchangeValues;

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('date')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.date`}
          render={({ field }) => <DateInput {...field} className={COMPACT_FIELD_CLASS_NAME} />}
        />
        <FieldError message={errors?.date?.message && t(errors.date.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('description')}
        </span>
        <Input
          {...form.register(`rows.${index}.exchangeValues.description`)}
          className={COMPACT_FIELD_CLASS_NAME}
        />
        <FieldError
          message={errors?.description?.message && t(errors.description.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('amountExpense')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.amountExpense`}
          render={({ field }) => (
            <NumberInput
              value={field.value}
              onValueChange={field.onChange}
              decimalPlaces={2}
              step="0.01"
              min="0"
              className={COMPACT_FIELD_CLASS_NAME}
            />
          )}
        />
        <FieldError
          message={errors?.amountExpense?.message && t(errors.amountExpense.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('expenseCurrency')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.currencyExpense`}
          render={({ field }) => (
            <CurrencySelectField
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              searchPlaceholder=""
              emptyMessage={t('noCurrenciesFound')}
            />
          )}
        />
        <FieldError
          message={
            errors?.currencyExpense?.message && t(errors.currencyExpense.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('amountIncome')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.amountIncome`}
          render={({ field }) => (
            <NumberInput
              value={field.value}
              onValueChange={field.onChange}
              decimalPlaces={2}
              step="0.01"
              min="0"
              className={COMPACT_FIELD_CLASS_NAME}
            />
          )}
        />
        <FieldError
          message={errors?.amountIncome?.message && t(errors.amountIncome.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('incomeCurrency')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.currencyIncome`}
          render={({ field }) => (
            <CurrencySelectField
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              searchPlaceholder=""
              emptyMessage={t('noCurrenciesFound')}
            />
          )}
        />
        <FieldError
          message={
            errors?.currencyIncome?.message && t(errors.currencyIncome.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('paymentMethod')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.paymentMethodId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="paymentMethods"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.paymentMethodId?.message && t(errors.paymentMethodId.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('fromAccount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.accountExpenseId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.accountExpenseId?.message && t(errors.accountExpenseId.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('toAccount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.accountIncomeId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.accountIncomeId?.message && t(errors.accountIncomeId.message)
          }
        />
      </Label>
    </div>
  );
};

export const CreateBulkTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);
  const [isPending, setIsPending] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

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

  const registerKindSelectTrigger = (index: number) => (node: HTMLButtonElement | null) => {
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
    const lastRow = currentRows[currentRows.length - 1] ?? getDefaultBulkTransactionRowValues();
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

          return {
            kind: 'exchange' as const,
            ...normalizeExchangeTransactionFormValues(row.exchangeValues),
            amountExpense: Number(row.exchangeValues.amountExpense),
            amountIncome: Number(row.exchangeValues.amountIncome),
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
        message: apiError.message || t('bulkTransactionCreatePartiallyFailedMessage', {
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
                      <StandardRowFields form={form} index={index} showLabels={showLabels} />
                    ) : null}
                    {row.kind === 'transfer' ? (
                      <TransferRowFields form={form} index={index} showLabels={showLabels} />
                    ) : null}
                    {row.kind === 'exchange' ? (
                      <ExchangeRowFields form={form} index={index} showLabels={showLabels} />
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
            variant="outline"
            className={FORM_BUTTON_CLASS_NAME}
            onClick={() => appendRow()}
          >
            {t('addTransactionRow')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={FORM_BUTTON_CLASS_NAME}
            onClick={duplicateLastRow}
          >
            {t('duplicateLastRow')}
          </Button>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
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
    </Card>
  );
};
