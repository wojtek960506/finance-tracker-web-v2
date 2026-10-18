import { Modal } from '@shared/ui';

import type { SportActivityModalShellProps } from './types';

export const SportActivityModalShell = ({
  isOpen,
  onClose,
  title,
  description,
  testId = 'sport-activity-modal-shell',
  children,
}: SportActivityModalShellProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={title}>
      <div className="flex flex-col gap-3" data-testid={testId}>
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">{title}</h2>
          {description && (
            <p className="text-xs text-text-muted sm:text-sm">{description}</p>
          )}
        </div>
        {children}
      </div>
    </Modal>
  );
};
