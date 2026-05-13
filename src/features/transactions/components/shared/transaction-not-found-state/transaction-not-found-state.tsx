import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@ui';

type TransactionFallbackStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  to: string;
};

export const TransactionFallbackState = ({
  title,
  description,
  actionLabel,
  to,
}: TransactionFallbackStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="m-auto flex max-w-100 flex-col gap-2 sm:gap-3">
      <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          <p className="text-sm text-text-muted sm:text-base">{description}</p>
        </div>
        <Button variant="primary" onClick={() => navigate(to)}>
          {actionLabel}
        </Button>
      </Card>
    </div>
  );
};
