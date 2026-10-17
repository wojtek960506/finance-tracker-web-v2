import { useCallback, useState } from 'react';

import type { SportSpendingTarget } from '../api/types';

export const useSportSpendingModalState = () => {
  const [linkingTargets, setLinkingTargets] = useState<SportSpendingTarget[]>([]);
  const [unlinkingTarget, setUnlinkingTarget] = useState<SportSpendingTarget | null>(
    null,
  );

  const openLink = useCallback((target: SportSpendingTarget | SportSpendingTarget[]) => {
    setLinkingTargets(Array.isArray(target) ? target : [target]);
  }, []);

  const closeLink = useCallback(() => {
    setLinkingTargets([]);
  }, []);

  const openUnlink = useCallback((target: SportSpendingTarget) => {
    setUnlinkingTarget(target);
  }, []);

  const closeUnlink = useCallback(() => {
    setUnlinkingTarget(null);
  }, []);

  return {
    linkingTargets,
    unlinkingTarget,
    isLinkOpen: linkingTargets.length > 0,
    isUnlinkOpen: Boolean(unlinkingTarget),
    openLink,
    closeLink,
    openUnlink,
    closeUnlink,
  };
};

export type UseSportSpendingModalStateReturn = ReturnType<
  typeof useSportSpendingModalState
>;
