import { LinkSportSpendingModal } from './link-sport-spending-modal';
import type { SportSpendingModalsProps } from './types';
import { UnlinkSportSpendingModal } from './unlink-sport-spending-modal';

export const SportSpendingModals = ({
  linkingTargets,
  unlinkingTarget,
  onCloseLink,
  onCloseUnlink,
  onSuccessLink,
  onSuccessUnlink,
}: SportSpendingModalsProps) => {
  return (
    <>
      <LinkSportSpendingModal
        isOpen={linkingTargets.length > 0}
        targets={linkingTargets}
        onClose={onCloseLink}
        onSuccess={onSuccessLink}
      />
      <UnlinkSportSpendingModal
        isOpen={Boolean(unlinkingTarget)}
        target={unlinkingTarget}
        onClose={onCloseUnlink}
        onSuccess={onSuccessUnlink}
      />
    </>
  );
};
