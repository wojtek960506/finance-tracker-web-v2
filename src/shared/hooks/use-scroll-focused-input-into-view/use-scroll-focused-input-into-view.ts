import { useCallback } from 'react';


// TODO I am not sure whether it works or not on mobile. I have to inspect it later
const KEYBOARD_OPEN_THRESHOLD = 120;
const SCROLL_FALLBACK_DELAY_MS = 350;
const TOP_PADDING = 16;
const BOTTOM_PADDING = 24;
const MIN_SCROLL_DELTA = 8;

const isMobileKeyboardContext = () =>
  typeof window !== 'undefined' &&
  typeof window.visualViewport !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

const getScrollContainer = (element: HTMLElement) => {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      parent.scrollHeight > parent.clientHeight;

    if (isScrollable) return parent;

    parent = parent.parentElement;
  }

  return null;
};

const scrollElementIntoView = (element: HTMLElement) => {
  const viewport = window.visualViewport;

  if (!viewport) return;

  const rect = element.getBoundingClientRect();
  const targetTop = viewport.offsetTop + TOP_PADDING;
  const visibleBottom = viewport.offsetTop + viewport.height - BOTTOM_PADDING;
  const preferredDelta = rect.top - targetTop;
  const hiddenBelowDelta = rect.bottom - visibleBottom;
  const nextScrollTop =
    hiddenBelowDelta > 0 ? Math.max(preferredDelta, hiddenBelowDelta) : preferredDelta;

  if (Math.abs(nextScrollTop) < MIN_SCROLL_DELTA) return;

  const scrollContainer = getScrollContainer(element);

  if (scrollContainer) {
    scrollContainer.scrollBy({
      top: nextScrollTop,
      behavior: 'smooth',
    });
    return;
  }

  window.scrollBy({
    top: nextScrollTop,
    behavior: 'smooth',
  });
};

export const useScrollFocusedInputIntoView = () =>
  useCallback((element: HTMLElement) => {
    if (!isMobileKeyboardContext()) return;

    const viewport = window.visualViewport;

    if (!viewport) return;

    const initialViewportHeight = viewport.height;
    let timeoutId: number | null = null;

    const cleanup = () => {
      viewport.removeEventListener('resize', handleResize);
      element.removeEventListener('blur', cleanup);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };

    const scrollWhenReady = () => {
      requestAnimationFrame(() => {
        scrollElementIntoView(element);
      });
    };

    const handleResize = () => {
      if (initialViewportHeight - viewport.height < KEYBOARD_OPEN_THRESHOLD) return;

      cleanup();
      scrollWhenReady();
    };

    viewport.addEventListener('resize', handleResize);
    element.addEventListener('blur', cleanup, { once: true });
    timeoutId = window.setTimeout(() => {
      cleanup();
      scrollWhenReady();
    }, SCROLL_FALLBACK_DELAY_MS);
  }, []);
