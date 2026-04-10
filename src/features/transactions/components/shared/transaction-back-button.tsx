import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@ui';

type TransactionBackButtonProps = {
  label: string;
  to: string;
  disabled?: boolean;
};

export const TransactionBackButton = ({
  label,
  to,
  disabled = false,
}: TransactionBackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="w-fit gap-2 self-start px-1 py-1 text-sm sm:px-1 sm:py-1 sm:text-base"
      onClick={() => navigate(to)}
      disabled={disabled}
    >
      <ArrowLeft className="size-4 sm:size-5" aria-hidden="true" />
      {label}
    </Button>
  );
};
