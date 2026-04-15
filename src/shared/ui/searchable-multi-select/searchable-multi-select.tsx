import clsx from 'clsx';
import { Check, ChevronDown, Search, X } from 'lucide-react';
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

import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import type { SearchableSelectGroup } from '@shared/ui/searchable-select';

type SearchableMultiSelectProps = {
  values: string[];
  groups: SearchableSelectGroup[];
  onChange: (values: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  footer?: ReactNode;
};

const normalizeSearchValue = (value: string) => value.trim().toLocaleLowerCase();

export const SearchableMultiSelect = ({
  values,
  groups,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  footer,
}: SearchableMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreNextTriggerClickRef = useRef(false);
  const listboxId = useId();

  const selectedOptions = useMemo(
    () =>
      groups
        .flatMap((group) => group.options)
        .filter((option) => values.includes(option.value)),
    [groups, values],
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

  const closeDropdown = useCallback((ignoreNextTriggerClick = false) => {
    ignoreNextTriggerClickRef.current = ignoreNextTriggerClick;
    setIsOpen(false);
    setSearchValue('');
  }, []);

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
  }, [closeDropdown, isOpen]);

  const handleTriggerClick = () => {
    if (ignoreNextTriggerClickRef.current) {
      ignoreNextTriggerClickRef.current = false;
      return;
    }

    setIsOpen((prev) => !prev);
    if (isOpen) setSearchValue('');
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    setIsOpen(true);
  };

  const toggleValue = (nextValue: string) => {
    const nextValues = values.includes(nextValue)
      ? values.filter((value) => value !== nextValue)
      : [...values, nextValue];

    onChange(nextValues);
  };

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
          selectedOptions.length === 0 && 'text-text-muted',
        )}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="min-w-0 truncate">
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => option.label).join(', ')
            : placeholder}
        </span>
        <ChevronDown
          className={clsx('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
        />
      </Button>

      {selectedOptions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-fg/20 bg-bg px-2 py-1 text-xs font-medium text-fg transition hover:border-fg/40"
              onClick={() => toggleValue(option.value)}
            >
              <span className="truncate">{option.label}</span>
              <X className="size-3" aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}

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
              aria-multiselectable="true"
              className="flex max-h-80 flex-col gap-3 overflow-y-auto"
            >
              {filteredGroups.length === 0 ? (
                <p className="px-1 py-2 text-sm text-text-muted">{emptyMessage}</p>
              ) : null}

              {filteredGroups.map((group) => (
                <div key={group.key} className="flex flex-col gap-0">
                  {group.label ? (
                    <p className="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                      {group.label}
                    </p>
                  ) : null}

                  {group.options.map((option) => {
                    const isSelected = values.includes(option.value);

                    return (
                      <Button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={option.disabled}
                        variant="ghost"
                        className={clsx(
                          'justify-between rounded-xl px-3 py-2 text-left',
                          isSelected && 'bg-bt-primary text-white hover:bg-bt-primary',
                        )}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleValue(option.value);
                        }}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          {option.icon ? (
                            <span
                              className={clsx(
                                'shrink-0',
                                isSelected ? 'text-white' : 'text-text-muted',
                              )}
                            >
                              {option.icon}
                            </span>
                          ) : null}
                          <span className="truncate">{option.label}</span>
                        </span>
                        {isSelected ? <Check className="size-4 shrink-0" /> : null}
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
