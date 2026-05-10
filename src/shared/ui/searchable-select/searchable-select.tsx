import clsx from 'clsx';
import { Check, ChevronDown, Search } from 'lucide-react';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useScrollFocusedInputIntoView } from '@shared/hooks';
import { Button, Card } from '@ui';

export type SearchableSelectOption = {
  value: string;
  label: string;
  searchText?: string;
  hint?: string;
  disabled?: boolean;
  icon?: ReactNode;
};

export type SearchableSelectGroup = {
  key: string;
  label?: string;
  options: SearchableSelectOption[];
};

type SearchableSelectProps = {
  value: string;
  groups: SearchableSelectGroup[];
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  footer?: ReactNode;
  selectedOption?: SearchableSelectOption;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  popupDensity?: 'default' | 'compact';
  popupMaxHeight?: number;
};

const normalizeSearchValue = (value: string) => value.trim().toLocaleLowerCase();
const VIEWPORT_MARGIN = 16;
const POPUP_OFFSET_BELOW = 8;
const POPUP_OFFSET_ABOVE = 4;
const MIN_LISTBOX_HEIGHT = 160;

type PopupPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

// TODO split this file to some smaller ones
export const SearchableSelect = ({
  value,
  groups,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  footer,
  selectedOption: providedSelectedOption,
  isOpen: controlledIsOpen,
  onOpenChange,
  popupDensity = 'default',
  popupMaxHeight,
}: SearchableSelectProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const scrollFocusedInputIntoView = useScrollFocusedInputIntoView();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  const setOpen = useCallback(
    (nextIsOpen: boolean) => {
      if (controlledIsOpen === undefined) setUncontrolledIsOpen(nextIsOpen);
      onOpenChange?.(nextIsOpen);
    },
    [controlledIsOpen, onOpenChange],
  );

  const selectedOption = useMemo(
    () =>
      providedSelectedOption ??
      groups.flatMap((group) => group.options).find((option) => option.value === value),
    [groups, providedSelectedOption, value],
  );

  const filteredGroups = useMemo(() => {
    const normalizedSearchValue = normalizeSearchValue(searchValue);

    if (normalizedSearchValue === '') return groups;

    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) =>
          normalizeSearchValue(
            `${option.label} ${option.searchText ?? ''} ${option.hint ?? ''}`,
          ).includes(normalizedSearchValue),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [groups, searchValue]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
  }, [isOpen]);

  const updatePopupPosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const preferredWidth = Math.max(triggerRect.width, MIN_LISTBOX_HEIGHT);
    const width = Math.min(preferredWidth, window.innerWidth - VIEWPORT_MARGIN * 2);
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(triggerRect.left, window.innerWidth - VIEWPORT_MARGIN - width),
    );
    const availableBelow =
      window.innerHeight - triggerRect.bottom - POPUP_OFFSET_BELOW - VIEWPORT_MARGIN;
    const availableAbove = triggerRect.top - POPUP_OFFSET_ABOVE - VIEWPORT_MARGIN;
    // Open upward when there is not enough useful space below the trigger.
    const shouldOpenAbove =
      availableBelow < Math.min(popupRect.height, MIN_LISTBOX_HEIGHT) &&
      availableAbove > availableBelow;
    // Keep the popup inside the visible viewport, with an optional per-usage height cap.
    const viewportMaxHeight = Math.max(
      120,
      shouldOpenAbove ? availableAbove : availableBelow,
    );
    const maxHeight = popupMaxHeight
      ? Math.min(viewportMaxHeight, popupMaxHeight)
      : viewportMaxHeight;
    const top = shouldOpenAbove
      ? Math.max(
          VIEWPORT_MARGIN,
          triggerRect.top - POPUP_OFFSET_ABOVE - Math.min(popupRect.height, maxHeight),
        )
      : Math.max(VIEWPORT_MARGIN, triggerRect.bottom + POPUP_OFFSET_BELOW);

    setPopupPosition({ top, left, width, maxHeight });
  }, [popupMaxHeight]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    // Recalculate after mount and on viewport movement because the popup is portaled and fixed.
    updatePopupPosition();

    const handleViewportChange = () => {
      updatePopupPosition();
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { capture: true });

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, { capture: true });
    };
  }, [filteredGroups, isOpen, searchValue, updatePopupPosition]);

  const handleTriggerClick = () => {
    const nextIsOpen = !isOpen;
    setOpen(nextIsOpen);
    if (!nextIsOpen) {
      setSearchValue('');
      setPopupPosition(null);
    }
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    setOpen(true);
  };

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearchValue('');
    setPopupPosition(null);
  }, [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (triggerRef.current?.contains(target) || popupRef.current?.contains(target)) return;

      closeDropdown();
    };

    // Close without a fullscreen overlay so the surrounding page can still scroll naturally.
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [isOpen, closeDropdown]);

  return (
    <div className="relative min-w-0">
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className={clsx(
          'w-full justify-between gap-3 rounded-xl border border-fg bg-bg px-3 py-2 text-left',
          !selectedOption && 'text-text-muted',
        )}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <span className="shrink-0 text-text-muted">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          className={clsx('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
        />
      </Button>

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={popupRef}
              style={{
                top: popupPosition?.top ?? 0,
                left: popupPosition?.left ?? 0,
                width: popupPosition?.width ?? 0,
                visibility: popupPosition ? 'visible' : 'hidden',
              }}
              className="fixed z-[420]"
            >
              {/* Render in a portal so the popup is not clipped by local scroll containers. */}
              <Card
                style={{ maxHeight: popupPosition?.maxHeight }}
                className={clsx(
                  'flex overflow-hidden rounded-2xl border border-fg bg-modal-bg',
                  popupDensity === 'compact' ? 'gap-2 p-2' : 'gap-2 p-3 sm:gap-3',
                )}
              >
                <div
                  className={clsx(
                    'flex items-center gap-2 rounded-lg bg-bg focus-within:ring-2',
                    'focus-within:ring-blue-300',
                    popupDensity === 'compact' ? 'px-2.5' : 'px-3',
                  )}
                >
                  <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onFocus={(event) => {
                      scrollFocusedInputIntoView(event.currentTarget);
                    }}
                    placeholder={searchPlaceholder}
                    className={clsx(
                      'text-fg w-full min-w-0 appearance-none border-0 bg-transparent px-0',
                      'outline-none shadow-none',
                      popupDensity === 'compact' ? 'py-1.5 text-sm' : 'py-2',
                    )}
                  />
                  <Search
                    aria-hidden="true"
                    className={clsx(
                      'pointer-events-none shrink-0 text-text-muted',
                      popupDensity === 'compact' ? 'size-3.5' : 'size-4',
                    )}
                  />
                </div>

                <div
                  id={listboxId}
                  role="listbox"
                  className={clsx(
                    'flex min-h-0 flex-1 flex-col overflow-y-auto',
                    popupDensity === 'compact' ? 'gap-2' : 'gap-3',
                  )}
                >
                  {filteredGroups.length === 0 && (
                    <p className="px-1 py-2 text-sm text-text-muted">{emptyMessage}</p>
                  )}

                  {filteredGroups.map((group) => (
                    <div key={group.key} className="flex flex-col gap-0">
                      {group.label && (
                        <p className="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                          {group.label}
                        </p>
                      )}

                      {group.options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                          <Button
                            key={option.value}
                            type="button"
                            role="option"
                            variant="ghost"
                            aria-selected={isSelected}
                            disabled={option.disabled}
                            className={clsx(
                              'justify-between rounded-xl text-left',
                              popupDensity === 'compact'
                                ? 'px-2.5 py-1.5 text-sm'
                                : 'px-3 py-2',
                              isSelected && 'bg-bt-primary text-white hover:bg-bt-primary',
                            )}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              onChange(option.value);
                              closeDropdown();
                            }}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              {option.icon && (
                                <span
                                  className={clsx(
                                    'shrink-0',
                                    isSelected ? 'text-white' : 'text-text-muted',
                                  )}
                                >
                                  {option.icon}
                                </span>
                              )}

                              <span className="flex min-w-0 flex-col">
                                <span className="truncate">{option.label}</span>
                                {option.hint && (
                                  <span
                                    className={clsx(
                                      'truncate text-xs',
                                      isSelected ? 'text-white/80' : 'text-text-muted',
                                    )}
                                  >
                                    {option.hint}
                                  </span>
                                )}
                              </span>
                            </span>

                            {isSelected && (
                              <Check className="size-4 shrink-0" aria-hidden="true" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {footer}
              </Card>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
