export interface FormActionsProps {
  isPending?: boolean;
  onCancel: () => void;
  submitLabel: string;
  submittingLabel?: string;
  cancelLabel?: string;
  submitTestId?: string;
  cancelTestId?: string;
  className?: string;
}
