import { useEffect, useRef } from 'react';

export const useBulkRowFocus = (fieldsLength: number) => {
  const kindSelectTriggerRefs = useRef(new Map<number, HTMLButtonElement>());
  const pendingKindFocusRowIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingKindFocusRowIndexRef.current === null) return;

    const targetIndex = pendingKindFocusRowIndexRef.current;
    pendingKindFocusRowIndexRef.current = null;

    const trigger = kindSelectTriggerRefs.current.get(targetIndex);
    if (!trigger) return;

    trigger.focus();
  }, [fieldsLength]);

  const registerKindSelectTrigger =
    (index: number) => (node: HTMLButtonElement | null) => {
      if (node) {
        kindSelectTriggerRefs.current.set(index, node);
        return;
      }

      kindSelectTriggerRefs.current.delete(index);
    };

  const setPendingKindFocusRowIndex = (index: number | null) => {
    pendingKindFocusRowIndexRef.current = index;
  };

  return {
    registerKindSelectTrigger,
    setPendingKindFocusRowIndex,
  };
};
