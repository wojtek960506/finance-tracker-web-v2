export interface ItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
  mode?: 'buttons' | 'dropdown';
  className?: string;
  editTestId?: string;
  deleteTestId?: string;
  linkTestId?: string;
  unlinkTestId?: string;
  menuAriaLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  linkLabel?: string;
  unlinkLabel?: string;
}
