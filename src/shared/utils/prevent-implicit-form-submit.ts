import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export const preventImplicitFormSubmit = (event: ReactKeyboardEvent<HTMLFormElement>) => {
  if (
    event.key !== 'Enter' ||
    event.shiftKey ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.nativeEvent.isComposing
  ) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.closest('button[type="submit"], input[type="submit"], textarea')) {
    return;
  }

  if (target.closest('button, [role="button"], a[href]')) {
    return;
  }

  event.preventDefault();
};
