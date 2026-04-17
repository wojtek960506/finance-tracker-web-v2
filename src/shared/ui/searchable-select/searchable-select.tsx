import clsx from 'clsx';
import { Check, ChevronDown, Search } from 'lucide-react';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

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
};

const normalizeSearchValue = (value: string) => value.trim().toLocaleLowerCase();

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
}: SearchableSelectProps) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreNextTriggerClickRef = useRef(false);
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

  const handleTriggerClick = () => {
    if (ignoreNextTriggerClickRef.current) {
      ignoreNextTriggerClickRef.current = false;
      return;
    }

    const nextIsOpen = !isOpen;
    setOpen(nextIsOpen);
    if (!nextIsOpen) setSearchValue('');
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    setOpen(true);
  };

  const closeDropdown = useCallback(
    (ignoreNextTriggerClick = false) => {
      ignoreNextTriggerClickRef.current = ignoreNextTriggerClick;
      setOpen(false);
      setSearchValue('');
    },
    [setOpen],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      closeDropdown();
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeDropdown]);

  return (
    <div className="relative min-w-0">
      <Button
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

      {isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-140 cursor-default bg-transparent"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeDropdown(true);
            }}
          />

          <Card
            className={clsx(
              'absolute z-150 mt-2 w-full gap-2 rounded-2xl border border-fg bg-modal-bg p-3',
              'sm:gap-3',
            )}
          >
            <div
              className={clsx(
                'flex items-center gap-2 rounded-lg bg-bg px-3 focus-within:ring-2',
                'focus-within:ring-blue-300',
              )}
            >
              <input
                ref={inputRef}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={searchPlaceholder}
                className={clsx(
                  'text-fg w-full min-w-0 appearance-none border-0 bg-transparent px-0',
                  'py-2 outline-none shadow-none',
                )}
              />
              <Search
                aria-hidden="true"
                className="pointer-events-none size-4 shrink-0 text-text-muted"
              />
            </div>

            <div
              id={listboxId}
              role="listbox"
              className="flex max-h-80 flex-col gap-3 overflow-y-auto"
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
                          'justify-between rounded-xl px-3 py-2 text-left',
                          isSelected && 'bg-bt-primary text-white hover:bg-bt-primary',
                        )}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onChange(option.value);
                          closeDropdown(true);
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
        </>
      )}
    </div>
  );
};
