import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';

import {
  type InvestmentOperationKind,
  investmentTransactionFormSchema,
  type InvestmentTransactionFormValues,
} from '../utils';

type UseInvestmentTransactionFormParams = {
  defaultValues: InvestmentTransactionFormValues;
  onSubmit: (values: InvestmentTransactionFormValues) => Promise<void> | void;
};

export const useInvestmentTransactionForm = ({
  defaultValues,
  onSubmit,
}: UseInvestmentTransactionFormParams) => {
  const [isCreateInstrumentModalOpen, setIsCreateInstrumentModalOpen] = useState(false);

  const form = useForm<InvestmentTransactionFormValues>({
    resolver: zodResolver(investmentTransactionFormSchema),
    defaultValues,
  });

  const selectedOperationKind = useWatch({
    control: form.control,
    name: 'operationKind',
  });

  const [paymentMethodId, accountId] = useWatch({
    control: form.control,
    name: ['paymentMethodId', 'accountId'],
  });

  const shouldOpenAdvancedFields = Boolean(paymentMethodId || accountId);

  const handleSelectOperationKind = (kind: InvestmentOperationKind) => {
    form.setValue('operationKind', kind);
  };

  const handleInstrumentCreated = (instrumentId: string) => {
    form.setValue('instrumentId', instrumentId, { shouldValidate: true });
  };

  const handleSubmit: SubmitHandler<InvestmentTransactionFormValues> = async (values) => {
    await onSubmit(values);
  };

  return {
    form,
    selectedOperationKind,
    shouldOpenAdvancedFields,
    isCreateInstrumentModalOpen,
    setIsCreateInstrumentModalOpen,
    handleSelectOperationKind,
    handleInstrumentCreated,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
