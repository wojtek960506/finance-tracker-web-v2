import 'react-day-picker/style.css';

import clsx from 'clsx';
import { CalendarDays, ChevronDown } from 'lucide-react';
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type ClassNames, DayPicker, type DropdownProps } from 'react-day-picker';
import { de, enUS, pl, ru } from 'react-day-picker/locale';

import { useLanguage } from '@shared/hooks';
import type { Language } from '@shared/types';
import { Card, getButtonClassName } from '@ui';

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

const LANGUAGE_TO_LOCALE: Record<Language, string> = {
  en: 'en-GB',
  pl: 'pl-PL',
  de: 'de-DE',
  ru: 'ru-RU',
};

const LANGUAGE_TO_DAY_PICKER_LOCALE: Record<Language, typeof enUS> = {
  en: enUS,
  pl,
  de,
  ru,
};

const parseDateValue = (value?: string) => {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatDateValue = (date: Date | undefined, locale: string) => {
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
};

const toInputDateValue = (date: Date | undefined) => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const START_MONTH = new Date(2000, 0);
const END_MONTH = new Date(new Date().getFullYear() + 5, 11);

const DayPickerDropdown = ({
  className,
  disabled,
  options,
  value,
  classNames, // to avoid 'React does not recognize the `classNames` prop on a DOM element'
  ...props
}: DropdownProps) => {
  return (
    <span className={clsx('relative min-w-0', className)}>
      <select
        {...props}
        disabled={disabled}
        value={value}
        className="h-9 w-full appearance-none rounded-lg border border-fg bg-bg pl-3 pr-6 text-sm font-medium text-fg outline-none transition focus-visible:ring-2 focus-visible:ring-bt-secondary-ring"
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-text-muted "
        aria-hidden="true"
      />
    </span>
  );
};

const DAY_PICKER_CLASS_NAMES = {
  root: 'bt-date-picker',
  months: 'flex',
  month: 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3',
  month_caption: 'min-w-0',
  dropdowns: 'grid grid-cols-2 gap-2',
  dropdown_root: 'min-w-0',
  dropdown: 'min-w-0',
  caption_label: 'hidden',
  months_dropdown: 'min-w-0',
  years_dropdown: 'min-w-0',
  button_previous: getButtonClassName({
    variant: 'ghost',
    className:
      'size-9 rounded-lg border border-fg bg-bg p-0 text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
  }),
  button_next: getButtonClassName({
    variant: 'ghost',
    className:
      'size-9 rounded-lg border border-fg bg-bg p-0 text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
  }),
  chevron: 'size-4 fill-current text-text-muted',
  month_grid: 'col-span-3 w-full border-collapse',
  weekdays: 'border-b border-fg/10',
  weekday:
    'h-9 w-10 px-0 text-center align-middle text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-text-muted',
  week: 'mt-1',
  day: 'p-0 text-center align-middle',
  day_button:
    'flex size-10 items-center justify-center rounded-xl border border-transparent text-sm font-medium text-fg transition hover:bg-bt-secondary-subtle hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bt-secondary-ring',
  selected:
    '[&_button]:border-bt-primary-border [&_button]:bg-bt-primary [&_button]:text-bt-primary-subtle [&_button]:hover:bg-bt-primary-hover',
  today: '[&_button]:border-fg/35 [&_button]:font-semibold',
  outside: 'text-text-muted/55',
  disabled: 'opacity-40',
} satisfies Partial<ClassNames>;

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
  ({ className, value, onChange, onBlur, disabled, ...props }, ref) => {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const selectedDate = useMemo(() => parseDateValue(value), [value]);
    const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

    const locale = LANGUAGE_TO_LOCALE[language];
    const dayPickerLocale = LANGUAGE_TO_DAY_PICKER_LOCALE[language];
    const formattedValue = formatDateValue(selectedDate, locale);

    const closePicker = useCallback(() => {
      setIsOpen(false);
    }, []);

    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (event: globalThis.KeyboardEvent) => {
        if (event.key !== 'Escape') return;

        closePicker();
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [closePicker, isOpen]);

    const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      if (!isOpen && selectedDate) setMonth(selectedDate);
      setIsOpen((prev) => !prev);
    };

    return (
      <div className="relative">
        <div
          {...props}
          ref={ref}
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
          onClick={() => {
            if (disabled) return;
            if (!isOpen && selectedDate) setMonth(selectedDate);
            setIsOpen((prev) => !prev);
          }}
          onKeyDown={handleTriggerKeyDown}
          onBlur={onBlur}
        >
          <span className="truncate">{formattedValue || value || '\u00A0'}</span>
          <CalendarDays className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
        </div>

        {isOpen && (
          <>
            <div
              aria-hidden="true"
              className="fixed inset-0 z-140 cursor-default bg-transparent"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                closePicker();
              }}
            />

            <Card className="absolute z-150 mt-2 w-full min-w-full max-w-full gap-3 overflow-x-auto rounded-2xl border border-fg bg-modal-bg p-3">
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
          </>
        )}
      </div>
    );
  },
);
