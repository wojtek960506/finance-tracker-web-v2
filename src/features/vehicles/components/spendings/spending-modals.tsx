import { LinkSpendingModal } from './link-spending-modal';
import type { SpendingTarget } from './types';
import { UnlinkSpendingModal } from './unlink-spending-modal';

export type SpendingModalsProps = {
  linkingTarget: SpendingTarget | null;
  unlinkingTarget: SpendingTarget | null;
  onCloseLink: () => void;
  onCloseUnlink: () => void;
  onRefresh?: () => void;
};

export const SpendingModals = ({
  linkingTarget,
  unlinkingTarget,
  onCloseLink,
  onCloseUnlink,
  onRefresh,
}: SpendingModalsProps) => {
  return (
    <>
      <LinkSpendingModal
        isOpen={Boolean(linkingTarget)}
        target={linkingTarget}
        onClose={onCloseLink}
        onSuccess={onRefresh}
      />

      <UnlinkSpendingModal
        isOpen={Boolean(unlinkingTarget)}
        target={unlinkingTarget}
        onClose={onCloseUnlink}
        onSuccess={onRefresh}
      />
    </>
  );
};
