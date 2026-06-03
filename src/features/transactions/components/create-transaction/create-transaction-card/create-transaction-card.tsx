import type { TransactionCardType } from '../create-transaction';

import { CreateTransactionCardButton } from './create-transaction-card-button';

import { Card } from '@/shared/ui';

type CreateTransactionCardProps = {
  cardTypes: TransactionCardType[];
  title: string;
  description?: string;
};

export const CreateTransactionCard = ({
  cardTypes,
  title,
  description,
}: CreateTransactionCardProps) => {
  return (
    <Card className="gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        {description && (
          <p className="text-sm text-text-muted sm:text-base">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {cardTypes.map((cardType) => (
          <CreateTransactionCardButton cardType={cardType} />
        ))}
      </div>
    </Card>
  );
};
