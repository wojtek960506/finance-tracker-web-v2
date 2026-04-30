import 'react-day-picker/style.css';

import clsx from 'clsx';
import { CalendarDays } from 'lucide-react';
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { DayPicker } from 'react-day-picker';
import { createPortal } from 'react-dom';

import { useLanguage } from '@shared/hooks';
import { Card, getButtonClassName } from '@ui';

import {
  DAY_PICKER_CLASS_NAMES,
  END_MONTH,
  LANGUAGE_TO_DAY_PICKER_LOCALE,
  LANGUAGE_TO_LOCALE,
  START_MONTH,
} from './consts';
import { DayPickerDropdown } from './date-picker-dropdown';
import { useDateInputPopup } from './use-date-input-popup';
import { formatDateValue, parseDateValue, toInputDateValue } from './utils';

type DateInputProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'role' | 'value' | 'onChange'
> & {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
  ({ className, value, onChange, onBlur, disabled, ...props }, ref) => {
    const { language } = useLanguage();
    const selectedDate = useMemo(() => parseDateValue(value), [value]);
    const [month, setMonth] = useState<Date>(selectedDate ?? new Date());
    const resetMonthOnOpen = useCallback(() => {
      if (selectedDate) setMonth(selectedDate);
    }, [selectedDate]);
    const { closePicker, isOpen, popupPosition, popupRef, togglePicker, triggerRef } =
      useDateInputPopup({ disabled, onOpen: resetMonthOnOpen });

    const locale = LANGUAGE_TO_LOCALE[language];
    const dayPickerLocale = LANGUAGE_TO_DAY_PICKER_LOCALE[language];
    const formattedValue = formatDateValue(selectedDate, locale);

    const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      togglePicker();
    };

    return (
      <div className="relative">
        <div
          {...props}
          ref={(node) => {
            triggerRef.current = node;

            if (typeof ref === 'function') {
              ref(node);
              return;
            }

            if (ref) {
              ref.current = node;
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={clsx(
            getButtonClassName({
              variant: 'outline',
              className:
                'w-full justify-between gap-3 border border-fg bg-bg text-left text-fg',
            }),
            !formattedValue && 'text-text-muted',
            disabled && 'pointer-events-none',
            className,
          )}
          onClick={togglePicker}
          onKeyDown={handleTriggerKeyDown}
          onBlur={onBlur}
        >
          <span className="truncate">{formattedValue || value || '\u00A0'}</span>
          <CalendarDays className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
        </div>

        {isOpen && typeof document !== 'undefined'
          ? createPortal(
              <>
                <div
                  aria-hidden="true"
                  className="fixed inset-0 z-[410] cursor-default bg-transparent"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    closePicker();
                  }}
                />

                <div
                  ref={popupRef}
                  style={{
                    top: popupPosition?.top ?? 0,
                    left: popupPosition?.left ?? 0,
                    visibility: popupPosition ? 'visible' : 'hidden',
                    width: 'fit-content',
                  }}
                  className="fixed z-[420] max-w-screen sm:max-w-[calc(100vw-2rem)]"
                >
                  <Card className="w-max min-w-max max-w-full select-none gap-3 overflow-x-auto rounded-2xl border border-fg bg-modal-bg p-3">
                    <DayPicker
                      mode="single"
                      required
                      classNames={DAY_PICKER_CLASS_NAMES}
                      components={{ Dropdown: DayPickerDropdown }}
                      month={month}
                      onMonthChange={setMonth}
                      selected={selectedDate}
                      locale={dayPickerLocale}
                      weekStartsOn={1}
                      captionLayout="dropdown"
                      navLayout="around"
                      startMonth={START_MONTH}
                      endMonth={END_MONTH}
                      onSelect={(date) => {
                        const nextValue = toInputDateValue(date);
                        onChange?.(nextValue);
                        closePicker();
                      }}
                    />
                  </Card>
                </div>
              </>,
              document.body,
            )
          : null}
      </div>
    );
  },
);
