import { useCallback, useState } from 'react';

import type { SpendingTarget } from './types';

export const useSpendingModalState = () => {
  const [linkingTarget, setLinkingTarget] = useState<SpendingTarget | null>(null);
  const [unlinkingTarget, setUnlinkingTarget] = useState<SpendingTarget | null>(null);

  const openLink = useCallback((target: SpendingTarget) => {
    setLinkingTarget(target);
  }, []);

  const closeLink = useCallback(() => {
    setLinkingTarget(null);
  }, []);

  const openUnlink = useCallback((target: SpendingTarget) => {
    setUnlinkingTarget(target);
  }, []);

  const closeUnlink = useCallback(() => {
    setUnlinkingTarget(null);
  }, []);

  return {
    linkingTarget,
    unlinkingTarget,
    isLinkOpen: Boolean(linkingTarget),
    isUnlinkOpen: Boolean(unlinkingTarget),
    openLink,
    closeLink,
    openUnlink,
    closeUnlink,
  };
};

export type UseSpendingModalStateReturn = ReturnType<typeof useSpendingModalState>;
