const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const getFocusableElements = (container: HTMLElement | null) =>
  Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
